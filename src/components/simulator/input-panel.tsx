"use client";

import { SimulationInput } from "@/lib/simulation/types";
import { countryPresets } from "@/data/country-presets";
import { CountrySelector } from "./country-selector";
import { CurrencyInput } from "./currency-input";
import { ArrowRight, Plane } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface InputPanelProps {
  input: SimulationInput;
  onChange: (input: SimulationInput) => void;
  onSimulate: () => void;
}

export function InputPanel({ input, onChange, onSimulate }: InputPanelProps) {
  const { t } = useTranslation();
  const fromCountry = countryPresets.find((c) => c.code === input.countryFrom);
  const toCountry = countryPresets.find((c) => c.code === input.countryTo);

  const update = (partial: Partial<SimulationInput>) => {
    onChange({ ...input, ...partial });
  };

  const handleCountryFromChange = (code: string) => {
    const country = countryPresets.find((c) => c.code === code);
    if (country) {
      update({
        countryFrom: code,
        currencyCurrent: country.currency,
        taxRateCurrent: country.defaultTaxRate,
        inflationCurrent: country.defaultInflation,
        rentCurrent: country.referenceRent,
        livingCostCurrent: country.referenceLivingCost,
      });
    }
  };

  const handleCountryToChange = (code: string) => {
    const country = countryPresets.find((c) => c.code === code);
    if (country) {
      update({
        countryTo: code,
        currencyTarget: country.currency,
        taxRateTarget: country.defaultTaxRate,
        inflationTarget: country.defaultInflation,
        rentTarget: country.referenceRent,
        livingCostTarget: country.referenceLivingCost,
      });
    }
  };

  const canSimulate = input.countryFrom && input.countryTo && input.incomeCurrent > 0 && input.incomeTarget > 0;

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
          <CurrencyInput
            label={t("input.exchangeRate")}
            value={input.exchangeRate}
            onChange={(v) => update({ exchangeRate: v })}
            step={0.01}
            hint={`1 ${toCountry?.currency || ""} = ? ${fromCountry?.currency || ""}`}
          />
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
    </div>
  );
}
