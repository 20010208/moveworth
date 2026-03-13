"use client";

import { useState, useMemo, useEffect } from "react";
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
import { ArrowLeft, Calculator, Info, User, Lock } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
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
  CNY: 21,
};

// 通貨ごとの表示設定（divisor: 表示単位の分母、unitSuffix: 単位ラベル）
interface CurrencyConfig {
  symbol: string;
  divisor: number;
  unitSuffix: Record<string, string>;
}

const currencyConfig: Record<string, CurrencyConfig> = {
  JPY: { symbol: "¥",    divisor: 10000,   unitSuffix: { ja: "万円",      en: "¥10k",    zh: "万日元" } },
  KRW: { symbol: "₩",   divisor: 10000,   unitSuffix: { ja: "万ウォン",  en: "₩10k",    zh: "万韩元" } },
  IDR: { symbol: "Rp",  divisor: 1000000, unitSuffix: { ja: "百万Rp",    en: "Rp 1M",   zh: "百万印尼盾" } },
  VND: { symbol: "₫",   divisor: 1000000, unitSuffix: { ja: "百万₫",     en: "₫ 1M",    zh: "百万越南盾" } },
  COP: { symbol: "COP", divisor: 1000,    unitSuffix: { ja: "千COP",     en: "COP 1k",  zh: "千哥伦比亚比索" } },
  USD: { symbol: "$",    divisor: 1,       unitSuffix: { ja: "USD",       en: "USD",      zh: "USD" } },
  EUR: { symbol: "€",    divisor: 1,       unitSuffix: { ja: "EUR",       en: "EUR",      zh: "EUR" } },
  GBP: { symbol: "£",    divisor: 1,       unitSuffix: { ja: "GBP",       en: "GBP",      zh: "GBP" } },
  AUD: { symbol: "A$",   divisor: 1,       unitSuffix: { ja: "AUD",       en: "AUD",      zh: "AUD" } },
  CAD: { symbol: "CA$",  divisor: 1,       unitSuffix: { ja: "CAD",       en: "CAD",      zh: "CAD" } },
  NZD: { symbol: "NZ$",  divisor: 1,       unitSuffix: { ja: "NZD",       en: "NZD",      zh: "NZD" } },
  SGD: { symbol: "S$",   divisor: 1,       unitSuffix: { ja: "SGD",       en: "SGD",      zh: "SGD" } },
  MYR: { symbol: "RM",   divisor: 1,       unitSuffix: { ja: "MYR",       en: "MYR",      zh: "MYR" } },
  TWD: { symbol: "NT$",  divisor: 1,       unitSuffix: { ja: "TWD",       en: "TWD",      zh: "TWD" } },
  HKD: { symbol: "HK$",  divisor: 1,       unitSuffix: { ja: "HKD",       en: "HKD",      zh: "HKD" } },
  THB: { symbol: "฿",    divisor: 1,       unitSuffix: { ja: "THB",       en: "THB",      zh: "THB" } },
  PHP: { symbol: "₱",    divisor: 1,       unitSuffix: { ja: "PHP",       en: "PHP",      zh: "PHP" } },
  CHF: { symbol: "CHF",  divisor: 1,       unitSuffix: { ja: "CHF",       en: "CHF",      zh: "CHF" } },
  SEK: { symbol: "kr",   divisor: 1,       unitSuffix: { ja: "SEK",       en: "SEK",      zh: "SEK" } },
  NOK: { symbol: "kr",   divisor: 1,       unitSuffix: { ja: "NOK",       en: "NOK",      zh: "NOK" } },
  DKK: { symbol: "kr",   divisor: 1,       unitSuffix: { ja: "DKK",       en: "DKK",      zh: "DKK" } },
  AED: { symbol: "AED",  divisor: 1,       unitSuffix: { ja: "AED",       en: "AED",      zh: "AED" } },
  GEL: { symbol: "₾",    divisor: 1,       unitSuffix: { ja: "GEL",       en: "GEL",      zh: "GEL" } },
  BRL: { symbol: "R$",   divisor: 1,       unitSuffix: { ja: "BRL",       en: "BRL",      zh: "BRL" } },
  CNY: { symbol: "¥",    divisor: 1,       unitSuffix: { ja: "元",        en: "CNY",      zh: "元" } },
};

