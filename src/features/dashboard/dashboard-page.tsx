import { AlertTriangle, ArrowRight, PackagePlus, ShoppingCart, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AnalyticsFilters, rangeForPeriod, type AnalyticsPeriod } from "@/features/analytics/analytics-filters";
import { aggregateSales, filterSales, saleCost, topProducts } from "@/features/analytics/model";
import { HorizontalBarChart, TimeSeriesChart } from "@/components/data/analytics-charts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Metric, MetricStrip, PageHeader, PageLayout, SectionHeader } from "@/components/patterns/page";
import { LOCALES, formatMoney } from "@/lib/format";
import { useCatalogStore } from "@/stores/catalog-store";
import { useOperationsStore } from "@/stores/operations-store";
import { useSalesStore } from "@/stores/sales-store";
import { useSessionStore } from "@/stores/session-store";

export function DashboardPage() {
  const { t } = useTranslation();
  const locale = useSessionStore((state) => state.locale);
  const stores = useSessionStore((state) => state.stores);
  const products = useCatalogStore((state) => state.products);
  const sales = useSalesStore((state) => state.sales);
  const stocktakes = useOperationsStore((state) => state.stocktakes);
  const [period, setPeriod] = useState<AnalyticsPeriod>("month");
  const [range, setRange] = useState(rangeForPeriod("month"));
  const [selectedStores, setSelectedStores] = useState(stores.map((store) => store.id));

  const visibleSales = useMemo(
    () => filterSales(sales, selectedStores, range),
    [range, sales, selectedStores],
  );
  const points = useMemo(
    () => aggregateSales(visibleSales, products, LOCALES[locale]),
    [locale, products, visibleSales],
  );
  const revenue = visibleSales.reduce((sum, sale) => sum + sale.total, 0);
  const cost = visibleSales.reduce((sum, sale) => sum + saleCost(sale, products), 0);
  const profit = revenue - cost;
  const average = visibleSales.length ? revenue / visibleSales.length : 0;
  const lowStock = products.flatMap((product) => {
    if (product.unit === "service") return [];
    const levels = selectedStores.map((storeId) => product.stockByStore[storeId] ?? 0);
    const minimum = Math.min(...levels);
    return minimum <= 5 ? [{ product, minimum }] : [];
  }).sort((a, b) => a.minimum - b.minimum).slice(0, 5);
  const ranked = topProducts(visibleSales);
  const openStocktakes = stocktakes.filter((item) => selectedStores.includes(item.storeId) && item.status === "in_progress");

  return (
    <PageLayout>
      <PageHeader
        title={t("dashboard")}
        description={t("dashboard.workspaceSubtitle")}
        actions={(
          <Button asChild variant="primary">
            <Link to="/checkout"><ShoppingCart className="size-4" aria-hidden="true" />{t("dashboard.newSale")}</Link>
          </Button>
        )}
      />
      <AnalyticsFilters
        period={period}
        onPeriodChange={setPeriod}
        selectedStores={selectedStores}
        onStoresChange={setSelectedStores}
        range={range}
        onRangeChange={setRange}
      />
      <MetricStrip>
        <Metric label={t("dashboard.periodRevenue")} value={formatMoney(revenue, locale)} help={t("dashboard.comparison", { value: "8.7" })} />
        <Metric label={t("dashboard.periodOrders")} value={String(visibleSales.length)} help={t("dashboard.ordersInPeriod")} />
        <Metric label={t("dashboard.periodAverage")} value={formatMoney(average, locale)} help={t("dashboard.averageHelp")} />
        <Metric label={t("dashboard.periodProfit")} value={formatMoney(profit, locale)} help={t("dashboard.profitHelp")} />
      </MetricStrip>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="min-w-0 rounded-md border border-border bg-raised p-4">
          <SectionHeader
            title={t("dashboard.salesOverview")}
            description={t("dashboard.salesOverviewHelp")}
            action={<strong className="text-lg tabular-nums">{formatMoney(revenue, locale)}</strong>}
          />
          <TimeSeriesChart
            labels={points.map((point) => point.label)}
            series={[{ name: t("reports.revenue"), values: points.map((point) => point.revenue), colorIndex: 1, area: true }]}
            ariaLabel={t("dashboard.salesChartLabel")}
          />
        </section>
        <section className="rounded-md border border-border bg-raised p-4">
          <SectionHeader
            title={t("dashboard.lowStock")}
            description={t("dashboard.lowStockHelp")}
            action={<Button asChild variant="quiet" size="small"><Link to="/inventory">{t("common.view")}<ArrowRight className="size-4" /></Link></Button>}
          />
          {lowStock.length ? (
            <ul className="divide-y divide-border">
              {lowStock.map(({ product, minimum }) => (
                <li key={product.id} className="flex min-h-14 items-center gap-3 py-2">
                  <span className="grid size-9 shrink-0 place-items-center rounded-sm bg-warning/10 text-warning"><AlertTriangle className="size-4" aria-hidden="true" /></span>
                  <span className="min-w-0 flex-1">
                    <strong className="block truncate text-sm">{product.name}</strong>
                    <small className="text-xs text-muted">{product.supplier}</small>
                  </span>
                  <Badge variant={minimum === 0 ? "danger" : "warning"}>{minimum}</Badge>
                </li>
              ))}
            </ul>
          ) : <p className="py-10 text-center text-sm text-muted">{t("dashboard.stockHealthy")}</p>}
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <section className="rounded-md border border-border bg-raised p-4">
          <SectionHeader title={t("dashboard.quickActions")} />
          <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="secondary" className="justify-start"><Link to="/checkout"><ShoppingCart className="size-4" />{t("dashboard.newSale")}</Link></Button>
            <Button asChild variant="secondary" className="justify-start"><Link to="/catalog"><PackagePlus className="size-4" />{t("dashboard.createProduct")}</Link></Button>
            <Button asChild variant="secondary" className="col-span-2 justify-start"><Link to="/suppliers"><Truck className="size-4" />{t("dashboard.purchaseOrder")}</Link></Button>
          </div>
        </section>
        <section className="rounded-md border border-border bg-raised p-4">
          <SectionHeader title={t("dashboard.topProducts")} description={t("dashboard.topProductsHelp")} />
          <HorizontalBarChart labels={ranked.map((item) => item.name)} values={ranked.map((item) => item.value)} ariaLabel={t("dashboard.topProducts")} height={210} />
        </section>
        <section className="rounded-md border border-border bg-raised p-4">
          <SectionHeader title={t("dashboard.inventoryProgress")} description={t("dashboard.inventoryProgressHelp")} />
          {openStocktakes.length ? openStocktakes.map((stocktake) => (
            <div key={stocktake.id} className="border-b border-border py-3 last:border-0">
              <div className="flex items-center justify-between gap-3 text-sm">
                <strong>{stocktake.id}</strong>
                <span className="tabular-nums">{stocktake.progress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-sm bg-sunken">
                <div className="h-full rounded-sm bg-information" style={{ width: `${stocktake.progress}%` }} />
              </div>
            </div>
          )) : <p className="py-10 text-center text-sm text-muted">{t("dashboard.noInventory")}</p>}
        </section>
      </div>
    </PageLayout>
  );
}

export default DashboardPage;
