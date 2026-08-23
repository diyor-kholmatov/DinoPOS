import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { NavigationContent } from "@/components/navigation/navigation-content";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";
import { useSessionStore } from "@/stores/session-store";

export function NavigationRail() {
  const { t } = useTranslation();
  const location = useLocation();
  const storedExpanded = useSessionStore((state) => state.navigationExpanded);
  const toggleStoredNavigation = useSessionStore((state) => state.toggleNavigation);
  const isDashboardPilot = location.pathname === "/dashboard";
  const [pilotExpanded, setPilotExpanded] = useState(true);
  const expanded = isDashboardPilot ? pilotExpanded : storedExpanded;
  const toggleNavigation = isDashboardPilot
    ? () => setPilotExpanded((current) => !current)
    : toggleStoredNavigation;

  return (
    <aside
      className={cn(
        "relative hidden h-screen shrink-0 flex-col border-r border-border bg-panel transition-all duration-200 lg:flex",
        isDashboardPilot
          ? expanded ? "w-44" : "w-16"
          : expanded ? "w-58" : "w-18",
      )}
      aria-label={t("nav.primary")}
    >
      <div className={cn(
        "flex items-center gap-2",
        isDashboardPilot ? "h-16 px-3" : "h-20 px-4",
        !expanded && "px-2",
      )}>
        {isDashboardPilot ? (
          <span className="flex h-5 w-4 shrink-0 items-end gap-1" aria-hidden="true">
            <span className="h-3.5 w-1.5 rounded-[1px] bg-ink" />
            <span className="h-5 w-1.5 rounded-[1px] bg-action" />
          </span>
        ) : (
          <span className="grid size-10 shrink-0 place-items-center rounded-md bg-ink text-base font-black text-raised">D</span>
        )}
        {expanded ? (
          isDashboardPilot
            ? <strong className="min-w-0 flex-1 text-[15px] font-semibold"><span>Dino</span><span className="text-muted">POS</span></strong>
            : <strong className="text-lg">{t("app.name")}</strong>
        ) : null}
        <IconButton
          label={expanded ? t("nav.collapse") : t("nav.expand")}
          size="small"
          tooltipSide="right"
          onClick={toggleNavigation}
          className={cn(
            isDashboardPilot
              ? "ml-auto size-7 min-h-7 rounded-sm text-faint hover:bg-sunken hover:text-ink"
              : "absolute -right-4 top-6 z-10 border border-border bg-raised shadow-sm",
          )}
        >
          {expanded
            ? <ChevronLeft className="size-4" aria-hidden="true" />
            : <ChevronRight className="size-4" aria-hidden="true" />}
        </IconButton>
      </div>
      <NavigationContent expanded={expanded} pilot={isDashboardPilot} />
    </aside>
  );
}
