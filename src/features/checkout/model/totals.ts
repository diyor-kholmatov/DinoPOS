import type { CartLine } from "@/entities/sale/model";

export interface CheckoutTotals {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export function calculateTotals(
  cart: CartLine[],
  receiptDiscountPercent: number,
  fiscalizationEnabled: boolean,
): CheckoutTotals {
  const subtotal = cart.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity * (1 - line.lineDiscount / 100),
    0,
  );
  const discount = subtotal * Math.min(100, Math.max(0, receiptDiscountPercent)) / 100;
  const taxable = subtotal - discount;
  const tax = fiscalizationEnabled ? taxable * 0.12 : 0;
  return {
    subtotal,
    discount,
    tax,
    total: Math.round(taxable + tax),
  };
}

