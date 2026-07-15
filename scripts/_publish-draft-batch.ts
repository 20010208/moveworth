/**
 * 2026-07-15 バッチ draft → 公開
 * 対象6本（visa-me は除外・保留）
 */
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

const BP_SLUGS = [
  "understanding-overseas-relocation-and-japans-pension-so-2026",
  "simulator-sg-eng-single-2026",
];

const SP_SLUGS = [
  "study-country-mx",
  "study-abroad-language-school-guide-2026",
  "study-me",
  "study-country-me",
];

async function publish(table: string, slugs: string[]) {
  for (const slug of slugs) {
    // 事前にcontentを確認（example.com / GPT拒否チェック）
    const { data, error: fetchErr } = await sb
      .from(table)
      .select("slug, is_published, content")
      .eq("slug", slug)
      .single();

    if (fetchErr || !data) {
      console.error(`❌ ${table}/${slug}: 取得失敗 — ${fetchErr?.message}`);
      continue;
    }
    if (data.is_published) {
      console.log(`⏭  ${slug}: 既に公開済みスキップ`);
      continue;
    }

    const ja: string = (data.content as Record<string, string>)?.ja ?? "";
    const en: string = (data.content as Record<string, string>)?.en ?? "";

    if (ja.includes("example.com") || en.includes("example.com")) {
      console.error(`❌ ${slug}: example.com 混入 → 公開スキップ`);
      continue;
    }
    const REFUSAL = ["申し訳ありません", "I cannot", "I'm sorry", "As an AI"];
    if (REFUSAL.some(p => ja.includes(p) || en.includes(p))) {
      console.error(`❌ ${slug}: GPT拒否メッセージ混入 → 公開スキップ`);
      continue;
    }
    if (ja.length < 200 || en.length < 200) {
      console.error(`❌ ${slug}: content 短すぎ (ja=${ja.length}, en=${en.length}) → スキップ`);
      continue;
    }

    const { error } = await sb
      .from(table)
      .update({ is_published: true })
      .eq("slug", slug);

    if (error) {
      console.error(`❌ ${slug}: update失敗 — ${error.message}`);
    } else {
      console.log(`✅ ${slug}: published`);
    }
  }
}

async function main() {
  console.log("=== blog_posts ===");
  await publish("blog_posts", BP_SLUGS);

  console.log("\n=== study_blog_posts ===");
  await publish("study_blog_posts", SP_SLUGS);

  console.log("\n=== 完了 ===");
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
