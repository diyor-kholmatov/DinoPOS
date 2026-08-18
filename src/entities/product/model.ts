import { z } from "zod";

export const ProductUnitSchema = z.enum(["pcs", "service"]);

export const ProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  sku: z.string(),
  barcode: z.string(),
  category: z.string(),
  supplier: z.string(),
  price: z.number().nonnegative(),
  cost: z.number().nonnegative(),
  stockByStore: z.record(z.string(), z.number().nonnegative()),
  unit: ProductUnitSchema,
  favorite: z.boolean(),
  active: z.boolean(),
});

export type Product = z.infer<typeof ProductSchema>;

export function physicalStock(product: Product, storeId: string): number {
  return product.unit === "service" ? Number.POSITIVE_INFINITY : product.stockByStore[storeId] ?? 0;
}

export function availableStock(
  product: Product,
  storeId: string,
  heldQuantity: number,
): number {
  if (product.unit === "service") return Number.POSITIVE_INFINITY;
  return Math.max(0, physicalStock(product, storeId) - heldQuantity);
}

