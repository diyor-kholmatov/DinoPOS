import type { Customer } from "@/entities/customer/model";
import type { Product } from "@/entities/product/model";
import type { Register, RegisterMode } from "@/entities/register/model";
import { SaleSchema, type CartLine, type PaymentMethod, type Sale } from "@/entities/sale/model";
import type { Employee } from "@/entities/shift/model";
import type { Store } from "@/entities/store/model";
import type { LocaleCode } from "@/lib/format";
import { LegacyStateSchema, type LegacyState } from "@/lib/legacy/schema";
import {
  seedCustomers,
  seedEmployees,
  seedProducts,
  seedRegister,
  seedSales,
  seedStores,
} from "@/lib/legacy/seed";

export const LEGACY_STORAGE_KEY = "retailos-unified-brief-v5-i18n";
export const LEGACY_BACKUP_KEY = "dinopos-v5-backup";
export const MIGRATION_MANIFEST_KEY = "dinopos-v6";

export interface BootstrapState {
  source: "legacy" | "seed";
  migrationError: string | null;
  stores: Store[];
  selectedStoreId: string;
  products: Product[];
  heldByProduct: Record<string, number>;
  customers: Customer[];
  employees: Employee[];
  register: Register;
  registerMode: RegisterMode;
  entitlements: Record<string, boolean>;
  cart: CartLine[];
  selectedCustomerId: string;
  receiptDiscount: number;
  paymentMethod: PaymentMethod;
  locale: LocaleCode;
  theme: "light" | "dark";
  navigationExpanded: boolean;
  fiscalization: boolean;
  online: boolean;
  fiscalPending: number;
  sales: Sale[];
}

const paymentMap: Record<string, PaymentMethod> = {
  Cash: "cash",
  Card: "card",
  QR: "qr",
  Transfer: "transfer",
  Debt: "debt",
  Prepayment: "prepayment",
};

function seedBootstrap(error: string | null = null): BootstrapState {
  return {
    source: "seed",
    migrationError: error,
    stores: seedStores,
    selectedStoreId: "b1",
    products: seedProducts,
    heldByProduct: {},
    customers: seedCustomers,
    employees: seedEmployees,
    register: seedRegister,
    registerMode: "full",
    entitlements: {
      cash_shift: true,
      cash_operations: true,
      fiscalization: true,
      shift_close_count: true,
      register_history: true,
    },
    cart: [],
    selectedCustomerId: "c1",
    receiptDiscount: 0,
    paymentMethod: "cash",
    locale: "en",
    theme: "light",
    navigationExpanded: false,
    fiscalization: true,
    online: true,
    fiscalPending: 0,
    sales: seedSales,
  };
}

function mapHeldQuantities(holds: LegacyState["holds"]): Record<string, number> {
  const totals: Record<string, number> = {};

  for (const hold of holds) {
    if (hold.status !== "Активна" && hold.status !== "active") continue;
    if (!Array.isArray(hold.lines)) continue;
    for (const value of hold.lines) {
      if (!value || typeof value !== "object") continue;
      const line = value as Record<string, unknown>;
      if (typeof line.id !== "string" || typeof line.qty !== "number") continue;
      totals[line.id] = (totals[line.id] ?? 0) + line.qty;
    }
  }

  return totals;
}

function mapLegacySales(
  legacySales: LegacyState["sales"],
  customers: Customer[],
  products: Product[],
  fallbackStoreId: string,
): Sale[] {
  return legacySales.flatMap((legacy, index) => {
    const rawLines = Array.isArray(legacy.items) ? legacy.items : [];
    const lines: CartLine[] = rawLines.flatMap((value) => {
      if (!value || typeof value !== "object") return [];
      const line = value as Record<string, unknown>;
      const productId = typeof line.id === "string" ? line.id : "";
      const product = products.find((item) => item.id === productId);
      const name = typeof line.name === "string" ? line.name : product?.name;
      const unitPrice = typeof line.price === "number" ? line.price : product?.price;
      const quantity = typeof line.qty === "number" ? Math.max(1, Math.floor(line.qty)) : 1;
      const lineDiscount = typeof line.discount === "number"
        ? Math.min(100, Math.max(0, line.discount))
        : 0;
      return productId && name && unitPrice !== undefined
        ? [{ productId, name, unitPrice, quantity, lineDiscount }]
        : [];
    });
    if (!lines.length) return [];

    const customerName = typeof legacy.customer === "string" ? legacy.customer : "Walk-in";
    const matchedCustomer = customers.find((customer) => customer.id === legacy.customerId)
      ?? customers.find((customer) => customer.name === customerName)
      ?? customers[0];
    if (!matchedCustomer) return [];

    const subtotal = typeof legacy.subtotal === "number"
      ? legacy.subtotal
      : lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
    const discount = typeof legacy.discount === "number" ? legacy.discount : 0;
    const tax = typeof legacy.tax === "number" ? legacy.tax : 0;
    const total = typeof legacy.total === "number" ? legacy.total : subtotal - discount + tax;
    const parsed = SaleSchema.safeParse({
      id: typeof legacy.id === "string" ? legacy.id : `legacy-sale-${index + 1}`,
      receiptNumber: typeof legacy.receipt === "string" ? legacy.receipt : `LEGACY-${index + 1}`,
      createdAt: typeof legacy.date === "string" ? legacy.date : "1970-01-01T00:00:00.000Z",
      storeId: typeof legacy.branchId === "string" ? legacy.branchId : fallbackStoreId,
      registerId: typeof legacy.registerId === "string" ? legacy.registerId : "REG-01",
      shiftId: typeof legacy.shiftId === "string" ? legacy.shiftId : "",
      cashierName: typeof legacy.cashier === "string" ? legacy.cashier : "System",
      customerId: matchedCustomer.id,
      customerName,
      lines,
      subtotal,
      discount,
      tax,
      total,
      paymentMethod: paymentMap[String(legacy.payment)] ?? "cash",
      fiscalized: legacy.fiscalized === true,
      fiscalId: typeof legacy.fiscalId === "string" ? legacy.fiscalId : "",
      status: "completed",
    });
    return parsed.success ? [parsed.data] : [];
  });
}

