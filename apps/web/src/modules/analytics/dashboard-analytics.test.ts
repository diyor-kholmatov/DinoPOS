import { CalendarDate } from "@internationalized/date";
import { describe, expect, it } from "vitest";
import {
  buildDashboardAnalytics,
  dashboardDefaultGranularity,
  dashboardGranularityOptions,
  previousDashboardRange,
} from "@/features/analytics/dashboard-analytics";

const stores = [{ id: "b1", name: "Downtown", colorIndex: 1 as const }];
const range = {
  start: new CalendarDate(2026, 7, 25),
  end: new CalendarDate(2026, 8, 23),
};

describe("Dashboard analytics controls", () => {
  it("restores preset granularity options and defaults", () => {
    expect(dashboardGranularityOptions("today", range)).toEqual(["hour"]);
    expect(dashboardGranularityOptions("week", range)).toEqual(["hour", "day"]);
    expect(dashboardGranularityOptions("month", range)).toEqual(["hour", "day", "week"]);
    expect(dashboardGranularityOptions("year", range)).toEqual(["day", "week", "month"]);
    expect(dashboardDefaultGranularity("today", range)).toBe("hour");
    expect(dashboardDefaultGranularity("week", range)).toBe("day");
    expect(dashboardDefaultGranularity("month", range)).toBe("day");
    expect(dashboardDefaultGranularity("year", range)).toBe("month");
  });

  it("uses duration rules for custom ranges", () => {
    const twoDays = { start: new CalendarDate(2026, 8, 22), end: new CalendarDate(2026, 8, 23) };
    const thirtyDays = { start: new CalendarDate(2026, 7, 25), end: new CalendarDate(2026, 8, 23) };
    const ninetyDays = { start: new CalendarDate(2026, 5, 26), end: new CalendarDate(2026, 8, 23) };
    const twoHundredDays = { start: new CalendarDate(2026, 2, 5), end: new CalendarDate(2026, 8, 23) };
    expect(dashboardGranularityOptions("custom", twoDays)).toEqual(["hour", "day"]);
    expect(dashboardGranularityOptions("custom", thirtyDays)).toEqual(["day", "week"]);
    expect(dashboardGranularityOptions("custom", ninetyDays)).toEqual(["day", "week", "month"]);
    expect(dashboardGranularityOptions("custom", twoHundredDays)).toEqual(["week", "month"]);
  });

  it("keeps totals and comparison invariant when granularity changes", () => {
    const daily = buildDashboardAnalytics(range, "day", stores, "en-US");
    const weekly = buildDashboardAnalytics(range, "week", stores, "en-US");
    expect(daily.total).toBe(weekly.total);
    expect(daily.previousTotal).toBe(weekly.previousTotal);
    expect(daily.comparison).toBe(weekly.comparison);
  });

  it("builds the expected number of points for each year detail level", () => {
    const year = {
      start: new CalendarDate(2025, 8, 24),
      end: new CalendarDate(2026, 8, 23),
    };
    expect(buildDashboardAnalytics(year, "day", stores, "en-US").labels).toHaveLength(365);
    expect(buildDashboardAnalytics(year, "week", stores, "en-US").labels).toHaveLength(53);
    expect(buildDashboardAnalytics(year, "month", stores, "en-US").labels).toHaveLength(12);
  });

  it("builds an immediately preceding range with equal duration", () => {
    const previous = previousDashboardRange(range);
    expect(previous.start.toString()).toBe("2026-06-25");
    expect(previous.end.toString()).toBe("2026-07-24");
  });
});
