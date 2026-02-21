"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import {
  Check,
  ArrowLeft,
  Crown,
  Sparkles,
  Bell,
  Loader2,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function SubscribePage() {
  const { t, locale } = useTranslation();
  const { user, setShowRegisterModal } = useAuth();
  const [email, setEmail] = useState("");
  const [notified, setNotified] = useState(false);
  const [notifyError, setNotifyError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("pricing.free");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const plans = [
    {
      nameKey: "pricing.free",
      planKey: null as null | "pro" | "premium",
      price: "$0",
      period: "",
      featureKeys: [
        "pricing.freeFeature1",
        "pricing.freeFeature2",
        "pricing.freeFeature3",
        "pricing.freeFeature4",
      ],
      highlight: false,
      status: "current" as const,
    },
    {
      nameKey: "pricing.proName",
      planKey: "pro" as const,
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
      status: "available" as const,
    },
    {
      nameKey: "pricing.premium",
      planKey: "premium" as const,
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
      status: "available" as const,
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

  const handleNotify = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setNotifyError("");
    const { error } = await supabase.from("waitlist_emails").insert({ email: email.trim() });
    if (error) {
      if (error.code === "23505" || error.message?.toLowerCase().includes("duplicate") || error.message?.toLowerCase().includes("unique")) {
        setNotifyError(locale === "ja" ? "このメールアドレスはすでに登録されています。" : "This email is already registered.");
      } else {
        setNotifyError(locale === "ja" ? "エラーが発生しました。もう一度お試しください。" : "An error occurred. Please try again.");
      }
      return;
    }
    setNotified(true);
    setEmail("");
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.nameKey;
            const isLoading = checkoutLoading === plan.planKey;
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
                {plan.status === "current" ? (
                  <span className="block text-center py-2.5 rounded-xl font-semibold text-sm bg-primary/10 text-primary">
                    {t("subscribe.currentPlan")}
                  </span>
                ) : (
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
                )}
              </div>
            );
          })}
        </div>

        {/* Notify section */}
        <div className="max-w-lg mx-auto">
          <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-light text-primary mb-4">
              <Bell className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              {t("subscribe.notifyMe")}
            </h3>
            {notified ? (
              <div className="flex items-center justify-center gap-2 text-accent font-medium py-3">
                <Sparkles className="h-5 w-5" />
                {t("subscribe.notifySuccess")}
              </div>
            ) : (
              <form onSubmit={handleNotify} className="flex flex-col gap-2 mt-4">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setNotifyError(""); }}
                    placeholder={t("subscribe.notifyPlaceholder")}
                    className="flex-1 border border-border/60 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
                  >
                    {t("subscribe.notifyButton")}
                  </button>
                </div>
                {notifyError && (
                  <p className="text-sm text-red-500 text-left">{notifyError}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
