"use client";

import { SimulationResult } from "@/lib/simulation/types";
import { countryPresets } from "@/data/country-presets";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "@/lib/i18n";

interface BreakdownChartProps {
  result: SimulationResult;
  extraResults?: SimulationResult[];
}

const EXTRA_COLORS = ["#f59e0b", "#ef4444", "#8b5cf6"];

export function BreakdownChart({ result, extraResults = [] }: BreakdownChartProps) {
  const { locale, t } = useTranslation();
  const { monthlyBreakdown, input } = result;

  const fromPreset = countryPresets.find((c) => c.code === input.countryFrom);
  const toPreset = countryPresets.find((c) => c.code === input.countryTo);
  const fromName = fromPreset?.name[locale] || input.countryFrom;
  const toName = toPreset?.name[locale] || input.countryTo;

  const extraNames = extraResults.map((er) => {
    const preset = countryPresets.find((c) => c.code === er.input.countryTo);
    return preset?.name[locale] || er.input.countryTo;
  });

  const categoryKeys = ["income", "rent", "living", "tax", "savings"] as const;

  const data = categoryKeys.map((key) => {
    const entry: Record<string, number | string> = {
      category: t(`results.${key}`),
      [fromName]: monthlyBreakdown.current[key],
      [toName]: monthlyBreakdown.target[key],
    };
    extraResults.forEach((er, i) => {
      entry[extraNames[i]] = er.monthlyBreakdown.target[key];
    });
    return entry;
  });

  const extraCurrencyLabels = extraResults
    .map((er, i) => ` vs ${extraNames[i]} (${er.input.currencyTarget})`)
    .join("");

  return (
    <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-bold text-foreground mb-1">
        {t("results.monthlyBreakdown")}
      </h3>
      <p className="text-xs text-muted mb-4">
        {fromName} ({input.currencyCurrent}) vs {toName} ({input.currencyTarget})
        {extraCurrencyLabels} - {t("results.eachInLocal")}
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey={fromName} fill="#4f46e5" radius={[6, 6, 0, 0]} />
            <Bar dataKey={toName} fill="#06d6a0" radius={[6, 6, 0, 0]} />
            {extraResults.map((_, i) => (
              <Bar
                key={i}
                dataKey={extraNames[i]}
                fill={EXTRA_COLORS[i] ?? "#94a3b8"}
                radius={[6, 6, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
