/**
 * 案C: study_blog_posts に thumbnail_ja / thumbnail_en / thumbnail_zh を移行
 *
 * 前提: Supabase SQL Editorで以下を実行済みであること
 *   ALTER TABLE study_blog_posts
 *     ADD COLUMN IF NOT EXISTS thumbnail_ja TEXT,
 *     ADD COLUMN IF NOT EXISTS thumbnail_en TEXT,
 *     ADD COLUMN IF NOT EXISTS thumbnail_zh TEXT;
 *
 * 実行後の状態:
 *   - study-country-{code}: thumbnail_ja=plain.png, thumbnail_en=-en.png(存在する場合), thumbnail_zh=null
 *   - それ以外: thumbnail_ja=現thumbnail, thumbnail_en=null, thumbnail_zh=null
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/`;

async function listStorageEnFiles(): Promise<Set<string>> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/list/blog-images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefix: "", limit: 500 }),
  });
  const data = (await res.json()) as { name: string }[];
  const enFiles = (data ?? [])
    .map((f) => f.name)
    .filter((n) => /^study-country-[a-z]+-en\.png$/i.test(n));
  console.log(`Storage -en.png files: ${enFiles.length}件`);
  enFiles.forEach((f) => console.log(`  ${f}`));
  return new Set(enFiles);
}

async function main() {
  const enFileSet = await listStorageEnFiles();
  console.log();

  // 全記事取得
  const { data: allPosts, error } = await sb.from("study_blog_posts")
    .select("slug,thumbnail")
    .order("slug");
  if (error || !allPosts) { console.error("取得失敗:", error?.message); process.exit(1); }

  console.log(`=== 移行対象: ${allPosts.length}件 ===\n`);

  let ok = 0, err = 0;

  for (const post of allPosts) {
    const slug = post.slug as string;
    const thumbnail = (post.thumbnail as string) ?? null;

    let update: Record<string, string | null> = {};

    if (/^study-country-[a-z]+$/.test(slug)) {
      // study-country-{code}: 言語別カラムを設定
      const code = slug.replace("study-country-", "");
      const plainUrl = `${BASE}study-country-${code}.png`;
      const enFileName = `study-country-${code}-en.png`;
      const enUrl = enFileSet.has(enFileName) ? `${BASE}${enFileName}` : null;

      update = {
        thumbnail_ja: plainUrl,
        thumbnail_en: enUrl,
        thumbnail_zh: null,
      };

      const label = enUrl ? `ja=${code}.png / en=-en.png` : `ja=${code}.png / en=null`;
      console.log(`  [country] ${slug}: ${label}`);
    } else {
      // その他: thumbnail_ja = 現在のthumbnail
      update = {
        thumbnail_ja: thumbnail,
        thumbnail_en: null,
        thumbnail_zh: null,
      };
      console.log(`  [other]   ${slug}: ja=${thumbnail ? "設定済み" : "null"}`);
    }

    const { error: upErr } = await sb.from("study_blog_posts")
      .update(update)
      .eq("slug", slug);

    if (upErr) {
      console.error(`  ❌ ${slug}: ${upErr.message}`);
      err++;
    } else {
      ok++;
    }
  }

  console.log(`\n=== 完了: ✅ ${ok}件 / ❌ ${err}件 ===`);

  if (err === 0) {
    // 検証
    const { data: check } = await sb.from("study_blog_posts")
      .select("slug,thumbnail_ja,thumbnail_en,thumbnail_zh")
      .ilike("slug", "study-country-%")
      .not("thumbnail_en", "is", null)
      .order("slug");
    console.log(`\nthumbnail_en 設定済み country記事: ${check?.length ?? 0}件`);
    check?.forEach((r) => {
      const en = (r.thumbnail_en as string ?? "").split("/").pop();
      console.log(`  ✅ ${r.slug}: ${en}`);
    });
  }
}
main().catch(e => { console.error(e); process.exit(1); });
