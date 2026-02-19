"use client";

import { useState, useEffect } from "react";

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  currency?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}

export function CurrencyInput({
  label,
  value,
  onChange,
  currency,
  suffix,
  min = 0,
  max,
  step = 1,
  hint,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(value === 0 ? "" : String(value));
  const [focused, setFocused] = useState(false);

  // Sync from parent when not focused
  useEffect(() => {
    if (!focused) {
      setDisplayValue(value === 0 ? "" : String(value));
    }
  }, [value, focused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Allow empty, digits, decimal point, and minus
    if (raw === "" || raw === "-" || raw === ".") {
      setDisplayValue(raw);
      if (raw === "") onChange(0);
      return;
    }

    // Validate as number
    const num = Number(raw);
    if (!isNaN(num)) {
      setDisplayValue(raw);
      onChange(num);
    }
  };

  const handleBlur = () => {
    setFocused(false);
    // Normalize display on blur
    const num = Number(displayValue);
    if (isNaN(num) || displayValue === "" || displayValue === "-" || displayValue === ".") {
      setDisplayValue("");
      onChange(0);
    } else {
      setDisplayValue(num === 0 ? "" : String(num));
    }
  };

  return (
    <div>
      <label className="block text-xs font-medium text-muted mb-1.5">
        {label}
      </label>
      <div className="relative group">
        {currency && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted/70 bg-surface px-1.5 py-0.5 rounded">
            {currency}
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          className={`w-full border border-border/60 rounded-xl py-2.5 text-sm bg-white hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
            currency ? "pl-14 pr-3" : suffix ? "pl-3 pr-12" : "px-3"
          }`}
          placeholder="0"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted/70 bg-surface px-1.5 py-0.5 rounded">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-[11px] text-muted/70 mt-1">{hint}</p>}
    </div>
  );
}
