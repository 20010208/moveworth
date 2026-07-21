/**
 * validate-simulator-blog.ts
 *
 * シミュレーターとビザ記事の整合性検証
 *
 * 1. カバレッジ: country_presets の国コード vs visa 記事 50 カ国
 * 2. 税率乖離: defaultTaxRate vs 記事の税制セクションから抽出した最上位実効税率
 *    （>5pt 乖離をフラグ）
 * 3. referenceRent / referenceLivingCost が 0 or null の国
 * 4. study-site/simulate/page.tsx の toJPY に登録されていない通貨
 *
 * Usage:
 *   npx tsx scripts/validate-simulator-blog.ts
 */

import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import { countryPresets } from "../src/data/country-presets";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// country-presets.ts を唯一の正とし、税率・家賃・生活費・通貨の同期漏れを防ぐ。
const PRESETS = countryPresets;

// study-site/simulate/page.tsx の toJPY（コードから読む）
const TO_JPY: Record<string, number> = {
  JPY: 1, USD: 145, GBP: 184, EUR: 157, AUD: 94, CAD: 107, NZD: 86,
  SGD: 109, MYR: 33, KRW: 0.11, THB: 4.1, TWD: 4.5, PHP: 2.5, HKD: 18.6,
  IDR: 0.0089, VND: 0.0057, CNY: 20, CHF: 166, SEK: 14, NOK: 14, DKK: 21,
  AED: 39, GEL: 53, BRL: 26, COP: 0.035, ARS: 0.11, TRY: 3.5, CZK: 6.8,
  PLN: 37, INR: 1.73, MXN: 7.3, ZAR: 8.0, TND: 47,
};

// ===== 税率比較のための知識ベース参照税率 =====
// 各国の「標準的な中所得者（移住者が典型的に適用される）の実効税率・最上位税率」
// source-groundedの記事から読み取った代表的な数値
// これは自動抽出ではなく「grounded記事の税制セクションから筆者が確認した数値」
const GROUNDED_TAX_RATES: Record<string, { rate: number; note: string }> = {
  // 実効税率（中〜高所得者）または最低ブラケット〜最上位の中間
  AE: { rate: 0.00, note: "no income tax" },
  AQ: { rate: 0.00, note: "N/A" },
  AU: { rate: 0.32, note: "32.5% bracket (ATO 2025-26)" },
  BE: { rate: 0.50, note: "top rate 50%" },
  BG: { rate: 0.10, note: "flat 10% (knowledge-based)" },
  BR: { rate: 0.275, note: "top rate 27.5% (source 2026)" },
  CA: { rate: 0.33, note: "top federal 33%" },
  CH: { rate: 0.25, note: "approx federal 11.5% + cantonal; combined ~25-35%" },
  CN: { rate: 0.20, note: "middle brackets 20-25% for typical expat income" },
  CO: { rate: 0.28, note: "28% for UVT 1700-4100 bracket (Art.241)" },
  CZ: { rate: 0.15, note: "flat 15% (+7% solidarity above limit)" },
  DE: { rate: 0.42, note: "42% bracket above €69,879 (knowledge-based §32a)" },
  DK: { rate: 0.45, note: "approx 45% combined municipal+national" },
  EE: { rate: 0.20, note: "flat 20%" },
  ES: { rate: 0.30, note: "30% bracket for typical mid income" },
  FI: { rate: 0.38, note: "approx 38% combined" },
  FR: { rate: 0.30, note: "30% bracket" },
  GB: { rate: 0.40, note: "40% higher rate" },
  GE: { rate: 0.20, note: "flat 20% (knowledge-based)" },
  GR: { rate: 0.28, note: "28% bracket" },
  HK: { rate: 0.15, note: "standard rate 15%" },
  HR: { rate: 0.25, note: "municipal 25-33% range; standard 30%" },
  HU: { rate: 0.15, note: "flat 15%" },
  ID: { rate: 0.25, note: "25% for Rp250M-500M (PPh21 post-HPP)" },
  IE: { rate: 0.40, note: "40% higher rate" },
  IN: { rate: 0.20, note: "20% bracket for ₹16L-₹20L (AY2026-27 new regime)" },
  IT: { rate: 0.33, note: "33% second bracket (2025 budget law)" },
  JP: { rate: 0.33, note: "33% for ¥9M-18M (national); +10% local ≈43% total" },
  KR: { rate: 0.28, note: "approx 28% for mid-high income" },
  MT: { rate: 0.35, note: "top 35%" },
  MX: { rate: 0.25, note: "25% bracket" },
  MY: { rate: 0.20, note: "20-24% bracket" },
  NL: { rate: 0.4995, note: "Box 1 top rate 49.95%" },
  NO: { rate: 0.35, note: "22% + trinnskatt ≈35% for typical income" },
  NZ: { rate: 0.30, note: "30% bracket NZD70K-180K" },
  PH: { rate: 0.25, note: "25% for ₱400K-₱800K (TRAIN Law)" },
  PL: { rate: 0.32, note: "32% top rate" },
  PT: { rate: 0.28, note: "28% flat (NHR) or progressive 28% bracket" },
  RO: { rate: 0.10, note: "flat 10% income tax (+35% social contributions)" },
  SE: { rate: 0.45, note: "≈32% municipal + 20% national = ≈52% for high income; mid 45%" },
  SG: { rate: 0.09, note: "effective ~8-11% for SGD120k-200k (IRAS)" },
  TH: { rate: 0.20, note: "20% bracket (standard expat range)" },
  TN: { rate: 0.25, note: "approx 25% (progressive)" },
  TR: { rate: 0.27, note: "approx 27-30% for mid income" },
  TW: { rate: 0.20, note: "20% bracket NT$1.33M-2.66M" },
  US: { rate: 0.30, note: "22-24% federal + state; effective ~30% for mid-high" },
  VN: { rate: 0.20, note: "approx 20% mid range (source not grounded; fallback)" },
  ZA: { rate: 0.25, note: "typical for mid income including primary rebate offset" },
  AR: { rate: 0.25, note: "9-bracket 5-35%; 25% mid estimate" },
  CY: { rate: 0.35, note: "top 35%; 0% below €19,500" },
};

