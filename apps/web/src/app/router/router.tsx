import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/app/layouts/app-shell";
import { RouteErrorBoundary } from "@/app/layouts/route-error-boundary";
import { environment } from "@/shared/config/environment";

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
          const module = await import("@/pages/checkout-page");
          return { Component: module.CheckoutPage };
        },
      },
      { path: "dashboard", lazy: async () => ({ Component: (await import("@/pages/dashboard-page")).DashboardPage }) },
      { path: "catalog", lazy: async () => ({ Component: (await import("@/pages/catalog-page")).CatalogPage }) },
      { path: "catalog/import", lazy: async () => ({ Component: (await import("@/pages/import-page")).ImportPage }) },
      { path: "inventory", lazy: async () => ({ Component: (await import("@/pages/inventory-page")).InventoryPage }) },
      { path: "inventory/transfers", lazy: async () => ({ Component: (await import("@/pages/transfers-page")).TransfersPage }) },
      { path: "customers", lazy: async () => ({ Component: (await import("@/pages/customers-page")).CustomersPage }) },
      { path: "reports", lazy: async () => ({ Component: (await import("@/pages/reports-page")).ReportsPage }) },
      { path: "sales", lazy: async () => ({ Component: (await import("@/pages/sales-page")).SalesPage }) },
      { path: "suppliers", lazy: async () => ({ Component: (await import("@/pages/suppliers-page")).SuppliersPage }) },
      { path: "returns", lazy: async () => ({ Component: (await import("@/pages/returns-page")).ReturnsPage }) },
      { path: "drafts", lazy: async () => ({ Component: (await import("@/pages/drafts-page")).DraftsPage }) },
      { path: "holds", lazy: async () => ({ Component: (await import("@/pages/holds-page")).HoldsPage }) },
      { path: "shift", lazy: async () => ({ Component: (await import("@/pages/shift-page")).ShiftPage }) },
      { path: "cash-operations", lazy: async () => ({ Component: (await import("@/pages/cash-operations-page")).CashOperationsPage }) },
      { path: "register-history", lazy: async () => ({ Component: (await import("@/pages/register-history-page")).RegisterHistoryPage }) },
      { path: "settings", lazy: async () => ({ Component: (await import("@/pages/settings-page")).SettingsPage }) },
      { path: "*", element: <Navigate to="/checkout" replace /> },
    ],
  },
], { basename: environment.routerBasename });
