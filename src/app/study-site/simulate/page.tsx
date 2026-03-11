"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft, Calculator, Info } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { studyAbroadCountries, getStudyAbroadData } from "@/data/study-abroad";
import { countryPresets } from "@/data/country-presets";

// 参考為替レート（対円、2026年3月時点の目安）
const toJPY: Record<string, number> = {
  JPY: 1,
  USD: 150,
  GBP: 190,
  AUD: 95,
  CAD: 110,
  NZD: 88,
  SGD: 112,
  MYR: 34,
  KRW: 0.11,
  EUR: 162,
  THB: 4.2,
  TWD: 4.7,
  PHP: 2.6,
  CHF: 170,
  SEK: 14,
  HKD: 19,
  IDR: 0.0094,
  VND: 0.006,
  AED: 41,
  GEL: 55,
  NOK: 14,
  DKK: 22,
  BRL: 29,
  COP: 0.037,
};

function getFlag(code: string): string {
  return code.toUpperCase().replace(/./g, (c) =>
    String.fromCodePoint(127397 + c.charCodeAt(0))
  );
}

const DURATION_OPTIONS = [3, 6, 12, 24] as const;
const MAX_SELECT = 4;
const DEFAULT_SELECTED = ["MY", "AU", "CA", "SG"];

const pageText = {
  ja: {
    back: "留学先一覧に戻る",
    title: "留学費用シミュレーター",
    description: "国・期間・学費レベルを選んで、総費用を円換算で比較しましょう。",
    step1: "① 比較する国を選ぶ",
    step1sub: "最大4カ国まで選択できます",
    step2: "② 留学期間",
    step3: "③ 学費レベル",
    months: "ヶ月",
    tuitionMin: "最低（公立・安価な私立）",
    tuitionMax: "最高（有名私立・難関校）",
    resultTitle: "費用比較結果",
    tuition: "学費",
    living: "生活費",
    total: "合計",
    tuitionLabel: "学費（現地）",
    livingLabel: "生活費（現地）",
    totalJpy: "合計（円換算）",
    unit: "万円",
    note: "※為替レートは参考値です（2026年3月時点）。実際のレートや物価変動により差が生じます。",
    selectHint: "国を選択してください（最大4カ国）",
    perMonth: "/月",
    tuitionNote: "年間学費",
  },
  en: {
    back: "Back to Countries",
    title: "Study Abroad Cost Simulator",
    description: "Select countries, duration, and tuition level to compare total costs in Japanese yen.",
    step1: "① Select Countries to Compare",
    step1sub: "Up to 4 countries",
    step2: "② Duration",
    step3: "③ Tuition Level",
    months: " months",
    tuitionMin: "Low (public / budget private)",
    tuitionMax: "High (top private / elite)",
    resultTitle: "Cost Comparison",
    tuition: "Tuition",
    living: "Living",
    total: "Total",
    tuitionLabel: "Tuition (local)",
    livingLabel: "Living cost (local)",
    totalJpy: "Total (JPY equiv.)",
    unit: "¥10k",
    note: "* Exchange rates are approximate (as of March 2026). Actual costs may vary.",
    selectHint: "Please select at least one country (up to 4)",
    perMonth: "/mo",
    tuitionNote: "Annual tuition",
  },
  zh: {
    back: "返回国家列表",
    title: "留学费用模拟器",
    description: "选择国家、留学期间和学费水平，以日元换算比较总费用。",
    step1: "① 选择比较国家",
    step1sub: "最多可选4个国家",
    step2: "② 留学期间",
    step3: "③ 学费水平",
    months: "个月",
    tuitionMin: "最低（公立/价格较低的私立）",
    tuitionMax: "最高（著名私立/顶尖院校）",
    resultTitle: "费用比较结果",
    tuition: "学费",
    living: "生活费",
    total: "合计",
    tuitionLabel: "学费（当地）",
    livingLabel: "生活费（当地）",
    totalJpy: "合计（日元换算）",
    unit: "万日元",
    note: "※汇率为参考值（2026年3月时点），实际费用可能因汇率及物价变动而有所不同。",
    selectHint: "请选择国家（最多4个）",
    perMonth: "/月",
    tuitionNote: "年学费",
  },
};

const CHART_COLORS = {
  tuition: "#6366f1",
  living: "#a5b4fc",
};

