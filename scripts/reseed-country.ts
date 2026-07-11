/**
 * 特定国コードの未使用ペルソナを削除して再seed するスクリプト
 * Usage: RESEED_COUNTRY=SG npx tsx scripts/reseed-country.ts
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
  JPY: 1, SGD: 115, MYR: 33, THB: 4.5, AUD: 100, EUR: 165,
  CAD: 113, AED: 42, USD: 155, GBP: 196, PHP: 2.7,
  TWD: 4.9, CHF: 177, HKD: 20, KRW: 0.11, NZD: 93,
  RON: 33, CZK: 6.8, PLN: 39, HUF: 0.42, SEK: 14,
  NOK: 14, DKK: 22, BRL: 28, MXN: 7.5, IDR: 0.0095,
  INR: 1.85, GEL: 59, ZAR: 8.5, CNY: 21, TRY: 4.2,
  ARS: 0.18, COP: 0.000037, TND: 50, VND: 0.006,
};

const JP_SAL = INDUSTRY_SALARIES["JP"];
const JP_ENG_INCOME = JP_SAL.it;
const JP_COUPLE_INCOME = Math.round(JP_SAL.it * 1.5);
const JP_MGR_INCOME = Math.round(JP_SAL.finance * 1.5);
const JP_PRESET = countryPresets.find(p => p.code === "JP")!;

function makeSimInput(
  code: string, currency: string,
  jpIncome: number, targetIncome: number, jpSavings: number,
  rentTarget: number, livingTarget: number, taxRateTarget: number, inflationTarget: number,
): SimulationInput {
  return {
    countryFrom: "JP", countryTo: code,
    incomeCurrent: jpIncome, incomeTarget: targetIncome,
    currencyCurrent: "JPY", currencyTarget: currency,
    salaryGrowthRate: 0.02, currentSavings: jpSavings, savingsCurrency: "JPY",
    rentCurrent: JP_PRESET.referenceRent, livingCostCurrent: JP_PRESET.referenceLivingCost,
    rentTarget, livingCostTarget: livingTarget,
    taxRateCurrent: JP_PRESET.defaultTaxRate, taxRateTarget,
    exchangeRate: EXCHANGE_RATES[currency] ?? 100,
    inflationCurrent: JP_PRESET.defaultInflation, inflationTarget,
    investmentReturn: 0.05, simulationYears: 10,
  };
}

async function main() {
  const targetCode = process.env.RESEED_COUNTRY;
  if (!targetCode) {
    console.error("RESEED_COUNTRY env var is required");
    process.exit(1);
  }

  // 未使用ペルソナのみ削除（used_at IS NULL）
  const { count: deleted, error: delErr } = await supabase
    .from("simulator_personas")
    .delete({ count: "exact" })
    .eq("country_code", targetCode)
    .is("used_at", null);

  if (delErr) { console.error("Delete failed:", delErr.message); process.exit(1); }
  console.log(`Deleted ${deleted} unused ${targetCode} personas`);

  const preset = countryPresets.find(p => p.code === targetCode);
  if (!preset) { console.error(`No preset for ${targetCode}`); process.exit(1); }

  const sal = INDUSTRY_SALARIES[targetCode];
  if (!sal) { console.error(`No industry-salaries for ${targetCode}`); process.exit(1); }

  const rent = preset.referenceRent;
  const living = preset.referenceLivingCost;
  const taxRate = preset.defaultTaxRate;
  const infl = preset.defaultInflation;
  const engIncome = sal.it;
  const coupleIncome = Math.round(sal.it * 1.5);
  const mgrIncome = Math.round(sal.finance * 1.5);

  const rows = [
    {
      country_code: targetCode, attribute: "30代エンジニア・単身",
      annual_income_jpy: JP_ENG_INCOME, family_type: "単身", goal: "資産形成",
      simulation_input: makeSimInput(targetCode, preset.currency, JP_ENG_INCOME, engIncome, 3_000_000, rent, living, taxRate, infl),
    },
    {
      country_code: targetCode, attribute: "30代夫婦・共働き",
      annual_income_jpy: JP_COUPLE_INCOME, family_type: "夫婦", goal: "資産形成",
      simulation_input: makeSimInput(targetCode, preset.currency, JP_COUPLE_INCOME, coupleIncome, 5_000_000, Math.round(rent * 1.2), living, taxRate, infl),
    },
    {
      country_code: targetCode, attribute: "40代管理職・夫婦",
      annual_income_jpy: JP_MGR_INCOME, family_type: "夫婦", goal: "FIRE",
      simulation_input: makeSimInput(targetCode, preset.currency, JP_MGR_INCOME, mgrIncome, 10_000_000, Math.round(rent * 1.2), Math.round(living * 1.3), taxRate, infl),
    },
  ];

  const { data, error } = await supabase.from("simulator_personas").insert(rows).select("id, attribute");
  if (error) { console.error("Insert failed:", error.message); process.exit(1); }

  console.log(`✅ Reseeded ${data?.length} personas for ${targetCode}`);
  for (const r of data ?? []) console.log(`  ${r.id} | ${r.attribute}`);
  console.log(`  taxRate used: ${taxRate} (from countryPresets.${targetCode}.defaultTaxRate)`);
}

main();
