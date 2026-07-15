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

const SEP = "=".repeat(70);

async function main() {
  // ---- study_blog_posts ----
  const { data: sp } = await sb
    .from("study_blog_posts")
    .select("slug, category, title, is_published")
    .order("slug");

  console.log(SEP);
  console.log("study_blog_posts 全件");
  console.log(SEP);

  const spByCategory: Record<string, typeof sp> = {};
  for (const r of sp ?? []) {
    const cat = r.category ?? "(null)";
    if (!spByCategory[cat]) spByCategory[cat] = [];
    spByCategory[cat]!.push(r);
  }

  for (const [cat, rows] of Object.entries(spByCategory)) {
    console.log(`\n▶ カテゴリ: "${cat}"  ${rows!.length}件`);
    for (const r of rows!) {
      const pub = r.is_published ? "公開" : "draft";
      const ja = (r.title as Record<string, string>)?.ja ?? "(no ja)";
      console.log(`  [${pub}] ${r.slug}`);
      console.log(`        ${ja}`);
    }
  }

  // ---- blog_posts ----
  const { data: bp } = await sb
    .from("blog_posts")
    .select("slug, category, title, is_published")
    .order("slug");

  console.log("\n\n" + SEP);
  console.log("blog_posts 全件");
  console.log(SEP);

  const bpByCategory: Record<string, typeof bp> = {};
  for (const r of bp ?? []) {
    const cat = r.category ?? "(null)";
    if (!bpByCategory[cat]) bpByCategory[cat] = [];
    bpByCategory[cat]!.push(r);
  }

  for (const [cat, rows] of Object.entries(bpByCategory)) {
    console.log(`\n▶ カテゴリ: "${cat}"  ${rows!.length}件`);
    for (const r of rows!) {
      const pub = r.is_published ? "公開" : "draft";
      const ja = (r.title as Record<string, string>)?.ja ?? "(no ja)";
      console.log(`  [${pub}] ${r.slug}`);
      console.log(`        ${ja}`);
    }
  }

  console.log("\n" + SEP);
  console.log("合計: study_blog_posts=" + (sp?.length ?? 0) + "件, blog_posts=" + (bp?.length ?? 0) + "件");
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
