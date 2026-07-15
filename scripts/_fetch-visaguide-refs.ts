/**
 * visa-guide 8件の参考資料セクションと本文中URLを調査する（読み取り専用）
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(); if (!(k in process.env)) process.env[k] = t.slice(eq + 1).trim();
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const SLUGS = [
  "malaysia-mm2h-visa-complete-guide-2026",
  "greece-residency-visa-cost-2026",
  "thailand-ltr-visa-guide-2026",
  "dubai-uae-golden-visa-guide-2026",
  "singapore-ep-employment-pass-guide-2026",
  "new-zealand-skilled-migrant-visa-guide-2026",
  "canada-express-entry-guide-2026",
  "australia-skilled-independent-visa-189-guide-2026",
];

const RAW_URL_RE = /(?<![(\[])https?:\/\/[^\s)\]'">,]+/g;

async function main() {
  const { data } = await sb.from("blog_posts").select("slug, is_published, content").in("slug", SLUGS);
  const rows = data ?? [];

  for (const slug of SLUGS) {
    const row = rows.find((r: { slug: string }) => r.slug === slug);
    if (!row) { console.log(`\n❌ NOT FOUND: ${slug}`); continue; }

    const c = row.content as Record<string, string>;
    const ja = c.ja ?? "";

    // 参考資料セクション検出
    const refMatch = ja.match(/\n---\n\n###\s*参考資料[^\n]*\n[^\n]*\n([\s\S]*)$/);
    const altRefMatch = ja.match(/###\s*参考資料[^\n]*\n([\s\S]*)$/);

    // 参考資料外の本文
    const bodyEnd = ja.search(/\n---\n\n###\s*参考資料/);
    const bodyText = bodyEnd > 0 ? ja.slice(0, bodyEnd) : ja;

    // 本文中の生URL（リンク外）
    const bodyRawUrls = [...(bodyText.matchAll(RAW_URL_RE) ?? [])].map(m => m[0]);

    // 参考資料セクションのリスト行
    const refSection = refMatch ? refMatch[1] : (altRefMatch ? altRefMatch[1] : null);
    const refLines = refSection ? refSection.split("\n").filter(l => l.trim().startsWith("-")) : [];

    // 重複URL検出（末尾スラッシュ正規化後）
    const normalizedUrls: string[] = [];
    const seenNorm = new Map<string, string>();
    const dupLines: string[] = [];
    for (const line of refLines) {
      const urlMatch = line.match(/https?:\/\/[^\s)\]'">,]+/);
      if (!urlMatch) continue;
      const url = urlMatch[0];
      const norm = url.replace(/\/+$/, "");
      if (seenNorm.has(norm)) { dupLines.push(`  DUP: "${url}" ← 既出 "${seenNorm.get(norm)}"`); }
      else { seenNorm.set(norm, url); }
      normalizedUrls.push(url);
    }

    // 生URL行（リンク化されていない）
    const rawRefUrls = refLines.filter(l => !l.match(/\[[^\]]+\]\(https?:/));

    console.log(`\n${"=".repeat(70)}`);
    console.log(`SLUG: ${slug}`);
    console.log(`is_published: ${row.is_published}`);
    console.log(`参考資料セクション検出: ${refMatch ? "✅ 正規形式 (---\\n\\n### 参考資料)" : altRefMatch ? "⚠️ 代替形式 (### 参考資料のみ)" : "❌ 未検出"}`);
    console.log(`参考資料行数: ${refLines.length}`);

    if (dupLines.length > 0) {
      console.log(`URL重複: ${dupLines.length}件`);
      dupLines.forEach(d => console.log(d));
    } else { console.log(`URL重複: なし`); }

    if (rawRefUrls.length > 0) {
      console.log(`生URL行（リンク化なし）: ${rawRefUrls.length}件`);
      rawRefUrls.forEach(l => console.log(`  ${l.trim()}`));
    } else { console.log(`生URL行: なし`); }

    if (bodyRawUrls.length > 0) {
      console.log(`本文中の生URL: ${bodyRawUrls.length}件`);
      bodyRawUrls.forEach(u => console.log(`  ${u}`));
    } else { console.log(`本文中の生URL: なし`); }

    // 参考資料セクション全行表示
    if (refLines.length > 0) {
      console.log(`参考資料行一覧:`);
      refLines.forEach(l => console.log(`  ${l.trim()}`));
    }
  }
}
main().catch(e => { console.error(e); process.exit(1); });
