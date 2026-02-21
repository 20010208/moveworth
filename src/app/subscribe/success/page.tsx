"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Crown } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

export default function SubscribeSuccessPage() {
  const { locale } = useTranslation();

  useEffect(() => {
    // Webhookがプランを更新するまで少し待ってからセッションをリフレッシュ
    const timer = setTimeout(async () => {
      await supabase.auth.refreshSession();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-border/60 p-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 mb-6">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-4">
          <Crown className="h-4 w-4" />
          <span>{locale === "ja" ? "アップグレード完了" : "Upgrade Complete"}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mb-3">
          {locale === "ja" ? "ありがとうございます！" : "Thank you!"}
        </h1>
        <p className="text-muted text-sm leading-relaxed mb-8">
          {locale === "ja"
            ? "プランのアップグレードが完了しました。すべての機能をご利用いただけます。"
            : "Your plan has been upgraded. You now have access to all features."}
        </p>
        <Link
          href="/simulate"
          className="inline-block bg-gradient-to-r from-primary to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:from-primary-dark hover:to-indigo-700 transition-all shadow-lg shadow-primary/20"
        >
          {locale === "ja" ? "シミュレーターへ" : "Go to Simulator"}
        </Link>
      </div>
    </div>
  );
}