export function migrateLegacyState(input: unknown): BootstrapState {
  const result = LegacyStateSchema.safeParse(input);
  if (!result.success) {
    return seedBootstrap(result.error.issues.map((issue) => issue.message).join("; "));
  }

  const legacy = result.data;
  const stores = legacy.branches.length ? legacy.branches : seedStores;
  const products: Product[] = legacy.products.length
    ? legacy.products.map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        barcode: product.barcode,
        category: product.category,
        supplier: product.supplier,
        price: product.price,
        cost: product.cost,
        stockByStore: product.stockByBranch ?? { b1: product.stock ?? 0 },
        unit: product.unit === "service" ? "service" : "pcs",
        favorite: product.favorite,
        active: !["Неактивный", "inactive"].includes(product.status),
      }))
    : seedProducts;

  const customers: Customer[] = legacy.clients.length
    ? legacy.clients.map((customer) => ({
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        totalSpent: customer.total,
        debt: customer.debt,
        prepayment: customer.prepayment,
        loyalty: customer.loyalty,
        receiptHistory: customer.history,
      }))
    : seedCustomers;

  const employees: Employee[] = legacy.employees.length
    ? legacy.employees.map((employee) => ({
        id: employee.id,
        name: employee.name,
        role: employee.role,
        active: employee.status === "Active" || employee.status === "Активный",
      }))
    : seedEmployees;

  const register: Register = {
    id: legacy.register.id,
    storeId: legacy.register.branchId || legacy.branchId,
    isOpen: legacy.register.open,
    shiftId: legacy.register.shiftId,
    cashierId: legacy.register.cashierId,
    openingAmount: legacy.register.openingAmount,
    expectedCash: legacy.register.expectedCash,
    openedAt: legacy.register.openedIso || legacy.register.openedAt,
  };

  const locale = ["en", "ru", "uz"].includes(legacy.config.locale)
    ? legacy.config.locale as LocaleCode
    : "en";

  const selectedStoreId = stores.some((store) => store.id === legacy.branchId)
    ? legacy.branchId
    : stores[0]?.id ?? "b1";

  return {
    source: "legacy",
    migrationError: null,
    stores,
    selectedStoreId,
    products,
    heldByProduct: mapHeldQuantities(legacy.holds),
    customers,
    employees,
    register,
    registerMode: legacy.registerMode === "basic" ? "basic" : "full",
    entitlements: {
      ...legacy.orgEntitlements,
      ...legacy.registerEntitlements,
    },
    cart: legacy.cart.map((line) => ({
      productId: line.id,
      name: line.name,
      unitPrice: line.price,
      quantity: Math.max(1, Math.floor(line.qty)),
      lineDiscount: Math.min(100, Math.max(0, line.discount)),
    })),
    selectedCustomerId: customers.some((customer) => customer.id === legacy.customerId)
      ? legacy.customerId
      : customers[0]?.id ?? "c1",
    receiptDiscount: Math.min(100, Math.max(0, legacy.receiptDiscount)),
    paymentMethod: paymentMap[legacy.payment] ?? "cash",
    locale,
    theme: legacy.config.theme === "dark" ? "dark" : "light",
    navigationExpanded: !legacy.sidebarCollapsed,
    fiscalization: legacy.config.fiscalization,
    online: legacy.config.online,
    fiscalPending: legacy.config.fiscalPending,
    sales: mapLegacySales(legacy.sales, customers, products, selectedStoreId),
  };
}

export function loadBootstrap(storage?: Storage): BootstrapState {
  if (!storage) return seedBootstrap();
  const raw = storage.getItem(LEGACY_STORAGE_KEY);
  if (!raw) return seedBootstrap();

  if (!storage.getItem(LEGACY_BACKUP_KEY)) {
    storage.setItem(LEGACY_BACKUP_KEY, raw);
  }

  try {
    const migrated = migrateLegacyState(JSON.parse(raw) as unknown);
    if (!migrated.migrationError) {
      storage.setItem(MIGRATION_MANIFEST_KEY, JSON.stringify({
        version: 6,
        migratedAt: new Date().toISOString(),
        source: LEGACY_STORAGE_KEY,
      }));
    }
    return migrated;
  } catch (error) {
    return seedBootstrap(error instanceof Error ? error.message : "Legacy data could not be read");
  }
}
