import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

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

async function run() {
  const { data, error } = await sb
    .from("blog_posts")
    .select("slug, title, description, content")
    .eq("category", "casestudy");

  if (error) { console.error(error.message); return; }

  for (const post of data ?? []) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`SLUG: ${post.slug}`);
    console.log(`TITLE (ja): ${post.title?.ja}`);
    console.log(`\n--- CONTENT (ja) ---`);
    console.log(post.content?.ja ?? "(none)");
  }
}

run().catch(console.error);
