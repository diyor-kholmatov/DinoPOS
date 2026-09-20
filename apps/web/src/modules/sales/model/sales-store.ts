import type { Sale } from "@/entities/sale/model";
import { bootstrap } from "@/lib/legacy/bootstrap";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SalesState {
  sales: Sale[];
  addSale: (sale: Sale) => void;
}

export const useSalesStore = create<SalesState>()(
  persist(
    (set) => ({
      sales: bootstrap.sales,
      addSale: (sale) => set((state) => ({ sales: [sale, ...state.sales] })),
    }),
    {
      name: "dinopos-v6-sales",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

