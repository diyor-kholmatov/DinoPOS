import { z } from "zod";

export const PaymentMethodSchema = z.enum([
  "cash",
  "card",
  "qr",
  "transfer",
  "debt",
  "prepayment",
]);

export const CartLineSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  unitPrice: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  lineDiscount: z.number().min(0).max(100),
});

export const SaleSchema = z.object({
  id: z.string().min(1),
  receiptNumber: z.string().min(1),
  createdAt: z.string(),
  storeId: z.string().min(1),
  registerId: z.string().min(1),
  shiftId: z.string(),
  cashierName: z.string().min(1),
  customerId: z.string().min(1),
  customerName: z.string().min(1),
  lines: z.array(CartLineSchema).min(1),
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  total: z.number().nonnegative(),
  paymentMethod: PaymentMethodSchema,
  fiscalized: z.boolean(),
  fiscalId: z.string(),
  status: z.literal("completed"),
});

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type CartLine = z.infer<typeof CartLineSchema>;
export type Sale = z.infer<typeof SaleSchema>;

