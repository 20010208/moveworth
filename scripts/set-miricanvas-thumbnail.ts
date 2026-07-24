/**
 * miricanvas-ai-presentation-guide-2026 のサムネイル設定（両サイト）
 * - Storage上の既存画像を prepareCompressedThumbnail で圧縮
 * - blog_posts.thumbnail / study_blog_posts.thumbnail_ja,en,zh のみターゲットパッチ
 * - is_published・title・description・contentは変更しない
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { prepareCompressedThumbnail } from "./utils/compress-thumbnail";
import { assertBlogPayload } from "./utils/validate-blog-payload";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SLUG = "miricanvas-ai-presentation-guide-2026";
const STORAGE_PATH = "MiriCanvas/miricanvas-ai-presentation-guide-2026.png";

async function main() {
  console.log("=== 画像圧縮 ===");
  const result = await prepareCompressedThumbnail(sb, STORAGE_PATH, SUPABASE_URL);
  console.log(
    `${STORAGE_PATH}: ${result.compressed ? "圧縮実施" : "圧縮不要（既定サイズ以下）"} ` +
      `(${Math.round(result.sizeBefore / 1024)}KB → ${Math.round(result.sizeAfter / 1024)}KB)`
  );
  console.log(`URL: ${result.url}\n`);

  // ---- blog_posts ----
  {
    const { data: before, error: beforeErr } = await sb
      .from("blog_posts")
      .select("slug, is_published, thumbnail, title, description, content")
      .eq("slug", SLUG)
      .single();
    if (beforeErr || !before) throw new Error(`blog_posts 取得失敗: ${beforeErr?.message}`);
    if (before.thumbnail !== null) {
      console.warn(`⚠️ blog_posts.thumbnail は既に設定済みでした（${before.thumbnail}）。上書きします。`);
    }

    assertBlogPayload({ title: before.title, description: before.description, content: before.content }, `${SLUG} (blog_posts)`);

    const { error: updateErr } = await sb.from("blog_posts").update({ thumbnail: result.url }).eq("slug", SLUG);
    if (updateErr) throw new Error(`blog_posts thumbnail更新失敗: ${updateErr.message}`);

    const { data: after, error: afterErr } = await sb
      .from("blog_posts")
      .select("slug, is_published, thumbnail, title, description, content")
      .eq("slug", SLUG)
      .single();
    if (afterErr || !after) throw new Error(`blog_posts 更新後取得失敗: ${afterErr?.message}`);

    if (after.is_published !== before.is_published) throw new Error("blog_posts: is_publishedが変化しています");
    if (JSON.stringify(after.title) !== JSON.stringify(before.title)) throw new Error("blog_posts: titleが変化しています");
    if (JSON.stringify(after.description) !== JSON.stringify(before.description)) throw new Error("blog_posts: descriptionが変化しています");
    if (JSON.stringify(after.content) !== JSON.stringify(before.content)) throw new Error("blog_posts: contentが変化しています");
    if (after.thumbnail !== result.url) throw new Error("blog_posts: thumbnailが期待値と一致しません");

    console.log(`✅ blog_posts: thumbnail設定完了 (is_published=${after.is_published} 不変)`);
  }

  // ---- study_blog_posts ----
  {
    const { data: before, error: beforeErr } = await sb
      .from("study_blog_posts")
      .select("slug, is_published, thumbnail, thumbnail_ja, thumbnail_en, thumbnail_zh, title, description, content")
      .eq("slug", SLUG)
      .single();
    if (beforeErr || !before) throw new Error(`study_blog_posts 取得失敗: ${beforeErr?.message}`);
    if (before.thumbnail_ja || before.thumbnail_en || before.thumbnail_zh) {
      console.warn("⚠️ study_blog_posts の thumbnail_ja/en/zh のいずれかが既に設定済みでした。上書きします。");
    }

    assertBlogPayload(
      { title: before.title, description: before.description, content: before.content, locales: ["ja", "en", "zh"] },
      `${SLUG} (study_blog_posts)`
    );

    const { error: updateErr } = await sb
      .from("study_blog_posts")
      .update({ thumbnail_ja: result.url, thumbnail_en: result.url, thumbnail_zh: result.url })
      .eq("slug", SLUG);
    if (updateErr) throw new Error(`study_blog_posts thumbnail更新失敗: ${updateErr.message}`);

    const { data: after, error: afterErr } = await sb
      .from("study_blog_posts")
      .select("slug, is_published, thumbnail, thumbnail_ja, thumbnail_en, thumbnail_zh, title, description, content")
      .eq("slug", SLUG)
      .single();
    if (afterErr || !after) throw new Error(`study_blog_posts 更新後取得失敗: ${afterErr?.message}`);

    if (after.is_published !== before.is_published) throw new Error("study_blog_posts: is_publishedが変化しています");
    if (JSON.stringify(after.title) !== JSON.stringify(before.title)) throw new Error("study_blog_posts: titleが変化しています");
    if (JSON.stringify(after.description) !== JSON.stringify(before.description)) throw new Error("study_blog_posts: descriptionが変化しています");
    if (JSON.stringify(after.content) !== JSON.stringify(before.content)) throw new Error("study_blog_posts: contentが変化しています");
    if (after.thumbnail_ja !== result.url || after.thumbnail_en !== result.url || after.thumbnail_zh !== result.url) {
      throw new Error("study_blog_posts: thumbnail_ja/en/zhが期待値と一致しません");
    }
    if (after.thumbnail !== before.thumbnail) throw new Error("study_blog_posts: 基本thumbnail列が意図せず変化しています");

    console.log(`✅ study_blog_posts: thumbnail_ja/en/zh設定完了 (is_published=${after.is_published} 不変)`);
  }

  console.log("\n✅ 両テーブル完了");
}

main().catch((e) => {
  console.error("❌", e.message ?? e);
  process.exit(1);
});
