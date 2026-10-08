import { ArrowDown, ArrowRight, Clock } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cta } from "@/components/ui/cta";
import { images } from "@/data/images";
import { Link } from "@/i18n/navigation";

export function Hero() {
  const t = useTranslations("Hero");
  const tc = useTranslations("Common");

  return (
    <section className="grain relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 sm:pb-20 lg:items-center lg:pb-0">
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <Image
          src={images.hero}
          alt=""
          fill
          preload
          fetchPriority="high"
          quality={75}
          sizes="100vw"
          className="animate-slow-zoom object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/55 to-ink/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent rtl:bg-gradient-to-l" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_80%,rgb(232_87_42/0.28),transparent_55%)] rtl:bg-[radial-gradient(ellipse_at_80%_80%,rgb(232_87_42/0.28),transparent_55%)]" />

      <div className="container-x relative w-full pt-32">
        <p className="fade-up eyebrow" style={{ "--delay": "0.2s" } as React.CSSProperties}>
          {t("eyebrow")}
        </p>
        <h1 className="display mt-6 max-w-5xl text-[clamp(3rem,10vw,8.75rem)] leading-[0.92] text-cream">
          <span className="rise-line">
            <span style={{ "--delay": "0.25s" } as React.CSSProperties}>{t("titleLine1")}</span>
          </span>
          <span className="rise-line">
            <span className="text-gradient italic" style={{ "--delay": "0.38s" } as React.CSSProperties}>
              {t("titleLine2")}
            </span>
          </span>
          <span className="rise-line">
            <span style={{ "--delay": "0.51s" } as React.CSSProperties}>{t("titleLine3")}</span>
          </span>
        </h1>
        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="fade-up max-w-xl" style={{ "--delay": "0.8s" } as React.CSSProperties}>
            <p className="text-base leading-relaxed text-cream/80 sm:text-lg">{t("subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/reservations" className={cta({ size: "lg" })}>
                {tc("reserveTable")}
              </Link>
              <Link href="/menu" className={cta({ variant: "outline", size: "lg" })}>
                {tc("orderOnline")}
                <ArrowRight className="transition-transform group-hover/cta:translate-x-1 rtl:rotate-180 rtl:group-hover/cta:-translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="fade-up flex items-center gap-6" style={{ "--delay": "1s" } as React.CSSProperties}>
            <p className="inline-flex items-center gap-2 rounded-full whitespace-nowrap border border-white/10 bg-ink/40 px-4 py-2 text-sm text-cream/85 backdrop-blur-md">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              <Clock className="size-3.5 text-smoke" aria-hidden="true" />
              {t("openNow")}
            </p>
            <a
              href="#story"
              className="hidden items-center gap-3 text-xs tracking-[0.3em] text-smoke uppercase transition-colors hover:text-saffron lg:inline-flex rtl:tracking-normal"
            >
              <span className="grid size-11 place-items-center rounded-full border border-white/15">
                <ArrowDown className="size-4 animate-bounce motion-reduce:animate-none" aria-hidden="true" />
              </span>
              {tc("scroll")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
