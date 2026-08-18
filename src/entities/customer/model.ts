import { z } from "zod";

export const CustomerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  phone: z.string(),
  totalSpent: z.number().nonnegative(),
  debt: z.number().nonnegative(),
  prepayment: z.number().nonnegative(),
  loyalty: z.string(),
  receiptHistory: z.array(z.string()),
});

export type Customer = z.infer<typeof CustomerSchema>;

