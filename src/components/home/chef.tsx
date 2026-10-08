import { ArrowRight, Quote } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { RevealText } from "@/components/motion/reveal-text";
import { cta } from "@/components/ui/cta";
import { chef } from "@/data/content";
import { Link } from "@/i18n/navigation";
import { localize } from "@/lib/i18n-data";

export function Chef() {
  const t = useTranslations("Chef");
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -end-40 size-[36rem] rounded-full bg-ember/10 blur-[140px]"
      />
      <div className="container-x grid items-center gap-14 lg:grid-cols-12">
        <div className="relative lg:col-span-5">
          <ParallaxImage
            src={chef.image}
            alt={localize(chef.name, locale)}
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="aspect-[3/4] rounded-[2rem]"
            strength={16}
          />
          <div className="absolute -end-4 -bottom-6 rounded-2xl border border-white/10 bg-ink/80 px-6 py-4 backdrop-blur-xl sm:-end-8">
            <p className="display text-xl text-cream">{localize(chef.name, locale)}</p>
            <p className="text-sm text-saffron">{localize(chef.role, locale)}</p>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="eyebrow">{t("eyebrow")}</p>
          </Reveal>
          <Quote className="mt-8 size-10 text-saffron/60 rtl:-scale-x-100" aria-hidden="true" />
          <figure>
            <blockquote>
              <RevealText
                as="p"
                text={t("quote")}
                className="display mt-4 text-3xl leading-[1.2] text-cream italic sm:text-4xl lg:text-5xl rtl:not-italic"
              />
            </blockquote>
            <figcaption className="mt-8 font-[family-name:var(--font-fraunces)] text-4xl text-saffron italic" dir="ltr">
              {chef.signature}
            </figcaption>
          </figure>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-smoke">{t("bio")}</p>
            <Link href="/private-events" className={cta({ variant: "outline", size: "lg", className: "mt-10" })}>
              {t("cta")}
              <ArrowRight className="rtl:rotate-180" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
