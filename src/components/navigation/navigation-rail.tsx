import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavigationContent } from "@/components/navigation/navigation-content";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";
import { useSessionStore } from "@/stores/session-store";

export function NavigationRail() {
  const { t } = useTranslation();
  const expanded = useSessionStore((state) => state.navigationExpanded);
  const toggleNavigation = useSessionStore((state) => state.toggleNavigation);

  return (
    <aside
      className={cn(
        "relative hidden h-screen shrink-0 flex-col border-r border-border bg-panel transition-all duration-200 lg:flex",
        expanded ? "w-58" : "w-18",
      )}
      aria-label={t("nav.primary")}
    >
      <div className={cn("flex h-20 items-center gap-3 px-4", !expanded && "justify-center px-0")}>
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-ink text-base font-black text-raised">
          D
        </span>
        {expanded ? <strong className="text-lg">{t("app.name")}</strong> : null}
      </div>
      <IconButton
        label={expanded ? t("nav.collapse") : t("nav.expand")}
        size="small"
        tooltipSide="right"
        onClick={toggleNavigation}
        className="absolute -right-4 top-6 z-10 border border-border bg-raised shadow-sm"
      >
        {expanded
          ? <ChevronLeft className="size-4" aria-hidden="true" />
          : <ChevronRight className="size-4" aria-hidden="true" />}
      </IconButton>
      <NavigationContent expanded={expanded} />
    </aside>
  );
}
