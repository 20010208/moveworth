/**
 * simulator_personas テーブルへの初期ペルソナ投入スクリプト
 *
 * データソース（本体プリセット参照）:
 *   - 家賃 / 生活費 / 税率 / インフレ  : src/data/country-presets.ts (countryPresets)
 *   - 業種別現地年収（外国人プロフェッショナル参考値）: src/data/industry-salaries.ts (INDUSTRY_SALARIES)
 *   - 為替レート : 本スクリプト内 EXCHANGE_RATES（本体プリセットに未定義のため唯一の定義）
 *
 * ペルソナ構成:
 *   ① 30代エンジニア・単身  → IT業 年収プリセット値
 *   ② 30代夫婦・共働き      → IT業 × 1.5（パートナー含む世帯年収）
 *   ③ 40代管理職・夫婦      → 金融業 × 1.5（管理職・高所得帯）
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { countryPresets } from "../src/data/country-presets";
import { INDUSTRY_SALARIES } from "../src/data/industry-salaries";
import type { SimulationInput } from "../src/lib/simulation/types";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = t.slice(eq + 1).trim();
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// JPY per 1 unit of target currency (2025年近似値)
// 本体プリセットに為替レートが存在しないため本スクリプトで管理する
const EXCHANGE_RATES: Record<string, number> = {
  JPY: 1,
  SGD: 115, MYR: 33,  THB: 4.5, AUD: 100, EUR: 165,
  CAD: 113, AED: 42,  USD: 155, GBP: 196, PHP: 2.7,
  TWD: 4.9, CHF: 177, HKD: 20,  KRW: 0.11, NZD: 93,
  RON: 33,  CZK: 6.8, PLN: 39,  HUF: 0.42, SEK: 14,
  NOK: 14,  DKK: 22,  BRL: 28,  MXN: 7.5,  IDR: 0.0095,
  INR: 1.85, GEL: 59, ZAR: 8.5, CNY: 21,   TRY: 4.2,
  ARS: 0.18, COP: 0.000037, TND: 50, VND: 0.006, BGN: 80,
};

// 日本側の年収（INDUSTRY_SALARIES.JP から算出）
const JP_SAL = INDUSTRY_SALARIES["JP"];
// ① 単身エンジニア: JP IT参考値
const JP_ENG_INCOME = JP_SAL.it;                        // 9,500,000 JPY
// ② 夫婦共働き: JP IT × 1.5
const JP_COUPLE_INCOME = Math.round(JP_SAL.it * 1.5);  // 14,250,000 JPY
// ③ 管理職夫婦: JP finance × 1.5
const JP_MGR_INCOME = Math.round(JP_SAL.finance * 1.5); // 16,500,000 JPY

// 日本側の家賃・生活費（JP countryPreset から取得）
const JP_PRESET = countryPresets.find(p => p.code === "JP")!;

function makeSimInput(
  code: string,
  currency: string,
  jpIncome: number,
  targetIncome: number,
  jpSavings: number,
  rentTarget: number,
  livingTarget: number,
  taxRateTarget: number,
  inflationTarget: number,
): SimulationInput {
  const rate = EXCHANGE_RATES[currency] ?? 100;
  return {
    countryFrom: "JP",
    countryTo: code,
    incomeCurrent: jpIncome,
    incomeTarget: targetIncome,
    currencyCurrent: "JPY",
    currencyTarget: currency,
    salaryGrowthRate: 0.02,
    currentSavings: jpSavings,
    savingsCurrency: "JPY",
    // 日本側: JP countryPreset の参照値
    rentCurrent: JP_PRESET.referenceRent,
    livingCostCurrent: JP_PRESET.referenceLivingCost,
    // 移住先: 対象国 countryPreset の参照値
    rentTarget,
    livingCostTarget: livingTarget,
    taxRateCurrent: JP_PRESET.defaultTaxRate,
    taxRateTarget,
    exchangeRate: rate,
    inflationCurrent: JP_PRESET.defaultInflation,
    inflationTarget,
    investmentReturn: 0.05,
    simulationYears: 10,
  };
}

async function seed() {
  const rows: Array<{
    country_code: string;
    attribute: string;
    annual_income_jpy: number;
    family_type: string;
    goal: string;
    simulation_input: SimulationInput;
  }> = [];

  let skipped = 0;

  for (const preset of countryPresets) {
    const code = preset.code;
    if (code === "JP") continue; // 移住先として日本は除外

    const rate = EXCHANGE_RATES[preset.currency];
    if (!rate) {
      console.warn(`  SKIP ${code}: 為替レート未定義 (${preset.currency})`);
      skipped++;
      continue;
    }

    const sal = INDUSTRY_SALARIES[code];
    if (!sal) {
      console.warn(`  SKIP ${code}: industry-salaries未定義`);
      skipped++;
      continue;
    }

    // 現地収入（industry-salaries.ts のプリセット値を使用）
    const engIncome    = sal.it;                        // ① IT業参考値
    const coupleIncome = Math.round(sal.it * 1.5);     // ② IT × 1.5（世帯合算）
    const mgrIncome    = Math.round(sal.finance * 1.5); // ③ 金融業 × 1.5（管理職帯）

    // 家賃・生活費・税率・インフレ: countryPresets から取得
    const rent    = preset.referenceRent;
    const living  = preset.referenceLivingCost;
    const taxRate = preset.defaultTaxRate;
    const infl    = preset.defaultInflation;

    // ペルソナ① 30代エンジニア・単身 / IT業年収 / 資産形成
    rows.push({
      country_code: code,
      attribute: "30代エンジニア・単身",
      annual_income_jpy: JP_ENG_INCOME,
      family_type: "単身",
      goal: "資産形成",
      simulation_input: makeSimInput(
        code, preset.currency,
        JP_ENG_INCOME, engIncome, 3_000_000,
        rent, living, taxRate, infl,
      ),
    });

    // ペルソナ② 30代夫婦・共働き / IT業 ×1.5 / 資産形成
    rows.push({
      country_code: code,
      attribute: "30代夫婦・共働き",
      annual_income_jpy: JP_COUPLE_INCOME,
      family_type: "夫婦",
      goal: "資産形成",
      simulation_input: makeSimInput(
        code, preset.currency,
        JP_COUPLE_INCOME, coupleIncome, 5_000_000,
        // 夫婦は家賃を1.2倍（より広い部屋）
        Math.round(rent * 1.2), living, taxRate, infl,
      ),
    });

    // ペルソナ③ 40代管理職・夫婦 / 金融業 ×1.5 / FIRE
    rows.push({
      country_code: code,
      attribute: "40代管理職・夫婦",
      annual_income_jpy: JP_MGR_INCOME,
      family_type: "夫婦",
      goal: "FIRE",
      simulation_input: makeSimInput(
        code, preset.currency,
        JP_MGR_INCOME, mgrIncome, 10_000_000,
        Math.round(rent * 1.2), Math.round(living * 1.3), taxRate, infl,
      ),
    });
  }

  console.log(`Inserting ${rows.length} personas (skipped: ${skipped})...`);
  const { data, error } = await supabase
    .from("simulator_personas")
    .insert(rows)
    .select("id, country_code, attribute");

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`✅ Seeded ${data?.length ?? 0} personas`);
  for (const row of data ?? []) {
    console.log(`  ${row.country_code} | ${row.attribute}`);
  }
}

seed();
