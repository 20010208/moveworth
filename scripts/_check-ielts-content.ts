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
    .select("content")
    .eq("slug", "study-abroad-ielts-toefl-guide-2026")
    .single();
  const c = data!.content as Record<string, string>;
  const ja = c.ja ?? "";
  console.log("=== 見出し一覧（JA）===");
  ja.split("\n").filter((l) => l.startsWith("#")).forEach((l) => console.log(l));
  console.log("\n=== 国名・表 含む行（JA）===");
  ja.split("\n")
    .filter((l) => l.includes("|") || /米国|英国|カナダ|豪州|オーストラリア|国別|各国/.test(l))
    .forEach((l) => console.log(l));
}
main().catch(e => { console.error(e); process.exit(1); });
