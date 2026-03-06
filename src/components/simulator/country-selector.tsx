"use client";

import { useState, useRef, useEffect } from "react";
import { countryPresets } from "@/data/country-presets";
import { useTranslation } from "@/lib/i18n";
import { Search, ChevronDown, X } from "lucide-react";

interface CountrySelectorProps {
  label: string;
  value: string;
  onChange: (code: string) => void;
  excludeCodes?: string[];
}

function getFlag(code: string): string {
  return code.toUpperCase().replace(/./g, (c) =>
    String.fromCodePoint(127397 + c.charCodeAt(0))
  );
}

export function CountrySelector({
  label,
  value,
  onChange,
  excludeCodes = [],
}: CountrySelectorProps) {
  const { locale, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sorted = [...countryPresets].sort((a, b) => {
    const nameA = a.name[locale as keyof typeof a.name] ?? a.name.en;
    const nameB = b.name[locale as keyof typeof b.name] ?? b.name.en;
    return nameA.localeCompare(nameB, locale === "ja" ? "ja" : "en");
  });

  const filtered = sorted.filter((c) => {
    if (excludeCodes.includes(c.code)) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    const name = (c.name[locale as keyof typeof c.name] ?? c.name.en).toLowerCase();
    return name.includes(q) || c.currency.toLowerCase().includes(q);
  });

  const selected = countryPresets.find((c) => c.code === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const placeholder = locale === "ja"
    ? "国名・通貨で検索..."
    : locale === "zh"
    ? "按国家或货币搜索..."
    : "Search by country or currency...";

  const noResults = locale === "ja" ? "見つかりません" : locale === "zh" ? "无结果" : "No results";

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-medium text-muted mb-1.5">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border border-border/60 rounded-xl px-3 py-2.5 text-sm bg-white hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all flex items-center justify-between gap-2 cursor-pointer"
      >
        <span className={selected ? "text-foreground truncate" : "text-muted"}>
          {selected
            ? `${getFlag(selected.code)} ${selected.name[locale as keyof typeof selected.name]} (${selected.currency})`
            : t("input.selectCountry")}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-border/60 rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-border/40">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-8 pr-7 py-1.5 text-xs border border-border/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-xs text-muted text-center">{noResults}</li>
            ) : (
              filtered.map((country) => (
                <li key={country.code}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(country.code);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-primary-light transition-colors flex items-center gap-2 ${
                      country.code === value ? "bg-primary-light text-primary font-medium" : "text-foreground"
                    }`}
                  >
                    <span className="shrink-0">{getFlag(country.code)}</span>
                    <span className="truncate">{country.name[locale as keyof typeof country.name]}</span>
                    <span className="ml-auto text-xs text-muted shrink-0">{country.currency}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
