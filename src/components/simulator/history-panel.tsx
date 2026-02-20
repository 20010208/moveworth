"use client";

import { useState, useEffect } from "react";
import { Clock, Trash2, ArrowRight, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { SimulationHistoryEntry, getHistory, deleteHistory, clearHistory } from "@/lib/simulation-history";
import { SimulationInput, SimulationResult } from "@/lib/simulation/types";
import { countryPresets } from "@/data/country-presets";
import { formatCurrency } from "@/lib/utils";

interface HistoryPanelProps {
  onLoad: (input: SimulationInput, result: SimulationResult) => void;
}

export function HistoryPanel({ onLoad }: HistoryPanelProps) {
  const { locale, t } = useTranslation();
  const [history, setHistory] = useState<SimulationHistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  if (history.length === 0) return null;

  const getCountryName = (code: string) => {
    const preset = countryPresets.find((c) => c.code === code);
    return preset ? preset.name[locale as "en" | "ja"] : code;
  };

  const handleDelete = (id: string) => {
    deleteHistory(id);
    setHistory(getHistory());
  };

  const handleClearAll = () => {
    if (confirm(t("history.clearConfirm"))) {
      clearHistory();
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

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-muted flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {t("history.title")}
        </h2>
        <button
          onClick={handleClearAll}
          className="text-xs text-muted hover:text-danger transition-colors flex items-center gap-1"
        >
          <X className="h-3 w-3" />
          {t("history.clearAll")}
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {history.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onLoad(entry.input, entry.result)}
            className="group relative flex-shrink-0 bg-white border border-border/60 rounded-xl p-3 hover:border-primary/40 hover:shadow-md transition-all text-left min-w-[200px]"
          >
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted hover:text-danger transition-all p-0.5"
              title={t("history.delete")}
            >
              <Trash2 className="h-3 w-3" />
            </button>
            <div className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1">
              <span>{getCountryName(entry.countryFrom)}</span>
              <ArrowRight className="h-3 w-3 text-muted" />
              <span>{getCountryName(entry.countryTo)}</span>
            </div>
            <div className={`text-xs font-semibold ${entry.result.assetDifference >= 0 ? "text-accent" : "text-danger"}`}>
              {entry.result.assetDifference >= 0 ? "+" : ""}
              {formatCurrency(entry.result.assetDifference, entry.result.baseCurrency)}
            </div>
            <div className="text-[10px] text-muted mt-1">
              {formatDate(entry.date)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
