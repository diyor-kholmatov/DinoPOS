import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function RouteErrorBoundary() {
  const { t } = useTranslation();
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error ? error.message : t("common.unavailable");

  return (
    <main className="grid min-h-screen place-items-center bg-canvas p-4 text-ink">
      <section className="w-full max-w-md rounded-lg border border-border bg-raised p-5">
        <AlertTriangle className="size-8 text-danger" aria-hidden="true" />
        <h1 className="mt-4 text-xl font-bold">{t("common.unavailable")}</h1>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <Button className="mt-5" onClick={() => window.location.reload()}>
          {t("common.tryAgain")}
        </Button>
      </section>
    </main>
  );
}

