/**
 * blog_posts のサムネイル現状監査
 * Storage 全ファイル vs blog_posts.thumbnail の突合
 */
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

async function listAllStorage(): Promise<{ name: string; size: number }[]> {
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
  if (/^study-/.test(slug)) return "study（別テーブル）";
  return "general-blog";
}

async function main() {
  const [storageFiles, { data: posts }] = await Promise.all([
    listAllStorage(),
    sb.from("blog_posts").select("slug, thumbnail, is_published, category").order("slug"),
  ]);

  const blogPosts = posts ?? [];

  // Storage ファイルを slug にマッピング（拡張子除去）
  const storageBySlug = new Map<string, { name: string; size: number }>();
  for (const f of storageFiles) {
    const slug = f.name.replace(/\.(png|webp|jpg|jpeg)$/i, "");
    storageBySlug.set(slug, f);
  }

  // DB のサムネイルURL → slug への逆引き（既存 thumbnail が設定済みかどうか）
  const hasThumbnail = new Set(blogPosts.filter(p => p.thumbnail).map(p => p.slug));

  console.log("=== Storage 全ファイル一覧（study-* 除く）===");
  const nonStudyFiles = storageFiles.filter(f => !/^study-/i.test(f.name));
  for (const f of nonStudyFiles.sort((a,b) => a.name.localeCompare(b.name))) {
    const slug = f.name.replace(/\.(png|webp|jpg|jpeg)$/i, "");
    const kb = Math.round(f.size / 1024);
    const inBlog = blogPosts.some(p => p.slug === slug);
    const thumbSet = hasThumbnail.has(slug);
    const status = !inBlog ? "⚠️  blog_postsにslugなし" : thumbSet ? "✅ 設定済み" : "📌 未設定";
    console.log(`  ${f.name.padEnd(60)} ${String(kb).padStart(6)} KB  ${status}`);
  }

  console.log("\n=== blog_posts カテゴリ別 thumbnail 状況 ===");
  const cats = new Map<string, { total: number; set: number; notSet: string[]; drafts: string[] }>();

  for (const p of blogPosts) {
    const cat = categorize(p.slug);
    if (!cats.has(cat)) cats.set(cat, { total: 0, set: 0, notSet: [], drafts: [] });
    const c = cats.get(cat)!;
    c.total++;
    if (p.thumbnail) {
      c.set++;
    } else if (p.is_published) {
      c.notSet.push(p.slug);
    } else {
      c.drafts.push(p.slug);
    }
  }

  for (const [cat, c] of [...cats.entries()].sort((a,b) => a[0].localeCompare(b[0]))) {
    console.log(`\n  [${cat}] 総数:${c.total} / 設定済み:${c.set} / 公開・未設定:${c.notSet.length} / draft・未設定:${c.drafts.length}`);
    if (c.notSet.length) {
      for (const s of c.notSet) console.log(`    📌 公開・未設定: ${s}`);
    }
    if (c.drafts.length) {
      for (const s of c.drafts) console.log(`    🔸 draft・未設定: ${s}`);
    }
  }

  // Storage にある非 study ファイルのうち blog_posts に slug がないもの
  const orphans = nonStudyFiles.filter(f => {
    const slug = f.name.replace(/\.(png|webp|jpg|jpeg)$/i, "");
    return !blogPosts.some(p => p.slug === slug);
  });
  if (orphans.length) {
    console.log(`\n=== Storage にあるが blog_posts に slug なし（マッチ不能）===`);
    for (const f of orphans) console.log(`  ⚠️  ${f.name}`);
  }

  // 対象：公開記事かつ thumbnail 未設定かつ Storage に画像あり
  const toProcess = blogPosts.filter(p =>
    p.is_published && !p.thumbnail && storageBySlug.has(p.slug)
  );
  console.log(`\n=== 処理対象サマリー ===`);
  console.log(`  Storage 全ファイル: ${storageFiles.length}件（うち非study: ${nonStudyFiles.length}件）`);
  console.log(`  blog_posts 公開記事: ${blogPosts.filter(p=>p.is_published).length}件`);
  console.log(`  → 公開・thumbnail未設定・Storage画像あり: ${toProcess.length}件`);
  for (const p of toProcess) {
    const f = storageBySlug.get(p.slug)!;
    console.log(`    ${p.slug.padEnd(50)} ${Math.round(f.size/1024)} KB`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
