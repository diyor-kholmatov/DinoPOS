import { beforeEach, describe, expect, it } from "vitest";
import { completeSale } from "@/features/checkout/model/complete-sale";
import { seedCustomers, seedEmployees, seedProducts, seedStores } from "@/lib/legacy/seed";
import { useCatalogStore } from "@/stores/catalog-store";
import { useCheckoutStore } from "@/stores/checkout-store";
import { useCustomerStore } from "@/stores/customer-store";
import { useSalesStore } from "@/stores/sales-store";
import { useSessionStore } from "@/stores/session-store";

describe("completeSale", () => {
  beforeEach(() => {
    localStorage.clear();
    useCatalogStore.setState({
      products: seedProducts.map((product) => ({
        ...product,
        stockByStore: { ...product.stockByStore },
      })),
      heldByProduct: {},
      stockMovements: [],
    });
    useCustomerStore.setState({
      customers: seedCustomers.map((customer) => ({ ...customer, receiptHistory: [] })),
      transactions: [],
    });
    useSalesStore.setState({ sales: [] });
    useCheckoutStore.setState({
      cart: [{ productId: "p1", name: "Espresso", unitPrice: 25000, quantity: 2, lineDiscount: 0 }],
      selectedCustomerId: "c1",
      receiptDiscount: 0,
      paymentMethod: "cash",
      search: "",
      category: "all",
      mobileView: "products",
      drafts: [],
    });
    useSessionStore.setState({
      stores: seedStores,
      selectedStoreId: "b1",
      employees: seedEmployees,
      register: {
        id: "REG-01",
        storeId: "b1",
        isOpen: true,
        shiftId: "SH-TEST",
        cashierId: "e1",
        openingAmount: 100000,
        expectedCash: 100000,
        openedAt: "2026-08-18T08:00:00.000Z",
      },
      registerMode: "full",
      entitlements: { fiscalization: true },
      fiscalization: true,
      online: true,
      fiscalPending: 0,
      locale: "en",
      theme: "light",
      navigationExpanded: false,
      mobileNavigationOpen: false,
    });
  });

  it("completes one atomic sale across stock, customer, register, and receipt history", () => {
    const result = completeSale();
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.sale.total).toBe(56000);
    expect(useCatalogStore.getState().products[0]?.stockByStore.b1).toBe(38);
    expect(useCatalogStore.getState().stockMovements).toHaveLength(1);
    expect(useCustomerStore.getState().customers[0]?.totalSpent).toBe(seedCustomers[0]!.totalSpent + 56000);
    expect(useCustomerStore.getState().customers[0]?.receiptHistory[0]).toBe(result.sale.receiptNumber);
    expect(useSessionStore.getState().register.expectedCash).toBe(156000);
    expect(useSalesStore.getState().sales[0]?.id).toBe(result.sale.id);
    expect(useCheckoutStore.getState().cart).toEqual([]);
  });

  it("blocks payment without changing data when the shift is closed", () => {
    useSessionStore.setState((state) => ({ register: { ...state.register, isOpen: false } }));
    expect(completeSale()).toEqual({ ok: false, code: "shift_closed" });
    expect(useCatalogStore.getState().products[0]?.stockByStore.b1).toBe(40);
    expect(useSalesStore.getState().sales).toEqual([]);
  });
});
