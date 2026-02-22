"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Save, Trash2, AlertTriangle, CheckCircle, Loader2, CreditCard, Crown, ExternalLink } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { countryPresets } from "@/data/country-presets";

export default function AccountPage() {
  const { t, locale } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    lastName: "",
    middleName: "",
    firstName: "",
    nationality: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        lastName: user.lastName || "",
        middleName: user.middleName || "",
        firstName: user.firstName || "",
        nationality: user.nationality || "",
      });
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && typeof window !== "undefined") {
      // Wait a moment for auth to load
      const timer = setTimeout(() => {
        if (!isAuthenticated) router.push("/");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("idle");
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          lastName: form.lastName,
          middleName: form.middleName,
          firstName: form.firstName,
          nationality: form.nationality,
        },
      });
      if (error) {
        setSaveStatus("error");
      } else {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    setPortalError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setPortalError(t("account.portalError"));
        return;
      }
      const res = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: { "Authorization": `Bearer ${session.access_token}` },
      });
      if (!res.ok) {
        setPortalError(t("account.portalError"));
        return;
      }
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setPortalError(t("account.portalError"));
    } finally {
      setPortalLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setDeleteError(t("account.deleteError"));
        setDeleting(false);
        return;
      }

      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      if (res.ok) {
        await logout();
        router.push("/");
      } else {
        setDeleteError(t("account.deleteError"));
      }
    } catch {
      setDeleteError(t("account.deleteError"));
    } finally {
      setDeleting(false);
    }
  };

  const deleteConfirmWord = locale === "ja" ? "削除" : "DELETE";

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/simulate"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("account.back")}
        </Link>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-light text-primary mb-5">
            <User className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">
            {t("account.title")}
          </h1>
          <p className="text-muted text-sm">{user.email}</p>
        </div>

        {/* Profile Edit Section */}
        <div className="bg-white border border-border/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5 mb-8">
          <h2 className="text-base font-bold text-foreground">
            {t("account.profileTitle")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                {t("auth.lastName")} <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full border border-border/60 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                {t("auth.firstName")} <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full border border-border/60 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              {t("auth.middleName")} <span className="text-xs text-muted/60">({t("auth.optional")})</span>
            </label>
            <input
              type="text"
              value={form.middleName}
              onChange={(e) => setForm({ ...form, middleName: e.target.value })}
              className="w-full border border-border/60 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              {t("auth.nationality")} <span className="text-danger">*</span>
            </label>
            <select
              value={form.nationality}
              onChange={(e) => setForm({ ...form, nationality: e.target.value })}
              className="w-full border border-border/60 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="">{t("auth.selectNationality")}</option>
              {countryPresets.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name[locale as "en" | "ja"]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              {t("auth.email")}
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border border-border/60 rounded-xl px-3 py-2.5 text-sm bg-surface text-muted cursor-not-allowed"
            />
            <p className="text-[11px] text-muted/60 mt-1">{t("account.emailNote")}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !form.lastName || !form.firstName}
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? t("account.saving") : t("account.save")}
            </button>
            {saveStatus === "success" && (
              <span className="text-sm text-accent flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                {t("account.saveSuccess")}
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-sm text-danger">{t("account.saveError")}</span>
            )}
          </div>
        </div>

        {/* Subscription Section */}
        <div className="bg-white border border-border/60 rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5" />
            {t("account.subscriptionTitle")}
          </h2>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm text-muted">{t("account.currentPlan")}</span>
            {user.plan === "premium" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                <Crown className="h-3 w-3" />
                Premium
              </span>
            ) : user.plan === "pro" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                <Crown className="h-3 w-3" />
                Pro
              </span>
            ) : (
              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-surface text-muted">
                Free
              </span>
            )}
          </div>

          {user.plan === "free" ? (
            <Link
              href="/subscribe"
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
            >
              <Crown className="h-4 w-4" />
              {t("account.upgradePlan")}
            </Link>
          ) : (
            <div>
              <button
                onClick={handleManageSubscription}
                disabled={portalLoading}
                className="inline-flex items-center gap-2 border border-border/60 text-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:border-primary/40 hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {portalLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
                {portalLoading ? t("account.portalLoading") : t("account.manageSub")}
              </button>
              {portalError && (
                <p className="text-sm text-danger mt-2">{portalError}</p>
              )}
            </div>
          )}
        </div>

        {/* Danger Zone - Account Deletion */}
        <div className="bg-white border border-danger/30 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-base font-bold text-danger flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5" />
            {t("account.dangerZone")}
          </h2>
          <p className="text-sm text-muted mb-4">
            {t("account.deleteDescription")}
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="border border-danger/40 text-danger px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-danger/5 transition-all flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {t("account.deleteButton")}
            </button>
          ) : (
            <div className="bg-danger/5 border border-danger/20 rounded-xl p-4 space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-danger mb-1">
                    {t("account.deleteWarningTitle")}
                  </p>
                  <p className="text-xs text-muted">
                    {t("account.deleteWarningDesc")}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">
                  {t("account.deleteConfirmLabel", { word: deleteConfirmWord })}
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={deleteConfirmWord}
                  className="w-full border border-danger/30 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-danger/20 focus:border-danger transition-all"
                />
              </div>

              {deleteError && (
                <p className="text-sm text-danger">{deleteError}</p>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleteConfirmText !== deleteConfirmWord || deleting}
                  className="bg-danger text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {deleting ? t("account.deleting") : t("account.deleteConfirmButton")}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                    setDeleteError("");
                  }}
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  {t("account.cancel")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
