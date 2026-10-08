import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { MenuExplorer } from "@/components/menu/menu-explorer";
import { JsonLd } from "@/components/seo/json-ld";
import { images } from "@/data/images";
import { isAppLocale, routing } from "@/i18n/routing";
import { breadcrumbJsonLd, menuJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/menu">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isAppLocale(raw) ? raw : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    locale,
    path: "/menu",
    title: t("menuTitle"),
    description: t("menuDescription"),
  });
}

export default async function MenuPage({ params }: PageProps<"/[locale]/menu">) {
  const { locale: raw } = await params;
  const locale = isAppLocale(raw) ? raw : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Menu" });
  const nav = await getTranslations({ locale, namespace: "Nav" });

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...menuJsonLd(locale) }} />
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: nav("home"), path: "" },
          { name: nav("menu"), path: "/menu" },
        ])}
      />
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} image={images.menuHero} />
      <MenuExplorer />
    </>
  );
}
