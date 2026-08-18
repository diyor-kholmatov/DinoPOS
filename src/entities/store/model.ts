import { z } from "zod";

export const StoreSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export type Store = z.infer<typeof StoreSchema>;

