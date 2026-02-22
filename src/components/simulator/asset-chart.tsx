"use client";

import { SimulationResult } from "@/lib/simulation/types";
import { countryPresets } from "@/data/country-presets";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "@/lib/i18n";

interface AssetChartProps {
  result: SimulationResult;
  extraResults?: SimulationResult[];
}

const EXTRA_COLORS = ["#f59e0b", "#ef4444", "#8b5cf6"];

export function AssetChart({ result, extraResults = [] }: AssetChartProps) {
  const { locale, t } = useTranslation();

  const fromPreset = countryPresets.find((c) => c.code === result.input.countryFrom);
  const toPreset = countryPresets.find((c) => c.code === result.input.countryTo);
  const fromName = fromPreset?.name[locale] || result.input.countryFrom;
  const toName = toPreset?.name[locale] || result.input.countryTo;

  // Extra country names (deduplicate if same country selected)
  const extraNames = extraResults.map((er) => {
    const preset = countryPresets.find((c) => c.code === er.input.countryTo);
    return preset?.name[locale] || er.input.countryTo;
  });

  const data = result.yearlyResults.map((yr, yearIndex) => {
    const entry: Record<string, number | string> = {
      year: t("results.year", { n: yr.year }),
      [fromName]: Math.round(yr.assetCurrent),
      [toName]: Math.round(yr.assetTargetConverted),
    };

    // Add extra countries (all converted to base currency)
    extraResults.forEach((er, i) => {
      const erYr = er.yearlyResults[yearIndex];
      if (erYr) {
        entry[extraNames[i]] = Math.round(erYr.assetTargetConverted);
      }
    });

    return entry;
  });

  const formatValue = (value: number) => {
    if (Math.abs(value) >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1_000) {
      return `${(value / 1_000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-bold text-foreground mb-4">
        {t("results.assetProjection")} ({result.input.currencyCurrent})
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={formatValue} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) =>
                `${result.input.currencyCurrent} ${Number(value).toLocaleString()}`
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={fromName}
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey={toName}
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            {extraResults.map((_, i) => (
              <Line
                key={i}
                type="monotone"
                dataKey={extraNames[i]}
                stroke={EXTRA_COLORS[i] ?? "#94a3b8"}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
