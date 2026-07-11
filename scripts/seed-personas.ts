import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
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
const EXCHANGE_RATES: Record<string, number> = {
  SGD: 115, MYR: 33, THB: 4.5, AUD: 100, EUR: 165,
  CAD: 113, AED: 42, USD: 155, GBP: 196, PHP: 2.7,
  TWD: 4.9, CHF: 177, HKD: 20, KRW: 0.11, NZD: 93,
  RON: 33, CZK: 6.8, PLN: 39, HUF: 0.42, SEK: 14,
  NOK: 14, DKK: 22, BRL: 28, MXN: 7.5, IDR: 0.0095,
  INR: 1.85,
};

// [currency, taxRate, inflation, refRentMonthly, refLivingMonthly]
const COUNTRY_CONFIG: Record<string, [string, number, number, number, number]> = {
  SG: ["SGD", 0.15, 0.030, 2500, 1500],
  MY: ["MYR", 0.20, 0.030, 2000, 1500],
  TH: ["THB", 0.20, 0.020, 15000, 15000],
  AU: ["AUD", 0.30, 0.030, 2000, 1500],
  DE: ["EUR", 0.40, 0.025, 1200, 1000],
  PT: ["EUR", 0.25, 0.020, 1000, 800],
  CA: ["CAD", 0.30, 0.025, 2000, 1500],
  AE: ["AED", 0.00, 0.020, 7000, 3000],
  US: ["USD", 0.30, 0.025, 2500, 2000],
  GB: ["GBP", 0.28, 0.025, 1800, 1200],
  PH: ["PHP", 0.20, 0.040, 20000, 18000],
  TW: ["TWD", 0.18, 0.020, 20000, 15000],
  NL: ["EUR", 0.38, 0.025, 1500, 1200],
  FR: ["EUR", 0.35, 0.020, 1200, 1000],
  CH: ["CHF", 0.25, 0.015, 2500, 2000],
  KR: ["KRW", 0.28, 0.025, 800000, 800000],
  HK: ["HKD", 0.15, 0.025, 18000, 10000],
  NZ: ["NZD", 0.30, 0.025, 1800, 1400],
  ES: ["EUR", 0.30, 0.025, 900, 800],
  FI: ["EUR", 0.42, 0.025, 900, 800],
};

// 現地採用想定の年収（ターゲット通貨）— 0=リモートワーカー（JPY継続）
// [エンジニア単身, 夫婦共働き, 管理職夫婦]
const LOCAL_INCOMES: Record<string, [number, number, number]> = {
  SG: [110000, 160000, 180000],
  MY: [120000, 180000, 240000],
  TH: [0, 0, 0],        // リモート
  AU: [110000, 160000, 180000],
  DE: [70000, 110000, 130000],
  PT: [0, 0, 0],        // リモート（NHR狙い）
  CA: [110000, 160000, 180000],
  AE: [280000, 400000, 500000],
  US: [150000, 220000, 260000],
  GB: [65000, 95000, 120000],
  PH: [0, 0, 0],        // リモート
  TW: [1200000, 1800000, 2400000],
  NL: [70000, 105000, 120000],
  FR: [55000, 85000, 100000],
  CH: [120000, 180000, 200000],
  KR: [60000000, 90000000, 120000000],
  HK: [700000, 1000000, 1400000],
  NZ: [90000, 130000, 150000],
  ES: [0, 0, 0],        // リモート
  FI: [65000, 95000, 110000],
};

function makeSimInput(
  code: string,
  currency: string,
  incomeJpy: number,
  incomeTargetLocal: number,
  savingsJpy: number,
  rentCurrent: number,
  rentTarget: number,
  livingCurrent: number,
  livingTarget: number,
  taxRateTarget: number,
  inflationTarget: number,
): SimulationInput {
  const rate = EXCHANGE_RATES[currency] ?? 100;
  const incomeTarget = incomeTargetLocal === 0
    ? Math.round(incomeJpy / rate)
    : incomeTargetLocal;
  return {
    countryFrom: "JP",
    countryTo: code,
    incomeCurrent: incomeJpy,
    incomeTarget,
    currencyCurrent: "JPY",
    currencyTarget: currency,
    salaryGrowthRate: 0.02,
    currentSavings: savingsJpy,
    savingsCurrency: "JPY",
    rentCurrent,
    rentTarget,
    livingCostCurrent: livingCurrent,
    livingCostTarget: livingTarget,
    taxRateCurrent: 0.28,
    taxRateTarget,
    exchangeRate: rate,
    inflationCurrent: 0.02,
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

  for (const [code, [currency, taxRate, inflation, refRent, refLiving]] of Object.entries(COUNTRY_CONFIG)) {
    const [engInc, coupleInc, mgrInc] = LOCAL_INCOMES[code] ?? [0, 0, 0];

    // ペルソナ1: 30代エンジニア・単身 / 年収1000万 / 資産形成
    rows.push({
      country_code: code,
      attribute: "30代エンジニア・単身",
      annual_income_jpy: 10000000,
      family_type: "単身",
      goal: "資産形成",
      simulation_input: makeSimInput(
        code, currency, 10000000, engInc, 3000000,
        80000, refRent, 120000, refLiving, taxRate, inflation,
      ),
    });

    // ペルソナ2: 30代夫婦・共働き / 年収1200万（世帯）/ 資産形成
    rows.push({
      country_code: code,
      attribute: "30代夫婦・共働き",
      annual_income_jpy: 12000000,
      family_type: "夫婦",
      goal: "資産形成",
      simulation_input: makeSimInput(
        code, currency, 12000000, coupleInc, 5000000,
        100000, Math.round(refRent * 1.2), 140000, Math.round(refLiving * 1.2), taxRate, inflation,
      ),
    });

    // ペルソナ3: 40代管理職・夫婦 / 年収1500万 / FIRE
    rows.push({
      country_code: code,
      attribute: "40代管理職・夫婦",
      annual_income_jpy: 15000000,
      family_type: "夫婦",
      goal: "FIRE",
      simulation_input: makeSimInput(
        code, currency, 15000000, mgrInc, 10000000,
        100000, Math.round(refRent * 1.2), 150000, Math.round(refLiving * 1.3), taxRate, inflation,
      ),
    });
  }

  console.log(`Inserting ${rows.length} personas...`);
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
