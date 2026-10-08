"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("Language");
  const locale = useLocale();
  const pathname = usePathname();
  const target = locale === "en" ? "ar" : "en";

  return (
    <Link
      href={pathname}
      locale={target}
      scroll={false}
      aria-label={t("switchToLabel")}
      hrefLang={target}
      lang={target}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full border border-cream/15 px-3.5 text-sm font-medium text-cream/90 transition-colors hover:border-saffron/60 hover:text-saffron",
        className,
      )}
    >
      <Globe className="size-4" aria-hidden="true" />
      <span className={target === "ar" ? "font-[family-name:var(--font-kufi)]" : "font-[family-name:var(--font-manrope)]"}>
        {t("switchTo")}
      </span>
    </Link>
  );
}
