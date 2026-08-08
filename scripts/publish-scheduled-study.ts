/**
 * study_blog_posts（study-country-{code} / study-work-{code}）のうち、
 * scheduled_publish_at に到達した予約記事を自動的に公開する。
 * GHA publish-scheduled-study.yml (毎日00:00 UTC) から呼び出す。
 *
 * candidate条件:
 *   is_published = false
 *   scheduled_publish_at IS NOT NULL
 *   scheduled_publish_at <= now()
 * sort: scheduled_publish_at ASC, slug ASC（決定的）
 *
 * scheduler運用方針 Option C（既存country/work publisherと同一思想）:
 *   品質NGのcandidateは draft維持（scheduled_publish_atも変更しない）→ GitHub Issue通知 →
 *   そのcandidateだけskip → 後続candidateは処理継続する。品質NGだけを理由に
 *   Workflow全体をfailureにしない。一方、Supabase query/update error・認証エラー・
 *   approved source取得エラー・Issue作成自体の失敗・その他インフラ/実装エラーは
 *   system error として Workflow failure（非zero exit）にする。
 *
 * 明示的manual publish（generate-country-article.ts --publish-only 等）との関係:
 *   manual publishはこのscheduled publisherとは別経路であり、scheduled_publish_atが
 *   未来でもvalidator PASSであれば管理者の明示的判断でoverride・即時公開できる
 *   （既存のmanual publish系スクリプトはscheduled_publish_atを一切参照しないため、
 *   自然にoverride可能な設計になっている）。この2経路は明確に区別すること：
 *   scheduled publisher = 「到達したものだけ」を自動処理、manual publish = 管理者の即時判断。
 *
 * 通常publisher（publish-study-country-next.ts / publish-study-work-next.ts）との関係:
 *   scheduled_publish_at が非NULLの記事は、対応visa記事のpublished_atが偶然
 *   lookback windowに入っても通常publisherからは公開されない
 *   （両スクリプト側で `scheduled_publish_at IS NULL` を候補条件に追加済み）。
 *   予約済み記事の公開は本scriptのみが担当する。
 *
 * concurrency / idempotency（Codex指摘対応）:
 *   GitHub Actions側のconcurrency groupによるWorkflow直列化に加え、DB側でも
 *   optimistic conditional update（id + is_published=false + scheduled_publish_at一致）
 *   を使い、同時実行や別経路からのpublishと衝突しても二重公開・不整合を起こさない
 *   二重防御にしている。
 *
 * published_count（GitHub Actions output）:
 *   実際にDB publishが成功した直後に都度更新・即時output書き込みする。途中で
 *   後続candidateがsystem errorになりprocessが非zero終了しても、それまでに成功した
 *   公開件数はoutputへ残る（Workflow側のdeploy判定がこれを利用できるようにするため）。
 *   DRY_RUNモードでは実DB publishが発生しないため published_count は常に0のまま。
 *   DRY_RUNでの「公開予定」件数は内部集計 wouldPublishCount のみで扱い、
 *   published_count（実際の公開件数）とは意味を混同しない。
 */
import { existsSync, readFileSync, appendFileSync } from "fs";
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

const MAX_PER_RUN = 10; // 既存country/work publisherと同じ事故防止キャップ
const DRY_RUN = process.env.DRY_RUN === "true";

const GH_TOKEN = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN ?? "";
const GH_REPO = process.env.GH_REPO ?? process.env.GITHUB_REPOSITORY ?? "";
const RUN_URL =
  process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : "unknown";

function countRefUrls(content: Record<string, string>): { ja: number; en: number; zh: number } {
  const counts = { ja: 0, en: 0, zh: 0 };
  for (const lang of ["ja", "en", "zh"] as Lang[]) {
    const section = findRefSection(content[lang] ?? "", lang);
    counts[lang] = section ? extractUrls(section.raw).length : 0;
  }
  return counts;
}

