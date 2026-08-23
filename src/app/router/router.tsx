import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/app/layouts/app-shell";
import { RouteErrorBoundary } from "@/app/layouts/route-error-boundary";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function AppLoadingFallback() {
  const { t } = useTranslation();

  return (
    <main className="grid min-h-screen place-items-center bg-canvas text-ink">
      <div className="flex items-center gap-2 text-sm text-muted" role="status">
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        <span>{t("common.loading")}</span>
      </div>
    </main>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <RouteErrorBoundary />,
    hydrateFallbackElement: <AppLoadingFallback />,
    children: [
      { index: true, element: <Navigate to="/checkout" replace /> },
      {
        path: "checkout",
        lazy: async () => {
          const module = await import("@/features/checkout/checkout-page");
          return { Component: module.CheckoutPage };
        },
      },
      { path: "dashboard", lazy: async () => ({ Component: (await import("@/features/dashboard/dashboard-page")).DashboardPage }) },
      { path: "catalog", lazy: async () => ({ Component: (await import("@/features/catalog/catalog-page")).CatalogPage }) },
      { path: "catalog/import", lazy: async () => ({ Component: (await import("@/features/catalog/import-page")).ImportPage }) },
      { path: "inventory", lazy: async () => ({ Component: (await import("@/features/inventory/inventory-page")).InventoryPage }) },
      { path: "inventory/transfers", lazy: async () => ({ Component: (await import("@/features/inventory/transfers-page")).TransfersPage }) },
      { path: "customers", lazy: async () => ({ Component: (await import("@/features/customers/customers-page")).CustomersPage }) },
      { path: "reports", lazy: async () => ({ Component: (await import("@/features/reports/reports-page")).ReportsPage }) },
      { path: "sales", lazy: async () => ({ Component: (await import("@/features/sales/sales-page")).SalesPage }) },
      { path: "suppliers", lazy: async () => ({ Component: (await import("@/features/suppliers/suppliers-page")).SuppliersPage }) },
      { path: "returns", lazy: async () => ({ Component: (await import("@/features/returns/returns-page")).ReturnsPage }) },
      { path: "drafts", lazy: async () => ({ Component: (await import("@/features/drafts/drafts-page")).DraftsPage }) },
      { path: "holds", lazy: async () => ({ Component: (await import("@/features/holds/holds-page")).HoldsPage }) },
      { path: "shift", lazy: async () => ({ Component: (await import("@/features/shifts/shift-page")).ShiftPage }) },
      { path: "cash-operations", lazy: async () => ({ Component: (await import("@/features/shifts/cash-operations-page")).CashOperationsPage }) },
      { path: "register-history", lazy: async () => ({ Component: (await import("@/features/shifts/register-history-page")).RegisterHistoryPage }) },
      { path: "settings", lazy: async () => ({ Component: (await import("@/features/settings/settings-page")).SettingsPage }) },
      { path: "*", element: <Navigate to="/checkout" replace /> },
    ],
  },
], { basename });
