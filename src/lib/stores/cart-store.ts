"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { lineKey, type Selections } from "@/lib/pricing";

export interface CartLine {
  key: string;
  dishId: string;
  quantity: number;
  selections: Selections;
}

interface CartState {
  lines: CartLine[];
  promo: string | null;
  isOpen: boolean;
  hydrated: boolean;
  add: (dishId: string, quantity: number, selections: Selections) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  setPromo: (promo: string | null) => void;
  open: () => void;
  close: () => void;
  setOpen: (open: boolean) => void;
}

const MAX_QTY = 20;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      promo: null,
      isOpen: false,
      hydrated: false,
      add: (dishId, quantity, selections) =>
        set((state) => {
          const key = lineKey(dishId, selections);
          const existing = state.lines.find((line) => line.key === key);
          if (existing) {
            return {
              lines: state.lines.map((line) =>
                line.key === key
                  ? { ...line, quantity: Math.min(MAX_QTY, line.quantity + quantity) }
                  : line,
              ),
            };
          }
          return { lines: [...state.lines, { key, dishId, quantity, selections }] };
        }),
      setQuantity: (key, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((line) => line.key !== key)
              : state.lines.map((line) =>
                  line.key === key ? { ...line, quantity: Math.min(MAX_QTY, quantity) } : line,
                ),
        })),
      remove: (key) => set((state) => ({ lines: state.lines.filter((line) => line.key !== key) })),
      clear: () => set({ lines: [], promo: null }),
      setPromo: (promo) => set({ promo }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      setOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: "ember-saffron-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines, promo: state.promo }),
      skipHydration: true,
      onRehydrateStorage: () => () => {
        useCartStore.setState({ hydrated: true });
      },
    },
  ),
);

export function selectItemCount(state: CartState) {
  return state.lines.reduce((sum, line) => sum + line.quantity, 0);
}
