/**
 * 404 報告2件の timestamp 確認 + 直近の is_published 変更記録の代替調査
 * study_blog_posts には updated_at がないため created_at / date を使用
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
  // 対象2件の timestamp
  console.log("=== 対象2件 timestamp ===");
  const targets = [
    "study-abroad-remittance-guide-2026",
    "study-abroad-work-rules-all-countries-2026",
  ];
  for (const slug of targets) {
    const { data } = await sb
      .from("study_blog_posts")
      .select("slug, is_published, date, created_at")
      .eq("slug", slug).single();
    if (data) {
      console.log(`  ${slug}`);
      console.log(`    is_published: ${data.is_published}`);
      console.log(`    date:         ${data.date}`);
      console.log(`    created_at:   ${data.created_at}`);
    }
  }

  // created_at が 2026-07-15 以降の公開記事（直近に追加・変更された可能性があるもの）
  console.log("\n=== created_at が 2026-07-14 以降の study_blog_posts ===");
  const { data: recent } = await sb
    .from("study_blog_posts")
    .select("slug, is_published, date, created_at")
    .gte("created_at", "2026-07-14T00:00:00Z")
    .order("created_at", { ascending: false });
  for (const r of recent ?? []) {
    console.log(`  ${r.is_published ? "公開" : "draft"} ${r.slug} | date:${r.date} | created_at:${r.created_at}`);
  }

  // study-abroad-* の全 created_at（時系列で全件）
  console.log("\n=== study-abroad-* 全件 created_at（昇順）===");
  const { data: abroad } = await sb
    .from("study_blog_posts")
    .select("slug, is_published, date, created_at")
    .like("slug", "study-abroad-%")
    .order("created_at");
  for (const r of abroad ?? []) {
    console.log(`  ${r.is_published ? "公開" : "draft"} ${r.slug.padEnd(50)} | date:${r.date} | created_at:${r.created_at}`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
