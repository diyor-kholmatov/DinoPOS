import { describe, expect, it } from "vitest";
import { calculateTotals } from "@/features/checkout/model/totals";

describe("calculateTotals", () => {
  const cart = [{
    productId: "p1",
    name: "Espresso",
    unitPrice: 25000,
    quantity: 2,
    lineDiscount: 10,
  }];

  it("applies line and receipt discounts before fiscal tax", () => {
    expect(calculateTotals(cart, 20, true)).toEqual({
      subtotal: 45000,
      discount: 9000,
      tax: 4320,
      total: 40320,
    });
  });

  it("does not create tax for a non-fiscal receipt", () => {
    expect(calculateTotals(cart, 0, false)).toEqual({
      subtotal: 45000,
      discount: 0,
      tax: 0,
      total: 45000,
    });
  });
});
