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
  const { data: b } = await sb.from("blog_posts").select("*").limit(1);
  const { data: s } = await sb.from("study_blog_posts").select("*").limit(1);
  const bKeys = b?.length ? Object.keys(b[0]) : [];
  const sKeys = s?.length ? Object.keys(s[0]) : [];
  console.log("=== blog_posts 全カラム ===");
  console.log(bKeys.join("\n"));
  console.log("\n=== study_blog_posts 全カラム ===");
  console.log(sKeys.join("\n"));
  console.log("\n=== thumbnail関連カラム ===");
  console.log("blog_posts:", bKeys.filter(k => /thumb|image|photo/i.test(k)).join(", ") || "なし");
  console.log("study_blog_posts:", sKeys.filter(k => /thumb|image|photo/i.test(k)).join(", ") || "なし");

  // simulator記事のthumbnail現状
  const { data: sims } = await sb.from("blog_posts").select("slug,thumbnail").like("slug", "simulator-%");
  console.log("\n=== simulator記事 thumbnail現状 ===");
  for (const r of sims ?? []) console.log(`  ${r.slug}: ${r.thumbnail ? "設定済み" : "未設定"}`);
}
main().catch(e => { console.error(e); process.exit(1); });
