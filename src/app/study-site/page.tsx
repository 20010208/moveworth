"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap, ArrowRight, BookOpen, Globe,
  Search, X, Calculator, Wallet,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { studyAbroadCountries, getStudyAbroadData } from "@/data/study-abroad";
import { countryPresets } from "@/data/country-presets";

function getFlag(code: string): string {
  return code.toUpperCase().replace(/./g, (c) =>
    String.fromCodePoint(127397 + c.charCodeAt(0))
  );
}

function toHiragana(str: string): string {
  return str.replace(/[\u30A1-\u30F6]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0x60)
  );
}
function toKatakana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) + 0x60)
  );
}

const jaYomi: Record<string, string> = {
  JP: "にほん にっぽん", KR: "かんこく みなみこりあ", TW: "たいわん", HK: "ほんこん",
  IT: "いたりあ", MY: "まれーしあ", US: "あめりか うちゅうこく べいこく",
  AU: "おーすとらりあ ごうしゅう", GB: "いぎりす えいこく うぇーるず", CA: "かなだ",
  NZ: "にゅーじーらんど しんせかい", SG: "しんがぽーる",
  IE: "あいるらんど あいるらんどきょうわこく", DE: "どいつ どいつれんぽうきょうわこく",
  TH: "たい たいらんど", FR: "ふらんす", PH: "ふぃりぴん ひりぴん",
  NL: "おらんだ ねーでるらんど", CH: "すいす すいすれんぽう", ES: "すぺいん えすぱにゃ",
  PT: "ぽるとがる", SE: "すうぇーでん すえーでん", ID: "いんどねしあ",
  VN: "べとなむ べとなむしゃかいしゅぎきょうわこく", AE: "どばい あぶだび UAE うぇー",
  GE: "じょーじあ ぐるじあ", NO: "のるうぇー", DK: "でんまーく",
  BR: "ぶらじる", CO: "ころんびあ めでじん", GR: "ぎりしあ",
};

function matchesQuery(code: string, name: string, query: string): boolean {
  const n = name.toLowerCase();
  const q = query.toLowerCase();
  const yomi = jaYomi[code] ?? "";
  return (
    n.includes(q) ||
    toHiragana(n).includes(toHiragana(q)) ||
    toKatakana(n).includes(toKatakana(q)) ||
    yomi.includes(toHiragana(q)) ||
    yomi.includes(q)
  );
}

// 地域情報
interface RegionInfo {
  ja: string; en: string; zh: string;
  cardBg: string;   // グラデーション背景
  badge: string;    // バッジ色
}

