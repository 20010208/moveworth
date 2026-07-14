/**
 * ペルソナ再seed スクリプト
 * 1. simulator_personas を全件 DELETE
 * 2. seed-personas.ts と同じロジックで再投入（countryPresets 最新値から生成）
 * 3. 完了後に汚染チェック（rentCurrent / rentTarget / livingCostTarget）を実施
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

const EXCHANGE_RATES: Record<string, number> = {
  JPY: 1,
  SGD: 115, MYR: 33,  THB: 4.5, AUD: 100, EUR: 165,
  CAD: 113, AED: 42,  USD: 155, GBP: 196, PHP: 2.7,
  TWD: 4.9, CHF: 177, HKD: 20,  KRW: 0.11, NZD: 93,
  RON: 33,  CZK: 6.8, PLN: 39,  HUF: 0.42, SEK: 14,
  NOK: 14,  DKK: 22,  BRL: 28,  MXN: 7.5,  IDR: 0.0095,
  INR: 1.85, GEL: 59, ZAR: 8.5, CNY: 21,   TRY: 4.2,
  ARS: 0.18, COP: 0.000037, TND: 50, VND: 0.006,
};

const JP_SAL = INDUSTRY_SALARIES["JP"];
const JP_ENG_INCOME    = JP_SAL.it;
const JP_COUPLE_INCOME = Math.round(JP_SAL.it * 1.5);
const JP_MGR_INCOME    = Math.round(JP_SAL.finance * 1.5);
const JP_PRESET        = countryPresets.find(p => p.code === "JP")!;

function makeSimInput(
  code: string, currency: string,
  jpIncome: number, targetIncome: number, jpSavings: number,
  rentTarget: number, livingTarget: number,
  taxRateTarget: number, inflationTarget: number,
): SimulationInput {
  const rate = EXCHANGE_RATES[currency] ?? 100;
  return {
    countryFrom: "JP", countryTo: code,
    incomeCurrent: jpIncome, incomeTarget: targetIncome,
    currencyCurrent: "JPY", currencyTarget: currency,
    salaryGrowthRate: 0.02, currentSavings: jpSavings, savingsCurrency: "JPY",
    rentCurrent: JP_PRESET.referenceRent,
    livingCostCurrent: JP_PRESET.referenceLivingCost,
    rentTarget, livingCostTarget: livingTarget,
    taxRateCurrent: JP_PRESET.defaultTaxRate, taxRateTarget,
    exchangeRate: rate,
    inflationCurrent: JP_PRESET.defaultInflation, inflationTarget,
    investmentReturn: 0.05, simulationYears: 10,
  };
}

// 汚染チェック用: 期待値
const EXPECTED_RENT_CURRENT = JP_PRESET.referenceRent; // 140000

async function main() {
  // --- STEP 1: 全件 DELETE ---
  console.log("=== STEP 1: simulator_personas 全件削除 ===");
  const { count, error: delErr } = await supabase
    .from("simulator_personas")
    .delete({ count: "exact" })
    .neq("id", "00000000-0000-0000-0000-000000000000"); // 全件削除のための条件
  if (delErr) { console.error("DELETE失敗:", delErr.message); process.exit(1); }
  console.log(`✅ ${count}件削除`);

  // --- STEP 2: 再seed ---
  console.log("\n=== STEP 2: 再seed ===");
  const rows: Array<{
    country_code: string; attribute: string;
    annual_income_jpy: number; family_type: string; goal: string;
    simulation_input: SimulationInput;
  }> = [];

  let skipped = 0;
  for (const preset of countryPresets) {
    const code = preset.code;
    if (code === "JP") continue;

    const rate = EXCHANGE_RATES[preset.currency];
    if (!rate) { console.warn(`  SKIP ${code}: 為替レート未定義 (${preset.currency})`); skipped++; continue; }

    const sal = INDUSTRY_SALARIES[code];
    if (!sal) { console.warn(`  SKIP ${code}: industry-salaries未定義`); skipped++; continue; }

    const rent   = preset.referenceRent;
    const living = preset.referenceLivingCost;
    const taxRate = preset.defaultTaxRate;
    const infl    = preset.defaultInflation;
    const engIncome    = sal.it;
    const coupleIncome = Math.round(sal.it * 1.5);
    const mgrIncome    = Math.round(sal.finance * 1.5);

    rows.push({
      country_code: code, attribute: "30代エンジニア・単身",
      annual_income_jpy: JP_ENG_INCOME, family_type: "単身", goal: "資産形成",
      simulation_input: makeSimInput(code, preset.currency, JP_ENG_INCOME, engIncome, 3_000_000, rent, living, taxRate, infl),
    });
    rows.push({
      country_code: code, attribute: "30代夫婦・共働き",
      annual_income_jpy: JP_COUPLE_INCOME, family_type: "夫婦", goal: "資産形成",
      simulation_input: makeSimInput(code, preset.currency, JP_COUPLE_INCOME, coupleIncome, 5_000_000, Math.round(rent * 1.2), living, taxRate, infl),
    });
    rows.push({
      country_code: code, attribute: "40代管理職・夫婦",
      annual_income_jpy: JP_MGR_INCOME, family_type: "夫婦", goal: "FIRE",
      simulation_input: makeSimInput(code, preset.currency, JP_MGR_INCOME, mgrIncome, 10_000_000, Math.round(rent * 1.2), Math.round(living * 1.3), taxRate, infl),
    });
  }

  console.log(`投入予定: ${rows.length}件 (SKIP: ${skipped}件)`);
  const { data: inserted, error: insErr } = await supabase
    .from("simulator_personas")
    .insert(rows)
    .select("id, country_code, attribute");
  if (insErr) { console.error("INSERT失敗:", insErr.message); process.exit(1); }
  console.log(`✅ ${inserted?.length}件 seed 完了`);

  // --- STEP 3: 汚染チェック ---
  console.log("\n=== STEP 3: 汚染チェック（0件確認） ===");
  const { data: fresh } = await supabase
    .from("simulator_personas")
    .select("country_code, attribute, simulation_input");
  const all = fresh ?? [];

  let contamCount = 0;
  for (const p of all) {
    const si = p.simulation_input as Record<string, unknown> | null;
    const rc = si?.rentCurrent as number | undefined;
    if (rc !== undefined && rc !== EXPECTED_RENT_CURRENT) {
      contamCount++;
      console.log(`  ⚠️  ${p.country_code} "${p.attribute}" rentCurrent=${rc} (期待: ${EXPECTED_RENT_CURRENT})`);
    }
  }

  // rentTarget: 各国の新 referenceRent と照合
  const rentMap = Object.fromEntries(countryPresets.map(p => [p.code, p.referenceRent]));
  for (const p of all) {
    const si = p.simulation_input as Record<string, unknown> | null;
    const rt = si?.rentTarget as number | undefined;
    if (rt === undefined) continue;
    const expected = rentMap[p.country_code];
    // 夫婦・管理職は ×1.2 なので Math.round(expected*1.2) も許容
    const expectedCouple = Math.round((expected ?? 0) * 1.2);
    if (rt !== expected && rt !== expectedCouple) {
      contamCount++;
      console.log(`  ⚠️  ${p.country_code} "${p.attribute}" rentTarget=${rt} (期待: ${expected} or ${expectedCouple})`);
    }
  }

  if (contamCount === 0) {
    console.log("  汚染ペルソナ: 0件 ✅");
  }

  console.log(`\n=== 完了 ===`);
  console.log(`  削除: ${count}件 / 新規seed: ${inserted?.length}件 / 汚染: ${contamCount}件`);
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
