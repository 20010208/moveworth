"use client";

import Link from "next/link";
import { useState } from "react";
import { Globe, GraduationCap, Menu, X, Languages } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const navLabels = {
  ja: {
    countries: "留学先一覧",
    howToUse: "使い方",
    simulator: "移住シミュレーター",
    toggleMenu: "メニュー",
  },
  en: {
    countries: "Countries",
    howToUse: "How to Use",
    simulator: "Migration Simulator",
    toggleMenu: "Toggle menu",
  },
  zh: {
    countries: "留学目的地",
    howToUse: "使用方法",
    simulator: "移居模拟器",
    toggleMenu: "切换菜单",
  },
};

export function StudyHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale, setLocale } = useTranslation();
  const lang = locale as "en" | "ja" | "zh";
  const labels = navLabels[lang];

  const cycleLocale = () => {
    if (locale === "en") setLocale("ja");
    else if (locale === "ja") setLocale("zh");
    else setLocale("en");
  };

  const currentLocaleLabel = locale === "en" ? "EN" : locale === "ja" ? "JA" : "ZH";

  return (
    <header className="glass border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md group-hover:blur-lg transition-all" />
              <div className="relative flex items-center">
                <Globe className="h-7 w-7 text-primary" />
                <GraduationCap className="h-4 w-4 text-indigo-500 -ml-2 -mb-2" />
              </div>
            </div>
            <span className="text-xl font-bold">
              <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
                MoveWorth
              </span>
              <span className="text-muted font-normal text-base">.study</span>
            </span>
          </Link>

          {/* PC Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="text-sm font-medium text-muted hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary/80 transition-all"
            >
              {labels.countries}
            </Link>
            <a
              href="/#how-to-use"
              className="text-sm font-medium text-muted hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary/80 transition-all"
            >
              {labels.howToUse}
            </a>

            <div className="w-px h-5 bg-border mx-2" />

            <button
              onClick={cycleLocale}
              className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary/80 transition-all"
              aria-label="Switch language"
            >
              <Languages className="h-4 w-4" />
              {currentLocaleLabel}
            </button>

            <a
              href="https://www.moveworthapp.com/simulate"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 ml-1"
            >
              {labels.simulator}
            </a>
          </nav>

          {/* Mobile right */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={cycleLocale}
              className="p-2 text-muted hover:text-foreground"
              aria-label="Switch language"
            >
              <Languages className="h-5 w-5" />
            </button>
            <button
              className="p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={labels.toggleMenu}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 pt-2 space-y-1 border-t border-border/50">
            <Link
              href="/"
              className="block px-3 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:bg-secondary/80 rounded-lg transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {labels.countries}
            </Link>
            <a
              href="/#how-to-use"
              className="block px-3 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:bg-secondary/80 rounded-lg transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {labels.howToUse}
            </a>
            <div className="pt-2 mx-3">
              <a
                href="https://www.moveworthapp.com/simulate"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold text-center shadow-md shadow-primary/20"
                onClick={() => setMobileOpen(false)}
              >
                {labels.simulator}
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
