/**
 * 構造不正レコード修復スクリプト（Step 3）
 *
 * 対象5件:
 *   1. why-i-built-moveworth-founder-story-2026.en → locales: ["en"]
 *   2. why-i-built-moveworth-founder-story-2026.cn → locales: ["zh"]
 *   3. moveworth-march-2026-update             → title.en = title.ja
 *   4. moveworth-march-2026-update-zh          → is_published: false
 *   5. moveworth-march-2026-update-en          → locales: ["en"] (en コンテンツ実在確認済み)
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

async function applyFix(slug: string, patch: Record<string, unknown>, description: string): Promise<void> {
  const { error } = await sb.from("blog_posts").update(patch).eq("slug", slug);
  if (error) {
    console.error(`  ❌ [${slug}] 失敗: ${error.message}`);
  } else {
    console.log(`  ✅ [${slug}] ${description}`);
  }
}

async function main() {
  console.log("=== 構造不正レコード修復 ===\n");

  // 1. founder-story .en → locales: ["en"]
  await applyFix(
    "why-i-built-moveworth-founder-story-2026.en",
    { locales: ["en"] },
    'locales: ["en"] を設定 (英語専用記事として明示)'
  );

  // 2. founder-story .cn → locales: ["zh"]
  await applyFix(
    "why-i-built-moveworth-founder-story-2026.cn",
    { locales: ["zh"] },
    'locales: ["zh"] を設定 (中国語専用記事として明示)'
  );

  // 3. march-update → title.en = title.ja
  const { data: marchUpdate } = await sb
    .from("blog_posts")
    .select("title")
    .eq("slug", "moveworth-march-2026-update")
    .single();
  if (marchUpdate?.title) {
    const title = marchUpdate.title as Record<string, string>;
    const titleJa = title.ja;
    if (titleJa) {
      await applyFix(
        "moveworth-march-2026-update",
        { title: { ...title, en: titleJa } },
        `title.en を title.ja からコピー ("${titleJa.slice(0, 40)}...")`
      );
    } else {
      console.log("  ⚠️  [moveworth-march-2026-update] title.ja が空 — スキップ");
    }
  }

  // 4. march-update-zh → is_published: false（全フィールド空文字）
  await applyFix(
    "moveworth-march-2026-update-zh",
    { is_published: false },
    "is_published: false に変更 (全フィールド空文字)"
  );

  // 5. march-update-en → locales: ["en"]（en コンテンツ実在確認済み）
  await applyFix(
    "moveworth-march-2026-update-en",
    { locales: ["en"] },
    'locales: ["en"] を設定 (英語専用記事として明示)'
  );

  console.log("\n=== 修復完了 ===");
}

main().catch(console.error);
