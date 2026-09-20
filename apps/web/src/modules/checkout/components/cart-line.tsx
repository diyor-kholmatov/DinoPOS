import { Minus, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CartLine as CartLineModel } from "@/entities/sale/model";
import { IconButton } from "@/components/ui/icon-button";
import { formatMoney, type LocaleCode } from "@/lib/format";

interface CartLineProps {
  line: CartLineModel;
  locale: LocaleCode;
  canIncrease: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}

export function CartLine({
  line,
  locale,
  canIncrease,
  onDecrease,
  onIncrease,
  onRemove,
}: CartLineProps) {
  const { t } = useTranslation();
  const total = line.unitPrice * line.quantity * (1 - line.lineDiscount / 100);

  return (
    <li className="cart-line-grid grid gap-3 border-b border-border py-3 last:border-b-0">
      <div className="min-w-0">
        <strong className="block truncate text-sm text-ink">{line.name}</strong>
        <span className="mt-1 block text-xs text-muted tabular-nums">
          {formatMoney(line.unitPrice, locale)}
        </span>
        <div className="mt-2 flex items-center gap-1">
          <IconButton
            label={t("checkout.decrease", { name: line.name })}
            size="small"
            onClick={onDecrease}
            disabled={line.quantity <= 1}
          >
            <Minus className="size-4" aria-hidden="true" />
          </IconButton>
          <output
            aria-label={t("checkout.quantity")}
            className="grid h-9 min-w-10 place-items-center rounded-sm border border-border bg-sunken px-2 text-sm font-bold text-ink tabular-nums"
          >
            {line.quantity}
          </output>
          <IconButton
            label={t("checkout.increase", { name: line.name })}
            size="small"
            onClick={onIncrease}
            disabled={!canIncrease}
          >
            <Plus className="size-4" aria-hidden="true" />
          </IconButton>
          <IconButton
            label={t("checkout.remove", { name: line.name })}
            size="small"
            className="ml-1"
            onClick={onRemove}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </IconButton>
        </div>
      </div>
      <strong className="text-sm text-ink tabular-nums">{formatMoney(total, locale)}</strong>
    </li>
  );
}
