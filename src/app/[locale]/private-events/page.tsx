import { Check, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { EventInquiryForm } from "@/components/events/event-inquiry-form";
import { PageHero } from "@/components/layout/page-hero";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { cta } from "@/components/ui/cta";
import { eventSpaces } from "@/data/content";
import { images } from "@/data/images";
import { isAppLocale, routing } from "@/i18n/routing";
import { localize } from "@/lib/i18n-data";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/private-events">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isAppLocale(raw) ? raw : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    locale,
    path: "/private-events",
    title: t("eventsTitle"),
    description: t("eventsDescription"),
  });
}

export default async function PrivateEventsPage({ params }: PageProps<"/[locale]/private-events">) {
  const { locale: raw } = await params;
  const locale = isAppLocale(raw) ? raw : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Events" });
  const nav = await getTranslations({ locale, namespace: "Nav" });
  const highlights = t.raw("highlights") as string[];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: nav("home"), path: "" },
          { name: nav("events"), path: "/private-events" },
        ])}
      />
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} image={images.eventsHero}>
        <a href="#enquire" className={cta({ size: "lg" })}>
          {t("formTitle")}
        </a>
      </PageHero>

      <section className="container-x py-24 sm:py-32">
        <Reveal>
          <h2 className="display text-4xl text-cream sm:text-5xl">{t("spacesTitle")}</h2>
        </Reveal>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {eventSpaces.map((space, index) => (
            <li key={space.id}>
              <Reveal delay={index * 0.1} className="group h-full overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-ink-2">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={space.image}
                    alt={localize(space.name, locale)}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                  />
                  <span className="absolute start-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1 text-xs text-cream backdrop-blur">
                    <Users className="size-3.5 text-saffron" aria-hidden="true" />
                    {localize(space.capacity, locale)}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="display text-2xl text-cream">{localize(space.name, locale)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-smoke">{localize(space.description, locale)}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-white/[0.06] bg-ink-2">
        <div className="container-x grid items-center gap-12 py-24 sm:py-32 lg:grid-cols-2">
          <ParallaxImage
            src={images.feast}
            alt={locale === "ar" ? "مائدة عامرة بالأطباق المشتركة" : "A table laden with sharing dishes"}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-[5/4] rounded-[2rem]"
          />
          <div>
            <Reveal>
              <p className="eyebrow">{t("eyebrow")}</p>
              <h2 className="display mt-5 text-4xl text-cream sm:text-5xl">{t("cateringTitle")}</h2>
              <p className="mt-6 text-base leading-relaxed text-smoke sm:text-lg">{t("cateringText")}</p>
            </Reveal>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {highlights.map((item, index) => (
                <li key={item}>
                  <Reveal
                    delay={index * 0.06}
                    className="flex h-full items-center gap-3 rounded-xl border border-white/[0.08] px-4 py-3 text-sm text-cream"
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-saffron text-ink">
                      <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                    </span>
                    {item}
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="enquire" className="container-x scroll-mt-24 py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <h2 className="display text-4xl text-cream sm:text-5xl">{t("formTitle")}</h2>
              <p className="mt-5 text-smoke">{t("formSubtitle")}</p>
            </Reveal>
          </div>
          <div className="rounded-[1.75rem] border border-white/[0.08] bg-ink-2 p-6 sm:p-10 lg:col-span-8">
            <EventInquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
