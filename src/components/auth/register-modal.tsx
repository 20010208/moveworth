"use client";

import { useState } from "react";
import { useAuth, User } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import { countryPresets } from "@/data/country-presets";
import { X, UserPlus } from "lucide-react";

interface FormErrors {
  lastName?: string;
  firstName?: string;
  email?: string;
  nationality?: string;
}

export function RegisterModal() {
  const { showRegisterModal, setShowRegisterModal, register, onRegisterCallback, setOnRegisterCallback } = useAuth();
  const { locale, t } = useTranslation();

  const [form, setForm] = useState({
    lastName: "",
    middleName: "",
    firstName: "",
    email: "",
    nationality: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  if (!showRegisterModal) return null;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.lastName.trim()) newErrors.lastName = t("auth.lastNameRequired");
    if (!form.firstName.trim()) newErrors.firstName = t("auth.firstNameRequired");
    if (!form.email.trim()) {
      newErrors.email = t("auth.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t("auth.emailInvalid");
    }
    if (!form.nationality) newErrors.nationality = t("auth.nationalityRequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    register({
      lastName: form.lastName.trim(),
      middleName: form.middleName.trim() || undefined,
      firstName: form.firstName.trim(),
      email: form.email.trim(),
      nationality: form.nationality,
    });
    setSubmitting(false);

    if (onRegisterCallback) {
      setTimeout(() => {
        onRegisterCallback();
        setOnRegisterCallback(null);
      }, 100);
    }
  };

  const handleClose = () => {
    setShowRegisterModal(false);
    setOnRegisterCallback(null);
    setErrors({});
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-border/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name Row */}
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

          {/* Middle Name */}
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

          {/* Email */}
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

          {/* Nationality */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-primary-dark hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            {submitting ? t("auth.registering") : t("auth.registerButton")}
          </button>
        </form>
      </div>
    </div>
  );
}
