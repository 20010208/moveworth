/**
 * 直近LOOKBACK_DAYS日以内（終端=5日前）に公開された visa-{code} 全件について、
 * 同国の就労記事を公開する
 * GHA publish-study-work.yml (土曜09:00) から呼び出す
 *
 * slug 優先順位:
 *   1. study-work-{code} （旧形式）
 *   2. study-{code}（新形式）
 *
 * 安全策:
 *   - published_at は「5日前」を終端とする直近 LOOKBACK_DAYS 日間の範囲（.limit(1)は使わない）
 *   - 対象slugが既に公開済み/存在しない → 個別にスキップ（MAX_PER_RUN判定には含めない）
 *   - MAX_PER_RUN は「実際に公開が必要な未公開対象件数」に対して判定する
 *     （範囲内に旧来の一括公開バッチ等が混ざっても、既に公開済みなら誤って中断しない）
 *   - 品質チェック通過しないものは個別に公開しない
 *   - DRY_RUN=true の場合は実際の公開を行わず判定結果のみ出力
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

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

const REFUSAL = ["申し訳ありません", "I cannot", "I'm sorry", "As an AI", "I'm unable"];
const LOOKBACK_DAYS = 7;
const MAX_PER_RUN = 10;
const DRY_RUN = process.env.DRY_RUN === "true";

function qualityOk(content: Record<string, string>): { ok: boolean; reason?: string } {
  const ja = content.ja ?? "";
  const en = content.en ?? "";
  if (ja.length < 200) return { ok: false, reason: `content.ja 短すぎ (${ja.length}文字)` };
  if (en.length < 200) return { ok: false, reason: `content.en 短すぎ (${en.length}文字)` };
  if (ja.includes("example.com") || en.includes("example.com"))
    return { ok: false, reason: "example.com 混入" };
  for (const p of REFUSAL)
    if (ja.includes(p) || en.includes(p))
      return { ok: false, reason: `GPT拒否パターン: "${p}"` };
  return { ok: true };
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

type Classification =
  | { kind: "actionable"; slug: string; content: Record<string, string> }
  | { kind: "skip" };

/** study-work-{code} を優先、なければ study-{code} をフォールバックで判定する */
async function classify(code: string): Promise<Classification> {
  const workSlug = `study-work-${code}`;
  const { data: workData } = await sb
    .from("study_blog_posts")
    .select("slug, is_published, content")
    .eq("slug", workSlug)
    .single();

  if (workData) {
    if (workData.is_published) {
      console.log(`    ⏭ ${workSlug}: 既に公開済み → スキップ`);
      return { kind: "skip" };
    }
    return { kind: "actionable", slug: workSlug, content: (workData.content as Record<string, string>) ?? {} };
  }

  const newSlug = `study-${code}`;
  const { data: newData } = await sb
    .from("study_blog_posts")
    .select("slug, is_published, content")
    .eq("slug", newSlug)
    .single();

  if (newData) {
    if (newData.is_published) {
      console.log(`    ⏭ ${newSlug}: 既に公開済み → スキップ`);
      return { kind: "skip" };
    }
    return { kind: "actionable", slug: newSlug, content: (newData.content as Record<string, string>) ?? {} };
  }

  console.log(`    ⏭ ${workSlug} / ${newSlug} いずれも存在しない → スキップ`);
  return { kind: "skip" };
}

type Actionable = { visaSlug: string; slug: string; content: Record<string, string> };

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

  // Phase 1: 分類（study-work優先→studyフォールバック、既公開/不在は即スキップ）
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
    actionable.push({ visaSlug: v.slug, slug: result.slug, content: result.content });
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

  // Phase 3: 品質チェック→公開
  let publishedCount = 0;
  let qualityFailCount = 0;

  for (const a of actionable) {
    const q = qualityOk(a.content);
    if (!q.ok) {
      console.error(`  ❌ ${a.visaSlug} → ${a.slug}: 品質NG (${q.reason}) → 公開中止`);
      qualityFailCount++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`  🟡 [DRY RUN] ${a.visaSlug} → ${a.slug}: 公開対象（実際には公開しません）`);
      publishedCount++;
      continue;
    }

    const { error: upErr } = await sb.from("study_blog_posts").update({ is_published: true }).eq("slug", a.slug);
    if (upErr) {
      console.error(`  ❌ ${a.slug}: 公開失敗 - ${upErr.message}`);
      qualityFailCount++;
      continue;
    }
    console.log(`  ✅ 公開: ${a.slug} (visa: ${a.visaSlug})`);
    publishedCount++;
  }

  console.log(`\n=== 結果 ===`);
  console.log(`✅ 公開${DRY_RUN ? "対象" : ""}: ${publishedCount}件`);
  console.log(`⏭ スキップ: ${skippedCount}件`);
  console.log(`❌ 品質NG・失敗: ${qualityFailCount}件`);

  process.exit(qualityFailCount > 0 ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
