"use client";

import { useState, useEffect, useCallback } from "react";
import { SimulationInput, SimulationResult, SensitivityResult, FireResult, MonteCarloResult } from "@/lib/simulation/types";
import { runSensitivityAnalysis } from "@/lib/simulation/sensitivity";
import { calculateFire } from "@/lib/simulation/fire-calculator";
import { runMonteCarlo } from "@/lib/simulation/monte-carlo";
import { SensitivityChart } from "./sensitivity-chart";
import { FirePanel } from "./fire-panel";
import { MonteCarloChart } from "./monte-carlo-chart";
import { Activity, Flame, BarChart3, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface AdvancedTabsProps {
  result: SimulationResult;
}

type TabId = "sensitivity" | "fire" | "montecarlo";

export function AdvancedTabs({ result }: AdvancedTabsProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>("sensitivity");

  const [sensitivityData, setSensitivityData] = useState<SensitivityResult[] | null>(null);
  const [fireData, setFireData] = useState<FireResult | null>(null);
  const [monteCarloData, setMonteCarloData] = useState<MonteCarloResult | null>(null);
  const [mcProgress, setMcProgress] = useState(0);
  const [mcRunning, setMcRunning] = useState(false);

  // Run sensitivity on mount
  useEffect(() => {
    setSensitivityData(runSensitivityAnalysis(result.input));
  }, [result]);

  // Run FIRE on mount
  useEffect(() => {
    setFireData(calculateFire(result.input));
  }, [result]);

  // Run Monte Carlo when tab selected
  const runMC = useCallback(async () => {
    if (monteCarloData || mcRunning) return;
    setMcRunning(true);
    setMcProgress(0);
    const mcResult = await runMonteCarlo(result.input, (p) => setMcProgress(p));
    setMonteCarloData(mcResult);
    setMcRunning(false);
  }, [result, monteCarloData, mcRunning]);

  useEffect(() => {
    if (activeTab === "montecarlo") {
      runMC();
    }
  }, [activeTab, runMC]);

  // Reset when result changes
  useEffect(() => {
    setMonteCarloData(null);
    setMcRunning(false);
    setMcProgress(0);
  }, [result]);

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "sensitivity", label: t("advanced.sensitivity"), icon: <Activity className="h-3.5 w-3.5" /> },
    { id: "fire", label: t("advanced.fire"), icon: <Flame className="h-3.5 w-3.5" /> },
    { id: "montecarlo", label: t("advanced.monteCarlo"), icon: <BarChart3 className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-bold text-foreground mb-4">
        {t("advanced.title")}
      </h3>

      {/* Tab buttons */}
      <div className="flex gap-1 mb-5 border-b border-border/50 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg transition-all ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-muted hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "sensitivity" && sensitivityData && (
        <SensitivityChart results={sensitivityData} currency={result.input.currencyTarget} />
      )}

      {activeTab === "fire" && fireData && (
        <FirePanel result={fireData} input={result.input} />
      )}

      {activeTab === "montecarlo" && (
        <>
          {mcRunning && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
              <p className="text-sm font-medium text-foreground mb-2">
                {t("advanced.monteCarloRunning")}
              </p>
              <div className="w-48 h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${Math.round(mcProgress * 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted mt-1">
                {Math.round(mcProgress * 100)}%
              </p>
            </div>
          )}
          {monteCarloData && !mcRunning && (
            <MonteCarloChart result={monteCarloData} currency={result.input.currencyTarget} />
          )}
        </>
      )}
    </div>
  );
}
