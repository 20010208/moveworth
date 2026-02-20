import { SimulationInput, SensitivityResult } from "./types";
import { runSimulation } from "./basic-calculator";

interface ParamConfig {
  key: string;
  field: keyof SimulationInput;
  deltaType: "multiplicative" | "additive";
  delta: number;
}

const PARAMS: ParamConfig[] = [
  { key: "income", field: "incomeTarget", deltaType: "multiplicative", delta: 0.2 },
  { key: "investmentReturn", field: "investmentReturn", deltaType: "additive", delta: 0.02 },
  { key: "inflation", field: "inflationTarget", deltaType: "additive", delta: 0.01 },
  { key: "rent", field: "rentTarget", deltaType: "multiplicative", delta: 0.3 },
  { key: "livingCost", field: "livingCostTarget", deltaType: "multiplicative", delta: 0.2 },
];

export function runSensitivityAnalysis(input: SimulationInput): SensitivityResult[] {
  const baseResult = runSimulation(input);
  const baseValue = baseResult.yearlyResults[input.simulationYears].assetTarget;

  const results: SensitivityResult[] = PARAMS.map((param) => {
    const originalValue = input[param.field] as number;

    let lowInput: number;
    let highInput: number;

    if (param.deltaType === "multiplicative") {
      lowInput = originalValue * (1 - param.delta);
      highInput = originalValue * (1 + param.delta);
    } else {
      lowInput = originalValue - param.delta;
      highInput = originalValue + param.delta;
    }

    const lowResult = runSimulation({ ...input, [param.field]: lowInput });
    const highResult = runSimulation({ ...input, [param.field]: highInput });

    const lowValue = lowResult.yearlyResults[input.simulationYears].assetTarget;
    const highValue = highResult.yearlyResults[input.simulationYears].assetTarget;

    return {
      paramName: param.key,
      baseValue,
      lowValue,
      highValue,
      lowDelta: lowValue - baseValue,
      highDelta: highValue - baseValue,
    };
  });

  // Sort by total impact (absolute range)
  results.sort((a, b) => {
    const rangeA = Math.abs(a.highDelta) + Math.abs(a.lowDelta);
    const rangeB = Math.abs(b.highDelta) + Math.abs(b.lowDelta);
    return rangeB - rangeA;
  });

  return results;
}
