import { z } from "zod";

const LegacyProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string().default(""),
  barcode: z.string().default(""),
  category: z.string().default("All"),
  supplier: z.string().default(""),
  price: z.number().nonnegative(),
  cost: z.number().nonnegative().default(0),
  stockByBranch: z.record(z.string(), z.number()).optional(),
  stock: z.number().optional(),
  unit: z.string().default("pcs"),
  status: z.string().default("Активный"),
  favorite: z.boolean().default(false),
}).passthrough();

const LegacyCustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string().default(""),
  total: z.number().default(0),
  debt: z.number().default(0),
  prepayment: z.number().default(0),
  loyalty: z.string().default(""),
  history: z.array(z.string()).default([]),
}).passthrough();

const LegacyCartLineSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  qty: z.number(),
  discount: z.number().default(0),
}).passthrough();

export const LegacyStateSchema = z.object({
  branches: z.array(z.object({ id: z.string(), name: z.string() })).default([]),
  branchId: z.string().default("b1"),
  products: z.array(LegacyProductSchema).default([]),
  clients: z.array(LegacyCustomerSchema).default([]),
  employees: z.array(z.object({
    id: z.string(),
    name: z.string(),
    role: z.string().default("Cashier"),
    status: z.string().default("Active"),
  }).passthrough()).default([]),
  sales: z.array(z.record(z.string(), z.unknown())).default([]),
  cart: z.array(LegacyCartLineSchema).default([]),
  register: z.object({
    id: z.string().default("REG-01"),
    branchId: z.string().default("b1"),
    open: z.boolean().default(false),
    shiftId: z.string().default(""),
    cashierId: z.string().default(""),
    openingAmount: z.number().default(0),
    expectedCash: z.number().default(0),
    openedAt: z.string().default(""),
    openedIso: z.string().default(""),
  }).passthrough().default(() => ({
    id: "REG-01",
    branchId: "b1",
    open: false,
    shiftId: "",
    cashierId: "",
    openingAmount: 0,
    expectedCash: 0,
    openedAt: "",
    openedIso: "",
  })),
  config: z.object({
    locale: z.string().default("en"),
    theme: z.string().default("light"),
    fiscalization: z.boolean().default(true),
    online: z.boolean().default(true),
    fiscalPending: z.number().default(0),
  }).passthrough().default(() => ({
    locale: "en",
    theme: "light",
    fiscalization: true,
    online: true,
    fiscalPending: 0,
  })),
  registerMode: z.string().default("full"),
  orgEntitlements: z.record(z.string(), z.boolean()).default({}),
  registerEntitlements: z.record(z.string(), z.boolean()).default({}),
  receiptDiscount: z.number().default(0),
  payment: z.string().default("Cash"),
  customerId: z.string().default("c1"),
  category: z.string().default("All"),
  search: z.string().default(""),
  sidebarCollapsed: z.boolean().default(true),
  checkoutMobileView: z.string().default("products"),
  holds: z.array(z.record(z.string(), z.unknown())).default([]),
  stockMoves: z.array(z.record(z.string(), z.unknown())).default([]),
}).passthrough();

export type LegacyState = z.infer<typeof LegacyStateSchema>;
