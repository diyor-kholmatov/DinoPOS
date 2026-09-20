import { useTranslation } from "react-i18next";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { ErrorState } from "@/components/patterns/feedback-state";
import { Button } from "@/components/ui/button";

export function RouteErrorBoundary() {
  const { t } = useTranslation();
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error ? error.message : t("common.unavailable");

  return (
    <main className="grid min-h-screen place-items-center bg-canvas p-4 text-ink">
      <ErrorState
        title={t("common.unavailable")}
        description={message}
        action={<Button onClick={() => window.location.reload()}>{t("common.tryAgain")}</Button>}
        className="w-full max-w-md rounded-lg border border-border bg-raised p-5"
      />
    </main>
  );
}
