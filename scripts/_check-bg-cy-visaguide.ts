import { existsSync, readFileSync } from "fs";
if (existsSync(".env.local")) {
  for (const l of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = l.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(); if (!(k in process.env)) process.env[k] = t.slice(eq + 1).trim();
  }
}
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
  // 1. BG/CY の country_sources
  console.log("=== BG country_sources ===");
  const { data: bgSrc } = await sb.from("country_sources").select("url,purpose,status").eq("country_code", "bg");
  console.log(JSON.stringify(bgSrc, null, 2));

  console.log("\n=== CY country_sources ===");
  const { data: cySrc } = await sb.from("country_sources").select("url,purpose,status").eq("country_code", "cy");
  console.log(JSON.stringify(cySrc, null, 2));

  // 2. visa-guide slugs (blog_posts)
  console.log("\n=== visa-guide slugs (blog_posts) ===");
  const { data: guides } = await sb
    .from("blog_posts")
    .select("slug,is_published")
    .ilike("slug", "%-guide%")
    .order("slug");
  console.log(JSON.stringify(guides, null, 2));

  // 3. visa-{code} slugs
  console.log("\n=== visa-{code} slugs (blog_posts) ===");
  const { data: visaSlugs } = await sb
    .from("blog_posts")
    .select("slug,is_published")
    .ilike("slug", "visa-%")
    .not("slug", "ilike", "%-guide%")
    .not("slug", "ilike", "%-review%")
    .order("slug");
  console.log(JSON.stringify(visaSlugs, null, 2));

  // 4. BG/CY の visa blog_posts 現状
  console.log("\n=== visa-bg, visa-cy blog_posts ===");
  const { data: bgCyPosts } = await sb
    .from("blog_posts")
    .select("slug,is_published,updated_at")
    .in("slug", ["visa-bg", "visa-cy"]);
  console.log(JSON.stringify(bgCyPosts, null, 2));
}
main().catch(e => { console.error(e); process.exit(1); });
