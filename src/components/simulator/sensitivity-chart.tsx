"use client";

import { SensitivityResult } from "@/lib/simulation/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { useTranslation } from "@/lib/i18n";

interface SensitivityChartProps {
  results: SensitivityResult[];
  currency: string;
}

const PARAM_LABELS: Record<string, { en: string; ja: string; zh: string }> = {
  income: { en: "Income", ja: "年収", zh: "收入" },
  investmentReturn: { en: "Investment Return", ja: "投資リターン", zh: "投资回报" },
  inflation: { en: "Inflation", ja: "インフレ率", zh: "通胀率" },
  rent: { en: "Rent", ja: "家賃", zh: "房租" },
  livingCost: { en: "Living Cost", ja: "生活費", zh: "生活费" },
};

export function SensitivityChart({ results, currency }: SensitivityChartProps) {
  const { locale, t } = useTranslation();

  const data = results.map((r) => ({
    name: PARAM_LABELS[r.paramName]?.[locale] || r.paramName,
    low: r.lowDelta,
    high: r.highDelta,
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

  return (
    <div>
      <p className="text-xs text-muted mb-4">
        {t("advanced.sensitivityDesc")}
      </p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" tickFormatter={formatValue} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
            <Tooltip
              formatter={(value) => `${currency} ${Number(value).toLocaleString()}`}
            />
            <ReferenceLine x={0} stroke="#94a3b8" />
            <Bar dataKey="low" name={t("advanced.decrease")} stackId="a">
              {data.map((_, index) => (
                <Cell key={`low-${index}`} fill="#ef4444" fillOpacity={0.7} />
              ))}
            </Bar>
            <Bar dataKey="high" name={t("advanced.increase")} stackId="a">
              {data.map((_, index) => (
                <Cell key={`high-${index}`} fill="#10b981" fillOpacity={0.7} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted mt-2 text-center">
        {t("advanced.sensitivityNote")}
      </p>
    </div>
  );
}
