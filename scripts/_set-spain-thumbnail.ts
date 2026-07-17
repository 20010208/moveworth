/**
 * spain-digital-nomad-visa-guide-2026 サムネイル圧縮 + DB 設定
 * 基準: 500KB 以下 / 長辺 1200px 以下
 */
import { existsSync, readFileSync } from "fs";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = "blog-images";
const FILENAME = "spain-digital-nomad-visa-guide-2026.png";
const SLUG = "spain-digital-nomad-visa-guide-2026";
const MAX_SIZE_BYTES = 500 * 1024; // 500 KB
const MAX_WIDTH = 1200;

const sb = createClient(SUPABASE_URL, SERVICE_KEY);

async function main() {
  // 1. Storage からダウンロード
  const { data: blob, error: dlErr } = await sb.storage.from(BUCKET).download(FILENAME);
  if (dlErr || !blob) { console.error("❌ ダウンロード失敗:", dlErr?.message); process.exit(1); }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const original: Buffer = Buffer.from(await blob.arrayBuffer() as any);
  const originalKB = Math.round(original.length / 1024);
  console.log(`元サイズ: ${originalKB} KB`);

  let finalBuf: Buffer = original;
  let compressed = false;

  if (original.length > MAX_SIZE_BYTES) {
    console.log(`圧縮が必要（閾値 500KB 超）`);
    const meta = await sharp(original).metadata();
    console.log(`  元寸法: ${meta.width}×${meta.height}px`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    finalBuf = await sharp(original).resize({ width: MAX_WIDTH, withoutEnlargement: true }).png({ compressionLevel: 9, effort: 10 }).toBuffer() as any;

    const afterKB = Math.round(finalBuf.length / 1024);
    console.log(`圧縮後: ${afterKB} KB（${Math.round((1 - finalBuf.length / original.length) * 100)}% 削減）`);

    // 圧縮後も 500KB 超なら WebP に変換
    if (finalBuf.length > MAX_SIZE_BYTES) {
      console.log(`PNG 圧縮後も 500KB 超 → WebP 変換`);
      const webpFilename = FILENAME.replace(/\.png$/i, ".webp");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      finalBuf = await sharp(original).resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toBuffer() as any;
      const webpKB = Math.round(finalBuf.length / 1024);
      console.log(`WebP 変換後: ${webpKB} KB`);

      // WebP としてアップロード
      const { error: ulErr } = await sb.storage.from(BUCKET).upload(webpFilename, finalBuf, {
        contentType: "image/webp", upsert: true,
      });
      if (ulErr) { console.error("❌ WebP アップロード失敗:", ulErr.message); process.exit(1); }
      console.log(`✅ WebP アップロード完了: ${webpFilename}`);

      const thumbUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${webpFilename}`;
      const { error: dbErr } = await sb.from("blog_posts").update({ thumbnail: thumbUrl }).eq("slug", SLUG);
      if (dbErr) { console.error("❌ DB更新失敗:", dbErr.message); process.exit(1); }
      console.log(`✅ thumbnail 設定: ${thumbUrl}`);
      compressed = true;
      return;
    }

    // PNG 圧縮版をアップロード（上書き）
    const { error: ulErr } = await sb.storage.from(BUCKET).upload(FILENAME, finalBuf, {
      contentType: "image/png", upsert: true,
    });
    if (ulErr) { console.error("❌ PNG アップロード失敗:", ulErr.message); process.exit(1); }
    console.log(`✅ PNG 圧縮版アップロード完了`);
    compressed = true;
  } else {
    console.log(`圧縮不要（${originalKB} KB ≤ 500 KB）`);
  }

  // 2. DB thumbnail カラム設定
  const thumbUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${FILENAME}`;
  const { error: dbErr } = await sb.from("blog_posts").update({ thumbnail: thumbUrl }).eq("slug", SLUG);
  if (dbErr) { console.error("❌ DB更新失敗:", dbErr.message); process.exit(1); }
  console.log(`✅ thumbnail 設定: ${thumbUrl}`);

  console.log(`\n結果: ${compressed ? "圧縮発動" : "圧縮スキップ（閾値以下）"}`);
}
main().catch(e => { console.error(e); process.exit(1); });
