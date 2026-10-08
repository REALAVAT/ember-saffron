"use client";

import { m } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

let hasMounted = false;

export default function Template({ children }: { children: ReactNode }) {
  // Only animate client-side navigations so the first paint is never hidden.
  const [animate] = useState(() => typeof window !== "undefined" && hasMounted);

  useEffect(() => {
    hasMounted = true;
  }, []);

  if (!animate) return <>{children}</>;

  return (
    <>
      <m.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[70] origin-top bg-ink-2"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-saffron to-transparent" />
      </m.div>
      <m.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </m.div>
    </>
  );
}
