/**
 * mets-virtual-office-overseas-japanese-guide-2026 の修正1・2
 * 1. 郵便表現の強化（「受取不可の場合があります」→「受取できません」等、全言語）
 * 2. EN/ZHのCTAリンクラベルを各言語へ翻訳（hrefは変更しない）
 * is_publishedは変更しない。
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
const SLUG = "mets-virtual-office-overseas-japanese-guide-2026";
const AFFILIATE_HREF = "https://px.a8.net/svt/ejp?a8mat=4B8110+A4E2A+50NC+61C2Q";
const PIXEL_SRC = "https://www15.a8.net/0.gif?a8mat=4B8110+A4E2A+50NC+61C2Q";
const OLD_LABEL = "都心格安のバーチャルオフィス【METSバーチャルオフィス】";
const EN_LABEL = "Click here for the METS Virtual Office official website";
const ZH_LABEL = "点击这里前往METS虚拟办公室官方网站";

function replaceExact(text: string, from: string, to: string, expectedCount: number, label: string): string {
  const count = text.split(from).length - 1;
  if (count !== expectedCount) {
    throw new Error(`[${label}] 置換対象の出現回数が想定(${expectedCount})と異なります: ${count}件\n対象: ${from.slice(0, 60)}...`);
  }
  return text.split(from).join(to);
}

function applyJaFixes(ja: string): string {
  // 修正1のみ（ラベルは日本語のまま変更しない）
  return replaceExact(ja, "受取不可の場合があります", "受取できません", 1, "ja/mail-strength");
}

function applyEnFixes(en: string): string {
  let text = en;
  text = replaceExact(text, "may not be accepted", "cannot be accepted", 1, "en/mail-strength");
  text = replaceExact(text, OLD_LABEL, EN_LABEL, 2, "en/cta-label");
  return text;
}

function applyZhFixes(zh: string): string {
  let text = zh;
  text = replaceExact(text, "可能无法代收", "无法代收", 1, "zh/mail-strength");
  text = replaceExact(text, OLD_LABEL, ZH_LABEL, 2, "zh/cta-label");
  return text;
}

function validate(label: string, text: string) {
  const hrefCount = text.split(AFFILIATE_HREF).length - 1;
  if (hrefCount < 2) throw new Error(`[${label}] アフィリエイトhrefの出現回数が想定未満 (${hrefCount}回)`);
  const pixelCount = text.split(PIXEL_SRC).length - 1;
  if (pixelCount !== 1) throw new Error(`[${label}] トラッキングピクセルの出現回数が想定外 (${pixelCount}回)`);
}

function stripTags(text: string): string {
  return text.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, "").trim();
}

async function main() {
  const { data: before, error: beforeErr } = await sb
    .from("blog_posts")
    .select("slug, is_published, title, description, content, category, is_promotion, locales, pinned")
    .eq("slug", SLUG)
    .single();
  if (beforeErr || !before) throw new Error(`取得失敗: ${beforeErr?.message}`);
  if (before.is_published !== false) throw new Error(`is_publishedがfalseではありません: ${before.is_published}`);

  const beforeContent = before.content as Record<string, string>;

  const newContent = {
    ja: applyJaFixes(beforeContent.ja),
    en: applyEnFixes(beforeContent.en),
    zh: applyZhFixes(beforeContent.zh),
  };

  for (const [lang, text] of Object.entries(newContent)) validate(lang, text);

  const jaStripped = stripTags(newContent.ja).length;
  console.log(`JA タグ除去後: ${jaStripped}字`);

  assertBlogPayload(
    { title: before.title, description: before.description, content: newContent, locales: ["ja", "en", "zh"] },
    SLUG
  );

  const { error: updateErr } = await sb.from("blog_posts").update({ content: newContent }).eq("slug", SLUG);
  if (updateErr) throw new Error(`更新失敗: ${updateErr.message}`);

  const { data: after, error: afterErr } = await sb
    .from("blog_posts")
    .select("slug, is_published, title, description, content, category, is_promotion, locales, pinned")
    .eq("slug", SLUG)
    .single();
  if (afterErr || !after) throw new Error(`更新後取得失敗: ${afterErr?.message}`);

  if (after.is_published !== before.is_published) throw new Error("is_publishedが変化しています");
  if (JSON.stringify(after.title) !== JSON.stringify(before.title)) throw new Error("titleが変化しています");
  if (JSON.stringify(after.description) !== JSON.stringify(before.description)) throw new Error("descriptionが変化しています");
  if (after.category !== before.category) throw new Error("categoryが変化しています");
  if (after.is_promotion !== before.is_promotion) throw new Error("is_promotionが変化しています");
  if (JSON.stringify(after.locales) !== JSON.stringify(before.locales)) throw new Error("localesが変化しています");
  if (after.pinned !== before.pinned) throw new Error("pinnedが変化しています");

  console.log("✅ is_published/title/description/category/is_promotion/locales/pinned 不変を確認:", after.is_published);

  console.log("\n=== 修正後のhref/src・CTAラベル抽出 ===");
  const afterContent = after.content as Record<string, string>;
  for (const lang of ["ja", "en", "zh"] as const) {
    const anchors = [...afterContent[lang].matchAll(/<a\s+href="([^"]+)"[^>]*>([^<]*)<\/a>/g)].map((m) => ({ href: m[1], label: m[2] }));
    const srcs = [...afterContent[lang].matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]);
    console.log(`[${lang}] anchors:`, anchors);
    console.log(`[${lang}] img src:`, srcs);
  }
}

main().catch((e) => {
  console.error("❌", e.message ?? e);
  process.exit(1);
});
