import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHero({ eyebrow, title, subtitle, image, children, className }: PageHeroProps) {
  return (
    <section
      className={cn(
        "grain relative isolate flex min-h-[56svh] items-end overflow-hidden pt-[calc(var(--header-height)+4rem)] pb-14 sm:min-h-[62svh] sm:pb-20",
        className,
      )}
    >
      {image && (
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <Image
            src={image}
            alt=""
            fill
            preload
            fetchPriority="high"
            sizes="100vw"
            className="animate-slow-zoom object-cover"
          />
        </div>
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_100%,rgb(232_87_42/0.25),transparent_60%)]" />
      <div className="container-x">
        <p className="fade-up eyebrow" style={{ "--delay": "0.1s" } as CSSProperties}>
          {eyebrow}
        </p>
        <h1 className="display mt-5 max-w-4xl text-[clamp(2.75rem,7vw,6rem)] leading-[0.98] text-cream">
          <span className="rise-line">
            <span style={{ "--delay": "0.2s" } as CSSProperties}>{title}</span>
          </span>
        </h1>
        {subtitle && (
          <p
            className="fade-up mt-6 max-w-2xl text-base leading-relaxed text-cream/75 sm:text-lg"
            style={{ "--delay": "0.45s" } as CSSProperties}
          >
            {subtitle}
          </p>
        )}
        {children && (
          <div className="fade-up mt-8" style={{ "--delay": "0.6s" } as CSSProperties}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
