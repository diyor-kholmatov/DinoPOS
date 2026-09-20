import type { ColumnDef } from "@tanstack/react-table";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DataTable } from "@/components/data/data-table";
import { PageHeader, PageLayout, SectionHeader, SegmentedControl } from "@/components/patterns/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { formatDateTime, formatMoney } from "@/lib/format";
import { useCatalogStore } from "@/stores/catalog-store";
import { useCustomerStore } from "@/stores/customer-store";
import { useOperationsStore, type ReturnRecord } from "@/stores/operations-store";
import { useSalesStore } from "@/stores/sales-store";
import { useSessionStore } from "@/stores/session-store";

export function ReturnsPage() {
  const { t } = useTranslation();
  const sales = useSalesStore((state) => state.sales);
  const returns = useOperationsStore((state) => state.returns);
  const addReturn = useOperationsStore((state) => state.addReturn);
  const adjustStock = useCatalogStore((state) => state.adjustStock);
  const addPrepayment = useCustomerStore((state) => state.addPrepayment);
  const register = useSessionStore((state) => state.register);
  const registerMode = useSessionStore((state) => state.registerMode);
  const adjustExpectedCash = useSessionStore((state) => state.adjustExpectedCash);
  const locale = useSessionStore((state) => state.locale);
  const [saleId, setSaleId] = useState(sales[0]?.id ?? "");
  const [type, setType] = useState("return");
  const [method, setMethod] = useState("cash");
  const selectedSale = sales.find((sale) => sale.id === saleId);
  const [amount, setAmount] = useState(selectedSale?.total ?? 0);
  const process = () => {
    if (!selectedSale || amount <= 0 || amount > selectedSale.total) { toast.error(t("common.validation")); return; }
    if (registerMode === "full" && !register.isOpen) { toast.error(t("toast.openShiftReturn")); return; }
    const line = selectedSale.lines[0];
    if (line) adjustStock(line.productId, selectedSale.storeId, 1, "Liam Johnson");
    if (method === "cash") adjustExpectedCash(-amount); else addPrepayment(selectedSale.customerId, amount);
    addReturn({ id: `RET-${Date.now().toString().slice(-4)}`, saleId: selectedSale.id, customerName: selectedSale.customerName, type: type as "return" | "exchange", amount, paymentMethod: method as "cash" | "prepayment", status: "completed", createdAt: new Date().toISOString() });
    toast.success(t(type === "return" ? "returns.processReturn" : "returns.processExchange"));
  };
  const columns: ColumnDef<ReturnRecord>[] = [
    { accessorKey: "id", header: t("common.order") },
    { accessorKey: "saleId", header: t("returns.originalSale") },
    { accessorKey: "customerName", header: t("common.customer") },
    { accessorKey: "type", header: t("common.status"), cell: ({ row }) => <Badge variant="information">{t(`status.${row.original.type}`)}</Badge> },
    { accessorKey: "amount", header: t("common.amount"), cell: ({ row }) => <span className="tabular-nums">{formatMoney(row.original.amount, locale)}</span> },
    { accessorKey: "paymentMethod", header: t("common.payment"), cell: ({ row }) => t(`payment.${row.original.paymentMethod}`) },
    { accessorKey: "createdAt", header: t("common.date"), cell: ({ row }) => formatDateTime(row.original.createdAt, locale) },
  ];
  return <PageLayout><PageHeader title={t("returns")} description={t("returns.description")} /><section className="mt-5 rounded-md border border-border bg-raised p-4"><SectionHeader title={t("returns.originalSale")} description={t("returns.originalRequired")} /><div className="grid gap-3 lg:grid-cols-4"><SelectField label={t("sales.receipt")} value={saleId} onChange={(value) => { setSaleId(value); setAmount(sales.find((sale) => sale.id === value)?.total ?? 0); }} options={sales.map((sale) => ({ id: sale.id, label: sale.receiptNumber, description: `${sale.customerName} · ${formatMoney(sale.total, locale)}` }))} /><label className="grid gap-1.5 text-xs font-semibold text-muted">{t("common.amount")}<Input type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} /></label><div><span className="mb-1.5 block text-xs font-semibold text-muted">{t("common.status")}</span><SegmentedControl label={t("common.status")} value={type} onChange={setType} options={[{ id: "return", label: t("status.return") }, { id: "exchange", label: t("status.exchange") }]} /></div><SelectField label={t("returns.payoutMethod")} value={method} onChange={setMethod} options={[{ id: "cash", label: t("returns.payCash") }, { id: "prepayment", label: t("returns.creditDeposit") }]} /></div><div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4"><p className="text-sm text-muted">{t("returns.sharedHelp")}</p><Button variant="primary" onClick={process}><RotateCcw className="size-4" />{t(type === "return" ? "returns.processReturn" : "returns.processExchange")}</Button></div></section><section className="mt-6"><SectionHeader title={t("returns.recent")} description={t("returns.immutable")} /><DataTable data={returns} columns={columns} caption={t("returns.recent")} emptyMessage={t("common.none")} /></section></PageLayout>;
}

export default ReturnsPage;
