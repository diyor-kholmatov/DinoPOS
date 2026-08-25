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
        expanded
          ? "w-[var(--component-navigation-rail-expanded-width)]"
          : "w-[var(--component-navigation-rail-compact-width)]",
      )}
      aria-label={t("nav.primary")}
    >
      <div className={cn(
        "flex h-16 items-center gap-2 px-3",
        !expanded && "px-2",
      )}>
        <span className="flex h-5 w-4 shrink-0 items-end gap-1" aria-hidden="true">
          <span className="h-3.5 w-1.5 rounded-[1px] bg-ink" />
          <span className="h-5 w-1.5 rounded-[1px] bg-action" />
        </span>
        {expanded ? (
          <strong className="min-w-0 flex-1 text-[15px] font-semibold"><span>Dino</span><span className="text-muted">POS</span></strong>
        ) : null}
        <IconButton
          label={expanded ? t("nav.collapse") : t("nav.expand")}
          size="small"
          tooltipSide="right"
          onClick={toggleNavigation}
          className="ml-auto size-7 min-h-7 rounded-sm text-faint hover:bg-sunken hover:text-ink"
        >
          {expanded
            ? <ChevronLeft className="size-4" aria-hidden="true" />
            : <ChevronRight className="size-4" aria-hidden="true" />}
        </IconButton>
      </div>
      <NavigationContent expanded={expanded} compact />
    </aside>
  );
}
