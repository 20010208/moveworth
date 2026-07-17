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
  const { data } = await sb
    .from("study_blog_posts")
    .select("slug, is_published, content")
    .eq("slug", "study-abroad-work-rules-all-countries-2026")
    .maybeSingle();
  if (!data) { console.log("not found"); return; }
  const ja = (data.content as Record<string, string>)?.ja ?? "";
  console.log(`is_published: ${data.is_published} / JA: ${ja.length}字\n`);
  // 冒頭（免責文まで）
  console.log("--- 冒頭 ---");
  console.log(ja.slice(0, 400));
  // テーブル（最初の20行）
  const tableStart = ja.indexOf("| 国 |");
  if (tableStart >= 0) {
    const tableLines = ja.slice(tableStart).split("\n").slice(0, 22);
    console.log("\n--- テーブル（先頭20行）---");
    console.log(tableLines.join("\n"));
  }
  // 末尾
  console.log("\n--- 末尾（参考資料）---");
  console.log(ja.slice(-300));
}
main().catch(e => { console.error(e); process.exit(1); });