export default function StudySimulatePage() {
  const { locale } = useTranslation();
  const lang = locale as "en" | "ja" | "zh";
  const text = pageText[lang];

  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTED);
  const [duration, setDuration] = useState<number>(12);
  const [tuitionLevel, setTuitionLevel] = useState<"min" | "max">("min");

  const availableCountries = useMemo(
    () => countryPresets.filter((c) => studyAbroadCountries.includes(c.code)),
    []
  );

  const toggleCountry = (code: string) => {
    setSelected((prev) => {
      if (prev.includes(code)) return prev.filter((c) => c !== code);
      if (prev.length >= MAX_SELECT) return prev;
      return [...prev, code];
    });
  };

  interface ResultItem {
    code: string;
    name: string;
    flag: string;
    currencySymbol: string;
    tuitionLocal: number;
    livingLocal: number;
    tuitionJPY: number;
    livingJPY: number;
    totalJPY: number;
  }

  const results = useMemo((): ResultItem[] => {
    return selected.flatMap((code) => {
      const data = getStudyAbroadData(code);
      const country = countryPresets.find((c) => c.code === code);
      if (!data || !country) return [];

      const rate = toJPY[data.costs.currency] ?? 1;
      const annualTuition =
        tuitionLevel === "min" ? data.costs.tuitionMin : data.costs.tuitionMax;
      const tuitionLocal = (annualTuition / 12) * duration;
      const livingLocal = data.costs.livingMonthly * duration;
      const tuitionJPY = Math.round((tuitionLocal * rate) / 10000);
      const livingJPY = Math.round((livingLocal * rate) / 10000);

      return [{
        code,
        name: country.name[lang as keyof typeof country.name] ?? country.name.en,
        flag: getFlag(code),
        currencySymbol: data.costs.currencySymbol,
        tuitionLocal: Math.round(tuitionLocal),
        livingLocal: Math.round(livingLocal),
        tuitionJPY,
        livingJPY,
        totalJPY: tuitionJPY + livingJPY,
      }];
    });
  }, [selected, duration, tuitionLevel, lang]);

  const chartData = results.map((r) => ({
    name: r.name,
    [text.tuition]: r.tuitionJPY,
    [text.living]: r.livingJPY,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {text.back}
        </Link>

        {/* Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-3">
            <Calculator className="h-4 w-4" />
            <span>{text.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">
            {text.title}
          </h1>
          <p className="text-sm text-muted">{text.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-5">
            {/* Country selector */}
            <div className="bg-white border border-border/60 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-foreground mb-0.5">{text.step1}</h2>
              <p className="text-xs text-muted mb-3">{text.step1sub}</p>
              <div className="grid grid-cols-2 gap-2">
                {availableCountries.map((country) => {
                  const isSelected = selected.includes(country.code);
                  const isDisabled = !isSelected && selected.length >= MAX_SELECT;
                  return (
                    <button
                      key={country.code}
                      onClick={() => toggleCountry(country.code)}
                      disabled={isDisabled}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow-sm"
                          : isDisabled
                          ? "bg-gray-50 text-gray-300 border-border/30 cursor-not-allowed"
                          : "bg-white text-foreground border-border/60 hover:border-primary/40 hover:bg-primary/5"
                      }`}
                    >
                      <span className="text-base">{getFlag(country.code)}</span>
                      <span className="truncate">
                        {country.name[lang as keyof typeof country.name] ?? country.name.en}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duration */}
            <div className="bg-white border border-border/60 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-foreground mb-3">{text.step2}</h2>
              <div className="grid grid-cols-2 gap-2">
                {DURATION_OPTIONS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setDuration(m)}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      duration === m
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-white text-foreground border-border/60 hover:border-primary/40 hover:bg-primary/5"
                    }`}
                  >
                    {m}{text.months}
                  </button>
                ))}
              </div>
            </div>

            {/* Tuition level */}
            <div className="bg-white border border-border/60 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-foreground mb-3">{text.step3}</h2>
              <div className="space-y-2">
                {(["min", "max"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setTuitionLevel(level)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all ${
                      tuitionLevel === level
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-white text-foreground border-border/60 hover:border-primary/40 hover:bg-primary/5"
                    }`}
                  >
                    {level === "min" ? text.tuitionMin : text.tuitionMax}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-5">
            {results.length === 0 ? (
              <div className="bg-white border border-border/60 rounded-2xl p-10 shadow-sm text-center text-muted text-sm">
                {text.selectHint}
              </div>
            ) : (
              <>
                {/* Bar chart */}
                <div className="bg-white border border-border/60 rounded-2xl p-5 shadow-sm">
                  <h2 className="text-sm font-bold text-foreground mb-4">
                    {text.resultTitle}
                    <span className="ml-2 text-xs font-normal text-muted">（{text.unit}）</span>
                  </h2>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={chartData} barSize={36}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v}`}
                      />
                      <Tooltip
                        formatter={(value: number | string | undefined) => [`${Number(value ?? 0).toLocaleString()}${text.unit}`, ""]}
                        contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 12 }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar
                        dataKey={text.tuition}
                        stackId="a"
                        fill={CHART_COLORS.tuition}
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar
                        dataKey={text.living}
                        stackId="a"
                        fill={CHART_COLORS.living}
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Breakdown cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.map((r) => (
                    <div
                      key={r.code}
                      className="bg-white border border-border/60 rounded-2xl p-5 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">{r.flag}</span>
                        <span className="font-bold text-foreground">{r.name}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted">{text.tuitionLabel}</span>
                          <span className="font-medium">
                            {r.currencySymbol}{r.tuitionLocal.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted">{text.livingLabel}</span>
                          <span className="font-medium">
                            {r.currencySymbol}{r.livingLocal.toLocaleString()}
                          </span>
                        </div>
                        <div className="border-t border-border/40 pt-2 mt-2 flex justify-between items-center">
                          <span className="font-semibold text-foreground">{text.totalJpy}</span>
                          <span className="font-bold text-lg text-primary">
                            {r.totalJPY.toLocaleString()}{text.unit}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-muted">
                          <span>{text.tuition}</span>
                          <span>{r.tuitionJPY.toLocaleString()}{text.unit}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted">
                          <span>{text.living}</span>
                          <span>{r.livingJPY.toLocaleString()}{text.unit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Note */}
                <div className="flex items-start gap-2 text-xs text-muted bg-amber-50 border border-amber-200/60 rounded-xl p-3">
                  <Info className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{text.note}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
