"use client";

import { useState } from "react";
import { SimulationInput, SimulationResult, ExtraComparisonInput } from "@/lib/simulation/types";
import { runSimulation } from "@/lib/simulation/basic-calculator";
import { InputPanel } from "@/components/simulator/input-panel";
import { ResultsPanel } from "@/components/simulator/results-panel";
import { HistoryPanel } from "@/components/simulator/history-panel";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { saveHistory } from "@/lib/simulation-history";
import { BarChart3 } from "lucide-react";
import { SidebarAd } from "@/components/ads/sidebar-ad";

const defaultInput: SimulationInput = {
  countryFrom: "",
  countryTo: "",
  incomeCurrent: 0,
  incomeTarget: 0,
  currencyCurrent: "",
  currencyTarget: "",
  salaryGrowthRate: 0.02,
  currentSavings: 0,
  savingsCurrency: "",
  rentCurrent: 0,
  rentTarget: 0,
  livingCostCurrent: 0,
  livingCostTarget: 0,
  taxRateCurrent: 0.3,
  taxRateTarget: 0.15,
  exchangeRate: 1,
  inflationCurrent: 0.025,
  inflationTarget: 0.03,
  investmentReturn: 0,
  simulationYears: 5,
};

export default function SimulatePage() {
  const { t } = useTranslation();
  const { isAuthenticated, user, setShowRegisterModal, setOnRegisterCallback } = useAuth();
  const [input, setInput] = useState<SimulationInput>(defaultInput);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [historyKey, setHistoryKey] = useState(0);
  const [extraInputs, setExtraInputs] = useState<ExtraComparisonInput[]>([]);
  const [extraResults, setExtraResults] = useState<SimulationResult[]>([]);

  const plan = user?.plan ?? "free";

  const doSimulate = () => {
    const savingsCurrency = input.savingsCurrency || input.currencyCurrent;
    const finalInput = { ...input, savingsCurrency };
    const simulationResult = runSimulation(finalInput);
    setResult(simulationResult);
    saveHistory(finalInput, simulationResult, plan);
    setHistoryKey((k) => k + 1);

    // Premium: 追加比較国のシミュレーションを実行
    if (plan === "premium" && extraInputs.length > 0) {
      const validExtras = extraInputs.filter(e => e.countryTo && e.incomeTarget > 0);
      const extras = validExtras.map(extra => {
        const fullInput: SimulationInput = {
          ...finalInput,
          countryTo: extra.countryTo,
          incomeTarget: extra.incomeTarget,
          currencyTarget: extra.currencyTarget,
          rentTarget: extra.rentTarget,
          livingCostTarget: extra.livingCostTarget,
          taxRateTarget: extra.taxRateTarget,
          inflationTarget: extra.inflationTarget,
          exchangeRate: extra.exchangeRate,
        };
        return runSimulation(fullInput);
      });
      setExtraResults(extras);
    } else {
      setExtraResults([]);
    }
  };

  const handleSimulate = () => {
    if (!isAuthenticated) {
      setOnRegisterCallback(() => doSimulate);
      setShowRegisterModal(true);
      return;
    }
    doSimulate();
  };

  const handleLoadHistory = (loadedInput: SimulationInput, loadedResult: SimulationResult) => {
    setInput(loadedInput);
    setResult(loadedResult);
  };

  return (
    <div className="bg-surface min-h-screen relative">
      {/* Left sidebar ad - visible on 2xl+ screens */}
      <SidebarAd side="left" slot="LEFT_AD_SLOT" />
      {/* Right sidebar ad - visible on 2xl+ screens */}
      <SidebarAd side="right" slot="RIGHT_AD_SLOT" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-light text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {t("simulate.title")}
              </h1>
              <p className="text-sm text-muted">
                {t("simulate.subtitle")}
              </p>
            </div>
          </div>
        </div>

        <HistoryPanel key={historyKey} onLoad={handleLoadHistory} plan={plan} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InputPanel
            input={input}
            onChange={setInput}
            onSimulate={handleSimulate}
            plan={plan}
            extraInputs={extraInputs}
            onExtraInputsChange={setExtraInputs}
          />
          <ResultsPanel result={result} plan={plan} extraResults={extraResults} />
        </div>
      </div>
    </div>
  );
}
