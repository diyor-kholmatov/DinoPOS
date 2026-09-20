import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Plus, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import type { Customer } from "@/entities/customer/model";
import { DataTable } from "@/components/data/data-table";
import { Metric, MetricStrip, PageHeader, PageLayout, SectionHeader, SegmentedControl } from "@/components/patterns/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { SearchField } from "@/components/ui/search-field";
import { formatMoney } from "@/lib/format";
import { useCustomerStore } from "@/stores/customer-store";
import { useSessionStore } from "@/stores/session-store";

const CustomerSchema = z.object({ name: z.string().trim().min(2), phone: z.string().trim().min(5), loyalty: z.string().trim().min(1) });
type CustomerValues = z.infer<typeof CustomerSchema>;

export function CustomersPage() {
  const { t } = useTranslation();
  const customers = useCustomerStore((state) => state.customers);
  const addCustomer = useCustomerStore((state) => state.addCustomer);
  const addPrepayment = useCustomerStore((state) => state.addPrepayment);
  const locale = useSessionStore((state) => state.locale);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [profile, setProfile] = useState<Customer | null>(null);
  const [deposit, setDeposit] = useState(0);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerValues>({ resolver: zodResolver(CustomerSchema), defaultValues: { name: "", phone: "+998 ", loyalty: "Silver" } });
  const visible = useMemo(() => customers.filter((customer) => {
    const needle = search.trim().toLocaleLowerCase();
    return (!needle || `${customer.name} ${customer.phone}`.toLocaleLowerCase().includes(needle))
      && (filter === "all" || (filter === "debt" && customer.debt > 0) || (filter === "credit" && customer.prepayment > 0));
  }), [customers, filter, search]);
  const submit = (values: CustomerValues) => {
    addCustomer({ id: `c-${crypto.randomUUID()}`, name: values.name, phone: values.phone, totalSpent: 0, debt: 0, prepayment: 0, loyalty: values.loyalty, receiptHistory: [] });
    setAddOpen(false); reset(); toast.success(t("toast.customerSaved"));
  };
  const addDeposit = () => {
    if (!profile || !addPrepayment(profile.id, deposit)) return;
    setProfile(useCustomerStore.getState().customers.find((item) => item.id === profile.id) ?? null);
    setDeposit(0); toast.success(t("toast.prepaymentAdded"));
  };
  const columns: ColumnDef<Customer>[] = [
    { accessorKey: "name", header: t("common.customer"), cell: ({ row }) => <span><strong className="block">{row.original.name}</strong><small className="text-xs text-muted">{row.original.phone}</small></span> },
    { accessorKey: "totalSpent", header: t("clients.totalSpent"), cell: ({ row }) => <span className="tabular-nums">{formatMoney(row.original.totalSpent, locale)}</span> },
    { accessorKey: "debt", header: t("payment.debt"), cell: ({ row }) => <span className={row.original.debt ? "text-danger tabular-nums" : "text-muted tabular-nums"}>{formatMoney(row.original.debt, locale)}</span> },
    { accessorKey: "prepayment", header: t("payment.prepayment"), cell: ({ row }) => <span className={row.original.prepayment ? "text-positive tabular-nums" : "text-muted tabular-nums"}>{formatMoney(row.original.prepayment, locale)}</span> },
    { accessorKey: "loyalty", header: t("clients.loyalty"), cell: ({ row }) => <Badge variant="neutral">{row.original.loyalty}</Badge> },
    { id: "receipts", header: t("client.receipts"), accessorFn: (row) => row.receiptHistory.length, cell: ({ row }) => <span className="tabular-nums">{row.original.receiptHistory.length}</span> },
    { id: "action", enableSorting: false, header: t("common.action"), cell: ({ row }) => <IconButton label={t("clients.openProfile")} size="small" tooltipSide="left" onClick={() => setProfile(row.original)}><Eye className="size-4" /></IconButton> },
  ];

  return (
    <PageLayout>
      <PageHeader title={t("clients")} description={t("clients.description")} actions={<Button variant="primary" onClick={() => setAddOpen(true)}><Plus className="size-4" />{t("clients.add")}</Button>} />
      <MetricStrip>
        <Metric label={t("clients.allCustomers")} value={String(customers.length)} />
        <Metric label={t("reports.customersOwe")} value={formatMoney(customers.reduce((sum, item) => sum + item.debt, 0), locale)} tone="danger" />
        <Metric label={t("reports.customerCredit")} value={formatMoney(customers.reduce((sum, item) => sum + item.prepayment, 0), locale)} tone="positive" />
        <Metric label={t("clients.totalSpent")} value={formatMoney(customers.reduce((sum, item) => sum + item.totalSpent, 0), locale)} />
      </MetricStrip>
      <section className="mt-5 flex flex-wrap items-center gap-3"><SearchField className="w-full sm:max-w-md" label={t("table.search")} placeholder={t("table.search")} value={search} onChange={setSearch} /><SegmentedControl label={t("clients.balanceFilter")} value={filter} onChange={setFilter} options={[{ id: "all", label: t("common.all") }, { id: "debt", label: t("payment.debt") }, { id: "credit", label: t("payment.prepayment") }]} /></section>
      <section className="mt-5"><SectionHeader title={t("clients.allCustomers")} /><DataTable data={visible} columns={columns} caption={t("clients.allCustomers")} emptyMessage={t("clients.noResults")} /></section>

      <Dialog open={addOpen} onOpenChange={setAddOpen}><DialogContent closeLabel={t("common.closeDialog")}><DialogHeader><DialogTitle>{t("clients.add")}</DialogTitle><DialogDescription>{t("clients.description")}</DialogDescription></DialogHeader><form className="grid gap-3" onSubmit={handleSubmit(submit)}><label className="grid gap-1.5 text-xs font-semibold text-muted">{t("common.name")}<Input {...register("name")} /></label><label className="grid gap-1.5 text-xs font-semibold text-muted">{t("common.phone")}<Input {...register("phone")} /></label><label className="grid gap-1.5 text-xs font-semibold text-muted">{t("clients.loyalty")}<Input {...register("loyalty")} /></label>{Object.keys(errors).length ? <p className="text-xs text-danger">{t("common.validation")}</p> : null}<Button type="submit" variant="primary">{t("common.save")}</Button></form></DialogContent></Dialog>
      <Dialog open={Boolean(profile)} onOpenChange={(open) => { if (!open) setProfile(null); }}><DialogContent closeLabel={t("common.closeDialog")}><DialogHeader><DialogTitle>{profile?.name}</DialogTitle><DialogDescription>{profile?.phone}</DialogDescription></DialogHeader>{profile ? <div className="grid gap-4"><dl className="grid grid-cols-2 gap-3"><div><dt className="text-xs text-muted">{t("clients.totalSpent")}</dt><dd className="mt-1 font-bold tabular-nums">{formatMoney(profile.totalSpent, locale)}</dd></div><div><dt className="text-xs text-muted">{t("payment.debt")}</dt><dd className="mt-1 font-bold text-danger tabular-nums">{formatMoney(profile.debt, locale)}</dd></div><div><dt className="text-xs text-muted">{t("payment.prepayment")}</dt><dd className="mt-1 font-bold text-positive tabular-nums">{formatMoney(profile.prepayment, locale)}</dd></div><div><dt className="text-xs text-muted">{t("client.receipts")}</dt><dd className="mt-1 font-bold tabular-nums">{profile.receiptHistory.length}</dd></div></dl><div className="border-t border-border pt-4"><label className="grid gap-1.5 text-xs font-semibold text-muted">{t("common.deposit")}<Input type="number" value={deposit} onChange={(event) => setDeposit(Number(event.target.value))} /></label><Button className="mt-3 w-full" onClick={addDeposit}><WalletCards className="size-4" />{t("payment.prepayment")}</Button></div></div> : null}</DialogContent></Dialog>
    </PageLayout>
  );
}

export default CustomersPage;
