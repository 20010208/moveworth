"use client";

import { useState, useRef } from "react";
import { SimulationInput, ExtraComparisonInput } from "@/lib/simulation/types";
import { UserPlan } from "@/lib/auth";
import { countryPresets } from "@/data/country-presets";
import { CountrySelector } from "./country-selector";
import { CurrencyInput } from "./currency-input";
import { ArrowRight, Plane, Loader2, Plus, X, Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { fetchExchangeRate } from "@/lib/exchange-rate";

const MAX_EXTRA = 3;

interface InputPanelProps {
  input: SimulationInput;
  onChange: (input: SimulationInput) => void;
  onSimulate: () => void;
  plan?: UserPlan;
  extraInputs?: ExtraComparisonInput[];
  onExtraInputsChange?: (extras: ExtraComparisonInput[]) => void;
}

export function InputPanel({
  input,
  onChange,
  onSimulate,
  plan = "free",
  extraInputs = [],
  onExtraInputsChange,
}: InputPanelProps) {
  const { t, locale } = useTranslation();
  const [fetchingRate, setFetchingRate] = useState(false);
  const [fetchingExtraRates, setFetchingExtraRates] = useState<boolean[]>([]);
  const inputRef = useRef(input);
  inputRef.current = input;
  const extraInputsRef = useRef(extraInputs);
  extraInputsRef.current = extraInputs;

  const isPremium = plan === "premium";

  const fromCountry = countryPresets.find((c) => c.code === input.countryFrom);
  const toCountry = countryPresets.find((c) => c.code === input.countryTo);

  const update = (partial: Partial<SimulationInput>) => {
    onChange({ ...input, ...partial });
  };

  const fetchAndSetRate = async (fromCurrency: string, toCurrency: string) => {
    if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) return;
    setFetchingRate(true);
    try {
      const rate = await fetchExchangeRate(fromCurrency, toCurrency);
      if (rate !== null) {
        onChange({ ...inputRef.current, exchangeRate: Math.round(rate * 100) / 100 });
      }
    } finally {
      setFetchingRate(false);
    }
  };

  const handleCountryFromChange = (code: string) => {
    const country = countryPresets.find((c) => c.code === code);
    if (country) {
      const newInput = {
        ...input,
        countryFrom: code,
        currencyCurrent: country.currency,
        taxRateCurrent: country.defaultTaxRate,
        inflationCurrent: country.defaultInflation,
        rentCurrent: country.referenceRent,
        livingCostCurrent: country.referenceLivingCost,
      };
      onChange(newInput);
      const toPreset = countryPresets.find((c) => c.code === input.countryTo);
      if (toPreset) {
        fetchAndSetRate(country.currency, toPreset.currency);
      }
    }
  };

  const handleCountryToChange = (code: string) => {
    const country = countryPresets.find((c) => c.code === code);
    if (country) {
      const newInput = {
        ...input,
        countryTo: code,
        currencyTarget: country.currency,
        taxRateTarget: country.defaultTaxRate,
        inflationTarget: country.defaultInflation,
        rentTarget: country.referenceRent,
        livingCostTarget: country.referenceLivingCost,
      };
      onChange(newInput);
      const fromPreset = countryPresets.find((c) => c.code === input.countryFrom);
      if (fromPreset) {
        fetchAndSetRate(fromPreset.currency, country.currency);
      }
    }
  };

  // Extra country helpers
  const updateExtra = (index: number, partial: Partial<ExtraComparisonInput>) => {
    if (!onExtraInputsChange) return;
    const updated = extraInputsRef.current.map((item, i) =>
      i === index ? { ...item, ...partial } : item
    );
    onExtraInputsChange(updated);
  };

  const handleExtraCountryChange = async (index: number, code: string) => {
    const country = countryPresets.find((c) => c.code === code);
    if (!country) return;
    const baseValues: Partial<ExtraComparisonInput> = {
      countryTo: code,
      currencyTarget: country.currency,
      taxRateTarget: country.defaultTaxRate,
      inflationTarget: country.defaultInflation,
      rentTarget: country.referenceRent,
      livingCostTarget: country.referenceLivingCost,
      exchangeRate: 1,
    };
    updateExtra(index, baseValues);

    const fromCurrency = inputRef.current.currencyCurrent;
    if (fromCurrency && country.currency && fromCurrency !== country.currency) {
      setFetchingExtraRates((prev) => {
        const next = [...prev];
        while (next.length <= index) next.push(false);
        next[index] = true;
        return next;
      });
      try {
        const rate = await fetchExchangeRate(fromCurrency, country.currency);
        if (rate !== null) {
          updateExtra(index, { exchangeRate: Math.round(rate * 100) / 100 });
        }
      } finally {
        setFetchingExtraRates((prev) => {
          const next = [...prev];
          if (next[index] !== undefined) next[index] = false;
          return next;
        });
      }
    }
  };

  const addExtraCountry = () => {
    if (!onExtraInputsChange || extraInputs.length >= MAX_EXTRA) return;
    onExtraInputsChange([
      ...extraInputs,
      {
        countryTo: "",
        incomeTarget: 0,
        currencyTarget: "",
        rentTarget: 0,
        livingCostTarget: 0,
        taxRateTarget: 0.15,
        inflationTarget: 0.03,
        exchangeRate: 1,
      },
    ]);
    setFetchingExtraRates((prev) => [...prev, false]);
  };

  const removeExtraCountry = (index: number) => {
    if (!onExtraInputsChange) return;
    onExtraInputsChange(extraInputs.filter((_, i) => i !== index));
    setFetchingExtraRates((prev) => prev.filter((_, i) => i !== index));
  };

  const canSimulate =
    input.countryFrom && input.countryTo && input.incomeCurrent > 0 && input.incomeTarget > 0;

  return (
    <div className="bg-white border border-border/60 rounded-2xl p-6 space-y-6 shadow-sm">
      <h2 className="text-lg font-bold text-foreground">{t("input.title")}</h2>

      {/* Country Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <CountrySelector
          label={t("input.currentCountry")}
          value={input.countryFrom}
          onChange={handleCountryFromChange}
        />
        <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-primary-light text-primary mb-0.5">
          <Plane className="h-4 w-4" />
        </div>
        <CountrySelector
          label={t("input.movingTo")}
          value={input.countryTo}
          onChange={handleCountryToChange}
        />
      </div>

      {/* Income */}
      <div>
        <h3 className="text-xs font-semibold text-muted mb-3 uppercase tracking-wider">
          {t("input.income")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CurrencyInput
            label={`${t("input.current")} (${fromCountry?.currency || ""})`}
            value={input.incomeCurrent}
            onChange={(v) => update({ incomeCurrent: v })}
            currency={fromCountry?.currencySymbol}
          />
          <CurrencyInput
            label={`${t("input.target")} (${toCountry?.currency || ""})`}
            value={input.incomeTarget}
            onChange={(v) => update({ incomeTarget: v })}
            currency={toCountry?.currencySymbol}
          />
        </div>
      </div>

      {/* Savings */}
      <CurrencyInput
        label={t("input.currentSavings")}
        value={input.currentSavings}
        onChange={(v) => update({ currentSavings: v })}
        currency={fromCountry?.currencySymbol}
        hint={t("input.inCurrency", { currency: fromCountry?.currency || "" })}
      />

      {/* Expenses */}
      <div>
        <h3 className="text-xs font-semibold text-muted mb-3 uppercase tracking-wider">
          {t("input.monthlyExpenses")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CurrencyInput
            label={`${t("input.rentCurrent")} (${fromCountry?.currency || ""})`}
            value={input.rentCurrent}
            onChange={(v) => update({ rentCurrent: v })}
            currency={fromCountry?.currencySymbol}
          />
          <CurrencyInput
            label={`${t("input.rentTarget")} (${toCountry?.currency || ""})`}
            value={input.rentTarget}
            onChange={(v) => update({ rentTarget: v })}
            currency={toCountry?.currencySymbol}
          />
          <CurrencyInput
            label={`${t("input.livingCurrent")} (${fromCountry?.currency || ""})`}
            value={input.livingCostCurrent}
            onChange={(v) => update({ livingCostCurrent: v })}
            currency={fromCountry?.currencySymbol}
          />
          <CurrencyInput
            label={`${t("input.livingTarget")} (${toCountry?.currency || ""})`}
            value={input.livingCostTarget}
            onChange={(v) => update({ livingCostTarget: v })}
            currency={toCountry?.currencySymbol}
          />
        </div>
      </div>

      {/* Tax & Macro */}
      <div>
        <h3 className="text-xs font-semibold text-muted mb-3 uppercase tracking-wider">
          {t("input.taxEconomic")}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <CurrencyInput
            label={t("input.taxRateCurrent")}
            value={Math.round(input.taxRateCurrent * 100)}
            onChange={(v) => update({ taxRateCurrent: v / 100 })}
            suffix="%"
            max={100}
          />
          <CurrencyInput
            label={t("input.taxRateTarget")}
            value={Math.round(input.taxRateTarget * 100)}
            onChange={(v) => update({ taxRateTarget: v / 100 })}
            suffix="%"
            max={100}
          />
          <div className="relative">
            <CurrencyInput
              label={
                fromCountry && toCountry && input.exchangeRate > 0
                  ? `${t("input.exchangeRate")} (1 ${toCountry.currency} = ${input.exchangeRate} ${fromCountry.currency})`
                  : t("input.exchangeRate")
              }
              value={input.exchangeRate}
              onChange={(v) => update({ exchangeRate: v })}
              step={0.01}
            />
            {fetchingRate && (
              <div className="absolute right-3 top-7 flex items-center">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
          </div>
          <CurrencyInput
            label={t("input.salaryGrowth")}
            value={Math.round(input.salaryGrowthRate * 100)}
            onChange={(v) => update({ salaryGrowthRate: v / 100 })}
            suffix="%"
            max={50}
          />
          <CurrencyInput
            label={t("input.inflationCurrent")}
            value={Number((input.inflationCurrent * 100).toFixed(1))}
            onChange={(v) => update({ inflationCurrent: v / 100 })}
            suffix="%"
            step={0.1}
            max={50}
          />
          <CurrencyInput
            label={t("input.inflationTarget")}
            value={Number((input.inflationTarget * 100).toFixed(1))}
            onChange={(v) => update({ inflationTarget: v / 100 })}
            suffix="%"
            step={0.1}
            max={50}
          />
          <CurrencyInput
            label={t("input.investmentReturn")}
            value={Math.round(input.investmentReturn * 100)}
            onChange={(v) => update({ investmentReturn: v / 100 })}
            suffix="%"
            max={100}
          />
          <CurrencyInput
            label={t("input.simulationYears")}
            value={input.simulationYears}
            onChange={(v) => update({ simulationYears: v })}
            suffix="yrs"
            min={1}
            max={30}
          />
        </div>
      </div>

      {/* Simulate Button */}
      <button
        onClick={onSimulate}
        disabled={!canSimulate}
        className="group w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-3.5 rounded-xl font-semibold text-sm hover:from-primary-dark hover:to-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
      >
        {t("input.runSimulation")}
        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Premium: Additional Comparison Countries */}
      {isPremium && (
        <div className="pt-2 border-t border-border/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-amber-500" />
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
                {t("input.additionalCountries")}
              </h3>
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                Premium
              </span>
            </div>
            {extraInputs.length < MAX_EXTRA && (
              <button
                onClick={addExtraCountry}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark px-2 py-1 rounded-lg hover:bg-primary/5 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                {t("input.addCountry")}
              </button>
            )}
          </div>

          {extraInputs.length === 0 && (
            <p className="text-xs text-muted text-center py-2 bg-amber-50/50 rounded-xl">
              {locale === "ja"
                ? "最大3か国まで比較先を追加できます"
                : "Add up to 3 more countries to compare (4 total)"}
            </p>
          )}

          {extraInputs.map((extra, index) => {
            const extraCountry = countryPresets.find((c) => c.code === extra.countryTo);
            return (
              <div
                key={index}
                className="bg-amber-50/50 border border-amber-200/40 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-amber-700">
                    {locale === "ja" ? `比較国 ${index + 2}` : `Country ${index + 2}`}
                  </span>
                  <button
                    onClick={() => removeExtraCountry(index)}
                    className="p-1 text-muted hover:text-foreground rounded hover:bg-secondary/80 transition-all"
                    aria-label="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <CountrySelector
                  label={t("input.movingTo")}
                  value={extra.countryTo}
                  onChange={(code) => handleExtraCountryChange(index, code)}
                />

                <div className="grid grid-cols-2 gap-3">
                  <CurrencyInput
                    label={`${locale === "ja" ? "年収" : "Annual Income"} (${extraCountry?.currency || ""})`}
                    value={extra.incomeTarget}
                    onChange={(v) => updateExtra(index, { incomeTarget: v })}
                    currency={extraCountry?.currencySymbol}
                  />
                  <div className="relative">
                    <CurrencyInput
                      label={
                        fromCountry && extraCountry && extra.exchangeRate > 0
                          ? `${t("input.exchangeRate")} (1 ${extraCountry.currency} = ${extra.exchangeRate} ${fromCountry.currency})`
                          : t("input.exchangeRate")
                      }
                      value={extra.exchangeRate}
                      onChange={(v) => updateExtra(index, { exchangeRate: v })}
                      step={0.01}
                    />
                    {fetchingExtraRates[index] && (
                      <div className="absolute right-3 top-7 flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                  <CurrencyInput
                    label={`${t("input.rentTarget")} (${extraCountry?.currency || ""})`}
                    value={extra.rentTarget}
                    onChange={(v) => updateExtra(index, { rentTarget: v })}
                    currency={extraCountry?.currencySymbol}
                  />
                  <CurrencyInput
                    label={`${t("input.livingTarget")} (${extraCountry?.currency || ""})`}
                    value={extra.livingCostTarget}
                    onChange={(v) => updateExtra(index, { livingCostTarget: v })}
                    currency={extraCountry?.currencySymbol}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
