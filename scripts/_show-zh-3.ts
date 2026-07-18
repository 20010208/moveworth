import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
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
  const { data } = await sb.from("study_blog_posts")
    .select("slug,content")
    .in("slug", ["study-country-hu","study-country-my","study-country-ro"])
    .order("slug");
  for (const p of data ?? []) {
    const c = p.content as Record<string,string>;
    console.log(`\n${"=".repeat(55)}\n[${p.slug}]  ZH: ${c.zh?.length ?? 0}字\n${"=".repeat(55)}`);
    console.log(c.zh ?? "(なし)");
  }
}
main().catch(e => { console.error(e); process.exit(1); });
