"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { countryPresets } from "@/data/country-presets";
import { X, UserPlus, CheckCircle } from "lucide-react";

interface FormErrors {
  lastName?: string;
  firstName?: string;
  email?: string;
  password?: string;
  nationality?: string;
}

export function RegisterModal() {
  const { showRegisterModal, setShowRegisterModal, showLoginModal, setShowLoginModal, onRegisterCallback, setOnRegisterCallback } = useAuth();
  const { locale, t } = useTranslation();

  const [form, setForm] = useState({
    lastName: "",
    middleName: "",
    firstName: "",
    email: "",
    password: "",
    nationality: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!showRegisterModal) return null;

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.lastName.trim()) newErrors.lastName = t("auth.lastNameRequired");
    if (!form.firstName.trim()) newErrors.firstName = t("auth.firstNameRequired");
    if (!form.email.trim()) {
      newErrors.email = t("auth.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t("auth.emailInvalid");
    }
    if (!form.password) {
      newErrors.password = t("auth.passwordRequired");
    } else if (form.password.length < 8) {
      newErrors.password = t("auth.passwordTooShort");
    }
    if (!form.nationality) newErrors.nationality = t("auth.nationalityRequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");

    const isStudySite =
      window.location.hostname.startsWith("study.") ||
      window.location.pathname.startsWith("/study-site/");
    const simulatePath = isStudySite ? "/study-site/simulate" : "/simulate";

    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=${simulatePath}`,
        data: {
          lastName: form.lastName.trim(),
          middleName: form.middleName.trim() || undefined,
          firstName: form.firstName.trim(),
          nationality: form.nationality,
        },
      },
    });

    setSubmitting(false);

    if (error) {
      setServerError(t("auth.registerError"));
      return;
    }

    // Supabaseは重複メールでも成功を返すため identities で判定
    if (data.user?.identities?.length === 0) {
      setServerError(t("auth.emailAlreadyUsed"));
      return;
    }

    setSuccess(true);
  };

  const handleClose = () => {
    setShowRegisterModal(false);
    setOnRegisterCallback(null);
    setErrors({});
    setServerError("");
    setSuccess(false);
    setForm({ lastName: "", middleName: "", firstName: "", email: "", password: "", nationality: "" });
  };

  const switchToLogin = () => {
    handleClose();
    setShowLoginModal(true);
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (serverError) setServerError("");
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-border/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-8 text-center">
          <CheckCircle className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="text-lg font-bold text-foreground mb-2">{t("auth.registerTitle")}</h2>
          <p className="text-sm text-muted leading-relaxed">{t("auth.registerSuccess")}</p>
          <button
            onClick={handleClose}
            className="mt-6 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-border/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="relative bg-gradient-to-r from-primary to-indigo-600 px-6 py-5 text-white">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{t("auth.registerTitle")}</h2>
              <p className="text-sm text-indigo-100">{t("auth.registerSubtitle")}</p>
            </div>
          </div>
        </div>

        <div className="px-6 pt-5 pb-2">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-border/60 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground hover:bg-slate-50 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {t("auth.continueWithGoogle")}
          </button>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-xs text-muted">{t("auth.orDivider")}</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {serverError && (
            <div className="text-sm text-danger bg-danger/5 border border-danger/20 rounded-xl px-4 py-3">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                {t("auth.lastName")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                  errors.lastName ? "border-red-300" : "border-border/60"
                }`}
                placeholder="Smith"
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                {t("auth.firstName")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                  errors.firstName ? "border-red-300" : "border-border/60"
                }`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              {t("auth.middleName")} <span className="text-muted/50 text-[10px]">({t("auth.optional")})</span>
            </label>
            <input
              type="text"
              value={form.middleName}
              onChange={(e) => updateField("middleName", e.target.value)}
              className="w-full border border-border/60 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder=""
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              {t("auth.email")} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                errors.email ? "border-red-300" : "border-border/60"
              }`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              {t("auth.password")} <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                errors.password ? "border-red-300" : "border-border/60"
              }`}
              placeholder={t("auth.passwordPlaceholder")}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              {t("auth.nationality")} <span className="text-red-500">*</span>
            </label>
            <select
              value={form.nationality}
              onChange={(e) => updateField("nationality", e.target.value)}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer ${
                errors.nationality ? "border-red-300" : "border-border/60"
              }`}
            >
              <option value="">{t("auth.selectNationality")}</option>
              {countryPresets.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name[locale]}
                </option>
              ))}
            </select>
            {errors.nationality && (
              <p className="text-xs text-red-500 mt-1">{errors.nationality}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-primary-dark hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            {submitting ? t("auth.registering") : t("auth.registerButton")}
          </button>

          <p className="text-center text-xs text-muted">
            {t("auth.hasAccount")}{" "}
            <button type="button" onClick={switchToLogin} className="text-primary font-medium hover:underline">
              {t("auth.loginHere")}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
