"use client";

import { AnimatePresence, m, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CartButton } from "@/components/cart/cart-button";
import { LogoMark } from "@/components/icons";
import { cta } from "@/components/ui/cta";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { navItems } from "./nav-items";

export function SiteHeader() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);

  if (mobileOpen && openedAt !== pathname) {
    setMobileOpen(false);
  }

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    const pinned = pathname.startsWith("/menu");
    setHidden(!pinned && latest > 240 && latest > previous && !mobileOpen);
  });

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <m.header
        initial={false}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || mobileOpen
            ? "border-b border-white/[0.06] bg-ink/75 backdrop-blur-xl"
            : "border-b border-transparent bg-gradient-to-b from-ink/70 to-transparent",
        )}
      >
        <div className="container-x flex h-[var(--header-height)] items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex items-center gap-3 text-cream"
            aria-label={`Ember & Saffron — ${t("home")}`}
          >
            <LogoMark className="size-9 text-saffron transition-transform duration-500 group-hover:rotate-[20deg]" />
            <span className="font-[family-name:var(--font-fraunces)] text-lg leading-none tracking-tight sm:text-xl">
              Ember <span className="text-saffron italic">&amp;</span> Saffron
            </span>
          </Link>

          <nav aria-label={t("primary")} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.slice(1).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm font-medium text-cream/80 transition-colors hover:text-cream",
                      "after:absolute after:inset-x-4 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-saffron after:transition-transform after:duration-500 hover:after:scale-x-100 rtl:after:origin-right",
                      isActive(item.href) && "text-saffron after:scale-x-100",
                    )}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <CartButton />
            <Link href="/reservations" className={cta({ size: "sm", className: "hidden md:inline-flex" })}>
              {t("reserve")}
            </Link>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full border border-cream/15 text-cream lg:hidden"
              onClick={() => {
                setOpenedAt(pathname);
                setMobileOpen((open) => !open);
              }}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </m.header>

      <AnimatePresence>
        {mobileOpen && (
          <m.div
            id="mobile-nav"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="grain fixed inset-0 z-40 flex flex-col bg-ink-2 pt-[var(--header-height)] lg:hidden"
            data-lenis-prevent
          >
            <nav aria-label={t("primary")} className="container-x flex flex-1 flex-col justify-center gap-2">
              {navItems.map((item, index) => (
                <m.div
                  key={item.href}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.07, duration: 0.6 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "display block py-2 text-5xl text-cream sm:text-6xl",
                      isActive(item.href) && "text-saffron",
                    )}
                  >
                    {t(item.key)}
                  </Link>
                </m.div>
              ))}
            </nav>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="container-x flex flex-wrap items-center gap-3 pb-10"
            >
              <Link href="/reservations" onClick={() => setMobileOpen(false)} className={cta({ size: "lg" })}>
                {t("reserve")}
              </Link>
              <Link href="/menu" onClick={() => setMobileOpen(false)} className={cta({ variant: "outline", size: "lg" })}>
                {t("order")}
              </Link>
              <LanguageSwitcher />
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
