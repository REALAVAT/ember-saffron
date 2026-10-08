import { useLocale, useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { InstagramIcon, LogoMark, TikTokIcon, WhatsAppIcon } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { localize } from "@/lib/i18n-data";
import { NewsletterForm } from "./newsletter-form";
import { navItems } from "./nav-items";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");
  const locale = useLocale();
  const { address, contact, hours, social, author } = siteConfig;

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-ink-2">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-ember/10 blur-[120px]"
      />
      <div className="container-x relative grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            <LogoMark className="size-10 text-saffron" />
            <span className="font-[family-name:var(--font-fraunces)] text-2xl text-cream">
              Ember <span className="text-saffron italic">&amp;</span> Saffron
            </span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-smoke">{t("tagline")}</p>
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-cream">{t("newsletter")}</h2>
            <p className="mt-2 mb-4 max-w-sm text-sm text-smoke">{t("newsletterText")}</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="lg:col-span-2 lg:col-start-6">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-saffron uppercase rtl:tracking-normal">
            {t("explore")}
          </h2>
          <ul className="mt-5 space-y-3 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-cream/80 transition-colors hover:text-saffron">
                  {nav(item.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/checkout" className="text-cream/80 transition-colors hover:text-saffron">
                {nav("order")}
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-saffron uppercase rtl:tracking-normal">
            {t("visit")}
          </h2>
          <address className="mt-5 space-y-1 text-sm text-cream/80 not-italic">
            <p>{localize(address.street, locale)}</p>
            <p>
              {localize(address.city, locale)}, {localize(address.country, locale)}
            </p>
            <p className="pt-3">
              <a href={contact.phoneHref} className="hover:text-saffron" dir="ltr">
                {contact.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${contact.email}`} className="hover:text-saffron">
                {contact.email}
              </a>
            </p>
          </address>
          <dl className="mt-5 space-y-2 text-sm">
            {hours.map((slot) => (
              <div key={slot.opens + slot.closes} className="flex justify-between gap-4">
                <dt className="text-smoke">{localize(slot.days, locale)}</dt>
                <dd className="text-cream/80 tabular-nums" dir="ltr">
                  {slot.opens} – {slot.closes}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-saffron uppercase rtl:tracking-normal">
            {t("follow")}
          </h2>
          <ul className="mt-5 flex gap-3">
            <li>
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid size-11 place-items-center rounded-full border border-cream/15 text-cream/80 transition-colors hover:border-saffron hover:text-saffron"
              >
                <InstagramIcon className="size-5" />
              </a>
            </li>
            <li>
              <a
                href={social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="grid size-11 place-items-center rounded-full border border-cream/15 text-cream/80 transition-colors hover:border-saffron hover:text-saffron"
              >
                <TikTokIcon className="size-5" />
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="grid size-11 place-items-center rounded-full border border-cream/15 text-cream/80 transition-colors hover:border-saffron hover:text-saffron"
              >
                <WhatsAppIcon className="size-5" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="container-x relative select-none overflow-hidden pb-4 font-[family-name:var(--font-fraunces)] text-[17vw] leading-[0.8] tracking-[-0.04em] text-cream/[0.05] lg:text-[14rem]"
        dir="ltr"
      >
        Ember&nbsp;<span className="italic">&amp;</span>&nbsp;Saffron
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-smoke md:flex-row md:items-center md:justify-between">
          <p>
            {t("rights", { year: siteConfig.copyrightYear })} {t("privacy")}
          </p>
          <p>
            {t("demo")}{" "}
            <a
              href={author.url}
              target="_blank"
              rel="noopener"
              className="font-semibold text-cream underline decoration-saffron/50 underline-offset-4 transition-colors hover:text-saffron"
            >
              {author.name} — {author.label}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
