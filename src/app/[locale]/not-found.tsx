import { useTranslations } from "next-intl";
import { cta } from "@/components/ui/cta";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");
  const tc = useTranslations("Common");

  return (
    <section className="grain relative flex min-h-[85svh] items-center overflow-hidden pt-[var(--header-height)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/15 blur-[140px]"
      />
      <div className="container-x relative text-center">
        <p className="display text-[clamp(6rem,22vw,16rem)] leading-none text-gradient" dir="ltr">
          404
        </p>
        <h1 className="display mt-4 text-4xl text-cream sm:text-5xl">{t("title")}</h1>
        <p className="mx-auto mt-4 max-w-md text-smoke">{t("text")}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className={cta({ size: "lg" })}>
            {tc("backHome")}
          </Link>
          <Link href="/menu" className={cta({ variant: "outline", size: "lg" })}>
            {tc("viewMenu")}
          </Link>
        </div>
      </div>
    </section>
  );
}
