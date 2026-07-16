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
  // 対象2件の確認
  const targets = [
    "study-abroad-remittance-guide-2026",
    "study-abroad-work-rules-all-countries-2026",
  ];
  console.log("=== 対象2件 DB確認 ===");
  for (const slug of targets) {
    const { data } = await sb.from("study_blog_posts").select("slug,is_published,date").eq("slug", slug).single();
    if (!data) { console.log(`  ❌ ${slug}: レコードなし`); }
    else console.log(`  ${data.is_published ? "✅ 公開" : "🔸 draft"} ${slug} (date: ${data.date})`);
  }

  // study-abroad-* 全件確認
  console.log("\n=== study-abroad-* 全件 ===");
  const { data: all } = await sb.from("study_blog_posts").select("slug,is_published").like("slug", "study-abroad-%").order("slug");
  for (const r of all ?? []) {
    console.log(`  ${r.is_published ? "✅ 公開" : "🔸 draft"} ${r.slug}`);
  }

  // generateStaticParams が返すslug一覧（is_published=trueのもの）に含まれているか
  console.log("\n=== 公開中のstudy記事 全件スラグ (study-abroad-* のみ) ===");
  const { data: pub } = await sb.from("study_blog_posts").select("slug").eq("is_published", true).like("slug", "study-abroad-%").order("slug");
  for (const r of pub ?? []) console.log(`  ${r.slug}`);
}
main().catch(e => { console.error(e); process.exit(1); });
