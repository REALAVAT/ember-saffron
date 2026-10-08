"use client";

import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}

export function QuantityStepper({ value, onChange, min = 0, max = 20, size = "sm", label }: QuantityStepperProps) {
  const t = useTranslations("Dish");
  const btn = cn(
    "grid place-items-center rounded-full text-cream transition-colors hover:bg-white/10 disabled:opacity-40",
    size === "sm" ? "size-8" : "size-10",
  );

  return (
    <div
      role="group"
      aria-label={label ?? t("quantity")}
      className={cn(
        "inline-flex items-center rounded-full border border-cream/15 bg-white/[0.03]",
        size === "sm" ? "h-9 px-0.5" : "h-12 px-1",
      )}
    >
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={t("decrease")}
      >
        <Minus className="size-3.5" aria-hidden="true" />
      </button>
      <output aria-live="polite" className={cn("text-center font-semibold tabular-nums", size === "sm" ? "w-7 text-sm" : "w-9")}>
        {value}
      </output>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={t("increase")}
      >
        <Plus className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
