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
const SLUG = "spain-digital-nomad-visa-guide-2026";

async function main() {
  // 公開前に example.com チェック
  const { data: row } = await sb.from("blog_posts").select("content, is_published").eq("slug", SLUG).single();
  if (!row) { console.error("not found"); process.exit(1); }
  if (row.is_published) { console.log("既に公開済み"); return; }

  const c = row.content as Record<string, string>;
  for (const lang of ["ja", "en", "zh"] as const) {
    if ((c[lang] ?? "").includes("example.com")) {
      console.error(`❌ ${lang} に example.com が含まれています。公開を中止します。`);
      process.exit(1);
    }
  }

  const { error } = await sb.from("blog_posts").update({ is_published: true }).eq("slug", SLUG);
  if (error) { console.error("❌ 公開失敗:", error.message); process.exit(1); }
  console.log(`✅ 公開完了: ${SLUG}`);
}
main().catch(e => { console.error(e); process.exit(1); });
