import type { AppLocale } from "@/i18n/routing";
import type { Localized } from "@/data/types";

export function localize(value: Localized, locale: string): string {
  return value[locale as AppLocale] ?? value.en;
}

export function formatPrice(amount: number, locale: string) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
