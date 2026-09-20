import type { CalendarDate } from "@internationalized/date";
import type { RangeValue } from "react-aria-components";

export type AnalyticsPeriod = "yesterday" | "today" | "week" | "month" | "year" | "custom";
export type AnalyticsGranularity = "hour" | "day" | "week" | "month";

export interface DashboardStoreInput {
  id: string;
  name: string;
  colorIndex: 1 | 2 | 3 | 4 | 5;
}

export interface DashboardAnalytics {
  labels: string[];
  series: Array<{
    id: string;
    name: string;
    values: number[];
    colorIndex: 1 | 2 | 3 | 4 | 5;
  }>;
  totalsByStore: Record<string, number>;
  previousTotalsByStore: Record<string, number>;
  comparisonsByStore: Record<string, number>;
  total: number;
  previousTotal: number;
  comparison: number;
}

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const MONTH_DAYS = 30.4375;

const DAILY_REVENUE_BY_STORE: Record<string, number> = {
  b1: 1_940_000,
  b2: 1_400_000,
  b3: 860_000,
};

const MONTH_FACTORS = [0.92, 0.95, 0.98, 1.02, 1.04, 1.01, 0.97, 0.96, 1.03, 1.07, 1.1, 1.14];
const WEEKDAY_FACTORS = [0.88, 0.96, 0.99, 1.01, 1.06, 1.12, 1.08];
const RAW_HOUR_WEIGHTS = [
  0.002, 0.0015, 0.001, 0.001, 0.001, 0.002,
  0.004, 0.012, 0.03, 0.05, 0.065, 0.075,
  0.08, 0.085, 0.09, 0.085, 0.09, 0.085,
  0.075, 0.06, 0.04, 0.025, 0.012, 0.006,
];
const HOUR_WEIGHT_TOTAL = RAW_HOUR_WEIGHTS.reduce((sum, value) => sum + value, 0);
const HOUR_WEIGHTS = RAW_HOUR_WEIGHTS.map((value) => value / HOUR_WEIGHT_TOTAL);

export function dashboardRangeDays(range: RangeValue<CalendarDate>): number {
  const start = Date.UTC(range.start.year, range.start.month - 1, range.start.day);
  const end = Date.UTC(range.end.year, range.end.month - 1, range.end.day);
  return Math.max(1, Math.round((end - start) / DAY_MS) + 1);
}

export function dashboardGranularityOptions(
  period: AnalyticsPeriod,
  range: RangeValue<CalendarDate>,
): AnalyticsGranularity[] {
  if (period === "today" || period === "yesterday") return ["hour"];
  if (period === "week") return ["hour", "day"];
  if (period === "month") return ["hour", "day", "week"];
  if (period === "year") return ["day", "week", "month"];

  const days = dashboardRangeDays(range);
  if (days <= 2) return ["hour", "day"];
  if (days <= 45) return ["day", "week"];
  if (days <= 180) return ["day", "week", "month"];
  return ["week", "month"];
}

export function dashboardDefaultGranularity(
  period: AnalyticsPeriod,
  range: RangeValue<CalendarDate>,
): AnalyticsGranularity {
  if (period === "today" || period === "yesterday") return "hour";
  if (period === "week" || period === "month") return "day";
  if (period === "year") return "month";
  return dashboardGranularityOptions("custom", range)[0] ?? "day";
}

export function previousDashboardRange(range: RangeValue<CalendarDate>): RangeValue<CalendarDate> {
  const days = dashboardRangeDays(range);
  const end = range.start.subtract({ days: 1 });
  return { start: end.subtract({ days: days - 1 }), end };
}

function bucketCount(range: RangeValue<CalendarDate>, granularity: AnalyticsGranularity): number {
  const days = dashboardRangeDays(range);
  if (granularity === "hour") return days * 24;
  if (granularity === "day") return days;
  if (granularity === "week") return Math.ceil(days / 7);
  return Math.max(1, Math.round(days / MONTH_DAYS));
}

function storeSeed(storeId: string): number {
  return [...storeId].reduce((sum, character) => sum + character.charCodeAt(0), 0);
}

function dailyRevenue(storeId: string): number {
  const configured = DAILY_REVENUE_BY_STORE[storeId];
  if (configured) return configured;
  return 760_000 + (storeSeed(storeId) % 7) * 90_000;
}

