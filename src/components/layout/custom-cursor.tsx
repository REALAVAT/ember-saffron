"use client";

import { m, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

type CursorMode = "default" | "hover" | "label" | "hidden";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const frame = requestAnimationFrame(() => setEnabled(true));

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      const target = event.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        const value = labelled.dataset.cursor ?? "";
        if (value === "hide") {
          setMode("hidden");
        } else {
          setMode("label");
          setLabel(value);
        }
        return;
      }
      if (target?.closest("a, button, [role='button'], input, select, textarea, label")) {
        setMode("hover");
      } else {
        setMode("default");
      }
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = mode === "label" ? 88 : mode === "hover" ? 56 : 32;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <m.div
        className="absolute top-0 left-0 flex items-center justify-center rounded-full border border-saffron/70 text-[0.65rem] font-semibold tracking-[0.2em] text-ink uppercase mix-blend-normal"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          opacity: visible && mode !== "hidden" ? 1 : 0,
          backgroundColor: mode === "label" ? "rgb(233 180 76 / 0.95)" : mode === "hover" ? "rgb(233 180 76 / 0.12)" : "rgb(233 180 76 / 0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        {mode === "label" && label}
      </m.div>
      <m.div
        className="absolute top-0 left-0 size-1.5 rounded-full bg-saffron"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible && mode === "default" ? 1 : 0 }}
      />
    </div>
  );
}
