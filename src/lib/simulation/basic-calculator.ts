import {
  SimulationInput,
  SimulationResult,
  YearlyResult,
  MonthlyBreakdown,
} from "./types";

export function runSimulation(input: SimulationInput): SimulationResult {
  const yearlyResults: YearlyResult[] = [];

  const savingsInCurrent = convertSavings(
    input.currentSavings,
    input.savingsCurrency,
    input.currencyCurrent,
    input.currencyTarget,
    input.exchangeRate
  );

  let assetCurrent = savingsInCurrent.inCurrentCurrency;
  let assetTarget = savingsInCurrent.inTargetCurrency;

  for (let year = 0; year <= input.simulationYears; year++) {
    const growthMultiplier = Math.pow(1 + input.salaryGrowthRate, year);
    const inflCurrentMult = Math.pow(1 + input.inflationCurrent, year);
    const inflTargetMult = Math.pow(1 + input.inflationTarget, year);

    const incomeCurrent = input.incomeCurrent * growthMultiplier;
    const incomeTarget = input.incomeTarget * growthMultiplier;

    const expensesCurrent =
      (input.rentCurrent * inflCurrentMult +
        input.livingCostCurrent * inflCurrentMult) *
      12;
    const expensesTarget =
      (input.rentTarget * inflTargetMult +
        input.livingCostTarget * inflTargetMult) *
      12;

    const taxCurrent = incomeCurrent * input.taxRateCurrent;
    const taxTarget = incomeTarget * input.taxRateTarget;

    const netSavingsCurrent = incomeCurrent - taxCurrent - expensesCurrent;
    const netSavingsTarget = incomeTarget - taxTarget - expensesTarget;

    if (year > 0) {
      assetCurrent =
        assetCurrent * (1 + input.investmentReturn) + netSavingsCurrent;
      assetTarget =
        assetTarget * (1 + input.investmentReturn) + netSavingsTarget;
    }

    const realAssetCurrent = assetCurrent / inflCurrentMult;
    const realAssetTarget = assetTarget / inflTargetMult;

    const assetTargetConverted = assetTarget * input.exchangeRate;

    yearlyResults.push({
      year,
      incomeCurrent,
      expensesCurrent,
      taxCurrent,
      netSavingsCurrent,
      assetCurrent,
      realAssetCurrent,
      incomeTarget,
      expensesTarget,
      taxTarget,
      netSavingsTarget,
      assetTarget,
      realAssetTarget,
      assetTargetConverted,
    });
  }

  const lastYear = yearlyResults[input.simulationYears];
  const firstYearResult = yearlyResults[1] || yearlyResults[0];

  const monthlyBreakdown: MonthlyBreakdown = {
    current: {
      income: Math.round(input.incomeCurrent / 12),
      rent: input.rentCurrent,
      living: input.livingCostCurrent,
      tax: Math.round((input.incomeCurrent * input.taxRateCurrent) / 12),
      savings: Math.round(firstYearResult.netSavingsCurrent / 12),
    },
    target: {
      income: Math.round(input.incomeTarget / 12),
      rent: input.rentTarget,
      living: input.livingCostTarget,
      tax: Math.round((input.incomeTarget * input.taxRateTarget) / 12),
      savings: Math.round(firstYearResult.netSavingsTarget / 12),
    },
  };

  return {
    input,
    baseCurrency: input.currencyCurrent,
    annualSavingsCurrent: firstYearResult.netSavingsCurrent,
    annualSavingsTarget: firstYearResult.netSavingsTarget,
    fiveYearAssetCurrent: lastYear.assetCurrent,
    fiveYearAssetTarget: lastYear.assetTarget,
    assetDifference:
      lastYear.assetTargetConverted - lastYear.assetCurrent,
    yearlyResults,
    monthlyBreakdown,
  };
}

function convertSavings(
  amount: number,
  fromCurrency: string,
  currentCurrency: string,
  targetCurrency: string,
  exchangeRate: number
): { inCurrentCurrency: number; inTargetCurrency: number } {
  if (fromCurrency === currentCurrency) {
    return {
      inCurrentCurrency: amount,
      inTargetCurrency: amount / exchangeRate,
    };
  } else if (fromCurrency === targetCurrency) {
    return {
      inCurrentCurrency: amount * exchangeRate,
      inTargetCurrency: amount,
    };
  }
  return {
    inCurrentCurrency: amount,
    inTargetCurrency: amount / exchangeRate,
  };
}
