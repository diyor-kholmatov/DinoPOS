import { Outlet } from "react-router-dom";
import { MobileNavigationDrawer } from "@/components/navigation/mobile-navigation-drawer";
import { NavigationRail } from "@/components/navigation/navigation-rail";
import { bootstrap } from "@/lib/legacy/bootstrap";
import { useTranslation } from "react-i18next";

export function AppShell() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen bg-canvas text-ink">
      <NavigationRail />
      <div className="min-w-0 flex-1">
        <header className="flex h-14 items-center justify-between border-b border-border bg-panel px-3 lg:hidden">
          <MobileNavigationDrawer />
          <strong>{t("app.name")}</strong>
          <span className="grid size-9 place-items-center rounded-full bg-sunken text-xs font-bold">LJ</span>
        </header>
        {bootstrap.migrationError ? (
          <div role="alert" className="border-b border-danger/30 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
            {t("app.migrationError")}
          </div>
        ) : null}
        <main className="min-h-screen min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