const regionMap: Record<string, RegionInfo> = {
  // アジア
  JP: { ja: "アジア", en: "Asia", zh: "亚洲", cardBg: "from-violet-50 to-indigo-50", badge: "bg-violet-100 text-violet-700" },
  KR: { ja: "アジア", en: "Asia", zh: "亚洲", cardBg: "from-violet-50 to-indigo-50", badge: "bg-violet-100 text-violet-700" },
  TW: { ja: "アジア", en: "Asia", zh: "亚洲", cardBg: "from-violet-50 to-indigo-50", badge: "bg-violet-100 text-violet-700" },
  HK: { ja: "アジア", en: "Asia", zh: "亚洲", cardBg: "from-violet-50 to-indigo-50", badge: "bg-violet-100 text-violet-700" },
  SG: { ja: "アジア", en: "Asia", zh: "亚洲", cardBg: "from-violet-50 to-indigo-50", badge: "bg-violet-100 text-violet-700" },
  MY: { ja: "アジア", en: "Asia", zh: "亚洲", cardBg: "from-violet-50 to-indigo-50", badge: "bg-violet-100 text-violet-700" },
  TH: { ja: "アジア", en: "Asia", zh: "亚洲", cardBg: "from-violet-50 to-indigo-50", badge: "bg-violet-100 text-violet-700" },
  PH: { ja: "アジア", en: "Asia", zh: "亚洲", cardBg: "from-violet-50 to-indigo-50", badge: "bg-violet-100 text-violet-700" },
  ID: { ja: "アジア", en: "Asia", zh: "亚洲", cardBg: "from-violet-50 to-indigo-50", badge: "bg-violet-100 text-violet-700" },
  VN: { ja: "アジア", en: "Asia", zh: "亚洲", cardBg: "from-violet-50 to-indigo-50", badge: "bg-violet-100 text-violet-700" },
  // オセアニア
  AU: { ja: "オセアニア", en: "Oceania", zh: "大洋洲", cardBg: "from-sky-50 to-cyan-50", badge: "bg-sky-100 text-sky-700" },
  NZ: { ja: "オセアニア", en: "Oceania", zh: "大洋洲", cardBg: "from-sky-50 to-cyan-50", badge: "bg-sky-100 text-sky-700" },
  // 北米
  US: { ja: "北米", en: "North America", zh: "北美", cardBg: "from-amber-50 to-orange-50", badge: "bg-amber-100 text-amber-700" },
  CA: { ja: "北米", en: "North America", zh: "北美", cardBg: "from-amber-50 to-orange-50", badge: "bg-amber-100 text-amber-700" },
  // ヨーロッパ
  GB: { ja: "ヨーロッパ", en: "Europe", zh: "欧洲", cardBg: "from-emerald-50 to-teal-50", badge: "bg-emerald-100 text-emerald-700" },
  IE: { ja: "ヨーロッパ", en: "Europe", zh: "欧洲", cardBg: "from-emerald-50 to-teal-50", badge: "bg-emerald-100 text-emerald-700" },
  DE: { ja: "ヨーロッパ", en: "Europe", zh: "欧洲", cardBg: "from-emerald-50 to-teal-50", badge: "bg-emerald-100 text-emerald-700" },
  FR: { ja: "ヨーロッパ", en: "Europe", zh: "欧洲", cardBg: "from-emerald-50 to-teal-50", badge: "bg-emerald-100 text-emerald-700" },
  NL: { ja: "ヨーロッパ", en: "Europe", zh: "欧洲", cardBg: "from-emerald-50 to-teal-50", badge: "bg-emerald-100 text-emerald-700" },
  CH: { ja: "ヨーロッパ", en: "Europe", zh: "欧洲", cardBg: "from-emerald-50 to-teal-50", badge: "bg-emerald-100 text-emerald-700" },
  ES: { ja: "ヨーロッパ", en: "Europe", zh: "欧洲", cardBg: "from-emerald-50 to-teal-50", badge: "bg-emerald-100 text-emerald-700" },
  PT: { ja: "ヨーロッパ", en: "Europe", zh: "欧洲", cardBg: "from-emerald-50 to-teal-50", badge: "bg-emerald-100 text-emerald-700" },
  SE: { ja: "ヨーロッパ", en: "Europe", zh: "欧洲", cardBg: "from-emerald-50 to-teal-50", badge: "bg-emerald-100 text-emerald-700" },
  NO: { ja: "ヨーロッパ", en: "Europe", zh: "欧洲", cardBg: "from-emerald-50 to-teal-50", badge: "bg-emerald-100 text-emerald-700" },
  DK: { ja: "ヨーロッパ", en: "Europe", zh: "欧洲", cardBg: "from-emerald-50 to-teal-50", badge: "bg-emerald-100 text-emerald-700" },
  GR: { ja: "ヨーロッパ", en: "Europe", zh: "欧洲", cardBg: "from-emerald-50 to-teal-50", badge: "bg-emerald-100 text-emerald-700" },
  IT: { ja: "ヨーロッパ", en: "Europe", zh: "欧洲", cardBg: "from-emerald-50 to-teal-50", badge: "bg-emerald-100 text-emerald-700" },
  // その他
  AE: { ja: "中東", en: "Middle East", zh: "中东", cardBg: "from-rose-50 to-pink-50", badge: "bg-rose-100 text-rose-700" },
  GE: { ja: "中東・欧州", en: "Eurasia", zh: "欧亚", cardBg: "from-rose-50 to-pink-50", badge: "bg-rose-100 text-rose-700" },
  BR: { ja: "南米", en: "South America", zh: "南美", cardBg: "from-lime-50 to-green-50", badge: "bg-lime-100 text-lime-700" },
  CO: { ja: "南米", en: "South America", zh: "南美", cardBg: "from-lime-50 to-green-50", badge: "bg-lime-100 text-lime-700" },
};

const defaultRegion: RegionInfo = {
  ja: "その他", en: "Other", zh: "其他",
  cardBg: "from-slate-50 to-gray-50", badge: "bg-slate-100 text-slate-600",
};

