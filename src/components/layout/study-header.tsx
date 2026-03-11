"use client";

import Link from "next/link";
import { useState } from "react";
import { Globe, GraduationCap, Menu, X, Languages, User, LogOut } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

const navLabels = {
  ja: {
    countries: "留学先一覧",
    simulator: "移住シミュレーター",
    toggleMenu: "メニュー",
    login: "ログイン",
    register: "無料登録",
    logout: "ログアウト",
  },
  en: {
    countries: "Countries",
    simulator: "Migration Simulator",
    toggleMenu: "Toggle menu",
    login: "Login",
    register: "Sign Up",
    logout: "Logout",
  },
  zh: {
    countries: "留学目的地",
    simulator: "移居模拟器",
    toggleMenu: "切换菜单",
    login: "登录",
    register: "免费注册",
    logout: "退出",
  },
};

export function StudyHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale, setLocale } = useTranslation();
  const { isAuthenticated, user, logout, setShowLoginModal, setShowRegisterModal } = useAuth();
  const lang = locale as "en" | "ja" | "zh";
  const labels = navLabels[lang];

  const cycleLocale = () => {
    if (locale === "en") setLocale("ja");
    else if (locale === "ja") setLocale("zh");
    else setLocale("en");
  };

  const currentLocaleLabel = locale === "en" ? "EN" : locale === "ja" ? "JA" : "ZH";

  return (
    <header className="glass border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md group-hover:blur-lg transition-all" />
              <div className="relative flex items-center">
                <Globe className="h-7 w-7 text-primary" />
                <GraduationCap className="h-4 w-4 text-indigo-500 -ml-2 -mb-2" />
              </div>
            </div>
            <span className="text-xl font-bold">
              <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
                MoveWorth
              </span>
              <span className="text-muted font-normal text-base">.study</span>
            </span>
          </Link>

          {/* PC Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="text-sm font-medium text-muted hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary/80 transition-all"
            >
              {labels.countries}
            </Link>

            <div className="w-px h-5 bg-border mx-2" />

            <button
              onClick={cycleLocale}
              className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary/80 transition-all"
              aria-label="Switch language"
            >
              <Languages className="h-4 w-4" />
              {currentLocaleLabel}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 ml-1">
                <Link
                  href="https://www.moveworthapp.com/account"
                  className="text-sm font-medium text-foreground flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-secondary/80 transition-all"
                >
                  <User className="h-4 w-4 text-primary" />
                  {user?.firstName}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-muted hover:text-foreground px-2 py-1.5 rounded-lg hover:bg-secondary/80 transition-all"
                  title={labels.logout}
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
                  {labels.login}
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
                >
                  {labels.register}
                </button>
              </div>
            )}
          </nav>

          {/* Mobile right */}
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
              aria-label={labels.toggleMenu}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 pt-2 space-y-1 border-t border-border/50">
            <Link
              href="/"
              className="block px-3 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:bg-secondary/80 rounded-lg transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {labels.countries}
            </Link>
            <div className="pt-2 mx-3 space-y-2">
              <a
                href="https://www.moveworthapp.com/simulate"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold text-center shadow-md shadow-primary/20"
                onClick={() => setMobileOpen(false)}
              >
                {labels.simulator}
              </a>
              {isAuthenticated ? (
                <div className="flex items-center justify-between px-1 py-1">
                  <Link
                    href="https://www.moveworthapp.com/account"
                    className="text-sm font-medium text-foreground flex items-center gap-1.5 hover:text-primary transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <User className="h-4 w-4 text-primary" />
                    {user?.firstName}
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="text-sm font-medium text-muted hover:text-foreground flex items-center gap-1"
                  >
                    <LogOut className="h-4 w-4" />
                    {labels.logout}
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => { setShowLoginModal(true); setMobileOpen(false); }}
                    className="block w-full border border-primary text-primary px-4 py-2.5 rounded-xl text-sm font-semibold text-center"
                  >
                    {labels.login}
                  </button>
                  <button
                    onClick={() => { setShowRegisterModal(true); setMobileOpen(false); }}
                    className="block w-full bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold text-center shadow-md shadow-primary/20"
                  >
                    {labels.register}
                  </button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
