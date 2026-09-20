import type { Sale } from "@/modules/sales/model/sale";
import { bootstrap } from "@/shared/legacy/bootstrap";
import { STORAGE_KEYS } from "@/shared/config/storage-keys";
import { getBrowserStorage } from "@/shared/persistence/storage";
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
      name: STORAGE_KEYS.sales,
      version: 1,
      storage: createJSONStorage(getBrowserStorage),
    },
  ),
);
