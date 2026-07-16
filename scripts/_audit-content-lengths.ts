/**
 * study_blog_posts と blog_posts の言語別コンテンツ分量調査
 * - study: ja/en 比率（en < ja の 50% を警告）
 * - blog:  ja/en/zh 比率（いずれかが ja の 50% 未満を警告）
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

function pct(a: number, base: number) {
  if (base === 0) return "N/A";
  return `${Math.round((a / base) * 100)}%`;
}

async function main() {
  // ===== study_blog_posts =====
  console.log("\n========== study_blog_posts（公開済み） ==========");
  const { data: study } = await sb
    .from("study_blog_posts")
    .select("slug, content")
    .eq("is_published", true)
    .order("slug");

  if (!study) { console.error("study fetch failed"); }
  else {
    const studyRows: { slug: string; ja: number; en: number; zh: number; pctEn: string; warn: boolean }[] = [];
    for (const r of study) {
      const c = (r.content ?? {}) as Record<string, string>;
      const ja = (c.ja ?? "").trim().length;
      const en = (c.en ?? "").trim().length;
      const zh = (c.zh ?? "").trim().length;
      const warn = ja > 0 && en < ja * 0.5;
      studyRows.push({ slug: r.slug, ja, en, zh, pctEn: pct(en, ja), warn });
    }
    const warnings = studyRows.filter(r => r.warn);
    console.log(`公開記事合計: ${studyRows.length}件`);
    console.log(`EN不足（ja比50%未満）: ${warnings.length}件\n`);
    for (const r of studyRows) {
      const flag = r.warn ? " ⚠️ EN不足" : "";
      const zhInfo = r.zh > 0 ? ` zh:${r.zh}` : " zh:なし";
      console.log(`${r.warn ? "❌" : "✅"} ${r.slug}`);
      console.log(`   ja:${r.ja} / en:${r.en}(${r.pctEn})${zhInfo}${flag}`);
    }
    if (warnings.length > 0) {
      console.log("\n--- EN不足リスト（50%未満）---");
      for (const r of warnings) {
        console.log(`  ${r.slug}: ja=${r.ja} en=${r.en}(${r.pctEn})`);
      }
    }
  }

  // ===== blog_posts =====
  console.log("\n========== blog_posts（公開済み） ==========");
  const { data: blog } = await sb
    .from("blog_posts")
    .select("slug, locales, content")
    .eq("is_published", true)
    .order("slug");

  if (!blog) { console.error("blog fetch failed"); }
  else {
    type Row = { slug: string; ja: number; en: number; zh: number; warns: string[] };
    const blogRows: Row[] = [];
    for (const r of blog) {
      const c = (r.content ?? {}) as Record<string, string>;
      const ja = (c.ja ?? "").trim().length;
      const en = (c.en ?? "").trim().length;
      const zh = (c.zh ?? "").trim().length;
      const locales = (r.locales as string[]) ?? [];
      const warns: string[] = [];
      if (locales.includes("en") && ja > 0 && en < ja * 0.5) warns.push(`EN:${pct(en,ja)}`);
      if (locales.includes("zh") && ja > 0 && zh < ja * 0.5) warns.push(`ZH:${pct(zh,ja)}`);
      blogRows.push({ slug: r.slug, ja, en, zh, warns });
    }
    const warnings = blogRows.filter(r => r.warns.length > 0);
    console.log(`公開記事合計: ${blogRows.length}件`);
    console.log(`分量不足あり: ${warnings.length}件\n`);
    for (const r of blogRows) {
      if (r.warns.length > 0) {
        console.log(`❌ ${r.slug}`);
        console.log(`   ja:${r.ja} / en:${r.en}(${pct(r.en,r.ja)}) / zh:${r.zh}(${pct(r.zh,r.ja)}) ⚠️ ${r.warns.join(" ")}`);
      }
    }
    console.log("\n--- 分量不足リスト ---");
    for (const r of warnings) {
      console.log(`  ${r.slug}: ja=${r.ja} en=${r.en} zh=${r.zh} [${r.warns.join(", ")}]`);
    }
  }

  console.log("\n=== 完了 ===");
}
main().catch(e => { console.error(e); process.exit(1); });
