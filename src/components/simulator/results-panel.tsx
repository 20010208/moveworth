"use client";

import Link from "next/link";
import { SimulationResult } from "@/lib/simulation/types";
import { SummaryCards } from "./summary-cards";
import { AssetChart } from "./asset-chart";
import { BreakdownChart } from "./breakdown-chart";
import { ShareButtons } from "./share-buttons";
import { Lock, BarChart3, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface ResultsPanelProps {
  result: SimulationResult | null;
}

export function ResultsPanel({ result }: ResultsPanelProps) {
  const { t } = useTranslation();

  if (!result) {
    return (
      <div className="bg-white border border-border/60 rounded-2xl p-8 flex items-center justify-center min-h-[400px] shadow-sm">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface text-muted mb-5">
            <BarChart3 className="h-8 w-8" />
          </div>
          <p className="text-lg font-bold text-foreground mb-2">
            {t("results.enterData")}
          </p>
          <p className="text-sm text-muted max-w-xs mx-auto leading-relaxed">
            {t("results.enterDataDesc")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SummaryCards result={result} />
      <ShareButtons result={result} />
      <AssetChart result={result} />
      <BreakdownChart result={result} />

      {/* Pro Features - Locked */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-emerald-50 border border-primary/10 rounded-2xl p-6">
        <div className="absolute top-3 right-3">
          <Sparkles className="h-5 w-5 text-primary/20" />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Lock className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">
            {t("results.proFeatures")}
          </h3>
          <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
            Pro
          </span>
        </div>
        <ul className="text-sm text-muted space-y-2 mb-5">
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            {t("results.monteCarlo")}
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            {t("results.fireAge")}
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            {t("results.sensitivity")}
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            {t("results.unlimitedSaves")}
          </li>
        </ul>
        <Link
          href="/subscribe"
          className="inline-flex items-center gap-1.5 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
        >
          {t("results.upgradePro")}
        </Link>
      </div>
    </div>
  );
}
