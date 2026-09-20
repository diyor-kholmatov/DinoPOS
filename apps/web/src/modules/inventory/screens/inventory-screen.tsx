import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Boxes, Plus, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import type { Product } from "@/entities/product/model";
import { DataTable } from "@/components/data/data-table";
import { Metric, MetricStrip, PageHeader, PageLayout, SectionHeader, SegmentedControl } from "@/components/patterns/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { formatDateTime } from "@/lib/format";
import { useCatalogStore } from "@/stores/catalog-store";
import { useOperationsStore } from "@/stores/operations-store";
import { useSessionStore } from "@/stores/session-store";

const AdjustmentSchema = z.object({ productId: z.string().min(1), quantity: z.number().int().refine((value) => value !== 0), reason: z.string().trim().min(2) });
type AdjustmentValues = z.infer<typeof AdjustmentSchema>;

export function InventoryPage() {
  const { t } = useTranslation();
  const products = useCatalogStore((state) => state.products);
  const movements = useCatalogStore((state) => state.stockMovements);
  const adjustStock = useCatalogStore((state) => state.adjustStock);
  const purchaseOrders = useOperationsStore((state) => state.purchaseOrders);
  const addStocktake = useOperationsStore((state) => state.addStocktake);
  const selectedStoreId = useSessionStore((state) => state.selectedStoreId);
  const locale = useSessionStore((state) => state.locale);
  const [filter, setFilter] = useState("all");
  const [adjustOpen, setAdjustOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AdjustmentValues>({ resolver: zodResolver(AdjustmentSchema), defaultValues: { productId: products.find((item) => item.unit === "pcs")?.id ?? "", quantity: 1, reason: "" } });
  const physicalProducts = products.filter((product) => product.unit === "pcs");
  const visible = useMemo(() => physicalProducts.filter((product) => {
    const stock = product.stockByStore[selectedStoreId] ?? 0;
    return filter === "all" || (filter === "low" && stock > 0 && stock <= 5) || (filter === "out" && stock === 0);
  }), [filter, physicalProducts, selectedStoreId]);
  const lowCount = physicalProducts.filter((product) => { const stock = product.stockByStore[selectedStoreId] ?? 0; return stock > 0 && stock <= 5; }).length;
  const outCount = physicalProducts.filter((product) => (product.stockByStore[selectedStoreId] ?? 0) === 0).length;
  const incoming = purchaseOrders.filter((order) => order.storeId === selectedStoreId && order.status !== "paid").length;
  const submitAdjustment = (values: AdjustmentValues) => {
    if (!adjustStock(values.productId, selectedStoreId, values.quantity, "Liam Johnson")) {
      toast.error(t("checkout.stockChanged")); return;
    }
    setAdjustOpen(false); reset(); toast.success(t("toast.stockSaved"));
  };
  const startStocktake = () => {
    addStocktake({ id: `INV-${Date.now().toString().slice(-3)}`, storeId: selectedStoreId, status: "in_progress", progress: 0, variance: 0, createdAt: new Date().toISOString() });
    toast.success(t("toast.stocktakeStarted"));
  };
  const columns: ColumnDef<Product>[] = [
    { accessorKey: "name", header: t("catalog.item"), cell: ({ row }) => <span><strong className="block">{row.original.name}</strong><small className="text-xs text-muted">{row.original.sku}</small></span> },
    { accessorKey: "category", header: t("common.category") },
    { id: "stock", header: t("inventory.physical"), accessorFn: (row) => row.stockByStore[selectedStoreId] ?? 0, cell: ({ row }) => <span className="tabular-nums">{row.original.stockByStore[selectedStoreId] ?? 0}</span> },
    { id: "reserved", header: t("inventory.reserved"), accessorFn: (row) => useCatalogStore.getState().heldByProduct[row.id] ?? 0, cell: ({ row }) => <span className="tabular-nums">{useCatalogStore.getState().heldByProduct[row.original.id] ?? 0}</span> },
    { id: "status", header: t("common.status"), cell: ({ row }) => { const stock = row.original.stockByStore[selectedStoreId] ?? 0; return <Badge variant={stock === 0 ? "danger" : stock <= 5 ? "warning" : "positive"}>{t(stock === 0 ? "status.outOfStock" : stock <= 5 ? "status.low" : "status.inStock")}</Badge>; } },
    { accessorKey: "supplier", header: t("common.supplier") },
  ];
  const movementColumns: ColumnDef<(typeof movements)[number]>[] = [
    { accessorKey: "productName", header: t("catalog.item") },
    { accessorKey: "type", header: t("common.status") },
    { accessorKey: "quantity", header: t("common.quantity"), cell: ({ row }) => <span className={row.original.quantity < 0 ? "text-danger tabular-nums" : "text-positive tabular-nums"}>{row.original.quantity > 0 ? "+" : ""}{row.original.quantity}</span> },
    { accessorKey: "actor", header: t("common.operator") },
    { accessorKey: "createdAt", header: t("common.date"), cell: ({ row }) => formatDateTime(row.original.createdAt, locale) },
  ];

  return (
    <PageLayout>
      <PageHeader title={t("inventory.title")} description={t("inventory.description")} actions={<><Button onClick={() => setAdjustOpen(true)}><SlidersHorizontal className="size-4" />{t("inventory.stockAdjustment")}</Button><Button variant="primary" onClick={startStocktake}><Plus className="size-4" />{t("inventory.start")}</Button></>} />
      <MetricStrip>
        <Metric label={t("inventory.totalItems")} value={String(physicalProducts.length)} />
        <Metric label={t("inventory.lowStock")} value={String(lowCount)} tone={lowCount ? "warning" : "neutral"} />
        <Metric label={t("inventory.outOfStock")} value={String(outCount)} tone={outCount ? "danger" : "neutral"} />
        <Metric label={t("inventory.incoming")} value={String(incoming)} help={t("inventory.purchaseOrders")} />
      </MetricStrip>
      <div className="mt-5"><SegmentedControl label={t("inventory.stockLevels")} value={filter} onChange={setFilter} options={[{ id: "all", label: t("common.all") }, { id: "low", label: t("inventory.lowStock") }, { id: "out", label: t("inventory.outOfStock") }]} /></div>
      <section className="mt-5"><SectionHeader title={t("inventory.stockLevels")} description={t("inventory.stockByBranch")} /><DataTable data={visible} columns={columns} caption={t("inventory.stockLevels")} emptyMessage={t("common.none")} /></section>
      <section className="mt-6"><SectionHeader title={t("inventory.movementLog")} description={t("inventory.offlineLog")} /><DataTable data={movements} columns={movementColumns} caption={t("inventory.movementLog")} emptyMessage={t("common.none")} pageSize={6} density="compact" /></section>
      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}><DialogContent closeLabel={t("common.closeDialog")}><DialogHeader><DialogTitle>{t("inventory.stockAdjustment")}</DialogTitle><DialogDescription>{t("inventory.description")}</DialogDescription></DialogHeader><form className="grid gap-3" onSubmit={handleSubmit(submitAdjustment)}><label className="grid gap-1.5 text-xs font-semibold text-muted">{t("catalog.item")}<select className="h-11 rounded-md border border-border bg-raised px-3 text-ink" {...register("productId")}>{physicalProducts.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label><label className="grid gap-1.5 text-xs font-semibold text-muted">{t("common.quantity")}<Input type="number" {...register("quantity", { valueAsNumber: true })} /></label><label className="grid gap-1.5 text-xs font-semibold text-muted">{t("operation.reason")}<Input {...register("reason")} /></label>{Object.keys(errors).length ? <p className="text-xs text-danger">{t("common.validation")}</p> : null}<Button type="submit" variant="primary">{t("common.save")}</Button></form></DialogContent></Dialog>
    </PageLayout>
  );
}

export default InventoryPage;
