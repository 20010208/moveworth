/**
 * mets-virtual-office-overseas-japanese-guide-2026 のサムネイル設定
 * - Storage上の既存画像を prepareCompressedThumbnail で圧縮
 * - blog_posts.thumbnail のみターゲットパッチ更新（is_published等は変更しない）
 * - blog_postsにはstudy_blog_postsのようなthumbnail_ja/en/zh列は存在せず、
 *   単一のthumbnail列が全言語共通で使われる（OGPにも同じ列が使われる）
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
const SLUG = "mets-virtual-office-overseas-japanese-guide-2026";
const STORAGE_PATH = "Mets-Virtual-Office/mets-virtual-office-overseas-japanese-guide-2026.png";

async function main() {
  console.log("=== 画像圧縮 ===");
  const result = await prepareCompressedThumbnail(sb, STORAGE_PATH, SUPABASE_URL);
  console.log(
    `${STORAGE_PATH}: ${result.compressed ? "圧縮実施" : "圧縮不要（既定サイズ以下）"} ` +
      `(${Math.round(result.sizeBefore / 1024)}KB → ${Math.round(result.sizeAfter / 1024)}KB)`
  );
  console.log(`URL: ${result.url}\n`);

  const { data: before, error: beforeErr } = await sb
    .from("blog_posts")
    .select("slug, is_published, thumbnail, title, description, content")
    .eq("slug", SLUG)
    .single();
  if (beforeErr || !before) throw new Error(`取得失敗: ${beforeErr?.message}`);
  if (before.thumbnail !== null) {
    console.warn(`⚠️ thumbnailは既に設定済みでした（${before.thumbnail}）。上書きします。`);
  }

  assertBlogPayload({ title: before.title, description: before.description, content: before.content }, SLUG);

  const { error: updateErr } = await sb.from("blog_posts").update({ thumbnail: result.url }).eq("slug", SLUG);
  if (updateErr) throw new Error(`thumbnail更新失敗: ${updateErr.message}`);

  const { data: after, error: afterErr } = await sb
    .from("blog_posts")
    .select("slug, is_published, thumbnail, title, description, content")
    .eq("slug", SLUG)
    .single();
  if (afterErr || !after) throw new Error(`更新後取得失敗: ${afterErr?.message}`);

  if (after.is_published !== before.is_published) throw new Error("is_publishedが変化しています");
  if (JSON.stringify(after.title) !== JSON.stringify(before.title)) throw new Error("titleが変化しています");
  if (JSON.stringify(after.description) !== JSON.stringify(before.description)) throw new Error("descriptionが変化しています");
  if (JSON.stringify(after.content) !== JSON.stringify(before.content)) throw new Error("contentが変化しています");
  if (after.thumbnail !== result.url) throw new Error("thumbnailが期待値と一致しません");

  console.log(`✅ thumbnail設定完了 (is_published=${after.is_published} 不変)`);
  console.log(`   URL: ${result.url}`);
}

main().catch((e) => {
  console.error("❌", e.message ?? e);
  process.exit(1);
});
