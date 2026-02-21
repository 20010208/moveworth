"use client";

import Link from "next/link";
import { SimulationResult } from "@/lib/simulation/types";
import { UserPlan } from "@/lib/auth";
import { SummaryCards } from "./summary-cards";
import { AssetChart } from "./asset-chart";
import { BreakdownChart } from "./breakdown-chart";
import { ShareButtons } from "./share-buttons";
import { AdvancedTabs } from "./advanced-tabs";
import { Lock, BarChart3, Sparkles, FileText } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface ResultsPanelProps {
  result: SimulationResult | null;
  plan: UserPlan;
}

export function ResultsPanel({ result, plan }: ResultsPanelProps) {
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

  const isPro = plan === "pro" || plan === "premium";
  const isPremium = plan === "premium";

  return (
    <div className="space-y-4">
      <SummaryCards result={result} />
      <ShareButtons result={result} />
      <AssetChart result={result} />
      <BreakdownChart result={result} />

      {isPro ? (
        <>
          <AdvancedTabs result={result} />

          {isPremium && (
            /* Premium: AI PDF Report */
            <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50 border border-amber-200/60 rounded-2xl p-6">
              <div className="absolute top-3 right-3">
                <Sparkles className="h-5 w-5 text-amber-400/40" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-amber-600" />
                <h3 className="text-sm font-bold text-foreground">
                  {t("results.aiReport")}
                </h3>
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  Premium
                </span>
              </div>
              <p className="text-sm text-muted mb-4">
                {t("results.aiReportDesc")}
              </p>
              <button
                className="inline-flex items-center gap-1.5 bg-amber-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-all shadow-md shadow-amber-500/20"
                onClick={() => alert("AI Report generation coming soon!")}
              >
                <FileText className="h-4 w-4" />
                {t("results.downloadReport")}
              </button>
            </div>
          )}
        </>
      ) : (
        /* Free: Locked UI */
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
      )}
    </div>
  );
}
