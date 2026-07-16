/**
 * visa-bg サムネイル登録（Storage確認 → 圧縮 → DB設定）
 */
import { existsSync, readFileSync } from "fs";
import {
  prepareCompressedThumbnail,
  createSupabaseClient,
  THUMBNAIL_MAX_WIDTH,
  THUMBNAIL_MAX_BYTES,
} from "./utils/compress-thumbnail";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const sb = createSupabaseClient();
const TARGET_SLUG = "visa-bg";

async function listStorageFiles(): Promise<{ name: string; size: number }[]> {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/blog-images`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, apikey: KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ prefix: "", limit: 1000 }),
  });
  const data = (await res.json()) as { name: string; metadata: { size: number } }[];
  return (data ?? []).map(f => ({ name: f.name, size: f.metadata?.size ?? 0 }));
}

async function main() {
  console.log(`圧縮基準: 幅>${THUMBNAIL_MAX_WIDTH}px または >${Math.round(THUMBNAIL_MAX_BYTES / 1024)}KB → 圧縮\n`);

  // Storage から visa-bg.* を探す
  const files = await listStorageFiles();
  const bgFiles = files.filter(f => /^visa-bg\.(png|webp|jpg|jpeg)$/i.test(f.name));

  if (bgFiles.length === 0) {
    console.error("❌ Storage に visa-bg.{png,webp} が見つかりません。アップロードを確認してください。");
    process.exit(1);
  }
  if (bgFiles.length > 1) {
    console.log("⚠️  複数ファイル検出:");
    for (const f of bgFiles) console.log(`   ${f.name} (${Math.round(f.size / 1024)} KB)`);
  }

  const file = bgFiles[0];
  console.log(`対象ファイル: ${file.name} (${Math.round(file.size / 1024)} KB)`);

  // blog_posts.thumbnail の現状確認
  const { data: post, error } = await sb
    .from("blog_posts")
    .select("slug, thumbnail, is_published")
    .eq("slug", TARGET_SLUG)
    .single();
  if (error) { console.error("DB取得エラー:", error.message); process.exit(1); }
  if (!post) { console.error(`❌ blog_posts に ${TARGET_SLUG} が見つかりません`); process.exit(1); }
  if (post.thumbnail) {
    console.log(`⏭️  ${TARGET_SLUG} には既に thumbnail が設定済み: ${post.thumbnail}`);
    process.exit(0);
  }

  // 圧縮 → Storage 再アップ → URL 取得
  const result = await prepareCompressedThumbnail(sb, file.name, SUPABASE_URL);
  const sizeInfo = result.compressed
    ? `${Math.round(result.sizeBefore / 1024)}KB → ${Math.round(result.sizeAfter / 1024)}KB (${Math.round((1 - result.sizeAfter / result.sizeBefore) * 100)}%削減)`
    : `${Math.round(result.sizeBefore / 1024)}KB（圧縮不要）`;
  console.log(`${result.compressed ? "🗜️  圧縮" : "✅ 圧縮不要"}: ${sizeInfo}`);

  // DB 登録（thumbnail IS NULL 条件付き）
  const { error: dbErr } = await sb
    .from("blog_posts")
    .update({ thumbnail: result.url })
    .eq("slug", TARGET_SLUG)
    .is("thumbnail", null);
  if (dbErr) { console.error("DB更新エラー:", dbErr.message); process.exit(1); }

  console.log(`✅ ${TARGET_SLUG} → thumbnail 設定完了`);
  console.log(`   URL: ${result.url}`);

  // 最終確認: visa-guide / general-blog / simulator の thumbnail 未設定公開記事
  console.log("\n=== 全カテゴリ thumbnail 最終確認 ===");
  const { data: allPosts } = await sb
    .from("blog_posts")
    .select("slug, thumbnail, is_published")
    .eq("is_published", true)
    .order("slug");

  const noThumb = (allPosts ?? []).filter(p => !p.thumbnail);
  if (noThumb.length === 0) {
    console.log("✅ 公開記事 全件 thumbnail 設定済み");
  } else {
    console.log(`⚠️  thumbnail 未設定の公開記事: ${noThumb.length}件`);
    for (const p of noThumb) console.log(`   📌 ${p.slug}`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
