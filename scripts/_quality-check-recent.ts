/**
 * 直近公開記事の事後品質チェック
 * - blog_posts: 07-02〜07-13 の is_published=true 記事
 * - study_blog_posts: 07-13〜07-14 の is_published=true 記事（study-country-{code}等）
 * チェック内容:
 *   1. example.com 混入チェック
 *   2. GPT拒否メッセージ混入チェック
 *   3. content.ja / content.en が空でないこと
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

const GPT_REFUSAL_PATTERNS = [
  "I cannot",
  "I'm sorry",
  "I apologize",
  "As an AI",
  "I don't have",
  "I'm unable",
  "申し訳",
  "できません",
  "お断り",
];

function checkContent(slug: string, ja: string | null, en: string | null): string[] {
  const issues: string[] = [];
  const texts = [{ lang: "ja", text: ja }, { lang: "en", text: en }];

  for (const { lang, text } of texts) {
    if (!text || text.trim().length < 200) {
      issues.push(`content.${lang} が空または短すぎる (${text?.length ?? 0}文字)`);
      continue;
    }
    if (text.includes("example.com")) {
      issues.push(`content.${lang} に "example.com" が含まれる`);
    }
    for (const p of GPT_REFUSAL_PATTERNS) {
      if (text.includes(p)) {
        issues.push(`content.${lang} にGPT拒否パターン: "${p}"`);
        break;
      }
    }
  }
  return issues;
}

async function main() {
  let totalIssues = 0;

  // --- blog_posts: 07-02〜07-13 公開分 ---
  console.log("=== blog_posts: 2026-07-02〜07-13 is_published=true ===\n");
  const { data: bp, error: bpErr } = await sb
    .from("blog_posts")
    .select("slug, content, is_published, published_at, created_at")
    .eq("is_published", true)
    .gte("created_at", "2026-07-02T00:00:00Z")
    .lte("created_at", "2026-07-13T23:59:59Z")
    .order("created_at", { ascending: true });

  if (bpErr) { console.error("blog_posts error:", bpErr.message); process.exit(1); }

  for (const r of bp ?? []) {
    const ja = (r.content as Record<string, string> | null)?.ja ?? null;
    const en = (r.content as Record<string, string> | null)?.en ?? null;
    const issues = checkContent(r.slug, ja, en);
    if (issues.length) {
      totalIssues += issues.length;
      console.log(`❌ ${r.slug}`);
      for (const i of issues) console.log(`   - ${i}`);
    } else {
      console.log(`✅ ${r.slug}`);
    }
  }
  console.log(`\nblog_posts 検査: ${bp?.length ?? 0}件`);

  // --- study_blog_posts: 07-13〜07-15 公開分（大量生成分）---
  console.log("\n=== study_blog_posts: 2026-07-13〜07-15 is_published=true ===\n");
  const { data: sp, error: spErr } = await sb
    .from("study_blog_posts")
    .select("slug, content, is_published, created_at")
    .eq("is_published", true)
    .gte("created_at", "2026-07-13T00:00:00Z")
    .order("created_at", { ascending: true });

  if (spErr) { console.error("study_blog_posts error:", spErr.message); process.exit(1); }

  const issueList: Array<{ slug: string; issues: string[] }> = [];
  for (const r of sp ?? []) {
    const ja = (r.content as Record<string, string> | null)?.ja ?? null;
    const en = (r.content as Record<string, string> | null)?.en ?? null;
    const issues = checkContent(r.slug, ja, en);
    if (issues.length) {
      totalIssues += issues.length;
      issueList.push({ slug: r.slug, issues });
    }
  }

  if (issueList.length === 0) {
    console.log(`全件 OK ✅ (${sp?.length ?? 0}件)`);
  } else {
    console.log(`問題あり: ${issueList.length}件 / ${sp?.length ?? 0}件`);
    for (const { slug, issues } of issueList) {
      console.log(`❌ ${slug}`);
      for (const i of issues) console.log(`   - ${i}`);
    }
  }
  console.log(`\nstudy_blog_posts 検査: ${sp?.length ?? 0}件`);

  console.log(`\n=== 合計問題件数: ${totalIssues} ===`);
  if (totalIssues > 0) process.exit(1);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
