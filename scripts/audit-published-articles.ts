/**
 * 公開記事の「未反映仕様」を全件洗い出す。
 *
 * 検査項目:
 * 1. 参考資料: 生URL（非リンク）またはドメイン素通しラベルが残っている記事
 * 2. 税制: grounded/fallback 化されていない旧知識ベース数字が疑われる記事
 * 3. 免責・年度ラベル: シミュレーター記事の「架空モデルケース」明記漏れ
 * 4. 旧世代: published_at が古く force-regen を通っていない可能性がある記事
 *
 * 分類:
 * a) 意図的SKIP（BG/CN/CO/AR等ソース問題で保護中）
 * b) 修正可能（ソースはあるが未実行）
 * c) 要調査
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

// 定常コンテンツ（お知らせ・使い方系）: 旧世代チェック対象外
const AUDIT_EXEMPT_SLUGS = new Set([
  "moveworth-how-to-use",
  "moveworth-march-2026-update",
  "moveworth-march-2026-update-en",
  "moveworth-plan-guide-2026",
  "moveworth-roadmap-features",
  "moveworth-update-march-16-2026",
]);

// backlog で意図的 SKIP と記録されている国コード
const INTENTIONAL_SKIP_COUNTRIES = new Set([
  "bg", "cn", "co", "fi", // visa ソース全 SPA
  "ar", "mx", "tr", "tn", // ソース未取得（PDF / SPA 確定）
  "hu", "ro", "cy", "hr", // visa ソース未登録（backlog）
]);

// 有効な visa sources がある国コード（country_sources に alive visa が存在）
let countriesWithAliveSources: Set<string> = new Set();

type Lang = "ja" | "en" | "zh";

interface Article {
  slug: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string | null;
  // content カラム: {ja:"...", en:"...", zh:"..."} の JSON object
  content: Record<Lang, string> | null;
  // locales カラム: ["ja","en","zh"] のような言語コード配列（本文ではない）
  locales: string[] | null;
  category?: string;
}

// ============================================================
// 検査ヘルパー
// ============================================================

// 生URL（リンク化されていない https://...）が存在するか
function hasPlainUrl(content: string): boolean {
  // マークダウンリンクの URL は除外
  const stripped = content.replace(/\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g, "[LINK]");
  return /(?<!\()(https?:\/\/[^\s)\]"']{15,})/.test(stripped);
}

// ドメイン素通しラベルを検出: [example.com](https://...) のように label がドメイン名のみ
function hasDomainOnlyLabel(content: string): boolean {
  for (const m of content.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)) {
    const label = m[1].trim();
    // ラベルが純粋なドメイン名パターン: xxx.yyy.zzz
    if (/^[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[^\s]*)?$/i.test(label) && !label.includes(" ")) {
      return true;
    }
  }
  return false;
}

// 参考資料セクション以外の本文に具体的な税率数字が埋め込まれているか（旧知識ベース疑い）
function hasSuspectTaxNumbers(content: string): string[] {
  const lines = content.split("\n");
  const inRefSection = (i: number) => {
    for (let j = i; j >= 0; j--) {
      if (/^#{2,3}\s*(参考資料|References|参考资料)/.test(lines[j])) return true;
      if (/^#{2,3}/.test(lines[j]) && j < i) return false;
    }
    return false;
  };
  const suspicious: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (inRefSection(i)) continue;
    // 具体的なパーセンテージが本文中に登場し、かつその行に「税率」「income tax」「social」関連語
    if (/(\d{1,2}(?:\.\d)?\s*%)/.test(l) && /税率|所得税|社会保険|income.?tax|social.?security|contribution|bracket|rate/i.test(l)) {
      suspicious.push(l.slice(0, 100).trim());
    }
  }
  return suspicious;
}

// シミュレーター記事かどうか
function isSimulatorArticle(slug: string): boolean {
  return /^simulator-|^simulate-/.test(slug);
}

// 架空モデルケース明記があるか（ja/en/zh で異なる表現に対応）
function hasDisclaimerLabel(content: string): boolean {
  return /架空(?:のモデルケース|モデルケース)|fictional.{0,20}(?:model|case)|hypothetical.{0,20}(?:model|case)|虚构(?:模型案例|案例)/i.test(content);
}

// ============================================================

interface Finding {
  slug: string;
  category: "a" | "b" | "c";
  issues: string[];
  suggestion?: string;
}

async function main() {
  // alive visa sources がある国コードを取得
  const { data: srcData } = await sb.from("country_sources")
    .select("country_code").eq("status", "alive").eq("purpose", "visa");
  countriesWithAliveSources = new Set(
    (srcData ?? []).map((r: { country_code: string }) => r.country_code.toLowerCase())
  );

  // 全公開記事取得
  const { data: posts, error } = await sb
    .from("blog_posts")
    .select("slug, is_published, published_at, created_at, content, locales, category")
    .eq("is_published", true)
    .order("slug");
  if (error) { console.error("DB error:", error.message); process.exit(1); }

  const articles = (posts ?? []) as Article[];
  console.log(`公開記事: ${articles.length} 件\n`);

  const findings: Finding[] = [];
  const OLD_DATE_THRESHOLD = "2026-04-01"; // これ以前が「旧世代」

  for (const article of articles) {
    const slug = article.slug;
    // 定常コンテンツはスキップ（旧世代チェック不要）
    if (AUDIT_EXEMPT_SLUGS.has(slug)) continue;
    const countryCode = slug.replace(/^visa-|^simulator-country-|^study-country-/, "");
    const isIntentionalSkip = INTENTIONAL_SKIP_COUNTRIES.has(countryCode);
    const hasSources = countriesWithAliveSources.has(countryCode);

    const issues: string[] = [];

    // content カラムから本文を取得（locales は言語コード配列なので使わない）
    const jaContent = article.content?.ja ?? "";
    const enContent = article.content?.en ?? "";

    // --- 検査1: 参考資料ラベル ---
    if (hasPlainUrl(jaContent) || hasPlainUrl(enContent)) {
      issues.push("生URL（非リンク）が本文中に存在");
    }
    if (hasDomainOnlyLabel(jaContent) || hasDomainOnlyLabel(enContent)) {
      issues.push("ドメイン素通しラベルがリンクテキストに残存");
    }

    // --- 検査2: 税制セクション疑い ---
    const suspectLines = hasSuspectTaxNumbers(jaContent);
    if (suspectLines.length > 0) {
      issues.push(`税率数字が本文中に ${suspectLines.length} 行（旧知識ベース疑い）`);
    }

    // --- 検査3: 免責ラベル（シミュレーター記事のみ） ---
    if (isSimulatorArticle(slug)) {
      if (!hasDisclaimerLabel(jaContent) && !hasDisclaimerLabel(enContent)) {
        issues.push("架空モデルケース明記なし（シミュレーター記事）");
      }
    }

    // --- 検査4: 旧世代記事 ---
    const publishedAt = article.published_at ?? article.created_at ?? "";
    const isOld = publishedAt < OLD_DATE_THRESHOLD;
    if (isOld) {
      issues.push(`旧世代（published_at=${publishedAt.slice(0, 10)}）`);
    }

    if (issues.length === 0) continue;

    // --- 分類 ---
    let category: "a" | "b" | "c";
    let suggestion: string | undefined;

    if (isIntentionalSkip) {
      category = "a";
    } else if (hasSources && (issues.includes("生URL（非リンク）が本文中に存在") || issues.some(i => i.includes("ドメイン素通しラベル")) || isOld)) {
      category = "b";
      suggestion = `npx tsx scripts/generate-country-article.ts ${countryCode} --force-regenerate`;
    } else {
      category = "c";
    }

    findings.push({ slug, category, issues, suggestion });
  }

  // ============================================================
  // 出力
  // ============================================================
  const catA = findings.filter(f => f.category === "a");
  const catB = findings.filter(f => f.category === "b");
  const catC = findings.filter(f => f.category === "c");

  console.log(`=== a) 意図的 SKIP（${catA.length}件） ===`);
  for (const f of catA) {
    console.log(`  ${f.slug}`);
    for (const i of f.issues) console.log(`    - ${i}`);
  }

  console.log(`\n=== b) 修正可能（${catB.length}件） ===`);
  for (const f of catB) {
    console.log(`  ${f.slug}`);
    for (const i of f.issues) console.log(`    - ${i}`);
    if (f.suggestion) console.log(`    → ${f.suggestion}`);
  }

  console.log(`\n=== c) 要調査（${catC.length}件） ===`);
  for (const f of catC) {
    console.log(`  ${f.slug}`);
    for (const i of f.issues) console.log(`    - ${i}`);
  }

  console.log(`\n=== サマリー ===`);
  console.log(`  問題あり記事: ${findings.length} / ${articles.length}`);
  console.log(`  a) 意図的SKIP: ${catA.length}`);
  console.log(`  b) 修正可能:   ${catB.length}`);
  console.log(`  c) 要調査:     ${catC.length}`);
  console.log(`  問題なし:      ${articles.length - findings.length}`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
