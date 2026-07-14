/**
 * Study サイト用サムネイル一括圧縮・登録スクリプト
 *
 * 前提: Supabase Storage の blog-images バケットに study-*.png / study-*.webp が
 *       アップロード済みであること（アップロードは手動）
 *
 * 処理フロー（compress-thumbnail.ts の guard を通るため、圧縮スキップ不可）:
 *   Storage image → compress if > 500KB or > 1200px → upload → set study_blog_posts.thumbnail
 *
 * 定数（scripts/utils/compress-thumbnail.ts 参照）:
 *   MAX_WIDTH  = 1200px
 *   MAX_BYTES  = 500KB
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
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const sb = createSupabaseClient();

async function listStudyImages(): Promise<{ name: string; size: number }[]> {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/blog-images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefix: "", limit: 500 }),
  });
  const data = (await res.json()) as { name: string; metadata: { size: number } }[];
  return (data ?? [])
    .filter((f) => /^study-.+\.(png|webp)$/i.test(f.name))
    .map((f) => ({ name: f.name, size: f.metadata?.size ?? 0 }));
}

async function main() {
  console.log(`\n圧縮基準: 幅>${THUMBNAIL_MAX_WIDTH}px または >${Math.round(THUMBNAIL_MAX_BYTES / 1024)}KB → 圧縮`);

  // 1. Storage の study-* ファイル一覧
  console.log("\n📋 Storage study-* ファイル取得中...");
  const images = await listStudyImages();
  console.log(`→ ${images.length} 件\n`);

  // 2. study_blog_posts の全slug取得
  const { data: posts, error } = await sb
    .from("study_blog_posts")
    .select("slug, thumbnail, is_published")
    .order("slug");
  if (error) { console.error(error.message); process.exit(1); }
  const slugSet = new Set((posts ?? []).map((p) => p.slug));

  // 3. 圧縮 → アップロード → DB 登録
  const processed = new Set<string>();

  for (const file of images) {
    const slug = file.name.replace(/\.(png|webp)$/i, "");

    if (!slugSet.has(slug)) {
      console.log(`⚠️  ${file.name} → "${slug}" は study_blog_posts に存在しない（スキップ）`);
      continue;
    }

    try {
      const result = await prepareCompressedThumbnail(sb, file.name, SUPABASE_URL);

      const sizeInfo = result.compressed
        ? `${Math.round(result.sizeBefore / 1024)}KB → ${Math.round(result.sizeAfter / 1024)}KB (${Math.round((1 - result.sizeAfter / result.sizeBefore) * 100)}%削減)`
        : `${Math.round(result.sizeBefore / 1024)}KB（圧縮不要）`;
      console.log(`✅ ${file.name}  ${sizeInfo}`);

      const { error: dbErr } = await sb
        .from("study_blog_posts")
        .update({ thumbnail: result.url })
        .eq("slug", slug);
      if (dbErr) throw new Error(`DB: ${dbErr.message}`);

      console.log(`   → ${slug}`);
      processed.add(slug);
    } catch (err) {
      console.error(`❌ ${file.name}: ${(err as Error).message}`);
    }
  }

  // 4. サムネイルなし slug の報告
  const noThumbnail = (posts ?? []).filter((p) => !processed.has(p.slug) && !p.thumbnail);
  const hasThumbnailNotProcessed = (posts ?? []).filter((p) => !processed.has(p.slug) && p.thumbnail);

  console.log("\n=== サマリー ===");
  console.log(`  Storage→DB 登録完了: ${processed.size}件`);
  if (noThumbnail.length) {
    console.log(`\n  ⚠️  サムネイル未設定（Storage に画像なし）: ${noThumbnail.length}件`);
    for (const p of noThumbnail) {
      console.log(`    - ${p.slug} (is_published=${p.is_published})`);
    }
  }
  if (hasThumbnailNotProcessed.length) {
    console.log(`\n  ℹ️  既存サムネあり（今回未処理）: ${hasThumbnailNotProcessed.length}件`);
    for (const p of hasThumbnailNotProcessed) {
      console.log(`    - ${p.slug}`);
    }
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
