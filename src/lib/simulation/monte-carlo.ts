import { SimulationInput, MonteCarloResult, MonteCarloPercentileYear } from "./types";
import { runSimulation } from "./basic-calculator";

const NUM_TRIALS = 1000;
const CHUNK_SIZE = 50;

// Standard deviations for randomization
const INCOME_SIGMA = 0.05;       // 5% multiplicative
const RETURN_SIGMA = 0.03;       // 3pp additive
const INFLATION_SIGMA = 0.01;    // 1pp additive

// Box-Muller transform for normal distribution
function randomNormal(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function runSingleTrial(input: SimulationInput): number[] {
  const years = input.simulationYears;
  const assets: number[] = [];

  let asset = input.currentSavings;

  for (let year = 0; year <= years; year++) {
    if (year === 0) {
      assets.push(asset);
      continue;
    }

    const incomeNoise = 1 + randomNormal() * INCOME_SIGMA;
    const returnNoise = randomNormal() * RETURN_SIGMA;
    const inflNoise = randomNormal() * INFLATION_SIGMA;

    const growthMult = Math.pow(1 + input.salaryGrowthRate, year);
    const inflMult = Math.pow(1 + Math.max(0, input.inflationTarget + inflNoise), year);

    const income = input.incomeTarget * growthMult * Math.max(0.5, incomeNoise);
    const expenses = (input.rentTarget * inflMult + input.livingCostTarget * inflMult) * 12;
    const tax = income * input.taxRateTarget;
    const netSavings = income - tax - expenses;

    const effectiveReturn = Math.max(-0.5, input.investmentReturn + returnNoise);
    asset = asset * (1 + effectiveReturn) + netSavings;

    assets.push(asset);
  }

  return assets;
}

function percentile(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
}

export async function runMonteCarlo(
  input: SimulationInput,
  onProgress?: (progress: number) => void
): Promise<MonteCarloResult> {
  const years = input.simulationYears;
  const allTrials: number[][] = []; // [trial][year]

  for (let i = 0; i < NUM_TRIALS; i += CHUNK_SIZE) {
    const chunkEnd = Math.min(i + CHUNK_SIZE, NUM_TRIALS);
    for (let j = i; j < chunkEnd; j++) {
      allTrials.push(runSingleTrial(input));
    }
    onProgress?.(chunkEnd / NUM_TRIALS);
    // Yield to UI thread
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  // Calculate percentiles for each year
  const percentiles: MonteCarloPercentileYear[] = [];
  for (let year = 0; year <= years; year++) {
    const yearAssets = allTrials.map((trial) => trial[year]);
    percentiles.push({
      year,
      p10: percentile(yearAssets, 10),
      p25: percentile(yearAssets, 25),
      p50: percentile(yearAssets, 50),
      p75: percentile(yearAssets, 75),
      p90: percentile(yearAssets, 90),
    });
  }

  // Final year statistics
  const finalAssets = allTrials.map((trial) => trial[years]);
  const sorted = [...finalAssets].sort((a, b) => a - b);
  const mean = finalAssets.reduce((s, v) => s + v, 0) / finalAssets.length;
  const median = percentile(finalAssets, 50);
  const variance = finalAssets.reduce((s, v) => s + (v - mean) ** 2, 0) / finalAssets.length;
  const stdDev = Math.sqrt(variance);
  const lossCount = finalAssets.filter((v) => v < input.currentSavings).length;

  return {
    percentiles,
    finalAssets: sorted,
    stats: {
      mean,
      median,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      stdDev,
      probabilityOfLoss: lossCount / NUM_TRIALS,
    },
  };
}
