import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

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
const SLUG = "saily-esim-review-overseas-travel-guide-2026";
const SRC = "C:\\Users\\chiji\\Downloads\\saily-esim-review-overseas-travel-guide-2026.png";
const STORAGE_PATH = "Saily/saily-esim-review-overseas-travel-guide-2026.png";

async function run() {
  const original = readFileSync(SRC);
  console.log(`元サイズ: ${Math.round(original.length / 1024)}KB`);

  const compressed = await sharp(original)
    .resize(1200, null, { withoutEnlargement: true })
    .png({ quality: 80, compressionLevel: 9 })
    .toBuffer();

  const saved = Math.round((1 - compressed.length / original.length) * 100);
  console.log(`✅ 圧縮: ${Math.round(original.length / 1024)}KB → ${Math.round(compressed.length / 1024)}KB (${saved}%削減)`);

  const { error: upErr } = await sb.storage
    .from("blog-images")
    .upload(STORAGE_PATH, compressed, { contentType: "image/png", upsert: true });
  if (upErr) { console.error("❌ アップロード失敗:", upErr.message); process.exit(1); }
  console.log("✅ Supabaseアップロード完了");

  const thumbnail = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/${STORAGE_PATH}`;

  const { error } = await sb.from("blog_posts").update({ thumbnail }).eq("slug", SLUG);
  if (error) { console.error("❌ DB更新失敗:", error.message); process.exit(1); }
  console.log("✅ サムネイル設定完了:", thumbnail);
}

run().catch(console.error);
