import type { Dish } from "@/data/types";
import type { Selections } from "./pricing";
import { localize } from "./i18n-data";

export function describeSelectionsPlain(dish: Dish, selections: Selections, locale: string) {
  const parts: string[] = [];
  for (const group of dish.options ?? []) {
    for (const choice of group.choices) {
      if (selections[group.id]?.includes(choice.id)) parts.push(localize(choice.name, locale));
    }
  }
  return parts.join(" · ");
}
