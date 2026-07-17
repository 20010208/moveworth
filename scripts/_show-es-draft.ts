import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function main() {
  const { data } = await sb.from("blog_posts")
    .select("slug, title, description, content, is_published")
    .eq("slug", "spain-digital-nomad-visa-guide-2026")
    .single();
  if (!data) { console.error("not found"); return; }
  const c = data.content as Record<string, string>;
  const t = data.title as Record<string, string>;
  const d = data.description as Record<string, string>;
  console.log(`slug: ${data.slug}`);
  console.log(`is_published: ${data.is_published}`);
  console.log(`\n=== title.ja ===\n${t.ja}`);
  console.log(`\n=== description.ja ===\n${d.ja}`);
  console.log(`\n=== content.ja (${c.ja?.length}字) ===\n${c.ja}`);
}
main().catch(e => { console.error(e); process.exit(1); });
