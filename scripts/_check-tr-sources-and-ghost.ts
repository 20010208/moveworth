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
  // TR country_sources
  const { data: trSources } = await sb
    .from("country_sources")
    .select("url, purpose, source, is_alive, fetched_at")
    .eq("country_code", "tr")
    .order("purpose");

  console.log("=== TR country_sources ===");
  if (!trSources || trSources.length === 0) {
    console.log("  ❌ 登録なし");
  } else {
    for (const s of trSources) {
      console.log(`  [${s.purpose}] is_alive=${s.is_alive}  ${s.url}`);
    }
  }

  // me/rs visa・study 記事の存在確認
  const slugsToCheck = ["visa-me", "visa-rs", "study-work-me", "study-work-rs", "study-country-me", "study-country-rs"];

  const { data: visaRows } = await sb
    .from("blog_posts")
    .select("slug, is_published")
    .in("slug", ["visa-me", "visa-rs"]);

  const { data: studyRows } = await sb
    .from("study_blog_posts")
    .select("slug, is_published")
    .in("slug", ["study-work-me", "study-work-rs", "study-country-me", "study-country-rs"]);

  console.log("\n=== ME・RS ゴースト記事状況 ===");
  for (const slug of slugsToCheck) {
    const row = slug.startsWith("visa-")
      ? (visaRows ?? []).find(r => r.slug === slug)
      : (studyRows ?? []).find(r => r.slug === slug);
    if (row) {
      console.log(`  ✅ ${slug.padEnd(22)} is_published=${row.is_published}`);
    } else {
      console.log(`  ❌ ${slug.padEnd(22)} 存在しない`);
    }
  }
}
main().catch(e => { console.error(e); process.exit(1); });
