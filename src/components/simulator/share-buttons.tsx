"use client";

import { useState } from "react";
import { Share2, Link, Check, MessageCircle } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { SimulationResult } from "@/lib/simulation/types";
import { countryPresets } from "@/data/country-presets";
import { formatCurrency } from "@/lib/utils";

interface ShareButtonsProps {
  result: SimulationResult;
}

export function ShareButtons({ result }: ShareButtonsProps) {
  const { locale, t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const siteUrl = "https://moveworth-alpha.vercel.app/simulate";

  const getCountryName = (code: string) => {
    const preset = countryPresets.find((c) => c.code === code);
    return preset ? preset.name[locale as "en" | "ja"] : code;
  };

  const fromName = getCountryName(result.input.countryFrom);
  const toName = getCountryName(result.input.countryTo);
  const diff = formatCurrency(Math.abs(result.assetDifference), result.baseCurrency);
  const years = String(result.input.simulationYears);
  const sign = result.assetDifference >= 0 ? "+" : "-";

  const shareText = t("share.shareText", {
    from: fromName,
    to: toName,
    years,
    difference: `${sign}${diff}`,
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${shareText}\n${siteUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(siteUrl)}`,
      "_blank",
      "width=550,height=420"
    );
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}&quote=${encodeURIComponent(shareText)}`,
      "_blank",
      "width=550,height=420"
    );
  };

  const shareLine = () => {
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`,
      "_blank",
      "width=550,height=420"
    );
  };

  return (
    <div className="bg-white border border-border/60 rounded-2xl p-4">
      <h3 className="text-xs font-semibold text-muted flex items-center gap-1.5 mb-3">
        <Share2 className="h-3.5 w-3.5" />
        {t("share.title")}
      </h3>
      <div className="flex items-center gap-2">
        <button
          onClick={shareX}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#0f1419] text-white hover:bg-[#0f1419]/80 transition-all text-xs font-bold"
          title="X (Twitter)"
        >
          𝕏
        </button>
        <button
          onClick={shareFacebook}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#1877f2] text-white hover:bg-[#1877f2]/80 transition-all text-xs font-bold"
          title="Facebook"
        >
          f
        </button>
        <button
          onClick={shareLine}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#06c755] text-white hover:bg-[#06c755]/80 transition-all"
          title="LINE"
        >
          <MessageCircle className="h-4 w-4" />
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-border/60 text-sm text-muted hover:text-foreground hover:border-primary/40 transition-all"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-accent" />
              <span className="text-accent text-xs">{t("share.copied")}</span>
            </>
          ) : (
            <>
              <Link className="h-3.5 w-3.5" />
              <span className="text-xs">{t("share.copyLink")}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
