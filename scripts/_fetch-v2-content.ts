import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = t.slice(eq + 1).trim();
  }
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const SLUGS = [
  "greece-residency-visa-cost-2026-v2",
  "malaysia-mm2h-visa-complete-guide-2026-v2",
];

async function main() {
  for (const slug of SLUGS) {
    const { data, error } = await sb
      .from("blog_posts")
      .select("slug, title, content, is_published")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      console.error(`取得失敗: ${slug} — ${error?.message}`);
      continue;
    }

    const content = data.content as Record<string, string>;
    console.log(`\n${"=".repeat(80)}`);
    console.log(`SLUG: ${data.slug}`);
    console.log(`TITLE(ja): ${(data.title as Record<string, string>).ja}`);
    console.log(`is_published: ${data.is_published}`);
    console.log(`JA文字数: ${content.ja?.length ?? 0}`);
    console.log(`${"─".repeat(80)}`);
    console.log(content.ja ?? "(なし)");
  }
}

main().catch(e => { console.error(e); process.exit(1); });
