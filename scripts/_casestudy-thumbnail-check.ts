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

async function main() {
  // casestudy records
  const { data: cs } = await sb
    .from("blog_posts")
    .select("slug, is_published, thumbnail, category")
    .in("slug", CASESTUDY_SLUGS);

  console.log("=== casestudy 11件 確認 ===");
  const thumbnails: string[] = [];
  for (const r of cs ?? []) {
    console.log(`[pub=${r.is_published}] ${r.slug}`);
    console.log(`  thumbnail: ${r.thumbnail ?? "(null)"}`);
    if (r.thumbnail) thumbnails.push(r.thumbnail);
  }

  // 重複しているサムネイルを特定
  const uniqueThumbs = [...new Set(thumbnails)];
  console.log(`\nユニークサムネイル: ${uniqueThumbs.length}件`);

  if (uniqueThumbs.length === 0) {
    console.log("サムネイルなし → Storage削除不要");
    return;
  }

  // 他のレコードが同じサムネイルを参照しているか確認
  console.log("\n=== 他記事のサムネイル参照チェック ===");
  const { data: all } = await sb
    .from("blog_posts")
    .select("slug, thumbnail")
    .not("thumbnail", "is", null)
    .not("slug", "in", `(${CASESTUDY_SLUGS.map(s => `"${s}"`).join(",")})`);

  for (const thumb of uniqueThumbs) {
    const sharers = (all ?? []).filter(r => r.thumbnail === thumb);
    if (sharers.length > 0) {
      console.log(`⚠️  ${thumb}`);
      console.log(`   他記事が参照中: ${sharers.map(r => r.slug).join(", ")}`);
    } else {
      console.log(`✅ ${thumb} — 他参照なし → 削除可`);
    }
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
