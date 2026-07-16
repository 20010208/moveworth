/**
 * サムネイル設定バッチ（対象スラグ限定版）
 * 対象: study-work-{be,bg,cy,ee,hr,hu,pl,ro,tn,tr} + study-country-tr
 * 除外: study-work-me（draft記事のためDB反映保留）
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

const TARGET_SLUGS = new Set([
  "study-work-be",
  "study-work-bg",
  "study-work-cy",
  "study-work-ee",
  "study-work-hr",
  "study-work-hu",
  "study-work-pl",
  "study-work-ro",
  "study-work-tn",
  "study-work-tr",
  "study-country-tr",
]);

const SKIP_SLUGS = new Set(["study-work-me", "study-country-me"]);

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
  console.log(`圧縮基準: 幅>${THUMBNAIL_MAX_WIDTH}px または >${Math.round(THUMBNAIL_MAX_BYTES / 1024)}KB → 圧縮`);
  console.log(`対象スラグ: ${[...TARGET_SLUGS].join(", ")}`);
  console.log(`明示除外: ${[...SKIP_SLUGS].join(", ")}\n`);

  const images = await listStudyImages();
  const processed: string[] = [];
  const errors: string[] = [];

  for (const file of images) {
    const slug = file.name.replace(/\.(png|webp)$/i, "");

    if (SKIP_SLUGS.has(slug)) {
      console.log(`🚫 ${file.name} → ${slug} は保留リスト（スキップ）`);
      continue;
    }
    if (!TARGET_SLUGS.has(slug)) continue;

    try {
      const result = await prepareCompressedThumbnail(sb, file.name, SUPABASE_URL);
      const sizeInfo = result.compressed
        ? `${Math.round(result.sizeBefore / 1024)}KB → ${Math.round(result.sizeAfter / 1024)}KB (${Math.round((1 - result.sizeAfter / result.sizeBefore) * 100)}%削減)`
        : `${Math.round(result.sizeBefore / 1024)}KB（圧縮不要）`;

      const { error: dbErr } = await sb
        .from("study_blog_posts")
        .update({ thumbnail: result.url })
        .eq("slug", slug);
      if (dbErr) throw new Error(`DB: ${dbErr.message}`);

      const mark = result.compressed ? "🗜️ " : "✅";
      console.log(`${mark} ${slug.padEnd(28)} ${sizeInfo}`);
      processed.push(slug);
    } catch (err) {
      console.error(`❌ ${slug}: ${(err as Error).message}`);
      errors.push(slug);
    }
  }

  // 対象スラグのうち Storage 画像が見つからなかったもの
  const foundSlugs = new Set(
    images.map((f) => f.name.replace(/\.(png|webp)$/i, ""))
  );
  const notFound = [...TARGET_SLUGS].filter((s) => !foundSlugs.has(s) && !processed.includes(s));

  console.log("\n=== サマリー ===");
  console.log(`  ✅ 完了: ${processed.length}件 → ${processed.join(", ")}`);
  if (errors.length) console.log(`  ❌ エラー: ${errors.join(", ")}`);
  if (notFound.length) console.log(`  ⚠️  Storage に画像なし: ${notFound.join(", ")}`);
  if (processed.length === TARGET_SLUGS.size) {
    console.log(`\n✅ 全${TARGET_SLUGS.size}件 thumbnail 登録完了`);
  } else {
    console.log(`\n⚠️  ${processed.length}/${TARGET_SLUGS.size}件 完了（${TARGET_SLUGS.size - processed.length}件未処理）`);
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
