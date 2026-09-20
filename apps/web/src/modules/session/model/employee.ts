import { z } from "zod";

export const EmployeeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string(),
  active: z.boolean(),
});

export type Employee = z.infer<typeof EmployeeSchema>;

