/**
 * Supabase Storage の blog-images バケット内の画像を圧縮して上書きアップロード
 * - PNG: 幅1200px以下にリサイズ + PNG圧縮レベル9
 * - WebP: 幅1200px以下にリサイズ + quality 82
 */
import { existsSync, readFileSync } from "fs";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    const val = t.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = "blog-images";
const MAX_WIDTH = 1200;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function listAllFiles(): Promise<{ name: string; size: number }[]> {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefix: "", limit: 300 }),
  });
  const data = (await res.json()) as { name: string; metadata: { size: number } }[];
  return data.map((f) => ({ name: f.name, size: f.metadata?.size ?? 0 }));
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function downloadFile(name: string, retries = 3): Promise<Buffer> {
  for (let i = 0; i < retries; i++) {
    const { data, error } = await supabase.storage.from(BUCKET).download(name);
    if (data) return Buffer.from(await data.arrayBuffer());
    if (i < retries - 1) await sleep(2000);
    else throw new Error(`Download failed: ${name} — ${error?.message}`);
  }
  throw new Error("unreachable");
}

async function uploadFileWithRetry(name: string, buf: Buffer, ext: string, retries = 3): Promise<void> {
  for (let i = 0; i < retries; i++) {
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(name, buf, { contentType: ext === "png" ? "image/png" : "image/webp", upsert: true });
    if (!error) return;
    if (i < retries - 1) await sleep(2000);
    else throw new Error(`Upload failed: ${name} — ${error.message}`);
  }
}

async function compress(buf: Buffer, ext: string): Promise<Buffer> {
  const img = sharp(buf).resize({ width: MAX_WIDTH, withoutEnlargement: true });
  if (ext === "png") {
    return img.png({ compressionLevel: 9, effort: 10 }).toBuffer();
  } else {
    return img.webp({ quality: 82, effort: 5 }).toBuffer();
  }
}


function fmtKB(bytes: number): string {
  return `${Math.round(bytes / 1024)} KB`;
}

async function run() {
  console.log("📋 ファイル一覧を取得中...");
  const files = await listAllFiles();

  // 画像ファイルのみ対象
  const images = files.filter((f) => /\.(png|webp)$/i.test(f.name));
  console.log(`対象: ${images.length} ファイル\n`);

  let totalBefore = 0;
  let totalAfter = 0;
  let skipped = 0;

  for (const file of images) {
    const ext = file.name.split(".").pop()!.toLowerCase();
    try {
      const original = await downloadFile(file.name);
      const compressed = await compress(original, ext);

      const before = original.length;
      const after = compressed.length;
      const ratio = Math.round((1 - after / before) * 100);

      if (after >= before) {
        console.log(`⏭  ${file.name} — スキップ（圧縮効果なし: ${fmtKB(before)}）`);
        skipped++;
        continue;
      }

      await uploadFileWithRetry(file.name, compressed, ext);
      await sleep(300);
      totalBefore += before;
      totalAfter += after;
      console.log(`✅ ${file.name}`);
      console.log(`   ${fmtKB(before)} → ${fmtKB(after)} (${ratio}% 削減)`);
    } catch (err) {
      console.error(`❌ ${file.name}: ${(err as Error).message}`);
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`合計削減量: ${fmtKB(totalBefore)} → ${fmtKB(totalAfter)} (${Math.round((1 - totalAfter / totalBefore) * 100)}% 削減)`);
  console.log(`スキップ: ${skipped} ファイル`);
}

run().catch(console.error);
