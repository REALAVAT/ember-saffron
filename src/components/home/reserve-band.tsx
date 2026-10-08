import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { RevealText } from "@/components/motion/reveal-text";
import { Reveal } from "@/components/motion/reveal";
import { cta } from "@/components/ui/cta";
import { images } from "@/data/images";
import { Link } from "@/i18n/navigation";

export function ReserveBand() {
  const t = useTranslations("Hero");
  const tc = useTranslations("Common");

  return (
    <section className="relative isolate overflow-hidden">
      <ParallaxImage
        src={images.grillFire}
        alt=""
        sizes="100vw"
        className="absolute inset-0 -z-10"
        strength={24}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/75 to-ink/30 rtl:bg-gradient-to-l" />
      <div className="container-x py-28 sm:py-40">
        <RevealText
          text={`${t("titleLine1")} ${t("titleLine2")} ${t("titleLine3")}`}
          className="display max-w-3xl text-5xl leading-[1.02] text-cream sm:text-7xl"
        />
        <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-3">
          <Link href="/reservations" className={cta({ variant: "ember", size: "lg" })}>
            {tc("reserveTable")}
          </Link>
          <Link href="/menu" className={cta({ variant: "outline", size: "lg" })}>
            {tc("orderOnline")}
            <ArrowRight className="rtl:rotate-180" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
