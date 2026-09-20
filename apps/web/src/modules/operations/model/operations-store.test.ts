import { beforeEach, describe, expect, it } from "vitest";
import { useCatalogStore } from "@/stores/catalog-store";
import { useOperationsStore } from "@/stores/operations-store";

describe("operations state", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("moves stock atomically between stores and records both movements", () => {
    const product = useCatalogStore.getState().products.find((item) => item.unit === "pcs");
    expect(product).toBeDefined();
    if (!product) return;

    const sourceBefore = product.stockByStore.b1 ?? 0;
    const destinationBefore = product.stockByStore.b2 ?? 0;
    const moved = useCatalogStore.getState().transferStock(product.id, "b1", "b2", 1, "Test cashier");

    expect(moved).toBe(true);
    const updated = useCatalogStore.getState().products.find((item) => item.id === product.id);
    expect(updated?.stockByStore.b1).toBe(sourceBefore - 1);
    expect(updated?.stockByStore.b2).toBe(destinationBefore + 1);
    expect(useCatalogStore.getState().stockMovements.slice(0, 2).map((item) => item.type)).toEqual([
      "transfer_out",
      "transfer_in",
    ]);
  });

  it("never accepts a transfer larger than available stock", () => {
    const product = useCatalogStore.getState().products.find((item) => item.unit === "pcs");
    expect(product).toBeDefined();
    if (!product) return;
    const available = product.stockByStore.b1 ?? 0;
    expect(useCatalogStore.getState().transferStock(product.id, "b1", "b2", available + 1, "Test cashier")).toBe(false);
  });

  it("keeps operational records immutable when their status changes", () => {
    const transfer = useOperationsStore.getState().transfers[0];
    expect(transfer).toBeDefined();
    if (!transfer) return;
    const previous = { ...transfer };
    useOperationsStore.getState().updateTransferStatus(transfer.id, "accepted");
    expect(previous.status).toBe(transfer.status);
    expect(useOperationsStore.getState().transfers.find((item) => item.id === transfer.id)?.status).toBe("accepted");
  });
});
