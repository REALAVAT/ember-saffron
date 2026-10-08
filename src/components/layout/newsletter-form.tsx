"use client";

import { ArrowRight, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState, type FormEvent } from "react";

export function NewsletterForm() {
  const t = useTranslations("Footer");
  const id = useId();
  const [done, setDone] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <p role="status" className="flex items-center gap-2 text-sm text-saffron">
        <Check className="size-4" aria-hidden="true" /> {t("subscribed")}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative max-w-sm" noValidate>
      <label htmlFor={id} className="sr-only">
        {t("emailPlaceholder")}
      </label>
      <input
        id={id}
        type="email"
        required
        autoComplete="email"
        placeholder={t("emailPlaceholder")}
        className="h-12 w-full rounded-full border border-cream/15 bg-white/[0.03] ps-5 pe-14 text-sm text-cream placeholder:text-smoke focus:border-saffron/70 focus:outline-none"
      />
      <button
        type="submit"
        aria-label={t("subscribe")}
        className="absolute end-1.5 top-1.5 grid size-9 place-items-center rounded-full bg-saffron text-ink transition-colors hover:bg-saffron-soft"
      >
        <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
      </button>
    </form>
  );
}
