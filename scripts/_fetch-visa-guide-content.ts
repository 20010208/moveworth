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
  "malaysia-mm2h-visa-complete-guide-2026",
  "greece-residency-visa-cost-2026",
];

const REFUSAL = ["申し訳ありません", "I cannot", "I'm sorry", "As an AI", "I'm unable", "cannot access the internet", "インターネットへのアクセス"];

async function main() {
  for (const slug of SLUGS) {
    const { data, error } = await sb
      .from("blog_posts")
      .select("slug, is_published, published_at, title, description, content")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      console.log(`❌ ${slug}: 取得失敗 ${error?.message}`);
      continue;
    }

    const ja = (data.content as Record<string, string>)?.ja ?? "";
    const en = (data.content as Record<string, string>)?.en ?? "";

    const hasExample = ja.includes("example.com") || en.includes("example.com");
    const refusalHits = REFUSAL.filter(p => ja.includes(p) || en.includes(p));

    console.log(`\n${"=".repeat(70)}`);
    console.log(`SLUG: ${slug}`);
    console.log(`is_published: ${data.is_published}`);
    console.log(`published_at: ${data.published_at}`);
    console.log(`example.com混入: ${hasExample ? "❌ あり" : "✅ なし"}`);
    console.log(`GPT拒否パターン: ${refusalHits.length > 0 ? "❌ " + refusalHits.join(", ") : "✅ なし"}`);
    console.log(`content.ja 文字数: ${ja.length}`);
    console.log(`content.en 文字数: ${en.length}`);

    console.log(`\n--- content.ja 全文 ---`);
    console.log(ja);
    console.log(`\n--- content.en 全文 ---`);
    console.log(en);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
