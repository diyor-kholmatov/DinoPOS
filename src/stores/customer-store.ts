import type { Customer } from "@/entities/customer/model";
import type { PaymentMethod } from "@/entities/sale/model";
import { bootstrap } from "@/lib/legacy/bootstrap";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CustomerTransaction {
  id: string;
  customerId: string;
  type: "debt" | "prepayment_spend";
  amount: number;
  receiptNumber: string;
  createdAt: string;
}

interface CustomerState {
  customers: Customer[];
  transactions: CustomerTransaction[];
  applySale: (
    customerId: string,
    total: number,
    paymentMethod: PaymentMethod,
    receiptNumber: string,
    createdAt: string,
  ) => void;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      customers: bootstrap.customers,
      transactions: [],
      applySale: (customerId, total, paymentMethod, receiptNumber, createdAt) => {
        set((state) => {
          const transactions = [...state.transactions];
          if (paymentMethod === "debt" || paymentMethod === "prepayment") {
            transactions.unshift({
              id: `CTX-${crypto.randomUUID()}`,
              customerId,
              type: paymentMethod === "debt" ? "debt" : "prepayment_spend",
              amount: paymentMethod === "debt" ? total : -total,
              receiptNumber,
              createdAt,
            });
          }
          const customers = state.customers.map((customer) => customer.id === customerId
            ? {
                ...customer,
                totalSpent: customer.totalSpent + total,
                debt: customer.debt + (paymentMethod === "debt" ? total : 0),
                prepayment: customer.prepayment - (paymentMethod === "prepayment" ? total : 0),
                receiptHistory: [receiptNumber, ...customer.receiptHistory],
              }
            : customer);
          return { customers, transactions };
        });
      },
    }),
    {
      name: "dinopos-v6-customers",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

