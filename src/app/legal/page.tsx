"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function LegalPage() {
  const { t } = useTranslation();

  const sections = [
    { title: t("legal.section1Title"), content: t("legal.section1Content") },
    { title: t("legal.section2Title"), content: t("legal.section2Content") },
    { title: t("legal.section3Title"), content: t("legal.section3Content") },
    { title: t("legal.section4Title"), content: t("legal.section4Content") },
    { title: t("legal.section5Title"), content: t("legal.section5Content") },
    { title: t("legal.section6Title"), content: t("legal.section6Content") },
    { title: t("legal.section7Title"), content: t("legal.section7Content") },
    { title: t("legal.section8Title"), content: t("legal.section8Content") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("legal.backHome")}
        </Link>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-light text-primary mb-5">
            <FileText className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">
            {t("legal.title")}
          </h1>
          <p className="text-sm text-muted">
            {t("legal.lastUpdated")}
          </p>
        </div>

        <div className="bg-white border border-border/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-base font-bold text-foreground mb-2">
                {section.title}
              </h2>
              <p className="text-sm text-muted leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
