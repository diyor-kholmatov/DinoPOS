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
      <div className={cn("flex items-center gap-3 px-4", isDashboardPilot ? "h-16" : "h-20", !expanded && "justify-center px-0")}>
        <span className={cn(
          "grid shrink-0 place-items-center rounded-md bg-ink font-black text-raised",
          isDashboardPilot ? "size-8 text-sm" : "size-10 text-base",
        )}>
          D
        </span>
        {expanded ? <strong className={isDashboardPilot ? "text-sm" : "text-lg"}>{t("app.name")}</strong> : null}
      </div>
      <IconButton
        label={expanded ? t("nav.collapse") : t("nav.expand")}
        size="small"
        tooltipSide="right"
        onClick={toggleNavigation}
        className={cn(
          "absolute -right-4 z-10 border border-border bg-raised shadow-sm",
          isDashboardPilot ? "top-4" : "top-6",
        )}
      >
        {expanded
          ? <ChevronLeft className="size-4" aria-hidden="true" />
          : <ChevronRight className="size-4" aria-hidden="true" />}
      </IconButton>
      <NavigationContent expanded={expanded} pilot={isDashboardPilot} />
    </aside>
  );
}
