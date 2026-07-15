/**
 * greece-residency-visa-cost-2026-v2 の申請費用テーブルを修正する
 * 「ゴールデンビザ申請手数料 €16」→ 正確な位置づけに変更
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

const SLUG = "greece-residency-visa-cost-2026-v2";

// 変更前後（JA）
const OLD_TABLE_JA = `| 項目 | 費用 |
|------|------|
| ゴールデンビザ申請手数料 | €16 |
| デジタルノマドビザ申請手数料 | 公式サイトで確認 |
| D型長期滞在ビザ申請手数料 | 公式サイトで確認 |`;

const NEW_TABLE_JA = `| 項目 | 費用 |
|------|------|
| 電子居住許可証（residence permit card）証紙代 | €16 |
| ゴールデンビザ申請全体の費用（弁護士費用・行政手数料等） | 申請内容により異なるため個別に確認が必要 |
| デジタルノマドビザ申請手数料 | 公式サイトまたは大使館でご確認ください |
| D型長期滞在ビザ申請手数料 | 公式サイトまたは大使館でご確認ください |`;

async function main() {
  const { data, error } = await sb
    .from("blog_posts")
    .select("content")
    .eq("slug", SLUG)
    .single();

  if (error || !data) { console.error("取得失敗:", error?.message); process.exit(1); }

  const content = data.content as Record<string, string>;
  const ja = content.ja ?? "";

  if (!ja.includes(OLD_TABLE_JA)) {
    console.error("❌ 修正対象の文字列が見つかりません（既に修正済みか確認してください）");
    console.log("--- 現在の申請費用セクション周辺 ---");
    const idx = ja.indexOf("申請費用");
    if (idx >= 0) console.log(ja.slice(idx, idx + 400));
    process.exit(1);
  }

  const newJa = ja.replace(OLD_TABLE_JA, NEW_TABLE_JA);

  const { error: updateErr } = await sb
    .from("blog_posts")
    .update({ content: { ...content, ja: newJa } })
    .eq("slug", SLUG);

  if (updateErr) { console.error("更新失敗:", updateErr.message); process.exit(1); }

  // 検証：修正後の費用セクションを表示
  const { data: verify } = await sb
    .from("blog_posts")
    .select("content")
    .eq("slug", SLUG)
    .single();

  const vJa = (verify?.content as Record<string, string>)?.ja ?? "";
  const idx = vJa.indexOf("申請費用");
  console.log("✅ 修正完了。費用セクション（修正後）:");
  console.log("─".repeat(60));
  console.log(vJa.slice(idx, idx + 500));
}

main().catch(e => { console.error(e); process.exit(1); });
