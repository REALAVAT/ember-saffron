"use client";

import { AnimatePresence, m, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

interface CursorImagePreviewProps {
  image: { src: string; key: string } | null;
  width?: number;
  height?: number;
}

/** Floating image that trails the pointer. Desktop-only via CSS; purely decorative. */
export function CursorImagePreview({ image, width = 300, height = 380 }: CursorImagePreviewProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-30 hidden [@media(hover:hover)_and_(pointer:fine)]:block"
      style={{ x: sx, y: sy, width, height, translateX: "-50%", translateY: "-50%" }}
    >
      <AnimatePresence mode="popLayout">
        {image && (
          <m.div
            key={image.key}
            initial={{ opacity: 0, scale: 0.85, rotate: -4, clipPath: "inset(100% 0 0 0)" }}
            animate={{ opacity: 1, scale: 1, rotate: 0, clipPath: "inset(0% 0 0 0)" }}
            exit={{ opacity: 0, scale: 0.9, rotate: 3 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 overflow-hidden rounded-2xl shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] ring-1 ring-white/10"
          >
            <Image src={image.src} alt="" fill sizes={`${width}px`} className="object-cover" />
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}
