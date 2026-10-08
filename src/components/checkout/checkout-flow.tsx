"use client";

import { AnimatePresence, m } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { cta } from "@/components/ui/cta";
import { Link, useRouter } from "@/i18n/navigation";
import { computeTotals, type Totals } from "@/lib/pricing";
import type { CheckoutDetails } from "@/lib/schemas";
import { useCartStore } from "@/lib/stores/cart-store";
import { useOrderStore } from "@/lib/stores/order-store";
import { cn } from "@/lib/utils";
import { DetailsStep } from "./details-step";
import { OrderSummary } from "./order-summary";
import { PaymentStep, type PaymentMethod } from "./payment-step";

type Step = "details" | "payment";

export function CheckoutFlow({ stripeEnabled }: { stripeEnabled: boolean }) {
  const t = useTranslations("Checkout");
  const tp = useTranslations("Payment");
  const tCart = useTranslations("Cart");
  const locale = useLocale();
  const router = useRouter();
  const hydrated = useCartStore((s) => s.hydrated);
  const lines = useCartStore((s) => s.lines);
  const promo = useCartStore((s) => s.promo);
  const clearCart = useCartStore((s) => s.clear);
  const setLastOrder = useOrderStore((s) => s.setLastOrder);

  const [step, setStep] = useState<Step>("details");
  const [details, setDetails] = useState<CheckoutDetails | null>(null);
  const [fulfilment, setFulfilment] = useState<CheckoutDetails["fulfilment"]>("delivery");
  const [placing, setPlacing] = useState(false);

  const totals = computeTotals(lines, details?.fulfilment ?? fulfilment, promo);

  function goTo(next: Step) {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function placeOrder(payment: PaymentMethod, cardLast4?: string) {
    if (!details) return;
    setPlacing(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          details,
          lines: lines.map(({ dishId, quantity, selections }) => ({ dishId, quantity, selections })),
          promo,
          payment,
          cardLast4,
        }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        mode?: "demo" | "stripe";
        url?: string;
        orderId?: string;
        totals?: Totals;
        etaMinutes?: number;
      };
      if (!response.ok || !data.ok || !data.orderId || !data.totals) throw new Error("checkout_failed");

      setLastOrder({
        id: data.orderId,
        createdAt: Date.now(),
        details,
        lines,
        totals: data.totals,
        payment,
        cardLast4,
        etaMinutes: data.etaMinutes ?? 45,
      });

      if (data.mode === "stripe" && data.url) {
        window.location.assign(data.url);
        return;
      }
      clearCart();
      router.push("/order/confirmation");
    } catch {
      toast.error(tp("failed"));
      setPlacing(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="grid gap-10 lg:grid-cols-12" aria-busy="true">
        <div className="h-[32rem] animate-pulse rounded-[1.75rem] bg-white/[0.03] lg:col-span-7" />
        <div className="h-96 animate-pulse rounded-[1.75rem] bg-white/[0.03] lg:col-span-5" />
      </div>
    );
  }

  if (lines.length === 0 && !placing) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
        <div className="grid size-20 place-items-center rounded-full border border-saffron/30 bg-saffron/5">
          <ShoppingBag className="size-8 text-saffron" aria-hidden="true" />
        </div>
        <h2 className="display mt-6 text-3xl text-cream">{t("emptyTitle")}</h2>
        <p className="mt-3 text-smoke">{t("emptyText")}</p>
        <Link href="/menu" className={cta({ size: "lg", className: "mt-8" })}>
          {tCart("browse")}
        </Link>
      </div>
    );
  }

  const steps: { id: Step; label: string }[] = [
    { id: "details", label: t("stepDetails") },
    { id: "payment", label: t("stepPayment") },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="min-w-0 lg:col-span-7">
        <ol className="mb-10 flex items-center gap-3" aria-label={t("eyebrow")}>
          {steps.map((item, index) => {
            const done = steps.findIndex((s) => s.id === step) > index;
            const current = item.id === step;
            return (
              <li key={item.id} className="flex items-center gap-3" aria-current={current ? "step" : undefined}>
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-full border text-sm font-semibold transition-colors",
                    current && "border-saffron bg-saffron text-ink",
                    done && "border-saffron text-saffron",
                    !current && !done && "border-white/15 text-smoke",
                  )}
                >
                  {done ? <Check className="size-4" aria-hidden="true" /> : index + 1}
                </span>
                <span className={cn("text-sm font-medium", current ? "text-cream" : "text-smoke")}>{item.label}</span>
                {index < steps.length - 1 && <span aria-hidden="true" className="h-px w-10 bg-white/15 sm:w-16" />}
              </li>
            );
          })}
        </ol>

        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={step}
            initial={{ opacity: 0, x: locale === "ar" ? -24 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: locale === "ar" ? 24 : -24 }}
            transition={{ duration: 0.45 }}
          >
            {step === "details" ? (
              <DetailsStep
                initial={details}
                onFulfilmentChange={setFulfilment}
                onSubmit={(values) => {
                  setDetails(values);
                  setFulfilment(values.fulfilment);
                  goTo("payment");
                }}
              />
            ) : (
              <PaymentStep
                total={totals.total}
                stripeEnabled={stripeEnabled}
                fulfilment={details?.fulfilment ?? fulfilment}
                onBack={() => goTo("details")}
                onPlace={placeOrder}
              />
            )}
          </m.div>
        </AnimatePresence>
      </div>

      <aside className="min-w-0 lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <OrderSummary totals={totals} editable={step === "details"} />
        </div>
      </aside>
    </div>
  );
}
