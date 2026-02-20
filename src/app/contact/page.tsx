"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle, AlertCircle, Mail } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = t("contact.nameRequired");
    if (!form.email.trim()) errs.email = t("contact.emailRequired");
    if (!form.subject.trim()) errs.subject = t("contact.subjectRequired");
    if (!form.message.trim()) errs.message = t("contact.messageRequired");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/FORM_ID_HERE", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("contact.backHome")}
        </Link>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-light text-primary mb-5">
            <Mail className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">
            {t("contact.title")}
          </h1>
          <p className="text-muted text-lg">
            {t("contact.subtitle")}
          </p>
        </div>

        {status === "success" ? (
          <div className="bg-white border border-accent/30 rounded-2xl p-8 text-center shadow-sm">
            <CheckCircle className="h-12 w-12 text-accent mx-auto mb-4" />
            <p className="text-lg font-semibold text-foreground">
              {t("contact.success")}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-border/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
            {status === "error" && (
              <div className="flex items-center gap-2 text-sm text-danger bg-danger/5 border border-danger/20 rounded-xl px-4 py-3">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {t("contact.error")}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                {t("contact.name")} <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                  errors.name ? "border-red-300" : "border-border/60"
                }`}
              />
              {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                {t("contact.email")} <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                  errors.email ? "border-red-300" : "border-border/60"
                }`}
              />
              {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                {t("contact.subject")} <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                  errors.subject ? "border-red-300" : "border-border/60"
                }`}
              />
              {errors.subject && <p className="text-xs text-danger mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                {t("contact.message")} <span className="text-danger">*</span>
              </label>
              <textarea
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                rows={5}
                placeholder={t("contact.messagePlaceholder")}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none ${
                  errors.message ? "border-red-300" : "border-border/60"
                }`}
              />
              {errors.message && <p className="text-xs text-danger mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              {status === "sending" ? t("contact.sending") : t("contact.send")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
