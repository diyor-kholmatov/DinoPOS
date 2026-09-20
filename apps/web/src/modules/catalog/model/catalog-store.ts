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
  type: "sale" | "adjustment" | "transfer_out" | "transfer_in" | "return";
  quantity: number;
  actor: string;
  createdAt: string;
}

interface CatalogState {
  products: Product[];
  heldByProduct: Record<string, number>;
  stockMovements: StockMovement[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  adjustStock: (productId: string, storeId: string, quantity: number, actor: string) => boolean;
  transferStock: (
    productId: string,
    sourceStoreId: string,
    destinationStoreId: string,
    quantity: number,
    actor: string,
  ) => boolean;
  reserveHeldStock: (lines: Array<{ productId: string; quantity: number }>) => void;
  releaseHeldStock: (lines: Array<{ productId: string; quantity: number }>) => void;
  applySaleStock: (lines: CartLine[], storeId: string, actor: string, createdAt: string) => void;
}

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set) => ({
      products: bootstrap.products,
      heldByProduct: bootstrap.heldByProduct,
      stockMovements: [],
      addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
      updateProduct: (product) => set((state) => ({
        products: state.products.map((item) => item.id === product.id ? product : item),
      })),
      adjustStock: (productId, storeId, quantity, actor) => {
        const product = useCatalogStore.getState().products.find((item) => item.id === productId);
        if (!product || product.unit === "service") return false;
        const nextStock = (product.stockByStore[storeId] ?? 0) + quantity;
        if (nextStock < 0) return false;
        const createdAt = new Date().toISOString();
        set((state) => ({
          products: state.products.map((item) => item.id === productId ? {
            ...item,
            active: nextStock > 0 || item.active,
            stockByStore: { ...item.stockByStore, [storeId]: nextStock },
          } : item),
          stockMovements: [{
            id: `SM-${crypto.randomUUID()}`,
            productId,
            productName: product.name,
            storeId,
            type: "adjustment",
            quantity,
            actor,
            createdAt,
          }, ...state.stockMovements],
        }));
        return true;
      },
      transferStock: (productId, sourceStoreId, destinationStoreId, quantity, actor) => {
        const product = useCatalogStore.getState().products.find((item) => item.id === productId);
        if (!product || product.unit === "service" || sourceStoreId === destinationStoreId || quantity < 1) {
          return false;
        }
        const sourceStock = product.stockByStore[sourceStoreId] ?? 0;
        if (sourceStock < quantity) return false;
        const createdAt = new Date().toISOString();
        set((state) => ({
          products: state.products.map((item) => item.id === productId ? {
            ...item,
            stockByStore: {
              ...item.stockByStore,
              [sourceStoreId]: sourceStock - quantity,
              [destinationStoreId]: (item.stockByStore[destinationStoreId] ?? 0) + quantity,
            },
          } : item),
          stockMovements: [
            {
              id: `SM-${crypto.randomUUID()}`,
              productId,
              productName: product.name,
              storeId: sourceStoreId,
              type: "transfer_out",
              quantity: -quantity,
              actor,
              createdAt,
            },
            {
              id: `SM-${crypto.randomUUID()}`,
              productId,
              productName: product.name,
              storeId: destinationStoreId,
              type: "transfer_in",
              quantity,
              actor,
              createdAt,
            },
            ...state.stockMovements,
          ],
        }));
        return true;
      },
      reserveHeldStock: (lines) => set((state) => {
        const heldByProduct = { ...state.heldByProduct };
        for (const line of lines) {
          heldByProduct[line.productId] = (heldByProduct[line.productId] ?? 0) + line.quantity;
        }
        return { heldByProduct };
      }),
      releaseHeldStock: (lines) => set((state) => {
        const heldByProduct = { ...state.heldByProduct };
        for (const line of lines) {
          heldByProduct[line.productId] = Math.max(0, (heldByProduct[line.productId] ?? 0) - line.quantity);
        }
        return { heldByProduct };
      }),
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
