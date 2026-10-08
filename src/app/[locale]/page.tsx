import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Chef } from "@/components/home/chef";
import { Gallery } from "@/components/home/gallery";
import { Hero } from "@/components/home/hero";
import { InstagramGrid } from "@/components/home/instagram-grid";
import { Marquee } from "@/components/home/marquee";
import { ReserveBand } from "@/components/home/reserve-band";
import { Reviews } from "@/components/home/reviews";
import { SignatureDishes } from "@/components/home/signature-dishes";
import { Story } from "@/components/home/story";
import { Visit } from "@/components/home/visit";
import { JsonLd } from "@/components/seo/json-ld";
import { isAppLocale, routing } from "@/i18n/routing";
import { restaurantJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isAppLocale(raw) ? raw : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    locale,
    path: "/",
    title: t("homeTitle"),
    description: t("homeDescription"),
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: raw } = await params;
  const locale = isAppLocale(raw) ? raw : routing.defaultLocale;

  return (
    <>
      <JsonLd data={restaurantJsonLd(locale)} />
      <Hero />
      <Marquee />
      <Story />
      <SignatureDishes />
      <Chef />
      <Gallery />
      <Reviews />
      <ReserveBand />
      <InstagramGrid />
      <Visit />
    </>
  );
}
