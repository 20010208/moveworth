/**
 * 参考資料セクション重複修正
 *
 * 公開記事で「### 参考資料 / References / 参考资料」が2個以上存在する記事について、
 * 最後（ラベル改善済み）のブロックのみ残し、それ以前のブロックを除去する。
 *
 * 使い方:
 *   npx tsx scripts/fix-duplicate-ref-sections.ts          # dry-run（DB書き込みなし）
 *   npx tsx scripts/fix-duplicate-ref-sections.ts --apply  # DB更新
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import { assertBlogPayload } from "./utils/validate-blog-payload";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const APPLY = process.argv.includes("--apply");

/** 参考資料見出し個数をカウント */
function countRefSections(text: string): number {
  return (text.match(/###\s*(?:参考資料|References|参考资料)/g) ?? []).length;
}

/**
 * 最初の参考資料ブロック（直前の --- セパレータ含む）より前の本文を返す。
 * 参考資料セクションがなければ元の text をそのまま返す。
 */
function bodyBeforeFirstRef(text: string): string {
  const re = /\n(?:---\n\n)?###\s*(?:参考資料|References|参考资料)/;
  const m = text.match(re);
  if (!m) return text;
  return text.slice(0, m.index!);
}

/**
 * 最後の参考資料ブロック（直前の --- セパレータ含む）から末尾までを返す。
 */
function extractLastRefBlock(text: string): string {
  const allMatches = [...text.matchAll(/###\s*(?:参考資料|References|参考资料)/g)];
  if (allMatches.length === 0) return "";
  const lastIdx = allMatches[allMatches.length - 1].index!;
  // 直前に "---\n\n" があれば含める（最大8文字前を確認）
  const lookback = text.slice(Math.max(0, lastIdx - 8), lastIdx);
  const dashMatch = lookback.match(/(\n---\n\n?)$/);
  const blockStart = dashMatch ? lastIdx - dashMatch[1].length : lastIdx;
  return text.slice(blockStart);
}

/** 重複参考資料を修正する。変更なしなら changed=false */
function fixDuplicateRefSections(text: string): { fixed: string; changed: boolean } {
  if (countRefSections(text) < 2) return { fixed: text, changed: false };

  const body = bodyBeforeFirstRef(text).trimEnd();
  const lastBlock = extractLastRefBlock(text);
  if (!lastBlock) return { fixed: text, changed: false };

  // lastBlock が "\n---\n\n### 参考資料..." または "### 参考資料..." で始まる
  const fixed = body + "\n\n" + lastBlock.replace(/^\n+/, "");
  return { fixed, changed: fixed !== text };
}

async function main() {
  const { data: posts, error } = await sb
    .from("blog_posts")
    .select("slug, content, locales, title, description")
    .eq("is_published", true)
    .order("slug");

  if (error) { console.error("取得エラー:", error.message); process.exit(1); }

  console.log(`=== 参考資料セクション重複修正 (公開記事 ${posts?.length ?? 0} 件) ===\n`);
  if (!APPLY) console.log("[DRY RUN] --apply を付けると DB が更新されます\n");

  let fixedCount = 0;
  let errCount = 0;
  const updates: Array<{ slug: string; content: Record<string, string> }> = [];

  for (const post of posts ?? []) {
    const content = post.content as Record<string, string> | null;
    if (!content) continue;

    let articleChanged = false;
    const newContent: Record<string, string> = { ...content };
    const logLines: string[] = [];

    for (const locale of ["ja", "en", "zh"] as const) {
      const text = content[locale];
      if (!text) continue;

      const result = fixDuplicateRefSections(text);
      if (!result.changed) continue;

      const before = countRefSections(text);
      const after = countRefSections(result.fixed);
      logLines.push(`  [${locale}] ${before}セクション → ${after}セクション に統合`);
      newContent[locale] = result.fixed;
      articleChanged = true;
    }

    if (!articleChanged) continue;

    console.log(`✏️  ${post.slug}`);
    for (const l of logLines) console.log(l);

    try {
      assertBlogPayload(
        { content: newContent, locales: post.locales as string[] | null },
        post.slug
      );
    } catch {
      console.error(`  ❌ バリデーション失敗 — スキップ`);
      errCount++;
      continue;
    }

    updates.push({ slug: post.slug, content: newContent });
    console.log();
  }

  console.log(`対象: ${updates.length} 件\n`);

  if (!APPLY) {
    console.log("=== DRY RUN 完了（DB未変更）===");
    return;
  }

  for (const u of updates) {
    const { error: upErr } = await sb
      .from("blog_posts")
      .update({ content: u.content })
      .eq("slug", u.slug)
      .eq("is_published", true);

    if (upErr) {
      console.error(`  ❌ ${u.slug}: ${upErr.message}`);
      errCount++;
    } else {
      console.log(`  ✅ ${u.slug}`);
      fixedCount++;
    }
  }

  console.log(`\n=== 完了: ${fixedCount}件修正, ${errCount}件エラー ===`);
  process.exit(errCount > 0 ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
