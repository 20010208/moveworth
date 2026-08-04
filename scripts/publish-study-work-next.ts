/**
 * 直近LOOKBACK_DAYS日以内（終端=5日前）に公開された visa-{code} 全件について、
 * 同国の就労記事を公開する
 * GHA publish-study-work.yml (土曜09:00) から呼び出す
 *
 * slug 優先順位:
 *   1. study-work-{code} （旧形式）
 *   2. study-{code}（新形式）
 * この優先順位はslugの命名フォーマット違いを吸収するための正常フローであり、
 * DB障害時の代替candidate選択ではない。1番目のクエリが「正常0件」(PGRST116)以外の
 * エラーを返した場合は2番目のクエリへフォールバックせず即throwする。
 *
 * 安全策:
 *   - published_at は「5日前」を終端とする直近 LOOKBACK_DAYS 日間の範囲（.limit(1)は使わない）
 *   - 対象slugが既に公開済み/存在しない（正常0件） → 個別にスキップ（MAX_PER_RUN判定には含めない）
 *   - MAX_PER_RUN は「実際に公開が必要な未公開対象件数」に対して判定する
 *     （範囲内に旧来の一括公開バッチ等が混ざっても、既に公開済みなら誤って中断しない）
 *   - DRY_RUN=true の場合は実際の公開を行わず判定結果のみ出力
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

const LOOKBACK_DAYS = 7;
const MAX_PER_RUN = 10;
const DRY_RUN = process.env.DRY_RUN === "true";

const GH_TOKEN = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN ?? "";
const GH_REPO = process.env.GH_REPO ?? process.env.GITHUB_REPOSITORY ?? "";
const RUN_URL =
  process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : "unknown";

// 品質判定は scripts/utils/study-publication-quality.ts の validateStudyPublication に統一
// （country publisher と同一基準: title/description ja/en/zh非空 + content ja/en/zh 200字以上・
// 参考資料section・approved source一致必須）。

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

type Classification =
  | { kind: "actionable"; slug: string; title: Record<string, string>; description: Record<string, string>; content: Record<string, string> }
  | { kind: "skip" };

/** study-work-{code} を優先、なければ study-{code} をフォールバックで判定する */
async function classify(code: string): Promise<Classification> {
  const workSlug = `study-work-${code}`;
  const { data: workData, error: workErr } = await sb
    .from("study_blog_posts")
    .select("slug, is_published, title, description, content")
    .eq("slug", workSlug)
    .single();

  if (workErr && workErr.code !== "PGRST116") {
    throw new Error(`study_blog_posts取得失敗 (${workSlug}): ${workErr.message}`);
  }
  if (workData) {
    if (workData.is_published) {
      console.log(`    ⏭ ${workSlug}: 既に公開済み → スキップ`);
      return { kind: "skip" };
    }
    return {
      kind: "actionable",
      slug: workSlug,
      title: (workData.title as Record<string, string>) ?? {},
      description: (workData.description as Record<string, string>) ?? {},
      content: (workData.content as Record<string, string>) ?? {},
    };
  }

  const newSlug = `study-${code}`;
  const { data: newData, error: newErr } = await sb
    .from("study_blog_posts")
    .select("slug, is_published, title, description, content")
    .eq("slug", newSlug)
    .single();

  if (newErr && newErr.code !== "PGRST116") {
    throw new Error(`study_blog_posts取得失敗 (${newSlug}): ${newErr.message}`);
  }
  if (newData) {
    if (newData.is_published) {
      console.log(`    ⏭ ${newSlug}: 既に公開済み → スキップ`);
      return { kind: "skip" };
    }
    return {
      kind: "actionable",
      slug: newSlug,
      title: (newData.title as Record<string, string>) ?? {},
      description: (newData.description as Record<string, string>) ?? {},
      content: (newData.content as Record<string, string>) ?? {},
    };
  }

  console.log(`    ⏭ ${workSlug} / ${newSlug} いずれも存在しない → スキップ`);
  return { kind: "skip" };
}