async function main() {
  console.log("=== validate-simulator-blog.ts ===\n");

  // --- 1. カバレッジチェック ---
  const { data: visaArticles } = await supabase
    .from("blog_posts")
    .select("slug, is_published")
    .like("slug", "visa-%")
    .order("slug");

  const visaCodes = new Set((visaArticles ?? []).map(a => a.slug.replace("visa-", "").toUpperCase()));
  const presetCodes = new Set(PRESETS.map(p => p.code.toUpperCase()));

  const onlyInPresets = [...presetCodes].filter(c => !visaCodes.has(c)).sort();
  const onlyInVisa = [...visaCodes].filter(c => !presetCodes.has(c)).sort();

  console.log("## 1. カバレッジ\n");
  console.log(`  country_presets: ${presetCodes.size}カ国`);
  console.log(`  visa 記事: ${visaCodes.size}カ国\n`);

  if (onlyInPresets.length > 0) {
    console.log("  ⚠️  presets にあるが visa 記事なし:");
    for (const c of onlyInPresets) console.log(`      ${c}`);
  } else {
    console.log("  ✅ presets → visa 記事 全カバー");
  }
  if (onlyInVisa.length > 0) {
    console.log("  ⚠️  visa 記事にあるが presets なし:");
    for (const c of onlyInVisa) console.log(`      ${c}`);
  } else {
    console.log("  ✅ visa 記事 → presets 全カバー");
  }

  // --- 2. 税率乖離チェック ---
  console.log("\n## 2. 税率乖離 (defaultTaxRate vs grounded 参照税率 | 閾値 5pt)\n");

  const taxRows: string[] = [];
  taxRows.push("| Code | defaultTaxRate | grounded 参照 | 乖離 | 備考 |");
  taxRows.push("|------|---------------|--------------|------|------|");

  const flagged: string[] = [];

  for (const p of PRESETS) {
    const code = p.code.toUpperCase();
    const grounded = GROUNDED_TAX_RATES[code];
    if (!grounded) {
      taxRows.push(`| ${code} | ${(p.defaultTaxRate * 100).toFixed(1)}% | — | — | 参照なし |`);
      continue;
    }
    const diff = Math.abs(p.defaultTaxRate - grounded.rate);
    const diffPct = (diff * 100).toFixed(1);
    const flag = diff >= 0.05 ? "⚠️" : "✅";
    taxRows.push(`| ${code} | ${(p.defaultTaxRate * 100).toFixed(1)}% | ${(grounded.rate * 100).toFixed(1)}% | ${flag} ${diffPct}pt | ${grounded.note} |`);
    if (diff >= 0.05) flagged.push(`${code} (default=${(p.defaultTaxRate*100).toFixed(1)}%, grounded=${(grounded.rate*100).toFixed(1)}%)`);
  }

  for (const row of taxRows) console.log(`  ${row}`);

  if (flagged.length > 0) {
    console.log(`\n  要確認 ${flagged.length}カ国:`);
    for (const f of flagged) console.log(`    - ${f}`);
  }

  // --- 3. referenceRent / referenceLivingCost ゼロ・null チェック ---
  console.log("\n## 3. referenceRent / referenceLivingCost 異常値\n");

  const rentIssues: string[] = [];
  for (const p of PRESETS) {
    if (!p.referenceRent || p.referenceRent === 0) rentIssues.push(`${p.code}: referenceRent=0 or null`);
    if (!p.referenceLivingCost || p.referenceLivingCost === 0) rentIssues.push(`${p.code}: referenceLivingCost=0 or null`);
  }
  if (rentIssues.length === 0) {
    console.log("  ✅ 全 preset の referenceRent / referenceLivingCost は正常");
  } else {
    for (const issue of rentIssues) console.log(`  ⚠️  ${issue}`);
  }

  // --- 4. 為替レート未登録通貨チェック ---
  console.log("\n## 4. toJPY 未登録通貨（study-site/simulate/page.tsx）\n");

  const currencies = new Set(PRESETS.map(p => p.currency));
  const missingCurrencies: string[] = [];
  for (const cur of currencies) {
    if (!(cur in TO_JPY)) missingCurrencies.push(cur);
  }

  if (missingCurrencies.length === 0) {
    console.log("  ✅ 全 preset 通貨が toJPY に登録済み");
  } else {
    console.log(`  ⚠️  toJPY 未登録: ${missingCurrencies.join(", ")}`);
    console.log(`     → 表示時にフォールバック (×1) で計算される。実際の為替で更新が必要`);
  }

  // --- visa 記事にあるが presets にない国の通貨 ---
  if (onlyInVisa.length > 0) {
    console.log("\n  (presets 未登録の visa 記事国の通貨チェックはスキップ)");
  }

  console.log("\n=== 検証完了 ===");
  console.log("修正が必要な項目は承認後に対応します。");
}

main().catch(console.error);
