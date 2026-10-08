import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { z } from "zod";
import { siteConfig } from "@/config/site";
import { isAppLocale, routing } from "@/i18n/routing";
import { reservationSchema } from "@/lib/schemas";
import { isDateWithin } from "@/lib/server/dates";
import { renderEmail, restaurantInbox, sendEmail } from "@/lib/server/email";
import { createReference } from "@/lib/server/ids";

const requestSchema = reservationSchema.extend({ locale: z.string() });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid", issues: z.flattenError(parsed.error).fieldErrors }, { status: 400 });
  }

  const { locale: rawLocale, ...reservation } = parsed.data;
  if (!isDateWithin(reservation.date, 60)) {
    return NextResponse.json({ ok: false, error: "invalid", issues: { date: ["futureDate"] } }, { status: 400 });
  }

  const locale = isAppLocale(rawLocale) ? rawLocale : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Reservations" });
  const reference = createReference("ES");

  const rows = [
    { label: t("reference"), value: reference },
    { label: t("date"), value: reservation.date },
    { label: t("time"), value: reservation.time },
    { label: t("guests"), value: String(reservation.guests) },
    { label: t("occasion"), value: t(`occasions.${reservation.occasion}`) },
    { label: t("name"), value: reservation.name },
    { label: t("phone"), value: reservation.phone },
    { label: t("requests"), value: reservation.requests },
  ];

  try {
    const delivery = await sendEmail({
      to: reservation.email,
      subject: `${t("successTitle", { name: reservation.name })} — ${siteConfig.name}`,
      html: renderEmail({
        heading: t("successTitle", { name: reservation.name }),
        intro: t("policy"),
        rows,
        dir: locale === "ar" ? "rtl" : "ltr",
      }),
      replyTo: siteConfig.contact.email,
    });

    const inbox = restaurantInbox();
    if (delivery === "sent" && inbox) {
      await sendEmail({
        to: inbox,
        subject: `New reservation ${reference} — ${reservation.date} ${reservation.time} (${reservation.guests})`,
        html: renderEmail({ heading: `Reservation ${reference}`, intro: reservation.email, rows }),
        replyTo: reservation.email,
      });
    }

    return NextResponse.json({ ok: true, reference, mode: delivery });
  } catch (error) {
    console.error("Reservation email failed", error);
    return NextResponse.json({ ok: false, error: "email" }, { status: 502 });
  }
}
