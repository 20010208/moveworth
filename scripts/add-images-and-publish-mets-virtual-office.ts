/**
 * mets-virtual-office-overseas-japanese-guide-2026 への画像追加＋公開
 * 1. Storage上の既存画像3枚を prepareCompressedThumbnail で圧縮
 * 2. 指定位置へMarkdown画像を挿入（title/description/is_published等は変更しない）
 * 3. content更新後にis_publishedをfalse→trueへターゲットパッチ（再生成なし）
 */
import { existsSync, readFileSync, writeFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { prepareCompressedThumbnail } from "./utils/compress-thumbnail";
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
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SLUG = "mets-virtual-office-overseas-japanese-guide-2026";
const AFFILIATE_HREF = "https://px.a8.net/svt/ejp?a8mat=4B8110+A4E2A+50NC+61C2Q";
const PIXEL_SRC = "https://www15.a8.net/0.gif?a8mat=4B8110+A4E2A+50NC+61C2Q";

const IMAGES = {
  features: "Mets-Virtual-Office/mets-features.png",
  pricing: "Mets-Virtual-Office/mets-plan-pricing.png",
  comparison: "Mets-Virtual-Office/mets-plan-comparison.png",
};

const HEADINGS = {
  ja: { intro: "## METSバーチャルオフィスとは", plan: "## プラン別の特徴と料金" },
  en: { intro: "## What is METS Virtual Office?", plan: "## Plans and pricing" },
  zh: { intro: "## 什么是METS虚拟办公室？", plan: "## 各套餐的特点与价格" },
};

const ALT = {
  features: { ja: "METSバーチャルオフィスの他社との違い", en: "Differences between METS Virtual Office and other providers", zh: "METS虚拟办公室与其他服务的区别" },
  pricing: { ja: "METSバーチャルオフィスのプラン料金一覧", en: "METS Virtual Office plan pricing", zh: "METS虚拟办公室套餐价格一览" },
  comparison: { ja: "METSバーチャルオフィスのプラン比較表", en: "METS Virtual Office plan comparison", zh: "METS虚拟办公室套餐比较表" },
};

function replaceExact(text: string, from: string, to: string, expectedCount: number, label: string): string {
  const count = text.split(from).length - 1;
  if (count !== expectedCount) {
    throw new Error(`[${label}] 出現回数が想定(${expectedCount})と異なります: ${count}件`);
  }
  return text.split(from).join(to);
}

function insertImages(
  lang: "ja" | "en" | "zh",
  text: string,
  featuresUrl: string,
  pricingUrl: string,
  comparisonUrl: string
): string {
  const h = HEADINGS[lang];
  let result = text;

  // features画像: 導入部のアフィリエイトリンク直後 = "## METSバーチャルオフィスとは"系見出しの直前
  const featuresImg = `![${ALT.features[lang]}](${featuresUrl})`;
  result = replaceExact(result, h.intro, `${featuresImg}\n\n${h.intro}`, 1, `${lang}/features-anchor`);

  // pricing + comparison画像: 「プラン別の特徴と料金」系見出しの直後（冒頭）
  const pricingImg = `![${ALT.pricing[lang]}](${pricingUrl})`;
  const comparisonImg = `![${ALT.comparison[lang]}](${comparisonUrl})`;
  result = replaceExact(result, h.plan, `${h.plan}\n\n${pricingImg}\n\n${comparisonImg}`, 1, `${lang}/plan-anchor`);

  return result;
}

async function main() {
  console.log("=== 画像圧縮・アップロード ===");
  const featuresResult = await prepareCompressedThumbnail(sb, IMAGES.features, SUPABASE_URL);
  console.log(`  ${IMAGES.features}: ${Math.round(featuresResult.sizeBefore / 1024)}KB → ${Math.round(featuresResult.sizeAfter / 1024)}KB`);
  const pricingResult = await prepareCompressedThumbnail(sb, IMAGES.pricing, SUPABASE_URL);
  console.log(`  ${IMAGES.pricing}: ${Math.round(pricingResult.sizeBefore / 1024)}KB → ${Math.round(pricingResult.sizeAfter / 1024)}KB`);
  const comparisonResult = await prepareCompressedThumbnail(sb, IMAGES.comparison, SUPABASE_URL);
  console.log(`  ${IMAGES.comparison}: ${Math.round(comparisonResult.sizeBefore / 1024)}KB → ${Math.round(comparisonResult.sizeAfter / 1024)}KB`);

  // ─── Step 1: 画像挿入 ───────────────────────────────────────────────
  const { data: before, error: beforeErr } = await sb
    .from("blog_posts")
    .select("slug, is_published, title, description, content, category, is_promotion, locales, pinned, thumbnail")
    .eq("slug", SLUG)
    .single();
  if (beforeErr || !before) throw new Error(`取得失敗: ${beforeErr?.message}`);
  if (before.is_published !== false) throw new Error(`is_publishedがfalseではありません: ${before.is_published}`);

  const beforeContent = before.content as Record<string, string>;
  const newContent = {
    ja: insertImages("ja", beforeContent.ja, featuresResult.url, pricingResult.url, comparisonResult.url),
    en: insertImages("en", beforeContent.en, featuresResult.url, pricingResult.url, comparisonResult.url),
    zh: insertImages("zh", beforeContent.zh, featuresResult.url, pricingResult.url, comparisonResult.url),
  };

  for (const [lang, text] of Object.entries(newContent)) {
    const hrefCount = text.split(AFFILIATE_HREF).length - 1;
    if (hrefCount < 2) throw new Error(`[${lang}] アフィリエイトhref出現回数が想定未満 (${hrefCount})`);
    const pixelCount = text.split(PIXEL_SRC).length - 1;
    if (pixelCount !== 1) throw new Error(`[${lang}] トラッキングピクセル出現回数が想定外 (${pixelCount})`);
  }

  assertBlogPayload(
    { title: before.title, description: before.description, content: newContent, locales: ["ja", "en", "zh"] },
    SLUG
  );

  const { error: updateErr } = await sb.from("blog_posts").update({ content: newContent }).eq("slug", SLUG);
  if (updateErr) throw new Error(`content更新失敗: ${updateErr.message}`);

  const { data: afterImages, error: afterImagesErr } = await sb
    .from("blog_posts")
    .select("slug, is_published, title, description, content, category, is_promotion, locales, pinned, thumbnail")
    .eq("slug", SLUG)
    .single();
  if (afterImagesErr || !afterImages) throw new Error(`更新後取得失敗: ${afterImagesErr?.message}`);

  if (afterImages.is_published !== before.is_published) throw new Error("画像挿入後にis_publishedが変化しています");
  if (JSON.stringify(afterImages.title) !== JSON.stringify(before.title)) throw new Error("titleが変化しています");
  if (JSON.stringify(afterImages.description) !== JSON.stringify(before.description)) throw new Error("descriptionが変化しています");
  if (afterImages.category !== before.category) throw new Error("categoryが変化しています");
  if (afterImages.is_promotion !== before.is_promotion) throw new Error("is_promotionが変化しています");
  if (JSON.stringify(afterImages.locales) !== JSON.stringify(before.locales)) throw new Error("localesが変化しています");
  if (afterImages.pinned !== before.pinned) throw new Error("pinnedが変化しています");
  if (afterImages.thumbnail !== before.thumbnail) throw new Error("thumbnailが変化しています（今回は対象外のはず）");

  console.log("\n✅ 画像挿入完了。is_published/title/description/category/is_promotion/locales/pinned/thumbnail 不変を確認:", afterImages.is_published);
  for (const lang of ["ja", "en", "zh"] as const) {
    console.log(`[${lang}] 文字数: ${beforeContent[lang].length}字 → ${(afterImages.content as Record<string, string>)[lang].length}字`);
  }

  // ─── Step 2: 対象外レコードのスナップショット（公開前） ─────────────────
  const { data: othersBefore, error: othersBeforeErr } = await sb
    .from("blog_posts")
    .select("slug, is_published, title, description, content")
    .neq("slug", SLUG)
    .order("slug");
  if (othersBeforeErr || !othersBefore) throw new Error(`対象外スナップショット取得失敗: ${othersBeforeErr?.message}`);
  console.log(`\n対象外レコード件数: ${othersBefore.length}`);

  // ─── Step 3: 公開（is_published: false→true、再生成なし） ──────────────
  const { error: publishErr } = await sb.from("blog_posts").update({ is_published: true }).eq("slug", SLUG);
  if (publishErr) throw new Error(`公開失敗: ${publishErr.message}`);

  const { data: afterPublish, error: afterPublishErr } = await sb
    .from("blog_posts")
    .select("slug, is_published, title, description, content")
    .eq("slug", SLUG)
    .single();
  if (afterPublishErr || !afterPublish) throw new Error(`公開後取得失敗: ${afterPublishErr?.message}`);

  if (afterPublish.is_published !== true) throw new Error("is_publishedがtrueになっていません");
  if (JSON.stringify(afterPublish.content) !== JSON.stringify(afterImages.content)) {
    throw new Error("公開処理中にcontentが変化しています（再生成が発生した可能性）");
  }
  if (JSON.stringify(afterPublish.title) !== JSON.stringify(afterImages.title)) {
    throw new Error("公開処理中にtitleが変化しています");
  }

  console.log("\n✅ 公開完了。is_published=true、content・title不変を確認");

  // ─── Step 4: 対象外レコードの不変確認 ───────────────────────────────
  const { data: othersAfter, error: othersAfterErr } = await sb
    .from("blog_posts")
    .select("slug, is_published, title, description, content")
    .neq("slug", SLUG)
    .order("slug");
  if (othersAfterErr || !othersAfter) throw new Error(`対象外スナップショット再取得失敗: ${othersAfterErr?.message}`);

  if (othersAfter.length !== othersBefore.length) {
    throw new Error(`対象外レコード件数が変化: before=${othersBefore.length} after=${othersAfter.length}`);
  }
  let mismatch = 0;
  for (let i = 0; i < othersBefore.length; i++) {
    if (JSON.stringify(othersBefore[i]) !== JSON.stringify(othersAfter[i])) {
      mismatch++;
      console.error(`  ❌ 変化検出: ${othersBefore[i].slug}`);
    }
  }
  if (mismatch > 0) throw new Error(`対象外レコードに${mismatch}件の変化があります`);
  console.log(`✅ 対象外レコード ${othersAfter.length}件: 完全不変を確認`);

  console.log(`\n✅ 全処理完了: ${SLUG}`);
  console.log(`URL: https://www.moveworthapp.com/blog/${SLUG}`);

  // レポート用に画像URLを出力
  writeFileSync(
    "scripts/_mets-image-urls.json",
    JSON.stringify({ features: featuresResult.url, pricing: pricingResult.url, comparison: comparisonResult.url }, null, 2)
  );
}

main().catch((e) => {
  console.error("❌", e.message ?? e);
  process.exit(1);
});
