"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import {
  Check,
  ArrowLeft,
  Crown,
  Loader2,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function SubscribePage() {
  const { t, locale } = useTranslation();
  const { user, setShowRegisterModal } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>("pricing.free");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const userPlan = user?.plan ?? "free";

  const plans = [
    {
      nameKey: "pricing.free",
      planKey: null as null | "pro" | "premium",
      planId: "free" as const,
      price: "$0",
      period: "",
      featureKeys: [
        "pricing.freeFeature1",
        "pricing.freeFeature2",
        "pricing.freeFeature3",
        "pricing.freeFeature4",
      ],
      highlight: false,
    },
    {
      nameKey: "pricing.proName",
      planKey: "pro" as const,
      planId: "pro" as const,
      price: "$5",
      period: "pricing.month",
      featureKeys: [
        "pricing.proFeature1",
        "pricing.proFeature2",
        "pricing.proFeature3",
        "pricing.proFeature4",
        "pricing.proFeature5",
      ],
      highlight: true,
    },
    {
      nameKey: "pricing.premium",
      planKey: "premium" as const,
      planId: "premium" as const,
      price: "$15",
      period: "pricing.month",
      featureKeys: [
        "pricing.premiumFeature1",
        "pricing.premiumFeature2",
        "pricing.premiumFeature3",
        "pricing.premiumFeature4",
        "pricing.premiumFeature5",
      ],
      highlight: false,
    },
  ];

  const handleCheckout = async (planKey: "pro" | "premium") => {
    if (!user) {
      setShowRegisterModal(true);
      return;
    }
    setCheckoutLoading(planKey);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify({ plan: planKey, locale }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(locale === "ja" ? "エラーが発生しました。" : "An error occurred.");
      }
    } catch {
      alert(locale === "ja" ? "エラーが発生しました。" : "An error occurred.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("subscribe.backHome")}
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-6 shadow-sm">
            <Crown className="h-4 w-4" />
            <span>{t("subscribe.title")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            {t("subscribe.title")}
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto">
            {t("subscribe.subtitle")}
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.nameKey;
            const isLoading = checkoutLoading === plan.planKey;
            const isCurrent = userPlan === plan.planId;
            return (
              <div
                key={plan.nameKey}
                onClick={() => setSelectedPlan(plan.nameKey)}
                className={`relative rounded-2xl p-7 border-2 transition-all text-left cursor-pointer ${
                  isSelected
                    ? "border-primary bg-gradient-to-b from-primary-light to-white shadow-xl shadow-primary/10 scale-[1.02]"
                    : "border-border/60 bg-white hover:border-primary/40 hover:shadow-md"
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
                    <li
                      key={fKey}
                      className="text-sm text-muted flex items-start gap-2.5"
                    >
                      <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                      {t(fKey)}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <span className="block text-center py-2.5 rounded-xl font-semibold text-sm bg-primary/10 text-primary">
                    {t("subscribe.currentPlan")}
                  </span>
                ) : plan.planKey ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (plan.planKey) handleCheckout(plan.planKey);
                    }}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-primary to-indigo-600 text-white hover:from-primary-dark hover:to-indigo-700 transition-all shadow-md shadow-primary/20 disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {locale === "ja" ? "処理中..." : "Processing..."}
                      </>
                    ) : (
                      <>
                        <Crown className="h-4 w-4" />
                        {locale === "ja" ? "このプランにする" : "Get Started"}
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    href="/simulate"
                    className="block text-center py-2.5 rounded-xl font-semibold text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                  >
                    {locale === "ja" ? "無料で始める" : "Start Free"}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
