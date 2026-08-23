import type { PaymentMethod } from "@/entities/sale/model";
import type { Employee } from "@/entities/shift/model";
import type { Store } from "@/entities/store/model";
import type { LocaleCode } from "@/lib/format";
import { bootstrap } from "@/lib/legacy/bootstrap";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SessionState {
  stores: Store[];
  selectedStoreId: string;
  employees: Employee[];
  register: typeof bootstrap.register;
  registerMode: typeof bootstrap.registerMode;
  entitlements: Record<string, boolean>;
  fiscalization: boolean;
  online: boolean;
  fiscalPending: number;
  locale: LocaleCode;
  theme: "light" | "dark";
  navigationExpanded: boolean;
  mobileNavigationOpen: boolean;
  setSelectedStore: (storeId: string) => boolean;
  openShift: (cashierId: string, openingAmount: number) => void;
  closeShift: () => typeof bootstrap.register | null;
  adjustExpectedCash: (amount: number) => void;
  recordPayment: (total: number, paymentMethod: PaymentMethod, queueFiscal: boolean) => void;
  setFiscalization: (enabled: boolean) => void;
  setOnline: (online: boolean) => void;
  setRegisterMode: (mode: "basic" | "full") => boolean;
  addEmployee: (employee: Employee) => void;
  setLocale: (locale: LocaleCode) => void;
  toggleTheme: () => void;
  toggleNavigation: () => void;
  setMobileNavigationOpen: (open: boolean) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      stores: bootstrap.stores,
      selectedStoreId: bootstrap.selectedStoreId,
      employees: bootstrap.employees,
      register: bootstrap.register,
      registerMode: bootstrap.registerMode,
      entitlements: bootstrap.entitlements,
      fiscalization: bootstrap.fiscalization,
      online: bootstrap.online,
      fiscalPending: bootstrap.fiscalPending,
      locale: bootstrap.locale,
      theme: bootstrap.theme,
      navigationExpanded: bootstrap.navigationExpanded,
      mobileNavigationOpen: false,
      setSelectedStore: (storeId) => {
        if (get().register.isOpen || !get().stores.some((store) => store.id === storeId)) {
          return false;
        }
        set((state) => ({
          selectedStoreId: storeId,
          register: { ...state.register, storeId },
        }));
        return true;
      },
      openShift: (cashierId, openingAmount) => {
        const now = new Date().toISOString();
        set((state) => ({
          register: {
            ...state.register,
            storeId: state.selectedStoreId,
            isOpen: true,
            shiftId: `SH-${Date.now().toString().slice(-6)}`,
            cashierId,
            openingAmount,
            expectedCash: openingAmount,
            openedAt: now,
          },
        }));
      },
      closeShift: () => {
        const current = get().register;
        if (!current.isOpen) return null;
        set((state) => ({
          register: {
            ...state.register,
            isOpen: false,
            shiftId: "",
            cashierId: "",
            openingAmount: 0,
            expectedCash: 0,
            openedAt: "",
          },
        }));
        return current;
      },
      adjustExpectedCash: (amount) => set((state) => ({
        register: {
          ...state.register,
          expectedCash: Math.max(0, state.register.expectedCash + amount),
        },
      })),
      recordPayment: (total, paymentMethod, queueFiscal) => {
        set((state) => ({
          register: paymentMethod === "cash"
            ? { ...state.register, expectedCash: state.register.expectedCash + total }
            : state.register,
          fiscalPending: state.fiscalPending + (queueFiscal ? 1 : 0),
        }));
      },
      setFiscalization: (fiscalization) => set({ fiscalization }),
      setOnline: (online) => set({ online }),
      setRegisterMode: (registerMode) => {
        if (get().register.isOpen) return false;
        set({ registerMode });
        return true;
      },
      addEmployee: (employee) => set((state) => ({ employees: [...state.employees, employee] })),
      setLocale: (locale) => set({ locale }),
      toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
      toggleNavigation: () => set((state) => ({ navigationExpanded: !state.navigationExpanded })),
      setMobileNavigationOpen: (mobileNavigationOpen) => set({ mobileNavigationOpen }),
    }),
    {
      name: "dinopos-v6-session",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedStoreId: state.selectedStoreId,
        register: state.register,
        fiscalization: state.fiscalization,
        online: state.online,
        fiscalPending: state.fiscalPending,
        locale: state.locale,
        theme: state.theme,
        navigationExpanded: state.navigationExpanded,
      }),
    },
  ),
);

export function currentCashier(): Employee | undefined {
  const state = useSessionStore.getState();
  return state.employees.find((employee) => employee.id === state.register.cashierId);
}

export function fiscalizationEnabled(): boolean {
  const state = useSessionStore.getState();
  return state.fiscalization && state.entitlements.fiscalization !== false;
}
