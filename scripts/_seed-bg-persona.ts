/**
 * BG（ブルガリア）ペルソナ追加 seed スクリプト
 * BGN: 80 追加後に不足していた 3件を投入し、汚染チェックを実施する
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

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

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

const JP_SAL    = INDUSTRY_SALARIES["JP"];
const JP_PRESET = countryPresets.find(p => p.code === "JP")!;
const BG_PRESET = countryPresets.find(p => p.code === "BG")!;
const BG_SAL    = INDUSTRY_SALARIES["BG"];

const JP_ENG_INCOME    = JP_SAL.it;
const JP_COUPLE_INCOME = Math.round(JP_SAL.it * 1.5);
const JP_MGR_INCOME    = Math.round(JP_SAL.finance * 1.5);

function makeSimInput(
  jpIncome: number, targetIncome: number, jpSavings: number,
  rentTarget: number, livingTarget: number,
): SimulationInput {
  return {
    countryFrom: "JP", countryTo: "BG",
    incomeCurrent: jpIncome, incomeTarget: targetIncome,
    currencyCurrent: "JPY", currencyTarget: "BGN",
    salaryGrowthRate: 0.02, currentSavings: jpSavings, savingsCurrency: "JPY",
    rentCurrent:      JP_PRESET.referenceRent,
    livingCostCurrent: JP_PRESET.referenceLivingCost,
    rentTarget, livingCostTarget: livingTarget,
    taxRateCurrent: JP_PRESET.defaultTaxRate,
    taxRateTarget:  BG_PRESET.defaultTaxRate,
    exchangeRate:   EXCHANGE_RATES["BGN"],
    inflationCurrent: JP_PRESET.defaultInflation,
    inflationTarget:  BG_PRESET.defaultInflation,
    investmentReturn: 0.05, simulationYears: 10,
  };
}

const rent   = BG_PRESET.referenceRent;
const living = BG_PRESET.referenceLivingCost;

const rows = [
  {
    country_code: "BG", attribute: "30代エンジニア・単身",
    annual_income_jpy: JP_ENG_INCOME, family_type: "単身", goal: "資産形成",
    simulation_input: makeSimInput(JP_ENG_INCOME, BG_SAL.it, 3_000_000, rent, living),
  },
  {
    country_code: "BG", attribute: "30代夫婦・共働き",
    annual_income_jpy: JP_COUPLE_INCOME, family_type: "夫婦", goal: "資産形成",
    simulation_input: makeSimInput(JP_COUPLE_INCOME, Math.round(BG_SAL.it * 1.5), 5_000_000, Math.round(rent * 1.2), living),
  },
  {
    country_code: "BG", attribute: "40代管理職・夫婦",
    annual_income_jpy: JP_MGR_INCOME, family_type: "夫婦", goal: "FIRE",
    simulation_input: makeSimInput(JP_MGR_INCOME, Math.round(BG_SAL.finance * 1.5), 10_000_000, Math.round(rent * 1.2), Math.round(living * 1.3)),
  },
];

async function main() {
  // --- 既存 BG ペルソナ確認（重複防止）---
  const { data: existing } = await sb.from("simulator_personas")
    .select("id, attribute").eq("country_code", "BG");
  if ((existing?.length ?? 0) > 0) {
    console.log(`BG ペルソナが既に ${existing!.length} 件存在します。スキップします。`);
    console.log("（削除してから再実行するか、_reseed-personas.ts を使ってください）");
    process.exit(0);
  }

  // --- INSERT ---
  console.log("=== BG ペルソナ追加 seed ===");
  console.log(`  rentCurrent: ${JP_PRESET.referenceRent} (JP最新値)`);
  console.log(`  rentTarget:  ${rent} (BG referenceRent)`);
  console.log(`  taxRateTarget: ${BG_PRESET.defaultTaxRate}`);
  console.log(`  exchangeRate: ${EXCHANGE_RATES["BGN"]} (BGN/JPY)`);

  const { data: inserted, error } = await sb
    .from("simulator_personas")
    .insert(rows)
    .select("id, country_code, attribute");
  if (error) { console.error("INSERT失敗:", error.message); process.exit(1); }
  console.log(`✅ ${inserted?.length}件 seed 完了`);

  // --- 総件数確認 ---
  const { count } = await sb
    .from("simulator_personas")
    .select("*", { count: "exact", head: true });
  console.log(`\n総ペルソナ数: ${count}件`);

  // --- 全件汚染チェック ---
  console.log("\n=== 汚染チェック（全項目）===");
  const { data: all } = await sb
    .from("simulator_personas")
    .select("country_code, attribute, simulation_input");

  const JP_RENT = JP_PRESET.referenceRent;   // 140000
  const JP_LIVING = JP_PRESET.referenceLivingCost; // 120000
  const JP_TAX = JP_PRESET.defaultTaxRate;   // 0.30

  // 対象国の現在のプリセット値
  const rentMap   = Object.fromEntries(countryPresets.map(p => [p.code, p.referenceRent]));
  const livingMap = Object.fromEntries(countryPresets.map(p => [p.code, p.referenceLivingCost]));
  const taxMap    = Object.fromEntries(countryPresets.map(p => [p.code, p.defaultTaxRate]));

  let contamCount = 0;
  for (const p of all ?? []) {
    const si = p.simulation_input as Record<string, unknown> | null;
    const rc  = si?.rentCurrent as number | undefined;
    const rt  = si?.rentTarget as number | undefined;
    const lct = si?.livingCostTarget as number | undefined;
    const trt = si?.taxRateTarget as number | undefined;
    const trc = si?.taxRateCurrent as number | undefined;

    const tag = `${p.country_code} "${p.attribute}"`;

    if (rc !== undefined && rc !== JP_RENT)
      { contamCount++; console.log(`  ⚠️  ${tag} rentCurrent=${rc} (期待: ${JP_RENT})`); }

    const expectedRent = rentMap[p.country_code] ?? 0;
    const expectedRentCouple = Math.round(expectedRent * 1.2);
    if (rt !== undefined && rt !== expectedRent && rt !== expectedRentCouple)
      { contamCount++; console.log(`  ⚠️  ${tag} rentTarget=${rt} (期待: ${expectedRent} or ${expectedRentCouple})`); }

    const expectedLiving = livingMap[p.country_code] ?? 0;
    const expectedLivingMgr = Math.round(expectedLiving * 1.3);
    if (lct !== undefined && lct !== expectedLiving && lct !== expectedLivingMgr)
      { contamCount++; console.log(`  ⚠️  ${tag} livingCostTarget=${lct} (期待: ${expectedLiving} or ${expectedLivingMgr})`); }

    const expectedTaxTarget = taxMap[p.country_code];
    if (trt !== undefined && expectedTaxTarget !== undefined && trt !== expectedTaxTarget)
      { contamCount++; console.log(`  ⚠️  ${tag} taxRateTarget=${trt} (期待: ${expectedTaxTarget})`); }

    if (trc !== undefined && trc !== JP_TAX)
      { contamCount++; console.log(`  ⚠️  ${tag} taxRateCurrent=${trc} (期待: ${JP_TAX})`); }
  }

  if (contamCount === 0) console.log("  全項目汚染なし ✅");
  console.log(`\n=== 完了: 汚染 ${contamCount}件 ===`);
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
