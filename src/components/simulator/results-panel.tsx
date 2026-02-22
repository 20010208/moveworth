"use client";

import Link from "next/link";
import { useState } from "react";
import { SimulationResult } from "@/lib/simulation/types";
import { UserPlan } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { SummaryCards } from "./summary-cards";
import { AssetChart } from "./asset-chart";
import { BreakdownChart } from "./breakdown-chart";
import { ShareButtons } from "./share-buttons";
import { AdvancedTabs } from "./advanced-tabs";
import { MultiCountryPanel } from "./multi-country-panel";
import { Lock, BarChart3, Sparkles, FileText, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface ResultsPanelProps {
  result: SimulationResult | null;
  plan: UserPlan;
  extraResults?: SimulationResult[];
}

export function ResultsPanel({ result, plan, extraResults = [] }: ResultsPanelProps) {
  const { t, locale } = useTranslation();
  const [generating, setGenerating] = useState(false);
  const [reportError, setReportError] = useState("");

  const handleGenerateReport = async () => {
    if (!result) return;
    setGenerating(true);
    setReportError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify({ result, locale }),
      });

      if (!res.ok) throw new Error("API error");
      const { report } = await res.json();

      // Markdown の ## 見出しを <h2>、** 太字 ** を <strong> に変換
      const htmlContent = report
        .replace(/^### (.+)$/gm, "<h3>$1</h3>")
        .replace(/^## (.+)$/gm, "<h2>$1</h2>")
        .replace(/^# (.+)$/gm, "<h1>$1</h1>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/^- (.+)$/gm, "<li>$1</li>")
        .replace(/(<li>.*<\/li>(\n|$))+/g, (m: string) => `<ul>${m}</ul>`)
        .replace(/\n{2,}/g, "</p><p>")
        .replace(/\n/g, "<br/>");

      const title = locale === "ja" ? "MoveWorth AI 財務レポート" : "MoveWorth AI Financial Report";
      const subtitle = `${result.input.countryFrom} → ${result.input.countryTo}  |  ${new Date().toLocaleDateString()}`;
      const footer = "moveworth-alpha.vercel.app";

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        setReportError(
          locale === "ja"
            ? "ポップアップがブロックされました。ブラウザのアドレスバー右端の「ポップアップがブロックされました」を押して許可し、もう一度お試しください。"
            : "Popup was blocked. Please click the popup blocked icon in your browser's address bar to allow it, then try again."
        );
        setGenerating(false);
        return;
      }

      printWindow.document.write(`<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Noto Sans JP', sans-serif;
      font-size: 11pt;
      color: #1a1a2e;
      padding: 20mm 20mm 25mm;
      line-height: 1.8;
    }
    .header { border-bottom: 2px solid #5050dc; padding-bottom: 8px; margin-bottom: 20px; }
    h1 { font-size: 20pt; font-weight: 700; color: #1a1a2e; }
    .subtitle { font-size: 10pt; color: #666; margin-top: 4px; }
    h2 { font-size: 13pt; font-weight: 700; color: #3030b0; margin: 18px 0 6px; border-left: 3px solid #5050dc; padding-left: 8px; }
    h3 { font-size: 11pt; font-weight: 700; margin: 12px 0 4px; }
    p { margin: 6px 0; }
    ul { margin: 6px 0 6px 20px; }
    li { margin: 3px 0; }
    strong { font-weight: 700; }
    .footer { position: fixed; bottom: 10mm; left: 20mm; right: 20mm; font-size: 8pt; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 4px; }
    @media print {
      body { padding: 15mm 15mm 20mm; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${title}</h1>
    <div class="subtitle">${subtitle}</div>
  </div>
  <div class="content"><p>${htmlContent}</p></div>
  <div class="footer">${footer}</div>
  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>`);
      printWindow.document.close();
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
      <AssetChart result={result} extraResults={isPremium ? extraResults : []} />
      <BreakdownChart result={result} extraResults={isPremium ? extraResults : []} />

      {isPro ? (
        <>
          {isPremium && extraResults.length > 0 && (
            <MultiCountryPanel mainResult={result} extraResults={extraResults} />
          )}

          <AdvancedTabs result={result} extraResults={isPremium ? extraResults : []} />

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
              <p className="text-xs text-muted mt-2 leading-relaxed">
                {locale === "ja"
                  ? "※ ボタンを押すと印刷画面が開きます。「送信先」から「PDFとして保存」を選択してください。ポップアップの許可が必要な場合があります。"
                  : "※ A print dialog will open. Select 'Save as PDF' from the destination options. You may need to allow popups."}
              </p>
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
