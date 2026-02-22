"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) {
        setError(t("auth.forgotPasswordError"));
      } else {
        setSent(true);
      }
    } catch {
      setError(t("auth.forgotPasswordError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("auth.backToLogin")}
        </Link>

        <div className="bg-white border border-border/60 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-indigo-600 px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold">{t("auth.forgotPasswordTitle")}</h1>
                <p className="text-sm text-indigo-100">{t("auth.forgotPasswordSubtitle")}</p>
              </div>
            </div>
          </div>

          {sent ? (
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h2 className="text-base font-bold text-foreground mb-2">
                {t("auth.resetEmailSentTitle")}
              </h2>
              <p className="text-sm text-muted mb-6">{t("auth.resetEmailSentDesc")}</p>
              <Link href="/" className="text-sm text-primary font-medium hover:underline">
                {t("auth.backToLogin")}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="text-sm text-danger bg-danger/5 border border-danger/20 rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">
                  {t("auth.email")} <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                  className="w-full border border-border/60 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !email.trim()}
                className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-primary-dark hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                {submitting ? t("auth.sending") : t("auth.sendResetEmail")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
