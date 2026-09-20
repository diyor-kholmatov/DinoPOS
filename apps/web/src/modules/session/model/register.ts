import { z } from "zod";

export const RegisterSchema = z.object({
  id: z.string().min(1),
  storeId: z.string().min(1),
  isOpen: z.boolean(),
  shiftId: z.string(),
  cashierId: z.string(),
  openingAmount: z.number().nonnegative(),
  expectedCash: z.number().nonnegative(),
  openedAt: z.string(),
});

export const RegisterModeSchema = z.enum(["basic", "full"]);

export type Register = z.infer<typeof RegisterSchema>;
export type RegisterMode = z.infer<typeof RegisterModeSchema>;

