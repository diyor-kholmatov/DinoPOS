import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Plus, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { PageHeader, PageLayout, SectionHeader } from "@/components/patterns/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { SwitchField } from "@/components/ui/switch-field";
import type { LocaleCode } from "@/lib/format";
import { useSessionStore } from "@/stores/session-store";
import { useSettingsStore } from "@/stores/settings-store";

const CompanySchema = z.object({
  businessName: z.string().trim().min(2),
  businessType: z.string().trim().min(2),
  phone: z.string().trim().min(5),
  address: z.string().trim().min(5),
});
const EmployeeSchema = z.object({ name: z.string().trim().min(2), role: z.string().trim().min(2) });
const TaxesSchema = z.object({
  taxRate: z.number().min(0).max(100),
  serviceFee: z.number().min(0).max(100),
  rounding: z.enum(["none", "nearest100"]),
});

type CompanyValues = z.infer<typeof CompanySchema>;
type EmployeeValues = z.infer<typeof EmployeeSchema>;
type TaxesValues = z.infer<typeof TaxesSchema>;

function SettingsCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-md border border-border bg-raised p-4 ${className}`}>{children}</section>;
}

export function SettingsPage() {
  const { t } = useTranslation();
  const session = useSessionStore();
  const settings = useSettingsStore();
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const companyForm = useForm<CompanyValues>({ resolver: zodResolver(CompanySchema), defaultValues: settings.company });
  const taxesForm = useForm<TaxesValues>({
    resolver: zodResolver(TaxesSchema),
    defaultValues: { taxRate: settings.taxRate, serviceFee: settings.serviceFee, rounding: settings.rounding },
  });
  const employeeForm = useForm<EmployeeValues>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: { name: "", role: "Cashier" },
  });

  const saveEmployee = (values: EmployeeValues) => {
    session.addEmployee({ id: `e-${crypto.randomUUID()}`, ...values, active: true });
    setEmployeeOpen(false);
    employeeForm.reset();
    toast.success(t("toast.employeeSaved"));
  };

  return (
    <PageLayout>
      <PageHeader title={t("configuration")} description={t("settings.description")} />
      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        <SettingsCard className="xl:col-span-2">
          <SectionHeader title={t("settings.companyProfile")} />
          <form
            className="grid gap-3 sm:grid-cols-2"
            onSubmit={companyForm.handleSubmit((values) => {
              settings.updateCompany(values);
              toast.success(t("common.save"));
            })}
          >
            <label className="grid gap-1.5 text-xs font-semibold text-muted">
              {t("settings.businessName")}
              <Input {...companyForm.register("businessName")} aria-invalid={Boolean(companyForm.formState.errors.businessName)} />
            </label>
            <label className="grid gap-1.5 text-xs font-semibold text-muted">
              {t("settings.businessType")}
              <Input {...companyForm.register("businessType")} aria-invalid={Boolean(companyForm.formState.errors.businessType)} />
            </label>
            <label className="grid gap-1.5 text-xs font-semibold text-muted">
              {t("common.phone")}
              <Input {...companyForm.register("phone")} aria-invalid={Boolean(companyForm.formState.errors.phone)} />
            </label>
            <label className="grid gap-1.5 text-xs font-semibold text-muted">
              {t("settings.address")}
              <Input {...companyForm.register("address")} aria-invalid={Boolean(companyForm.formState.errors.address)} />
            </label>
            <Button type="submit" className="sm:col-span-2"><Save className="size-4" />{t("common.save")}</Button>
          </form>
        </SettingsCard>

        <SettingsCard>
          <SectionHeader title={t("settings.system")} />
          <SwitchField label={t("settings.darkTheme")} selected={session.theme === "dark"} onChange={(selected) => {
            if (selected !== (session.theme === "dark")) session.toggleTheme();
          }} />
          <SwitchField label={t("settings.fiscalization")} selected={session.fiscalization} onChange={session.setFiscalization} />
          <SwitchField label={t("settings.onlineSimulation")} selected={session.online} onChange={session.setOnline} />
          <SelectField
            className="mt-3"
            label={t("shift.register")}
            value={session.registerMode}
            onChange={(value) => {
              if (!session.setRegisterMode(value as "basic" | "full")) toast.error(t("toast.closeShiftBasic"));
            }}
            options={[
              { id: "full", label: t("checkout.fullRegister") },
              { id: "basic", label: t("checkout.basicRegister") },
            ]}
          />
        </SettingsCard>

        <SettingsCard>
          <SectionHeader title={t("settings.paymentMethods")} />
          {Object.entries(settings.paymentMethods).map(([method, enabled]) => (
            <SwitchField
              key={method}
              label={t(`payment.${method}`)}
              selected={enabled}
              onChange={(selected) => settings.togglePaymentMethod(method as keyof typeof settings.paymentMethods, selected)}
            />
          ))}
        </SettingsCard>

        <SettingsCard>
          <SectionHeader title={t("settings.receiptSettings")} />
          <SwitchField label={t("settings.showLogo")} selected={settings.receipt.showLogo} onChange={(selected) => settings.updateReceipt({ showLogo: selected })} />
          <SwitchField label={t("settings.showCustomerInfo")} selected={settings.receipt.showCustomer} onChange={(selected) => settings.updateReceipt({ showCustomer: selected })} />
          <SwitchField label={t("settings.showTax")} selected={settings.receipt.showTax} onChange={(selected) => settings.updateReceipt({ showTax: selected })} />
          <label className="mt-3 grid gap-1.5 text-xs font-semibold text-muted">
            {t("settings.thankYouMessage")}
            <Input value={settings.receipt.message} onChange={(event) => settings.updateReceipt({ message: event.target.value })} />
          </label>
        </SettingsCard>

        <SettingsCard>
          <SectionHeader title={t("settings.taxesFees")} />
          <form className="grid gap-3" onSubmit={taxesForm.handleSubmit((values) => {
            settings.updateTaxes(values.taxRate, values.serviceFee, values.rounding);
            toast.success(t("common.save"));
          })}>
            <label className="grid gap-1.5 text-xs font-semibold text-muted">
              {t("settings.taxRate")}
              <Input type="number" step="0.01" {...taxesForm.register("taxRate", { valueAsNumber: true })} />
            </label>
            <label className="grid gap-1.5 text-xs font-semibold text-muted">
              {t("settings.serviceFee")}
              <Input type="number" step="0.01" {...taxesForm.register("serviceFee", { valueAsNumber: true })} />
            </label>
            <SelectField
              label={t("settings.rounding")}
              value={taxesForm.watch("rounding")}
              onChange={(value) => taxesForm.setValue("rounding", value as TaxesValues["rounding"])}
              options={[
                { id: "none", label: t("settings.noRounding") },
                { id: "nearest100", label: t("settings.nearest100") },
              ]}
            />
            <Button type="submit"><Save className="size-4" />{t("common.save")}</Button>
          </form>
        </SettingsCard>

        <SettingsCard>
          <SectionHeader title={t("settings.languageSettings")} />
          <SelectField
            label={t("common.language")}
            value={session.locale}
            onChange={(value) => session.setLocale(value as LocaleCode)}
            options={[
              { id: "en", label: "English" },
              { id: "ru", label: "Русский" },
              { id: "uz", label: "O'zbek" },
            ]}
          />
          <p className="mt-3 text-xs leading-relaxed text-muted">{t("settings.languageHelp")}</p>
        </SettingsCard>

        <SettingsCard>
          <SectionHeader title={t("settings.permissions")} />
          {Object.entries(settings.permissions).map(([permission, enabled]) => (
            <SwitchField
              key={permission}
              label={t(`permission.${permission}`)}
              selected={enabled}
              onChange={(selected) => settings.togglePermission(permission, selected)}
            />
          ))}
        </SettingsCard>

        <SettingsCard className="xl:col-span-2">
          <SectionHeader
            title={t("settings.cashiersRoles")}
            action={<Button size="small" onClick={() => setEmployeeOpen(true)}><Plus className="size-4" />{t("settings.addEmployee")}</Button>}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            {session.employees.map((employee) => (
              <div key={employee.id} className="flex items-center gap-3 rounded-md bg-sunken p-3">
                <span className="grid size-9 place-items-center rounded-full bg-raised text-xs font-bold">
                  {employee.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-sm">{employee.name}</strong>
                  <small className="text-xs text-muted">{employee.role}</small>
                </span>
                <Badge variant={employee.active ? "positive" : "neutral"}>{t(employee.active ? "status.active" : "status.inactive")}</Badge>
              </div>
            ))}
          </div>
        </SettingsCard>

        <SettingsCard>
          <SectionHeader title={t("settings.systemStatus")} />
          {["pos", "gateway", "printer", "internet", "backup"].map((service) => (
            <div key={service} className="flex min-h-10 items-center justify-between gap-3 border-b border-border py-2 last:border-b-0">
              <span className="text-sm font-semibold">{t(`settings.service.${service}`)}</span>
              <span className="flex items-center gap-2 text-xs font-semibold text-positive">
                <CheckCircle2 className="size-4" aria-hidden="true" />{t("status.ready")}
              </span>
            </div>
          ))}
        </SettingsCard>
      </div>

      <Dialog open={employeeOpen} onOpenChange={setEmployeeOpen}>
        <DialogContent closeLabel={t("common.closeDialog")}>
          <DialogHeader>
            <DialogTitle>{t("settings.addEmployee")}</DialogTitle>
            <DialogDescription>{t("settings.cashiersRoles")}</DialogDescription>
          </DialogHeader>
          <form className="grid gap-3" onSubmit={employeeForm.handleSubmit(saveEmployee)}>
            <label className="grid gap-1.5 text-xs font-semibold text-muted">
              {t("common.name")}
              <Input {...employeeForm.register("name")} aria-invalid={Boolean(employeeForm.formState.errors.name)} />
            </label>
            <label className="grid gap-1.5 text-xs font-semibold text-muted">
              {t("settings.role")}
              <Input {...employeeForm.register("role")} aria-invalid={Boolean(employeeForm.formState.errors.role)} />
            </label>
            <Button type="submit" variant="primary">{t("common.save")}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}

export default SettingsPage;
