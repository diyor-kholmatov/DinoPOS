import type { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AnalyticsFilters, rangeForPeriod, type AnalyticsPeriod } from "@/features/analytics/analytics-filters";
import { aggregateSales, filterSales, saleCost, topProducts } from "@/features/analytics/model";
import { DonutChart, HorizontalBarChart, TimeSeriesChart } from "@/components/data/analytics-charts";
import { DataTable } from "@/components/data/data-table";
import { Button } from "@/components/ui/button";
import { Metric, MetricStrip, PageHeader, PageLayout, SectionHeader } from "@/components/patterns/page";
import { LOCALES, formatMoney } from "@/lib/format";
import { useCatalogStore } from "@/stores/catalog-store";
import { useCustomerStore } from "@/stores/customer-store";
import { useOperationsStore } from "@/stores/operations-store";
import { useSalesStore } from "@/stores/sales-store";
import { useSessionStore } from "@/stores/session-store";

interface CashierRow {
  name: string;
  orders: number;
  sales: number;
  average: number;
}

export function ReportsPage() {
  const { t } = useTranslation();
  const locale = useSessionStore((state) => state.locale);
  const stores = useSessionStore((state) => state.stores);
  const products = useCatalogStore((state) => state.products);
  const sales = useSalesStore((state) => state.sales);
  const customers = useCustomerStore((state) => state.customers);
  const purchaseOrders = useOperationsStore((state) => state.purchaseOrders);
  const [period, setPeriod] = useState<AnalyticsPeriod>("month");
  const [range, setRange] = useState(rangeForPeriod("month"));
  const [selectedStores, setSelectedStores] = useState(stores.map((store) => store.id));
  const [exporting, setExporting] = useState(false);
  const visibleSales = useMemo(() => filterSales(sales, selectedStores, range), [range, sales, selectedStores]);
  const points = useMemo(() => aggregateSales(visibleSales, products, LOCALES[locale]), [locale, products, visibleSales]);
  const revenue = visibleSales.reduce((sum, sale) => sum + sale.total, 0);
  const cost = visibleSales.reduce((sum, sale) => sum + saleCost(sale, products), 0);
  const debt = customers.reduce((sum, customer) => sum + customer.debt, 0);
  const supplierBalance = purchaseOrders.filter((order) => order.status !== "paid").reduce((sum, order) => sum + Math.max(0, order.orderedAmount - order.receivedAmount), 0);
  const ranked = topProducts(visibleSales);
  const paymentData = Object.entries(visibleSales.reduce<Record<string, number>>((acc, sale) => {
    acc[sale.paymentMethod] = (acc[sale.paymentMethod] ?? 0) + sale.total;
    return acc;
  }, {})).map(([name, value]) => ({ name: t(`payment.${name}`), value }));
  const cashierRows = Object.values(visibleSales.reduce<Record<string, CashierRow>>((acc, sale) => {
    const row = acc[sale.cashierName] ?? { name: sale.cashierName, orders: 0, sales: 0, average: 0 };
    row.orders += 1;
    row.sales += sale.total;
    row.average = row.sales / row.orders;
    acc[sale.cashierName] = row;
    return acc;
  }, {}));
  const columns: ColumnDef<CashierRow>[] = [
    { accessorKey: "name", header: t("sales.cashier") },
    { accessorKey: "orders", header: t("dashboard.orders"), cell: ({ row }) => <span className="tabular-nums">{row.original.orders}</span> },
    { accessorKey: "sales", header: t("reports.revenue"), cell: ({ row }) => <span className="tabular-nums">{formatMoney(row.original.sales, locale)}</span> },
    { accessorKey: "average", header: t("dashboard.avgReceipt"), cell: ({ row }) => <span className="tabular-nums">{formatMoney(row.original.average, locale)}</span> },
  ];

  const exportReport = () => {
    setExporting(true);
    window.setTimeout(() => {
      setExporting(false);
      toast.success(t("reports.exportReady"));
    }, 500);
  };

  return (
    <PageLayout>
      <PageHeader
        title={t("reports")}
        description={t("reports.operationalDescription")}
        actions={<Button onClick={exportReport} isLoading={exporting}><Download className="size-4" />{t("reports.export")}</Button>}
      />
      <AnalyticsFilters period={period} onPeriodChange={setPeriod} selectedStores={selectedStores} onStoresChange={setSelectedStores} range={range} onRangeChange={setRange} />
      <MetricStrip>
        <Metric label={t("reports.totalRevenue")} value={formatMoney(revenue, locale)} />
        <Metric label={t("reports.profit")} value={formatMoney(revenue - cost, locale)} />
        <Metric label={t("reports.customersOwe")} value={formatMoney(debt, locale)} tone={debt > 0 ? "danger" : "neutral"} />
        <Metric label={t("reports.supplierBalance")} value={formatMoney(supplierBalance, locale)} tone={supplierBalance > 0 ? "warning" : "neutral"} />
      </MetricStrip>

      <section className="mt-6 rounded-md border border-border bg-raised p-4">
        <SectionHeader title={t("reports.salesByDay")} description={t("reports.salesSeriesHelp")} />
        <TimeSeriesChart
          labels={points.map((point) => point.label)}
          series={[
            { name: t("reports.revenue"), values: points.map((point) => point.revenue), colorIndex: 1, area: true },
            { name: t("reports.cost"), values: points.map((point) => point.cost), colorIndex: 3 },
            { name: t("reports.profit"), values: points.map((point) => point.profit), colorIndex: 2 },
          ]}
          ariaLabel={t("reports.salesByDay")}
          height={340}
        />
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-md border border-border bg-raised p-4">
          <SectionHeader title={t("reports.topItems")} description={t("reports.rankedBySales")} />
          <HorizontalBarChart labels={ranked.map((item) => item.name)} values={ranked.map((item) => item.value)} ariaLabel={t("reports.topItems")} />
        </section>
        <section className="rounded-md border border-border bg-raised p-4">
          <SectionHeader title={t("reports.paymentMethods")} description={t("reports.paymentShare")} />
          <DonutChart data={paymentData} ariaLabel={t("reports.paymentMethods")} />
        </section>
      </div>

      <section className="mt-5">
        <SectionHeader title={t("reports.cashierPerformance")} description={t("reports.cashierHelp")} />
        <DataTable data={cashierRows} columns={columns} caption={t("reports.cashierPerformance")} emptyMessage={t("common.none")} />
      </section>
    </PageLayout>
  );
}

export default ReportsPage;
