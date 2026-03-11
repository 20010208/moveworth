"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, MapPin, ArrowRight, BookOpen, Globe, Search, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { studyAbroadCountries } from "@/data/study-abroad";
import { countryPresets } from "@/data/country-presets";

function getFlag(code: string): string {
  return code.toUpperCase().replace(/./g, (c) =>
    String.fromCodePoint(127397 + c.charCodeAt(0))
  );
}

const pageText = {
  ja: {
    badge: "MoveWorth.study",
    title: "海外留学情報を比較しよう",
    description: "各国の学生ビザ・費用・大学・生活情報を詳しく解説。あなたにぴったりの留学先を見つけましょう。",
    availableCountries: "留学情報あり",
    comingSoon: "近日公開",
    studentVisa: "学生ビザ情報あり",
    searchPlaceholder: "国名で検索...",
    noResults: "該当する国が見つかりません",
    ctaTitle: "移住・留学後の資産もシミュレーション",
    ctaDesc: "MoveWorthなら30カ国以上の移住後の資産推移を無料でシミュレーションできます。",
    ctaBtn: "MoveWorthを使う（無料）",
  },
  en: {
    badge: "MoveWorth.study",
    title: "Compare Study Abroad Destinations",
    description: "Detailed guides on student visas, costs, universities, and life in each country. Find your perfect study abroad destination.",
    availableCountries: "Available Countries",
    comingSoon: "Coming Soon",
    studentVisa: "Student visa info available",
    searchPlaceholder: "Search by country name...",
    noResults: "No countries found",
    ctaTitle: "Simulate Your Finances Abroad",
    ctaDesc: "MoveWorth lets you project your assets and living costs in 30+ countries for free.",
    ctaBtn: "Try MoveWorth (Free)",
  },
  zh: {
    badge: "MoveWorth.study",
    title: "比较全球留学目的地",
    description: "详细介绍各国学生签证、费用、大学及生活信息，帮助您找到最适合的留学目的地。",
    availableCountries: "支持国家",
    comingSoon: "即将推出",
    studentVisa: "提供学生签证信息",
    searchPlaceholder: "按国家名称搜索...",
    noResults: "未找到相关国家",
    ctaTitle: "模拟海外财务状况",
    ctaDesc: "MoveWorth可免费模拟30多个国家的资产变化和生活成本。",
    ctaBtn: "使用MoveWorth（免费）",
  },
};

export default function StudySitePage() {
  const { locale } = useTranslation();
  const lang = locale as "en" | "ja" | "zh";
  const text = pageText[lang];
  const [query, setQuery] = useState("");

  const availableCountries = countryPresets.filter((c) =>
    studyAbroadCountries.includes(c.code)
  );
  const comingSoonCountries = countryPresets.filter(
    (c) => !studyAbroadCountries.includes(c.code)
  );

  const filtered = query.trim()
    ? availableCountries.filter((c) => {
        const q = query.toLowerCase();
        const name = (c.name[lang as keyof typeof c.name] ?? c.name.en).toLowerCase();
        return name.includes(q) || c.code.toLowerCase().includes(q);
      })
    : availableCountries;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <GraduationCap className="h-4 w-4" />
            <span>{text.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            {text.title}
          </h1>
          <p className="text-muted text-sm max-w-2xl mx-auto">
            {text.description}
          </p>
        </div>

        {/* Available Countries */}
        <div className="mb-10">
          {/* Header + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 shrink-0">
              <BookOpen className="h-5 w-5 text-primary" />
              {text.availableCountries}
              <span className="text-sm font-normal text-muted">({filtered.length})</span>
            </h2>
            {/* Search input */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={text.searchPlaceholder}
                style={{ fontSize: "16px" }}
                className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted text-sm">
              {text.noResults}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((country) => (
                <Link
                  key={country.code}
                  href={`/${country.code.toLowerCase()}`}
                  className="block bg-white border border-border/60 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getFlag(country.code)}</span>
                      <div>
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {country.name[lang as keyof typeof country.name] ?? country.name.en}
                        </h3>
                        <span className="text-xs text-muted">{country.currency}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="flex gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {text.studentVisa}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Coming Soon */}
        {!query && comingSoonCountries.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
              <span>{text.comingSoon}</span>
              <span className="text-sm font-normal text-muted">({comingSoonCountries.length})</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {comingSoonCountries.map((country) => (
                <div
                  key={country.code}
                  className="bg-white/60 border border-border/40 rounded-xl p-3 opacity-60"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getFlag(country.code)}</span>
                    <span className="text-sm font-medium text-muted truncate">
                      {country.name[lang as keyof typeof country.name] ?? country.name.en}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MoveWorth CTA */}
        <div className="bg-gradient-to-r from-primary to-indigo-600 rounded-2xl p-8 text-white text-center">
          <Globe className="h-8 w-8 mx-auto mb-3 opacity-90" />
          <h2 className="text-lg font-bold mb-2">{text.ctaTitle}</h2>
          <p className="text-sm text-white/80 mb-5">{text.ctaDesc}</p>
          <a
            href="https://www.moveworthapp.com/simulate"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-primary px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition-colors"
          >
            {text.ctaBtn}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
