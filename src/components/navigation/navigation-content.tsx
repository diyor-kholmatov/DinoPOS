import { CircleCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  additionalNavigation,
  operationsNavigation,
  primaryNavigation,
  settingsNavigation,
} from "@/components/navigation/navigation-data";
import { NavigationItem } from "@/components/navigation/navigation-item";
import { ProfilePopover } from "@/components/navigation/profile-popover";
import { Tooltip } from "@/components/ui/tooltip";

interface NavigationContentProps {
  expanded: boolean;
  onNavigate?: () => void;
}

export function NavigationContent({ expanded, onNavigate }: NavigationContentProps) {
  const { t } = useTranslation();
  const renderGroup = (label: string, items: typeof primaryNavigation) => (
    <section className="grid gap-1">
      {expanded ? (
        <h2 className="px-3 pb-1 pt-3 text-xs font-bold uppercase text-faint">{label}</h2>
      ) : null}
      {items.map((item) => (
        <NavigationItem
          key={item.to}
          item={item}
          label={t(item.labelKey)}
          expanded={expanded}
          onNavigate={onNavigate}
        />
      ))}
    </section>
  );

  return (
    <>
      <nav className="scrollbar-quiet min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {renderGroup(t("nav.primary"), primaryNavigation)}
        {renderGroup(t("nav.operations"), operationsNavigation)}
        {renderGroup(t("nav.additional"), additionalNavigation)}
      </nav>
      <div className="grid gap-1 border-t border-border p-2">
        <NavigationItem
          item={settingsNavigation}
          label={t(settingsNavigation.labelKey)}
          expanded={expanded}
          onNavigate={onNavigate}
        />
        {expanded ? (
          <div className="flex h-10 items-center gap-2 px-3 text-xs font-semibold text-muted">
            <CircleCheck className="size-4 text-positive" aria-hidden="true" />
            {t("app.systemReady")}
          </div>
        ) : (
          <Tooltip label={t("app.systemReady")}>
            <span className="grid h-10 place-items-center">
              <span className="sr-only">{t("app.systemReady")}</span>
              <CircleCheck className="size-4 text-positive" aria-hidden="true" />
            </span>
          </Tooltip>
        )}
        <ProfilePopover expanded={expanded} />
      </div>
    </>
  );
}
