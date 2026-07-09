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
    .select("slug, title, description, content, category")
    .eq("slug", "building-wealth-a-case-study-of-a-dual-income-couple-in-2026")
    .single();

  if (error) { console.error(error.message); return; }
  console.log("=== TITLE ===");
  console.log(JSON.stringify(data.title, null, 2));
  console.log("\n=== DESCRIPTION ===");
  console.log(JSON.stringify(data.description, null, 2));
  console.log("\n=== CATEGORY ===");
  console.log(data.category);
  console.log("\n=== CONTENT (ja) ===");
  console.log(data.content?.ja ?? "(none)");
}

run().catch(console.error);
