import { Flame, Leaf, Sprout, WheatOff } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Dietary } from "@/data/types";
import { cn } from "@/lib/utils";

export const dietaryIcon = {
  vegan: Leaf,
  vegetarian: Sprout,
  spicy: Flame,
  "gluten-free": WheatOff,
} satisfies Record<Dietary, typeof Leaf>;

export function DietaryBadges({ dietary, className }: { dietary: Dietary[]; className?: string }) {
  const t = useTranslations("Dietary");
  if (dietary.length === 0) return null;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {dietary.map((item) => {
        const Icon = dietaryIcon[item];
        return (
          <li
            key={item}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.7rem] font-medium",
              item === "spicy"
                ? "border-ember/40 text-ember-soft"
                : "border-emerald-400/30 text-emerald-300",
            )}
          >
            <Icon className="size-3" aria-hidden="true" />
            {t(item)}
          </li>
        );
      })}
    </ul>
  );
}
