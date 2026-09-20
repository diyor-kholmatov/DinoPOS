import {
  Banknote,
  CreditCard,
  HandCoins,
  Landmark,
  QrCode,
  ReceiptText,
  SearchX,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { PaymentMethod, Sale } from "@/entities/sale/model";
import { calculateTotals } from "@/features/checkout/model/totals";
import { completeSale, type SaleFailureCode } from "@/features/checkout/model/complete-sale";
import { CartLine } from "@/features/checkout/components/cart-line";
import { OpenShiftDialog } from "@/features/checkout/components/open-shift-dialog";
import { ProductTile } from "@/features/checkout/components/product-tile";
import { ReceiptDialog } from "@/features/checkout/components/receipt-dialog";
import { RegisterStatusBar } from "@/features/checkout/components/register-status-bar";
import { Button } from "@/components/ui/button";
import { NumberField } from "@/components/ui/number-field";
import { SearchField } from "@/components/ui/search-field";
import { SelectField } from "@/components/ui/select-field";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { productAvailability, useCatalogStore } from "@/stores/catalog-store";
import { useCheckoutStore } from "@/stores/checkout-store";
import { useCustomerStore } from "@/stores/customer-store";
import { fiscalizationEnabled, useSessionStore } from "@/stores/session-store";

interface PaymentOption {
  id: PaymentMethod;
  icon: LucideIcon;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: "cash", icon: Banknote },
  { id: "card", icon: CreditCard },
  { id: "qr", icon: QrCode },
  { id: "transfer", icon: Landmark },
  { id: "debt", icon: HandCoins },
  { id: "prepayment", icon: WalletCards },
];

const CATEGORIES = ["all", "favorites", "products", "services"] as const;

function saleFailureMessage(code: SaleFailureCode, t: (key: string) => string): string {
  const keys: Record<SaleFailureCode, string> = {
    empty_cart: "checkout.payDisabledEmpty",
    shift_closed: "checkout.payDisabledShift",
    customer_missing: "checkout.customerMissing",
    insufficient_prepayment: "checkout.insufficientPrepayment",
    stock_changed: "checkout.stockChanged",
  };
  return t(keys[code]);
}

