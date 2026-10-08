"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/stores/cart-store";

const CartDrawer = dynamic(() => import("@/components/cart/cart-drawer").then((m) => m.CartDrawer), {
  ssr: false,
});
const CustomCursor = dynamic(() => import("./custom-cursor").then((m) => m.CustomCursor), { ssr: false });

/** Mounts interaction-only UI on demand so it stays out of the initial bundle. */
export function DeferredUi() {
  const cartOpen = useCartStore((s) => s.isOpen);
  const [cartRequested, setCartRequested] = useState(false);
  const [cursorRequested, setCursorRequested] = useState(false);

  if (cartOpen && !cartRequested) setCartRequested(true);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    const onMove = () => setCursorRequested(true);
    window.addEventListener("pointermove", onMove, { once: true, passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <>
      {cartRequested && <CartDrawer />}
      {cursorRequested && <CustomCursor />}
    </>
  );
}
