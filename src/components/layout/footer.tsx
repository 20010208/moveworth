"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border/50 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Globe className="h-5 w-5 text-primary" />
            <span className="font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              MoveWorth
            </span>
          </div>
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} MoveWorth. {t("footer.rights")}
          </p>
          <div className="flex gap-8 text-sm text-muted">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              {t("footer.terms")}
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              {t("footer.privacy")}
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              {t("footer.contact")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
