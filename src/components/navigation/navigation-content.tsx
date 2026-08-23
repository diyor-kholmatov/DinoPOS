import { ChevronDown, CircleCheck, MoreHorizontal } from "lucide-react";
import { useState } from "react";
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
import { cn } from "@/lib/cn";

interface NavigationContentProps {
  expanded: boolean;
  onNavigate?: () => void;
  pilot?: boolean;
}

export function NavigationContent({ expanded, onNavigate, pilot = false }: NavigationContentProps) {
  const { t } = useTranslation();
  const [moreOpen, setMoreOpen] = useState(false);
  const renderGroup = (label: string, items: typeof primaryNavigation) => (
    <section className="grid gap-1">
      {expanded && !pilot ? (
        <h2 className="px-3 pb-1 pt-3 text-xs font-bold uppercase text-faint">{label}</h2>
      ) : null}
      {items.map((item) => (
        <NavigationItem
          key={item.to}
          item={item}
          label={t(item.labelKey)}
          expanded={expanded}
          onNavigate={onNavigate}
          pilot={pilot}
        />
      ))}
    </section>
  );

  return (
    <>
      <nav className="scrollbar-quiet min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {renderGroup(t("nav.primary"), primaryNavigation)}
        {renderGroup(t("nav.operations"), operationsNavigation)}
        {pilot ? (
          <section className="grid gap-1">
            <button
              type="button"
              aria-expanded={moreOpen}
              aria-label={!expanded ? t("nav.more") : undefined}
              onClick={() => setMoreOpen((current) => !current)}
              className={cn(
                "flex h-11 min-w-0 items-center gap-3 rounded-md px-3 text-[13px] font-semibold text-muted hover:bg-sunken hover:text-ink",
                !expanded && "justify-center px-0",
              )}
            >
              <MoreHorizontal className="size-[18px] shrink-0" aria-hidden="true" />
              {expanded ? <span className="min-w-0 flex-1 text-left">{t("nav.more")}</span> : null}
              {expanded ? <ChevronDown className={cn("size-4 transition-transform", moreOpen && "rotate-180")} aria-hidden="true" /> : null}
            </button>
            {moreOpen ? additionalNavigation.map((item) => (
              <NavigationItem
                key={item.to}
                item={item}
                label={t(item.labelKey)}
                expanded={expanded}
                onNavigate={onNavigate}
                pilot
              />
            )) : null}
          </section>
        ) : renderGroup(t("nav.additional"), additionalNavigation)}
      </nav>
      <div className="grid gap-1 border-t border-border p-2">
        <NavigationItem
          item={settingsNavigation}
          label={t(settingsNavigation.labelKey)}
          expanded={expanded}
          onNavigate={onNavigate}
          pilot={pilot}
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
