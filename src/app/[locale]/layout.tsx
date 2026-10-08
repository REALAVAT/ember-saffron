import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { isAppLocale, localeDirection, routing } from "@/i18n/routing";
import { AppProviders } from "@/components/providers/app-providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { DeferredUi } from "@/components/layout/deferred-ui";
import { localize } from "@/lib/i18n-data";
import { fraunces, frauncesItalic, kufi, manrope } from "../fonts";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0b0908",
  colorScheme: "dark",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("homeTitle"),
      template: `%s — ${siteConfig.name}`,
    },
    description: localize(siteConfig.description, locale),
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    creator: siteConfig.author.name,
    category: "restaurant",
    formatDetection: { telephone: false },
    openGraph: {
      siteName: siteConfig.name,
      type: "website",
      locale: locale === "ar" ? "ar_AE" : "en_AE",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  const dir = localeDirection[locale];
  const t = await getTranslations({ locale, namespace: "Nav" });

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fraunces.variable} ${frauncesItalic.variable} ${manrope.variable} ${kufi.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh overflow-x-clip">
        <NextIntlClientProvider>
          <AppProviders dir={dir}>
            <a
              href="#main"
              className="fixed start-4 top-4 z-[60] -translate-y-24 rounded-full bg-saffron px-5 py-3 text-sm font-semibold text-ink transition-transform focus:translate-y-0"
            >
              {t("skipToContent")}
            </a>
            <SiteHeader />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <SiteFooter />
            <WhatsAppButton />
            <DeferredUi />
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
