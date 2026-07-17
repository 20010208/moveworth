/**
 * サムネイル一括設定:
 *  A. study-country-{code}-en.png (24件) → study_blog_posts slug=study-country-{code} に設定
 *  B. study-abroad-ielts-toefl-guide-2026.png → study_blog_posts に設定
 *  C. vietnam-visa-guide-2026.png → blog_posts に設定
 *
 * 全て圧縮パイプライン（compress-thumbnail.ts）経由。
 * 各画像は 2000〜2500KB と大幅に上限超過のため必ず圧縮発動。
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
const sb = createSupabaseClient();

async function listImages(): Promise<{ name: string; size: number }[]> {
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
  return (data ?? []).map((f) => ({ name: f.name, size: f.metadata?.size ?? 0 }));
}

async function setStudyThumbnail(storagePath: string, slug: string): Promise<void> {
  const result = await prepareCompressedThumbnail(sb, storagePath, SUPABASE_URL);
  const sizeInfo = result.compressed
    ? `${Math.round(result.sizeBefore / 1024)}KB → ${Math.round(result.sizeAfter / 1024)}KB (${Math.round((1 - result.sizeAfter / result.sizeBefore) * 100)}%削減)`
    : `${Math.round(result.sizeBefore / 1024)}KB（圧縮不要）`;
  const { error } = await sb.from("study_blog_posts").update({ thumbnail: result.url }).eq("slug", slug);
  if (error) throw new Error(`DB更新失敗 ${slug}: ${error.message}`);
  console.log(`  ✅ ${storagePath}  ${sizeInfo}`);
  console.log(`     → study_blog_posts[${slug}]`);
}

async function setBlogThumbnail(storagePath: string, slug: string): Promise<void> {
  const result = await prepareCompressedThumbnail(sb, storagePath, SUPABASE_URL);
  const sizeInfo = result.compressed
    ? `${Math.round(result.sizeBefore / 1024)}KB → ${Math.round(result.sizeAfter / 1024)}KB (${Math.round((1 - result.sizeAfter / result.sizeBefore) * 100)}%削減)`
    : `${Math.round(result.sizeBefore / 1024)}KB（圧縮不要）`;
  const { error } = await sb.from("blog_posts").update({ thumbnail: result.url }).eq("slug", slug);
  if (error) throw new Error(`DB更新失敗 ${slug}: ${error.message}`);
  console.log(`  ✅ ${storagePath}  ${sizeInfo}`);
  console.log(`     → blog_posts[${slug}]`);
}

async function main() {
  console.log(`\n圧縮基準: 幅>${THUMBNAIL_MAX_WIDTH}px または >${Math.round(THUMBNAIL_MAX_BYTES / 1024)}KB → 圧縮\n`);

  const allFiles = await listImages();
  const fileSet = new Set(allFiles.map((f) => f.name));

  // ─── A. study-country-{code}-en.png → study-country-{code} ─────────────────
  console.log("=== A. study-country-{code}-en.png → study_blog_posts ===");
  const enImages = allFiles.filter((f) => /^study-country-[a-z]+-en\.png$/i.test(f.name));
  console.log(`対象: ${enImages.length}件\n`);

  let aOk = 0, aErr = 0;
  for (const file of enImages) {
    // study-country-ae-en.png → code=ae → slug=study-country-ae
    const code = file.name.replace(/^study-country-/, "").replace(/-en\.png$/i, "");
    const slug = `study-country-${code}`;
    try {
      await setStudyThumbnail(file.name, slug);
      aOk++;
    } catch (err) {
      console.error(`  ❌ ${file.name}: ${(err as Error).message}`);
      aErr++;
    }
  }
  console.log(`\n  A 結果: ✅ ${aOk}件 / ❌ ${aErr}件\n`);

  // ─── B. study-abroad-ielts-toefl-guide-2026.png → study_blog_posts ─────────
  console.log("=== B. study-abroad-ielts-toefl-guide-2026.png ===");
  const ieltsSrc = "study-abroad-ielts-toefl-guide-2026.png";
  if (fileSet.has(ieltsSrc)) {
    try {
      await setStudyThumbnail(ieltsSrc, "study-abroad-ielts-toefl-guide-2026");
      console.log("  B 結果: ✅\n");
    } catch (err) {
      console.error(`  ❌ ${(err as Error).message}\n`);
    }
  } else {
    console.log(`  ⚠️  ${ieltsSrc} が Storage に見つかりません\n`);
  }

  // ─── C. vietnam-visa-guide-2026.png → blog_posts ───────────────────────────
  console.log("=== C. vietnam-visa-guide-2026.png ===");
  const vnSrc = "vietnam-visa-guide-2026.png";
  if (fileSet.has(vnSrc)) {
    try {
      await setBlogThumbnail(vnSrc, "vietnam-visa-guide-2026");
      console.log("  C 結果: ✅\n");
    } catch (err) {
      console.error(`  ❌ ${(err as Error).message}\n`);
    }
  } else {
    console.log(`  ⚠️  ${vnSrc} が Storage に見つかりません\n`);
  }

  console.log("=== 完了 ===");
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
