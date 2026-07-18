// HU/MY/RO の content.ja/en と country_sources を取得
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
const SLUGS = ["study-country-hu", "study-country-my", "study-country-ro"];

async function main() {
  const { data: posts } = await sb.from("study_blog_posts")
    .select("slug,title,description,content,is_published")
    .in("slug", SLUGS);

  for (const p of posts ?? []) {
    const t = p.title as Record<string, string>;
    const d = p.description as Record<string, string>;
    const c = p.content as Record<string, string>;
    console.log(`\n${"=".repeat(60)}`);
    console.log(`SLUG: ${p.slug}  (is_published: ${p.is_published})`);
    console.log(`title.ja: ${t?.ja}`);
    console.log(`title.en: ${t?.en}`);
    console.log(`title.zh: ${t?.zh ?? "(未設定)"}`);
    console.log(`desc.ja: ${d?.ja?.slice(0, 100)}`);
    console.log(`content.ja 文字数: ${c?.ja?.length ?? 0}`);
    console.log(`content.en 文字数: ${c?.en?.length ?? 0}`);
    console.log(`content.zh 文字数: ${c?.zh?.length ?? 0} ${c?.zh ? "" : "← ZH本文なし"}`);
  }

  // country_sources for hu/ro/my
  console.log("\n\n=== country_sources ===");
  const codes = ["hu", "my", "ro"];
  for (const code of codes) {
    const { data: sources } = await sb.from("country_sources")
      .select("url,purpose,fetch_status")
      .eq("country_code", code)
      .order("purpose");
    console.log(`\n[${code.toUpperCase()}] ${sources?.length ?? 0}件`);
    for (const s of sources ?? []) {
      console.log(`  ${s.purpose} | ${s.fetch_status} | ${s.url}`);
    }
  }
}
main().catch(e => { console.error(e); process.exit(1); });
