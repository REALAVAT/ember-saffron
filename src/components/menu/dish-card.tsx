"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Dish } from "@/data/types";
import { formatPrice, localize } from "@/lib/i18n-data";
import { DietaryBadges } from "./dietary-badges";

interface DishCardProps {
  dish: Dish;
  onOpen: (dish: Dish) => void;
  onQuickAdd: (dish: Dish) => void;
  priority?: boolean;
}

export function DishCard({ dish, onOpen, onQuickAdd, priority }: DishCardProps) {
  const t = useTranslations("Menu");
  const locale = useLocale();
  const name = localize(dish.name, locale);
  const hasOptions = Boolean(dish.options?.length);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-2 transition-colors duration-500 hover:border-saffron/30">
      <button
        type="button"
        onClick={() => onOpen(dish)}
        className="relative block aspect-[4/3] w-full overflow-hidden text-start"
        aria-label={`${t("customize")}: ${name}`}
        data-cursor={t("customize")}
      >
        <Image
          src={dish.image}
          alt={localize(dish.imageAlt, locale)}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 480px"
          className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          preload={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-2/90 via-transparent to-transparent" />
        <div className="absolute start-3 top-3 flex gap-1.5">
          {dish.signature && (
            <span className="rounded-full bg-ink/70 px-2.5 py-1 text-[0.68rem] font-semibold text-saffron backdrop-blur">
              {t("signature")}
            </span>
          )}
          {dish.chefPick && (
            <span className="rounded-full bg-ink/70 px-2.5 py-1 text-[0.68rem] font-semibold text-ember-soft backdrop-blur">
              {t("chefPick")}
            </span>
          )}
        </div>
      </button>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="display text-xl leading-snug text-cream">{name}</h3>
          <p className="shrink-0 pt-1 text-sm font-semibold text-saffron tabular-nums">
            {formatPrice(dish.price, locale)}
          </p>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-smoke">{localize(dish.description, locale)}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <DietaryBadges dietary={dish.dietary} />
          <button
            type="button"
            onClick={() => (hasOptions ? onOpen(dish) : onQuickAdd(dish))}
            className="ms-auto inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-saffron/40 px-4 text-sm font-semibold text-saffron transition-colors hover:bg-saffron hover:text-ink"
            aria-label={`${hasOptions ? t("customize") : t("add")}: ${name}`}
          >
            <Plus className="size-4" aria-hidden="true" />
            {hasOptions ? t("customize") : t("add")}
          </button>
        </div>
      </div>
    </article>
  );
}
