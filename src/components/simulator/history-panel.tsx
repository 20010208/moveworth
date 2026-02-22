"use client";

import { useState, useEffect } from "react";
import { Clock, Trash2, ArrowRight, X, Lock, Search } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { SimulationHistoryEntry, getHistory, deleteHistory, clearHistory, isAtFreeLimit } from "@/lib/simulation-history";
import { SimulationInput, SimulationResult, ExtraComparisonInput } from "@/lib/simulation/types";
import { countryPresets } from "@/data/country-presets";
import { formatCurrency } from "@/lib/utils";
import { UserPlan } from "@/lib/auth";

interface HistoryPanelProps {
  onLoad: (
    input: SimulationInput,
    result: SimulationResult,
    extraInputs?: ExtraComparisonInput[],
    extraResults?: SimulationResult[]
  ) => void;
  plan: UserPlan;
  userId?: string;
}

export function HistoryPanel({ onLoad, plan, userId }: HistoryPanelProps) {
  const { locale, t } = useTranslation();
  const [history, setHistory] = useState<SimulationHistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setHistory(getHistory(userId));
  }, [userId]);

  if (history.length === 0) return null;

  const getCountryName = (code: string) => {
    const preset = countryPresets.find((c) => c.code === code);
    return preset ? preset.name[locale as "en" | "ja"] : code;
  };

  const handleDelete = (id: string) => {
    deleteHistory(id, userId);
    setHistory(getHistory(userId));
  };

  const handleClearAll = () => {
    if (confirm(t("history.clearConfirm"))) {
      clearHistory(userId);
      setHistory([]);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === "ja" ? "ja-JP" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 検索フィルター: 国名（from/to/extra全て）に対してマッチ
  const filteredHistory = history.filter((entry) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const fromName = getCountryName(entry.countryFrom).toLowerCase();
    const toName = getCountryName(entry.countryTo).toLowerCase();
    const extraNames = (entry.extraInputs ?? []).map((ei) =>
      getCountryName(ei.countryTo).toLowerCase()
    );
    return (
      fromName.includes(q) ||
      toName.includes(q) ||
      extraNames.some((n) => n.includes(q))
    );
  });

  // 検索バーはPro/Premiumで多くの履歴がある場合、または4件以上の時に表示
  const showSearch = plan !== "free" || history.length > 3;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-muted flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {t("history.title")}
          <span className="text-xs font-normal text-muted/60">({history.length})</span>
        </h2>
        <button
          onClick={handleClearAll}
          className="text-xs text-muted hover:text-danger transition-colors flex items-center gap-1"
        >
          <X className="h-3 w-3" />
          {t("history.clearAll")}
        </button>
      </div>

      {/* 検索バー */}
      {showSearch && (
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === "ja" ? "国名で検索..." : "Search by country..."}
            className="w-full pl-8 pr-8 py-1.5 text-xs border border-border/60 rounded-lg bg-white focus:outline-none focus:border-primary/40 text-foreground placeholder:text-muted/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {plan === "free" && isAtFreeLimit(userId) && (
        <div className="flex items-center gap-1.5 mb-2 text-xs text-muted">
          <Lock className="h-3 w-3" />
          <span>{t("history.freeLimit")}</span>
        </div>
      )}

      {/* 検索結果なし */}
      {filteredHistory.length === 0 && searchQuery && (
        <p className="text-xs text-muted py-3 text-center">
          {locale === "ja" ? `"${searchQuery}" に一致する履歴はありません` : `No history matching "${searchQuery}"`}
        </p>
      )}

      <div className="flex gap-3 overflow-x-auto pb-2">
        {filteredHistory.map((entry) => {
          const hasExtra = entry.extraInputs && entry.extraInputs.length > 0;
          return (
            <button
              key={entry.id}
              onClick={() => onLoad(entry.input, entry.result, entry.extraInputs, entry.extraResults)}
              className="group relative flex-shrink-0 bg-white border border-border/60 rounded-xl p-3 hover:border-primary/40 hover:shadow-md transition-all text-left min-w-[200px]"
            >
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted hover:text-danger transition-all p-0.5"
                title={t("history.delete")}
              >
                <Trash2 className="h-3 w-3" />
              </button>
              <div className="flex items-center gap-1 text-sm font-medium text-foreground mb-1 flex-wrap pr-5">
                <span>{getCountryName(entry.countryFrom)}</span>
                <ArrowRight className="h-3 w-3 text-muted flex-shrink-0" />
                <span>{getCountryName(entry.countryTo)}</span>
                {hasExtra && entry.extraInputs!.map((ei, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="text-muted">/</span>
                    <span>{getCountryName(ei.countryTo)}</span>
                  </span>
                ))}
              </div>
              <div className={`text-xs font-semibold ${entry.result.assetDifference >= 0 ? "text-accent" : "text-danger"}`}>
                {entry.result.assetDifference >= 0 ? "+" : ""}
                {formatCurrency(entry.result.assetDifference, entry.result.baseCurrency)}
              </div>
              <div className="text-[10px] text-muted mt-1">
                {formatDate(entry.date)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
