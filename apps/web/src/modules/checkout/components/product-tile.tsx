import { Coffee, Package, Scissors } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Product } from "@/entities/product/model";
import { cn } from "@/lib/cn";
import { formatMoney, type LocaleCode } from "@/lib/format";

interface ProductTileProps {
  product: Product;
  available: number;
  quantityInCart: number;
  locale: LocaleCode;
  onAdd: () => void;
}

function ProductIcon({ product }: { product: Product }) {
  if (product.unit === "service") return <Scissors className="size-5" aria-hidden="true" />;
  if (product.category === "Drinks") return <Coffee className="size-5" aria-hidden="true" />;
  return <Package className="size-5" aria-hidden="true" />;
}

export function ProductTile({
  product,
  available,
  quantityInCart,
  locale,
  onAdd,
}: ProductTileProps) {
  const { t } = useTranslation();
  const isService = product.unit === "service";
  const unavailable = !product.active || available === 0;
  const lowStock = !isService && available > 0 && available <= 5;

  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={unavailable}
      className={cn(
        "group relative flex min-h-36 flex-col justify-between rounded-md border border-border bg-raised p-4 text-left shadow-sm transition-colors hover:border-border-strong hover:bg-sunken disabled:cursor-not-allowed disabled:opacity-55",
        quantityInCart > 0 && "border-border-strong",
      )}
      aria-label={`${product.name}, ${formatMoney(product.price, locale)}`}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-sunken text-muted">
          <ProductIcon product={product} />
        </span>
        {quantityInCart > 0 ? (
          <span className="grid size-6 place-items-center rounded-full bg-ink text-xs font-bold text-canvas tabular-nums">
            {quantityInCart}
          </span>
        ) : null}
      </span>
      <span className="mt-5 min-w-0">
        <strong className="block truncate text-sm font-bold text-ink">{product.name}</strong>
        <span className="mt-1 flex items-end justify-between gap-2">
          <span className="font-bold text-ink tabular-nums">{formatMoney(product.price, locale)}</span>
          <small className={cn(
            "text-xs text-muted",
            lowStock && "inline-flex items-center gap-1 font-semibold text-ink before:size-1.5 before:rounded-full before:bg-warning",
            unavailable && "text-danger",
          )}>
            {isService
              ? t("checkout.service")
              : unavailable
                ? t("checkout.outOfStock")
                : lowStock
                  ? t("checkout.lowStockCount", { count: available })
                  : t("checkout.inStockCount", { count: available })}
          </small>
        </span>
      </span>
    </button>
  );
}