function revenueForHour(storeId: string, timestamp: number): number {
  const date = new Date(timestamp);
  const dayOrdinal = Math.floor(timestamp / DAY_MS);
  const growthYears = (timestamp - Date.UTC(2025, 7, 24)) / (DAY_MS * 365.25);
  const growth = 1.076 ** growthYears;
  const monthFactor = MONTH_FACTORS[date.getUTCMonth()] ?? 1;
  const weekdayFactor = WEEKDAY_FACTORS[date.getUTCDay()] ?? 1;
  const hourWeight = HOUR_WEIGHTS[date.getUTCHours()] ?? 0;
  const variation = 0.96 + ((Math.sin((dayOrdinal + storeSeed(storeId) * 11) * 0.73) + 1) / 2) * 0.08;
  return Math.round(dailyRevenue(storeId) * growth * monthFactor * weekdayFactor * hourWeight * variation);
}

function labelForBucket(
  range: RangeValue<CalendarDate>,
  granularity: AnalyticsGranularity,
  index: number,
  count: number,
  locale: string,
): string {
  const start = Date.UTC(range.start.year, range.start.month - 1, range.start.day);
  const hours = dashboardRangeDays(range) * 24;
  let timestamp: number;

  if (granularity === "hour") timestamp = start + index * HOUR_MS;
  else if (granularity === "day") timestamp = start + (index * 24 + 12) * HOUR_MS;
  else if (granularity === "week") timestamp = start + Math.min(hours - 1, index * 7 * 24 + 3 * 24 + 12) * HOUR_MS;
  else timestamp = start + Math.min(hours - 1, ((index + 0.5) * hours) / count) * HOUR_MS;

  const date = new Date(timestamp);
  const days = dashboardRangeDays(range);
  const options: Intl.DateTimeFormatOptions = granularity === "hour"
    ? days === 1
      ? { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" }
      : { day: "numeric", month: "short", hour: "2-digit", hour12: false, timeZone: "UTC" }
    : granularity === "month"
      ? { month: "short", year: days > 370 ? "2-digit" : undefined, timeZone: "UTC" }
      : { day: "numeric", month: "short", timeZone: "UTC" };
  return new Intl.DateTimeFormat(locale, options).format(date);
}

function aggregateRange(
  range: RangeValue<CalendarDate>,
  granularity: AnalyticsGranularity,
  stores: DashboardStoreInput[],
  locale: string,
) {
  const count = bucketCount(range, granularity);
  const totalHours = dashboardRangeDays(range) * 24;
  const start = Date.UTC(range.start.year, range.start.month - 1, range.start.day);
  const series = stores.map((store) => ({ ...store, values: Array<number>(count).fill(0) }));

  for (let hour = 0; hour < totalHours; hour += 1) {
    const index = granularity === "hour"
      ? hour
      : granularity === "day"
        ? Math.floor(hour / 24)
        : granularity === "week"
          ? Math.floor(hour / (7 * 24))
          : Math.min(count - 1, Math.floor(hour / (totalHours / count)));
    const timestamp = start + hour * HOUR_MS;
    for (const store of series) {
      store.values[index] = (store.values[index] ?? 0) + revenueForHour(store.id, timestamp);
    }
  }

  const labels = Array.from({ length: count }, (_, index) => (
    labelForBucket(range, granularity, index, count, locale)
  ));
  const totalsByStore = Object.fromEntries(series.map((store) => [
    store.id,
    store.values.reduce((sum, value) => sum + value, 0),
  ]));
  return { labels, series, totalsByStore };
}

export function buildDashboardAnalytics(
  range: RangeValue<CalendarDate>,
  granularity: AnalyticsGranularity,
  stores: DashboardStoreInput[],
  locale: string,
): DashboardAnalytics {
  const current = aggregateRange(range, granularity, stores, locale);
  const previous = aggregateRange(previousDashboardRange(range), granularity, stores, locale);
  const total = Object.values(current.totalsByStore).reduce((sum, value) => sum + value, 0);
  const previousTotal = Object.values(previous.totalsByStore).reduce((sum, value) => sum + value, 0);
  const comparisonsByStore = Object.fromEntries(stores.map((store) => {
    const value = current.totalsByStore[store.id] ?? 0;
    const previousValue = previous.totalsByStore[store.id] ?? 0;
    return [store.id, previousValue ? ((value / previousValue) - 1) * 100 : 0];
  }));

  return {
    labels: current.labels,
    series: current.series,
    totalsByStore: current.totalsByStore,
    previousTotalsByStore: previous.totalsByStore,
    comparisonsByStore,
    total,
    previousTotal,
    comparison: previousTotal ? ((total / previousTotal) - 1) * 100 : 0,
  };
}
