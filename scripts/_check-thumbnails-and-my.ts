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
  // 1. thumbnail現状確認 (study-country-*のみ)
  const { data: thumbs } = await sb.from("study_blog_posts")
    .select("slug,thumbnail,is_published")
    .ilike("slug", "study-country-%")
    .order("slug");

  console.log("=== study-country-{code} サムネイル現状 ===");
  let enCount = 0, plainCount = 0, nullCount = 0;
  for (const r of thumbs ?? []) {
    const url = r.thumbnail ?? "";
    const isEn = url.includes("-en.png");
    const isNull = !url;
    if (isEn) enCount++;
    else if (isNull) nullCount++;
    else plainCount++;
    if (isEn) console.log(`  [EN残存] ${r.slug}: ...${url.slice(-40)}`);
  }
  console.log(`\n  -en.png 残存: ${enCount}件`);
  console.log(`  plain .png (復元済み): ${plainCount}件`);
  console.log(`  null/未設定: ${nullCount}件`);
  console.log(`  合計: ${(thumbs ?? []).length}件\n`);

  // 2. study-country-my の内容取得
  const { data: my, error } = await sb.from("study_blog_posts")
    .select("slug,is_published,content,title,description")
    .eq("slug", "study-country-my")
    .single();

  if (error || !my) { console.error("study-country-my 取得失敗:", error?.message); return; }

  console.log("=== study-country-my ===");
  console.log(`is_published: ${my.is_published}`);
  const title = my.title as Record<string,string>;
  const desc = my.description as Record<string,string>;
  const content = my.content as Record<string,string>;
  console.log(`title.ja: ${title?.ja}`);
  console.log(`description.ja: ${desc?.ja?.slice(0, 150)}`);
  console.log("\n--- content.ja (全文) ---\n");
  console.log(content?.ja ?? "(なし)");
}
main().catch(e => { console.error(e); process.exit(1); });
