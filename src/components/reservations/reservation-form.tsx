"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "framer-motion";
import { CalendarPlus, CheckCircle2, Loader2, Users } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { Field, fieldA11y, inputClass, textareaClass } from "@/components/forms/field";
import { cta } from "@/components/ui/cta";
import { siteConfig } from "@/config/site";
import { occasions } from "@/data/content";
import { images } from "@/data/images";
import { Link } from "@/i18n/navigation";
import { useNow } from "@/lib/hooks/use-now";
import { localize } from "@/lib/i18n-data";
import { reservationSchema, type ReservationInput } from "@/lib/schemas";
import { formatDay, reservationSlots, upcomingDates } from "@/lib/time-slots";
import { cn } from "@/lib/utils";

const DAYS_SHOWN = 21;

function buildIcs({ date, time, guests, reference, title }: { date: string; time: string; guests: number; reference: string; title: string }) {
  const start = `${date.replace(/-/g, "")}T${time.replace(":", "")}00`;
  const [h, m] = time.split(":").map(Number);
  const endMinutes = h * 60 + m + 120;
  const end = `${date.replace(/-/g, "")}T${String(Math.floor(endMinutes / 60) % 24).padStart(2, "0")}${String(endMinutes % 60).padStart(2, "0")}00`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ember & Saffron//Reservations//EN",
    "BEGIN:VEVENT",
    `UID:${reference}@emberandsaffron.ae`,
    `DTSTART;TZID=Asia/Dubai:${start}`,
    `DTEND;TZID=Asia/Dubai:${end}`,
    `SUMMARY:${title} (${guests})`,
    `LOCATION:${siteConfig.address.street.en}\\, Dubai`,
    `DESCRIPTION:Booking reference ${reference}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

interface Confirmation extends ReservationInput {
  reference: string;
}

export function ReservationForm() {
  const t = useTranslations("Reservations");
  const te = useTranslations("Errors");
  const locale = useLocale();
  const now = useNow();
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      date: "",
      time: "",
      guests: 2,
      occasion: "none",
      name: "",
      email: "",
      phone: "",
      requests: "",
    },
  });

  const [date, time, guests, occasion] = useWatch({
    control,
    name: ["date", "time", "guests", "occasion"],
  });

  const dates = useMemo(() => (now ? upcomingDates(now, DAYS_SHOWN) : []), [now]);
  const slots = useMemo(() => (now && date ? reservationSlots(date, now) : []), [now, date]);

  function pickDate(value: string) {
    setValue("date", value, { shouldValidate: true });
    if (now && time && !reservationSlots(value, now).some((s) => s.time === time && s.available)) {
      setValue("time", "");
    }
  }

  async function onSubmit(values: ReservationInput) {
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        if (data?.issues) {
          for (const [field, messages] of Object.entries(data.issues as Record<string, string[]>)) {
            setError(field as keyof ReservationInput, { message: messages[0] });
          }
          return;
        }
        throw new Error(data?.error ?? "failed");
      }
      setConfirmation({ ...values, reference: data.reference });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error(t("error"));
    }
  }

  function downloadIcs() {
    if (!confirmation) return;
    const blob = new Blob([buildIcs({ ...confirmation, title: t("calendarTitle") })], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ember-saffron-${confirmation.reference}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const lunch = slots.filter((s) => s.period === "lunch");
  const dinner = slots.filter((s) => s.period === "dinner");

  return (
    <AnimatePresence mode="wait">
      {confirmation ? (
        <m.div
          key="done"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
          role="status"
        >
          <m.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
            className="mx-auto grid size-20 place-items-center rounded-full bg-saffron/10 ring-1 ring-saffron/40"
          >
            <CheckCircle2 className="size-10 text-saffron" aria-hidden="true" />
          </m.div>
          <h2 className="display mt-8 text-4xl text-cream sm:text-5xl">
            {t("successTitle", { name: confirmation.name.split(" ")[0] })}
          </h2>
          <p className="mt-4 text-smoke">{t("successText", { email: confirmation.email })}</p>

          <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 text-start sm:grid-cols-2">
            {[
              { label: t("reference"), value: confirmation.reference, mono: true },
              { label: t("date"), value: formatDay(confirmation.date, locale, { weekday: "long", day: "numeric", month: "long" }) },
              { label: t("time"), value: confirmation.time, mono: true },
              { label: t("guests"), value: t("guestsCount", { count: confirmation.guests }) },
              { label: t("occasion"), value: t(`occasions.${confirmation.occasion}`) },
              { label: localize({ en: "Where", ar: "المكان" }, locale), value: localize(siteConfig.address.street, locale) },
            ].map((row) => (
              <div key={row.label} className="bg-ink-2 px-5 py-4">
                <dt className="text-xs text-smoke">{row.label}</dt>
                <dd className={cn("mt-1 text-cream", row.mono && "tabular-nums")} dir={row.mono ? "ltr" : undefined}>
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={downloadIcs} className={cta({ size: "lg" })}>
              <CalendarPlus aria-hidden="true" />
              {t("addToCalendar")}
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setConfirmation(null);
              }}
              className={cta({ variant: "outline", size: "lg" })}
            >
              {t("another")}
            </button>
          </div>
        </m.div>
      ) : (
        <m.form
          key="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid gap-10 lg:grid-cols-12 lg:gap-16"
        >
          <div className="min-w-0 space-y-12 lg:col-span-7">
            {/* Guests */}
            <fieldset>
              <legend className="display text-2xl text-cream">{t("guests")}</legend>
              <div className="mt-5 flex flex-wrap items-center gap-5">
                <QuantityStepper
                  value={guests}
                  min={1}
                  max={10}
                  size="md"
                  label={t("guests")}
                  onChange={(value) => setValue("guests", value, { shouldValidate: true })}
                />
                <span className="text-cream">{t("guestsCount", { count: guests })}</span>
              </div>
              <p className="mt-3 text-sm text-smoke">
                {t("largeParty")}{" "}
                <Link href="/private-events" className="text-saffron underline-offset-4 hover:underline">
                  {t("largePartyLink")}
                </Link>
              </p>
            </fieldset>

            {/* Date */}
            <fieldset aria-describedby={errors.date ? "date-error" : undefined}>
              <legend className="display text-2xl text-cream">{t("date")}</legend>
              <div className="no-scrollbar -mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0" data-lenis-prevent>
                {dates.length === 0
                  ? Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="h-20 w-[4.5rem] shrink-0 animate-pulse rounded-2xl bg-white/[0.04]" />
                    ))
                  : dates.map((value, index) => {
                      const selected = value === date;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => pickDate(value)}
                          aria-pressed={selected}
                          aria-label={formatDay(value, locale, { weekday: "long", day: "numeric", month: "long" })}
                          className={cn(
                            "flex h-20 w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-2xl border text-center transition-all",
                            selected
                              ? "border-saffron bg-saffron text-ink"
                              : "border-white/10 text-cream hover:border-white/30",
                          )}
                        >
                          <span className={cn("text-[0.7rem] font-medium uppercase", selected ? "text-ink/70" : "text-smoke")}>
                            {index === 0
                              ? t("today")
                              : index === 1
                                ? t("tomorrow")
                                : formatDay(value, locale, { weekday: "short" })}
                          </span>
                          <span className="display text-2xl leading-tight">{formatDay(value, locale, { day: "numeric" })}</span>
                          <span className={cn("text-[0.7rem]", selected ? "text-ink/70" : "text-smoke")}>
                            {formatDay(value, locale, { month: "short" })}
                          </span>
                        </button>
                      );
                    })}
              </div>
              {errors.date?.message && (
                <ErrorText id="date-error" message={errors.date.message} />
              )}
            </fieldset>

            {/* Time */}
            <fieldset aria-describedby={errors.time ? "time-error" : undefined}>
              <legend className="display text-2xl text-cream">{t("time")}</legend>
              {!date ? (
                <p className="mt-4 rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-smoke">
                  {te("date")}
                </p>
              ) : (
                <div className="mt-5 space-y-5">
                  {[
                    { label: t("lunch"), items: lunch },
                    { label: t("dinner"), items: dinner },
                  ].map((group) => (
                    <div key={group.label}>
                      <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-smoke uppercase rtl:tracking-normal">
                        {group.label}
                      </p>
                      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                        {group.items.map((slot) => {
                          const selected = slot.time === time;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={!slot.available}
                              onClick={() => setValue("time", slot.time, { shouldValidate: true })}
                              aria-pressed={selected}
                              className={cn(
                                "h-11 rounded-xl border text-sm tabular-nums transition-all disabled:cursor-not-allowed disabled:border-transparent disabled:bg-white/[0.02] disabled:text-smoke/40 disabled:line-through",
                                selected
                                  ? "border-saffron bg-saffron font-semibold text-ink"
                                  : "border-white/10 text-cream hover:border-white/30",
                              )}
                              dir="ltr"
                            >
                              {slot.time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {errors.time?.message && <ErrorText id="time-error" message={errors.time.message} />}
            </fieldset>

            {/* Occasion */}
            <fieldset>
              <legend className="display text-2xl text-cream">{t("occasion")}</legend>
              <div className="mt-5 flex flex-wrap gap-2">
                {occasions.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setValue("occasion", value)}
                    aria-pressed={occasion === value}
                    className={cn(
                      "h-10 rounded-full border px-4 text-sm transition-colors",
                      occasion === value
                        ? "border-saffron bg-saffron/10 text-saffron"
                        : "border-white/10 text-cream/80 hover:border-white/30",
                    )}
                  >
                    {t(`occasions.${value}`)}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Contact */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="res-name" label={t("name")} error={errors.name?.message} className="sm:col-span-2">
                <input {...register("name")} {...fieldA11y("res-name", errors.name?.message)} autoComplete="name" className={inputClass} />
              </Field>
              <Field id="res-email" label={t("email")} error={errors.email?.message}>
                <input {...register("email")} {...fieldA11y("res-email", errors.email?.message)} type="email" autoComplete="email" dir="ltr" className={cn(inputClass, "rtl:text-right")} />
              </Field>
              <Field id="res-phone" label={t("phone")} error={errors.phone?.message}>
                <input {...register("phone")} {...fieldA11y("res-phone", errors.phone?.message)} type="tel" autoComplete="tel" placeholder="+971 50 000 0000" dir="ltr" className={cn(inputClass, "rtl:text-right")} />
              </Field>
              <Field id="res-requests" label={t("requests")} error={errors.requests?.message} className="sm:col-span-2">
                <textarea {...register("requests")} {...fieldA11y("res-requests", errors.requests?.message)} rows={4} placeholder={t("requestsPlaceholder")} className={textareaClass} />
              </Field>
            </div>
          </div>

          {/* Summary */}
          <aside className="min-w-0 lg:col-span-5">
            <div className="sticky top-28 overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-2">
              <div className="relative aspect-[16/9]">
                <Image src={images.reservationsHero} alt="" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-2 to-transparent" />
              </div>
              <div className="space-y-5 p-6 sm:p-8">
                <h2 className="display text-2xl text-cream">{t("summaryTitle")}</h2>
                <dl className="space-y-3 text-sm">
                  <SummaryRow label={t("date")} value={date ? formatDay(date, locale, { weekday: "long", day: "numeric", month: "long" }) : "—"} />
                  <SummaryRow label={t("time")} value={time || "—"} ltr />
                  <SummaryRow label={t("guests")} value={t("guestsCount", { count: guests })} icon={<Users className="size-3.5" aria-hidden="true" />} />
                  <SummaryRow label={t("occasion")} value={t(`occasions.${occasion}`)} />
                </dl>
                <button type="submit" disabled={isSubmitting} className={cta({ size: "lg", className: "w-full" })}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" aria-hidden="true" /> {t("submitting")}
                    </>
                  ) : (
                    t("submit")
                  )}
                </button>
                <p className="text-xs leading-relaxed text-smoke">{t("policy")}</p>
              </div>
            </div>
          </aside>
        </m.form>
      )}
    </AnimatePresence>
  );
}

function SummaryRow({ label, value, ltr, icon }: { label: string; value: string; ltr?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-dashed border-white/10 pb-3">
      <dt className="flex items-center gap-1.5 text-smoke">
        {icon}
        {label}
      </dt>
      <dd className="text-end text-cream" dir={ltr ? "ltr" : undefined}>
        {value}
      </dd>
    </div>
  );
}

function ErrorText({ id, message }: { id: string; message: string }) {
  const t = useTranslations("Errors");
  return (
    <p id={id} role="alert" className="mt-3 text-xs font-medium text-ember-soft">
      {t.has(message) ? t(message) : t("required")}
    </p>
  );
}
