"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Bike, ChevronDown, Clock, Store, Zap } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Field, fieldA11y, inputClass } from "@/components/forms/field";
import { cta } from "@/components/ui/cta";
import { useNow } from "@/lib/hooks/use-now";
import { checkoutDetailsSchema, type CheckoutDetails } from "@/lib/schemas";
import { formatDay, orderSlots, todayIso } from "@/lib/time-slots";
import { cn } from "@/lib/utils";

interface DetailsStepProps {
  initial: CheckoutDetails | null;
  onFulfilmentChange: (value: CheckoutDetails["fulfilment"]) => void;
  onSubmit: (details: CheckoutDetails) => void;
}

export const emptyDetails: CheckoutDetails = {
  fulfilment: "delivery",
  name: "",
  phone: "",
  email: "",
  area: "",
  building: "",
  apartment: "",
  instructions: "",
  timing: "asap",
  slot: "",
};

export function DetailsStep({ initial, onFulfilmentChange, onSubmit }: DetailsStepProps) {
  const t = useTranslations("Checkout");
  const tr = useTranslations("Reservations");
  const locale = useLocale();
  const now = useNow();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CheckoutDetails>({
    resolver: zodResolver(checkoutDetailsSchema),
    defaultValues: initial ?? emptyDetails,
  });

  const [fulfilment, timing] = useWatch({ control, name: ["fulfilment", "timing"] });
  const slots = useMemo(() => (now ? orderSlots(now) : []), [now]);
  const today = now ? todayIso(now) : "";

  const slotLabel = (date: string) =>
    date === today ? tr("today") : formatDay(date, locale, { weekday: "long", day: "numeric", month: "short" });
  const slotGroups = slots.reduce<Record<string, typeof slots>>((groups, slot) => {
    (groups[slot.date] ??= []).push(slot);
    return groups;
  }, {});

  const options = [
    { value: "delivery" as const, icon: Bike, title: t("delivery"), hint: t("deliveryHint") },
    { value: "pickup" as const, icon: Store, title: t("pickup"), hint: t("pickupHint") },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-12">
      <fieldset>
        <legend className="display text-2xl text-cream">{t("fulfilment")}</legend>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const Icon = option.icon;
            const selected = fulfilment === option.value;
            return (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-saffron",
                  selected ? "border-saffron bg-saffron/[0.06]" : "border-white/10 hover:border-white/25",
                )}
              >
                <input
                  type="radio"
                  value={option.value}
                  checked={selected}
                  onChange={() => {
                    setValue("fulfilment", option.value, { shouldValidate: false });
                    onFulfilmentChange(option.value);
                  }}
                  className="sr-only"
                  name="fulfilment"
                />
                <span className={cn("grid size-11 shrink-0 place-items-center rounded-full", selected ? "bg-saffron text-ink" : "bg-white/5 text-cream")}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold text-cream">{option.title}</span>
                  <span className="mt-0.5 block text-sm text-smoke">{option.hint}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="display mb-5 text-2xl text-cream">{t("contact")}</legend>
        <Field id="co-name" label={t("name")} error={errors.name?.message} className="sm:col-span-2">
          <input {...register("name")} {...fieldA11y("co-name", errors.name?.message)} autoComplete="name" className={inputClass} />
        </Field>
        <Field id="co-phone" label={t("phone")} error={errors.phone?.message}>
          <input {...register("phone")} {...fieldA11y("co-phone", errors.phone?.message)} type="tel" autoComplete="tel" placeholder="+971 50 000 0000" dir="ltr" className={cn(inputClass, "rtl:text-right")} />
        </Field>
        <Field id="co-email" label={t("email")} error={errors.email?.message}>
          <input {...register("email")} {...fieldA11y("co-email", errors.email?.message)} type="email" autoComplete="email" dir="ltr" className={cn(inputClass, "rtl:text-right")} />
        </Field>
      </fieldset>

      {fulfilment === "delivery" && (
        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className="display mb-5 text-2xl text-cream">{t("address")}</legend>
          <Field id="co-area" label={t("area")} error={errors.area?.message}>
            <input {...register("area")} {...fieldA11y("co-area", errors.area?.message)} autoComplete="address-level2" placeholder="Dubai Marina" className={inputClass} />
          </Field>
          <Field id="co-building" label={t("building")} error={errors.building?.message}>
            <input {...register("building")} {...fieldA11y("co-building", errors.building?.message)} autoComplete="address-line1" className={inputClass} />
          </Field>
          <Field id="co-apartment" label={t("apartment")} error={errors.apartment?.message}>
            <input {...register("apartment")} {...fieldA11y("co-apartment", errors.apartment?.message)} autoComplete="address-line2" className={inputClass} />
          </Field>
          <Field id="co-instructions" label={t("instructions")} error={errors.instructions?.message}>
            <input {...register("instructions")} {...fieldA11y("co-instructions", errors.instructions?.message)} className={inputClass} />
          </Field>
        </fieldset>
      )}

      <fieldset>
        <legend className="display text-2xl text-cream">{t("time")}</legend>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {(
            [
              { value: "asap", icon: Zap, label: t("asap") },
              { value: "scheduled", icon: Clock, label: t("scheduled") },
            ] as const
          ).map((option) => {
            const Icon = option.icon;
            const selected = timing === option.value;
            return (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl border px-5 py-4 transition-all has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-saffron",
                  selected ? "border-saffron bg-saffron/[0.06] text-cream" : "border-white/10 text-cream/80 hover:border-white/25",
                )}
              >
                <input type="radio" value={option.value} {...register("timing")} className="sr-only" />
                <Icon className={cn("size-4", selected ? "text-saffron" : "text-smoke")} aria-hidden="true" />
                <span className="text-sm font-medium">{option.label}</span>
              </label>
            );
          })}
        </div>
        {timing === "scheduled" && (
          <Field id="co-slot" label={t("slotLabel")} error={errors.slot?.message} className="mt-5 max-w-sm">
            <div className="relative">
              <select {...register("slot")} {...fieldA11y("co-slot", errors.slot?.message)} className={cn(inputClass, "appearance-none pe-10")}>
                <option value="">{t("slotPlaceholder")}</option>
                {Object.entries(slotGroups).map(([date, group]) => (
                  <optgroup key={date} label={slotLabel(date)} className="bg-ink-2">
                    {group.map((slot) => (
                      <option key={slot.value} value={slot.value} className="bg-ink-2">
                        {slot.time}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-smoke" aria-hidden="true" />
            </div>
          </Field>
        )}
      </fieldset>

      <button type="submit" className={cta({ size: "lg", className: "w-full sm:w-auto" })}>
        {t("continueToPayment")}
        <ArrowRight className="rtl:rotate-180" aria-hidden="true" />
      </button>
    </form>
  );
}
