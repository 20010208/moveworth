"use client";

import { SimulationResult } from "@/lib/simulation/types";
import { countryPresets } from "@/data/country-presets";
import { Globe, TrendingUp, TrendingDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface MultiCountryPanelProps {
  mainResult: SimulationResult;
  extraResults: SimulationResult[];
}

function formatNum(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toFixed(0);
}

export function MultiCountryPanel({ mainResult, extraResults }: MultiCountryPanelProps) {
  const { locale, t } = useTranslation();
  const allResults = [mainResult, ...extraResults];
  const years = mainResult.input.simulationYears;

  return (
    <div className="bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 border border-amber-200/50 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-4 w-4 text-amber-600" />
        <h3 className="text-sm font-bold text-foreground">
          {t("results.multiCountryComparison")}
        </h3>
        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
          Premium
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold text-muted py-2 pr-4 min-w-[100px]">
                {locale === "ja" ? "項目" : "Metric"}
              </th>
              {allResults.map((r, i) => {
                const country = countryPresets.find((c) => c.code === r.input.countryTo);
                return (
                  <th
                    key={i}
                    className="text-right text-xs font-semibold text-foreground py-2 px-3 min-w-[110px]"
                  >
                    <div>{country?.name[locale] ?? r.input.countryTo}</div>
                    <div className="text-muted font-normal">{r.input.currencyTarget}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {/* Annual Savings */}
            <tr>
              <td className="py-2.5 pr-4 text-xs text-muted">
                {locale === "ja" ? "年間貯蓄" : "Annual Savings"}
              </td>
              {allResults.map((r, i) => (
                <td key={i} className="py-2.5 px-3 text-right">
                  <span
                    className={`text-xs font-mono font-semibold ${
                      r.annualSavingsTarget >= 0 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {r.annualSavingsTarget >= 0 ? "+" : ""}
                    {formatNum(r.annualSavingsTarget)}
                  </span>
                </td>
              ))}
            </tr>

            {/* N-Year Asset */}
            <tr>
              <td className="py-2.5 pr-4 text-xs text-muted">
                {locale === "ja" ? `${years}年後の資産` : `${years}Y Asset`}
              </td>
              {allResults.map((r, i) => (
                <td key={i} className="py-2.5 px-3 text-right">
                  <span className="text-xs font-mono font-semibold text-foreground">
                    {formatNum(r.fiveYearAssetTarget)}
                  </span>
                </td>
              ))}
            </tr>

            {/* Asset Difference vs Current Country */}
            <tr>
              <td className="py-2.5 pr-4 text-xs text-muted">
                {locale === "ja" ? "現在地との資産差" : "vs Current Country"}
              </td>
              {allResults.map((r, i) => {
                const diff = r.assetDifference;
                return (
                  <td key={i} className="py-2.5 px-3 text-right">
                    <span
                      className={`inline-flex items-center justify-end gap-0.5 text-xs font-semibold ${
                        diff >= 0 ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {diff >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {diff >= 0 ? "+" : ""}
                      {formatNum(diff)}
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Tax Rate */}
            <tr>
              <td className="py-2.5 pr-4 text-xs text-muted">
                {locale === "ja" ? "税率" : "Tax Rate"}
              </td>
              {allResults.map((r, i) => (
                <td key={i} className="py-2.5 px-3 text-right text-xs text-muted">
                  {Math.round(r.input.taxRateTarget * 100)}%
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted mt-3">
        {locale === "ja"
          ? `※ 資産差額は現在地との比較（${mainResult.input.currencyCurrent}建て）`
          : `※ Asset difference compared to current country (in ${mainResult.input.currencyCurrent})`}
      </p>
    </div>
  );
}
