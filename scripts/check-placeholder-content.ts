/**
 * 公開記事のプレースホルダー本文を全件検査する。
 * content.en / content.zh が極端に短い or 定型文のみの記事をリストアップ。
 *
 * 使い方:
 *   npx tsx scripts/check-placeholder-content.ts
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PLACEHOLDER_PATTERNS = [
  /see (the )?japanese version/i,
  /日本語版をご覧ください/,
  /coming soon/i,
  /under construction/i,
  /準備中/,
  /placeholder/i,
  /translation (in progress|pending|not available)/i,
];

const SHORT_THRESHOLD = 300; // 300文字未満を「極端に短い」と判定

function isPlaceholder(text: string | null | undefined): { yes: boolean; reason: string } {
  if (!text) return { yes: true, reason: "null" };
  const t = text.trim();
  if (t.length === 0) return { yes: true, reason: "空文字" };
  if (t.length < SHORT_THRESHOLD) {
    // 定型文パターンも確認
    const matched = PLACEHOLDER_PATTERNS.find(p => p.test(t));
    if (matched) return { yes: true, reason: `定型文: "${t.slice(0, 80)}"` };
    return { yes: true, reason: `短すぎる (${t.length}字)` };
  }
  const matched = PLACEHOLDER_PATTERNS.find(p => p.test(t));
  if (matched) return { yes: true, reason: `定型文パターン (${t.length}字)` };
  return { yes: false, reason: "" };
}

async function main() {
  const { data: posts, error } = await sb
    .from("blog_posts")
    .select("slug, content, locales")
    .eq("is_published", true)
    .order("slug");
  if (error) { console.error(error.message); process.exit(1); }

  const articles = posts ?? [];
  console.log(`公開記事: ${articles.length} 件\n`);

  const findings: { slug: string; langs: string[]; reasons: Record<string, string> }[] = [];

  for (const article of articles) {
    const content = article.content as Record<string, string> | null;
    const jaText = content?.ja ?? null;
    const enText = content?.en ?? null;
    const zhText = content?.zh ?? null;

    const enCheck = isPlaceholder(enText);
    const zhCheck = isPlaceholder(zhText);

    if (!enCheck.yes && !zhCheck.yes) continue;

    const langs: string[] = [];
    const reasons: Record<string, string> = {};
    if (enCheck.yes) { langs.push("en"); reasons.en = enCheck.reason; }
    if (zhCheck.yes) { langs.push("zh"); reasons.zh = zhCheck.reason; }

    // ja が存在するかも確認（ja がないと翻訳元がない）
    const jaCheck = isPlaceholder(jaText);
    if (jaCheck.yes) { langs.push("ja"); reasons.ja = jaCheck.reason; }

    findings.push({ slug: article.slug, langs, reasons });
  }

  console.log(`=== プレースホルダー本文検出: ${findings.length} 件 ===\n`);
  for (const f of findings) {
    console.log(`  ${f.slug}`);
    for (const lang of f.langs) {
      console.log(`    [${lang}] ${f.reasons[lang]}`);
    }
  }

  if (findings.length === 0) {
    console.log("  プレースホルダーなし（全記事 3言語とも本文あり）");
  }

  console.log(`\n=== サマリー ===`);
  console.log(`EN プレースホルダー: ${findings.filter(f => f.langs.includes("en")).length} 件`);
  console.log(`ZH プレースホルダー: ${findings.filter(f => f.langs.includes("zh")).length} 件`);
  console.log(`JA プレースホルダー: ${findings.filter(f => f.langs.includes("ja")).length} 件`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
