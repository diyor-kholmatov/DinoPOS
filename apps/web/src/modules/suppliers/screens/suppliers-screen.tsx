import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { DataTable } from "@/components/data/data-table";
import { Metric, MetricStrip, PageHeader, PageLayout, SectionHeader } from "@/components/patterns/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { formatDateTime, formatMoney } from "@/lib/format";
import { useOperationsStore, type PurchaseOrder } from "@/stores/operations-store";
import { useSessionStore } from "@/stores/session-store";

const PurchaseOrderSchema = z.object({ supplierId: z.string().min(1), storeId: z.string().min(1), products: z.number().int().positive(), orderedAmount: z.number().positive() });
type PurchaseOrderValues = z.infer<typeof PurchaseOrderSchema>;

export function SuppliersPage() {
  const { t } = useTranslation();
  const suppliers = useOperationsStore((state) => state.suppliers);
  const orders = useOperationsStore((state) => state.purchaseOrders);
  const addOrder = useOperationsStore((state) => state.addPurchaseOrder);
  const stores = useSessionStore((state) => state.stores);
  const selectedStoreId = useSessionStore((state) => state.selectedStoreId);
  const locale = useSessionStore((state) => state.locale);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<PurchaseOrderValues>({ resolver: zodResolver(PurchaseOrderSchema), defaultValues: { supplierId: suppliers[0]?.id ?? "", storeId: selectedStoreId, products: 1, orderedAmount: 0 } });
  const submit = (values: PurchaseOrderValues) => {
    addOrder({ id: `PO-${Date.now().toString().slice(-4)}`, ...values, receivedAmount: 0, status: "created", createdAt: new Date().toISOString() });
    setOpen(false); reset(); toast.success(t("supplier.createOrder"));
  };
  const supplierName = (id: string) => suppliers.find((supplier) => supplier.id === id)?.name ?? id;
  const storeName = (id: string) => stores.find((store) => store.id === id)?.name ?? id;
  const columns: ColumnDef<PurchaseOrder>[] = [
    { accessorKey: "id", header: t("common.order"), cell: ({ row }) => <strong>{row.original.id}</strong> },
    { accessorKey: "supplierId", header: t("common.supplier"), cell: ({ row }) => supplierName(row.original.supplierId) },
    { accessorKey: "storeId", header: t("common.branch"), cell: ({ row }) => storeName(row.original.storeId) },
    { accessorKey: "products", header: t("suppliers.products"), cell: ({ row }) => <span className="tabular-nums">{row.original.products}</span> },
    { accessorKey: "orderedAmount", header: t("suppliers.ordered"), cell: ({ row }) => <span className="tabular-nums">{formatMoney(row.original.orderedAmount, locale)}</span> },
    { accessorKey: "receivedAmount", header: t("suppliers.received"), cell: ({ row }) => <span className="tabular-nums">{formatMoney(row.original.receivedAmount, locale)}</span> },
    { id: "remaining", header: t("suppliers.remaining"), accessorFn: (row) => row.orderedAmount - row.receivedAmount, cell: ({ row }) => <span className="text-warning tabular-nums">{formatMoney(Math.max(0, row.original.orderedAmount - row.original.receivedAmount), locale)}</span> },
    { accessorKey: "status", header: t("common.status"), cell: ({ row }) => <Badge variant={row.original.status === "paid" ? "positive" : row.original.status === "accepted" ? "information" : "neutral"}>{t(`status.${row.original.status}`)}</Badge> },
    { accessorKey: "createdAt", header: t("common.date"), cell: ({ row }) => formatDateTime(row.original.createdAt, locale) },
  ];
  const balance = suppliers.reduce((sum, supplier) => sum + supplier.balance, 0);
  return <PageLayout><PageHeader title={t("suppliers.title")} description={t("suppliers.description")} actions={<Button variant="primary" onClick={() => setOpen(true)}><Plus className="size-4" />{t("suppliers.createPo")}</Button>} /><MetricStrip><Metric label={t("common.supplier")} value={String(suppliers.length)} /><Metric label={t("common.order")} value={String(orders.length)} /><Metric label={t("status.pending")} value={String(orders.filter((order) => order.status !== "paid").length)} tone="warning" /><Metric label={t("suppliers.balance")} value={formatMoney(balance, locale)} tone={balance ? "warning" : "neutral"} /></MetricStrip><section className="mt-6"><SectionHeader title={t("suppliers.title")} /><DataTable data={orders} columns={columns} caption={t("suppliers.title")} emptyMessage={t("common.none")} /></section><Dialog open={open} onOpenChange={setOpen}><DialogContent closeLabel={t("common.closeDialog")}><DialogHeader><DialogTitle>{t("supplier.createOrder")}</DialogTitle><DialogDescription>{t("suppliers.description")}</DialogDescription></DialogHeader><form className="grid gap-3" onSubmit={handleSubmit(submit)}><SelectField label={t("common.supplier")} value={watch("supplierId")} onChange={(value) => setValue("supplierId", value)} options={suppliers.map((supplier) => ({ id: supplier.id, label: supplier.name, description: supplier.phone }))} /><SelectField label={t("common.branch")} value={watch("storeId")} onChange={(value) => setValue("storeId", value)} options={stores.map((store) => ({ id: store.id, label: store.name }))} /><label className="grid gap-1.5 text-xs font-semibold text-muted">{t("suppliers.products")}<Input type="number" {...register("products", { valueAsNumber: true })} /></label><label className="grid gap-1.5 text-xs font-semibold text-muted">{t("form.orderedAmount")}<Input type="number" {...register("orderedAmount", { valueAsNumber: true })} /></label>{Object.keys(errors).length ? <p className="text-xs text-danger">{t("common.validation")}</p> : null}<Button type="submit" variant="primary">{t("common.save")}</Button></form></DialogContent></Dialog></PageLayout>;
}

export default SuppliersPage;
