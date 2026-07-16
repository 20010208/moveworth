/**
 * blog_posts サムネイル一括登録
 * - Storage 画像があり、かつ blog_posts.thumbnail が NULL の公開記事のみ処理
 * - 既存 thumbnail は上書きしない（thumbnail IS NULL の場合のみ UPDATE）
 * - draft 記事（is_published=false）は対象外（報告のみ）
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

async function listStorageFiles(): Promise<{ name: string; size: number }[]> {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/blog-images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KEY}`,
      apikey: KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefix: "", limit: 1000 }),
  });
  const data = (await res.json()) as { name: string; metadata: { size: number } }[];
  return (data ?? []).map(f => ({ name: f.name, size: f.metadata?.size ?? 0 }));
}

function categorize(slug: string): string {
  if (/^visa-[a-z]{2,3}$/.test(slug)) return "visa-guide";
  if (/^simulator-/.test(slug)) return "simulator";
  return "general-blog";
}

async function main() {
  console.log(`圧縮基準: 幅>${THUMBNAIL_MAX_WIDTH}px または >${Math.round(THUMBNAIL_MAX_BYTES / 1024)}KB → 圧縮\n`);

  // Storage 全ファイル取得（study-* 除く）
  const allFiles = await listStorageFiles();
  const nonStudyFiles = allFiles.filter(f => !/^study-/i.test(f.name));
  const storageBySlug = new Map<string, string>(); // slug → filename
  for (const f of nonStudyFiles) {
    const slug = f.name.replace(/\.(png|webp|jpg|jpeg)$/i, "");
    // スペース含むファイル名（例: "foo (1).png"）は slug に使えないため除外
    if (/\s/.test(slug)) continue;
    storageBySlug.set(slug, f.name);
  }

  // blog_posts: 公開 + thumbnail 未設定のみ取得
  const { data: posts, error } = await sb
    .from("blog_posts")
    .select("slug, thumbnail, is_published")
    .order("slug");
  if (error) { console.error(error.message); process.exit(1); }
  const allPosts = posts ?? [];

  // ---- 処理対象の仕分け ----
  const toProcess = allPosts.filter(p =>
    p.is_published && !p.thumbnail && storageBySlug.has(p.slug)
  );
  const noStorage = allPosts.filter(p =>
    p.is_published && !p.thumbnail && !storageBySlug.has(p.slug)
  );
  const draftNoThumb = allPosts.filter(p =>
    !p.is_published && !p.thumbnail
  );

  console.log(`処理対象: ${toProcess.length}件（公開・thumbnail未設定・Storage画像あり）`);
  console.log(`Storage画像なし（要アップロード）: ${noStorage.length}件`);
  console.log(`draft・未設定（保留）: ${draftNoThumb.length}件\n`);

  // ---- 圧縮 → DB 登録 ----
  const processed: { slug: string; cat: string; compressed: boolean; sizeBefore: number; sizeAfter: number }[] = [];
  const errors: { slug: string; err: string }[] = [];

  for (const post of toProcess) {
    const filename = storageBySlug.get(post.slug)!;
    const cat = categorize(post.slug);
    try {
      const result = await prepareCompressedThumbnail(sb, filename, SUPABASE_URL);

      // thumbnail IS NULL を再確認してから UPDATE（競合防止）
      const { data: fresh } = await sb
        .from("blog_posts")
        .select("thumbnail")
        .eq("slug", post.slug)
        .single();
      if (fresh?.thumbnail) {
        console.log(`⏭️  ${post.slug}: thumbnail 設定済み（スキップ）`);
        continue;
      }

      const { error: dbErr } = await sb
        .from("blog_posts")
        .update({ thumbnail: result.url })
        .eq("slug", post.slug)
        .is("thumbnail", null);
      if (dbErr) throw new Error(`DB: ${dbErr.message}`);

      const mark = result.compressed ? "🗜️ " : "✅";
      const sizeInfo = result.compressed
        ? `${Math.round(result.sizeBefore / 1024)}KB→${Math.round(result.sizeAfter / 1024)}KB (${Math.round((1 - result.sizeAfter / result.sizeBefore) * 100)}%削減)`
        : `${Math.round(result.sizeBefore / 1024)}KB（圧縮不要）`;
      console.log(`${mark} [${cat}] ${post.slug.padEnd(56)} ${sizeInfo}`);
      processed.push({ slug: post.slug, cat, compressed: result.compressed, sizeBefore: result.sizeBefore, sizeAfter: result.sizeAfter });
    } catch (err) {
      console.error(`❌ ${post.slug}: ${(err as Error).message}`);
      errors.push({ slug: post.slug, err: (err as Error).message });
    }
  }

  // ---- サマリー ----
  console.log("\n=== カテゴリ別 処理結果 ===");
  const cats = new Map<string, { done: string[]; compressed: number }>();
  for (const p of processed) {
    if (!cats.has(p.cat)) cats.set(p.cat, { done: [], compressed: 0 });
    const c = cats.get(p.cat)!;
    c.done.push(p.slug);
    if (p.compressed) c.compressed++;
  }
  for (const [cat, c] of cats) {
    console.log(`  [${cat}] ${c.done.length}件完了（うち圧縮: ${c.compressed}件）`);
  }

  console.log("\n=== Storage画像なし（thumbnail未設定のまま残る公開記事）===");
  if (noStorage.length === 0) {
    console.log("  なし");
  } else {
    for (const p of noStorage) {
      console.log(`  📌 [${categorize(p.slug)}] ${p.slug}`);
    }
  }

  console.log("\n=== draft・thumbnail未設定（保留）===");
  if (draftNoThumb.length === 0) {
    console.log("  なし");
  } else {
    for (const p of draftNoThumb) {
      console.log(`  🔸 [${categorize(p.slug)}] ${p.slug}`);
    }
  }

  if (errors.length) {
    console.log(`\n=== エラー（${errors.length}件）===`);
    for (const e of errors) console.log(`  ❌ ${e.slug}: ${e.err}`);
  }

  console.log(`\n✅ 完了: ${processed.length}件 / ${toProcess.length}件対象`);
  if (errors.length > 0 || processed.length < toProcess.length) process.exit(1);
}

main().catch(e => { console.error(e); process.exit(1); });
