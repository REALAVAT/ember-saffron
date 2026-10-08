"use client";

import { m } from "framer-motion";
import { Check, Clock, MapPin, ReceiptText, Wallet } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { cta } from "@/components/ui/cta";
import { siteConfig } from "@/config/site";
import { getDish } from "@/data/menu";
import { Link } from "@/i18n/navigation";
import { formatPrice, localize } from "@/lib/i18n-data";
import { describeSelectionsPlain } from "@/lib/order-text";
import { useCartStore } from "@/lib/stores/cart-store";
import { useOrderStore } from "@/lib/stores/order-store";
import { OrderTracker } from "./order-tracker";

export function OrderConfirmation() {
  const t = useTranslations("Confirmation");
  const tc = useTranslations("Checkout");
  const locale = useLocale();
  const hydrated = useOrderStore((s) => s.hydrated);
  const order = useOrderStore((s) => s.lastOrder);
  const clearCart = useCartStore((s) => s.clear);
  const cartHydrated = useCartStore((s) => s.hydrated);

  useEffect(() => {
    if (!cartHydrated) return;
    if (new URLSearchParams(window.location.search).has("session_id")) clearCart();
  }, [cartHydrated, clearCart]);

  if (!hydrated) {
    return <div className="h-[36rem] animate-pulse rounded-[1.75rem] bg-white/[0.03]" aria-busy="true" />;
  }

  if (!order) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
        <div className="grid size-20 place-items-center rounded-full border border-saffron/30 bg-saffron/5">
          <ReceiptText className="size-8 text-saffron" aria-hidden="true" />
        </div>
        <h1 className="display mt-6 text-3xl text-cream">{t("noOrder")}</h1>
        <p className="mt-3 text-smoke">{t("noOrderText")}</p>
        <Link href="/menu" className={cta({ size: "lg", className: "mt-8" })}>
          {t("orderAgain")}
        </Link>
      </div>
    );
  }

  const { details, totals } = order;
  const firstName = details.name.trim().split(/\s+/)[0];
  const paidWith =
    order.payment === "card"
      ? t("paidCard", { last4: order.cardLast4 ?? "••••" })
      : order.payment === "stripe"
        ? t("paidStripe")
        : t("paidCash", { mode: details.fulfilment });
  const where =
    details.fulfilment === "delivery"
      ? [details.apartment, details.building, details.area].filter(Boolean).join(", ")
      : `${localize(siteConfig.address.street, locale)}, ${localize(siteConfig.address.city, locale)}`;

  return (
    <div>
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <m.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="grid size-20 shrink-0 place-items-center rounded-full bg-gradient-to-br from-saffron to-ember shadow-[0_0_60px_-10px] shadow-ember/60"
        >
          <Check className="size-9 text-ink" strokeWidth={3} aria-hidden="true" />
        </m.div>
        <div>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 className="display mt-3 text-4xl text-cream sm:text-5xl">{t("title", { name: firstName })}</h1>
          <p className="mt-3 text-smoke">
            {t("subtitle", { id: order.id })}
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-12">
        <div className="min-w-0 space-y-8 lg:col-span-7">
          <div className="flex items-center gap-4 rounded-[1.75rem] border border-saffron/20 bg-saffron/[0.04] p-6">
            <Clock className="size-6 shrink-0 text-saffron" aria-hidden="true" />
            <div>
              <p className="text-sm text-smoke">{t("eta", { mode: details.fulfilment })}</p>
              <p className="display text-3xl text-cream">
                {details.timing === "scheduled" && details.slot
                  ? details.slot.split("T")[1]
                  : t("minutes", { count: order.etaMinutes })}
              </p>
            </div>
          </div>
          <OrderTracker fulfilment={details.fulfilment} createdAt={order.createdAt} />
        </div>

        <aside className="min-w-0 lg:col-span-5">
          <div className="rounded-[1.75rem] border border-white/[0.08] bg-ink-2 p-6 sm:p-8">
            <h2 className="display text-2xl text-cream">{t("details")}</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-saffron" aria-hidden="true" />
                <div>
                  <dt className="text-smoke">{details.fulfilment === "delivery" ? t("deliverTo") : t("pickupAt")}</dt>
                  <dd className="text-cream">{where}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Wallet className="mt-0.5 size-4 shrink-0 text-saffron" aria-hidden="true" />
                <div>
                  <dt className="text-smoke">{t("paidWith")}</dt>
                  <dd className="text-cream">{paidWith}</dd>
                </div>
              </div>
            </dl>

            <ul className="mt-6 divide-y divide-white/[0.06] border-t border-white/[0.06]">
              {order.lines.map((line) => {
                const dish = getDish(line.dishId);
                if (!dish) return null;
                const extras = describeSelectionsPlain(dish, line.selections, locale);
                return (
                  <li key={line.key} className="flex justify-between gap-4 py-3 text-sm">
                    <div>
                      <p className="text-cream">
                        <span className="text-saffron tabular-nums">{line.quantity}×</span> {localize(dish.name, locale)}
                      </p>
                      {extras && <p className="mt-0.5 text-xs text-smoke">{extras}</p>}
                    </div>
                  </li>
                );
              })}
            </ul>

            <dl className="mt-2 space-y-2 border-t border-white/[0.08] pt-4 text-sm">
              {totals.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-smoke">{`${tc("discount")} (${totals.promo})`}</dt>
                  <dd className="text-emerald-300 tabular-nums">−{formatPrice(totals.discount, locale)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-smoke">{tc("deliveryFee")}</dt>
                <dd className="text-cream tabular-nums">
                  {totals.deliveryFee > 0 ? formatPrice(totals.deliveryFee, locale) : tc("free")}
                </dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="font-semibold text-cream">{tc("total")}</dt>
                <dd className="display text-2xl text-cream tabular-nums">{formatPrice(totals.total, locale)}</dd>
              </div>
            </dl>
          </div>
          <Link href="/menu" className={cta({ variant: "outline", size: "lg", className: "mt-6 w-full" })}>
            {t("orderAgain")}
          </Link>
        </aside>
      </div>
    </div>
  );
}
