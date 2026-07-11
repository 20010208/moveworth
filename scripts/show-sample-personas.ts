import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

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

async function main() {
  // PHを確実に含む5件取得（PH最初、残り4件はランダム）
  const [phRes, randRes] = await Promise.all([
    supabase
      .from("simulator_personas")
      .select("country_code, attribute, annual_income_jpy, simulation_input")
      .eq("country_code", "PH")
      .eq("attribute", "30代エンジニア・単身")
      .limit(1),
    supabase
      .from("simulator_personas")
      .select("country_code, attribute, annual_income_jpy, simulation_input")
      .not("country_code", "eq", "PH")
      .limit(4)
      .order("created_at", { ascending: false }),
  ]);

  const rows = [...(phRes.data ?? []), ...(randRes.data ?? [])];

  for (const r of rows) {
    const si = r.simulation_input as {
      incomeTarget: number;
      currencyTarget: string;
      rentTarget: number;
      livingCostTarget: number;
      taxRateTarget: number;
      inflationTarget: number;
      exchangeRate: number;
    };
    console.log(`--- ${r.country_code} | ${r.attribute} ---`);
    console.log(`  日本年収 (JPY):    ${r.annual_income_jpy.toLocaleString()}`);
    console.log(`  現地年収:          ${si.incomeTarget.toLocaleString()} ${si.currencyTarget}`);
    console.log(`  現地年収 JPY換算:  ${Math.round(si.incomeTarget * si.exchangeRate).toLocaleString()} JPY`);
    console.log(`  家賃 (月):         ${si.rentTarget.toLocaleString()} ${si.currencyTarget}`);
    console.log(`  生活費 (月):       ${si.livingCostTarget.toLocaleString()} ${si.currencyTarget}`);
    console.log(`  税率:              ${(si.taxRateTarget * 100).toFixed(0)}%`);
    console.log(`  インフレ:          ${(si.inflationTarget * 100).toFixed(1)}%`);
    console.log(`  為替:              1 ${si.currencyTarget} = ${si.exchangeRate} JPY`);
    console.log();
  }
}

main();
