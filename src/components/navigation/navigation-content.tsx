import { ChevronDown, CircleCheck, MoreHorizontal, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {
  additionalNavigation,
  operationsNavigation,
  primaryNavigation,
  settingsNavigation,
  type NavigationEntry,
} from "@/components/navigation/navigation-data";
import { NavigationCustomizer } from "@/components/navigation/navigation-customizer";
import { NavigationItem } from "@/components/navigation/navigation-item";
import { ProfilePopover } from "@/components/navigation/profile-popover";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";
import { useSessionStore } from "@/stores/session-store";

interface NavigationContentProps {
  expanded: boolean;
  onNavigate?: () => void;
  compact?: boolean;
}

export function NavigationContent({ expanded, onNavigate, compact = false }: NavigationContentProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const navigationPinnedPaths = useSessionStore((state) => state.navigationPinnedPaths);
  const navigationMorePaths = useSessionStore((state) => state.navigationMorePaths);
  const toggleNavigationPin = useSessionStore((state) => state.toggleNavigationPin);
  const moveNavigation = useSessionStore((state) => state.moveNavigation);
  const resetNavigation = useSessionStore((state) => state.resetNavigation);
  const navigationEntries = [...primaryNavigation, ...operationsNavigation, ...additionalNavigation];
  const entryByPath = new Map(navigationEntries.map((item) => [item.to, item]));
  const entriesFor = (paths: string[]) => paths
    .map((path) => entryByPath.get(path))
    .filter((item): item is NavigationEntry => Boolean(item));
  const pinnedItems = entriesFor(navigationPinnedPaths);
  const moreItems = entriesFor(navigationMorePaths);
  const moreHasActiveItem = moreItems.some((item) => (
    location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
  ));
  const moreExpanded = moreOpen || moreHasActiveItem;

  const renderGroup = (label: string, items: NavigationEntry[]) => (
    <section className="grid gap-1">
      {expanded && !compact ? (
        <h2 className="px-3 pb-1 pt-3 text-xs font-bold uppercase text-faint">{label}</h2>
      ) : null}
      {items.map((item) => (
        <NavigationItem
          key={item.to}
          item={item}
          label={t(item.labelKey)}
          expanded={expanded}
          onNavigate={onNavigate}
          compact={compact}
        />
      ))}
    </section>
  );

  if (customizing && expanded) {
    return (
      <>
        <NavigationCustomizer
          pinnedItems={pinnedItems}
          moreItems={moreItems}
          onDone={() => setCustomizing(false)}
          onMove={moveNavigation}
          onTogglePin={toggleNavigationPin}
          onReset={resetNavigation}
        />
        <div className="grid gap-1 border-t border-border p-2">
          <ProfilePopover expanded compact={compact} />
        </div>
      </>
    );
  }

  return (
    <>
      <nav className="scrollbar-quiet min-h-0 flex-1 overflow-y-auto px-2 pb-4">
        <div className="grid gap-0.5">
          {renderGroup(t("nav.pinned"), pinnedItems.slice(0, 3))}
        </div>
        {pinnedItems.length > 3 ? (
          <div className={compact ? "mt-2 border-t border-border pt-2" : undefined}>
            {renderGroup(t("nav.pinned"), pinnedItems.slice(3))}
          </div>
        ) : null}
        {compact ? (
          <section className="mt-2 grid gap-1 border-t border-border pt-2">
            <button
              type="button"
              aria-expanded={moreExpanded}
              aria-label={!expanded ? t("nav.more") : undefined}
              onClick={() => setMoreOpen((current) => !current)}
              className={cn(
                "flex h-[var(--component-navigation-rail-item-height)] min-w-0 items-center gap-3 rounded-md px-3 text-[13px] font-medium text-muted hover:bg-sunken hover:text-ink",
                moreHasActiveItem && "bg-sunken text-ink",
                !expanded && "justify-center px-0",
              )}
            >
              <MoreHorizontal className="size-[18px] shrink-0" aria-hidden="true" />
              {expanded ? <span className="min-w-0 flex-1 text-left">{t("nav.more")}</span> : null}
              {expanded ? <ChevronDown className={cn("size-4 transition-transform", moreExpanded && "rotate-180")} aria-hidden="true" /> : null}
            </button>
            {moreExpanded ? moreItems.map((item) => (
              <NavigationItem
                key={item.to}
                item={item}
                label={t(item.labelKey)}
                expanded={expanded}
                onNavigate={onNavigate}
                compact
              />
            )) : null}
            {moreExpanded && expanded ? (
              <Button
                variant="quiet"
                size="small"
                className="h-9 w-full justify-start px-3 text-[12px] font-medium text-faint"
                onClick={() => setCustomizing(true)}
              >
                <SlidersHorizontal className="size-3.5" aria-hidden="true" />
                {t("nav.customize")}
              </Button>
            ) : null}
          </section>
        ) : (
          <>
            {renderGroup(t("nav.more"), moreItems)}
            <Button
              variant="quiet"
              size="small"
              className="mx-2 mt-2 h-9 justify-start px-3 text-xs text-faint"
              onClick={() => setCustomizing(true)}
            >
              <SlidersHorizontal className="size-3.5" aria-hidden="true" />
              {t("nav.customize")}
            </Button>
          </>
        )}
      </nav>
      <div className="grid gap-1 border-t border-border p-2">
        <NavigationItem
          item={settingsNavigation}
          label={t(settingsNavigation.labelKey)}
          expanded={expanded}
          onNavigate={onNavigate}
          compact={compact}
        />
        <div className={compact ? "mt-1 border-t border-border pt-1" : undefined}>
        {expanded ? (
          <div className={cn("flex items-center gap-2 px-3 text-muted", compact ? "h-8 text-[11px] font-medium" : "h-10 text-xs font-semibold")}>
            <CircleCheck className={cn("text-positive", compact ? "size-3.5" : "size-4")} aria-hidden="true" />
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
        </div>
        <div className={compact ? "mt-1 border-t border-border pt-1" : undefined}>
          <ProfilePopover expanded={expanded} compact={compact} />
        </div>
      </div>
    </>
  );
}
