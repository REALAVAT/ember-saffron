import { Car, Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/reveal";
import { cta } from "@/components/ui/cta";
import { siteConfig } from "@/config/site";
import { localize } from "@/lib/i18n-data";
import { MapEmbed } from "./map-embed";

export function Visit() {
  const t = useTranslations("Visit");
  const locale = useLocale();
  const { address, hours, contact } = siteConfig;

  return (
    <section id="visit" className="border-t border-white/[0.06] bg-ink-2 py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 className="display mt-5 text-4xl text-cream sm:text-5xl">{t("title")}</h2>
          </Reveal>

          <div className="mt-12 space-y-10">
            <Reveal delay={0.05} className="flex gap-4">
              <MapPin className="mt-1 size-5 shrink-0 text-saffron" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-semibold text-cream">{t("address")}</h3>
                <address className="mt-2 text-sm leading-relaxed text-smoke not-italic">
                  {localize(address.street, locale)}
                  <br />
                  {localize(address.city, locale)}, {localize(address.country, locale)}
                </address>
                <p className="mt-2 flex items-center gap-2 text-xs text-smoke">
                  <Car className="size-3.5" aria-hidden="true" /> {t("parking")}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="flex gap-4">
              <Clock className="mt-1 size-5 shrink-0 text-saffron" aria-hidden="true" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-cream">{t("hours")}</h3>
                <dl className="mt-2 space-y-1.5 text-sm">
                  {hours.map((slot) => (
                    <div key={slot.opens + slot.closes} className="flex justify-between gap-6 border-b border-dashed border-white/10 pb-1.5">
                      <dt className="text-smoke">{localize(slot.days, locale)}</dt>
                      <dd className="text-cream tabular-nums" dir="ltr">
                        {slot.opens} – {slot.closes}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <Reveal delay={0.15} className="flex gap-4">
              <Phone className="mt-1 size-5 shrink-0 text-saffron" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-semibold text-cream">{t("contact")}</h3>
                <p className="mt-2 text-sm">
                  <a href={contact.phoneHref} className="text-smoke hover:text-saffron" dir="ltr">
                    {contact.phone}
                  </a>
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm">
                  <Mail className="size-3.5 text-smoke" aria-hidden="true" />
                  <a href={`mailto:${contact.email}`} className="text-smoke hover:text-saffron">
                    {contact.email}
                  </a>
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <a href={address.mapsUrl} target="_blank" rel="noopener noreferrer" className={cta({ variant: "outline" })}>
                <Navigation aria-hidden="true" />
                {t("directions")}
              </a>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.1} className="relative min-h-[22rem] overflow-hidden rounded-[2rem] border border-white/[0.08] lg:col-span-7 lg:min-h-[34rem]">
          <MapEmbed />
        </Reveal>
      </div>
    </section>
  );
}
