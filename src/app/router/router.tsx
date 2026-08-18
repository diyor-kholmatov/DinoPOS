import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/app/layouts/app-shell";
import { RouteErrorBoundary } from "@/app/layouts/route-error-boundary";
import { LegacyModulePlaceholder } from "@/features/migration/legacy-module-placeholder";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/checkout" replace /> },
      {
        path: "checkout",
        lazy: async () => {
          const module = await import("@/features/checkout/checkout-page");
          return { Component: module.CheckoutPage };
        },
      },
      { path: "dashboard", element: <LegacyModulePlaceholder /> },
      { path: "catalog", element: <LegacyModulePlaceholder /> },
      { path: "catalog/import", element: <LegacyModulePlaceholder /> },
      { path: "inventory", element: <LegacyModulePlaceholder /> },
      { path: "inventory/transfers", element: <LegacyModulePlaceholder /> },
      { path: "customers", element: <LegacyModulePlaceholder /> },
      { path: "reports", element: <LegacyModulePlaceholder /> },
      { path: "sales", element: <LegacyModulePlaceholder /> },
      { path: "suppliers", element: <LegacyModulePlaceholder /> },
      { path: "returns", element: <LegacyModulePlaceholder /> },
      { path: "drafts", element: <LegacyModulePlaceholder /> },
      { path: "holds", element: <LegacyModulePlaceholder /> },
      { path: "shift", element: <LegacyModulePlaceholder /> },
      { path: "cash-operations", element: <LegacyModulePlaceholder /> },
      { path: "register-history", element: <LegacyModulePlaceholder /> },
      { path: "settings", element: <LegacyModulePlaceholder /> },
      { path: "*", element: <Navigate to="/checkout" replace /> },
    ],
  },
], { basename });

