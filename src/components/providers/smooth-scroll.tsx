"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

let instance: Lenis | null = null;

export function scrollToTarget(target: string | HTMLElement | number, offset = 0) {
  if (instance) {
    instance.scrollTo(target, { offset, duration: 1.2 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (el instanceof HTMLElement) {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      wheelMultiplier: 0.9,
      prevent: (node) => Boolean(node.closest?.("[role='dialog'], [data-lenis-prevent]")),
    });
    instance = lenis;

    const isLocked = () => {
      const html = document.documentElement;
      const body = document.body;
      return (
        getComputedStyle(html).overflow === "hidden" ||
        getComputedStyle(body).overflow === "hidden" ||
        html.hasAttribute("data-base-ui-scroll-locked")
      );
    };
    const observer = new MutationObserver(() => {
      if (isLocked()) lenis.stop();
      else lenis.start();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class", "data-base-ui-scroll-locked"] });
    observer.observe(document.body, { attributes: true, attributeFilter: ["style", "class"] });

    return () => {
      observer.disconnect();
      lenis.destroy();
      instance = null;
    };
  }, []);

  useEffect(() => {
    instance?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
