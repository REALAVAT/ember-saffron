"use client";

import { AnimatePresence, m } from "framer-motion";
import { LayoutGrid, List, Plus, Search, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { CursorImagePreview } from "@/components/motion/cursor-image-preview";
import { scrollToTarget } from "@/components/providers/smooth-scroll";
import { dishes, menuCategories } from "@/data/menu";
import type { Dietary, Dish, MenuCategoryId } from "@/data/types";
import { formatPrice, localize } from "@/lib/i18n-data";
import { useCartStore } from "@/lib/stores/cart-store";
import { cn } from "@/lib/utils";
import { DietaryBadges, dietaryIcon } from "./dietary-badges";
import { DishCard } from "./dish-card";

const DishDialog = dynamic(() => import("./dish-dialog").then((m) => m.DishDialog), { ssr: false });

const filterOptions: Dietary[] = ["vegan", "vegetarian", "spicy", "gluten-free"];

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670\u0300-\u036f]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي");
}

const searchIndex = new Map(
  dishes.map((dish) => [
    dish.id,
    normalize(
      [dish.name.en, dish.name.ar, dish.description.en, dish.description.ar].join(" "),
    ),
  ]),
);

export function MenuExplorer() {
  const t = useTranslations("Menu");
  const td = useTranslations("Dish");
  const tdiet = useTranslations("Dietary");
  const locale = useLocale();
  const add = useCartStore((s) => s.add);

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [filters, setFilters] = useState<Dietary[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [active, setActive] = useState<MenuCategoryId>(menuCategories[0].id);
  const [selected, setSelected] = useState<Dish | null>(null);
  const [dialogRequested, setDialogRequested] = useState(false);
  if (selected && !dialogRequested) setDialogRequested(true);
  const [preview, setPreview] = useState<Dish | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLElement>(null);

  const filtered = useMemo(() => {
    const q = normalize(deferredQuery.trim());
    return dishes.filter((dish) => {
      if (filters.length && !filters.every((f) => dish.dietary.includes(f))) return false;
      if (q && !searchIndex.get(dish.id)?.includes(q)) return false;
      return true;
    });
  }, [deferredQuery, filters]);

  const grouped = useMemo(
    () =>
      menuCategories
        .map((category) => ({
          category,
          items: filtered.filter((dish) => dish.category === category.id),
        }))
        .filter((group) => group.items.length > 0),
    [filtered],
  );

  useEffect(() => {
    const sections = menuCategories
      .map((c) => document.getElementById(`cat-${c.id}`))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          const id = visible[0].target.id.replace("cat-", "") as MenuCategoryId;
          setActive(id);
        }
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [grouped]);

  useEffect(() => {
    const tab = tabsRef.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    tab?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  function jumpTo(id: MenuCategoryId) {
    const target = document.getElementById(`cat-${id}`);
    if (!target) return;
    const headerHeight = 72;
    const barHeight = barRef.current?.offsetHeight ?? 0;
    scrollToTarget(target, -(headerHeight + barHeight + 16));
    setActive(id);
  }

  function quickAdd(dish: Dish) {
    add(dish.id, 1, {});
    toast.success(td("added", { name: localize(dish.name, locale) }));
  }

  function toggleFilter(filter: Dietary) {
    setFilters((current) =>
      current.includes(filter) ? current.filter((f) => f !== filter) : [...current, filter],
    );
  }

  const hasCriteria = filters.length > 0 || query.length > 0;

  return (
    <div className="relative">
      <div
        ref={barRef}
        className="sticky top-[var(--header-height)] z-30 border-y border-white/[0.06] bg-ink/85 backdrop-blur-xl"
      >
        <div className="container-x flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
          <nav
            ref={tabsRef}
            aria-label={t("categories")}
            className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 sm:mx-0 sm:px-0"
          >
            {menuCategories.map((category) => {
              const enabled = grouped.some((g) => g.category.id === category.id);
              const isActive = active === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  aria-current={isActive ? "true" : undefined}
                  data-tab={category.id}
                  disabled={!enabled}
                  onClick={() => jumpTo(category.id)}
                  className={cn(
                    "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-35",
                    isActive ? "text-ink" : "text-cream/75 hover:text-cream",
                  )}
                >
                  {isActive && (
                    <m.span
                      layoutId="menu-tab"
                      className="absolute inset-0 -z-0 rounded-full bg-saffron"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">{localize(category.name, locale)}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-0 flex-1 sm:w-64 sm:flex-none">
              <label htmlFor="menu-search" className="sr-only">
                {t("searchLabel")}
              </label>
              <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-smoke" aria-hidden="true" />
              <input
                id="menu-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("searchPlaceholder")}
                className="h-10 w-full rounded-full border border-white/10 bg-white/[0.04] ps-10 pe-9 text-sm text-cream placeholder:text-smoke focus:border-saffron/60 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute end-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-smoke hover:text-cream"
                  aria-label={t("clearFilters")}
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
            <div className="flex rounded-full border border-white/10 p-0.5" role="group" aria-label={`${t("viewGrid")} / ${t("viewList")}`}>
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-pressed={view === "grid"}
                aria-label={t("viewGrid")}
                className={cn("grid size-9 place-items-center rounded-full transition-colors", view === "grid" ? "bg-white/10 text-saffron" : "text-smoke hover:text-cream")}
              >
                <LayoutGrid className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                aria-pressed={view === "list"}
                aria-label={t("viewList")}
                className={cn("grid size-9 place-items-center rounded-full transition-colors", view === "list" ? "bg-white/10 text-saffron" : "text-smoke hover:text-cream")}
              >
                <List className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x pt-8">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t("filters")}>
          {filterOptions.map((filter) => {
            const Icon = dietaryIcon[filter];
            const on = filters.includes(filter);
            return (
              <button
                key={filter}
                type="button"
                aria-pressed={on}
                onClick={() => toggleFilter(filter)}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full border px-4 text-sm transition-colors",
                  on
                    ? "border-saffron bg-saffron/10 text-saffron"
                    : "border-white/10 text-cream/80 hover:border-white/25",
                )}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {tdiet(filter)}
              </button>
            );
          })}
          {hasCriteria && (
            <button
              type="button"
              onClick={() => {
                setFilters([]);
                setQuery("");
              }}
              className="h-9 px-3 text-sm text-smoke underline-offset-4 hover:text-cream hover:underline"
            >
              {t("clearFilters")}
            </button>
          )}
          <p className="ms-auto text-sm text-smoke" aria-live="polite">
            {t("results", { count: filtered.length })}
          </p>
        </div>
      </div>

      <div className="container-x pb-24">
        {grouped.length === 0 && (
          <p className="py-24 text-center text-smoke">{t("empty")}</p>
        )}
        {grouped.map(({ category, items }, groupIndex) => (
          <section
            key={category.id}
            id={`cat-${category.id}`}
            aria-labelledby={`cat-${category.id}-title`}
            className="scroll-mt-48 pt-14"
          >
            <div className="mb-8 flex items-end justify-between gap-6 border-b border-white/[0.06] pb-5">
              <div>
                <p className="eyebrow">{localize(category.tagline, locale)}</p>
                <h2 id={`cat-${category.id}-title`} className="display mt-3 text-4xl text-cream sm:text-5xl">
                  {localize(category.name, locale)}
                </h2>
              </div>
              <span
                aria-hidden="true"
                data-index={String(menuCategories.findIndex((c) => c.id === category.id) + 1).padStart(2, "0")}
                className="display text-5xl text-white/[0.07] tabular-nums before:content-[attr(data-index)] sm:text-7xl"
              />
            </div>

            {view === "grid" ? (
              <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence initial={false} mode="popLayout">
                  {items.map((dish, index) => (
                    <m.li
                      key={dish.id}
                      layout
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.04 }}
                    >
                      <DishCard
                        dish={dish}
                        onOpen={setSelected}
                        onQuickAdd={quickAdd}
                        priority={groupIndex === 0 && index < 3}
                      />
                    </m.li>
                  ))}
                </AnimatePresence>
              </ul>
            ) : (
              <ul className="divide-y divide-white/[0.06]" onPointerLeave={() => setPreview(null)}>
                {items.map((dish) => {
                  const name = localize(dish.name, locale);
                  return (
                    <li
                      key={dish.id}
                      onPointerEnter={() => setPreview(dish)}
                      className="group flex items-center gap-4 py-5"
                    >
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl md:hidden">
                        <Image src={dish.image} alt="" fill sizes="64px" className="object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelected(dish)}
                        className="min-w-0 flex-1 text-start"
                        data-cursor={t("customize")}
                      >
                        <span className="flex items-baseline gap-3">
                          <span className="display text-xl text-cream transition-colors group-hover:text-saffron sm:text-2xl">
                            {name}
                          </span>
                          <span aria-hidden="true" className="hidden flex-1 translate-y-[-0.3em] border-b border-dotted border-white/15 sm:block" />
                          <span className="shrink-0 text-sm font-semibold text-saffron tabular-nums">
                            {formatPrice(dish.price, locale)}
                          </span>
                        </span>
                        <span className="mt-1 line-clamp-2 block max-w-2xl text-sm text-smoke">
                          {localize(dish.description, locale)}
                        </span>
                        <DietaryBadges dietary={dish.dietary} className="mt-2" />
                      </button>
                      <button
                        type="button"
                        onClick={() => (dish.options?.length ? setSelected(dish) : quickAdd(dish))}
                        className="grid size-10 shrink-0 place-items-center rounded-full border border-saffron/40 text-saffron transition-colors hover:bg-saffron hover:text-ink"
                        aria-label={`${t("add")}: ${name}`}
                      >
                        <Plus className="size-4" aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ))}
      </div>

      {view === "list" && (
        <CursorImagePreview image={preview ? { src: preview.image, key: preview.id } : null} />
      )}
      {dialogRequested && <DishDialog dish={selected} onOpenChange={(open) => !open && setSelected(null)} />}
    </div>
  );
}
