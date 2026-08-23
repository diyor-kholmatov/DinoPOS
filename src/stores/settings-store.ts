import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CompanyProfile {
  businessName: string;
  businessType: string;
  phone: string;
  address: string;
}

interface SettingsState {
  company: CompanyProfile;
  paymentMethods: Record<"cash" | "card" | "qr" | "transfer", boolean>;
  receipt: { showLogo: boolean; showCustomer: boolean; showTax: boolean; message: string };
  taxRate: number;
  serviceFee: number;
  rounding: "none" | "nearest100";
  permissions: Record<string, boolean>;
  updateCompany: (company: CompanyProfile) => void;
  togglePaymentMethod: (method: keyof SettingsState["paymentMethods"], enabled: boolean) => void;
  updateReceipt: (receipt: Partial<SettingsState["receipt"]>) => void;
  updateTaxes: (taxRate: number, serviceFee: number, rounding: SettingsState["rounding"]) => void;
  togglePermission: (permission: string, enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      company: { businessName: "DinoPOS", businessType: "Retail", phone: "+998 90 123 4567", address: "123 Amir Temur Avenue, Tashkent" },
      paymentMethods: { cash: true, card: true, qr: true, transfer: true },
      receipt: { showLogo: true, showCustomer: true, showTax: true, message: "Thank you for your purchase!" },
      taxRate: 12,
      serviceFee: 0,
      rounding: "none",
      permissions: { discounts: true, returns: false, cash_operations: false, stock_adjustments: false },
      updateCompany: (company) => set({ company }),
      togglePaymentMethod: (method, enabled) => set((state) => ({ paymentMethods: { ...state.paymentMethods, [method]: enabled } })),
      updateReceipt: (receipt) => set((state) => ({ receipt: { ...state.receipt, ...receipt } })),
      updateTaxes: (taxRate, serviceFee, rounding) => set({ taxRate, serviceFee, rounding }),
      togglePermission: (permission, enabled) => set((state) => ({ permissions: { ...state.permissions, [permission]: enabled } })),
    }),
    { name: "dinopos-v6-settings", version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);
