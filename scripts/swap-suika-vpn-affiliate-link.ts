/**
 * suika-vpn-overseas-japanese-streaming-guide-2026 のアフィリエイトリンク差し替え
 * - PROTECTED_SLUGS対象だが、ユーザーの明示的許可により今回のみ実施
 * - 旧アンカー（www.suika-v2.com）→新アンカー（A8正規計測リンク、素材ID:014）に全箇所置換
 * - 各言語本文末尾にトラッキングピクセルを1回追加
 * - href・imgのsrcは一字一句変更しない。他のフィールド・本文の他部分は変更しない
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { assertBlogPayload } from "./utils/validate-blog-payload";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const SLUG = "suika-vpn-overseas-japanese-streaming-guide-2026";

const OLD_ANCHOR = `<a href="https://www.suika-v2.com/?im=tu6" style="font-size:16px;font-weight:bold;color:#0070f3;">スイカVPN公式サイトはこちら</a>`;
const NEW_ANCHOR = `<a href="https://px.a8.net/svt/ejp?a8mat=4B82L1+AINPIQ+4R3G+61C2Q" rel="nofollow">海外から日本の動画が見れる【スイカVPN】</a>`;
const TRACKING_PIXEL = `<img border="0" width="1" height="1" src="https://www14.a8.net/0.gif?a8mat=4B82L1+AINPIQ+4R3G+61C2Q" alt="">`;
const PIXEL_BLOCK = `\n\n<!-- html -->\n${TRACKING_PIXEL}\n<!-- /html -->`;

function computeExpected(before: string): string {
  const occurrences = before.split(OLD_ANCHOR).length - 1;
  if (occurrences !== 2) {
    throw new Error(`旧アンカーの出現回数が想定(2)と異なります: ${occurrences}`);
  }
  const replaced = before.split(OLD_ANCHOR).join(NEW_ANCHOR);
  return `${replaced}${PIXEL_BLOCK}`;
}

async function main() {
  const { data: before, error: beforeErr } = await sb
    .from("blog_posts")
    .select("slug, is_published, title, description, content")
    .eq("slug", SLUG)
    .single();
  if (beforeErr || !before) throw new Error(`取得失敗: ${beforeErr?.message}`);

  const beforeContent = before.content as Record<string, string>;
  const newContent: Record<string, string> = {};

  for (const lang of ["ja", "en", "zh"] as const) {
    newContent[lang] = computeExpected(beforeContent[lang]);
  }

  assertBlogPayload({ title: before.title, description: before.description, content: newContent, locales: ["ja", "en", "zh"] }, SLUG);

  const { error: updateErr } = await sb.from("blog_posts").update({ content: newContent }).eq("slug", SLUG);
  if (updateErr) throw new Error(`更新失敗: ${updateErr.message}`);

  const { data: after, error: afterErr } = await sb
    .from("blog_posts")
    .select("slug, is_published, title, description, content")
    .eq("slug", SLUG)
    .single();
  if (afterErr || !after) throw new Error(`更新後取得失敗: ${afterErr?.message}`);

  if (after.is_published !== before.is_published) throw new Error("is_publishedが変化しています");
  if (JSON.stringify(after.title) !== JSON.stringify(before.title)) throw new Error("titleが変化しています");
  if (JSON.stringify(after.description) !== JSON.stringify(before.description)) throw new Error("descriptionが変化しています");

  const afterContent = after.content as Record<string, string>;
  for (const lang of ["ja", "en", "zh"] as const) {
    if (afterContent[lang] !== newContent[lang]) {
      throw new Error(`[${lang}] DB上のcontentが計算した期待値と一致しません（意図しない変化の可能性）`);
    }
    // 新アンカーの出現回数確認
    const newCount = afterContent[lang].split(NEW_ANCHOR).length - 1;
    if (newCount !== 2) throw new Error(`[${lang}] 新アンカーの出現回数が想定外: ${newCount}`);
    // 旧アンカー(href)が完全に消えていることを確認
    if (afterContent[lang].includes("suika-v2.com")) throw new Error(`[${lang}] 旧hrefが残っています`);
    // トラッキングピクセルが1回だけ存在
    const pixelCount = afterContent[lang].split(TRACKING_PIXEL).length - 1;
    if (pixelCount !== 1) throw new Error(`[${lang}] トラッキングピクセルの出現回数が想定外: ${pixelCount}`);
  }

  console.log("✅ is_published / title / description 不変を確認");
  console.log("✅ 全言語で新アンカー2箇所・トラッキングピクセル1箇所を確認、旧href残存なし\n");

  for (const lang of ["ja", "en", "zh"] as const) {
    console.log(`[${lang}] 文字数: ${beforeContent[lang].length}字 → ${afterContent[lang].length}字`);
  }

  console.log("\n=== 差し替え後のhref/src抽出 ===");
  for (const lang of ["ja", "en", "zh"] as const) {
    const hrefs = [...afterContent[lang].matchAll(/<a\s+href="([^"]+)"/g)].map((m) => m[1]);
    const srcs = [...afterContent[lang].matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]);
    console.log(`[${lang}] href:`, hrefs);
    console.log(`[${lang}] img src:`, srcs);
  }
}

main().catch((e) => {
  console.error("❌", e.message ?? e);
  process.exit(1);
});
