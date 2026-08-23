import { AlertTriangle, ArrowRight, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  AnalyticsFilters,
  rangeForPeriod,
  StorePicker,
  type AnalyticsPeriod,
} from "@/features/analytics/analytics-filters";
import { TimeSeriesChart } from "@/components/data/analytics-charts";
import { PageLayout } from "@/components/patterns/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select-field";
import { LOCALES, formatMoney } from "@/lib/format";
import { useCatalogStore } from "@/stores/catalog-store";
import { useSessionStore } from "@/stores/session-store";

const DEMO_STORE_SERIES = {
  b1: [42_800_000, 48_200_000, 44_100_000, 55_600_000, 49_800_000, 61_400_000],
  b2: [31_500_000, 37_900_000, 34_200_000, 42_400_000, 39_100_000, 47_800_000],
  b3: [18_400_000, 21_800_000, 26_200_000, 22_100_000, 28_700_000, 27_300_000],
} as const;

const STORE_TRENDS: Record<string, number> = { b1: 9.7, b2: 6.4, b3: 4.8 };

export function DashboardPage() {
  const { t } = useTranslation();
  const locale = useSessionStore((state) => state.locale);
  const stores = useSessionStore((state) => state.stores);
  const products = useCatalogStore((state) => state.products);
  const [period, setPeriod] = useState<AnalyticsPeriod>("year");
  const [range, setRange] = useState(rangeForPeriod("year"));
  const [selectedStores, setSelectedStores] = useState(stores.map((store) => store.id));
  const [granularity, setGranularity] = useState("month");

  const labels = useMemo(() => [2, 3, 4, 5, 6, 7].map((month) => (
    new Intl.DateTimeFormat(LOCALES[locale], { month: "short" })
      .format(new Date(2026, month, 1))
  )), [locale]);
  const visibleStores = stores.filter((store) => selectedStores.includes(store.id));
  const series = visibleStores.flatMap((store, index) => {
    const values = DEMO_STORE_SERIES[store.id as keyof typeof DEMO_STORE_SERIES];
    return values ? [{
      name: store.name,
      values: [...values],
      colorIndex: ((index % 5) + 1) as 1 | 2 | 3 | 4 | 5,
    }] : [];
  });
  const revenue = series.reduce(
    (total, storeSeries) => total + storeSeries.values.reduce((sum, value) => sum + value, 0),
    0,
  );
  const orders = Math.max(1, Math.round(revenue / 358_200));
  const average = revenue / orders;
  const profit = Math.round(revenue * 0.429);
  const urgentStock = products.flatMap((product) => {
    if (product.unit === "service") return [];
    const minimum = Math.min(...selectedStores.map((storeId) => product.stockByStore[storeId] ?? 0));
    return minimum <= 3 ? [{ product, minimum }] : [];
  }).sort((a, b) => a.minimum - b.minimum).slice(0, 3);

  return (
    <PageLayout className="mx-auto w-full max-w-[100rem] p-6">
      <header className="flex min-h-12 flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[11px] font-bold uppercase text-faint">{t("dashboard")}</h1>
          <StorePicker
            selectedStores={selectedStores}
            onStoresChange={setSelectedStores}
            prominent
          />
        </div>
        <Button asChild variant="primary" size="small" className="h-10 min-h-10 px-4">
          <Link to="/checkout"><ShoppingCart className="size-4" aria-hidden="true" />{t("dashboard.newSale")}</Link>
        </Button>
      </header>

      <AnalyticsFilters
        period={period}
        onPeriodChange={setPeriod}
        selectedStores={selectedStores}
        onStoresChange={setSelectedStores}
        range={range}
        onRangeChange={setRange}
        showStore={false}
        className="mt-4 justify-between border-b border-border pb-4"
      />

      <section className="mt-4 overflow-hidden rounded-lg border border-border bg-raised">
        <div className="grid xl:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="min-w-0 p-5 pb-3 xl:border-r xl:border-border">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-muted">{t("dashboard.salesPerformance")}</span>
                <div className="mt-1 flex flex-wrap items-baseline gap-3">
                  <strong className="text-2xl tabular-nums">{formatMoney(revenue, locale)}</strong>
                  <span className="text-xs font-semibold text-positive">+8.7%</span>
                </div>
              </div>
              <SelectField
                label={t("dashboard.groupBy")}
                value={granularity}
                onChange={setGranularity}
                options={[
                  { id: "week", label: t("dashboard.groupWeek") },
                  { id: "month", label: t("dashboard.groupMonth") },
                ]}
                hideLabel
                size="compact"
                className="w-40"
              />
            </div>
            <TimeSeriesChart
              labels={labels}
              series={series}
              ariaLabel={t("dashboard.salesChartLabel")}
              height={270}
              showLegend
              valueFormatter={(value) => `${Math.round(value / 1_000_000)}M`}
            />
          </div>

          <aside className="bg-panel/55 p-5">
            <h2 className="text-sm font-bold">{t("dashboard.periodSummary")}</h2>
            <p className="mt-1 text-xs text-muted">{t("dashboard.periodSummaryHelp")}</p>
            <dl className="mt-5 divide-y divide-border">
              {[
                [t("dashboard.periodOrders"), String(orders)],
                [t("dashboard.periodAverage"), formatMoney(average, locale)],
                [t("dashboard.periodProfit"), formatMoney(profit, locale)],
                [t("dashboard.selectedStores"), String(selectedStores.length)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 py-3 first:pt-0">
                  <dt className="text-xs text-muted">{label}</dt>
                  <dd className="text-sm font-bold tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <div className="mt-6 grid gap-8 border-t border-border pt-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
        <section>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-bold">{t("dashboard.operationalExceptions")}</h2>
              <p className="mt-1 text-xs text-muted">{t("dashboard.operationalExceptionsHelp")}</p>
            </div>
            <Button asChild variant="quiet" size="small">
              <Link to="/inventory">{t("common.viewAll")}<ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          <ul className="mt-3 divide-y divide-border">
            {urgentStock.map(({ product, minimum }) => (
              <li key={product.id} className="grid min-h-14 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                <AlertTriangle className="size-4 text-warning" aria-hidden="true" />
                <span className="min-w-0">
                  <strong className="block truncate text-sm">{product.name}</strong>
                  <small className="block truncate text-xs text-muted">{product.supplier}</small>
                </span>
                <Badge variant={minimum === 0 ? "danger" : "warning"}>{minimum}</Badge>
              </li>
            ))}
          </ul>
        </section>

        <section className="lg:border-l lg:border-border lg:pl-8">
          <h2 className="text-base font-bold">{t("dashboard.storePerformance")}</h2>
          <p className="mt-1 text-xs text-muted">{t("dashboard.storePerformanceHelp")}</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="text-xs text-muted">
                <tr><th className="pb-2 font-semibold">{t("common.branch")}</th><th className="pb-2 text-right font-semibold">{t("reports.totalRevenue")}</th><th className="pb-2 text-right font-semibold">%</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleStores.map((store) => {
                  const values = DEMO_STORE_SERIES[store.id as keyof typeof DEMO_STORE_SERIES] ?? [];
                  const storeRevenue = values.reduce((sum, value) => sum + value, 0);
                  return (
                    <tr key={store.id} className="h-12">
                      <td className="font-semibold">{store.name}</td>
                      <td className="text-right tabular-nums">{formatMoney(storeRevenue, locale)}</td>
                      <td className="text-right font-semibold text-positive tabular-nums">+{STORE_TRENDS[store.id] ?? 0}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

export default DashboardPage;
