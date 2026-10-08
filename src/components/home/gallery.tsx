"use client";

import { Expand } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { RevealText } from "@/components/motion/reveal-text";
import { gallery } from "@/data/content";
import { localize } from "@/lib/i18n-data";

const GalleryLightbox = dynamic(() => import("./gallery-lightbox").then((m) => m.GalleryLightbox), {
  ssr: false,
});

export function Gallery() {
  const t = useTranslations("Gallery");
  const locale = useLocale();
  const rtl = locale === "ar";
  const [index, setIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const [requested, setRequested] = useState(false);
  const total = gallery.length;

  if (index !== null && !requested) setRequested(true);

  const go = useCallback(
    (step: number) => {
      setDirection(step);
      setIndex((current) => (current === null ? current : (current + step + total) % total));
    },
    [total],
  );
  const close = useCallback(() => setIndex(null), []);

  return (
    <section className="py-24 sm:py-32">
      <div className="container-x">
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <p className="eyebrow">{t("eyebrow")}</p>
          </Reveal>
          <RevealText text={t("title")} className="display mt-5 text-4xl text-cream sm:text-6xl" />
        </div>

        <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5">
          {gallery.map((image, i) => {
            const alt = localize(image.alt, locale);
            return (
              <li key={image.src} className="break-inside-avoid">
                <Reveal delay={(i % 3) * 0.08}>
                  <button
                    type="button"
                    onClick={() => {
                      setDirection(1);
                      setIndex(i);
                    }}
                    className="group relative block w-full overflow-hidden rounded-2xl"
                    aria-label={t("open", { alt })}
                    data-cursor={rtl ? "عرض" : "View"}
                  >
                    <span className="relative block w-full" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
                      <Image
                        src={image.src}
                        alt={alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      />
                    </span>
                    <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/30" />
                    <span className="absolute end-4 bottom-4 grid size-10 place-items-center rounded-full bg-ink/60 text-cream opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                      <Expand className="size-4" aria-hidden="true" />
                    </span>
                  </button>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>

      {requested && <GalleryLightbox index={index} direction={direction} onClose={close} onStep={go} />}
    </section>
  );
}
