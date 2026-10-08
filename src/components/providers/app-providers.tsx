"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { useCartStore } from "@/lib/stores/cart-store";
import { useOrderStore } from "@/lib/stores/order-store";
import { SmoothScroll } from "./smooth-scroll";

const loadMotionFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

export function AppProviders({ children, dir }: { children: ReactNode; dir: "ltr" | "rtl" }) {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    void useOrderStore.persist.rehydrate();
  }, []);

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>
        <SmoothScroll />
        {children}
        <Toaster
          dir={dir}
          position="top-center"
          offset={88}
          mobileOffset={80}
          theme="dark"
          toastOptions={{
            classNames: {
              toast: "!bg-ink-3 !border-white/10 !text-cream !rounded-xl !font-sans !shadow-2xl",
              description: "!text-smoke",
            },
          }}
        />
      </MotionConfig>
    </LazyMotion>
  );
}
