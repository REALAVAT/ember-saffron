import { siteConfig } from "@/config/site";
import { getDish } from "@/data/menu";
import type { Dish } from "@/data/types";

export type Selections = Record<string, string[]>;

export interface CartLineInput {
  dishId: string;
  quantity: number;
  selections: Selections;
}

export type Fulfilment = "delivery" | "pickup";

const round = (value: number) => Math.round(value * 100) / 100;

export function unitPrice(dish: Dish, selections: Selections) {
  let price = dish.price;
  for (const group of dish.options ?? []) {
    const chosen = selections[group.id] ?? [];
    for (const choice of group.choices) {
      if (chosen.includes(choice.id)) price += choice.price ?? 0;
    }
  }
  return round(price);
}

export function validateSelections(dish: Dish, selections: Selections) {
  for (const group of dish.options ?? []) {
    const chosen = selections[group.id] ?? [];
    const valid = chosen.every((id) => group.choices.some((c) => c.id === id));
    if (!valid) return false;
    if (group.required && chosen.length === 0) return false;
    if (group.type === "single" && chosen.length > 1) return false;
  }
  return true;
}

export function lineKey(dishId: string, selections: Selections) {
  const parts = Object.keys(selections)
    .sort()
    .map((group) => `${group}:${[...selections[group]].sort().join("+")}`)
    .filter((part) => !part.endsWith(":"));
  return [dishId, ...parts].join("|");
}

export function normalizePromo(code: string | undefined | null) {
  const normalized = (code ?? "").trim().toUpperCase();
  return normalized in siteConfig.ordering.promoCodes ? normalized : null;
}

export interface Totals {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  vat: number;
  promo: string | null;
}

export function computeTotals(
  lines: CartLineInput[],
  fulfilment: Fulfilment,
  promoCode?: string | null,
): Totals {
  const subtotal = round(
    lines.reduce((sum, line) => {
      const dish = getDish(line.dishId);
      if (!dish) return sum;
      return sum + unitPrice(dish, line.selections) * line.quantity;
    }, 0),
  );
  const promo = normalizePromo(promoCode);
  const rate = promo ? siteConfig.ordering.promoCodes[promo] : 0;
  const discount = round(subtotal * rate);
  const afterDiscount = subtotal - discount;
  const { deliveryFee: fee, freeDeliveryThreshold } = siteConfig.ordering;
  const deliveryFee =
    fulfilment === "delivery" && subtotal > 0 && afterDiscount < freeDeliveryThreshold ? fee : 0;
  const total = round(afterDiscount + deliveryFee);
  const vatRate = siteConfig.ordering.vatRate;
  const vat = round(total - total / (1 + vatRate));
  return { subtotal, discount, deliveryFee, total, vat, promo };
}
