import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { routing, type AppLocale } from "@/i18n/routing";

export function absoluteUrl(path = "") {
  return `${siteConfig.url}${path}`;
}

export function localizedPath(locale: string, path = "") {
  return `/${locale}${path === "/" ? "" : path}`;
}

export function languageAlternates(path = "") {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale === "ar" ? "ar-AE" : "en-AE"] = absoluteUrl(localizedPath(locale, path));
  }
  languages["x-default"] = absoluteUrl(localizedPath(routing.defaultLocale, path));
  return languages;
}

interface PageMetadataInput {
  locale: AppLocale;
  path: string;
  title: string;
  description: string;
  /** Use the title as-is without the brand template. */
  absoluteTitle?: boolean;
  noIndex?: boolean;
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle,
  noIndex,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(localizedPath(locale, path));
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      url,
      title: absoluteTitle ? title : `${title} — ${siteConfig.name}`,
      description,
      siteName: siteConfig.name,
      locale: locale === "ar" ? "ar_AE" : "en_AE",
      alternateLocale: locale === "ar" ? ["en_AE"] : ["ar_AE"],
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle ? title : `${title} — ${siteConfig.name}`,
      description,
    },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}
