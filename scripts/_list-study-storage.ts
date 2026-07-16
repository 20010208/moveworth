import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim();
    if (!(k in process.env)) process.env[k] = t.slice(eq + 1).trim();
  }
}
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const sb = createClient(SUPABASE_URL, KEY);

async function main() {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/blog-images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KEY}`,
      apikey: KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefix: "", limit: 500 }),
  });
  const data = (await res.json()) as { name: string; metadata: { size: number } }[];
  const studyFiles = (data ?? [])
    .filter(f => /^study-.+\.(png|webp)$/i.test(f.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  console.log(`Storage study-* ファイル: ${studyFiles.length} 件\n`);
  for (const f of studyFiles) {
    const kb = Math.round((f.metadata?.size ?? 0) / 1024);
    console.log(`  ${f.name.padEnd(40)} ${String(kb).padStart(6)} KB`);
  }

  // study_blog_posts の thumbnail 現状も確認
  const { data: posts } = await sb
    .from("study_blog_posts")
    .select("slug, thumbnail, is_published")
    .order("slug");
  const thumbSet = new Set(
    (posts ?? []).filter(p => p.thumbnail).map(p => p.slug)
  );

  // Storage→slug マッピングと DB 状態
  console.log("\n--- slug マッピング確認 ---");
  for (const f of studyFiles) {
    const slug = f.name.replace(/\.(png|webp)$/i, "");
    const inDb = (posts ?? []).some(p => p.slug === slug);
    const hasThumbnail = thumbSet.has(slug);
    const status = !inDb ? "⚠️  DB に slug なし" : hasThumbnail ? "✅ thumbnail 設定済み" : "📌 thumbnail 未設定";
    console.log(`  ${f.name.padEnd(40)} → ${slug.padEnd(28)} ${status}`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
