import { runSimulation } from "../src/lib/simulation/basic-calculator";
import type { SimulationInput } from "../src/lib/simulation/types";

// exchangeRateの向き検証:
//   定義: 1 targetCurrency = exchangeRate JPY
//   内部: assetTargetConverted = assetTarget * exchangeRate
//   convertSavings (JPY→target): amount / exchangeRate
//
// 同一購買力の収入を設定（税0/支出0/利回り0）し、
// 1年後の assetCurrent (JPY) = assetTargetConverted (JPY換算) になればOK

function test(label: string, rate: number, targetCurrency: string, targetIncome: number) {
  const input: SimulationInput = {
    countryFrom: "JP", countryTo: "XX",
    incomeCurrent: 10_000_000,
    incomeTarget: targetIncome,
    currencyCurrent: "JPY", currencyTarget: targetCurrency,
    salaryGrowthRate: 0,
    currentSavings: 0, savingsCurrency: "JPY",
    rentCurrent: 0, rentTarget: 0,
    livingCostCurrent: 0, livingCostTarget: 0,
    taxRateCurrent: 0, taxRateTarget: 0,
    exchangeRate: rate,
    inflationCurrent: 0, inflationTarget: 0,
    investmentReturn: 0,
    simulationYears: 1,
  };
  const r = runSimulation(input);
  const yr1 = r.yearlyResults[1];
  const diff = Math.abs(yr1.assetCurrent - yr1.assetTargetConverted);
  const ok = diff < 1; // 1円未満の誤差は浮動小数点許容
  const status = ok ? "✅" : "❌";
  console.log(`${status} ${label}`);
  console.log(`   JPY asset:      ${yr1.assetCurrent.toFixed(0)} JPY`);
  console.log(`   target asset:   ${yr1.assetTarget.toFixed(4)} ${targetCurrency}`);
  console.log(`   converted back: ${yr1.assetTargetConverted.toFixed(0)} JPY`);
  console.log(`   diff:           ${diff.toFixed(4)} JPY`);
  if (!ok) process.exitCode = 1;
}

// 等価収入 = 10_000_000 JPY / exchangeRate → 1年後は両側同額のはず
test("USD rate=155",  155,  "USD", 10_000_000 / 155);
test("KRW rate=0.11", 0.11, "KRW", 10_000_000 / 0.11);
test("PHP rate=2.7",  2.7,  "PHP", 10_000_000 / 2.7);
test("SGD rate=115",  115,  "SGD", 10_000_000 / 115);
test("AED rate=42",   42,   "AED", 10_000_000 / 42);

// PHの実業種プリセット値でも確認: IT expat = 2,600,000 PHP at rate 2.7
// 10M JPY = 3,703,703 PHP (等価) → 2.6M PHP は実際に7.02M JPY相当
{
  const r = runSimulation({
    countryFrom: "JP", countryTo: "PH",
    incomeCurrent: 10_000_000,
    incomeTarget: 2_600_000,   // INDUSTRY_SALARIES[PH].it
    currencyCurrent: "JPY", currencyTarget: "PHP",
    salaryGrowthRate: 0, currentSavings: 0, savingsCurrency: "JPY",
    rentCurrent: 0, rentTarget: 0, livingCostCurrent: 0, livingCostTarget: 0,
    taxRateCurrent: 0, taxRateTarget: 0,
    exchangeRate: 2.7,
    inflationCurrent: 0, inflationTarget: 0, investmentReturn: 0,
    simulationYears: 1,
  });
  const yr1 = r.yearlyResults[1];
  console.log(`\n📊 PH 業種プリセット確認 (IT expat 2.6M PHP at rate 2.7):`);
  console.log(`   JPY(JP継続):   ${yr1.assetCurrent.toLocaleString()} JPY`);
  console.log(`   PH asset:      ${yr1.assetTarget.toLocaleString()} PHP`);
  console.log(`   PH→JPY換算:    ${yr1.assetTargetConverted.toLocaleString()} JPY`);
  console.log(`   差額:          ${(yr1.assetTargetConverted - yr1.assetCurrent).toLocaleString()} JPY`);
}
