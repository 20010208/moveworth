"use client";

import Link from "next/link";
import { useState } from "react";
import { SimulationResult } from "@/lib/simulation/types";
import { UserPlan } from "@/lib/auth";
import { SummaryCards } from "./summary-cards";
import { AssetChart } from "./asset-chart";
import { BreakdownChart } from "./breakdown-chart";
import { ShareButtons } from "./share-buttons";
import { AdvancedTabs } from "./advanced-tabs";
import { Lock, BarChart3, Sparkles, FileText, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface ResultsPanelProps {
  result: SimulationResult | null;
  plan: UserPlan;
}

export function ResultsPanel({ result, plan }: ResultsPanelProps) {
  const { t, locale } = useTranslation();
  const [generating, setGenerating] = useState(false);
  const [reportError, setReportError] = useState("");

  const handleGenerateReport = async () => {
    if (!result) return;
    setGenerating(true);
    setReportError("");

    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result, locale }),
      });

      if (!res.ok) throw new Error("API error");
      const { report } = await res.json();

      // jsPDF でPDF生成・ダウンロード
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;

      // タイトル
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("MoveWorth AI Financial Report", margin, 25);

      // サブタイトル
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(
        `${result.input.countryFrom} → ${result.input.countryTo}  |  ${new Date().toLocaleDateString()}`,
        margin,
        33
      );

      // 区切り線
      doc.setDrawColor(80, 80, 220);
      doc.setLineWidth(0.5);
      doc.line(margin, 37, pageWidth - margin, 37);

      // レポート本文
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40);

      const lines = doc.splitTextToSize(report, contentWidth);
      let y = 45;
      const lineHeight = 5.5;
      const pageHeight = doc.internal.pageSize.getHeight();

      for (const line of lines) {
        if (y + lineHeight > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      }

      // フッター
      doc.setFontSize(8);
      doc.setTextColor(150);
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.text(
          `MoveWorth AI Report  |  Page ${i} / ${totalPages}  |  moveworth-alpha.vercel.app`,
          margin,
          pageHeight - 10
        );
      }

      doc.save(`moveworth-report-${result.input.countryFrom}-${result.input.countryTo}.pdf`);
    } catch {
      setReportError(locale === "ja" ? "レポート生成に失敗しました。もう一度お試しください。" : "Failed to generate report. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

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
              {reportError && (
                <p className="text-sm text-red-500 mb-3">{reportError}</p>
              )}
              <button
                className="inline-flex items-center gap-1.5 bg-amber-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
                onClick={handleGenerateReport}
                disabled={generating}
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                {generating
                  ? (locale === "ja" ? "生成中..." : "Generating...")
                  : t("results.downloadReport")}
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
