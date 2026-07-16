/**
 * study_blog_posts の content.en 実質内容チェック
 * ja と en の文字数比較、先頭100文字プレビュー付き
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
  const { data: posts, error } = await sb
    .from("study_blog_posts")
    .select("slug, is_published, content")
    .eq("is_published", true)
    .order("slug");
  if (error) { console.error(error.message); process.exit(1); }

  const rows = posts ?? [];
  console.log(`公開記事: ${rows.length}件\n`);

  type Row = { slug: string; jaLen: number; enLen: number; status: string; enPreview: string };
  const results: Row[] = [];

  for (const p of rows) {
    const c = p.content as Record<string, string> | null;
    const ja = c?.ja ?? "";
    const en = c?.en ?? "";
    const jaLen = ja.trim().length;
    const enLen = en.trim().length;

    let status: string;
    if (enLen === 0) {
      status = "❌ EN空";
    } else if (en.trim() === ja.trim()) {
      status = "❌ EN=JA（未翻訳コピー）";
    } else if (enLen < 200) {
      status = "⚠️  EN極端に短い";
    } else if (enLen < jaLen * 0.3) {
      status = "⚠️  EN不足（JA比30%未満）";
    } else if (enLen < jaLen * 0.6) {
      status = "⚠️  EN少ない（JA比60%未満）";
    } else {
      status = "✅";
    }

    results.push({
      slug: p.slug,
      jaLen,
      enLen,
      status,
      enPreview: en.trim().slice(0, 120).replace(/\n/g, " "),
    });
  }

  // 問題あり先出し
  const problems = results.filter(r => !r.status.startsWith("✅"));
  const ok = results.filter(r => r.status.startsWith("✅"));

  if (problems.length > 0) {
    console.log("=== 問題あり ===");
    for (const r of problems) {
      console.log(`  ${r.status} ${r.slug}`);
      console.log(`    JA:${r.jaLen}字 / EN:${r.enLen}字`);
      if (r.enLen > 0) console.log(`    EN先頭: ${r.enPreview}`);
    }
  }

  console.log(`\n=== 正常（✅）: ${ok.length}件 ===`);
  for (const r of ok) {
    console.log(`  ✅ ${r.slug.padEnd(40)} JA:${String(r.jaLen).padStart(5)} / EN:${String(r.enLen).padStart(5)}`);
  }

  console.log(`\n=== サマリー ===`);
  console.log(`  ✅ 正常: ${ok.length}件`);
  console.log(`  問題あり: ${problems.length}件`);
  const byStatus = new Map<string, number>();
  for (const r of problems) byStatus.set(r.status, (byStatus.get(r.status) ?? 0) + 1);
  for (const [s, n] of byStatus) console.log(`    ${s}: ${n}件`);
}
main().catch(e => { console.error(e); process.exit(1); });
