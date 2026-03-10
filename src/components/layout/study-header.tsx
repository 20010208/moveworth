"use client";

import Link from "next/link";
import { GraduationCap, Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const navLabels = {
  ja: { home: "ホーム", about: "留学について", simulator: "移住シミュレーター" },
  en: { home: "Home", about: "About", simulator: "Migration Simulator" },
  zh: { home: "首页", about: "关于留学", simulator: "移居模拟器" },
};

export function StudyHeader() {
  const { locale, setLocale } = useTranslation();
  const lang = locale as "en" | "ja" | "zh";
  const labels = navLabels[lang];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-border/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center gap-1">
              <Globe className="h-5 w-5 text-primary" />
              <GraduationCap className="h-4 w-4 text-indigo-500 -ml-1" />
            </div>
            <span className="font-bold text-base">
              <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
                MoveWorth
              </span>
              <span className="text-muted font-normal">.study</span>
            </span>
          </Link>

          {/* Right: Language switcher + MoveWorth link */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex items-center gap-1 text-xs text-muted">
              {(["ja", "en", "zh"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`px-2 py-1 rounded transition-colors ${
                    locale === l
                      ? "text-primary font-semibold"
                      : "hover:text-foreground"
                  }`}
                >
                  {l === "ja" ? "日" : l === "en" ? "EN" : "中"}
                </button>
              ))}
            </div>
            {/* Link back to MoveWorth */}
            <a
              href="https://www.moveworthapp.com/simulate"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              {labels.simulator}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
