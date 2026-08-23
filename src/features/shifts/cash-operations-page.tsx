import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDownToLine, ArrowUpFromLine, Banknote } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { DataTable } from "@/components/data/data-table";
import { PageHeader, PageLayout, SectionHeader } from "@/components/patterns/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { formatDateTime, formatMoney } from "@/lib/format";
import { useOperationsStore, type CashOperation } from "@/stores/operations-store";
import { currentCashier, useSessionStore } from "@/stores/session-store";

const OperationSchema = z.object({ type: z.enum(["income", "expense", "collection"]), amount: z.number().positive(), reason: z.string().trim().min(2) });
type OperationValues = z.infer<typeof OperationSchema>;

export function CashOperationsPage() {
  const { t } = useTranslation();
  const register = useSessionStore((state) => state.register);
  const selectedStoreId = useSessionStore((state) => state.selectedStoreId);
  const adjustExpectedCash = useSessionStore((state) => state.adjustExpectedCash);
  const locale = useSessionStore((state) => state.locale);
  const operations = useOperationsStore((state) => state.cashOperations);
  const addOperation = useOperationsStore((state) => state.addCashOperation);
  const { register: field, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<OperationValues>({ resolver: zodResolver(OperationSchema), defaultValues: { type: "income", amount: 0, reason: "" } });
  const submit = (values: OperationValues) => {
    if (!register.isOpen) { toast.error(t("toast.openShiftFirst")); return; }
    const direction = values.type === "income" ? 1 : -1;
    adjustExpectedCash(values.amount * direction);
    addOperation({ id: `CO-${Date.now().toString().slice(-5)}`, shiftId: register.shiftId, storeId: selectedStoreId, ...values, actor: currentCashier()?.name ?? t("common.unknown"), createdAt: new Date().toISOString() });
    reset({ type: values.type, amount: 0, reason: "" }); toast.success(t("operation.record"));
  };
  const columns: ColumnDef<CashOperation>[] = [
    { accessorKey: "createdAt", header: t("common.date"), cell: ({ row }) => formatDateTime(row.original.createdAt, locale) },
    { accessorKey: "type", header: t("common.status"), cell: ({ row }) => <Badge variant={row.original.type === "income" ? "positive" : "neutral"}>{t(`operation.${row.original.type}`)}</Badge> },
    { accessorKey: "reason", header: t("operation.reason") },
    { accessorKey: "amount", header: t("common.amount"), cell: ({ row }) => <span className={row.original.type === "income" ? "text-positive tabular-nums" : "text-danger tabular-nums"}>{row.original.type === "income" ? "+" : "−"}{formatMoney(row.original.amount, locale)}</span> },
    { accessorKey: "actor", header: t("common.operator") },
    { accessorKey: "shiftId", header: t("history.shift") },
  ];
  return <PageLayout><PageHeader title={t("cash-operations")} description={t("operation.description")} />{!register.isOpen ? <section className="mt-6 max-w-2xl rounded-md border border-danger/30 bg-danger/5 p-5"><Banknote className="size-8 text-danger" /><h2 className="mt-4 text-lg font-bold">{t("operation.shiftRequired")}</h2><p className="mt-1 text-sm text-muted">{t("operation.shiftRequiredHelp")}</p><Button asChild variant="primary" className="mt-4"><Link to="/shift">{t("shift.open")}</Link></Button></section> : <section className="mt-5 rounded-md border border-border bg-raised p-4"><SectionHeader title={t("operation.new")} description={t("operation.directionHelp")} /><form className="grid gap-3 lg:grid-cols-[14rem_1fr_1fr_auto] lg:items-end" onSubmit={handleSubmit(submit)}><SelectField label={t("common.status")} value={watch("type")} onChange={(value) => setValue("type", value as OperationValues["type"])} options={[{ id: "income", label: t("operation.income"), description: t("operation.enters") }, { id: "expense", label: t("operation.expense"), description: t("operation.leaves") }, { id: "collection", label: t("operation.collection"), description: t("operation.pickup") }]} /><label className="grid gap-1.5 text-xs font-semibold text-muted">{t("common.amount")}<Input type="number" {...field("amount", { valueAsNumber: true })} /></label><label className="grid gap-1.5 text-xs font-semibold text-muted">{t("operation.reason")}<Input {...field("reason")} /></label><Button type="submit" variant="primary">{watch("type") === "income" ? <ArrowDownToLine className="size-4" /> : <ArrowUpFromLine className="size-4" />}{t("operation.record")}</Button>{Object.keys(errors).length ? <p className="text-xs text-danger lg:col-span-4">{t("common.validation")}</p> : null}</form></section>}<section className="mt-6"><SectionHeader title={t("operation.activity")} description={t("operation.recentFirst")} /><DataTable data={operations} columns={columns} caption={t("operation.activity")} emptyMessage={t("operation.none")} /></section></PageLayout>;
}

export default CashOperationsPage;
