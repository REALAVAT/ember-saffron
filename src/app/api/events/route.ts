import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { z } from "zod";
import { siteConfig } from "@/config/site";
import { isAppLocale, routing } from "@/i18n/routing";
import { eventInquirySchema } from "@/lib/schemas";
import { isDateWithin } from "@/lib/server/dates";
import { renderEmail, restaurantInbox, sendEmail } from "@/lib/server/email";
import { createReference } from "@/lib/server/ids";

const requestSchema = eventInquirySchema.extend({ locale: z.string() });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid", issues: z.flattenError(parsed.error).fieldErrors }, { status: 400 });
  }

  const { locale: rawLocale, ...inquiry } = parsed.data;
  if (!isDateWithin(inquiry.date, 730)) {
    return NextResponse.json({ ok: false, error: "invalid", issues: { date: ["futureDate"] } }, { status: 400 });
  }

  const locale = isAppLocale(rawLocale) ? rawLocale : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Events" });
  const reference = createReference("EV");

  const rows = [
    { label: "Reference", value: reference },
    { label: t("eventType"), value: t(`eventTypes.${inquiry.eventType}`) },
    { label: t("date"), value: inquiry.date },
    { label: t("guests"), value: String(inquiry.guests) },
    { label: t("budget"), value: t(`budgets.${inquiry.budget}`) },
    { label: t("name"), value: inquiry.name },
    { label: t("phone"), value: inquiry.phone },
    { label: t("company"), value: inquiry.company },
    { label: t("message"), value: inquiry.message },
  ];

  try {
    const delivery = await sendEmail({
      to: inquiry.email,
      subject: `${t("successTitle", { name: inquiry.name })} — ${siteConfig.name}`,
      html: renderEmail({
        heading: t("successTitle", { name: inquiry.name }),
        intro: t("successText"),
        rows,
        dir: locale === "ar" ? "rtl" : "ltr",
      }),
      replyTo: siteConfig.contact.email,
    });

    const inbox = restaurantInbox();
    if (delivery === "sent" && inbox) {
      await sendEmail({
        to: inbox,
        subject: `New event enquiry ${reference} — ${inquiry.eventType}, ${inquiry.guests} guests`,
        html: renderEmail({ heading: `Event enquiry ${reference}`, intro: inquiry.email, rows }),
        replyTo: inquiry.email,
      });
    }

    return NextResponse.json({ ok: true, reference, mode: delivery });
  } catch (error) {
    console.error("Event enquiry email failed", error);
    return NextResponse.json({ ok: false, error: "email" }, { status: 502 });
  }
}