// 国籍コード → 通貨コード（countryPresetsにない国の補完）
const nationalityToCurrency: Record<string, string> = { CN: "CNY" };

function getDisplayCurrency(nationality: string | undefined): string {
  if (!nationality) return "JPY";
  const code = nationality.toUpperCase();
  const preset = countryPresets.find((c) => c.code === code);
  if (preset) return preset.currency;
  return nationalityToCurrency[code] ?? "JPY";
}

// 現地通貨 → 表示通貨に換算して divisor で割った値を返す
function convertToDisplay(
  localAmount: number,
  localCurrency: string,
  displayCurrency: string
): number {
  const jpyAmount = localAmount * (toJPY[localCurrency] ?? 1);
  const displayAmount = jpyAmount / (toJPY[displayCurrency] ?? 1);
  const divisor = (currencyConfig[displayCurrency] ?? currencyConfig["JPY"]).divisor;
  return Math.round(displayAmount / divisor);
}

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
    description: "国・期間・学費レベルを選んで、総費用を比較しましょう。",
    descriptionGuest: "ログインすると登録国籍に合わせた通貨で表示されます。",
    currencyNote: "表示通貨：登録国籍に基づいて自動設定",
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
    totalDisplay: "合計（換算）",
    note: "※為替レートは参考値です（2026年3月時点）。実際のレートや物価変動により差が生じます。",
    selectHint: "国を選択してください（最大4カ国）",
  },
  en: {
    back: "Back to Countries",
    title: "Study Abroad Cost Simulator",
    description: "Select countries, duration, and tuition level to compare total costs.",
    descriptionGuest: "Log in to display costs in your home currency.",
    currencyNote: "Currency: auto-set based on your registered nationality",
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
    totalDisplay: "Total (converted)",
    note: "* Exchange rates are approximate (as of March 2026). Actual costs may vary.",
    selectHint: "Please select at least one country (up to 4)",
  },
  zh: {
    back: "返回国家列表",
    title: "留学费用模拟器",
    description: "选择国家、留学期间和学费水平，比较总费用。",
    descriptionGuest: "登录后将根据注册国籍自动切换显示货币。",
    currencyNote: "显示货币：根据注册国籍自动设置",
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
    totalDisplay: "合计（换算）",
    note: "※汇率为参考值（2026年3月时点），实际费用可能因汇率及物价变动而有所不同。",
    selectHint: "请选择国家（最多4个）",
  },
};

const CHART_COLORS = {
  tuition: "#6366f1",
  living: "#a5b4fc",
};

