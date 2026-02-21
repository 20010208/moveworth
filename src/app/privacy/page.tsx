"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function PrivacyPage() {
  const { t } = useTranslation();

  const sections = [
    { title: t("privacy.section1Title"), content: t("privacy.section1Content") },
    { title: t("privacy.section2Title"), content: t("privacy.section2Content") },
    { title: t("privacy.section3Title"), content: t("privacy.section3Content") },
    { title: t("privacy.section4Title"), content: t("privacy.section4Content") },
    { title: t("privacy.section5Title"), content: t("privacy.section5Content") },
    { title: t("privacy.section6Title"), content: t("privacy.section6Content") },
    { title: t("privacy.section7Title"), content: t("privacy.section7Content") },
    { title: t("privacy.section8Title"), content: t("privacy.section8Content") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("privacy.backHome")}
        </Link>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-light text-primary mb-5">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">
            {t("privacy.title")}
          </h1>
          <p className="text-sm text-muted">
            {t("privacy.lastUpdated")}
          </p>
        </div>

        <div className="bg-white border border-border/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
          <p className="text-sm text-muted leading-relaxed">
            {t("privacy.intro")}
          </p>

          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-base font-bold text-foreground mb-2">
                {i + 1}. {section.title}
              </h2>
              <p className="text-sm text-muted leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}

          <div className="border-t border-border/40 pt-6">
            <h2 className="text-base font-bold text-foreground mb-2">
              {t("privacy.contactTitle")}
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              {t("privacy.contactContent")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
