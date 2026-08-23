import type { ColumnDef } from "@tanstack/react-table";
import { Download, Eye } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { Sale } from "@/entities/sale/model";
import { DataTable } from "@/components/data/data-table";
import { Metric, MetricStrip, PageHeader, PageLayout, SectionHeader, SegmentedControl } from "@/components/patterns/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { SearchField } from "@/components/ui/search-field";
import { formatDateTime, formatMoney } from "@/lib/format";
import { useSalesStore } from "@/stores/sales-store";
import { useSessionStore } from "@/stores/session-store";

export function SalesPage() {
  const { t } = useTranslation();
  const sales = useSalesStore((state) => state.sales);
  const locale = useSessionStore((state) => state.locale);
  const [search, setSearch] = useState("");
  const [payment, setPayment] = useState("all");
  const [selected, setSelected] = useState<Sale | null>(null);
  const visible = useMemo(() => sales.filter((sale) => {
    const needle = search.trim().toLocaleLowerCase();
    return (!needle || `${sale.receiptNumber} ${sale.customerName} ${sale.cashierName}`.toLocaleLowerCase().includes(needle)) && (payment === "all" || sale.paymentMethod === payment);
  }), [payment, sales, search]);
  const columns: ColumnDef<Sale>[] = [
    { accessorKey: "receiptNumber", header: t("sales.receipt"), cell: ({ row }) => <strong>{row.original.receiptNumber}</strong> },
    { accessorKey: "createdAt", header: t("common.date"), cell: ({ row }) => formatDateTime(row.original.createdAt, locale) },
    { accessorKey: "customerName", header: t("common.customer") },
    { accessorKey: "cashierName", header: t("sales.cashier") },
    { accessorKey: "paymentMethod", header: t("common.payment"), cell: ({ row }) => t(`payment.${row.original.paymentMethod}`) },
    { accessorKey: "total", header: t("common.total"), cell: ({ row }) => <strong className="tabular-nums">{formatMoney(row.original.total, locale)}</strong> },
    { accessorKey: "fiscalized", header: t("common.fiscal"), cell: ({ row }) => <Badge variant={row.original.fiscalized ? "positive" : "warning"}>{t(row.original.fiscalized ? "status.fiscalized" : "status.nonFiscal")}</Badge> },
    { id: "action", enableSorting: false, header: t("common.action"), cell: ({ row }) => <IconButton label={t("common.view")} size="small" tooltipSide="left" onClick={() => setSelected(row.original)}><Eye className="size-4" /></IconButton> },
  ];
  return <PageLayout><PageHeader title={t("sales")} description={t("sales.description")} actions={<Button onClick={() => toast.success(t("reports.exportReady"))}><Download className="size-4" />{t("sales.export")}</Button>} /><MetricStrip><Metric label={t("dashboard.orders")} value={String(sales.length)} /><Metric label={t("reports.totalRevenue")} value={formatMoney(sales.reduce((sum, sale) => sum + sale.total, 0), locale)} /><Metric label={t("status.fiscalized")} value={String(sales.filter((sale) => sale.fiscalized).length)} /><Metric label={t("dashboard.avgReceipt")} value={formatMoney(sales.length ? sales.reduce((sum, sale) => sum + sale.total, 0) / sales.length : 0, locale)} /></MetricStrip><section className="mt-5 flex flex-wrap items-center gap-3"><SearchField className="w-full sm:max-w-md" label={t("table.search")} placeholder={t("table.search")} value={search} onChange={setSearch} /><SegmentedControl label={t("common.payment")} value={payment} onChange={setPayment} options={[{ id: "all", label: t("common.all") }, { id: "cash", label: t("payment.cash") }, { id: "card", label: t("payment.card") }, { id: "qr", label: t("payment.qr") }]} /></section><section className="mt-5"><SectionHeader title={t("sales")} /><DataTable data={visible} columns={columns} caption={t("sales")} emptyMessage={t("common.none")} /></section><Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}><DialogContent closeLabel={t("common.closeDialog")}><DialogHeader><DialogTitle>{t("template.receiptTitle", { id: selected?.receiptNumber })}</DialogTitle><DialogDescription>{selected ? formatDateTime(selected.createdAt, locale) : ""}</DialogDescription></DialogHeader>{selected ? <div><dl className="grid grid-cols-2 gap-3"><div><dt className="text-xs text-muted">{t("common.customer")}</dt><dd className="font-semibold">{selected.customerName}</dd></div><div><dt className="text-xs text-muted">{t("sales.cashier")}</dt><dd className="font-semibold">{selected.cashierName}</dd></div></dl><ul className="my-4 divide-y divide-border">{selected.lines.map((line) => <li key={line.productId} className="flex justify-between gap-3 py-2 text-sm"><span>{line.name} × {line.quantity}</span><span className="tabular-nums">{formatMoney(line.unitPrice * line.quantity, locale)}</span></li>)}</ul><div className="flex justify-between border-t border-border pt-3 text-lg font-bold"><span>{t("common.total")}</span><span className="tabular-nums">{formatMoney(selected.total, locale)}</span></div></div> : null}</DialogContent></Dialog></PageLayout>;
}

export default SalesPage;
