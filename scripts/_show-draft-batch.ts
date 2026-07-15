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

const BP_SLUGS = [
  "understanding-overseas-relocation-and-japans-pension-so-2026",
  "visa-me",
  "simulator-sg-eng-single-2026",
];

const SP_SLUGS = [
  "study-country-mx",
  "study-abroad-language-school-guide-2026",
  "study-me",
  "study-country-me",
];

const SEP = "=".repeat(80);

async function main() {
  // blog_posts
  const { data: bp } = await sb
    .from("blog_posts")
    .select("slug, is_published, title, description, content")
    .in("slug", BP_SLUGS);

  for (const r of bp ?? []) {
    console.log(SEP);
    console.log(`[blog_posts] ${r.slug}  pub=${r.is_published}`);
    console.log("--- title ---");
    console.log("ja:", (r.title as Record<string, string>)?.ja);
    console.log("en:", (r.title as Record<string, string>)?.en);
    if ((r.title as Record<string, string>)?.zh)
      console.log("zh:", (r.title as Record<string, string>)?.zh);
    console.log("--- description ---");
    console.log("ja:", (r.description as Record<string, string>)?.ja);
    console.log("en:", (r.description as Record<string, string>)?.en);
    if ((r.description as Record<string, string>)?.zh)
      console.log("zh:", (r.description as Record<string, string>)?.zh);
    console.log("--- content.ja ---");
    console.log((r.content as Record<string, string>)?.ja ?? "(空)");
    console.log("--- content.en (first 200 chars) ---");
    console.log(((r.content as Record<string, string>)?.en ?? "").slice(0, 200) + "...");
  }

  // study_blog_posts
  const { data: sp } = await sb
    .from("study_blog_posts")
    .select("slug, is_published, title, description, content")
    .in("slug", SP_SLUGS);

  for (const r of sp ?? []) {
    console.log(SEP);
    console.log(`[study_blog_posts] ${r.slug}  pub=${r.is_published}`);
    console.log("--- title ---");
    console.log("ja:", (r.title as Record<string, string>)?.ja);
    console.log("en:", (r.title as Record<string, string>)?.en);
    console.log("--- description ---");
    console.log("ja:", (r.description as Record<string, string>)?.ja);
    console.log("en:", (r.description as Record<string, string>)?.en);
    console.log("--- content.ja ---");
    console.log((r.content as Record<string, string>)?.ja ?? "(空)");
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
