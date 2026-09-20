import { SaleSchema, type Sale } from "@/entities/sale/model";
import { calculateTotals } from "@/features/checkout/model/totals";
import { useCatalogStore, validateCartStock } from "@/stores/catalog-store";
import { useCheckoutStore } from "@/stores/checkout-store";
import { useCustomerStore } from "@/stores/customer-store";
import { useSalesStore } from "@/stores/sales-store";
import {
  currentCashier,
  fiscalizationEnabled,
  useSessionStore,
} from "@/stores/session-store";

export type SaleFailureCode =
  | "empty_cart"
  | "shift_closed"
  | "customer_missing"
  | "insufficient_prepayment"
  | "stock_changed";

export type CompleteSaleResult =
  | { ok: true; sale: Sale }
  | { ok: false; code: SaleFailureCode; productId?: string };

export function completeSale(): CompleteSaleResult {
  const checkout = useCheckoutStore.getState();
  const session = useSessionStore.getState();
  const customerState = useCustomerStore.getState();

  if (!checkout.cart.length) return { ok: false, code: "empty_cart" };
  if (session.registerMode === "full" && !session.register.isOpen) {
    return { ok: false, code: "shift_closed" };
  }

  const customer = customerState.customers.find(
    (item) => item.id === checkout.selectedCustomerId,
  );
  if (!customer) return { ok: false, code: "customer_missing" };

  const totals = calculateTotals(
    checkout.cart,
    checkout.receiptDiscount,
    fiscalizationEnabled(),
  );
  if (checkout.paymentMethod === "prepayment" && customer.prepayment < totals.total) {
    return { ok: false, code: "insufficient_prepayment" };
  }

  const unavailableProduct = validateCartStock(checkout.cart, session.selectedStoreId);
  if (unavailableProduct) {
    return { ok: false, code: "stock_changed", productId: unavailableProduct };
  }

  const createdAt = new Date().toISOString();
  const cashier = currentCashier() ?? session.employees[0];
  const fiscalEnabled = fiscalizationEnabled();
  const fiscalized = fiscalEnabled && session.online;
  const receiptNumber = `R-${10500 + useSalesStore.getState().sales.length}`;
  const sale = SaleSchema.parse({
    id: `sale-${crypto.randomUUID()}`,
    receiptNumber,
    createdAt,
    storeId: session.selectedStoreId,
    registerId: session.register.id,
    shiftId: session.register.shiftId,
    cashierName: cashier?.name ?? "Unknown cashier",
    customerId: customer.id,
    customerName: customer.name,
    lines: checkout.cart,
    ...totals,
    paymentMethod: checkout.paymentMethod,
    fiscalized,
    fiscalId: fiscalized ? `FISC-${Date.now().toString().slice(-6)}` : "",
    status: "completed",
  });

  useCatalogStore.getState().applySaleStock(
    sale.lines,
    sale.storeId,
    sale.cashierName,
    createdAt,
  );
  customerState.applySale(
    customer.id,
    sale.total,
    sale.paymentMethod,
    receiptNumber,
    createdAt,
  );
  session.recordPayment(sale.total, sale.paymentMethod, fiscalEnabled && !session.online);
  useSalesStore.getState().addSale(sale);
  checkout.clearAfterSale();
  return { ok: true, sale };
}

