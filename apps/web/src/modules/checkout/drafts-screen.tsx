import type { ColumnDef } from "@tanstack/react-table";
import { Play, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { CheckoutDraft } from "@/modules/checkout/model/checkout-store";
import { DataTable } from "@/shared/data/data-table";
import { Metric, MetricStrip, PageHeader, PageLayout, SectionHeader } from "@/shared/patterns/page";
import { Button } from "@/shared/ui/button";
import { IconButton } from "@/shared/ui/icon-button";
import { formatDateTime, formatMoney } from "@/shared/lib/format";
import { useCheckoutStore } from "@/modules/checkout/model/checkout-store";
import { useSessionStore } from "@/modules/session/model";

export function DraftsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const drafts = useCheckoutStore((state) => state.drafts);
  const restoreDraft = useCheckoutStore((state) => state.restoreDraft);
  const deleteDraft = useCheckoutStore((state) => state.deleteDraft);
  const locale = useSessionStore((state) => state.locale);
  const draftItemCount = (draft: CheckoutDraft) => draft.cart.reduce((sum, line) => sum + line.quantity, 0);
  const draftValue = (draft: CheckoutDraft) => draft.cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const totalItems = drafts.reduce((sum, draft) => sum + draftItemCount(draft), 0);
  const totalValue = drafts.reduce((sum, draft) => sum + draftValue(draft), 0);
  const columns: ColumnDef<CheckoutDraft>[] = [
    { accessorKey: "id", header: t("common.order"), cell: ({ row }) => <strong>{row.original.id.slice(0, 14)}</strong> },
    { accessorKey: "createdAt", header: t("drafts.lastSaved"), cell: ({ row }) => formatDateTime(row.original.createdAt, locale) },
    { id: "items", header: t("common.items"), accessorFn: draftItemCount, cell: ({ row }) => draftItemCount(row.original) },
    { id: "value", header: t("drafts.value"), accessorFn: draftValue, cell: ({ row }) => <span className="tabular-nums">{formatMoney(draftValue(row.original), locale)}</span> },
    { id: "actions", enableSorting: false, header: t("common.action"), cell: ({ row }) => <div className="flex gap-1"><IconButton label={t("drafts.continue")} size="small" onClick={() => { if (restoreDraft(row.original.id)) navigate("/checkout"); }}><Play className="size-4" /></IconButton><IconButton label={t("common.delete")} size="small" tooltipSide="left" onClick={() => { deleteDraft(row.original.id); toast.success(t("toast.draftDeleted")); }}><Trash2 className="size-4 text-danger" /></IconButton></div> },
  ];
  return <PageLayout><PageHeader title={t("drafts")} description={t("drafts.description")} /><MetricStrip><Metric label={t("drafts.open")} value={String(drafts.length)} /><Metric label={t("drafts.itemsWaiting")} value={String(totalItems)} /><Metric label={t("drafts.value")} value={formatMoney(totalValue, locale)} /><Metric label={t("drafts.recovery")} value={t("common.localFirst")} help={t("drafts.survives")} /></MetricStrip><section className="mt-6"><SectionHeader title={t("drafts.open")} description={t("drafts.stockNotReserved")} /><DataTable data={drafts} columns={columns} caption={t("drafts.open")} emptyMessage={t("drafts.empty")} /></section></PageLayout>;
}

export default DraftsPage;