type Actionable = {
  visaSlug: string;
  slug: string;
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
  const targetDay = new Date();
  targetDay.setDate(targetDay.getDate() - 5); // 土曜から5日前 = 月曜
  const endDate = isoDate(targetDay);

  const start = new Date(targetDay);
  start.setDate(start.getDate() - (LOOKBACK_DAYS - 1));
  const startDate = isoDate(start);

  console.log(`対象範囲: ${startDate} 〜 ${endDate}（過去${LOOKBACK_DAYS}日・終端=5日前）`);
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

  // Phase 1: 分類（study-work優先→studyフォールバック、既公開/正常不在は即スキップ。
  // query error は classify() 内で throw され、ここでは捕捉せず main() のトップレベル
  // catch まで伝播させる = system errorとしてWorkflow全体をfailさせる）
  const actionable: Actionable[] = [];
  let skippedCount = 0;

  for (const v of visas) {
    const code = v.slug.replace("visa-", "");
    console.log(`  候補 visa: ${v.slug} (${v.published_at})`);
    const result = await classify(code);
    if (result.kind === "skip") {
      skippedCount++;
      continue;
    }
    actionable.push({
      visaSlug: v.slug,
      slug: result.slug,
      countryCode: code,
      title: result.title,
      description: result.description,
      content: result.content,
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
    // approved source取得エラーは getApprovedSources 内でthrowされ、main() の
    // トップレベルcatchまで伝播し処理全体をfailさせる（system error、品質NGとは区別）。
    const approvedSources = await getApprovedSources(sb, a.countryCode);
    const q = validateStudyPublication({
      title: a.title,
      description: a.description,
      content: a.content,
      approvedSources,
    });

    if (!q.ok) {
      console.warn(`  ⚠️  ${a.visaSlug} → ${a.slug}: 品質NG (${q.reasons.join(" / ")}) → draft維持`);
      console.log(`::warning file=scripts/publish-study-work-next.ts::${a.slug}は品質チェックでブロックされました。GitHub Issueで通知します。`);
      blockedCount++;

      const candidate: BlockedCandidate = {
        slug: a.slug,
        category: "work",
        countryCode: a.countryCode,
        reasons: q.reasons,
        approvedSourceCount: approvedSources.length,
        refUrlCounts: countRefUrls(a.content),
      };

      // DRY_RUNでは実際のIssue write（create/comment）を一切行わない（Codex指摘）。
      // blocked集計とログ出力のみ行い、GH_TOKEN未設定でもsystem errorにしない。
      if (DRY_RUN) {
        console.log(`  🟡 [DRY RUN] ${a.slug}: Issueを作成する予定でした（実際には書き込みません）`);
        continue;
      }

      if (!ghCfg) {
        console.error(`  ❌ ${a.slug}: GH_TOKEN/GH_REPO未設定のためIssue通知不可 → system error`);
        systemErrorCount++;
        continue;
      }
      try {
        const result = await notifyBlockedCandidate(candidate, ghCfg, RUN_URL);
        console.log(`  📋 Issue通知(${result.action}) #${result.issueNumber}: ${a.slug}`);
      } catch (e) {
        console.error(`  ❌ ${a.slug}: Issue通知失敗（system error）: ${(e as Error).message}`);
        systemErrorCount++;
      }
      continue;
    }

    if (DRY_RUN) {
      console.log(`  🟡 [DRY RUN] ${a.visaSlug} → ${a.slug}: 公開対象（実際には公開しません）`);
      publishedCount++;
      continue;
    }

    const { error: upErr } = await sb.from("study_blog_posts").update({ is_published: true }).eq("slug", a.slug);
    if (upErr) {
      console.error(`  ❌ ${a.slug}: 公開失敗（system error） - ${upErr.message}`);
      systemErrorCount++;
      continue;
    }
    console.log(`  ✅ 公開: ${a.slug} (visa: ${a.visaSlug})`);
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
