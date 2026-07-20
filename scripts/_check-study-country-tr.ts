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
  const { data, error } = await sb.from("study_blog_posts").select("slug,content,is_published").eq("slug","study-country-tr").single();
  if (error) { console.error(error.message); process.exit(1); }
  const c = data.content as Record<string, string>;
  console.log("is_published:", data.is_published);
  console.log("ja:", c.ja?.length ?? "なし");
  console.log("en:", c.en?.length ?? "なし");
  console.log("zh:", c.zh?.length ?? "なし");
  if (c.zh) console.log("zh先頭:", c.zh.slice(0, 100));
}
main().catch(e => { console.error(e); process.exit(1); });
