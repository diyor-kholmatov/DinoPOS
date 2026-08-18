import { ArrowUpRight, Construction } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { allNavigation } from "@/components/navigation/navigation-data";
import { Button } from "@/components/ui/button";

export function LegacyModulePlaceholder() {
  const { t } = useTranslation();
  const location = useLocation();
  const item = allNavigation.find((entry) => entry.to === location.pathname);
  const label = item ? t(item.labelKey) : t("common.unavailable");

  return (
    <div className="p-4 md:p-5 lg:p-6">
      <header>
        <h1 className="text-2xl font-bold">{label}</h1>
        <p className="mt-1 text-sm text-muted">{t("migration.gateDescription")}</p>
      </header>
      <section className="mt-6 max-w-xl border-t border-border pt-6">
        <Construction className="size-8 text-muted" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-bold">{t("migration.legacyAvailable")}</h2>
        <p className="mt-2 text-sm text-muted">{t("migration.legacyDescription")}</p>
        {item?.legacyFile ? (
          <Button asChild className="mt-5">
            <a href={item.legacyFile}>
              {t("migration.openLegacy")}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </Button>
        ) : null}
      </section>
    </div>
  );
}
