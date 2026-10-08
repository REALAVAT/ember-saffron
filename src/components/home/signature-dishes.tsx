"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { CursorImagePreview } from "@/components/motion/cursor-image-preview";
import { Reveal } from "@/components/motion/reveal";
import { RevealText } from "@/components/motion/reveal-text";
import { cta } from "@/components/ui/cta";
import { menuCategories, signatureDishes } from "@/data/menu";
import type { Dish } from "@/data/types";
import { Link } from "@/i18n/navigation";
import { formatPrice, localize } from "@/lib/i18n-data";

export function SignatureDishes() {
  const t = useTranslations("Signature");
  const locale = useLocale();
  const [hovered, setHovered] = useState<Dish | null>(null);

  return (
    <section className="relative border-t border-white/[0.06] bg-ink-2 py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="eyebrow">{t("eyebrow")}</p>
            </Reveal>
            <RevealText text={t("title")} className="display mt-5 text-4xl text-cream sm:text-6xl" />
          </div>
          <Reveal delay={0.1}>
            <p className="hidden text-sm text-smoke md:block">{t("hint")}</p>
          </Reveal>
        </div>

        <ul className="mt-14 border-t border-white/[0.08]" onPointerLeave={() => setHovered(null)}>
          {signatureDishes.map((dish, index) => {
            const category = menuCategories.find((c) => c.id === dish.category);
            return (
              <li key={dish.id} onPointerEnter={() => setHovered(dish)}>
                <Reveal delay={index * 0.05} y={20}>
                  <Link
                    href="/menu"
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-white/[0.08] py-6 transition-colors sm:gap-8 sm:py-8"
                    data-cursor={locale === "ar" ? "اطلب" : "Order"}
                  >
                    <span className="w-8 text-sm text-smoke tabular-nums sm:w-12" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex min-w-0 items-center gap-4">
                      <span className="relative size-16 shrink-0 overflow-hidden rounded-xl md:hidden">
                        <Image src={dish.image} alt="" fill sizes="64px" className="object-cover" />
                      </span>
                      <span className="min-w-0">
                        <span className="display block truncate text-2xl text-cream transition-all duration-500 group-hover:text-saffron sm:text-4xl lg:text-6xl lg:group-hover:translate-x-4 lg:rtl:group-hover:-translate-x-4">
                          {localize(dish.name, locale)}
                        </span>
                        <span className="mt-1 block truncate text-sm text-smoke">
                          {category ? localize(category.name, locale) : ""} · {localize(dish.description, locale)}
                        </span>
                      </span>
                    </span>
                    <span className="flex items-center gap-4">
                      <span className="hidden text-base font-semibold text-saffron tabular-nums sm:block">
                        {formatPrice(dish.price, locale)}
                      </span>
                      <span className="grid size-11 place-items-center rounded-full border border-white/15 text-cream transition-all duration-500 group-hover:rotate-45 group-hover:border-saffron group-hover:bg-saffron group-hover:text-ink rtl:-scale-x-100">
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal className="mt-12 flex justify-center">
          <Link href="/menu" className={cta({ variant: "outline", size: "lg" })}>
            {t("cta")}
            <ArrowRight className="rtl:rotate-180" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
      <CursorImagePreview image={hovered ? { src: hovered.image, key: hovered.id } : null} />
    </section>
  );
}
