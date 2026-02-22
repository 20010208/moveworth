"use client";

import Link from "next/link";
import {
  Globe,
  TrendingUp,
  BarChart3,
  Shield,
  Calculator,
  FileText,
  Zap,
  ArrowRight,
  Check,
  Sparkles,
  MapPin,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isPaid = user?.plan === "pro" || user?.plan === "premium";

  const steps = [
    { titleKey: "howItWorks.step1Title", descKey: "howItWorks.step1Desc", icon: Calculator, step: "01" },
    { titleKey: "howItWorks.step2Title", descKey: "howItWorks.step2Desc", icon: Zap, step: "02" },
    { titleKey: "howItWorks.step3Title", descKey: "howItWorks.step3Desc", icon: BarChart3, step: "03" },
  ];

  const features = [
    { icon: Globe, titleKey: "features.countries", descKey: "features.countriesDesc", premium: false },
    { icon: TrendingUp, titleKey: "features.assetProjection", descKey: "features.assetProjectionDesc", premium: false },
    { icon: BarChart3, titleKey: "features.visualCharts", descKey: "features.visualChartsDesc", premium: false },
    { icon: Shield, titleKey: "features.riskAnalysis", descKey: "features.riskAnalysisDesc", premium: true },
    { icon: Calculator, titleKey: "features.fireCalculator", descKey: "features.fireCalculatorDesc", premium: true },
    { icon: FileText, titleKey: "features.aiPdfReport", descKey: "features.aiPdfReportDesc", premium: true },
  ];

  const plans = [
    {
      nameKey: "pricing.free",
      price: "$0",
      period: "",
      featureKeys: ["pricing.freeFeature1", "pricing.freeFeature2", "pricing.freeFeature3", "pricing.freeFeature4"],
      ctaKey: "pricing.getStarted",
      highlight: false,
      disabled: false,
      href: "/simulate",
    },
    {
      nameKey: "pricing.proName",
      price: "$5",
      period: "pricing.month",
      featureKeys: ["pricing.proFeature1", "pricing.proFeature2", "pricing.proFeature3", "pricing.proFeature4", "pricing.proFeature5"],
      ctaKey: "pricing.getStarted",
      highlight: true,
      disabled: false,
      href: "/subscribe",
    },
    {
      nameKey: "pricing.premium",
      price: "$15",
      period: "pricing.month",
      featureKeys: ["pricing.premiumFeature1", "pricing.premiumFeature2", "pricing.premiumFeature3", "pricing.premiumFeature4"],
      ctaKey: "pricing.getStarted",
      highlight: false,
      disabled: false,
      href: "/subscribe",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50/30 to-slate-50 py-20 sm:py-32">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/3 to-accent/3 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-8 shadow-sm">
            <Sparkles className="h-4 w-4" />
            <span>20+ Countries Supported</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-foreground leading-[1.1] tracking-tight">
            {t("hero.title1")}
            <br />
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-primary bg-clip-text text-transparent animate-gradient">
              {t("hero.title2")}
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            {t("hero.description")}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/simulate"
              className="group bg-primary text-white px-8 py-3.5 rounded-2xl font-semibold text-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 flex items-center gap-2"
            >
              {isPaid ? t("hero.ctaPaid") : t("hero.cta")}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="text-muted font-medium hover:text-foreground transition-colors flex items-center gap-1"
            >
              {t("hero.learnMore")}
              <span className="text-lg">&darr;</span>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-accent" />
              <span>20+ Countries</span>
            </div>
            <div className="w-1 h-1 bg-border rounded-full" />
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-accent" />
              <span>Data-Driven</span>
            </div>
            <div className="w-1 h-1 bg-border rounded-full" />
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-accent" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              {t("howItWorks.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

            {steps.map((item) => (
              <div key={item.titleKey} className="text-center relative">
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-white mb-5 shadow-lg shadow-primary/20">
                  <item.icon className="h-7 w-7" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {t(item.titleKey)}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28 bg-indigo-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              {t("features.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => {
              const card = (
                <div
                  key={feature.titleKey}
                  className={`card-hover bg-white rounded-2xl p-6 border border-border/60 shadow-sm ${feature.premium ? "cursor-pointer" : ""}`}
                >
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary-light text-primary mb-4">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                    {t(feature.titleKey)}
                    {feature.premium && (
                      <span className="text-[10px] font-bold uppercase bg-gradient-to-r from-amber-400 to-orange-400 text-white px-2 py-0.5 rounded-full tracking-wide">
                        {t("features.pro")}
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{t(feature.descKey)}</p>
                </div>
              );
              return feature.premium ? (
                <Link key={feature.titleKey} href="/subscribe">{card}</Link>
              ) : (
                <div key={feature.titleKey}>{card}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t("pricing.title")}
            </h2>
            <p className="text-muted text-lg">
              {t("pricing.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.nameKey}
                className={`relative rounded-2xl p-7 border-2 transition-all ${
                  plan.highlight
                    ? "border-primary bg-gradient-to-b from-primary-light to-white shadow-xl shadow-primary/10 scale-[1.02]"
                    : "border-border/60 bg-white hover:border-primary/30 hover:shadow-lg"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
                      POPULAR
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-bold text-foreground">
                  {t(plan.nameKey)}
                </h3>
                <div className="mt-3 mb-6">
                  <span className="text-4xl font-extrabold text-foreground tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-muted text-sm ml-1">
                    {plan.period ? t(plan.period) : ""}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.featureKeys.map((fKey) => (
                    <li key={fKey} className="text-sm text-muted flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                      {t(fKey)}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className="block text-center py-2.5 rounded-xl font-semibold text-sm bg-primary text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
                >
                  {t(plan.ctaKey)}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-600 to-primary-dark" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5">
            {t("cta.title")}
          </h2>
          <p className="text-indigo-100 text-lg mb-10 leading-relaxed">
            {t("cta.description")}
          </p>
          <Link
            href="/simulate"
            className="group inline-flex items-center gap-2 bg-white text-primary px-8 py-3.5 rounded-2xl font-semibold text-lg hover:bg-indigo-50 transition-all shadow-xl"
          >
            {t("cta.button")}
            <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
