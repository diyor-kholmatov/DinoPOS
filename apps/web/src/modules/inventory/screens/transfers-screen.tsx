import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRightLeft, Check, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { DataTable } from "@/components/data/data-table";
import { PageHeader, PageLayout, SectionHeader } from "@/components/patterns/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { formatDateTime } from "@/lib/format";
import { useCatalogStore } from "@/stores/catalog-store";
import { useOperationsStore, type TransferRecord } from "@/stores/operations-store";
import { useSessionStore } from "@/stores/session-store";

const TransferSchema = z.object({
  sourceStoreId: z.string().min(1),
  destinationStoreId: z.string().min(1),
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
}).refine((value) => value.sourceStoreId !== value.destinationStoreId, { path: ["destinationStoreId"] });
type TransferValues = z.infer<typeof TransferSchema>;

export function TransfersPage() {
  const { t } = useTranslation();
  const products = useCatalogStore((state) => state.products).filter((item) => item.unit === "pcs");
  const adjustStock = useCatalogStore((state) => state.adjustStock);
  const transfers = useOperationsStore((state) => state.transfers);
  const addTransfer = useOperationsStore((state) => state.addTransfer);
  const updateStatus = useOperationsStore((state) => state.updateTransferStatus);
  const stores = useSessionStore((state) => state.stores);
  const selectedStoreId = useSessionStore((state) => state.selectedStoreId);
  const locale = useSessionStore((state) => state.locale);
  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<TransferValues>({
    resolver: zodResolver(TransferSchema),
    defaultValues: { sourceStoreId: selectedStoreId, destinationStoreId: stores.find((store) => store.id !== selectedStoreId)?.id ?? "", productId: products[0]?.id ?? "", quantity: 1 },
  });
  const sourceStoreId = watch("sourceStoreId");
  const productId = watch("productId");
  const selectedProduct = products.find((item) => item.id === productId);
  const send = (values: TransferValues, status: "draft" | "sent") => {
    const product = products.find((item) => item.id === values.productId);
    if (!product) return;
    if (status === "sent" && !adjustStock(product.id, values.sourceStoreId, -values.quantity, "Liam Johnson")) {
      toast.error(t("checkout.stockChanged")); return;
    }
    addTransfer({ id: `TR-${Date.now().toString().slice(-5)}`, productId: product.id, productName: product.name, sourceStoreId: values.sourceStoreId, destinationStoreId: values.destinationStoreId, quantity: values.quantity, status, createdAt: new Date().toISOString() });
    toast.success(t(status === "draft" ? "toast.transferDraft" : "transfer.send"));
    reset({ ...values, quantity: 1 });
  };
  const receive = (record: TransferRecord) => {
    if (!adjustStock(record.productId, record.destinationStoreId, record.quantity, "Liam Johnson")) return;
    updateStatus(record.id, "accepted");
    toast.success(t("status.accepted"));
  };
  const storeName = (id: string) => stores.find((store) => store.id === id)?.name ?? id;
  const columns: ColumnDef<TransferRecord>[] = [
    { accessorKey: "id", header: t("common.order") },
    { accessorKey: "productName", header: t("catalog.item") },
    { accessorKey: "sourceStoreId", header: t("transfer.source"), cell: ({ row }) => storeName(row.original.sourceStoreId) },
    { accessorKey: "destinationStoreId", header: t("transfer.destination"), cell: ({ row }) => storeName(row.original.destinationStoreId) },
    { accessorKey: "quantity", header: t("common.quantity"), cell: ({ row }) => <span className="tabular-nums">{row.original.quantity}</span> },
    { accessorKey: "status", header: t("common.status"), cell: ({ row }) => <Badge variant={row.original.status === "accepted" ? "positive" : row.original.status === "sent" ? "information" : "neutral"}>{t(`status.${row.original.status}`)}</Badge> },
    { accessorKey: "createdAt", header: t("common.date"), cell: ({ row }) => formatDateTime(row.original.createdAt, locale) },
    { id: "action", enableSorting: false, header: t("common.action"), cell: ({ row }) => row.original.status === "sent" ? <Button size="small" onClick={() => receive(row.original)}><Check className="size-4" />{t("transfer.receive")}</Button> : null },
  ];

  return (
    <PageLayout>
      <PageHeader title={t("transfer")} description={t("transfer.description")} />
      <section className="mt-5 rounded-md border border-border bg-raised p-4">
        <SectionHeader title={t("transfer.create")} description={t("transfer.historyHelp")} />
        <form className="grid gap-3 lg:grid-cols-4" onSubmit={handleSubmit((values) => send(values, "sent"))}>
          <SelectField label={t("transfer.source")} value={sourceStoreId} onChange={(value) => setValue("sourceStoreId", value)} options={stores.map((store) => ({ id: store.id, label: store.name }))} />
          <SelectField label={t("transfer.destination")} value={watch("destinationStoreId")} onChange={(value) => setValue("destinationStoreId", value)} options={stores.map((store) => ({ id: store.id, label: store.name }))} />
          <SelectField label={t("catalog.item")} value={productId} onChange={(value) => setValue("productId", value)} options={products.map((product) => ({ id: product.id, label: product.name, description: `${product.stockByStore[sourceStoreId] ?? 0} ${t("common.stock")}` }))} />
          <label className="grid gap-1.5 text-xs font-semibold text-muted">{t("transfer.sendQty")}<Input type="number" min="1" {...register("quantity", { valueAsNumber: true })} /></label>
          <div className="lg:col-span-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <p className="text-sm text-muted">{t("transfer.senderStock")}: <strong className="text-ink tabular-nums">{selectedProduct?.stockByStore[sourceStoreId] ?? 0}</strong></p>
            <div className="flex gap-2">
              <Button type="button" onClick={handleSubmit((values) => send(values, "draft"))}>{t("transfer.saveDraft")}</Button>
              <Button type="submit" variant="primary"><ArrowRightLeft className="size-4" />{t("transfer.send")}</Button>
            </div>
          </div>
          {Object.keys(errors).length ? <p className="text-xs text-danger lg:col-span-4">{t("common.validation")}</p> : null}
        </form>
      </section>
      <section className="mt-6"><SectionHeader title={t("transfer.history")} description={t("transfer.historyHelp")} /><DataTable data={transfers} columns={columns} caption={t("transfer.history")} emptyMessage={t("common.none")} /></section>
    </PageLayout>
  );
}

export default TransfersPage;
