"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SimulationResult, SensitivityResult, FireResult, MonteCarloResult } from "@/lib/simulation/types";
import { runSensitivityAnalysis } from "@/lib/simulation/sensitivity";
import { calculateFire } from "@/lib/simulation/fire-calculator";
import { runMonteCarlo } from "@/lib/simulation/monte-carlo";
import { SensitivityChart } from "./sensitivity-chart";
import { FirePanel } from "./fire-panel";
import { MonteCarloChart } from "./monte-carlo-chart";
import { countryPresets } from "@/data/country-presets";
import { Activity, Flame, BarChart3, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface AdvancedTabsProps {
  result: SimulationResult;
  extraResults?: SimulationResult[];
}

type TabId = "sensitivity" | "fire" | "montecarlo";

export function AdvancedTabs({ result, extraResults = [] }: AdvancedTabsProps) {
  const { t, locale } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>("sensitivity");
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(0);

  const allResults = [result, ...extraResults];
  const activeResult = allResults[selectedCountryIndex] ?? result;

  // Keep a ref to avoid stale closure in runMC
  const activeResultRef = useRef(activeResult);
  activeResultRef.current = activeResult;

  const [sensitivityData, setSensitivityData] = useState<SensitivityResult[] | null>(null);
  const [fireData, setFireData] = useState<FireResult | null>(null);
  const [extraFireData, setExtraFireData] = useState<FireResult[]>([]);
  const [monteCarloData, setMonteCarloData] = useState<MonteCarloResult | null>(null);
  const [mcProgress, setMcProgress] = useState(0);
  const [mcRunning, setMcRunning] = useState(false);

  // Run sensitivity when selected country or results change
  useEffect(() => {
    const ar = allResults[selectedCountryIndex] ?? result;
    setSensitivityData(runSensitivityAnalysis(ar.input));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountryIndex, result, extraResults]);

  // Run FIRE for all countries
  useEffect(() => {
    setFireData(calculateFire(result.input));
    setExtraFireData(extraResults.map((er) => calculateFire(er.input)));
  }, [result, extraResults]);

  // Run Monte Carlo when tab selected (uses ref to avoid stale closure)
  const runMC = useCallback(async () => {
    if (monteCarloData || mcRunning) return;
    setMcRunning(true);
    setMcProgress(0);
    const mcResult = await runMonteCarlo(activeResultRef.current.input, (p) => setMcProgress(p));
    setMonteCarloData(mcResult);
    setMcRunning(false);
  }, [monteCarloData, mcRunning]);

  useEffect(() => {
    if (activeTab === "montecarlo") {
      runMC();
    }
  }, [activeTab, runMC]);

  // Reset MC when result or selected country changes
  useEffect(() => {
    setMonteCarloData(null);
    setMcRunning(false);
    setMcProgress(0);
  }, [result, selectedCountryIndex]);

  // Reset selected country index when main result changes
  useEffect(() => {
    setSelectedCountryIndex(0);
  }, [result]);

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "sensitivity", label: t("advanced.sensitivity"), icon: <Activity className="h-3.5 w-3.5" /> },
    { id: "fire", label: t("advanced.fire"), icon: <Flame className="h-3.5 w-3.5" /> },
    { id: "montecarlo", label: t("advanced.monteCarlo"), icon: <BarChart3 className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <h3 className="text-sm font-bold text-foreground">
          {t("advanced.title")}
        </h3>

        {/* Country selector for sensitivity/MC tabs */}
        {extraResults.length > 0 && activeTab !== "fire" && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">
              {locale === "ja" ? "対象国:" : "Country:"}
            </span>
            <div className="flex flex-wrap gap-1">
              {allResults.map((r, i) => {
                const preset = countryPresets.find((c) => c.code === r.input.countryTo);
                const name = preset?.name[locale] || r.input.countryTo;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedCountryIndex(i)}
                    className={`px-2.5 py-1 text-xs rounded-full font-medium transition-all ${
                      selectedCountryIndex === i
                        ? "bg-primary text-white"
                        : "bg-surface text-muted hover:text-foreground"
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

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
        <SensitivityChart results={sensitivityData} currency={activeResult.input.currencyTarget} />
      )}

      {activeTab === "fire" && fireData && (
        <FirePanel
          result={fireData}
          input={result.input}
          extraResults={extraResults}
          extraFireData={extraFireData}
        />
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
            <MonteCarloChart result={monteCarloData} currency={activeResult.input.currencyTarget} />
          )}
        </>
      )}
    </div>
  );
}
