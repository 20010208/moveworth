/**
 * casestudy 11件の完全削除（DBレコード + Storage画像）
 * 実行前確認:
 *   - 全件 is_published=false ✅ (確認済み)
 *   - サムネイル10件は他記事から参照なし ✅ (確認済み)
 *   - 3件はnext.config.tsの301リダイレクト元（削除後もredirectは維持される）✅
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

const CASESTUDY_SLUGS = [
  "a-40s-couples-guide-to-moving-to-lisbon-costs-taxes-and-2026",
  "building-wealth-a-case-study-of-a-30s-couple-moving-to-2026",
  "building-wealth-a-case-study-of-a-dual-income-couple-in-2026",
  "entrepreneurs-moving-to-dubai-tax-savings-living-costs-2026",
  "freelancers-guide-to-moving-to-barcelona-one-year-in-re-2026",
  "japan-500man-overseas-value",
  "japanese-engineers-experience-moving-to-bangkok-2026",
  "malaysia-vs-thailand-comparison",
  "moving-to-kuala-lumpur-a-familys-cost-of-living-breakdo-2026",
  "vancouver-relocation-for-it-engineers-a-comprehensive-g-2026",
  "why-i-chose-to-move-abroad-in-my-30s-and-how-i-prepared-2026",
];

// Storage上のファイル名（URLのpathから blog-images/ 以降）
const STORAGE_FILES = [
  "malaysia-vs-thailand-comparison.png",
  "why-i-chose-to-move-abroad-in-my-30s-and-how-i-prepared-2026.png",
  "guide-to-moving-to-lisbon-costs-taxes-and-2026.png",
  "japanese-engineers-experience-moving-to-bangkok-2026.png",
  "entrepreneurs-moving-to-dubai-tax-savings-living-costs-2026.png",
  "japan-500man-overseas-value.png",
  "freelancers-guide-to-moving-to-barcelona-one-year-in-re-2026.png",
  "vancouver-relocation-for-it-engineers-a-comprehensive-g-2026.png",
  "moving-to-kuala-lumpur-a-familys-cost-of-living-breakdo-2026.png",
  "building-wealth-a-case-study-of-a-dual-income-couple-in-2026.png",
];

async function main() {
  // 最終安全チェック: 全件 is_published=false か確認
  const { data: check } = await sb
    .from("blog_posts")
    .select("slug, is_published")
    .in("slug", CASESTUDY_SLUGS);

  const published = (check ?? []).filter(r => r.is_published);
  if (published.length > 0) {
    console.error(`❌ 公開中のレコードが存在します（削除中止）:`);
    for (const r of published) console.error(`   ${r.slug}`);
    process.exit(1);
  }
  console.log(`✅ 全${check?.length ?? 0}件 is_published=false 確認`);

  // Storage 画像削除
  console.log("\n=== Storage 画像削除 ===");
  const { data: removed, error: storageErr } = await sb.storage
    .from("blog-images")
    .remove(STORAGE_FILES);

  if (storageErr) {
    console.error(`Storage削除エラー: ${storageErr.message}`);
  } else {
    console.log(`削除成功: ${removed?.length ?? 0}件`);
    for (const r of removed ?? []) console.log(`  ✅ ${r.name}`);
  }

  // DB レコード削除
  console.log("\n=== DB レコード削除 ===");
  const { error: dbErr, count } = await sb
    .from("blog_posts")
    .delete({ count: "exact" })
    .in("slug", CASESTUDY_SLUGS);

  if (dbErr) {
    console.error(`DB削除エラー: ${dbErr.message}`);
    process.exit(1);
  }
  console.log(`✅ blog_posts 削除完了: ${count}件`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
