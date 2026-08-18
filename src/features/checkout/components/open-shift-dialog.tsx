import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NumberField } from "@/components/ui/number-field";
import { SelectField } from "@/components/ui/select-field";
import { useSessionStore } from "@/stores/session-store";

const OpenShiftSchema = z.object({
  cashierId: z.string().min(1),
  openingAmount: z.number().min(0),
});

type OpenShiftValues = z.infer<typeof OpenShiftSchema>;

interface OpenShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OpenShiftDialog({ open, onOpenChange }: OpenShiftDialogProps) {
  const { t } = useTranslation();
  const employees = useSessionStore((state) => state.employees);
  const openShift = useSessionStore((state) => state.openShift);
  const { control, handleSubmit } = useForm<OpenShiftValues>({
    resolver: zodResolver(OpenShiftSchema),
    defaultValues: {
      cashierId: employees.find((employee) => employee.active)?.id ?? "",
      openingAmount: 0,
    },
  });

  const submit = (values: OpenShiftValues) => {
    openShift(values.cashierId, values.openingAmount);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={t("common.close")}>
        <DialogHeader>
          <DialogTitle>{t("checkout.openShiftTitle")}</DialogTitle>
          <DialogDescription>{t("checkout.openShiftDescription")}</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit(submit)}>
          <Controller
            name="cashierId"
            control={control}
            render={({ field }) => (
              <SelectField
                label={t("checkout.cashier")}
                value={field.value}
                onChange={field.onChange}
                options={employees.filter((employee) => employee.active).map((employee) => ({
                  id: employee.id,
                  label: employee.name,
                  description: employee.role,
                }))}
              />
            )}
          />
          <Controller
            name="openingAmount"
            control={control}
            render={({ field }) => (
              <NumberField
                label={t("checkout.openingAmount")}
                value={field.value}
                onChange={field.onChange}
                minValue={0}
                formatOptions={{ maximumFractionDigits: 0 }}
              />
            )}
          />
          <Button type="submit" variant="primary" size="large">
            {t("checkout.openShiftSubmit")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
