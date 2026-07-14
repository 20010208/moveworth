/**
 * サムネイル一括登録スクリプト（blog_posts / study_blog_posts 共通）
 *
 * 圧縮ガード: DB 書き込み前に必ず compress-thumbnail.ts の guard を通す。
 *   MAX_WIDTH=1200px / MAX_BYTES=500KB を超える場合は自動圧縮してから URL を DB に書く。
 *
 * 新エントリ追加方法:
 *   - blog_posts 用 → blogEntries に追加（storagePath = バケット内パス）
 *   - study_blog_posts 用 → studyEntries に追加
 *   - 圧縮・アップロード・DB 書き込みは自動
 *
 * ※ study-* サムネイルの一括処理は set-study-thumbnails.ts を使うこと
 */
import { existsSync, readFileSync } from "fs";
import {
  prepareCompressedThumbnail,
  createSupabaseClient,
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

// --- エントリ定義 ---
// storagePath: Supabase Storage blog-images バケット内のパス（サブフォルダ含む）
// slug: 対象記事のスラグ

const blogEntries: { slug: string; storagePath: string }[] = [
  {
    slug: "freelancers-key-considerations-for-moving-abroad-2026",
    storagePath: "freelancers-key-considerations-for-moving-abroad-2026.png",
  },
  {
    slug: "visa-ro",
    storagePath: "visa-ro.png",
  },
  {
    slug: "building-wealth-a-case-study-of-a-dual-income-couple-in-2026",
    storagePath: "building-wealth-a-case-study-of-a-dual-income-couple-in-2026.png",
  },
];

const studyEntries: { slug: string; storagePath: string }[] = [
  { slug: "study-country-ro",                  storagePath: "study-country-ro.png" },
  { slug: "study-country-nz",                  storagePath: "study-country-nz.png" },
  { slug: "study-ro",                          storagePath: "study-ro.png" },
  { slug: "study-abroad-phone-sim-guide-2026", storagePath: "study-abroad-phone-sim-guide-2026.png" },
];

async function processEntry(
  slug: string,
  storagePath: string,
  table: "blog_posts" | "study_blog_posts",
): Promise<void> {
  const result = await prepareCompressedThumbnail(sb, storagePath, SUPABASE_URL);

  const sizeInfo = result.compressed
    ? `${Math.round(result.sizeBefore / 1024)}KB→${Math.round(result.sizeAfter / 1024)}KB`
    : `${Math.round(result.sizeBefore / 1024)}KB（圧縮不要）`;

  const { error } = await sb.from(table).update({ thumbnail: result.url }).eq("slug", slug);
  if (error) throw new Error(`DB: ${error.message}`);

  console.log(`✅ ${slug}  [${sizeInfo}]`);
}

async function run() {
  console.log("=== blog_posts ===");
  for (const { slug, storagePath } of blogEntries) {
    try {
      await processEntry(slug, storagePath, "blog_posts");
    } catch (err) {
      console.error(`❌ ${slug}: ${(err as Error).message}`);
    }
  }

  console.log("\n=== study_blog_posts ===");
  for (const { slug, storagePath } of studyEntries) {
    try {
      await processEntry(slug, storagePath, "study_blog_posts");
    } catch (err) {
      console.error(`❌ ${slug}: ${(err as Error).message}`);
    }
  }
}

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
