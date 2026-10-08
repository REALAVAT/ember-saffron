"use client";

import { m } from "framer-motion";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { WhatsAppIcon } from "@/components/icons";

export function WhatsAppButton() {
  const t = useTranslations("WhatsApp");
  const href = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(t("message"))}`;

  return (
    <m.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("label")}
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.6, type: "spring", stiffness: 260, damping: 20 }}
      className="group fixed end-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-[#062b14] shadow-[0_12px_40px_-10px_rgb(37_211_102/0.6)] transition-transform hover:scale-105 sm:end-6 sm:bottom-6"
      data-cursor="hide"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.8s] motion-reduce:hidden"
      />
      <WhatsAppIcon className="size-6" />
    </m.a>
  );
}
