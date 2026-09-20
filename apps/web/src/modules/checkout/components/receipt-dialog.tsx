import { CheckCircle2, Printer, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Sale } from "@/entities/sale/model";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDateTime, formatMoney, type LocaleCode } from "@/lib/format";

interface ReceiptDialogProps {
  sale: Sale | null;
  locale: LocaleCode;
  onClose: () => void;
  onSend: () => void;
}

export function ReceiptDialog({ sale, locale, onClose, onSend }: ReceiptDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={sale !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent closeLabel={t("common.close")}>
        {sale ? (
          <>
            <DialogHeader>
              <span className="mb-3 grid size-11 place-items-center rounded-full bg-positive/10 text-positive">
                <CheckCircle2 className="size-6" aria-hidden="true" />
              </span>
              <DialogTitle>{t("checkout.paymentSuccessful")}</DialogTitle>
              <DialogDescription>{t("checkout.receiptReady")}</DialogDescription>
            </DialogHeader>
            <dl className="grid gap-3 border-y border-border py-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">{t("checkout.receipt")}</dt>
                <dd className="font-semibold text-ink">{sale.receiptNumber}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">{t("checkout.date")}</dt>
                <dd className="text-right font-semibold text-ink">{formatDateTime(sale.createdAt, locale)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">{t("checkout.customer")}</dt>
                <dd className="font-semibold text-ink">{sale.customerName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">{t("checkout.cashier")}</dt>
                <dd className="font-semibold text-ink">{sale.cashierName}</dd>
              </div>
              <div className="flex justify-between gap-4 text-base">
                <dt className="font-semibold text-ink">{t("checkout.totalPaid")}</dt>
                <dd className="font-bold text-ink tabular-nums">{formatMoney(sale.total, locale)}</dd>
              </div>
            </dl>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button type="button" onClick={() => window.print()}>
                <Printer className="size-4" aria-hidden="true" />
                {t("checkout.printReceipt")}
              </Button>
              <Button type="button" onClick={onSend}>
                <Send className="size-4" aria-hidden="true" />
                {t("checkout.sendReceipt")}
              </Button>
            </div>
            <Button type="button" variant="primary" className="mt-2 w-full" onClick={onClose}>
              {t("checkout.newSale")}
            </Button>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
