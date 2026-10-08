"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-[0.95rem] text-cream placeholder:text-smoke/80 transition-colors focus:border-saffron/70 focus:bg-white/[0.05] focus:outline-none aria-[invalid=true]:border-ember/70";

export const textareaClass = cn(inputClass, "h-auto min-h-28 py-3 leading-relaxed");

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Label + control + translated error. The error key comes from the zod schema. */
export function Field({ id, label, error, hint, className, children }: FieldProps) {
  const t = useTranslations("Errors");
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-medium text-cream/90">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-smoke">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-ember-soft">
          {t.has(error) ? t(error) : t("required")}
        </p>
      )}
    </div>
  );
}

export function fieldA11y(id: string, error?: string) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  } as const;
}
