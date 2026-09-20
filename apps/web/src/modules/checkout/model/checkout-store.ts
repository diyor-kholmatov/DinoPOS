import type { Product } from "@/entities/product/model";
import type { CartLine, PaymentMethod } from "@/entities/sale/model";
import { bootstrap } from "@/lib/legacy/bootstrap";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CheckoutDraft {
  id: string;
  createdAt: string;
  storeId: string;
  customerId: string;
  receiptDiscount: number;
  paymentMethod: PaymentMethod;
  cart: CartLine[];
}

interface CheckoutState {
  cart: CartLine[];
  selectedCustomerId: string;
  receiptDiscount: number;
  paymentMethod: PaymentMethod;
  search: string;
  category: string;
  mobileView: "products" | "cart";
  drafts: CheckoutDraft[];
  addProduct: (product: Product, available: number) => boolean;
  changeQuantity: (productId: string, quantity: number, available: number) => boolean;
  removeLine: (productId: string) => void;
  setSelectedCustomer: (customerId: string) => void;
  setReceiptDiscount: (discount: number) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setMobileView: (mobileView: "products" | "cart") => void;
  saveDraft: (storeId: string) => boolean;
  restoreDraft: (draftId: string) => boolean;
  deleteDraft: (draftId: string) => void;
  clearCart: () => void;
  clearAfterSale: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      cart: bootstrap.cart,
      selectedCustomerId: bootstrap.selectedCustomerId,
      receiptDiscount: bootstrap.receiptDiscount,
      paymentMethod: bootstrap.paymentMethod,
      search: "",
      category: "all",
      mobileView: "products",
      drafts: [],
      addProduct: (product, available) => {
        const existing = get().cart.find((line) => line.productId === product.id);
        const nextQuantity = (existing?.quantity ?? 0) + 1;
        if (!product.active || nextQuantity > available) return false;
        set((state) => ({
          cart: existing
            ? state.cart.map((line) => line.productId === product.id
                ? { ...line, quantity: nextQuantity }
                : line)
            : [...state.cart, {
                productId: product.id,
                name: product.name,
                unitPrice: product.price,
                quantity: 1,
                lineDiscount: 0,
              }],
        }));
        return true;
      },
      changeQuantity: (productId, quantity, available) => {
        if (quantity < 1 || quantity > available) return false;
        set((state) => ({
          cart: state.cart.map((line) => line.productId === productId
            ? { ...line, quantity }
            : line),
        }));
        return true;
      },
      removeLine: (productId) => set((state) => ({
        cart: state.cart.filter((line) => line.productId !== productId),
      })),
      setSelectedCustomer: (selectedCustomerId) => set({ selectedCustomerId }),
      setReceiptDiscount: (receiptDiscount) => set({
        receiptDiscount: Math.min(100, Math.max(0, receiptDiscount)),
      }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      setSearch: (search) => set({ search }),
      setCategory: (category) => set({ category }),
      setMobileView: (mobileView) => set({ mobileView }),
      saveDraft: (storeId) => {
        const state = get();
        if (!state.cart.length) return false;
        const draft: CheckoutDraft = {
          id: `draft-${crypto.randomUUID()}`,
          createdAt: new Date().toISOString(),
          storeId,
          customerId: state.selectedCustomerId,
          receiptDiscount: state.receiptDiscount,
          paymentMethod: state.paymentMethod,
          cart: state.cart.map((line) => ({ ...line })),
        };
        set({
          drafts: [draft, ...state.drafts],
          cart: [],
          receiptDiscount: 0,
          mobileView: "products",
        });
        return true;
      },
      restoreDraft: (draftId) => {
        const draft = get().drafts.find((item) => item.id === draftId);
        if (!draft) return false;
        set((state) => ({
          cart: draft.cart.map((line) => ({ ...line })),
          selectedCustomerId: draft.customerId,
          receiptDiscount: draft.receiptDiscount,
          paymentMethod: draft.paymentMethod,
          drafts: state.drafts.filter((item) => item.id !== draftId),
          mobileView: "cart",
        }));
        return true;
      },
      deleteDraft: (draftId) => set((state) => ({
        drafts: state.drafts.filter((item) => item.id !== draftId),
      })),
      clearCart: () => set({ cart: [], receiptDiscount: 0 }),
      clearAfterSale: () => set({ cart: [], receiptDiscount: 0 }),
    }),
    {
      name: "dinopos-v6-checkout",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        selectedCustomerId: state.selectedCustomerId,
        receiptDiscount: state.receiptDiscount,
        paymentMethod: state.paymentMethod,
        drafts: state.drafts,
      }),
    },
  ),
);
