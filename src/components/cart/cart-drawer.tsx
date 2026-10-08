"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cta } from "@/components/ui/cta";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/i18n-data";
import { computeTotals } from "@/lib/pricing";
import { selectItemCount, useCartStore } from "@/lib/stores/cart-store";
import { CartLineItem } from "./cart-line-item";

export function CartDrawer() {
  const t = useTranslations("Cart");
  const tc = useTranslations("Common");
  const locale = useLocale();
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const lines = useCartStore((s) => s.lines);
  const count = useCartStore(selectItemCount);
  const { subtotal } = computeTotals(lines, "pickup");
  const belowMinimum = subtotal < siteConfig.ordering.minimumOrder;

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        side={locale === "ar" ? "left" : "right"}
        closeLabel={tc("close")}
        className="w-full gap-0 border-white/10 bg-ink-2 p-0 text-cream data-[side=left]:sm:max-w-md data-[side=right]:sm:max-w-md"
        data-lenis-prevent
      >
        <SheetHeader className="border-b border-white/[0.06] px-6 py-5 text-start">
          <SheetTitle className="display text-2xl text-cream">{t("title")}</SheetTitle>
          <SheetDescription className="text-smoke">{t("itemCount", { count })}</SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="grid size-20 place-items-center rounded-full border border-saffron/30 bg-saffron/5">
              <ShoppingBag className="size-8 text-saffron" aria-hidden="true" />
            </div>
            <p className="display mt-6 text-2xl">{t("empty")}</p>
            <p className="mt-2 max-w-xs text-sm text-smoke">{t("emptyText")}</p>
            <Link href="/menu" onClick={() => setOpen(false)} className={cta({ className: "mt-8" })}>
              {t("browse")}
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-white/[0.06] overflow-y-auto px-6" data-lenis-prevent>
              <AnimatePresence initial={false}>
                {lines.map((line) => (
                  <m.li
                    key={line.key}
                    layout
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <CartLineItem line={line} />
                  </m.li>
                ))}
              </AnimatePresence>
            </ul>
            <div className="border-t border-white/[0.06] bg-ink px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-smoke">{t("subtotal")}</span>
                <span className="display text-2xl text-cream tabular-nums">{formatPrice(subtotal, locale)}</span>
              </div>
              <p className="mt-1 text-xs text-smoke">{t("vatNote")}</p>
              {belowMinimum && (
                <p className="mt-2 text-xs text-ember-soft">
                  {t("minimum", { amount: formatPrice(siteConfig.ordering.minimumOrder, locale) })}
                </p>
              )}
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                aria-disabled={belowMinimum}
                tabIndex={belowMinimum ? -1 : undefined}
                className={cta({
                  size: "lg",
                  className: `mt-5 w-full ${belowMinimum ? "pointer-events-none opacity-50" : ""}`,
                })}
              >
                {t("checkout")}
                <ArrowRight className="transition-transform group-hover/cta:translate-x-1 rtl:rotate-180 rtl:group-hover/cta:-translate-x-1" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-3 w-full text-center text-sm text-smoke underline-offset-4 hover:text-cream hover:underline"
              >
                {t("continue")}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
