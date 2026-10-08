import { Heart } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { InstagramIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { cta } from "@/components/ui/cta";
import { siteConfig } from "@/config/site";
import { instagramPosts } from "@/data/content";
import { localize } from "@/lib/i18n-data";

export function InstagramGrid() {
  const t = useTranslations("Instagram");
  const locale = useLocale();
  const { instagram, instagramHandle } = siteConfig.social;

  return (
    <section className="py-24 sm:py-32">
      <div className="container-x">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Reveal>
              <p className="eyebrow">{t("eyebrow")}</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="display mt-5 text-4xl text-cream sm:text-5xl">{t("title")}</h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <a href={instagram} target="_blank" rel="noopener noreferrer" className={cta({ variant: "outline" })}>
              <InstagramIcon />
              <span dir="ltr">{t("follow", { handle: instagramHandle })}</span>
            </a>
          </Reveal>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {instagramPosts.map((post, index) => (
            <li key={post.src}>
              <Reveal delay={index * 0.06} y={24}>
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-xl"
                  aria-label={`${localize(post.alt, locale)} — Instagram`}
                >
                  <Image
                    src={post.src}
                    alt={localize(post.alt, locale)}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/0 text-sm font-semibold text-cream opacity-0 transition-all duration-500 group-hover:bg-ink/55 group-hover:opacity-100">
                    <Heart className="size-4 fill-current text-ember" aria-hidden="true" />
                    {t("likes", { count: post.likes })}
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