const pageText = {
  ja: {
    badge: "MoveWorth.study",
    title: "海外留学情報を比較しよう",
    description: "各国の学生ビザ・費用・大学・生活情報を詳しく解説。あなたにぴったりの留学先を見つけましょう。",
    stat1: "カ国対応", stat2: "完全無料", stat3: "言語対応",
    availableCountries: "留学情報あり",
    comingSoon: "近日公開",
    searchPlaceholder: "国名で検索...",
    noResults: "該当する国が見つかりません",
    monthlyLiving: "月額（家賃込）",
    simulatorBanner: "費用シミュレーターで複数の国を比較する",
    ctaTitle: "移住・留学後の資産もシミュレーション",
    ctaDesc: "MoveWorthなら30カ国以上の移住後の資産推移を無料でシミュレーションできます。",
    ctaBtn: "MoveWorthを使う（無料）",
  },
  en: {
    badge: "MoveWorth.study",
    title: "Compare Study Abroad Destinations",
    description: "Detailed guides on student visas, costs, universities, and life in each country.",
    stat1: " countries", stat2: "Free", stat3: " languages",
    availableCountries: "Available Countries",
    comingSoon: "Coming Soon",
    searchPlaceholder: "Search by country name...",
    noResults: "No countries found",
    monthlyLiving: "Monthly (incl. rent)",
    simulatorBanner: "Compare costs across countries with the simulator →",
    ctaTitle: "Simulate Your Finances Abroad",
    ctaDesc: "MoveWorth lets you project your assets and living costs in 30+ countries for free.",
    ctaBtn: "Try MoveWorth (Free)",
  },
  zh: {
    badge: "MoveWorth.study",
    title: "比较全球留学目的地",
    description: "详细介绍各国学生签证、费用、大学及生活信息，帮助您找到最适合的留学目的地。",
    stat1: "个国家", stat2: "完全免费", stat3: "种语言",
    availableCountries: "支持国家",
    comingSoon: "即将推出",
    searchPlaceholder: "按国家名称搜索...",
    noResults: "未找到相关国家",
    monthlyLiving: "月均（含租金）",
    simulatorBanner: "使用费用模拟器比较多个国家 →",
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

  const heroImages = [
    "/university/34035115_m.jpg",
    "/university/entrepreneurs-meeting-office.jpg",
    "/university/group-diverse-grads-throwing-caps-up-sky.jpg",
    "/university/group-teenagers-posing-together-outdoors.jpg",
  ];
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setHeroIndex((i) => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(id);
  }, []);

  const availableCountries = countryPresets.filter((c) =>
    studyAbroadCountries.includes(c.code)
  );
  const comingSoonCountries = countryPresets.filter(
    (c) => !studyAbroadCountries.includes(c.code)
  );

  const filtered = query.trim()
    ? availableCountries.filter((c) => {
        const q = query.trim();
        return (
          matchesQuery(c.code, c.name.ja, q) ||
          matchesQuery(c.code, c.name.en, q) ||
          matchesQuery(c.code, c.name.zh, q) ||
          c.code.toLowerCase().includes(q.toLowerCase())
        );
      })
    : availableCountries;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-32 text-white">
        {/* Slideshow background */}
        {heroImages.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            className={`object-cover transition-opacity duration-1000 ${i === heroIndex ? "opacity-100" : "opacity-0"}`}
            priority={i === 0}
          />
        ))}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/75 via-blue-950/70 to-violet-950/75" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <GraduationCap className="h-4 w-4" />
            <span>{text.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            {text.title}
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            {text.description}
          </p>
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold">
              <span className="text-lg font-extrabold">{availableCountries.length}</span>
              {text.stat1}
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold">
              {text.stat2}
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold">
              <span className="text-lg font-extrabold">3</span>
              {text.stat3}
            </div>
          </div>
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={text.searchPlaceholder}
              style={{ fontSize: "16px" }}
              className="w-full pl-11 pr-10 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/25 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Simulator banner */}
        <Link
          href="/simulate"
          className="flex items-center justify-between bg-primary/8 border border-primary/20 rounded-2xl px-5 py-3.5 mb-8 hover:bg-primary/12 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="bg-primary/15 rounded-xl p-2">
              <Calculator className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-primary">{text.simulatorBanner}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Available Countries */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              {text.availableCountries}
            </h2>
            <span className="text-sm font-normal text-muted bg-secondary/60 px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted text-sm">
              {text.noResults}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((country) => {
                const data = getStudyAbroadData(country.code);
                const region = regionMap[country.code] ?? defaultRegion;
                const countryName = country.name[lang as keyof typeof country.name] ?? country.name.en;
                return (
                  <Link
                    key={country.code}
                    href={`/${country.code.toLowerCase()}`}
                    className="group block bg-white border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {/* Card header */}
                    <div className={`bg-gradient-to-br ${region.cardBg} px-5 pt-5 pb-4 flex items-start justify-between`}>
                      <span className="text-5xl leading-none">{getFlag(country.code)}</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${region.badge}`}>
                        {region[lang]}
                      </span>
                    </div>
                    {/* Card body */}
                    <div className="px-5 py-4">
                      <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-tight mb-0.5">
                        {countryName}
                      </h3>
                      <p className="text-xs text-muted mb-3">{country.name.en}</p>
                      <div className="flex items-center justify-between">
                        {data ? (
                          <span className="inline-flex items-center gap-1 text-xs bg-secondary/60 text-muted px-2.5 py-1 rounded-lg">
                            <Wallet className="h-3 w-3" />
                            {text.monthlyLiving}: {data.costs.currencySymbol}{data.costs.livingMin.toLocaleString()}〜{data.costs.livingMax.toLocaleString()}
                          </span>
                        ) : (
                          <span />
                        )}
                        <ArrowRight className="h-4 w-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Coming Soon */}
        {!query && comingSoonCountries.length > 0 && (
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-muted mb-3 flex items-center gap-2">
              <span>{text.comingSoon}</span>
              <span className="text-xs font-normal bg-secondary/60 px-2 py-0.5 rounded-full">{comingSoonCountries.length}</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {comingSoonCountries.map((country) => (
                <div
                  key={country.code}
                  className="inline-flex items-center gap-1.5 bg-white/70 border border-border/40 rounded-full px-3 py-1.5 opacity-50"
                >
                  <span className="text-base">{getFlag(country.code)}</span>
                  <span className="text-xs font-medium text-muted">
                    {country.name[lang as keyof typeof country.name] ?? country.name.en}
                  </span>
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
