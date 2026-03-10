"use client";

import Link from "next/link";
import { GraduationCap, MapPin, ArrowRight, BookOpen } from "lucide-react";
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
    title: "留学情報",
    subtitle: "世界の留学先を比較・検討",
    description: "各国の学生ビザ・費用・大学・生活情報を詳しく解説。あなたにぴったりの留学先を見つけましょう。",
    availableCountries: "対応国一覧",
    viewDetail: "詳細を見る",
    comingSoon: "近日公開",
    tuitionFrom: "学費",
    livingCost: "月額生活費",
    studentVisa: "学生ビザ",
  },
  en: {
    title: "Study Abroad",
    subtitle: "Compare Study Destinations Worldwide",
    description: "Detailed guides on student visas, costs, universities, and life in each country. Find your perfect study abroad destination.",
    availableCountries: "Available Countries",
    viewDetail: "View Details",
    comingSoon: "Coming Soon",
    tuitionFrom: "Tuition",
    livingCost: "Monthly Living",
    studentVisa: "Student Visa",
  },
  zh: {
    title: "留学信息",
    subtitle: "全球留学目的地比较",
    description: "详细介绍各国学生签证、费用、大学及生活信息，帮助您找到最适合的留学目的地。",
    availableCountries: "支持国家",
    viewDetail: "查看详情",
    comingSoon: "即将推出",
    tuitionFrom: "学费",
    livingCost: "月均生活费",
    studentVisa: "学生签证",
  },
};

export default function StudyPage() {
  const { locale } = useTranslation();
  const lang = locale as "en" | "ja" | "zh";
  const text = pageText[lang];

  const availableCountries = countryPresets.filter((c) =>
    studyAbroadCountries.includes(c.code)
  );
  const comingSoonCountries = countryPresets.filter(
    (c) => !studyAbroadCountries.includes(c.code)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <GraduationCap className="h-4 w-4" />
            <span>{text.title}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            {text.subtitle}
          </h1>
          <p className="text-muted text-sm max-w-2xl mx-auto">
            {text.description}
          </p>
        </div>

        {/* Available Countries */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {text.availableCountries}
            <span className="text-sm font-normal text-muted">({availableCountries.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableCountries.map((country) => (
              <Link
                key={country.code}
                href={`/study/${country.code.toLowerCase()}`}
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
        </div>

        {/* Coming Soon */}
        {comingSoonCountries.length > 0 && (
          <div>
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
      </div>
    </div>
  );
}
