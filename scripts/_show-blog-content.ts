/**
 * 指定スラグの blog_posts / study_blog_posts 全言語コンテンツ出力
 * Usage: npx tsx scripts/_show-blog-content.ts <table> <slug>
 *   table: "study" | "blog"
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
  const [, , table, slug] = process.argv;
  if (!table || !slug) { console.error("Usage: npx tsx scripts/_show-blog-content.ts <study|blog> <slug>"); process.exit(1); }
  const tbl = table === "study" ? "study_blog_posts" : "blog_posts";
  const { data } = await sb.from(tbl).select("slug, title, description, content").eq("slug", slug).single();
  if (!data) { console.error(`Not found: ${slug} in ${tbl}`); process.exit(1); }
  const c = (data.content ?? {}) as Record<string, string>;
  const t = (data.title ?? {}) as Record<string, string>;
  const d = (data.description ?? {}) as Record<string, string>;
  console.log(`\n=== ${slug} ===`);
  for (const lang of ["ja", "en", "zh"]) {
    const txt = c[lang] ?? "";
    if (txt.trim().length === 0) { console.log(`\n[${lang}] (空)`); continue; }
    console.log(`\n[${lang}] title: ${t[lang] ?? ""}`);
    console.log(`[${lang}] description: ${d[lang] ?? ""}`);
    console.log(`[${lang}] content(${txt.length}字):\n${txt}`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