/**
 * pure helper: $GITHUB_OUTPUT が設定されていない場合（ローカル実行等）は安全にno-opする。
 * 呼び出し側は「実DB publish成功件数が変わるたびに毎回呼ぶ」契約を守ること
 * （最後に1回だけまとめて呼ぶ設計は、途中failureでoutputが失われるため禁止）。
 */
function writeGithubOutput(name: string, value: string): void {
  if (!process.env.GITHUB_OUTPUT) return;
  appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}

function writePublishedCount(count: number): void {
  writeGithubOutput("published_count", String(count));
}

async function main() {
  const now = new Date();
  const nowIso = now.toISOString();
  console.log(`予約publisher実行時刻(UTC): ${nowIso}`);
  if (DRY_RUN) console.log("*** DRY_RUN モード: 実際の公開・Issue書き込みは行いません ***");

  // 初期値として published_count=0 を即座に書き込む。以降、実publishが成功するたびに
  // 都度更新する（途中でsystem errorが起きても、直前までの成功件数がoutputへ残るように）。
  let publishedCount = 0;
  writePublishedCount(publishedCount);

  // fail-closed: query errorは throw して top-level catch まで伝播させる
  // （「候補0件（正常）」と「query失敗」を明確に分離する）。
  const { data: candidates, error } = await sb
    .from("study_blog_posts")
    .select("id, slug, category, is_published, title, description, content, scheduled_publish_at")
    .eq("is_published", false)
    .not("scheduled_publish_at", "is", null)
    .lte("scheduled_publish_at", nowIso)
    .order("scheduled_publish_at", { ascending: true })
    .order("slug", { ascending: true });

  if (error) {
    console.error("candidate取得エラー:", error.message);
    process.exit(1);
  }

  if (!candidates || candidates.length === 0) {
    console.log("予約時刻に到達したcandidateなし → スキップ");
    process.exit(0);
  }

  console.log(`候補: ${candidates.length}件`);
  for (const c of candidates) console.log(`  - ${c.slug} (scheduled_publish_at=${c.scheduled_publish_at})`);

  if (candidates.length > MAX_PER_RUN) {
    console.error(
      `❌ candidateが${candidates.length}件で想定上限(${MAX_PER_RUN}件)を超過しています。` +
      `一括処理を避けるため中断します。手動確認してください。`
    );
    process.exit(1);
  }

  let wouldPublishCount = 0; // DRY_RUNでの「公開予定」件数。published_countとは意味が異なるため分離する。
  let blockedCount = 0;
  let systemErrorCount = 0;

  const ghCfg: GhConfig | null = GH_TOKEN && GH_REPO ? { token: GH_TOKEN, repo: GH_REPO } : null;

  for (const row of candidates) {
    const m = row.slug.match(/^study-(?:country|work)-([a-z]{2,3})$/);
    if (!m) {
      console.error(`  ❌ ${row.slug}: country_codeを特定できないslug形式のため処理不可 → system error`);
      systemErrorCount++;
      continue;
    }
    const countryCode = m[1];
    const category: "country" | "work" = row.slug.startsWith("study-country-") ? "country" : "work";
    const content = (row.content as Record<string, string>) ?? {};

    // approved source取得エラーは getApprovedSources 内でthrowされ、意図的にcatchせず
    // main()のトップレベルcatchまで伝播させ、system errorとして処理全体をfailさせる。
    const approvedSources = await getApprovedSources(sb, countryCode);
    const q = validateStudyPublication({
      title: (row.title as Record<string, string>) ?? {},
      description: (row.description as Record<string, string>) ?? {},
      content,
      approvedSources,
    });

    if (!q.ok) {
      console.warn(`  ⚠️  ${row.slug}: 品質NG (${q.reasons.join(" / ")}) → draft維持（scheduled_publish_atも保持）`);
      console.log(`::warning file=scripts/publish-scheduled-study.ts::${row.slug}は予約時刻に到達しましたが品質チェックでブロックされました。GitHub Issueで通知します。`);
      blockedCount++;

      const candidate: BlockedCandidate = {
        slug: row.slug,
        category,
        countryCode,
        reasons: q.reasons,
        approvedSourceCount: approvedSources.length,
        refUrlCounts: countRefUrls(content),
      };

      // DRY_RUNでは実際のIssue write（create/comment）を一切行わない。
      if (DRY_RUN) {
        console.log(`  🟡 [DRY RUN] ${row.slug}: Issueを作成する予定でした（実際には書き込みません）`);
        continue;
      }

      if (!ghCfg) {
        console.error(`  ❌ ${row.slug}: GH_TOKEN/GH_REPO未設定のためIssue通知不可 → system error`);
        systemErrorCount++;
        continue;
      }
      try {
        const result = await notifyBlockedCandidate(candidate, ghCfg, RUN_URL);
        console.log(`  📋 Issue通知(${result.action}) #${result.issueNumber}: ${row.slug}`);
      } catch (e) {
        // Issue通知自体の失敗は品質NGとは別枠のsystem error（混同禁止）
        console.error(`  ❌ ${row.slug}: Issue通知失敗（system error）: ${(e as Error).message}`);
        systemErrorCount++;
      }
      continue;
    }

    if (DRY_RUN) {
      console.log(`  🟡 [DRY RUN] ${row.slug}: 公開対象（実際には公開しません、scheduled_publish_at=${row.scheduled_publish_at}）`);
      wouldPublishCount++;
      continue;
    }

    // optimistic conditional exact-one update（Codex指摘対応）:
    // candidate取得時点のid・is_published=false・scheduled_publish_atが全て一致した場合のみ
    // is_published=true へ更新する。取得後に別経路（手動publish・並行run等）で状態が
    // 変化していた場合は0行更新となり、安全なconcurrency conflictとして扱う
    // （公開成功として数えない。system errorにもしない＝別経路が正しく処理済みの可能性が高いため）。
    // 2行以上更新された場合はid一意制約違反に相当する異常でありsystem errorとする。
    // title/description/content/date/scheduled_publish_at/thumbnail系/category/slugは
    // いずれも変更しない。scheduled_publish_atは公開後も監査記録としてクリアせず残す
    // （is_published=trueにより本queryの対象から自然に外れる）。
    const { data: updatedRows, error: upErr } = await sb
      .from("study_blog_posts")
      .update({ is_published: true })
      .eq("id", row.id)
      .eq("is_published", false)
      .eq("scheduled_publish_at", row.scheduled_publish_at)
      .select("id");

    if (upErr) {
      console.error(`  ❌ ${row.slug}: 公開失敗（system error） - ${upErr.message}`);
      systemErrorCount++;
      continue;
    }

    const updatedCount = updatedRows?.length ?? 0;
    if (updatedCount === 0) {
      console.warn(`  ⚠️  ${row.slug}: 更新対象0件（取得後に別経路で状態変化した可能性） → concurrency conflictとしてskip（公開成功に数えない）`);
      continue;
    }
    if (updatedCount > 1) {
      console.error(`  ❌ ${row.slug}: exact-one更新契約違反（${updatedCount}行更新） → system error`);
      systemErrorCount++;
      continue;
    }

    console.log(`  ✅ 公開: ${row.slug} (scheduled_publish_at=${row.scheduled_publish_at})`);
    publishedCount++;
    writePublishedCount(publishedCount); // 実publish成功のたびに即時反映する（途中failure時も残るように）
  }

  console.log(`\n=== 結果 ===`);
  console.log(`published=${publishedCount}${DRY_RUN ? ` (DRY_RUN: would publish=${wouldPublishCount})` : ""}`);
  console.log(`blocked=${blockedCount}`);
  console.log(`errors=${systemErrorCount}`);

  // Option C: 品質NG(blocked)はfailure要因にしない。system errorが1件でもあれば非zero。
  process.exit(systemErrorCount > 0 ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
