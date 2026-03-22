"use client";

import Link from "next/link";
import { ArrowLeft, Globe, Users, Zap, Heart } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("about.backHome")}
        </Link>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-light text-primary mb-5">
            <Globe className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">
            {t("about.title")}
          </h1>
          <p className="text-muted text-lg">
            {t("about.subtitle")}
          </p>
        </div>

        <div className="space-y-6">
          {/* Mission */}
          <div className="bg-white border border-border/60 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary-light text-primary">
                <Heart className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-foreground">{t("about.missionTitle")}</h2>
            </div>
            <p className="text-sm text-muted leading-relaxed">{t("about.missionContent")}</p>
          </div>

          {/* Service */}
          <div className="bg-white border border-border/60 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary-light text-primary">
                <Zap className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-foreground">{t("about.serviceTitle")}</h2>
            </div>
            <p className="text-sm text-muted leading-relaxed">{t("about.serviceContent")}</p>
            <div className="mt-4">
              <Link
                href="https://study.moveworthapp.com"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
              >
                {t("about.studyLink")} →
              </Link>
            </div>
          </div>

          {/* Developer */}
          <div className="bg-white border border-border/60 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary-light text-primary">
                <Users className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-foreground">{t("about.developerTitle")}</h2>
            </div>
            <p className="text-sm text-muted leading-relaxed">{t("about.developerContent")}</p>
          </div>

          {/* Contact */}
          <div className="bg-white border border-border/60 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-foreground mb-2">{t("about.contactTitle")}</h2>
            <p className="text-sm text-muted leading-relaxed mb-4">{t("about.contactContent")}</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
            >
              {t("about.contactLink")} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
