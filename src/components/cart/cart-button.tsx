"use client";

import { AnimatePresence, m } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { selectItemCount, useCartStore } from "@/lib/stores/cart-store";
import { cn } from "@/lib/utils";

export function CartButton({ className }: { className?: string }) {
  const t = useTranslations("Cart");
  const count = useCartStore(selectItemCount);
  const hydrated = useCartStore((s) => s.hydrated);
  const open = useCartStore((s) => s.open);
  const visibleCount = hydrated ? count : 0;

  return (
    <button
      type="button"
      onClick={open}
      aria-label={`${t("open")} — ${t("itemCount", { count: visibleCount })}`}
      className={cn(
        "relative inline-flex size-10 items-center justify-center rounded-full border border-cream/15 text-cream transition-colors hover:border-saffron/60 hover:text-saffron",
        className,
      )}
    >
      <ShoppingBag className="size-[1.1rem]" aria-hidden="true" />
      <AnimatePresence>
        {visibleCount > 0 && (
          <m.span
            key={visibleCount}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="absolute -top-1 -end-1 grid min-w-5 place-items-center rounded-full bg-ember px-1 text-[0.68rem] leading-5 font-bold text-ink"
            aria-hidden="true"
          >
            {visibleCount}
          </m.span>
        )}
      </AnimatePresence>
    </button>
  );
}
