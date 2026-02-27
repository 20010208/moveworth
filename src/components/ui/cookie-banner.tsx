"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const STORAGE_KEY = "cookie-consent";

export function CookieBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-3xl mx-auto bg-white border border-border/60 rounded-2xl shadow-lg p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-muted leading-relaxed">
            {t("cookie.message")}{" "}
            <Link href="/privacy" className="text-primary underline hover:opacity-80">
              {t("cookie.privacyLink")}
            </Link>
          </p>
        </div>
        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={decline}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-muted border border-border/60 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {t("cookie.decline")}
          </button>
          <button
            onClick={accept}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:opacity-90 transition-opacity"
          >
            {t("cookie.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
