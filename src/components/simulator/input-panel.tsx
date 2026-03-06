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
import { INDUSTRIES, INDUSTRY_SALARIES, IndustryKey } from "@/data/industry-salaries";
import { HOUSEHOLD_TYPES, HOUSING_COSTS, HouseholdType } from "@/data/housing-costs";

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
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryKey | "">("");
  const [selectedExtraIndustries, setSelectedExtraIndustries] = useState<(IndustryKey | "")[]>([]);
  const [selectedHousehold, setSelectedHousehold] = useState<HouseholdType | "">("");
  const [selectedExtraHouseholds, setSelectedExtraHouseholds] = useState<(HouseholdType | "")[]>([]);
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
          excludeCodes={[input.countryTo, ...extraInputs.map(e => e.countryTo)].filter(Boolean)}
        />
        <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-primary-light text-primary mb-0.5">
          <Plane className="h-4 w-4" />
        </div>
        <CountrySelector
          label={t("input.movingTo")}
          value={input.countryTo}
          onChange={handleCountryToChange}
          excludeCodes={[input.countryFrom, ...extraInputs.map(e => e.countryTo)].filter(Boolean)}
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
            onCurrencyClick={
              input.incomeCurrent > 0 && input.exchangeRate > 0
                ? () => update({ incomeTarget: Math.round(input.incomeCurrent / input.exchangeRate) })
                : undefined
            }
            currency={toCountry?.currencySymbol}
          />
        </div>
        {toCountry && INDUSTRY_SALARIES[toCountry.code] && (
          <div className="mt-2">
            <select
              value={selectedIndustry}
              onChange={(e) => {
                const key = e.target.value as IndustryKey | "";
                setSelectedIndustry(key);
                if (key) {
                  const salary = INDUSTRY_SALARIES[toCountry.code]?.[key];
                  if (salary) update({ incomeTarget: salary });
                  // 比較国（2〜4か国目）にも同じ業種の給与を反映
                  if (onExtraInputsChange && extraInputsRef.current.length > 0) {
                    const updatedExtras = extraInputsRef.current.map((extra) => {
                      const extraSalary = extra.countryTo ? INDUSTRY_SALARIES[extra.countryTo]?.[key] : undefined;
                      return extraSalary ? { ...extra, incomeTarget: extraSalary } : extra;
                    });
                    onExtraInputsChange(updatedExtras);
                    setSelectedExtraIndustries(extraInputsRef.current.map(() => key));
                  }
                }
              }}
              className="w-full text-xs border border-border/60 rounded-lg py-1.5 px-2 bg-white text-muted focus:outline-none focus:ring-1 focus:ring-primary/30 cursor-pointer"
            >
              <option value="">
                {locale === "ja" ? "📊 業種別平均年収を参照して入力..." : locale === "zh" ? "📊 按行业查看平均薪资..." : "📊 Browse avg. salary by industry..."}
              </option>
              {INDUSTRIES.map((ind) => {
                const salary = INDUSTRY_SALARIES[toCountry.code]?.[ind.key];
                const label = locale === "ja" ? ind.ja : locale === "zh" ? ind.zh : ind.en;
                return (
                  <option key={ind.key} value={ind.key}>
                    {label}{salary ? ` — ${salary.toLocaleString()}` : ""}
                  </option>
                );
              })}
            </select>
            <p className="text-[10px] text-muted/60 mt-1 pl-1">
              {locale === "ja"
                ? "※ 外国人プロフェッショナルの参考値です。実際の年収は経験・スキルにより異なります。"
                : locale === "zh"
                ? "※ 为外籍专业人士参考值，实际薪资因经验技能而异。"
                : "※ Reference for expat professionals. Actual salary varies by experience & skills."}
            </p>
          </div>
        )}
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
        {toCountry && HOUSING_COSTS[toCountry.code] && (
          <div className="mt-2">
            <select
              value={selectedHousehold}
              onChange={(e) => {
                const key = e.target.value as HouseholdType | "";
                setSelectedHousehold(key);
                if (key) {
                  const costs = HOUSING_COSTS[toCountry.code]?.[key];
                  if (costs) update({ rentTarget: costs.rent, livingCostTarget: costs.living });
                  // 比較国（2〜4か国目）にも同じ世帯タイプを反映
                  if (onExtraInputsChange && extraInputsRef.current.length > 0) {
                    const updatedExtras = extraInputsRef.current.map((extra) => {
                      const extraCosts = extra.countryTo ? HOUSING_COSTS[extra.countryTo]?.[key] : undefined;
                      return extraCosts
                        ? { ...extra, rentTarget: extraCosts.rent, livingCostTarget: extraCosts.living }
                        : extra;
                    });
                    onExtraInputsChange(updatedExtras);
                    setSelectedExtraHouseholds(extraInputsRef.current.map(() => key));
                  }
                }
              }}
              className="w-full text-xs border border-border/60 rounded-lg py-1.5 px-2 bg-white text-muted focus:outline-none focus:ring-1 focus:ring-primary/30 cursor-pointer"
            >
              <option value="">
                {locale === "ja" ? "🏠 世帯タイプ別の平均家賃・生活費を参照..." : locale === "zh" ? "🏠 按家庭类型查看平均租金和生活费..." : "🏠 Browse avg. rent & living cost by household type..."}
              </option>
              {HOUSEHOLD_TYPES.map((ht) => {
                const costs = HOUSING_COSTS[toCountry.code]?.[ht.key];
                const label = locale === "ja" ? ht.ja : locale === "zh" ? ht.zh : ht.en;
                return (
                  <option key={ht.key} value={ht.key}>
                    {label}{costs
                      ? locale === "ja"
                        ? ` — 家賃 ${costs.rent.toLocaleString()} / 生活費 ${costs.living.toLocaleString()}`
                        : locale === "zh"
                        ? ` — 租金 ${costs.rent.toLocaleString()} / 生活费 ${costs.living.toLocaleString()}`
                        : ` — Rent ${costs.rent.toLocaleString()} / Living ${costs.living.toLocaleString()}`
                      : ""}
                  </option>
                );
              })}
            </select>
            <p className="text-[10px] text-muted/60 mt-1 pl-1">
              {locale === "ja"
                ? "※ 実際の相場と異なる場合があります。"
                : locale === "zh"
                ? "※ 实际情况可能有所不同。"
                : "※ Actual costs may vary."}
            </p>
          </div>
        )}
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
                className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark px-3 py-2 rounded-lg hover:bg-primary/5 transition-all"
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
                    className="p-2 text-muted hover:text-foreground rounded hover:bg-secondary/80 transition-all"
                    aria-label="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <CountrySelector
                  label={t("input.movingTo")}
                  value={extra.countryTo}
                  onChange={(code) => handleExtraCountryChange(index, code)}
                  excludeCodes={[
                    input.countryFrom,
                    input.countryTo,
                    ...extraInputs.filter((_, i) => i !== index).map(e => e.countryTo),
                  ].filter(Boolean)}
                />

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
                    <CurrencyInput
                      label={`${locale === "ja" ? "年収" : "Annual Income"} (${extraCountry?.currency || ""})`}
                      value={extra.incomeTarget}
                      onChange={(v) => updateExtra(index, { incomeTarget: v })}
                      onCurrencyClick={
                        input.incomeCurrent > 0 && extra.exchangeRate > 0
                          ? () => updateExtra(index, { incomeTarget: Math.round(input.incomeCurrent / extra.exchangeRate) })
                          : undefined
                      }
                      currency={extraCountry?.currencySymbol}
                    />
                    {extraCountry && INDUSTRY_SALARIES[extraCountry.code] && (
                      <>
                        <select
                          value={selectedExtraIndustries[index] ?? ""}
                          onChange={(e) => {
                            const key = e.target.value as IndustryKey | "";
                            setSelectedExtraIndustries((prev) => {
                              const next = [...prev];
                              while (next.length <= index) next.push("");
                              next[index] = key;
                              return next;
                            });
                            if (key) {
                              const salary = INDUSTRY_SALARIES[extraCountry.code]?.[key];
                              if (salary) updateExtra(index, { incomeTarget: salary });
                            }
                          }}
                          className="w-full text-xs border border-border/60 rounded-lg py-1.5 px-2 bg-white text-muted focus:outline-none focus:ring-1 focus:ring-primary/30 cursor-pointer"
                        >
                          <option value="">
                            {locale === "ja" ? "📊 業種別平均年収..." : "📊 Avg. salary by industry..."}
                          </option>
                          {INDUSTRIES.map((ind) => {
                            const salary = INDUSTRY_SALARIES[extraCountry.code]?.[ind.key];
                            const label = locale === "ja" ? ind.ja : locale === "zh" ? ind.zh : ind.en;
                            return (
                              <option key={ind.key} value={ind.key}>
                                {label}{salary ? ` — ${salary.toLocaleString()}` : ""}
                              </option>
                            );
                          })}
                        </select>
                        <p className="text-[10px] text-muted/60 mt-1 pl-1">
                          {locale === "ja"
                            ? "※ 外国人プロフェッショナルの参考値です。実際の年収は経験・スキルにより異なります。"
                            : locale === "zh"
                            ? "※ 为外籍专业人士参考值，实际薪资因经验技能而异。"
                            : "※ Reference for expat professionals. Actual salary varies by experience & skills."}
                        </p>
                      </>
                    )}
                  </div>
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
                  {extraCountry && HOUSING_COSTS[extraCountry.code] && (
                    <div className="col-span-2">
                      <select
                        value={selectedExtraHouseholds[index] ?? ""}
                        onChange={(e) => {
                          const key = e.target.value as HouseholdType | "";
                          setSelectedExtraHouseholds((prev) => {
                            const next = [...prev];
                            while (next.length <= index) next.push("");
                            next[index] = key;
                            return next;
                          });
                          if (key) {
                            const costs = HOUSING_COSTS[extraCountry.code]?.[key];
                            if (costs) updateExtra(index, { rentTarget: costs.rent, livingCostTarget: costs.living });
                          }
                        }}
                        className="w-full text-xs border border-border/60 rounded-lg py-1.5 px-2 bg-white text-muted focus:outline-none focus:ring-1 focus:ring-primary/30 cursor-pointer"
                      >
                        <option value="">
                          {locale === "ja" ? "🏠 世帯タイプ別の平均家賃・生活費を参照..." : locale === "zh" ? "🏠 按家庭类型查看平均租金和生活费..." : "🏠 Browse avg. rent & living cost by household type..."}
                        </option>
                        {HOUSEHOLD_TYPES.map((ht) => {
                          const costs = HOUSING_COSTS[extraCountry.code]?.[ht.key];
                          const label = locale === "ja" ? ht.ja : locale === "zh" ? ht.zh : ht.en;
                          return (
                            <option key={ht.key} value={ht.key}>
                              {label}{costs
                                ? locale === "ja"
                                  ? ` — 家賃 ${costs.rent.toLocaleString()} / 生活費 ${costs.living.toLocaleString()}`
                                  : locale === "zh"
                                  ? ` — 租金 ${costs.rent.toLocaleString()} / 生活费 ${costs.living.toLocaleString()}`
                                  : ` — Rent ${costs.rent.toLocaleString()} / Living ${costs.living.toLocaleString()}`
                                : ""}
                            </option>
                          );
                        })}
                      </select>
                      <p className="text-[10px] text-muted/60 mt-1 pl-1">
                        {locale === "ja"
                          ? "※ 実際の相場と異なる場合があります。"
                          : locale === "zh"
                          ? "※ 实际情况可能有所不同。"
                          : "※ Actual costs may vary."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
