import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { ReservationForm } from "@/components/reservations/reservation-form";
import { JsonLd } from "@/components/seo/json-ld";
import { images } from "@/data/images";
import { isAppLocale, routing } from "@/i18n/routing";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/reservations">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isAppLocale(raw) ? raw : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    locale,
    path: "/reservations",
    title: t("reservationsTitle"),
    description: t("reservationsDescription"),
  });
}

export default async function ReservationsPage({ params }: PageProps<"/[locale]/reservations">) {
  const { locale: raw } = await params;
  const locale = isAppLocale(raw) ? raw : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Reservations" });
  const nav = await getTranslations({ locale, namespace: "Nav" });
  const common = await getTranslations({ locale, namespace: "Common" });

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: nav("home"), path: "" },
          { name: nav("reservations"), path: "/reservations" },
        ])}
      />
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} image={images.reservationsHero} />
      <section className="container-x pt-8 pb-28 sm:pt-12">
        <p className="mb-10 inline-flex rounded-full border border-saffron/25 bg-saffron/5 px-4 py-2 text-xs text-saffron">
          {common("demoNotice")}
        </p>
        <ReservationForm />
      </section>
    </>
  );
}
