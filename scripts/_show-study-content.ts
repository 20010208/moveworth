/**
 * 指定スラグの content.ja / content.en 全文出力
 * Usage: npx tsx scripts/_show-study-content.ts <slug>
 */
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
  const slug = process.argv[2];
  if (!slug) { console.error("Usage: npx tsx scripts/_show-study-content.ts <slug>"); process.exit(1); }
  const { data } = await sb.from("study_blog_posts").select("slug, title, content").eq("slug", slug).single();
  if (!data) { console.error(`Not found: ${slug}`); process.exit(1); }
  const c = data.content as Record<string, string>;
  console.log(`\n=== ${slug} ===`);
  console.log(`JA title: ${(data.title as Record<string, string>).ja}`);
  console.log(`EN title: ${(data.title as Record<string, string>).en}`);
  console.log(`JA(${c.ja?.length ?? 0}字):\n${c.ja ?? "(empty)"}`);
  console.log(`\nEN(${c.en?.length ?? 0}字):\n${c.en ?? "(empty)"}`);
}
main().catch(e => { console.error(e); process.exit(1); });
