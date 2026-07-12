/**
 * blog_posts の全公開記事について多言語コンテンツ構造を検証する
 * 問題: content.ja / .en / .zh が undefined / null / 非文字列の記事を洗い出す
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
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ContentLike = Record<string, unknown> | null | undefined;

function diagnoseContent(slug: string, content: ContentLike): string[] {
  const issues: string[] = [];
  if (content === null || content === undefined) {
    issues.push("content自体がnull/undefined");
    return issues;
  }
  if (typeof content !== "object" || Array.isArray(content)) {
    issues.push(`content の型が不正: ${typeof content}`);
    return issues;
  }
  for (const lang of ["ja", "en", "zh"] as const) {
    const val = content[lang];
    if (val === undefined) {
      issues.push(`content.${lang} が undefined`);
    } else if (val === null) {
      issues.push(`content.${lang} が null`);
    } else if (typeof val !== "string") {
      issues.push(`content.${lang} の型が string でない: ${typeof val}`);
    } else if ((val as string).trim().length === 0) {
      issues.push(`content.${lang} が空文字列`);
    } else if ((val as string).length < 100) {
      issues.push(`content.${lang} が極端に短い (${(val as string).length}文字)`);
    }
  }
  return issues;
}

async function main() {
  console.log("=== blog_posts 公開記事 コンテンツ構造検証 ===\n");

  // is_published=true の全記事
  const { data: posts, error } = await sb
    .from("blog_posts")
    .select("slug, is_published, content, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) { console.error("取得エラー:", error.message); process.exit(1); }

  const rows = posts ?? [];
  console.log(`公開記事: ${rows.length}件\n`);

  const broken: Array<{ slug: string; published_at: string; issues: string[] }> = [];
  const ok: string[] = [];

  for (const row of rows) {
    const content = row.content as ContentLike;
    const issues = diagnoseContent(row.slug, content);
    if (issues.length > 0) {
      broken.push({ slug: row.slug, published_at: row.published_at, issues });
    } else {
      ok.push(row.slug);
    }
  }

  console.log(`✅ 正常: ${ok.length}件`);
  console.log(`❌ 異常: ${broken.length}件`);

  if (broken.length > 0) {
    console.log("\n--- 異常記事一覧 ---");
    for (const b of broken) {
      console.log(`\n[${b.slug}]  published_at: ${b.published_at}`);
      for (const issue of b.issues) {
        console.log(`  ⚠️  ${issue}`);
      }
    }
  }

  // 直近 24 時間に更新された記事のみ別掲示（今日の作業との突き合わせ用）
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const recentUpdated = rows.filter((r: { published_at: string }) => r.published_at > yesterday);
  if (recentUpdated.length > 0) {
    console.log(`\n--- 直近24時間に published_at が更新された公開記事 (${recentUpdated.length}件) ---`);
    for (const r of recentUpdated) {
      const issues = diagnoseContent(r.slug, r.content as ContentLike);
      const mark = issues.length > 0 ? "❌" : "✅";
      console.log(`  ${mark} ${r.slug}  (${r.published_at})`);
      if (issues.length > 0) issues.forEach((i) => console.log(`     ⚠️  ${i}`));
    }
  }

  // 全スラッグリスト（HTTP チェック用）
  console.log(`\n--- 全公開スラッグ (slugs for HTTP check) ---`);
  rows.forEach((r: { slug: string }) => console.log(r.slug));

  console.log("\n=== 完了 ===");
}

main().catch(console.error);
