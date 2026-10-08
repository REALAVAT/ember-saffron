"use client";

import { m, useReducedMotion } from "framer-motion";
import { Bike, ChefHat, CircleCheck, Package, ReceiptText, Store } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const deliveryStages = ["received", "preparing", "ready", "onTheWay", "delivered"] as const;
const pickupStages = ["received", "preparing", "ready", "collected"] as const;
type Stage = (typeof deliveryStages)[number] | (typeof pickupStages)[number];

const stageIcons: Record<Stage, typeof ReceiptText> = {
  received: ReceiptText,
  preparing: ChefHat,
  ready: Package,
  onTheWay: Bike,
  delivered: CircleCheck,
  collected: Store,
};

const STAGE_MS = 6000;

export function OrderTracker({ fulfilment, createdAt }: { fulfilment: "delivery" | "pickup"; createdAt: number }) {
  const t = useTranslations("Confirmation");
  const reduceMotion = useReducedMotion();
  const stages: readonly Stage[] = fulfilment === "delivery" ? deliveryStages : pickupStages;
  const [active, setActive] = useState(0);

  useEffect(() => {
    const last = stages.length - 1;
    const sync = () => {
      const elapsed = Date.now() - createdAt;
      setActive(Math.min(last, Math.max(0, Math.floor(elapsed / STAGE_MS))));
    };
    const first = window.setTimeout(sync, 0);
    const interval = window.setInterval(sync, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, [createdAt, stages.length]);

  const progress = stages.length > 1 ? active / (stages.length - 1) : 1;
  const current = stages[active];

  return (
    <section aria-labelledby="tracker-title" className="rounded-[1.75rem] border border-white/[0.08] bg-ink-2 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="tracker-title" className="display text-2xl text-cream">
          {t("statusLabel")}
        </h2>
        <span className="text-xs text-smoke">{t("demoSpeed")}</span>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {t(`status.${current}`)}
      </p>

      <ol className="relative mt-8 space-y-7">
        <span aria-hidden="true" className="absolute start-[1.375rem] top-2 bottom-2 w-px bg-white/10" />
        <m.span
          aria-hidden="true"
          className="absolute start-[1.375rem] top-2 w-px origin-top bg-gradient-to-b from-saffron to-ember"
          style={{ height: "calc(100% - 1rem)" }}
          initial={false}
          animate={{ scaleY: progress }}
          transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
        {stages.map((stage, index) => {
          const Icon = stageIcons[stage];
          const done = index < active;
          const isCurrent = index === active;
          return (
            <li key={stage} className="relative flex gap-5">
              <span
                className={cn(
                  "relative z-10 grid size-11 shrink-0 place-items-center rounded-full border transition-colors duration-500",
                  done && "border-saffron bg-saffron text-ink",
                  isCurrent && "border-ember bg-ember text-cream",
                  !done && !isCurrent && "border-white/10 bg-ink-3 text-smoke",
                )}
              >
                {isCurrent && !reduceMotion && index < stages.length - 1 && (
                  <m.span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border border-ember"
                    animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="pt-1.5">
                <p className={cn("font-semibold transition-colors", done || isCurrent ? "text-cream" : "text-smoke")}>
                  {t(`status.${stage}`)}
                </p>
                <m.p
                  initial={false}
                  animate={{ opacity: done || isCurrent ? 1 : 0.5 }}
                  className="mt-0.5 text-sm text-smoke"
                >
                  {t(`statusDetail.${stage}`)}
                </m.p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
