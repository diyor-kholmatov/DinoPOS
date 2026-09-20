import { useTranslation } from "react-i18next";
import { MobileNavigationDrawer } from "@/components/navigation/mobile-navigation-drawer";

export function ApplicationHeader() {
  const { t } = useTranslation();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-panel px-3 lg:hidden">
      <MobileNavigationDrawer />
      <strong className="text-sm font-semibold text-ink">{t("app.name")}</strong>
      <span className="grid size-9 place-items-center rounded-full bg-sunken text-xs font-semibold text-ink">LJ</span>
    </header>
  );
}
