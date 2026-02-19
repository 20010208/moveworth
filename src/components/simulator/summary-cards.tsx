"use client";

import { SimulationResult } from "@/lib/simulation/types";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, PiggyBank, Target } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface SummaryCardsProps {
  result: SimulationResult;
}

export function SummaryCards({ result }: SummaryCardsProps) {
  const { t } = useTranslation();
  const {
    annualSavingsCurrent,
    annualSavingsTarget,
    fiveYearAssetCurrent,
    fiveYearAssetTarget,
    assetDifference,
    input,
  } = result;

  const isPositive = assetDifference > 0;

  const cards = [
    {
      title: t("results.annualSavingsCurrent"),
      value: formatCurrency(annualSavingsCurrent, input.currencyCurrent),
      icon: PiggyBank,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
    },
    {
      title: t("results.annualSavingsTarget"),
      value: formatCurrency(annualSavingsTarget, input.currencyTarget),
      icon: PiggyBank,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      title: t("results.yearAssetCurrent", { years: input.simulationYears }),
      value: formatCurrency(fiveYearAssetCurrent, input.currencyCurrent),
      icon: Target,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
    },
    {
      title: t("results.yearAssetTarget", { years: input.simulationYears }),
      value: formatCurrency(fiveYearAssetTarget, input.currencyTarget),
      icon: Target,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.bg} rounded-2xl p-4 border ${card.border}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`h-4 w-4 ${card.color}`} />
              <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">{card.title}</p>
            </div>
            <p className={`text-xl font-extrabold ${card.color} tracking-tight`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Asset Difference */}
      <div
        className={`rounded-2xl p-5 border-2 ${
          isPositive
            ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200"
            : "bg-gradient-to-r from-red-50 to-orange-50 border-red-200"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          {isPositive ? (
            <div className="p-1 bg-emerald-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
          ) : (
            <div className="p-1 bg-red-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
          )}
          <p className="text-sm font-semibold text-muted">
            {t("results.yearAssetDifference", { years: input.simulationYears })}
          </p>
        </div>
        <p
          className={`text-3xl font-extrabold tracking-tight ${
            isPositive ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {isPositive ? "+" : ""}
          {formatCurrency(assetDifference, input.currencyCurrent)}
        </p>
        <p className={`text-sm mt-2 font-medium ${isPositive ? "text-emerald-600/70" : "text-red-600/70"}`}>
          {isPositive
            ? t("results.movingAdvantage")
            : t("results.stayingBetter")}
        </p>
      </div>
    </div>
  );
}
