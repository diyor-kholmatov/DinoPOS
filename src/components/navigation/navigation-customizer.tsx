import { GripVertical, Pin, PinOff, RotateCcw } from "lucide-react";
import { useState, type DragEvent, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import type { NavigationEntry } from "@/components/navigation/navigation-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { NavigationPreferenceGroup } from "@/lib/navigation-preferences";

interface NavigationCustomizerProps {
  pinnedItems: NavigationEntry[];
  moreItems: NavigationEntry[];
  onDone: () => void;
  onMove: (sourcePath: string, targetPath: string | null, targetGroup: NavigationPreferenceGroup) => void;
  onTogglePin: (path: string) => void;
  onReset: () => void;
}

interface CustomizerGroupProps {
  group: NavigationPreferenceGroup;
  label: string;
  items: NavigationEntry[];
  draggingPath: string | null;
  dropTarget: string | null;
  onDragStart: (event: DragEvent<HTMLDivElement>, path: string) => void;
  onDragOverItem: (event: DragEvent<HTMLDivElement>, path: string) => void;
  onDrop: (event: DragEvent<HTMLElement>, group: NavigationPreferenceGroup, targetPath: string | null) => void;
  onDragEnd: () => void;
  onMove: (sourcePath: string, targetPath: string | null, targetGroup: NavigationPreferenceGroup) => void;
  onTogglePin: (path: string) => void;
}

function CustomizerGroup({
  group,
  label,
  items,
  draggingPath,
  dropTarget,
  onDragStart,
  onDragOverItem,
  onDrop,
  onDragEnd,
  onMove,
  onTogglePin,
}: CustomizerGroupProps) {
  const { t } = useTranslation();
  const pinned = group === "pinned";

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, item: NavigationEntry, index: number) => {
    if (event.key === "ArrowUp" && index > 0) {
      event.preventDefault();
      onMove(item.to, items[index - 1]?.to ?? null, group);
    } else if (event.key === "ArrowDown" && index < items.length - 1) {
      event.preventDefault();
      onMove(item.to, items[index + 2]?.to ?? null, group);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onTogglePin(item.to);
    }
  };

  return (
    <section
      className="mt-2"
      aria-label={label}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => onDrop(event, group, null)}
    >
      <h3 className="px-2 pb-1 text-[10px] font-semibold uppercase text-faint">{label}</h3>
      <div className="grid gap-0.5" role="list">
        {items.map((item, index) => {
          const Icon = item.icon;
          const actionLabel = t(pinned ? "nav.unpinModule" : "nav.pinModule", { module: t(item.labelKey) });
          return (
            <div
              key={item.to}
              role="button"
              tabIndex={0}
              draggable
              aria-label={actionLabel}
              aria-pressed={pinned}
              onClick={() => onTogglePin(item.to)}
              onKeyDown={(event) => handleKeyDown(event, item, index)}
              onDragStart={(event) => onDragStart(event, item.to)}
              onDragOver={(event) => onDragOverItem(event, item.to)}
              onDrop={(event) => onDrop(event, group, item.to)}
              onDragEnd={onDragEnd}
              className={cn(
                "flex h-[var(--component-navigation-rail-item-height)] min-w-0 cursor-grab items-center gap-2 rounded-md px-2 text-muted outline-none transition-colors hover:bg-sunken hover:text-ink active:cursor-grabbing",
                draggingPath === item.to && "opacity-45",
                dropTarget === item.to && "bg-sunken text-ink",
              )}
            >
              <GripVertical className="size-3.5 shrink-0 text-faint" aria-hidden="true" />
              <Icon className="size-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-[12px] font-medium">{t(item.labelKey)}</span>
              {pinned
                ? <PinOff className="size-3.5 shrink-0 text-faint" aria-hidden="true" />
                : <Pin className="size-3.5 shrink-0 text-faint" aria-hidden="true" />}
            </div>
          );
        })}
        {!items.length ? (
          <div className="grid h-9 place-items-center rounded-md border border-dashed border-border text-faint">
            <Pin className="size-3.5" aria-hidden="true" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function NavigationCustomizer({
  pinnedItems,
  moreItems,
  onDone,
  onMove,
  onTogglePin,
  onReset,
}: NavigationCustomizerProps) {
  const { t } = useTranslation();
  const [draggingPath, setDraggingPath] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const handleDragStart = (event: DragEvent<HTMLDivElement>, path: string) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", path);
    setDraggingPath(path);
  };

  const handleDragOverItem = (event: DragEvent<HTMLDivElement>, path: string) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    setDropTarget(path);
  };

  const handleDrop = (
    event: DragEvent<HTMLElement>,
    group: NavigationPreferenceGroup,
    targetPath: string | null,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const sourcePath = event.dataTransfer.getData("text/plain") || draggingPath;
    if (sourcePath) onMove(sourcePath, targetPath, group);
    setDraggingPath(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDraggingPath(null);
    setDropTarget(null);
  };

  return (
    <div className="scrollbar-quiet min-h-0 flex-1 overflow-y-auto px-2 pb-4">
      <p className="sr-only">{t("nav.customizeHelp")}</p>
      <header className="flex h-10 items-center justify-between gap-2 px-2">
        <h2 className="text-xs font-semibold text-ink">{t("nav.navigation")}</h2>
        <Button variant="quiet" size="small" className="h-8 min-h-8 px-2" onClick={onDone}>
          {t("nav.done")}
        </Button>
      </header>
      <CustomizerGroup
        group="pinned"
        label={t("nav.pinned")}
        items={pinnedItems}
        draggingPath={draggingPath}
        dropTarget={dropTarget}
        onDragStart={handleDragStart}
        onDragOverItem={handleDragOverItem}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        onMove={onMove}
        onTogglePin={onTogglePin}
      />
      <CustomizerGroup
        group="more"
        label={t("nav.more")}
        items={moreItems}
        draggingPath={draggingPath}
        dropTarget={dropTarget}
        onDragStart={handleDragStart}
        onDragOverItem={handleDragOverItem}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        onMove={onMove}
        onTogglePin={onTogglePin}
      />
      <Button
        variant="quiet"
        size="small"
        className="mt-2 h-9 w-full justify-start px-2 text-faint"
        onClick={onReset}
      >
        <RotateCcw className="size-3.5" aria-hidden="true" />
        {t("nav.reset")}
      </Button>
    </div>
  );
}
