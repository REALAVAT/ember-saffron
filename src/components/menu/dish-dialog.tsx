"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cta } from "@/components/ui/cta";
import type { Dish } from "@/data/types";
import { formatPrice, localize } from "@/lib/i18n-data";
import { unitPrice, validateSelections, type Selections } from "@/lib/pricing";
import { useCartStore } from "@/lib/stores/cart-store";
import { cn } from "@/lib/utils";
import { DietaryBadges } from "./dietary-badges";

function defaultSelections(dish: Dish): Selections {
  const selections: Selections = {};
  for (const group of dish.options ?? []) {
    selections[group.id] = group.type === "single" && group.required ? [group.choices[0].id] : [];
  }
  return selections;
}

interface DishDialogProps {
  dish: Dish | null;
  onOpenChange: (open: boolean) => void;
}

export function DishDialog({ dish, onOpenChange }: DishDialogProps) {
  const tc = useTranslations("Common");
  return (
    <Dialog open={Boolean(dish)} onOpenChange={onOpenChange}>
      <DialogContent
        closeLabel={tc("close")}
        className="max-h-[92dvh] w-full gap-0 overflow-hidden border-0 bg-ink-2 p-0 text-cream ring-white/10 sm:max-w-lg"
      >
        {dish && <DishDialogBody key={dish.id} dish={dish} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function DishDialogBody({ dish, onDone }: { dish: Dish; onDone: () => void }) {
  const t = useTranslations("Dish");
  const tm = useTranslations("Menu");
  const locale = useLocale();
  const add = useCartStore((s) => s.add);
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState<Selections>(() => defaultSelections(dish));
  const price = unitPrice(dish, selections) * quantity;
  const valid = validateSelections(dish, selections);
  const name = localize(dish.name, locale);

  function toggle(groupId: string, choiceId: string, single: boolean) {
    setSelections((current) => {
      const chosen = current[groupId] ?? [];
      if (single) return { ...current, [groupId]: [choiceId] };
      return {
        ...current,
        [groupId]: chosen.includes(choiceId) ? chosen.filter((id) => id !== choiceId) : [...chosen, choiceId],
      };
    });
  }

  function onAdd() {
    if (!valid) return;
    add(dish.id, quantity, selections);
    toast.success(t("added", { name }));
    onDone();
  }

  return (
    <div className="flex max-h-[92dvh] flex-col">
      <div className="overflow-y-auto" data-lenis-prevent>
        <div className="relative aspect-[16/10] w-full">
          <Image src={dish.image} alt={localize(dish.imageAlt, locale)} fill sizes="(max-width: 640px) 100vw, 512px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-transparent" />
        </div>
        <div className="space-y-4 px-6 pt-2 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            {dish.signature && (
              <span className="rounded-full bg-saffron/15 px-2.5 py-0.5 text-[0.7rem] font-semibold text-saffron">
                {tm("signature")}
              </span>
            )}
            {dish.chefPick && (
              <span className="rounded-full bg-ember/15 px-2.5 py-0.5 text-[0.7rem] font-semibold text-ember-soft">
                {tm("chefPick")}
              </span>
            )}
          </div>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="display text-3xl leading-tight text-cream">{name}</DialogTitle>
            <span className="pt-2 font-semibold text-saffron tabular-nums">{formatPrice(dish.price, locale)}</span>
          </div>
          <DialogDescription className="text-sm leading-relaxed text-smoke">
            {localize(dish.description, locale)}
          </DialogDescription>
          <DietaryBadges dietary={dish.dietary} />

          {dish.options?.map((group) => {
            const single = group.type === "single";
            return (
              <fieldset key={group.id} className="space-y-2 pt-2">
                <legend className="flex w-full items-center justify-between pb-2 text-sm font-semibold text-cream">
                  <span>{localize(group.name, locale)}</span>
                  <span className="text-xs font-normal text-smoke">
                    {group.required ? t("required") : t("optional")} · {single ? t("chooseOne") : t("chooseAny")}
                  </span>
                </legend>
                <div className="grid gap-2">
                  {group.choices.map((choice) => {
                    const checked = selections[group.id]?.includes(choice.id) ?? false;
                    return (
                      <label
                        key={choice.id}
                        className={cn(
                          "flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-saffron",
                          checked ? "border-saffron/70 bg-saffron/[0.07]" : "border-white/10 hover:border-white/25",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type={single ? "radio" : "checkbox"}
                            name={`${dish.id}-${group.id}`}
                            checked={checked}
                            onChange={() => toggle(group.id, choice.id, single)}
                            className="sr-only"
                          />
                          <span
                            aria-hidden="true"
                            className={cn(
                              "grid size-5 place-items-center border transition-colors",
                              single ? "rounded-full" : "rounded-md",
                              checked ? "border-saffron bg-saffron text-ink" : "border-white/30",
                            )}
                          >
                            {checked && <Check className="size-3" strokeWidth={3} />}
                          </span>
                          {localize(choice.name, locale)}
                        </span>
                        {choice.price !== undefined && (
                          <span className="text-smoke tabular-nums">
                            {choice.price === 0 ? t("free") : `+${formatPrice(choice.price, locale)}`}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-3 border-t border-white/[0.06] bg-ink px-6 py-4">
        <QuantityStepper value={quantity} onChange={setQuantity} min={1} size="md" />
        <button type="button" onClick={onAdd} disabled={!valid} className={cta({ size: "lg", className: "flex-1" })}>
          {t("addFor", { count: quantity, price: formatPrice(price, locale) })}
        </button>
      </div>
    </div>
  );
}
