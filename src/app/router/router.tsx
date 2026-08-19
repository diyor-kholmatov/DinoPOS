import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/app/layouts/app-shell";
import { RouteErrorBoundary } from "@/app/layouts/route-error-boundary";
import { PendingModulePage } from "@/features/platform/pending-module-page";

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
      { path: "dashboard", element: <PendingModulePage /> },
      { path: "catalog", element: <PendingModulePage /> },
      { path: "catalog/import", element: <PendingModulePage /> },
      { path: "inventory", element: <PendingModulePage /> },
      { path: "inventory/transfers", element: <PendingModulePage /> },
      { path: "customers", element: <PendingModulePage /> },
      { path: "reports", element: <PendingModulePage /> },
      { path: "sales", element: <PendingModulePage /> },
      { path: "suppliers", element: <PendingModulePage /> },
      { path: "returns", element: <PendingModulePage /> },
      { path: "drafts", element: <PendingModulePage /> },
      { path: "holds", element: <PendingModulePage /> },
      { path: "shift", element: <PendingModulePage /> },
      { path: "cash-operations", element: <PendingModulePage /> },
      { path: "register-history", element: <PendingModulePage /> },
      { path: "settings", element: <PendingModulePage /> },
      { path: "*", element: <Navigate to="/checkout" replace /> },
    ],
  },
], { basename });
