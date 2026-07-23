/**
 * 直近LOOKBACK_DAYS日以内（終端=昨日）に公開された visa-{code} 全件について、
 * 同国の study-country-{code} を公開する
 * GHA publish-study-country.yml (火曜09:00) から呼び出す
 *
 * 安全策:
 *   - published_at は「昨日」を終端とする直近 LOOKBACK_DAYS 日間の範囲（.limit(1)は使わない。
 *     同日複数visa公開時の取りこぼしを防ぐため全件取得・全件処理する）
 *   - 該当 visa なし → スキップ（エラーなし）
 *   - study-country-{code} が存在しない / 既に公開済み → 個別にスキップ（MAX_PER_RUN判定には含めない）
 *   - MAX_PER_RUN は「実際に公開が必要な未公開対象件数」に対して判定する
 *     （範囲内に旧来の一括公開バッチ等が混ざっても、既に公開済みなら誤って中断しない）
 *   - 品質チェック通過しないものは個別に公開しない
 *   - DRY_RUN=true の場合は実際の公開（DB更新）を行わず、判定結果のみをログ出力する
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
const LOOKBACK_DAYS = 7; // 週次cadenceの取りこぼし・実行失敗に対する耐性（無制限のback-fillは避ける）
const MAX_PER_RUN = 10; // 実際に公開が必要な件数がこれを超えたら中断し、人手の確認を促す
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

type Actionable = {
  visaSlug: string;
  publishedAt: string;
  targetSlug: string;
  content: Record<string, string>;
};

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
  const actionable: Actionable[] = [];
  let skippedCount = 0;

  for (const v of visas) {
    const code = v.slug.replace("visa-", "");
    const targetSlug = `study-country-${code}`;

    const { data: sc } = await sb
      .from("study_blog_posts")
      .select("slug, is_published, content")
      .eq("slug", targetSlug)
      .single();

    if (!sc) {
      console.log(`  ⏭ ${v.slug} (${v.published_at}) → ${targetSlug}: 存在しない → スキップ`);
      skippedCount++;
      continue;
    }
    if (sc.is_published) {
      console.log(`  ⏭ ${v.slug} (${v.published_at}) → ${targetSlug}: 既に公開済み → スキップ`);
      skippedCount++;
      continue;
    }

    actionable.push({
      visaSlug: v.slug,
      publishedAt: v.published_at,
      targetSlug,
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

  // Phase 3: 品質チェック→公開
  let publishedCount = 0;
  let qualityFailCount = 0;

  for (const a of actionable) {
    const q = qualityOk(a.content);
    if (!q.ok) {
      console.error(`  ❌ ${a.visaSlug} (${a.publishedAt}) → ${a.targetSlug}: 品質NG (${q.reason}) → 公開中止`);
      qualityFailCount++;
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
      console.error(`  ❌ ${a.targetSlug}: 公開失敗 - ${upErr.message}`);
      qualityFailCount++;
      continue;
    }
    console.log(`  ✅ 公開: ${a.targetSlug} (visa: ${a.visaSlug}, published_at: ${a.publishedAt})`);
    publishedCount++;
  }

  console.log(`\n=== 結果 ===`);
  console.log(`✅ 公開${DRY_RUN ? "対象" : ""}: ${publishedCount}件`);
  console.log(`⏭ スキップ: ${skippedCount}件`);
  console.log(`❌ 品質NG・失敗: ${qualityFailCount}件`);

  process.exit(qualityFailCount > 0 ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