export function CheckoutPage() {
  const { t } = useTranslation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [openShiftDialog, setOpenShiftDialog] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  const products = useCatalogStore((state) => state.products);
  const customers = useCustomerStore((state) => state.customers);
  const selectedStoreId = useSessionStore((state) => state.selectedStoreId);
  const locale = useSessionStore((state) => state.locale);
  const register = useSessionStore((state) => state.register);
  const registerMode = useSessionStore((state) => state.registerMode);
  const fiscalization = useSessionStore((state) => state.fiscalization);
  const online = useSessionStore((state) => state.online);
  const entitlements = useSessionStore((state) => state.entitlements);

  const cart = useCheckoutStore((state) => state.cart);
  const selectedCustomerId = useCheckoutStore((state) => state.selectedCustomerId);
  const receiptDiscount = useCheckoutStore((state) => state.receiptDiscount);
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod);
  const search = useCheckoutStore((state) => state.search);
  const category = useCheckoutStore((state) => state.category);
  const mobileView = useCheckoutStore((state) => state.mobileView);
  const addProduct = useCheckoutStore((state) => state.addProduct);
  const changeQuantity = useCheckoutStore((state) => state.changeQuantity);
  const removeLine = useCheckoutStore((state) => state.removeLine);
  const setSelectedCustomer = useCheckoutStore((state) => state.setSelectedCustomer);
  const setReceiptDiscount = useCheckoutStore((state) => state.setReceiptDiscount);
  const setPaymentMethod = useCheckoutStore((state) => state.setPaymentMethod);
  const setSearch = useCheckoutStore((state) => state.setSearch);
  const setCategory = useCheckoutStore((state) => state.setCategory);
  const setMobileView = useCheckoutStore((state) => state.setMobileView);
  const saveDraft = useCheckoutStore((state) => state.saveDraft);

  const fiscalEnabled = fiscalization && entitlements.fiscalization !== false;
  const saleAvailable = registerMode !== "full" || register.isOpen;
  const totals = useMemo(
    () => calculateTotals(cart, receiptDiscount, fiscalizationEnabled()),
    [cart, receiptDiscount, fiscalization, entitlements],
  );

  const productQuantity = useMemo(
    () => new Map(cart.map((line) => [line.productId, line.quantity])),
    [cart],
  );

  const visibleProducts = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "all"
        || (category === "favorites" && product.favorite)
        || (category === "products" && product.unit === "pcs")
        || (category === "services" && product.unit === "service");
      const matchesSearch = !needle || [product.name, product.sku, product.barcode]
        .some((value) => value.toLocaleLowerCase().includes(needle));
      return matchesCategory && matchesSearch;
    });
  }, [category, products, search]);

  const disabledReason = !cart.length
    ? t("checkout.payDisabledEmpty")
    : !saleAvailable
      ? t("checkout.payDisabledShift")
      : paymentMethod === "prepayment"
        && (customers.find((customer) => customer.id === selectedCustomerId)?.prepayment ?? 0) < totals.total
        ? t("checkout.insufficientPrepayment")
        : null;

  const add = (productId: string) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    const available = productAvailability(product, selectedStoreId);
    if (!addProduct(product, available)) toast.error(t("checkout.cannotAdd"));
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    const barcode = search.trim();
    const product = products.find((item) => item.barcode === barcode || item.sku === barcode);
    if (!product) return;
    event.preventDefault();
    add(product.id);
    setSearch("");
  };

  const pay = () => {
    const result = completeSale();
    if (!result.ok) {
      toast.error(saleFailureMessage(result.code, t));
      return;
    }
    setCompletedSale(result.sale);
  };

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key === "/" && !(event.target instanceof HTMLInputElement)) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && !disabledReason) {
        event.preventDefault();
        pay();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  });

  return (
    <div className="flex min-h-screen flex-col p-3 sm:p-4 lg:p-5">
      <header className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">{t("checkout.title")}</h1>
          <p className="mt-1 text-sm text-muted">{t("checkout.subtitle")}</p>
        </div>
        <div className="flex rounded-md border border-border bg-panel p-1 lg:hidden">
          <button
            type="button"
            className={cn("min-h-9 rounded-sm px-3 text-sm font-semibold", mobileView === "products" ? "bg-raised text-ink shadow-sm" : "text-muted")}
            onClick={() => setMobileView("products")}
          >
            {t("checkout.products")}
          </button>
          <button
            type="button"
            className={cn("min-h-9 rounded-sm px-3 text-sm font-semibold", mobileView === "cart" ? "bg-raised text-ink shadow-sm" : "text-muted")}
            onClick={() => setMobileView("cart")}
          >
            {t("checkout.cart")} ({cart.reduce((sum, line) => sum + line.quantity, 0)})
          </button>
        </div>
      </header>

      <RegisterStatusBar onOpenShift={() => setOpenShiftDialog(true)} />

      <div className="checkout-workspace mt-3 min-h-0 flex-1 gap-3">
        <section
          aria-labelledby="product-catalog-title"
          className={cn("min-h-0 rounded-md border border-border bg-panel p-3 sm:p-4", mobileView !== "products" && "hidden lg:block")}
        >
          <h2 id="product-catalog-title" className="sr-only">{t("checkout.products")}</h2>
          <SearchField
            label={t("checkout.searchLabel")}
            placeholder={t("checkout.searchPlaceholder")}
            clearLabel={t("checkout.clearSearch")}
            value={search}
            onChange={setSearch}
            inputRef={searchInputRef}
            onKeyDown={handleSearchKeyDown}
          />
          <div className="scrollbar-quiet mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label={t("checkout.categoriesLabel")}>
            {CATEGORIES.map((item) => (
              <Button
                key={item}
                type="button"
                variant={category === item ? "secondary" : "quiet"}
                size="small"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {t(`checkout.categories.${item}`)}
              </Button>
            ))}
          </div>
          {visibleProducts.length ? (
            <div className="scrollbar-quiet mt-3 grid max-h-full grid-cols-2 gap-2 overflow-y-auto pb-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {visibleProducts.map((product) => (
                <ProductTile
                  key={product.id}
                  product={product}
                  available={productAvailability(product, selectedStoreId)}
                  quantityInCart={productQuantity.get(product.id) ?? 0}
                  locale={locale}
                  onAdd={() => add(product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="grid min-h-64 place-items-center text-center">
              <div>
                <SearchX className="mx-auto size-8 text-faint" aria-hidden="true" />
                <strong className="mt-3 block text-ink">{t("checkout.noProducts")}</strong>
                <p className="mt-1 text-sm text-muted">{t("checkout.noProductsDescription")}</p>
              </div>
            </div>
          )}
        </section>

        <aside
          aria-labelledby="cart-title"
          className={cn("cart-workspace min-h-0 rounded-md border border-border bg-raised", mobileView !== "cart" && "hidden lg:flex")}
        >
          <div className="border-b border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 id="cart-title" className="text-base font-bold text-ink">{t("checkout.cart")}</h2>
              <span className="text-xs text-muted">{t("checkout.itemsCount", { count: cart.reduce((sum, line) => sum + line.quantity, 0) })}</span>
            </div>
            <SelectField
              label={t("checkout.customer")}
              value={selectedCustomerId}
              onChange={setSelectedCustomer}
              className="mt-3"
              options={customers.map((customer) => ({
                id: customer.id,
                label: customer.name,
                description: customer.phone,
              }))}
            />
          </div>

          <div className="scrollbar-quiet min-h-32 flex-1 overflow-y-auto px-4">
            {cart.length ? (
              <ul>
                {cart.map((line) => {
                  const product = products.find((item) => item.id === line.productId);
                  const available = product ? productAvailability(product, selectedStoreId) : 0;
                  return (
                    <CartLine
                      key={line.productId}
                      line={line}
                      locale={locale}
                      canIncrease={line.quantity < available}
                      onDecrease={() => changeQuantity(line.productId, line.quantity - 1, available)}
                      onIncrease={() => {
                        if (!changeQuantity(line.productId, line.quantity + 1, available)) {
                          toast.error(t("checkout.cannotAdd"));
                        }
                      }}
                      onRemove={() => removeLine(line.productId)}
                    />
                  );
                })}
              </ul>
            ) : (
              <div className="grid h-full min-h-40 place-items-center text-center">
                <div>
                  <ReceiptText className="mx-auto size-8 text-faint" aria-hidden="true" />
                  <strong className="mt-3 block text-ink">{t("checkout.emptyCart")}</strong>
                  <p className="mt-1 text-sm text-muted">{t("checkout.emptyCartDescription")}</p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border p-4">
            <NumberField
              label={t("checkout.discount")}
              value={receiptDiscount}
              onChange={setReceiptDiscount}
              minValue={0}
              maxValue={100}
            />
            <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label={t("checkout.payment")}>
              {PAYMENT_OPTIONS.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={cn(
                    "flex min-h-12 items-center justify-center gap-2 rounded-md border px-2 text-xs font-semibold transition-colors",
                    paymentMethod === id
                      ? "border-border-strong bg-sunken text-ink"
                      : "border-border bg-raised text-muted hover:bg-sunken hover:text-ink",
                  )}
                  aria-pressed={paymentMethod === id}
                  onClick={() => setPaymentMethod(id)}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {t(`checkout.paymentMethods.${id}`)}
                </button>
              ))}
            </div>
            <dl className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between gap-4 text-muted">
                <dt>{t("checkout.subtotal")}</dt>
                <dd className="tabular-nums">{formatMoney(totals.subtotal, locale)}</dd>
              </div>
              {totals.discount > 0 ? (
                <div className="flex justify-between gap-4 text-muted">
                  <dt>{t("checkout.discountAmount")}</dt>
                  <dd className="tabular-nums">-{formatMoney(totals.discount, locale)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4 text-muted">
                <dt>{t("checkout.tax")}</dt>
                <dd className="tabular-nums">{formatMoney(totals.tax, locale)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-border pt-3 text-lg font-bold text-ink">
                <dt>{t("checkout.total")}</dt>
                <dd className="tabular-nums">{formatMoney(totals.total, locale)}</dd>
              </div>
            </dl>
            {!fiscalEnabled ? (
              <p className="mt-3 text-xs font-semibold text-warning">{t("checkout.nonFiscalWarning")}</p>
            ) : fiscalEnabled && !online ? (
              <p className="mt-3 text-xs text-muted">{t("checkout.offlineFiscalQueue")}</p>
            ) : null}
            {disabledReason ? <p className="mt-3 text-xs text-danger">{disabledReason}</p> : null}
            <Button
              type="button"
              variant="secondary"
              className="mt-3 w-full"
              disabled={!cart.length}
              onClick={() => {
                if (saveDraft(selectedStoreId)) toast.success(t("checkout.draftSaved"));
              }}
            >
              {t("checkout.saveDraft")}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="large"
              className="mt-2 w-full"
              disabled={Boolean(disabledReason)}
              onClick={pay}
            >
              {t("checkout.pay", { amount: formatMoney(totals.total, locale) })}
            </Button>
          </div>
        </aside>
      </div>

      <OpenShiftDialog open={openShiftDialog} onOpenChange={setOpenShiftDialog} />
      <ReceiptDialog
        sale={completedSale}
        locale={locale}
        onClose={() => setCompletedSale(null)}
        onSend={() => toast.success(t("checkout.receiptSent"))}
      />
    </div>
  );
}

export default CheckoutPage;
