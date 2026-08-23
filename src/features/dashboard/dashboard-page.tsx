import { AlertTriangle, ArrowRight, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { RangeValue } from "react-aria-components";
import type { CalendarDate } from "@internationalized/date";
import {
  AnalyticsFilters,
  rangeForPeriod,
  StorePicker,
  type AnalyticsPeriod,
} from "@/features/analytics/analytics-filters";
import { TimeSeriesChart } from "@/components/data/analytics-charts";
import { PageLayout } from "@/components/patterns/page";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select-field";
import { LOCALES, formatMoney } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useCatalogStore } from "@/stores/catalog-store";
import { useSessionStore } from "@/stores/session-store";

const DEMO_STORE_SERIES = {
  b1: [48_200_000, 52_800_000, 50_400_000, 57_600_000, 54_100_000, 62_800_000, 58_600_000, 64_700_000, 69_200_000, 65_800_000, 72_400_000, 78_100_000],
  b2: [33_400_000, 36_100_000, 39_800_000, 37_200_000, 41_900_000, 45_600_000, 43_100_000, 48_300_000, 46_700_000, 51_400_000, 54_200_000, 57_900_000],
  b3: [19_600_000, 21_200_000, 20_100_000, 23_800_000, 25_400_000, 24_200_000, 27_100_000, 29_600_000, 28_300_000, 31_800_000, 33_200_000, 35_700_000],
} as const;

const STORE_TRENDS: Record<string, number> = { b1: 9.7, b2: 6.4, b3: 4.8 };

type Granularity = "hour" | "day" | "week" | "month";

function toUtcDate(value: CalendarDate): Date {
  return new Date(Date.UTC(value.year, value.month - 1, value.day));
}

function daysBetween(range: RangeValue<CalendarDate>): number {
  return Math.max(1, Math.round((toUtcDate(range.end).getTime() - toUtcDate(range.start).getTime()) / 86_400_000) + 1);
}

function granularityForRange(range: RangeValue<CalendarDate>): Granularity {
  const days = daysBetween(range);
  if (days <= 2) return "hour";
  if (days <= 14) return "day";
  if (days <= 90) return "week";
  return "month";
}

function granularityOptions(period: AnalyticsPeriod, range: RangeValue<CalendarDate>): Granularity[] {
  if (period === "today" || period === "yesterday") return ["hour"];
  if (period === "week") return ["day"];
  if (period === "month") return ["day", "week"];
  if (period === "year") return ["month"];
  const days = daysBetween(range);
  if (days <= 2) return ["hour"];
  if (days <= 14) return ["day"];
  if (days <= 90) return ["day", "week"];
  return ["month"];
}

function buildChartLabels(
  range: RangeValue<CalendarDate>,
  granularity: Granularity,
  locale: keyof typeof LOCALES,
): string[] {
  const formatterLocale = LOCALES[locale];
  const start = toUtcDate(range.start);
  const end = toUtcDate(range.end);

  if (granularity === "hour") {
    return ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00", "23:00"];
  }

  if (granularity === "month") {
    const monthDistance = (end.getUTCFullYear() - start.getUTCFullYear()) * 12
      + end.getUTCMonth() - start.getUTCMonth();
    const count = Math.min(12, Math.max(2, monthDistance));
    return Array.from({ length: count }, (_, index) => {
      const date = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - count + index + 1, 1));
      return new Intl.DateTimeFormat(formatterLocale, { month: "short" }).format(date);
    });
  }

  const totalDays = daysBetween(range);
  const preferredStep = granularity === "week" ? 7 : 1;
  const naturalCount = Math.ceil(totalDays / preferredStep);
  const count = Math.min(granularity === "week" ? 14 : 31, Math.max(2, naturalCount));
  return Array.from({ length: count }, (_, index) => {
    const progress = count === 1 ? 0 : index / (count - 1);
    const date = new Date(start.getTime() + (end.getTime() - start.getTime()) * progress);
    return new Intl.DateTimeFormat(formatterLocale, { day: "numeric", month: "short" }).format(date);
  });
}

function buildSeriesValues(base: readonly number[], count: number, granularity: Granularity): number[] {
  if (granularity === "month" && count === 12) return [...base];
  const scale = granularity === "hour" ? 0.006 : granularity === "day" ? 0.045 : granularity === "week" ? 0.22 : 1;
  return Array.from({ length: count }, (_, index) => {
    const sourceIndex = Math.round((index / Math.max(1, count - 1)) * (base.length - 1));
    const variation = 0.94 + ((index * 7 + count) % 5) * 0.025;
    return Math.round(((base[sourceIndex] ?? base[0] ?? 0) * scale * variation) / 10_000) * 10_000;
  });
}

