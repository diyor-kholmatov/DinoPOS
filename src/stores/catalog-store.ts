import { availableStock, type Product } from "@/entities/product/model";
import type { CartLine } from "@/entities/sale/model";
import { bootstrap } from "@/lib/legacy/bootstrap";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  storeId: string;
  type: "sale";
  quantity: number;
  actor: string;
  createdAt: string;
}

interface CatalogState {
  products: Product[];
  heldByProduct: Record<string, number>;
  stockMovements: StockMovement[];
  applySaleStock: (lines: CartLine[], storeId: string, actor: string, createdAt: string) => void;
}

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set) => ({
      products: bootstrap.products,
      heldByProduct: bootstrap.heldByProduct,
      stockMovements: [],
      applySaleStock: (lines, storeId, actor, createdAt) => {
        set((state) => {
          const soldByProduct = new Map(lines.map((line) => [line.productId, line.quantity]));
          const movements: StockMovement[] = [];
          const products = state.products.map((product) => {
            const sold = soldByProduct.get(product.id);
            if (!sold || product.unit === "service") return product;
            movements.push({
              id: `SM-${crypto.randomUUID()}`,
              productId: product.id,
              productName: product.name,
              storeId,
              type: "sale",
              quantity: -sold,
              actor,
              createdAt,
            });
            return {
              ...product,
              stockByStore: {
                ...product.stockByStore,
                [storeId]: Math.max(0, (product.stockByStore[storeId] ?? 0) - sold),
              },
            };
          });
          return { products, stockMovements: [...movements, ...state.stockMovements] };
        });
      },
    }),
    {
      name: "dinopos-v6-catalog",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function productAvailability(product: Product, storeId: string): number {
  const held = useCatalogStore.getState().heldByProduct[product.id] ?? 0;
  return availableStock(product, storeId, held);
}

export function validateCartStock(lines: CartLine[], storeId: string): string | null {
  const state = useCatalogStore.getState();
  for (const line of lines) {
    const product = state.products.find((item) => item.id === line.productId);
    if (!product || !product.active) return line.productId;
    if (line.quantity > productAvailability(product, storeId)) return product.id;
  }
  return null;
}

