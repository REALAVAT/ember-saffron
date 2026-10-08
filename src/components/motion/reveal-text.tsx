"use client";

import { m } from "framer-motion";
import { createElement, type ElementType } from "react";
import { cn } from "@/lib/utils";

interface RevealTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Animate immediately on mount instead of on scroll. */
  immediate?: boolean;
}

/**
 * Splits by words (never letters) so Arabic ligatures stay intact.
 */
export function RevealText({ text, as = "h2", className, delay = 0, immediate }: RevealTextProps) {
  const words = text.split(" ");
  const trigger = immediate
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { once: true, margin: "0px 0px -10% 0px" } };

  return createElement(
    as,
    { className: cn(className) },
    <span className="sr-only">{text}</span>,
    <m.span initial="hidden" {...trigger} aria-hidden="true" className="inline">
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <m.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", rotate: 4 },
              visible: {
                y: "0%",
                rotate: 0,
                transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: delay + index * 0.06 },
              },
            }}
          >
            {word}
          </m.span>
          {index < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </m.span>,
  );
}
