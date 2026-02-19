"use client";

import { countryPresets } from "@/data/country-presets";
import { useTranslation } from "@/lib/i18n";

interface CountrySelectorProps {
  label: string;
  value: string;
  onChange: (code: string) => void;
}

export function CountrySelector({
  label,
  value,
  onChange,
}: CountrySelectorProps) {
  const { locale, t } = useTranslation();

  return (
    <div>
      <label className="block text-xs font-medium text-muted mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border/60 rounded-xl px-3 py-2.5 text-sm bg-white hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
      >
        <option value="">{t("input.selectCountry")}</option>
        {countryPresets.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name[locale]} ({country.currency})
          </option>
        ))}
      </select>
    </div>
  );
}
