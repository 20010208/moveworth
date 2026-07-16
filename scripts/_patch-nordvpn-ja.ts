/**
 * nordvpn-overseas-japanese-guide-2026 JA本文の拒否テキストのみ削除
 * アフィリエイトリンク・料金記述には一切触れない
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const SLUG = "nordvpn-overseas-japanese-guide-2026";

// 削除対象: 拒否テキスト + その後の\n\n（参考資料セクション前の空行が1つ残るようにする）
const REFUSAL_WITH_NL =
  "申し訳ありませんが、実在する正確なURLを提供することはできません。しかし、参考となる機関やウェブサイトを以下に示しますので、それらの公式サイトを訪れてURLを確認してください。\n\n";

async function main() {
  const { data } = await sb
    .from("blog_posts")
    .select("content")
    .eq("slug", SLUG)
    .single();
  if (!data) { console.error("not found"); process.exit(1); }

  const content = data.content as Record<string, string>;
  const jaOrig = content.ja ?? "";

  if (!jaOrig.includes(REFUSAL_WITH_NL)) {
    console.error("❌ 削除対象テキストが見つかりません（既に修正済みか、テキストが変わった可能性）");
    process.exit(1);
  }

  const jaFixed = jaOrig.replace(REFUSAL_WITH_NL, "");

  // アフィリエイトURLが保持されているか確認
  const AFFILIATE_URL = "https://px.a8.net/svt/ejp?a8mat=4AXL4B+23M2LU+3YFI+66OZ6";
  if (!jaFixed.includes(AFFILIATE_URL)) {
    console.error("❌ アフィリエイトURLが消えています！処理を中断します");
    process.exit(1);
  }

  console.log(`修正前の文字数: ${jaOrig.length}`);
  console.log(`修正後の文字数: ${jaFixed.length}`);
  console.log(`削除文字数: ${jaOrig.length - jaFixed.length}`);

  // 修正前後の該当箇所を表示（レビュー用）
  const AFFILIATE_MARKER = `](${AFFILIATE_URL})`;
  const idx = jaFixed.indexOf(AFFILIATE_MARKER);
  console.log("\n=== 修正後の該当箇所（アフィリエイトリンク〜参考資料セクション）===");
  console.log(jaFixed.slice(Math.max(0, idx - 20), idx + AFFILIATE_MARKER.length + 100));

  // DB更新（JA のみ、他言語は変更しない）
  const newContent = { ...content, ja: jaFixed };
  const { error } = await sb
    .from("blog_posts")
    .update({ content: newContent })
    .eq("slug", SLUG);

  if (error) {
    console.error("❌ DB更新エラー:", error.message);
    process.exit(1);
  }

  console.log("\n✅ DB更新成功");
  console.log("アフィリエイトURL保持: ✅");
}
main().catch(e => { console.error(e); process.exit(1); });
