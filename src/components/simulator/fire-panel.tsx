"use client";

import { FireResult, SimulationInput, SimulationResult } from "@/lib/simulation/types";
import { countryPresets } from "@/data/country-presets";
import { Flame, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface FirePanelProps {
  result: FireResult;
  input: SimulationInput;
  extraResults?: SimulationResult[];
  extraFireData?: FireResult[];
}

export function FirePanel({ result, input, extraResults = [], extraFireData = [] }: FirePanelProps) {
  const { locale, t } = useTranslation();

  const fromPreset = countryPresets.find((c) => c.code === input.countryFrom);
  const toPreset = countryPresets.find((c) => c.code === input.countryTo);
  const fromName = fromPreset?.name[locale] || input.countryFrom;
  const toName = toPreset?.name[locale] || input.countryTo;

  const diff =
    result.currentCountryYears != null && result.targetCountryYears != null
      ? result.currentCountryYears - result.targetCountryYears
      : null;

  const formatCurrency = (value: number, currency: string) => {
    return `${currency} ${Math.round(value).toLocaleString()}`;
  };

  const hasExtra = extraResults.length > 0;

  return (
    <div>
      <p className="text-xs text-muted mb-4">
        {t("advanced.fireDesc")}
      </p>

      <div className={`grid ${hasExtra ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"} gap-3 mb-4`}>
        {/* Current Country */}
        <div className="border border-border/60 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold text-foreground">{fromName}</span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {result.currentCountryYears != null ? (
              <>{result.currentCountryYears}<span className="text-lg font-medium text-muted ml-1">{t("advanced.years")}</span></>
            ) : (
              <span className="text-lg text-muted">{t("advanced.notAchievable")}</span>
            )}
          </div>
          <div className="text-xs text-muted mt-2">
            {t("advanced.fireTarget")}: {formatCurrency(result.fireTargetAmountCurrent, input.currencyCurrent)}
          </div>
          <div className="text-xs text-muted">
            {t("advanced.annualExpenses")}: {formatCurrency(result.annualExpensesCurrent, input.currencyCurrent)}
          </div>
        </div>

        {/* Main Target Country */}
        <div className="border border-primary/20 rounded-xl p-4 bg-primary/5">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold text-foreground">{toName}</span>
          </div>
          <div className="text-3xl font-bold text-primary mb-1">
            {result.targetCountryYears != null ? (
              <>{result.targetCountryYears}<span className="text-lg font-medium text-muted ml-1">{t("advanced.years")}</span></>
            ) : (
              <span className="text-lg text-muted">{t("advanced.notAchievable")}</span>
            )}
          </div>
          <div className="text-xs text-muted mt-2">
            {t("advanced.fireTarget")}: {formatCurrency(result.fireTargetAmountTarget, input.currencyTarget)}
          </div>
          <div className="text-xs text-muted">
            {t("advanced.annualExpenses")}: {formatCurrency(result.annualExpensesTarget, input.currencyTarget)}
          </div>
        </div>

        {/* Extra Countries */}
        {extraResults.map((er, i) => {
          const fireData = extraFireData[i];
          if (!fireData) return null;
          const preset = countryPresets.find((c) => c.code === er.input.countryTo);
          const name = preset?.name[locale] || er.input.countryTo;
          return (
            <div key={i} className="border border-amber-200/60 rounded-xl p-4 bg-amber-50/40">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-semibold text-foreground">{name}</span>
              </div>
              <div className="text-3xl font-bold text-amber-600 mb-1">
                {fireData.targetCountryYears != null ? (
                  <>{fireData.targetCountryYears}<span className="text-lg font-medium text-muted ml-1">{t("advanced.years")}</span></>
                ) : (
                  <span className="text-lg text-muted">{t("advanced.notAchievable")}</span>
                )}
              </div>
              <div className="text-xs text-muted mt-2">
                {t("advanced.fireTarget")}: {formatCurrency(fireData.fireTargetAmountTarget, er.input.currencyTarget)}
              </div>
              <div className="text-xs text-muted">
                {t("advanced.annualExpenses")}: {formatCurrency(fireData.annualExpensesTarget, er.input.currencyTarget)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Difference (main comparison only) */}
      {diff != null && (
        <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-surface">
          {diff > 0 ? (
            <>
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold text-accent">
                {t("advanced.fireFaster", { years: diff })}
              </span>
            </>
          ) : diff < 0 ? (
            <>
              <TrendingDown className="h-4 w-4 text-danger" />
              <span className="text-sm font-semibold text-danger">
                {t("advanced.fireSlower", { years: Math.abs(diff) })}
              </span>
            </>
          ) : (
            <>
              <Minus className="h-4 w-4 text-muted" />
              <span className="text-sm font-medium text-muted">
                {t("advanced.fireSame")}
              </span>
            </>
          )}
        </div>
      )}

      <p className="text-xs text-muted mt-3 text-center">
        {t("advanced.fireNote")}
      </p>
    </div>
  );
}
