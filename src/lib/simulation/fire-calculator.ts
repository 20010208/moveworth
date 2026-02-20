import { SimulationInput, FireResult } from "./types";

const MAX_YEARS = 50;
const FIRE_MULTIPLIER = 25; // 4% rule

export function calculateFire(input: SimulationInput): FireResult {
  const annualExpensesCurrent = (input.rentCurrent + input.livingCostCurrent) * 12;
  const annualExpensesTarget = (input.rentTarget + input.livingCostTarget) * 12;

  const fireTargetCurrent = annualExpensesCurrent * FIRE_MULTIPLIER;
  const fireTargetTarget = annualExpensesTarget * FIRE_MULTIPLIER;

  const currentCountryYears = findFireYear(input, "current", fireTargetCurrent);
  const targetCountryYears = findFireYear(input, "target", fireTargetTarget);

  return {
    fireTargetAmountCurrent: fireTargetCurrent,
    fireTargetAmountTarget: fireTargetTarget,
    currentCountryAge: currentCountryYears,
    targetCountryAge: targetCountryYears,
    currentCountryYears: currentCountryYears,
    targetCountryYears: targetCountryYears,
    annualExpensesCurrent,
    annualExpensesTarget,
  };
}

function findFireYear(
  input: SimulationInput,
  side: "current" | "target",
  fireTarget: number
): number | null {
  const income = side === "current" ? input.incomeCurrent : input.incomeTarget;
  const rent = side === "current" ? input.rentCurrent : input.rentTarget;
  const living = side === "current" ? input.livingCostCurrent : input.livingCostTarget;
  const taxRate = side === "current" ? input.taxRateCurrent : input.taxRateTarget;
  const inflation = side === "current" ? input.inflationCurrent : input.inflationTarget;

  let asset = input.currentSavings;

  for (let year = 1; year <= MAX_YEARS; year++) {
    const growthMult = Math.pow(1 + input.salaryGrowthRate, year);
    const inflMult = Math.pow(1 + inflation, year);

    const annualIncome = income * growthMult;
    const annualExpenses = (rent * inflMult + living * inflMult) * 12;
    const tax = annualIncome * taxRate;
    const netSavings = annualIncome - tax - annualExpenses;

    asset = asset * (1 + input.investmentReturn) + netSavings;

    // FIRE target also grows with inflation
    const adjustedFireTarget = fireTarget * inflMult;

    if (asset >= adjustedFireTarget) {
      return year;
    }
  }

  return null;
}
