"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getDish } from "@/data/menu";
import { formatPrice, localize } from "@/lib/i18n-data";
import { describeSelectionsPlain } from "@/lib/order-text";
import { unitPrice } from "@/lib/pricing";
import { useCartStore, type CartLine } from "@/lib/stores/cart-store";
import { QuantityStepper } from "./quantity-stepper";

export function CartLineItem({ line, readOnly = false }: { line: CartLine; readOnly?: boolean }) {
  const t = useTranslations("Cart");
  const locale = useLocale();
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const dish = getDish(line.dishId);
  if (!dish) return null;

  const name = localize(dish.name, locale);
  const summary = describeSelectionsPlain(dish, line.selections, locale);
  const lineTotal = unitPrice(dish, line.selections) * line.quantity;

  return (
    <div className="flex gap-4 py-4">
      <div className="relative size-18 shrink-0 overflow-hidden rounded-xl bg-ink-3 sm:size-20">
        <Image src={dish.image} alt="" fill sizes="80px" className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="line-clamp-2 font-medium text-cream">
              {readOnly && <span className="text-saffron tabular-nums">{line.quantity}× </span>}
              {name}
            </p>
            {summary && <p className="mt-0.5 line-clamp-2 text-xs text-smoke">{summary}</p>}
          </div>
          <p className="shrink-0 text-sm font-semibold text-cream tabular-nums">{formatPrice(lineTotal, locale)}</p>
        </div>
        {!readOnly && (
          <div className="mt-auto flex items-center justify-between pt-3">
            <QuantityStepper
              value={line.quantity}
              min={1}
              onChange={(quantity) => setQuantity(line.key, quantity)}
            />
            <button
              type="button"
              onClick={() => remove(line.key)}
              className="grid size-9 place-items-center rounded-full text-smoke transition-colors hover:bg-white/5 hover:text-ember"
              aria-label={t("remove", { name })}
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
