import { describe, expect, it } from "vitest";
import { LEGACY_BACKUP_KEY, LEGACY_STORAGE_KEY, loadBootstrap, migrateLegacyState } from "@/lib/legacy/migrate";

describe("legacy migration", () => {
  const legacy = {
    branches: [{ id: "b1", name: "Downtown Store" }],
    branchId: "b1",
    products: [{ id: "p1", name: "Espresso", price: 25000, stock: 12 }],
    clients: [{ id: "c1", name: "Emily Carter" }],
    sales: [{
      id: "sale-1",
      receipt: "R-10482",
      date: "2024-05-20T11:42:00.000Z",
      branchId: "b1",
      cashier: "Liam Johnson",
      customer: "Emily Carter",
      customerId: "c1",
      items: [{ id: "p1", name: "Espresso", qty: 2, price: 25000 }],
      subtotal: 50000,
      discount: 0,
      tax: 6000,
      total: 56000,
      payment: "Cash",
      fiscalized: true,
      fiscalId: "FISC-1",
    }],
  };

  it("maps historical receipts into the typed sales store", () => {
    const migrated = migrateLegacyState(legacy);
    expect(migrated.migrationError).toBeNull();
    expect(migrated.sales).toHaveLength(1);
    expect(migrated.sales[0]).toMatchObject({
      receiptNumber: "R-10482",
      customerId: "c1",
      paymentMethod: "cash",
      total: 56000,
    });
  });

  it("keeps an untouched backup before migration", () => {
    const storage = window.localStorage;
    storage.clear();
    storage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(legacy));
    loadBootstrap(storage);
    expect(storage.getItem(LEGACY_BACKUP_KEY)).toBe(JSON.stringify(legacy));
  });
});
