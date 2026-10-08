import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";
import { isAppLocale, routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/checkout">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isAppLocale(raw) ? raw : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    locale,
    path: "/checkout",
    title: t("checkoutTitle"),
    description: t("checkoutDescription"),
    noIndex: true,
  });
}

export default async function CheckoutPage({ params }: PageProps<"/[locale]/checkout">) {
  const { locale: raw } = await params;
  const locale = isAppLocale(raw) ? raw : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Checkout" });
  const common = await getTranslations({ locale, namespace: "Common" });
  const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

  return (
    <section className="relative overflow-hidden pt-[calc(var(--header-height)+3rem)] pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 start-1/4 size-[36rem] rounded-full bg-ember/10 blur-[140px]"
      />
      <div className="container-x relative">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="display mt-4 text-5xl text-cream sm:text-6xl">{t("title")}</h1>
        {!stripeEnabled && (
          <p className="mt-5 inline-flex rounded-full border border-saffron/25 bg-saffron/5 px-4 py-2 text-xs text-saffron">
            {common("demoNotice")}
          </p>
        )}
        <div className="mt-12">
          <CheckoutFlow stripeEnabled={stripeEnabled} />
        </div>
      </div>
    </section>
  );
}
