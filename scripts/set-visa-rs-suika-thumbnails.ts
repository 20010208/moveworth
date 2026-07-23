/**
 * サムネ未設定の2記事（visa-rs / suika-vpn-...）へ、新規アップロード画像を設定する
 * - scripts/utils/compress-thumbnail.ts の共通関数で圧縮→アップロード→URL取得
 * - blog_posts.thumbnail のみをターゲットパッチ更新（is_published等は変更しない）
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

const TARGETS: { slug: string; storagePath: string }[] = [
  { slug: "visa-rs", storagePath: "visa-rs.png" },
  {
    slug: "suika-vpn-overseas-japanese-streaming-guide-2026",
    storagePath: "Suika/suika-vpn-overseas-japanese-streaming-guide-2026.png",
  },
];

async function main() {
  for (const { slug, storagePath } of TARGETS) {
    console.log(`\n=== ${slug} ===`);

    const { data: before, error: beforeErr } = await sb
      .from("blog_posts")
      .select("slug, is_published, thumbnail, title, description, content")
      .eq("slug", slug)
      .single();
    if (beforeErr || !before) {
      console.error(`❌ レコード取得失敗 (${slug}):`, beforeErr?.message);
      process.exit(1);
    }
    if (before.thumbnail !== null) {
      console.error(`❌ ${slug} は既にthumbnailが設定済みです（${before.thumbnail}）。想定外のため中断します。`);
      process.exit(1);
    }
    console.log(`公開前確認: is_published=${before.is_published}, thumbnail=null`);

    const result = await prepareCompressedThumbnail(sb, storagePath, SUPABASE_URL);
    console.log(
      `画像: ${storagePath} — ${result.compressed ? "圧縮実施" : "圧縮不要（既定サイズ以下）"} ` +
        `(${Math.round(result.sizeBefore / 1024)}KB → ${Math.round(result.sizeAfter / 1024)}KB)`
    );

    // DB書き込み前のassertBlogPayload（title/description/contentは変更しないが、既存値の健全性を確認）
    assertBlogPayload(
      { title: before.title, description: before.description, content: before.content },
      slug
    );

    const { error: updateErr } = await sb.from("blog_posts").update({ thumbnail: result.url }).eq("slug", slug);
    if (updateErr) {
      console.error(`❌ thumbnail更新失敗 (${slug}):`, updateErr.message);
      process.exit(1);
    }

    const { data: after, error: afterErr } = await sb
      .from("blog_posts")
      .select("slug, is_published, thumbnail, title, description, content")
      .eq("slug", slug)
      .single();
    if (afterErr || !after) {
      console.error(`❌ 更新後レコード取得失敗 (${slug}):`, afterErr?.message);
      process.exit(1);
    }

    if (after.is_published !== before.is_published) {
      console.error(`❌ ${slug}: is_publishedが変化しています（${before.is_published} → ${after.is_published}）`);
      process.exit(1);
    }
    if (JSON.stringify(after.title) !== JSON.stringify(before.title)) {
      console.error(`❌ ${slug}: titleが変化しています`);
      process.exit(1);
    }
    if (JSON.stringify(after.description) !== JSON.stringify(before.description)) {
      console.error(`❌ ${slug}: descriptionが変化しています`);
      process.exit(1);
    }
    if (JSON.stringify(after.content) !== JSON.stringify(before.content)) {
      console.error(`❌ ${slug}: contentが変化しています`);
      process.exit(1);
    }
    if (after.thumbnail !== result.url) {
      console.error(`❌ ${slug}: thumbnailが期待値と一致しません`);
      process.exit(1);
    }

    console.log(`✅ ${slug}: thumbnail設定完了、is_published/title/description/content不変を確認`);
    console.log(`   URL: ${result.url}`);
  }

  console.log("\n✅ 全対象完了");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
