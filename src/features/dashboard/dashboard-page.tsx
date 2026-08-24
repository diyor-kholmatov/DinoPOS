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
} from "@/features/analytics/analytics-filters";
import {
  buildDashboardAnalytics,
  dashboardDefaultGranularity,
  dashboardGranularityOptions,
  type AnalyticsGranularity,
  type AnalyticsPeriod,
} from "@/features/analytics/dashboard-analytics";
import { TimeSeriesChart } from "@/components/data/analytics-charts";
import { PageLayout } from "@/components/patterns/page";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select-field";
import { LOCALES, formatMoney } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useCatalogStore } from "@/stores/catalog-store";
import { useSessionStore } from "@/stores/session-store";

export function DashboardPage() {
  const { t } = useTranslation();
  const locale = useSessionStore((state) => state.locale);
  const stores = useSessionStore((state) => state.stores);
  const products = useCatalogStore((state) => state.products);
  const [period, setPeriod] = useState<AnalyticsPeriod>("year");
  const [range, setRange] = useState(rangeForPeriod("year"));
  const [selectedStores, setSelectedStores] = useState(stores.map((store) => store.id));
  const [granularity, setGranularity] = useState<AnalyticsGranularity>("month");
  const visibleStores = useMemo(
    () => stores.filter((store) => selectedStores.includes(store.id)),
    [selectedStores, stores],
  );
  const analytics = useMemo(
    () => buildDashboardAnalytics(
      range,
      granularity,
      visibleStores.map((store, index) => ({
        id: store.id,
        name: store.name,
        colorIndex: ((index % 5) + 1) as 1 | 2 | 3 | 4 | 5,
      })),
      LOCALES[locale],
    ),
    [granularity, locale, range, visibleStores],
  );
  const revenue = analytics.total;
  const previousRevenue = analytics.previousTotal;
  const comparison = analytics.comparison;
  const orders = Math.max(1, Math.round(revenue / 358_200));
  const average = revenue / orders;
  const profit = Math.round(revenue * 0.429);
  const urgentStock = products.flatMap((product) => {
    if (product.unit === "service") return [];
    const minimum = Math.min(...selectedStores.map((storeId) => product.stockByStore[storeId] ?? 0));
    return minimum <= 3 ? [{ product, minimum }] : [];
  }).sort((a, b) => a.minimum - b.minimum).slice(0, 3);
  const granularityLabelKeys: Record<AnalyticsGranularity, string> = {
    hour: "dashboard.detailHour",
    day: "dashboard.detailDay",
    week: "dashboard.detailWeek",
    month: "dashboard.detailMonth",
  };
  const detailOptions = dashboardGranularityOptions(period, range).map((value) => ({
    id: value,
    label: t(granularityLabelKeys[value]),
  }));

  const handlePeriodChange = (next: AnalyticsPeriod) => {
    setPeriod(next);
    if (next !== "custom") {
      setGranularity(dashboardDefaultGranularity(next, rangeForPeriod(next)));
    }
  };

  const handleRangeChange = (next: RangeValue<CalendarDate>) => {
    setRange(next);
    setGranularity((current) => {
      const options = dashboardGranularityOptions("custom", next);
      return options.includes(current) ? current : dashboardDefaultGranularity("custom", next);
    });
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
                onChange={(value) => setGranularity(value as AnalyticsGranularity)}
                options={detailOptions}
                hideLabel
                size="compact"
                className="w-64 [&>button]:h-10"
              />
            </div>
            <TimeSeriesChart
              labels={analytics.labels}
              series={analytics.series}
              ariaLabel={t("dashboard.salesChartLabel")}
              height={258}
              showLegend
              showZoom={analytics.labels.length > 36}
              dashboardStyle
              axisValueFormatter={(value) => `${Math.round(value / 1_000_000)}M`}
              tooltipValueFormatter={(value) => formatMoney(value, locale)}
            />
          </div>

          <aside className="bg-panel/55 p-5">
            <h2 className="text-[13px] font-semibold text-ink">{t("dashboard.periodSummary")}</h2>
            <dl className="mt-3 grid sm:grid-cols-2 sm:gap-x-6 xl:grid-cols-1 xl:gap-x-0">
              {[
                [t("dashboard.previousPeriod"), formatMoney(previousRevenue, locale)],
                [t("dashboard.periodOrders"), String(orders)],
                [t("dashboard.periodAverage"), formatMoney(average, locale)],
                [t("dashboard.periodProfit"), formatMoney(profit, locale)],
                [t("dashboard.profitMargin"), `${((profit / Math.max(1, revenue)) * 100).toFixed(1)}%`],
                [t("dashboard.selectedStores"), String(selectedStores.length)],
              ].map(([label, value]) => (
                <div key={label} className="grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border/70 py-2 last:border-0">
                  <dt className="min-w-0 text-xs leading-4 text-muted">{label}</dt>
                  <dd className="whitespace-nowrap text-right text-[13px] font-semibold text-ink tabular-nums">{value}</dd>
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
                  const storeRevenue = analytics.totalsByStore[store.id] ?? 0;
                  const storeComparison = analytics.comparisonsByStore[store.id] ?? 0;
                  return (
                    <tr key={store.id} className="h-12">
                      <td className="font-medium text-ink">{store.name}</td>
                      <td className="text-right text-ink tabular-nums">{formatMoney(storeRevenue, locale)}</td>
                      <td className="text-right font-medium text-positive tabular-nums">+{storeComparison.toFixed(1)}%</td>
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
