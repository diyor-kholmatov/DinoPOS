import type { ColumnDef } from "@tanstack/react-table";
import { Check, Plus, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DataTable } from "@/components/data/data-table";
import { Metric, MetricStrip, PageHeader, PageLayout, SectionHeader } from "@/components/patterns/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { formatDateTime, formatMoney } from "@/lib/format";
import { useCatalogStore } from "@/stores/catalog-store";
import { useCheckoutStore } from "@/stores/checkout-store";
import { useCustomerStore } from "@/stores/customer-store";
import { useOperationsStore, type HoldRecord } from "@/stores/operations-store";
import { useSessionStore } from "@/stores/session-store";

export function HoldsPage() {
  const { t } = useTranslation();
  const holds = useOperationsStore((state) => state.holds);
  const addHold = useOperationsStore((state) => state.addHold);
  const updateStatus = useOperationsStore((state) => state.updateHoldStatus);
  const cart = useCheckoutStore((state) => state.cart);
  const selectedCustomerId = useCheckoutStore((state) => state.selectedCustomerId);
  const clearCart = useCheckoutStore((state) => state.clearCart);
  const customers = useCustomerStore((state) => state.customers);
  const reserveHeldStock = useCatalogStore((state) => state.reserveHeldStock);
  const releaseHeldStock = useCatalogStore((state) => state.releaseHeldStock);
  const adjustStock = useCatalogStore((state) => state.adjustStock);
  const selectedStoreId = useSessionStore((state) => state.selectedStoreId);
  const register = useSessionStore((state) => state.register);
  const registerMode = useSessionStore((state) => state.registerMode);
  const locale = useSessionStore((state) => state.locale);
  const [open, setOpen] = useState(false);
  const [customerId, setCustomerId] = useState(selectedCustomerId);
  const [deposit, setDeposit] = useState(0);
  const active = holds.filter((hold) => hold.status === "active");
  const create = () => {
    const customer = customers.find((item) => item.id === customerId);
    if (!customer || !cart.length) { toast.error(t("toast.basketEmpty")); return; }
    const lines = cart.map((line) => ({ productId: line.productId, productName: line.name, quantity: line.quantity, unitPrice: line.unitPrice }));
    reserveHeldStock(lines);
    addHold({ id: `HOLD-${Date.now().toString().slice(-4)}`, customerId, customerName: customer.name, storeId: selectedStoreId, lines, deposit, status: "active", createdAt: new Date().toISOString() });
    clearCart(); setOpen(false); setDeposit(0); toast.success(t("toast.holdCreated"));
  };
  const cancel = (hold: HoldRecord) => { releaseHeldStock(hold.lines); updateStatus(hold.id, "cancelled"); toast.success(t("toast.holdCancelled")); };
  const redeem = (hold: HoldRecord) => {
    if (registerMode === "full" && !register.isOpen) { toast.error(t("toast.openShiftRedeem")); return; }
    releaseHeldStock(hold.lines);
    for (const line of hold.lines) adjustStock(line.productId, hold.storeId, -line.quantity, "Liam Johnson");
    updateStatus(hold.id, "redeemed"); toast.success(t("toast.holdRedeemed"));
  };
  const columns: ColumnDef<HoldRecord>[] = [
    { accessorKey: "id", header: t("common.order") },
    { accessorKey: "customerName", header: t("holds.customerHold") },
    { id: "items", header: t("common.items"), accessorFn: (row) => row.lines.reduce((sum, line) => sum + line.quantity, 0), cell: ({ row }) => <span className="tabular-nums">{row.original.lines.reduce((sum, line) => sum + line.quantity, 0)}</span> },
    { accessorKey: "deposit", header: t("common.deposit"), cell: ({ row }) => <span className="text-positive tabular-nums">{formatMoney(row.original.deposit, locale)}</span> },
    { accessorKey: "createdAt", header: t("common.date"), cell: ({ row }) => formatDateTime(row.original.createdAt, locale) },
    { accessorKey: "status", header: t("common.status"), cell: ({ row }) => <Badge variant={row.original.status === "active" ? "warning" : row.original.status === "redeemed" ? "positive" : "neutral"}>{t(row.original.status === "active" ? "status.holdActive" : `status.${row.original.status}`)}</Badge> },
    { id: "action", enableSorting: false, header: t("common.action"), cell: ({ row }) => row.original.status === "active" ? <div className="flex gap-1"><Button size="iconSmall" variant="quiet" aria-label={t("holds.redeem")} onClick={() => redeem(row.original)}><Check className="size-4 text-positive" /></Button><Button size="iconSmall" variant="quiet" aria-label={t("holds.cancelRelease")} onClick={() => cancel(row.original)}><X className="size-4 text-danger" /></Button></div> : null },
  ];
  const liability = active.reduce((sum, hold) => sum + hold.deposit, 0);
  return <PageLayout><PageHeader title={t("holds")} description={t("holds.description")} actions={<Button variant="primary" onClick={() => setOpen(true)} disabled={!cart.length}><Plus className="size-4" />{t("holds.create")}</Button>} /><MetricStrip><Metric label={t("holds.active")} value={String(active.length)} /><Metric label={t("holds.units")} value={String(active.reduce((sum, hold) => sum + hold.lines.reduce((lineSum, line) => lineSum + line.quantity, 0), 0))} /><Metric label={t("holds.liability")} value={formatMoney(liability, locale)} tone="warning" /><Metric label={t("holds.stockRule")} value={t("common.localFirst")} help={t("holds.physicalIncludes")} /></MetricStrip><section className="mt-6"><SectionHeader title={t("holds.active")} description={t("holds.stockRuleHelp")} /><DataTable data={holds} columns={columns} caption={t("holds.active")} emptyMessage={t("common.none")} /></section><Dialog open={open} onOpenChange={setOpen}><DialogContent closeLabel={t("common.closeDialog")}><DialogHeader><DialogTitle>{t("holds.createCustomer")}</DialogTitle><DialogDescription>{t("holds.placeBasket")}</DialogDescription></DialogHeader><div className="grid gap-3"><SelectField label={t("common.customer")} value={customerId} onChange={setCustomerId} options={customers.map((customer) => ({ id: customer.id, label: customer.name, description: customer.phone }))} /><div><span className="text-xs font-semibold text-muted">{t("holds.basket")}</span><ul className="mt-2 divide-y divide-border">{cart.map((line) => <li key={line.productId} className="flex justify-between py-2 text-sm"><span>{line.name} × {line.quantity}</span><span className="tabular-nums">{formatMoney(line.unitPrice * line.quantity, locale)}</span></li>)}</ul></div><label className="grid gap-1.5 text-xs font-semibold text-muted">{t("common.deposit")}<Input type="number" value={deposit} onChange={(event) => setDeposit(Math.max(0, Number(event.target.value)))} /></label><Button variant="primary" onClick={create}>{t("holds.create")}</Button></div></DialogContent></Dialog></PageLayout>;
}

export default HoldsPage;
