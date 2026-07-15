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

const PAIRS = [
  // money 重複ペア（節税）
  ["overseas-relocation-tax-savings-tips", "maximize-tax-savings-with-overseas-relocation-key-insig-2026"],
  // lifeplan 重複ペア（定年後）
  ["retirement-abroad-a-comprehensive-guide-to-pros-and-con-2026", "retiring-abroad-comprehensive-guide-to-pros-and-cons-2026"],
];

async function main() {
  for (const [slug1, slug2] of PAIRS) {
    const { data } = await sb
      .from("blog_posts")
      .select("slug, category, title, content, created_at, is_published")
      .in("slug", [slug1, slug2])
      .order("created_at");

    const [a, b] = data ?? [];
    if (!a || !b) { console.log(`⚠️  ${slug1} or ${slug2} not found`); continue; }

    console.log("=".repeat(70));
    console.log(`PAIR: ${a.category}`);
    console.log(`A: [pub=${a.is_published}] ${a.slug}  (created: ${a.created_at?.slice(0,10)})`);
    console.log(`   title.ja: ${(a.title as Record<string,string>)?.ja}`);
    console.log(`   content.ja length: ${(a.content as Record<string,string>)?.ja?.length ?? 0}文字`);
    console.log(`   content.ja 先頭300:`);
    console.log(`   ${((a.content as Record<string,string>)?.ja ?? "").slice(0,300)}`);
    console.log();
    console.log(`B: [pub=${b.is_published}] ${b.slug}  (created: ${b.created_at?.slice(0,10)})`);
    console.log(`   title.ja: ${(b.title as Record<string,string>)?.ja}`);
    console.log(`   content.ja length: ${(b.content as Record<string,string>)?.ja?.length ?? 0}文字`);
    console.log(`   content.ja 先頭300:`);
    console.log(`   ${((b.content as Record<string,string>)?.ja ?? "").slice(0,300)}`);
    console.log();
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
