import "server-only";
import { Resend } from "resend";
import { siteConfig } from "@/config/site";

interface EmailRow {
  label: string;
  value: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderEmail({ heading, intro, rows, dir = "ltr" }: { heading: string; intro: string; rows: EmailRow[]; dir?: "ltr" | "rtl" }) {
  const body = rows
    .filter((row) => row.value)
    .map(
      (row) =>
        `<tr><td style="padding:8px 0;color:#a3978a;font-size:14px;width:40%">${escapeHtml(row.label)}</td><td style="padding:8px 0;color:#f4ecdf;font-size:14px">${escapeHtml(row.value)}</td></tr>`,
    )
    .join("");
  return `<!doctype html><html dir="${dir}"><body style="margin:0;background:#0b0908;font-family:Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0908;padding:40px 16px"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#131010;border:1px solid #2a2420;border-radius:16px;padding:36px">
<tr><td style="color:#e9b44c;font-size:12px;letter-spacing:3px;text-transform:uppercase">${escapeHtml(siteConfig.name)}</td></tr>
<tr><td style="padding-top:16px;color:#f4ecdf;font-size:28px;font-family:Georgia,serif">${escapeHtml(heading)}</td></tr>
<tr><td style="padding:12px 0 24px;color:#cfc2ae;font-size:15px;line-height:1.6">${escapeHtml(intro)}</td></tr>
<tr><td><table role="presentation" width="100%" style="border-top:1px solid #2a2420">${body}</table></td></tr>
<tr><td style="padding-top:28px;color:#a3978a;font-size:12px">${escapeHtml(localizeAddress())}</td></tr>
</table></td></tr></table></body></html>`;
}

function localizeAddress() {
  return `${siteConfig.address.street.en}, ${siteConfig.address.city.en} · ${siteConfig.contact.phone}`;
}

export function isEmailEnabled() {
  return Boolean(process.env.RESEND_API_KEY);
}

/** Sends through Resend when configured; otherwise reports demo mode. */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<"sent" | "demo"> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return "demo";
  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL ?? `${siteConfig.name} <onboarding@resend.dev>`;
  const { error } = await resend.emails.send({ from, to, subject, html, replyTo });
  if (error) throw new Error(error.message);
  return "sent";
}

export function restaurantInbox() {
  return process.env.RESTAURANT_EMAIL ?? null;
}
