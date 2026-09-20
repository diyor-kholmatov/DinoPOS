import { Outlet } from "react-router-dom";
import { ApplicationHeader } from "@/components/navigation/application-header";
import { NavigationRail } from "@/components/navigation/navigation-rail";
import { bootstrap } from "@/lib/legacy/bootstrap";
import { useTranslation } from "react-i18next";

export function AppShell() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen w-full min-w-0 bg-canvas text-ink">
      <NavigationRail />
      <div className="w-full min-w-0 flex-1">
        <ApplicationHeader />
        {bootstrap.migrationError ? (
          <div role="alert" className="border-b border-danger/30 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
            {t("app.migrationError")}
          </div>
        ) : null}
        <main className="min-h-screen w-full min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
