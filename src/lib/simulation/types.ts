export interface SimulationInput {
  countryFrom: string;
  countryTo: string;
  incomeCurrent: number;
  incomeTarget: number;
  currencyCurrent: string;
  currencyTarget: string;
  salaryGrowthRate: number;
  currentSavings: number;
  savingsCurrency: string;
  rentCurrent: number;
  rentTarget: number;
  livingCostCurrent: number;
  livingCostTarget: number;
  taxRateCurrent: number;
  taxRateTarget: number;
  exchangeRate: number;
  inflationCurrent: number;
  inflationTarget: number;
  investmentReturn: number;
  simulationYears: number;
}

export interface YearlyResult {
  year: number;
  incomeCurrent: number;
  expensesCurrent: number;
  taxCurrent: number;
  netSavingsCurrent: number;
  assetCurrent: number;
  realAssetCurrent: number;
  incomeTarget: number;
  expensesTarget: number;
  taxTarget: number;
  netSavingsTarget: number;
  assetTarget: number;
  realAssetTarget: number;
  assetTargetConverted: number;
}

export interface MonthlyBreakdown {
  current: {
    income: number;
    rent: number;
    living: number;
    tax: number;
    savings: number;
  };
  target: {
    income: number;
    rent: number;
    living: number;
    tax: number;
    savings: number;
  };
}

export interface SimulationResult {
  input: SimulationInput;
  baseCurrency: string;
  annualSavingsCurrent: number;
  annualSavingsTarget: number;
  fiveYearAssetCurrent: number;
  fiveYearAssetTarget: number;
  assetDifference: number;
  yearlyResults: YearlyResult[];
  monthlyBreakdown: MonthlyBreakdown;
}

// Phase 3: Sensitivity Analysis
export interface SensitivityResult {
  paramName: string;
  baseValue: number;
  lowValue: number;
  highValue: number;
  lowDelta: number;
  highDelta: number;
}

// Phase 3: FIRE Calculator
export interface FireResult {
  fireTargetAmountCurrent: number;
  fireTargetAmountTarget: number;
  currentCountryAge: number | null;
  targetCountryAge: number | null;
  currentCountryYears: number | null;
  targetCountryYears: number | null;
  annualExpensesCurrent: number;
  annualExpensesTarget: number;
}

// Phase 3: Monte Carlo
export interface MonteCarloPercentileYear {
  year: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
}

export interface MonteCarloResult {
  percentiles: MonteCarloPercentileYear[];
  finalAssets: number[];
  stats: {
    mean: number;
    median: number;
    min: number;
    max: number;
    stdDev: number;
    probabilityOfLoss: number;
  };
}

export interface CountryPreset {
  code: string;
  name: { en: string; ja: string };
  currency: string;
  currencySymbol: string;
  defaultTaxRate: number;
  defaultInflation: number;
  referenceRent: number;
  referenceLivingCost: number;
  notes: { en: string; ja: string };
}
