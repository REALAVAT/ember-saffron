import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { OrderConfirmation } from "@/components/checkout/order-confirmation";
import { isAppLocale, routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/order/confirmation">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isAppLocale(raw) ? raw : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({
    locale,
    path: "/order/confirmation",
    title: t("confirmationTitle"),
    description: t("confirmationDescription"),
    noIndex: true,
  });
}

export default function ConfirmationPage() {
  return (
    <section className="relative overflow-hidden pt-[calc(var(--header-height)+3rem)] pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 end-1/4 size-[36rem] rounded-full bg-saffron/10 blur-[140px]"
      />
      <div className="container-x relative">
        <OrderConfirmation />
      </div>
    </section>
  );
}
