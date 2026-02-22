"use client";

import Link from "next/link";
import { useState } from "react";
import { Globe, Menu, X, Languages, User, LogOut, Crown } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale, setLocale, t } = useTranslation();
  const { isAuthenticated, user, logout, setShowRegisterModal, setShowLoginModal } = useAuth();

  const cycleLocale = () => {
    if (locale === "en") setLocale("ja");
    else if (locale === "ja") setLocale("zh");
    else setLocale("en");
  };

  const nextLocaleLabel = locale === "en" ? "JA" : locale === "ja" ? "ZH" : "EN";

  return (
    <header className="glass border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md group-hover:blur-lg transition-all" />
              <Globe className="relative h-7 w-7 text-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              MoveWorth
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/simulate"
              className="text-sm font-medium text-muted hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary/80 transition-all"
            >
              {t("header.simulator")}
            </Link>
            <a
              href="/#how-it-works"
              className="text-sm font-medium text-muted hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary/80 transition-all"
            >
              {t("header.howItWorks")}
            </a>
            <a
              href="/#features"
              className="text-sm font-medium text-muted hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary/80 transition-all"
            >
              {t("header.features")}
            </a>
            <a
              href="/#pricing"
              className="text-sm font-medium text-muted hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary/80 transition-all"
            >
              {t("header.pricing")}
            </a>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary/80 transition-all"
            >
              {t("header.blog")}
            </Link>

            <div className="w-px h-5 bg-border mx-2" />

            <button
              onClick={cycleLocale}
              className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary/80 transition-all"
              aria-label="Switch language"
            >
              <Languages className="h-4 w-4" />
              {nextLocaleLabel}
            </button>
            {isAuthenticated ? (
              <div className="flex items-center gap-2 ml-1">
                <Link
                  href="/account"
                  className="text-sm font-medium text-foreground flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-secondary/80 transition-all"
                >
                  <User className="h-4 w-4 text-primary" />
                  {user?.firstName}
                  {user?.plan === "premium" && (
                    <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                      <Crown className="h-3 w-3" />
                      Premium
                    </span>
                  )}
                  {user?.plan === "pro" && (
                    <span className="inline-flex items-center gap-0.5 bg-primary/10 text-primary text-xs font-bold px-1.5 py-0.5 rounded-full">
                      Pro
                    </span>
                  )}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-muted hover:text-foreground px-2 py-1.5 rounded-lg hover:bg-secondary/80 transition-all"
                  title={t("header.logout")}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-sm font-medium text-muted hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary/80 transition-all"
                >
                  {t("header.login")}
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
                >
                  {t("header.register")}
                </button>
              </div>
            )}
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={cycleLocale}
              className="p-2 text-muted hover:text-foreground"
              aria-label="Switch language"
            >
              <Languages className="h-5 w-5" />
            </button>
            <button
              className="p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={t("header.toggleMenu")}
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden pb-4 pt-2 space-y-1 border-t border-border/50">
            <Link
              href="/simulate"
              className="block px-3 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:bg-secondary/80 rounded-lg transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {t("header.simulator")}
            </Link>
            <a
              href="/#how-it-works"
              className="block px-3 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:bg-secondary/80 rounded-lg transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {t("header.howItWorks")}
            </a>
            <a
              href="/#features"
              className="block px-3 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:bg-secondary/80 rounded-lg transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {t("header.features")}
            </a>
            <a
              href="/#pricing"
              className="block px-3 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:bg-secondary/80 rounded-lg transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {t("header.pricing")}
            </a>
            <Link
              href="/blog"
              className="block px-3 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:bg-secondary/80 rounded-lg transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {t("header.blog")}
            </Link>
            <div className="pt-2">
              {isAuthenticated ? (
                <div className="flex items-center justify-between mx-3 px-3 py-2.5">
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-foreground flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <User className="h-4 w-4 text-primary" />
                    {user?.firstName} {user?.lastName}
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="text-sm font-medium text-muted hover:text-foreground flex items-center gap-1"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("header.logout")}
                  </button>
                </div>
              ) : (
                <div className="space-y-2 mx-3">
                  <button
                    onClick={() => { setShowLoginModal(true); setMobileOpen(false); }}
                    className="block w-full border border-primary text-primary px-4 py-2.5 rounded-xl text-sm font-semibold text-center"
                  >
                    {t("header.login")}
                  </button>
                  <button
                    onClick={() => { setShowRegisterModal(true); setMobileOpen(false); }}
                    className="block w-full bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold text-center shadow-md shadow-primary/20"
                  >
                    {t("header.register")}
                  </button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
