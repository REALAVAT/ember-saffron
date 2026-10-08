"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Banknote, CreditCard, Loader2, Lock, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Field, fieldA11y, inputClass } from "@/components/forms/field";
import { cta } from "@/components/ui/cta";
import { formatPrice } from "@/lib/i18n-data";
import { cardSchema, type CardInput } from "@/lib/schemas";
import { cn } from "@/lib/utils";

export type PaymentMethod = "card" | "cash" | "stripe";

interface PaymentStepProps {
  total: number;
  stripeEnabled: boolean;
  fulfilment: "delivery" | "pickup";
  onBack: () => void;
  onPlace: (method: PaymentMethod, cardLast4?: string) => Promise<void>;
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function PaymentStep({ total, stripeEnabled, fulfilment, onBack, onPlace }: PaymentStepProps) {
  const t = useTranslations("Payment");
  const tc = useTranslations("Checkout");
  const locale = useLocale();
  const [method, setMethod] = useState<"card" | "cash">("card");
  const [processing, setProcessing] = useState(false);
  const amount = formatPrice(total, locale);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CardInput, unknown, { cardName: string; cardNumber: string; expiry: string; cvc: string }>({
    resolver: zodResolver(cardSchema),
    defaultValues: { cardName: "", cardNumber: "", expiry: "", cvc: "" },
  });

  async function run(payment: PaymentMethod, last4?: string) {
    setProcessing(true);
    try {
      await onPlace(payment, last4);
    } finally {
      setProcessing(false);
    }
  }

  const methods = [
    { value: "card" as const, icon: CreditCard, label: t("cardOption") },
    { value: "cash" as const, icon: Banknote, label: t("cashOption") },
  ];

  const submitLabel = processing ? (
    <>
      <Loader2 className="animate-spin" aria-hidden="true" /> {t("processing")}
    </>
  ) : (
    <>
      <Lock aria-hidden="true" /> {stripeEnabled && method === "card" ? t("payWithStripe", { amount }) : t("pay", { amount })}
    </>
  );

  return (
    <div className="space-y-10">
      <fieldset>
        <legend className="display text-2xl text-cream">{t("method")}</legend>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {methods.map((option) => {
            const Icon = option.icon;
            const selected = method === option.value;
            return (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl border px-5 py-4 transition-all has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-saffron",
                  selected ? "border-saffron bg-saffron/[0.06] text-cream" : "border-white/10 text-cream/80 hover:border-white/25",
                )}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={option.value}
                  checked={selected}
                  onChange={() => setMethod(option.value)}
                  className="sr-only"
                />
                <Icon className={cn("size-5", selected ? "text-saffron" : "text-smoke")} aria-hidden="true" />
                <span className="text-sm font-medium">{option.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {method === "card" && stripeEnabled && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <p className="flex items-center gap-2 font-semibold text-cream">
            <ShieldCheck className="size-5 text-saffron" aria-hidden="true" /> {t("stripeTitle")}
          </p>
          <p className="mt-2 text-sm text-smoke">{t("stripeText")}</p>
          <button
            type="button"
            disabled={processing}
            onClick={() => run("stripe")}
            className={cta({ size: "lg", className: "mt-6 w-full" })}
          >
            {submitLabel}
          </button>
        </div>
      )}

      {method === "card" && !stripeEnabled && (
        <form
          noValidate
          onSubmit={handleSubmit((values) => run("card", values.cardNumber.slice(-4)))}
          className="space-y-5"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-ink-4 via-ink-3 to-ink-2 p-6">
            <div aria-hidden="true" className="absolute -end-16 -top-16 size-48 rounded-full bg-ember/20 blur-3xl" />
            <p className="relative flex items-center gap-2 font-semibold text-cream">
              <CreditCard className="size-5 text-saffron" aria-hidden="true" /> {t("mockTitle")}
            </p>
            <p className="relative mt-2 text-sm text-smoke">{t("mockText")}</p>
          </div>
          <Field id="pay-name" label={t("cardName")} error={errors.cardName?.message}>
            <input {...register("cardName")} {...fieldA11y("pay-name", errors.cardName?.message)} autoComplete="cc-name" className={inputClass} />
          </Field>
          <Field id="pay-number" label={t("cardNumber")} error={errors.cardNumber?.message}>
            <input
              {...register("cardNumber", {
                onChange: (event) => setValue("cardNumber", formatCardNumber(event.target.value)),
              })}
              {...fieldA11y("pay-number", errors.cardNumber?.message)}
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              dir="ltr"
              className={cn(inputClass, "tracking-wider tabular-nums rtl:text-right")}
            />
          </Field>
          <div className="grid grid-cols-2 gap-5">
            <Field id="pay-expiry" label={t("expiry")} error={errors.expiry?.message}>
              <input
                {...register("expiry", {
                  onChange: (event) => setValue("expiry", formatExpiry(event.target.value)),
                })}
                {...fieldA11y("pay-expiry", errors.expiry?.message)}
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="12/29"
                dir="ltr"
                className={cn(inputClass, "tabular-nums rtl:text-right")}
              />
            </Field>
            <Field id="pay-cvc" label={t("cvc")} error={errors.cvc?.message}>
              <input
                {...register("cvc")}
                {...fieldA11y("pay-cvc", errors.cvc?.message)}
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                maxLength={4}
                dir="ltr"
                className={cn(inputClass, "tabular-nums rtl:text-right")}
              />
            </Field>
          </div>
          <button type="submit" disabled={processing} className={cta({ size: "lg", className: "w-full" })}>
            {submitLabel}
          </button>
        </form>
      )}

      {method === "cash" && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <p className="flex items-center gap-2 font-semibold text-cream">
            <Banknote className="size-5 text-saffron" aria-hidden="true" /> {t("cashOption")}
          </p>
          <p className="mt-2 text-sm text-smoke">
            {fulfilment === "delivery" ? tc("deliveryHint") : tc("pickupHint")}
          </p>
          <button
            type="button"
            disabled={processing}
            onClick={() => run("cash")}
            className={cta({ size: "lg", className: "mt-6 w-full" })}
          >
            {processing ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" /> {t("processing")}
              </>
            ) : (
              t("pay", { amount })
            )}
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-smoke transition-colors hover:text-cream"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
        {tc("back")}
      </button>
    </div>
  );
}
