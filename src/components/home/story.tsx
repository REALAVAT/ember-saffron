import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { RevealText } from "@/components/motion/reveal-text";
import { cta } from "@/components/ui/cta";
import { stats } from "@/data/content";
import { images } from "@/data/images";
import { Link } from "@/i18n/navigation";
import { localize } from "@/lib/i18n-data";

export function Story() {
  const t = useTranslations("Story");
  const locale = useLocale();

  return (
    <section id="story" className="relative scroll-mt-20 py-24 sm:py-32 lg:py-40">
      <div className="container-x grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="relative lg:col-span-6">
          <ParallaxImage
            src={images.storyPrimary}
            alt={locale === "ar" ? "توابل محمصة على طاولة خشبية" : "Toasted spices on a wooden table"}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-[4/5] w-[85%] rounded-[2rem]"
            strength={18}
          />
          <ParallaxImage
            src={images.storySecondary}
            alt={locale === "ar" ? "ملاعق من التوابل الملونة" : "Spoons of colourful spices"}
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="absolute end-0 -bottom-10 aspect-square w-[45%] rounded-[1.5rem] border-8 border-ink shadow-2xl"
            strength={26}
          />
          <div
            aria-hidden="true"
            className="absolute -start-6 top-10 hidden rotate-[-90deg] text-xs tracking-[0.5em] text-smoke uppercase lg:block rtl:rotate-90"
          >
            Beirut · Isfahan · Dubai
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal>
            <p className="eyebrow">{t("eyebrow")}</p>
          </Reveal>
          <RevealText
            text={t("title")}
            className="display mt-6 text-4xl leading-[1.05] text-cream sm:text-5xl lg:text-6xl"
          />
          <Reveal delay={0.15}>
            <p className="mt-8 text-base leading-relaxed text-cream/75 sm:text-lg">{t("body1")}</p>
            <p className="mt-5 text-base leading-relaxed text-smoke">{t("body2")}</p>
            <Link href="/menu" className={cta({ variant: "link", className: "mt-8 text-base" })}>
              {t("cta")}
              <ArrowRight className="rtl:rotate-180" aria-hidden="true" />
            </Link>
          </Reveal>
          <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-white/[0.08] pt-8">
            {stats.map((stat, index) => (
              <Reveal key={stat.value} delay={0.1 * index}>
                <dt className="sr-only">{localize(stat.label, locale)}</dt>
                <dd className="display text-3xl text-saffron sm:text-4xl" dir="ltr">
                  {stat.value}
                </dd>
                <dd className="mt-2 text-xs leading-snug text-smoke sm:text-sm" aria-hidden="true">
                  {localize(stat.label, locale)}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
