"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

export default function UpdatePasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError(t("auth.passwordMismatch"));
      return;
    }
    if (password.length < 8) {
      setError(t("auth.passwordTooShort"));
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(t("auth.updatePasswordError"));
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/"), 2500);
      }
    } catch {
      setError(t("auth.updatePasswordError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-border/60 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-indigo-600 px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold">{t("auth.updatePasswordTitle")}</h1>
                <p className="text-sm text-indigo-100">{t("auth.updatePasswordSubtitle")}</p>
              </div>
            </div>
          </div>

          {success ? (
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h2 className="text-base font-bold text-foreground mb-2">
                {t("auth.passwordUpdatedTitle")}
              </h2>
              <p className="text-sm text-muted">{t("auth.passwordUpdatedDesc")}</p>
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
                  {t("auth.newPassword")} <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.passwordPlaceholder")}
                  required
                  className="w-full border border-border/60 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">
                  {t("auth.confirmPassword")} <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("auth.passwordPlaceholder")}
                  required
                  className="w-full border border-border/60 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !password || !confirmPassword}
                className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-primary-dark hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                {submitting ? t("auth.updating") : t("auth.updatePasswordButton")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
