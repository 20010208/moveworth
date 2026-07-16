import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = t.slice(eq + 1).trim();
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
  const { data: rows, error } = await sb
    .from("study_blog_posts")
    .select("slug, is_published")
    .order("slug");
  if (error) { console.error("DB error:", error.message); process.exit(1); }

  const studyWork = (rows ?? []).filter(r => r.slug.startsWith("study-work-"));
  const studyShort = (rows ?? []).filter(r => /^study-[a-z]+$/.test(r.slug));
  const studyCountry = (rows ?? []).filter(r => r.slug.startsWith("study-country-"));

  console.log(`=== study_blog_posts 現状カウント ===`);
  console.log(`総件数:               ${(rows ?? []).length}`);
  console.log(`study-work-{code}:    ${studyWork.length} 件`);
  console.log(`study-{code}（旧形式）: ${studyShort.length} 件`);
  console.log(`study-country-{code}: ${studyCountry.length} 件`);

  console.log(`\n=== study-work-{code} 全件一覧 ===`);
  for (const r of studyWork) {
    console.log(`  ${r.slug.padEnd(30)} is_published=${r.is_published}`);
  }

  if (studyShort.length > 0) {
    console.log(`\n⚠️  study-{code}（旧形式）が残っています:`);
    for (const r of studyShort) console.log(`  ${r.slug}  is_published=${r.is_published}`);
  } else {
    console.log(`\n✅ study-{code}（旧形式）: 0件（完全移行済み）`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
