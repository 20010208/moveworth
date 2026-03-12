"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  GraduationCap,
  MapPin,
  Building2,
  Wallet,
  FileText,
  Lightbulb,
  Users,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { getStudyAbroadData } from "@/data/study-abroad";
import { countryPresets } from "@/data/country-presets";

function getFlag(code: string): string {
  return code.toUpperCase().replace(/./g, (c) =>
    String.fromCodePoint(127397 + c.charCodeAt(0))
  );
}

const sectionLabels = {
  ja: {
    back: "留学情報に戻る",
    overview: "留学概要",
    studentVisa: "学生ビザ",
    visaName: "ビザ種別",
    visaRequirements: "必要書類",
    visaDuration: "有効期間",
    visaCost: "費用",
    costs: "費用の目安",
    tuition: "年間学費",
    living: "月額生活費",
    currency: "通貨",
    popularCities: "主要都市",
    popularUniversities: "主要大学",
    tips: "留学のポイント",
    japaneseInfo: "日本人向け情報",
    simulate: "生活費・資産をシミュレーション",
    simulateDesc: "MoveWorthで移住・留学後の資産推移をシミュレーションしてみよう",
    startSimulate: "シミュレーターを開く",
    free: "無料",
    to: "〜",
  },
  en: {
    back: "Back to Study Abroad",
    overview: "Overview",
    studentVisa: "Student Visa",
    visaName: "Visa Type",
    visaRequirements: "Requirements",
    visaDuration: "Duration",
    visaCost: "Cost",
    costs: "Cost Overview",
    tuition: "Annual Tuition",
    living: "Monthly Living Cost",
    currency: "Currency",
    popularCities: "Popular Cities",
    popularUniversities: "Popular Universities",
    tips: "Study Tips",
    japaneseInfo: "Info for Japanese Students",
    simulate: "Simulate Your Finances",
    simulateDesc: "Use MoveWorth to project your assets and living costs abroad",
    startSimulate: "Open Simulator",
    free: "Free",
    to: "–",
  },
  zh: {
    back: "返回留学信息",
    overview: "留学概述",
    studentVisa: "学生签证",
    visaName: "签证类型",
    visaRequirements: "所需材料",
    visaDuration: "有效期",
    visaCost: "费用",
    costs: "费用参考",
    tuition: "年学费",
    living: "月均生活费",
    currency: "货币",
    popularCities: "主要城市",
    popularUniversities: "主要大学",
    tips: "留学要点",
    japaneseInfo: "日本留学生信息",
    simulate: "模拟您的财务状况",
    simulateDesc: "使用MoveWorth模拟海外留学后的资产变化和生活成本",
    startSimulate: "打开模拟器",
    free: "免费",
    to: "至",
  },
};

export default function StudyCountryPage() {
  const params = useParams();
  const { locale } = useTranslation();
  const lang = locale as "en" | "ja" | "zh";
  const labels = sectionLabels[lang];

  const countryCode = (params.country as string).toUpperCase();
  const data = getStudyAbroadData(countryCode);
  const country = countryPresets.find((c) => c.code === countryCode);

  if (!data || !country) {
    notFound();
  }

  const formatCost = (amount: number) => {
    if (amount === 0) return labels.free;
    return `${country.currencySymbol}${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back */}
        <Link
          href="/study"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {labels.back}
        </Link>

        {/* Hero */}
        <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{getFlag(countryCode)}</span>
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">
                {country.name[lang as keyof typeof country.name] ?? country.name.en}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  {labels.studentVisa}
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted leading-relaxed">{data.overview[lang]}</p>
        </div>

        {/* Student Visa */}
        <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            {labels.studentVisa}
          </h2>
          <div className="space-y-4">
            <div>
              <span className="text-xs font-medium text-muted">{labels.visaName}</span>
              <p className="text-sm font-semibold text-foreground mt-0.5">{data.studentVisa.name[lang]}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-muted">{labels.visaRequirements}</span>
              <ul className="mt-1 space-y-1">
                {data.studentVisa.requirements[lang].map((req, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-medium text-muted">{labels.visaDuration}</span>
                <p className="text-sm text-foreground mt-0.5">{data.studentVisa.duration[lang]}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-muted">{labels.visaCost}</span>
                <p className="text-sm text-foreground mt-0.5">{data.studentVisa.cost[lang]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Costs */}
        <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            {labels.costs}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary/5 rounded-xl p-4">
              <span className="text-xs font-medium text-muted">{labels.tuition}</span>
              <p className="text-lg font-bold text-primary mt-1">
                {data.costs.tuitionMin === 0
                  ? `${labels.free} ${labels.to} ${formatCost(data.costs.tuitionMax)}`
                  : `${formatCost(data.costs.tuitionMin)} ${labels.to} ${formatCost(data.costs.tuitionMax)}`
                }
              </p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4">
              <span className="text-xs font-medium text-muted">{labels.living}</span>
              <p className="text-lg font-bold text-indigo-600 mt-1">
                {formatCost(data.costs.livingMin)} {labels.to} {formatCost(data.costs.livingMax)}<span className="text-sm font-normal text-muted">/月</span>
              </p>
            </div>
          </div>
        </div>

        {/* Cities & Universities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {labels.popularCities}
            </h2>
            <ul className="space-y-1.5">
              {data.popularCities[lang].map((city, i) => (
                <li key={i} className="text-sm text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {city}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              {labels.popularUniversities}
            </h2>
            <ul className="space-y-1.5">
              {data.popularUniversities[lang].map((uni, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                  {uni}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            {labels.tips}
          </h2>
          <ul className="space-y-2">
            {data.tips[lang].map((tip, i) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Japanese Info */}
        <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-amber-600" />
            {labels.japaneseInfo}
          </h2>
          <p className="text-sm text-foreground leading-relaxed">{data.japaneseInfo[lang]}</p>
        </div>

        {/* Simulate CTA */}
        <div className="bg-gradient-to-r from-primary to-indigo-600 rounded-2xl p-6 text-white text-center">
          <GraduationCap className="h-8 w-8 mx-auto mb-3 opacity-90" />
          <h2 className="text-lg font-bold mb-2">{labels.simulate}</h2>
          <p className="text-sm text-white/80 mb-4">{labels.simulateDesc}</p>
          <Link
            href="/simulate"
            className="inline-flex items-center gap-2 bg-white text-primary px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition-colors"
          >
            {labels.startSimulate}
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
