/**
 * 直近LOOKBACK_DAYS日以内（終端=昨日）に公開された visa-{code} 全件について、
 * 同国の study-country-{code} を公開する
 * GHA publish-study-country.yml (火曜09:00) から呼び出す
 *
 * 安全策:
 *   - published_at は「昨日」を終端とする直近 LOOKBACK_DAYS 日間の範囲（.limit(1)は使わない。
 *     同日複数visa公開時の取りこぼしを防ぐため全件取得・全件処理する）
 *   - 該当 visa なし → スキップ（エラーなし）
 *   - study-country-{code} が存在しない（正常0件） → 個別にスキップ（MAX_PER_RUN判定には含めない）
 *   - study-country-{code} が既に公開済み → 個別にスキップ（MAX_PER_RUN判定には含めない）
 *   - MAX_PER_RUN は「実際に公開が必要な未公開対象件数」に対して判定する
 *     （範囲内に旧来の一括公開バッチ等が混ざっても、既に公開済みなら誤って中断しない）
 *   - DRY_RUN=true の場合は実際の公開（DB更新）を行わず、判定結果のみをログ出力する
 *
 * scheduler運用方針 Option C（PM指示）:
 *   品質NGのcandidateは draft維持 → GitHub Issue通知 → そのcandidateだけskip →
 *   後続candidateは処理継続する。品質NGだけを理由にWorkflow全体をfailureにしない。
 *   一方、Supabase query/update error・認証エラー・approved source取得エラー・
 *   Issue作成自体の失敗・その他インフラ/実装エラーは system error として
 *   Workflow failure（非zero exit）にする。
 *   正常なcandidateを1件以上公開できていれば、他candidateが品質NGでも
 *   publisher process自体はsuccessとし、後続のdeployをブロックしない。
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import {
  getApprovedSources,
  validateStudyPublication,
  findRefSection,
  extractUrls,
  type Lang,
} from "./utils/study-publication-quality";
import { notifyBlockedCandidate, type BlockedCandidate } from "./utils/study-publish-issue";
import type { GhConfig } from "./utils/github-issue-dedup";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = t.slice(eq + 1).trim();
  }
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const LOOKBACK_DAYS = 7; // 週次cadenceの取りこぼし・実行失敗に対する耐性（無制限のback-fillは避ける）
const MAX_PER_RUN = 10; // 実際に公開が必要な件数がこれを超えたら中断し、人手の確認を促す
const DRY_RUN = process.env.DRY_RUN === "true";

const GH_TOKEN = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN ?? "";
const GH_REPO = process.env.GH_REPO ?? process.env.GITHUB_REPOSITORY ?? "";
const RUN_URL =
  process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : "unknown";

// 品質判定は scripts/utils/study-publication-quality.ts の validateStudyPublication に統一。
// approved source（country_sources: purpose IN ('study','visa'), status='alive')との
// normalized URL一致を要求するため、単なる外部URL（Wikipedia・民間ブログ等）はPASSしない。
// title/description のja/en/zh非空も併せて要求する（Codex指摘: metadata zh欠落）。
// approved source自体のDBエラーは getApprovedSources 側でthrowされ、
// この関数を呼ぶ側（呼び出しループ）でsystem errorとして扱う（「0件」と「query error」を区別する）。

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

type Actionable = {
  visaSlug: string;
  publishedAt: string;
  targetSlug: string;
  countryCode: string;
  title: Record<string, string>;
  description: Record<string, string>;
  content: Record<string, string>;
};

function countRefUrls(content: Record<string, string>): { ja: number; en: number; zh: number } {
  const counts = { ja: 0, en: 0, zh: 0 };
  for (const lang of ["ja", "en", "zh"] as Lang[]) {
    const section = findRefSection(content[lang] ?? "", lang);
    counts[lang] = section ? extractUrls(section.raw).length : 0;
  }
  return counts;
}

async function main() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const endDate = isoDate(yesterday);

  const start = new Date(yesterday);
  start.setDate(start.getDate() - (LOOKBACK_DAYS - 1));
  const startDate = isoDate(start);

  console.log(`対象範囲: ${startDate} 〜 ${endDate}（過去${LOOKBACK_DAYS}日・終端=昨日）`);
  if (DRY_RUN) console.log("*** DRY_RUN モード: 実際の公開は行いません ***");

  const { data: visas, error } = await sb
    .from("blog_posts")
    .select("slug, published_at")
    .like("slug", "visa-%")
    .eq("is_published", true)
    .gte("published_at", startDate)
    .lte("published_at", endDate)
    .order("published_at", { ascending: true });

  if (error) { console.error("visa取得エラー:", error.message); process.exit(1); }
  if (!visas || visas.length === 0) {
    console.log(`⏭ ${startDate}〜${endDate} に公開された visa なし → スキップ`);
    process.exit(0);
  }

  console.log(`候補 visa: ${visas.length}件`);

  // Phase 1: 分類（存在しない/既公開は即スキップ、それ以外はアクション対象へ）
  // 「正常0件（PGRST116）」と「query error」を明確に分離する。query errorはthrowし、
  // 代替candidate選択・fallbackは一切行わない（Codex指摘 High: publisher candidate select error）。
  const actionable: Actionable[] = [];
  let skippedCount = 0;

  for (const v of visas) {
    const code = v.slug.replace("visa-", "");
    const targetSlug = `study-country-${code}`;

    const { data: sc, error: scErr } = await sb
      .from("study_blog_posts")
      .select("slug, is_published, title, description, content, scheduled_publish_at")
      .eq("slug", targetSlug)
      .single();

    if (scErr) {
      if (scErr.code === "PGRST116") {
        console.log(`  ⏭ ${v.slug} (${v.published_at}) → ${targetSlug}: 存在しない → スキップ`);
        skippedCount++;
        continue;
      }
      throw new Error(`study_blog_posts取得失敗 (${targetSlug}): ${scErr.message}`);
    }
    if (!sc) {
      throw new Error(`study_blog_posts取得で予期しない空応答 (${targetSlug})`);
    }
    if (sc.is_published) {
      console.log(`  ⏭ ${v.slug} (${v.published_at}) → ${targetSlug}: 既に公開済み → スキップ`);
      skippedCount++;
      continue;
    }
    // scheduled_publish_atが設定されている記事は publish-scheduled-study.ts の専管対象。
    // 対応visa記事のpublished_atが偶然このlookback windowに入っても、予定日時前に
    // 通常publisherから誤って公開してしまう事故を防ぐため、ここでは一律スキップする。
    if (sc.scheduled_publish_at !== null) {
      console.log(`  ⏭ ${v.slug} (${v.published_at}) → ${targetSlug}: 予約publisher管理下（scheduled_publish_at=${sc.scheduled_publish_at}） → 通常publisher対象外`);
      skippedCount++;
      continue;
    }

    actionable.push({
      visaSlug: v.slug,
      publishedAt: v.published_at,
      targetSlug,
      countryCode: code,
      title: (sc.title as Record<string, string>) ?? {},
      description: (sc.description as Record<string, string>) ?? {},
      content: (sc.content as Record<string, string>) ?? {},
    });
  }

  console.log(`アクション対象（未公開かつ存在）: ${actionable.length}件 / スキップ: ${skippedCount}件`);

  // Phase 2: キャップ判定（アクション対象件数のみで判定）
  if (actionable.length > MAX_PER_RUN) {
    console.error(
      `❌ アクション対象が${actionable.length}件で想定上限(${MAX_PER_RUN}件)を超過しています。` +
      `一括処理を避けるため中断します。手動確認してください。`
    );
    process.exit(1);
  }

  // Phase 3: 品質チェック→公開（Option C: 品質NGはIssue通知してskip、processはfailureにしない）
  let publishedCount = 0;
  let blockedCount = 0;
  let systemErrorCount = 0;

  const ghCfg: GhConfig | null = GH_TOKEN && GH_REPO ? { token: GH_TOKEN, repo: GH_REPO } : null;

  for (const a of actionable) {
    // approved source取得エラーはgetApprovedSources内でthrowされる。ここでは意図的にcatchせず
    // main()のトップレベルcatchまで伝播させ、system errorとして処理全体をfailさせる
    // （Option Cは「品質NG」にのみ適用され、DB/APIエラーには適用しない）。
    const approvedSources = await getApprovedSources(sb, a.countryCode);
    const q = validateStudyPublication({
      title: a.title,
      description: a.description,
      content: a.content,
      approvedSources,
    });

    if (!q.ok) {
      console.warn(`  ⚠️  ${a.visaSlug} (${a.publishedAt}) → ${a.targetSlug}: 品質NG (${q.reasons.join(" / ")}) → draft維持`);
      console.log(`::warning file=scripts/publish-study-country-next.ts::${a.targetSlug}は品質チェックでブロックされました。GitHub Issueで通知します。`);
      blockedCount++;

      const candidate: BlockedCandidate = {
        slug: a.targetSlug,
        category: "country",
        countryCode: a.countryCode,
        reasons: q.reasons,
        approvedSourceCount: approvedSources.length,
        refUrlCounts: countRefUrls(a.content),
      };

      // DRY_RUNでは実際のIssue write（create/comment）を一切行わない（Codex指摘）。
      // blocked集計とログ出力のみ行い、GH_TOKEN未設定でもsystem errorにしない。
      if (DRY_RUN) {
        console.log(`  🟡 [DRY RUN] ${a.targetSlug}: Issueを作成する予定でした（実際には書き込みません）`);
        continue;
      }

      if (!ghCfg) {
        console.error(`  ❌ ${a.targetSlug}: GH_TOKEN/GH_REPO未設定のためIssue通知不可 → system error`);
        systemErrorCount++;
        continue;
      }
      try {
        const result = await notifyBlockedCandidate(candidate, ghCfg, RUN_URL);
        console.log(`  📋 Issue通知(${result.action}) #${result.issueNumber}: ${a.targetSlug}`);
      } catch (e) {
        // Issue通知自体の失敗は品質NGとは別枠のsystem error（Codex指摘: 混同禁止）
        console.error(`  ❌ ${a.targetSlug}: Issue通知失敗（system error）: ${(e as Error).message}`);
        systemErrorCount++;
      }
      continue;
    }

    if (DRY_RUN) {
      console.log(`  🟡 [DRY RUN] ${a.visaSlug} (${a.publishedAt}) → ${a.targetSlug}: 公開対象（実際には公開しません）`);
      publishedCount++;
      continue;
    }

    const { error: upErr } = await sb
      .from("study_blog_posts")
      .update({ is_published: true })
      .eq("slug", a.targetSlug);

    if (upErr) {
      console.error(`  ❌ ${a.targetSlug}: 公開失敗（system error） - ${upErr.message}`);
      systemErrorCount++;
      continue;
    }
    console.log(`  ✅ 公開: ${a.targetSlug} (visa: ${a.visaSlug}, published_at: ${a.publishedAt})`);
    publishedCount++;
  }

  console.log(`\n=== 結果 ===`);
  console.log(`published=${publishedCount}`);
  console.log(`blocked=${blockedCount}`);
  console.log(`errors=${systemErrorCount}`);
  console.log(`⏭ スキップ（既存対象外）: ${skippedCount}件`);

  // Option C: 品質NG(blocked)はfailure要因にしない。system errorが1件でもあれば非zero。
  process.exit(systemErrorCount > 0 ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
