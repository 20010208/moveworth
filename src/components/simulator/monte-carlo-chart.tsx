"use client";

import { MonteCarloResult } from "@/lib/simulation/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTranslation } from "@/lib/i18n";

interface MonteCarloChartProps {
  result: MonteCarloResult;
  currency: string;
}

export function MonteCarloChart({ result, currency }: MonteCarloChartProps) {
  const { t } = useTranslation();

  const data = result.percentiles.map((p) => ({
    year: p.year,
    p10_p90: [Math.round(p.p10), Math.round(p.p90)],
    p25_p75: [Math.round(p.p25), Math.round(p.p75)],
    p50: Math.round(p.p50),
    // For area stacking
    p10: Math.round(p.p10),
    p25: Math.round(p.p25),
    p75: Math.round(p.p75),
    p90: Math.round(p.p90),
  }));

  const formatValue = (value: number) => {
    if (Math.abs(value) >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1_000) {
      return `${(value / 1_000).toFixed(0)}K`;
    }
    return value.toFixed(0);
  };

  const { stats } = result;

  return (
    <div>
      <p className="text-xs text-muted mb-4">
        {t("advanced.monteCarloDesc")}
      </p>

      {/* Fan Chart */}
      <div className="h-72 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={formatValue} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value) =>
                `${currency} ${Number(value).toLocaleString()}`
              }
            />
            <Area
              type="monotone"
              dataKey="p90"
              stroke="none"
              fill="#4f46e5"
              fillOpacity={0.08}
              name="90th"
            />
            <Area
              type="monotone"
              dataKey="p75"
              stroke="none"
              fill="#4f46e5"
              fillOpacity={0.12}
              name="75th"
            />
            <Area
              type="monotone"
              dataKey="p50"
              stroke="#4f46e5"
              strokeWidth={2}
              fill="#4f46e5"
              fillOpacity={0.18}
              name={t("advanced.median")}
            />
            <Area
              type="monotone"
              dataKey="p25"
              stroke="none"
              fill="#ffffff"
              fillOpacity={0.6}
              name="25th"
            />
            <Area
              type="monotone"
              dataKey="p10"
              stroke="none"
              fill="#ffffff"
              fillOpacity={0.8}
              name="10th"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard
          label={t("advanced.median")}
          value={`${currency} ${formatValue(stats.median)}`}
        />
        <StatCard
          label={t("advanced.mean")}
          value={`${currency} ${formatValue(stats.mean)}`}
        />
        <StatCard
          label={t("advanced.bestCase")}
          value={`${currency} ${formatValue(stats.max)}`}
          color="text-accent"
        />
        <StatCard
          label={t("advanced.worstCase")}
          value={`${currency} ${formatValue(stats.min)}`}
          color="text-danger"
        />
        <StatCard
          label={t("advanced.stdDev")}
          value={`${currency} ${formatValue(stats.stdDev)}`}
        />
        <StatCard
          label={t("advanced.lossProb")}
          value={`${(stats.probabilityOfLoss * 100).toFixed(1)}%`}
          color={stats.probabilityOfLoss > 0.3 ? "text-danger" : "text-accent"}
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="border border-border/60 rounded-lg p-2.5 text-center">
      <div className="text-xs text-muted mb-0.5">{label}</div>
      <div className={`text-sm font-bold ${color || "text-foreground"}`}>{value}</div>
    </div>
  );
}
