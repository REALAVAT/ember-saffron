"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { reviews } from "@/data/content";
import { localize } from "@/lib/i18n-data";
import { cn } from "@/lib/utils";

export function Reviews() {
  const t = useTranslations("Reviews");
  const tc = useTranslations("Common");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const review = reviews[index];

  useEffect(() => {
    if (paused || reduce) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % reviews.length), 7000);
    return () => window.clearTimeout(timer);
  }, [index, paused, reduce]);

  const go = (step: number) => setIndex((i) => (i + step + reviews.length) % reviews.length);

  return (
    <section
      className="relative overflow-hidden border-y border-white/[0.06] bg-ink-2 py-24 sm:py-32"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        aria-hidden="true"
        className="display pointer-events-none absolute -top-24 start-1/2 -translate-x-1/2 text-[28rem] leading-none text-white/[0.025] rtl:translate-x-1/2"
      >
        &ldquo;
      </div>
      <div className="container-x relative">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <p className="eyebrow">{t("eyebrow")}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display mt-5 text-4xl text-cream sm:text-5xl">{t("title")}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 flex items-center gap-2 text-sm text-smoke">
              <span className="flex text-saffron" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </span>
              {t("summary")}
            </p>
          </Reveal>
        </div>

        <div className="mx-auto mt-14 grid min-h-[17rem] max-w-4xl place-items-center sm:min-h-[15rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <m.figure
              key={review.id}
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="flex justify-center gap-1 text-saffron" role="img" aria-label={t("rating", { rating: review.rating })}>
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="display mt-6 text-2xl leading-snug text-cream sm:text-3xl lg:text-4xl">
                &ldquo;{localize(review.quote, locale)}&rdquo;
              </blockquote>
              <figcaption className="mt-8 text-sm">
                <span className="font-semibold text-cream">{review.author}</span>
                <span className="text-smoke"> · {review.source}</span>
              </figcaption>
            </m.figure>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={tc("previous")}
            className="grid size-11 place-items-center rounded-full border border-white/15 text-cream transition-colors hover:border-saffron hover:text-saffron"
          >
            <ChevronLeft className="size-5 rtl:rotate-180" aria-hidden="true" />
          </button>
          <div className="flex gap-2">
            {reviews.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${i + 1} / ${reviews.length}`}
                aria-current={i === index ? "true" : undefined}
                className="group grid h-6 place-items-center"
              >
                <span
                  className={cn(
                    "block h-1 rounded-full transition-all duration-500",
                    i === index ? "w-10 bg-saffron" : "w-4 bg-white/20 group-hover:bg-white/40",
                  )}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={tc("next")}
            className="grid size-11 place-items-center rounded-full border border-white/15 text-cream transition-colors hover:border-saffron hover:text-saffron"
          >
            <ChevronRight className="size-5 rtl:rotate-180" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
