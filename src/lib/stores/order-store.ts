"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartLine } from "./cart-store";
import type { CheckoutDetails } from "@/lib/schemas";
import type { Totals } from "@/lib/pricing";

export interface PlacedOrder {
  id: string;
  createdAt: number;
  details: CheckoutDetails;
  lines: CartLine[];
  totals: Totals;
  payment: "card" | "cash" | "stripe";
  cardLast4?: string;
  etaMinutes: number;
}

interface OrderState {
  lastOrder: PlacedOrder | null;
  hydrated: boolean;
  setLastOrder: (order: PlacedOrder) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      lastOrder: null,
      hydrated: false,
      setLastOrder: (lastOrder) => set({ lastOrder }),
    }),
    {
      name: "ember-saffron-last-order",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lastOrder: state.lastOrder }),
      skipHydration: true,
      onRehydrateStorage: () => () => {
        useOrderStore.setState({ hydrated: true });
      },
    },
  ),
);
