"use client";

import { Tag, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState, type FormEvent } from "react";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { formatPrice } from "@/lib/i18n-data";
import { normalizePromo, type Totals } from "@/lib/pricing";
import { useCartStore } from "@/lib/stores/cart-store";
import { cn } from "@/lib/utils";

export function OrderSummary({ totals, editable = true }: { totals: Totals; editable?: boolean }) {
  const t = useTranslations("Checkout");
  const tc = useTranslations("Cart");
  const locale = useLocale();
  const lines = useCartStore((s) => s.lines);
  const promo = useCartStore((s) => s.promo);
  const setPromo = useCartStore((s) => s.setPromo);
  const [code, setCode] = useState("");
  const [invalid, setInvalid] = useState(false);
  const inputId = useId();

  function apply(event: FormEvent) {
    event.preventDefault();
    const normalized = normalizePromo(code);
    if (!normalized) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setPromo(normalized);
    setCode("");
  }

  return (
    <div className="rounded-[1.75rem] border border-white/[0.08] bg-ink-2 p-6 sm:p-8">
      <h2 className="display text-2xl text-cream">{t("summary")}</h2>
      <ul className="mt-4 divide-y divide-white/[0.06]">
        {lines.map((line) => (
          <li key={line.key}>
            <CartLineItem line={line} readOnly={!editable} />
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t border-white/[0.06] pt-5">
        {promo ? (
          <div className="flex items-center justify-between rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-300" role="status">
            <span className="flex items-center gap-2">
              <Tag className="size-4" aria-hidden="true" />
              {t("promoApplied", { code: promo })}
            </span>
            <button
              type="button"
              onClick={() => setPromo(null)}
              aria-label={t("removePromo")}
              className="grid size-7 place-items-center rounded-full hover:bg-white/10"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <form onSubmit={apply} className="space-y-2" noValidate>
            <label htmlFor={inputId} className="text-sm font-medium text-cream/90">
              {t("promo")}
            </label>
            <div className="flex gap-2">
              <input
                id={inputId}
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setInvalid(false);
                }}
                placeholder={t("promoPlaceholder")}
                aria-invalid={invalid || undefined}
                aria-describedby={`${inputId}-hint`}
                autoCapitalize="characters"
                dir="ltr"
                className={cn(
                  "h-11 min-w-0 flex-1 rounded-xl border bg-white/[0.03] px-4 text-sm text-cream uppercase placeholder:text-smoke placeholder:normal-case focus:outline-none rtl:text-right",
                  invalid ? "border-ember/70" : "border-white/10 focus:border-saffron/70",
                )}
              />
              <button
                type="submit"
                className="h-11 rounded-xl border border-saffron/50 px-4 text-sm font-semibold text-saffron transition-colors hover:bg-saffron hover:text-ink"
              >
                {t("apply")}
              </button>
            </div>
            <p id={`${inputId}-hint`} className={cn("text-xs", invalid ? "text-ember-soft" : "text-smoke")} role={invalid ? "alert" : undefined}>
              {invalid ? t("promoInvalid") : t("promoHint")}
            </p>
          </form>
        )}
      </div>

      <dl className="mt-6 space-y-2.5 text-sm">
        <Row label={tc("subtotal")} value={formatPrice(totals.subtotal, locale)} />
        {totals.discount > 0 && (
          <Row label={`${t("discount")} (${totals.promo})`} value={`−${formatPrice(totals.discount, locale)}`} accent />
        )}
        <Row
          label={t("deliveryFee")}
          value={totals.deliveryFee > 0 ? formatPrice(totals.deliveryFee, locale) : t("free")}
        />
        <div className="flex items-baseline justify-between border-t border-white/[0.08] pt-4">
          <dt className="font-semibold text-cream">{t("total")}</dt>
          <dd className="display text-3xl text-cream tabular-nums">{formatPrice(totals.total, locale)}</dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-smoke">{t("vatIncluded", { amount: formatPrice(totals.vat, locale) })}</p>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-smoke">{label}</dt>
      <dd className={cn("tabular-nums", accent ? "text-emerald-300" : "text-cream")}>{value}</dd>
    </div>
  );
}
