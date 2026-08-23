import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/data/data-table";
import { Metric, MetricStrip, PageHeader, PageLayout, SectionHeader } from "@/components/patterns/page";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatMoney } from "@/lib/format";
import { useOperationsStore, type ShiftHistoryRecord } from "@/stores/operations-store";
import { useSessionStore } from "@/stores/session-store";

export function RegisterHistoryPage() {
  const { t } = useTranslation();
  const history = useOperationsStore((state) => state.shiftHistory);
  const stores = useSessionStore((state) => state.stores);
  const locale = useSessionStore((state) => state.locale);
  const columns: ColumnDef<ShiftHistoryRecord>[] = [
    { accessorKey: "id", header: t("history.shift"), cell: ({ row }) => <strong>{row.original.id}</strong> },
    { accessorKey: "storeId", header: t("common.branch"), cell: ({ row }) => stores.find((store) => store.id === row.original.storeId)?.name ?? row.original.storeId },
    { accessorKey: "cashierName", header: t("shift.cashier") },
    { accessorKey: "openedAt", header: t("common.opened"), cell: ({ row }) => formatDateTime(row.original.openedAt, locale) },
    { accessorKey: "closedAt", header: t("history.closed"), cell: ({ row }) => formatDateTime(row.original.closedAt, locale) },
    { accessorKey: "expectedAmount", header: t("history.expectedClose"), cell: ({ row }) => <span className="tabular-nums">{formatMoney(row.original.expectedAmount, locale)}</span> },
    { accessorKey: "countedAmount", header: t("history.countedTotal"), cell: ({ row }) => <span className="tabular-nums">{formatMoney(row.original.countedAmount, locale)}</span> },
    { accessorKey: "variance", header: t("common.variance"), cell: ({ row }) => <Badge variant={row.original.variance === 0 ? "positive" : "danger"}>{formatMoney(row.original.variance, locale)}</Badge> },
  ];
  const totalVariance = history.reduce((sum, record) => sum + record.variance, 0);
  return <PageLayout><PageHeader title={t("register-history")} description={t("history.description")} /><MetricStrip><Metric label={t("history.shift")} value={String(history.length)} /><Metric label={t("shift.balanced")} value={String(history.filter((record) => record.variance === 0).length)} tone="positive" /><Metric label={t("status.variance")} value={String(history.filter((record) => record.variance !== 0).length)} tone={history.some((record) => record.variance !== 0) ? "danger" : "neutral"} /><Metric label={t("common.variance")} value={formatMoney(totalVariance, locale)} tone={totalVariance === 0 ? "neutral" : "danger"} /></MetricStrip><section className="mt-6"><SectionHeader title={t("register-history")} description={t("history.immutable")} /><DataTable data={history} columns={columns} caption={t("register-history")} emptyMessage={t("history.none")} /></section></PageLayout>;
}

export default RegisterHistoryPage;
