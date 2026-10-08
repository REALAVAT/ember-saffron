import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { absoluteUrl, languageAlternates, localizedPath } from "@/lib/seo";

const pages = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/menu", priority: 0.9, changeFrequency: "weekly" },
  { path: "/reservations", priority: 0.8, changeFrequency: "monthly" },
  { path: "/private-events", priority: 0.7, changeFrequency: "monthly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(localizedPath(locale, page.path)),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages: languageAlternates(page.path) },
    })),
  );
}