export default function StudySimulatePage() {
  const { locale } = useTranslation();
  const { isAuthenticated, user, setShowRegisterModal } = useAuth();
  const lang = locale as "en" | "ja" | "zh";
  const text = pageText[lang];

  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTED);
  const [duration, setDuration] = useState<number>(12);
  const [tuitionLevel, setTuitionLevel] = useState<"min" | "max">("min");
  const [showAuthGate, setShowAuthGate] = useState(false);

  // 初回訪問済みフラグを localStorage で管理
  useEffect(() => {
    if (isAuthenticated) return;
    const STORAGE_KEY = "studySimUsed";
    if (localStorage.getItem(STORAGE_KEY)) {
      setShowAuthGate(true);
    } else {
      localStorage.setItem(STORAGE_KEY, "1");
    }
  }, [isAuthenticated]);

  // ユーザーの国籍から表示通貨を決定
  const displayCurrency = useMemo(
    () => getDisplayCurrency(isAuthenticated ? user?.nationality : undefined),
    [isAuthenticated, user?.nationality]
  );
  const dispConfig = currencyConfig[displayCurrency] ?? currencyConfig["JPY"];
  const unitLabel = dispConfig.unitSuffix[lang] ?? dispConfig.unitSuffix["en"];

  const availableCountries = useMemo(
    () => countryPresets.filter((c) => studyAbroadCountries.includes(c.code)),
    []
  );

  // 未ログイン時はゲートを表示してアクションをブロック
  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      setShowAuthGate(true);
      return;
    }
    action();
  };

  const toggleCountry = (code: string) => {
    requireAuth(() =>
      setSelected((prev) => {
        if (prev.includes(code)) return prev.filter((c) => c !== code);
        if (prev.length >= MAX_SELECT) return prev;
        return [...prev, code];
      })
    );
  };

  interface ResultItem {
    code: string;
    name: string;
    flag: string;
    currencySymbol: string;
    tuitionLocal: number;
    livingLocal: number;
    tuitionDisp: number;
    livingDisp: number;
    totalDisp: number;
  }

  const results = useMemo((): ResultItem[] => {
    return selected.flatMap((code) => {
      const data = getStudyAbroadData(code);
      const country = countryPresets.find((c) => c.code === code);
      if (!data || !country) return [];

      const annualTuition =
        tuitionLevel === "min" ? data.costs.tuitionMin : data.costs.tuitionMax;
      const tuitionLocal = (annualTuition / 12) * duration;
      const livingLocal = ((data.costs.livingMin + data.costs.livingMax) / 2) * duration;

      const tuitionDisp = convertToDisplay(tuitionLocal, data.costs.currency, displayCurrency);
      const livingDisp = convertToDisplay(livingLocal, data.costs.currency, displayCurrency);

      return [{
        code,
        name: country.name[lang as keyof typeof country.name] ?? country.name.en,
        flag: getFlag(code),
        currencySymbol: data.costs.currencySymbol,
        tuitionLocal: Math.round(tuitionLocal),
        livingLocal: Math.round(livingLocal),
        tuitionDisp,
        livingDisp,
        totalDisp: tuitionDisp + livingDisp,
      }];
    });
  }, [selected, duration, tuitionLevel, lang, displayCurrency]);

  const chartData = results.map((r) => ({
    name: r.name,
    [text.tuition]: r.tuitionDisp,
    [text.living]: r.livingDisp,
  }));

  if (showAuthGate && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white border border-border/60 rounded-2xl p-10 shadow-sm">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-extrabold text-foreground mb-2">
              {lang === "ja" ? "会員登録が必要です" : lang === "zh" ? "需要注册会员" : "Sign up to continue"}
            </h2>
            <p className="text-sm text-muted mb-6">
              {lang === "ja"
                ? "留学費用シミュレーターは無料会員登録後にご利用いただけます。"
                : lang === "zh"
                ? "留学费用模拟器需要免费注册后使用。"
                : "Create a free account to use the Study Cost Simulator."}
            </p>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors mb-3"
            >
              {lang === "ja" ? "無料で会員登録する" : lang === "zh" ? "免费注册" : "Sign up for free"}
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {text.back}
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          {/* 通貨表示バッジ */}
          {isAuthenticated ? (
            <div className="inline-flex items-center gap-1.5 mt-2 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
              <User className="h-3 w-3" />
              {text.currencyNote}：<span className="font-bold">{displayCurrency}</span>
              {user?.nationality && (
                <span className="ml-0.5">（{getFlag(user.nationality)}）</span>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted mt-1">{text.descriptionGuest}</p>
          )}
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
                    onClick={() => requireAuth(() => setDuration(m))}
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
                    onClick={() => requireAuth(() => setTuitionLevel(level))}
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
                    <span className="ml-2 text-xs font-normal text-muted">（{unitLabel}）</span>
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
                        formatter={(value: number | string | undefined) => [
                          `${Number(value ?? 0).toLocaleString()} ${unitLabel}`,
                          "",
                        ]}
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
                          <span className="font-semibold text-foreground">{text.totalDisplay}</span>
                          <span className="font-bold text-lg text-primary">
                            {r.totalDisp.toLocaleString()} {unitLabel}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-muted">
                          <span>{text.tuition}</span>
                          <span>{r.tuitionDisp.toLocaleString()} {unitLabel}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted">
                          <span>{text.living}</span>
                          <span>{r.livingDisp.toLocaleString()} {unitLabel}</span>
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
