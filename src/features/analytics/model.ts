import type { CalendarDate } from "@internationalized/date";
import type { RangeValue } from "react-aria-components";
import type { Product } from "@/entities/product/model";
import type { Sale } from "@/entities/sale/model";

export interface AnalyticsPoint {
  label: string;
  revenue: number;
  cost: number;
  profit: number;
  orders: number;
}

export function calendarDateToStart(value: CalendarDate): Date {
  return new Date(value.year, value.month - 1, value.day, 0, 0, 0, 0);
}

export function calendarDateToEnd(value: CalendarDate): Date {
  return new Date(value.year, value.month - 1, value.day, 23, 59, 59, 999);
}

export function filterSales(
  sales: Sale[],
  stores: string[],
  range: RangeValue<CalendarDate>,
): Sale[] {
  const start = calendarDateToStart(range.start).getTime();
  const end = calendarDateToEnd(range.end).getTime();
  return sales.filter((sale) => {
    const time = new Date(sale.createdAt).getTime();
    return stores.includes(sale.storeId) && time >= start && time <= end;
  });
}

export function saleCost(sale: Sale, products: Product[]): number {
  return sale.lines.reduce((sum, line) => {
    const product = products.find((item) => item.id === line.productId);
    return sum + (product?.cost ?? 0) * line.quantity;
  }, 0);
}

export function aggregateSales(sales: Sale[], products: Product[], locale: string): AnalyticsPoint[] {
  const ordered = [...sales].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const days = new Map<string, AnalyticsPoint>();
  for (const sale of ordered) {
    const date = new Date(sale.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const cost = saleCost(sale, products);
    const existing = days.get(key) ?? {
      label: new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(date),
      revenue: 0,
      cost: 0,
      profit: 0,
      orders: 0,
    };
    existing.revenue += sale.total;
    existing.cost += cost;
    existing.profit += sale.total - cost;
    existing.orders += 1;
    days.set(key, existing);
  }
  return [...days.values()];
}

export function topProducts(sales: Sale[]): Array<{ name: string; value: number }> {
  const totals = new Map<string, number>();
  for (const sale of sales) {
    for (const line of sale.lines) {
      totals.set(line.name, (totals.get(line.name) ?? 0) + line.unitPrice * line.quantity);
    }
  }
  return [...totals.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}
