import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, LockKeyhole, Play, ReceiptText } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Metric, MetricStrip, PageHeader, PageLayout, SectionHeader } from "@/components/patterns/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { formatDateTime, formatMoney } from "@/lib/format";
import { currentCashier, useSessionStore } from "@/stores/session-store";
import { useOperationsStore } from "@/stores/operations-store";

const OpenShiftSchema = z.object({ cashierId: z.string().min(1), openingAmount: z.number().nonnegative() });
type OpenShiftValues = z.infer<typeof OpenShiftSchema>;

export function ShiftPage() {
  const { t } = useTranslation();
  const register = useSessionStore((state) => state.register);
  const employees = useSessionStore((state) => state.employees).filter((employee) => employee.active);
  const openShift = useSessionStore((state) => state.openShift);
  const closeShift = useSessionStore((state) => state.closeShift);
  const stores = useSessionStore((state) => state.stores);
  const locale = useSessionStore((state) => state.locale);
  const cashOperations = useOperationsStore((state) => state.cashOperations);
  const addHistory = useOperationsStore((state) => state.addShiftHistory);
  const [closeOpen, setCloseOpen] = useState(false);
  const [counted, setCounted] = useState(register.expectedCash);
  const { handleSubmit, setValue, watch, register: registerField, formState: { errors } } = useForm<OpenShiftValues>({ resolver: zodResolver(OpenShiftSchema), defaultValues: { cashierId: employees[0]?.id ?? "", openingAmount: 500_000 } });
  const open = (values: OpenShiftValues) => { openShift(values.cashierId, values.openingAmount); toast.success(t("toast.registerOpened")); };
  const close = () => {
    const cashier = currentCashier();
    const closed = closeShift();
    if (!closed) return;
    addHistory({ id: closed.shiftId, storeId: closed.storeId, registerId: closed.id, cashierName: cashier?.name ?? t("common.unknown"), openedAt: closed.openedAt, closedAt: new Date().toISOString(), openingAmount: closed.openingAmount, expectedAmount: closed.expectedCash, countedAmount: counted, variance: counted - closed.expectedCash });
    setCloseOpen(false); toast.success(t("template.shiftClosed"));
  };
  const store = stores.find((item) => item.id === register.storeId);
  const shiftOps = cashOperations.filter((operation) => operation.shiftId === register.shiftId);
  const moneyIn = shiftOps.filter((operation) => operation.type === "income").reduce((sum, operation) => sum + operation.amount, 0);
  const moneyOut = shiftOps.filter((operation) => operation.type !== "income").reduce((sum, operation) => sum + operation.amount, 0);

  if (!register.isOpen) {
    return <PageLayout><PageHeader title={t("shift")} description={t("shift.descriptionOpen")} /><section className="mt-6 max-w-2xl rounded-md border border-border bg-raised p-5"><LockKeyhole className="size-8 text-muted" /><h2 className="mt-4 text-lg font-bold">{t("shift.noOpen")}</h2><p className="mt-1 text-sm text-muted">{t("shift.fullRequired")}</p><form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(open)}><SelectField label={t("shift.cashier")} value={watch("cashierId")} onChange={(value) => setValue("cashierId", value)} options={employees.map((employee) => ({ id: employee.id, label: employee.name, description: employee.role }))} /><label className="grid gap-1.5 text-xs font-semibold text-muted">{t("shift.openingCash")}<Input type="number" {...registerField("openingAmount", { valueAsNumber: true })} /></label>{Object.keys(errors).length ? <p className="text-xs text-danger sm:col-span-2">{t("common.validation")}</p> : null}<Button type="submit" variant="primary" className="sm:col-span-2"><Play className="size-4" />{t("shift.open")}</Button></form></section></PageLayout>;
  }

  return <PageLayout><PageHeader title={t("template.shiftTitle", { id: register.shiftId })} description={t("shift.liveDescription")} actions={<Badge variant="positive">{t("status.open")}</Badge>} /><MetricStrip><Metric label={t("shift.openingFloat")} value={formatMoney(register.openingAmount, locale)} /><Metric label={t("shift.cashIn")} value={formatMoney(moneyIn, locale)} /><Metric label={t("shift.cashOut")} value={formatMoney(moneyOut, locale)} /><Metric label={t("shift.expectedDrawer")} value={formatMoney(register.expectedCash, locale)} /></MetricStrip><div className="mt-6 grid gap-5 lg:grid-cols-2"><section className="rounded-md border border-border bg-raised p-4"><SectionHeader title={t("shift.calculation")} description={t("shift.movementMatch")} /><dl className="grid gap-3 text-sm"><div className="flex justify-between"><dt className="text-muted">{t("common.branch")}</dt><dd className="font-semibold">{store?.name}</dd></div><div className="flex justify-between"><dt className="text-muted">{t("shift.cashier")}</dt><dd className="font-semibold">{currentCashier()?.name}</dd></div><div className="flex justify-between"><dt className="text-muted">{t("common.opened")}</dt><dd>{formatDateTime(register.openedAt, locale)}</dd></div><div className="flex justify-between border-t border-border pt-3"><dt className="font-semibold">{t("shift.expectedInDrawer")}</dt><dd className="font-bold tabular-nums">{formatMoney(register.expectedCash, locale)}</dd></div></dl></section><section className="rounded-md border border-border bg-raised p-4"><SectionHeader title={t("shift.controls")} description={t("shift.controlsHelp")} /><div className="grid gap-2"><Button asChild><Link to="/cash-operations"><Banknote className="size-4" />{t("shift.recordOperation")}</Link></Button><Button asChild><Link to="/checkout"><ReceiptText className="size-4" />{t("shift.returnCheckout")}</Link></Button><Button variant="danger" onClick={() => { setCounted(register.expectedCash); setCloseOpen(true); }}>{t("shift.countClose")}</Button></div></section></div><Dialog open={closeOpen} onOpenChange={setCloseOpen}><DialogContent closeLabel={t("common.closeDialog")}><DialogHeader><DialogTitle>{t("shift.countClose")}</DialogTitle><DialogDescription>{t("history.immutable")}</DialogDescription></DialogHeader><label className="grid gap-1.5 text-xs font-semibold text-muted">{t("shift.countedUzs")}<Input type="number" value={counted} onChange={(event) => setCounted(Number(event.target.value))} /></label><div className="mt-3 flex justify-between text-sm"><span className="text-muted">{t("common.variance")}</span><strong className={counted - register.expectedCash === 0 ? "text-positive" : "text-danger"}>{formatMoney(counted - register.expectedCash, locale)}</strong></div><Button variant="danger" className="mt-5 w-full" onClick={close}>{t("shift.closePermanently")}</Button></DialogContent></Dialog></PageLayout>;
}

export default ShiftPage;
