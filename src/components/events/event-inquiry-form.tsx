"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "framer-motion";
import { ChevronDown, Loader2, Send, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Field, fieldA11y, inputClass, textareaClass } from "@/components/forms/field";
import { cta } from "@/components/ui/cta";
import { eventBudgets, eventTypes } from "@/data/content";
import { useNow } from "@/lib/hooks/use-now";
import { eventInquirySchema, type EventInquiryInput } from "@/lib/schemas";
import { addDays, todayIso } from "@/lib/time-slots";
import { cn } from "@/lib/utils";

type FormValues = Omit<EventInquiryInput, "eventType" | "budget" | "guests"> & {
  eventType: EventInquiryInput["eventType"] | "";
  budget: EventInquiryInput["budget"] | "";
  guests: number;
};

export function EventInquiryForm() {
  const t = useTranslations("Events");
  const locale = useLocale();
  const now = useNow();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues, unknown, EventInquiryInput>({
    resolver: zodResolver(eventInquirySchema) as never,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      eventType: "",
      date: "",
      guests: 30,
      budget: "",
      message: "",
    },
  });

  async function onSubmit(values: EventInquiryInput) {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        if (data?.issues) {
          for (const [field, messages] of Object.entries(data.issues as Record<string, string[]>)) {
            setError(field as keyof FormValues, { message: messages[0] });
          }
          return;
        }
        throw new Error("failed");
      }
      setSentTo(values.name.split(" ")[0]);
    } catch {
      toast.error(t("error"));
    }
  }

  const minDate = now ? todayIso(now) : undefined;
  const maxDate = minDate ? addDays(minDate, 730) : undefined;
  const selectClass = cn(inputClass, "appearance-none pe-10");

  return (
    <AnimatePresence mode="wait">
      {sentTo ? (
        <m.div
          key="sent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex min-h-[28rem] flex-col items-center justify-center text-center"
          role="status"
        >
          <div className="grid size-20 place-items-center rounded-full bg-saffron/10 ring-1 ring-saffron/40">
            <Sparkles className="size-9 text-saffron" aria-hidden="true" />
          </div>
          <h3 className="display mt-8 text-4xl text-cream">{t("successTitle", { name: sentTo })}</h3>
          <p className="mt-4 max-w-md text-smoke">{t("successText")}</p>
          <button
            type="button"
            onClick={() => {
              reset();
              setSentTo(null);
            }}
            className={cta({ variant: "outline", className: "mt-8" })}
          >
            {t("another")}
          </button>
        </m.div>
      ) : (
        <m.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid gap-5 sm:grid-cols-2"
        >
          <Field id="ev-name" label={t("name")} error={errors.name?.message}>
            <input {...register("name")} {...fieldA11y("ev-name", errors.name?.message)} autoComplete="name" className={inputClass} />
          </Field>
          <Field id="ev-company" label={t("company")} error={errors.company?.message}>
            <input {...register("company")} {...fieldA11y("ev-company", errors.company?.message)} autoComplete="organization" className={inputClass} />
          </Field>
          <Field id="ev-email" label={t("email")} error={errors.email?.message}>
            <input {...register("email")} {...fieldA11y("ev-email", errors.email?.message)} type="email" autoComplete="email" dir="ltr" className={cn(inputClass, "rtl:text-right")} />
          </Field>
          <Field id="ev-phone" label={t("phone")} error={errors.phone?.message}>
            <input {...register("phone")} {...fieldA11y("ev-phone", errors.phone?.message)} type="tel" autoComplete="tel" placeholder="+971 50 000 0000" dir="ltr" className={cn(inputClass, "rtl:text-right")} />
          </Field>
          <Field id="ev-type" label={t("eventType")} error={errors.eventType?.message}>
            <div className="relative">
              <select {...register("eventType")} {...fieldA11y("ev-type", errors.eventType?.message)} className={selectClass}>
                <option value="" disabled>
                  {t("selectPlaceholder")}
                </option>
                {eventTypes.map((type) => (
                  <option key={type} value={type} className="bg-ink-2">
                    {t(`eventTypes.${type}`)}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-smoke" aria-hidden="true" />
            </div>
          </Field>
          <Field id="ev-date" label={t("date")} error={errors.date?.message}>
            <input
              {...register("date")}
              {...fieldA11y("ev-date", errors.date?.message)}
              type="date"
              min={minDate}
              max={maxDate}
              className={cn(inputClass, "[color-scheme:dark]")}
            />
          </Field>
          <Field id="ev-guests" label={t("guests")} error={errors.guests?.message}>
            <input
              {...register("guests", { valueAsNumber: true })}
              {...fieldA11y("ev-guests", errors.guests?.message)}
              type="number"
              inputMode="numeric"
              min={10}
              max={1000}
              className={inputClass}
            />
          </Field>
          <Field id="ev-budget" label={t("budget")} error={errors.budget?.message}>
            <div className="relative">
              <select {...register("budget")} {...fieldA11y("ev-budget", errors.budget?.message)} className={selectClass}>
                <option value="" disabled>
                  {t("selectPlaceholder")}
                </option>
                {eventBudgets.map((budget) => (
                  <option key={budget} value={budget} className="bg-ink-2">
                    {t(`budgets.${budget}`)}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-smoke" aria-hidden="true" />
            </div>
          </Field>
          <Field id="ev-message" label={t("message")} error={errors.message?.message} className="sm:col-span-2">
            <textarea {...register("message")} {...fieldA11y("ev-message", errors.message?.message)} rows={5} placeholder={t("messagePlaceholder")} className={textareaClass} />
          </Field>
          <div className="sm:col-span-2">
            <button type="submit" disabled={isSubmitting} className={cta({ size: "lg", className: "w-full sm:w-auto" })}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden="true" /> {t("submitting")}
                </>
              ) : (
                <>
                  {t("submit")} <Send className="rtl:-scale-x-100" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </m.form>
      )}
    </AnimatePresence>
  );
}