export function DashboardPage() {
  const { t } = useTranslation();
  const locale = useSessionStore((state) => state.locale);
  const stores = useSessionStore((state) => state.stores);
  const products = useCatalogStore((state) => state.products);
  const [period, setPeriod] = useState<AnalyticsPeriod>("year");
  const [range, setRange] = useState(rangeForPeriod("year"));
  const [selectedStores, setSelectedStores] = useState(stores.map((store) => store.id));
  const [granularity, setGranularity] = useState<Granularity>("month");

  const labels = useMemo(
    () => buildChartLabels(range, granularity, locale),
    [granularity, locale, range],
  );
  const visibleStores = stores.filter((store) => selectedStores.includes(store.id));
  const series = visibleStores.flatMap((store, index) => {
    const values = DEMO_STORE_SERIES[store.id as keyof typeof DEMO_STORE_SERIES];
    return values ? [{
      name: store.name,
      values: buildSeriesValues(values, labels.length, granularity),
      colorIndex: ((index % 5) + 1) as 1 | 2 | 3 | 4 | 5,
    }] : [];
  });
  const revenue = series.reduce(
    (total, storeSeries) => total + storeSeries.values.reduce((sum, value) => sum + value, 0),
    0,
  );
  const previousRevenue = visibleStores.reduce((total, store) => {
    const storeSeries = series.find((item) => item.name === store.name);
    const current = storeSeries?.values.reduce((sum, value) => sum + value, 0) ?? 0;
    return total + current / (1 + (STORE_TRENDS[store.id] ?? 0) / 100);
  }, 0);
  const comparison = previousRevenue ? ((revenue / previousRevenue) - 1) * 100 : 0;
  const orders = Math.max(1, Math.round(revenue / 358_200));
  const average = revenue / orders;
  const profit = Math.round(revenue * 0.429);
  const urgentStock = products.flatMap((product) => {
    if (product.unit === "service") return [];
    const minimum = Math.min(...selectedStores.map((storeId) => product.stockByStore[storeId] ?? 0));
    return minimum <= 3 ? [{ product, minimum }] : [];
  }).sort((a, b) => a.minimum - b.minimum).slice(0, 3);
  const granularityLabelKeys: Record<Granularity, string> = {
    hour: "dashboard.groupHour",
    day: "dashboard.groupDay",
    week: "dashboard.groupWeek",
    month: "dashboard.groupMonth",
  };
  const detailOptions = granularityOptions(period, range).map((value) => ({
    id: value,
    label: t(granularityLabelKeys[value]),
  }));

  const handlePeriodChange = (next: AnalyticsPeriod) => {
    setPeriod(next);
  };

  const handleRangeChange = (next: RangeValue<CalendarDate>) => {
    setRange(next);
    setGranularity(granularityForRange(next));
  };

  return (
    <PageLayout className="mx-auto w-full max-w-[100rem] p-6 pb-8">
      <header className="flex min-h-10 items-center justify-between gap-4">
        <StorePicker
          selectedStores={selectedStores}
          onStoresChange={setSelectedStores}
          prominent
        />
        <Button asChild variant="primary" size="small" className="h-10 min-h-10 px-3 text-xs">
          <Link to="/checkout"><ShoppingCart className="size-[15px]" aria-hidden="true" />{t("dashboard.newSale")}</Link>
        </Button>
      </header>

      <AnalyticsFilters
        period={period}
        onPeriodChange={handlePeriodChange}
        selectedStores={selectedStores}
        onStoresChange={setSelectedStores}
        range={range}
        onRangeChange={handleRangeChange}
        showStore={false}
        integrated
        className="mt-3"
      />

      <section className="mt-4 overflow-hidden rounded-lg border border-border bg-raised shadow-[var(--shadow-sm)]">
        <div className="grid xl:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="min-w-0 p-5 pb-3 xl:border-r xl:border-border">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-[15px] font-semibold leading-5 text-ink">{t("dashboard.salesPerformance")}</h2>
                <span className="mt-2 block text-[11px] text-muted">{t("dashboard.totalForPeriod")}</span>
                <div className="mt-0.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <strong className="text-[28px] font-semibold leading-9 tracking-[0] tabular-nums">{formatMoney(revenue, locale)}</strong>
                  <span className="text-xs font-medium text-positive tabular-nums">{t("dashboard.comparison", { value: comparison.toFixed(1) })}</span>
                </div>
              </div>
              <SelectField
                label={t("dashboard.groupBy")}
                value={granularity}
                onChange={(value) => setGranularity(value as Granularity)}
                options={detailOptions}
                hideLabel
                size="compact"
                className="w-36"
              />
            </div>
            <TimeSeriesChart
              labels={labels}
              series={series}
              ariaLabel={t("dashboard.salesChartLabel")}
              height={258}
              showLegend
              dashboardStyle
              axisValueFormatter={(value) => `${Math.round(value / 1_000_000)}M`}
              tooltipValueFormatter={(value) => formatMoney(value, locale)}
            />
          </div>

          <aside className="bg-panel/55 p-5">
            <h2 className="text-[13px] font-semibold text-ink">{t("dashboard.periodSummary")}</h2>
            <dl className="mt-4 grid gap-4">
              {[
                [t("dashboard.previousPeriod"), formatMoney(previousRevenue, locale)],
                [t("dashboard.periodOrders"), String(orders)],
                [t("dashboard.periodAverage"), formatMoney(average, locale)],
                [t("dashboard.periodProfit"), formatMoney(profit, locale)],
                [t("dashboard.profitMargin"), `${((profit / Math.max(1, revenue)) * 100).toFixed(1)}%`],
                [t("dashboard.selectedStores"), String(selectedStores.length)],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-2 border-b border-border/70 pb-3 last:border-0 last:pb-0">
                  <dt className="whitespace-nowrap text-xs text-muted">{label}</dt>
                  <dd className="whitespace-nowrap text-[13px] font-semibold text-ink tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section className="mt-5 grid overflow-hidden rounded-lg border border-border bg-raised lg:grid-cols-[minmax(0,1.08fr)_minmax(28rem,0.92fr)]">
        <div className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-ink">{t("dashboard.operationalExceptions")}</h2>
              <p className="mt-0.5 text-xs text-muted">{t("dashboard.operationalExceptionsHelp")}</p>
            </div>
            <Button asChild variant="quiet" size="small" className="h-8 min-h-8 px-2 font-medium">
              <Link to="/inventory">{t("common.viewAll")}<ArrowRight className="size-3.5" /></Link>
            </Button>
          </div>
          <ul className="mt-2 divide-y divide-border">
            {urgentStock.map(({ product, minimum }) => (
              <li key={product.id} className="grid h-12 grid-cols-[1rem_minmax(0,1fr)_3rem] items-center gap-3">
                <AlertTriangle className={cn("size-3.5", minimum === 0 ? "text-danger/75" : "text-warning/75")} aria-hidden="true" />
                <span className="min-w-0">
                  <strong className="block truncate text-[13px] font-medium text-ink">{product.name}</strong>
                  <small className="block truncate text-[11px] text-muted">{product.supplier}</small>
                </span>
                <span className={cn(
                  "text-right text-[13px] font-semibold tabular-nums",
                  minimum === 0 ? "text-danger" : "text-warning",
                )}>{minimum}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border p-4 lg:border-l lg:border-t-0">
          <h2 className="text-sm font-semibold text-ink">{t("dashboard.storePerformance")}</h2>
          <p className="mt-0.5 text-xs text-muted">{t("dashboard.storePerformanceHelp")}</p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead className="text-[11px] text-muted">
                <tr>
                  <th className="h-8 font-medium">{t("common.branch")}</th>
                  <th className="h-8 text-right font-medium">{t("reports.totalRevenue")}</th>
                  <th className="h-8 text-right font-medium">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleStores.map((store) => {
                  const storeSeries = series.find((item) => item.name === store.name);
                  const storeRevenue = storeSeries?.values.reduce((sum, value) => sum + value, 0) ?? 0;
                  return (
                    <tr key={store.id} className="h-12">
                      <td className="font-medium text-ink">{store.name}</td>
                      <td className="text-right text-ink tabular-nums">{formatMoney(storeRevenue, locale)}</td>
                      <td className="text-right font-medium text-positive tabular-nums">+{STORE_TRENDS[store.id] ?? 0}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export default DashboardPage;
