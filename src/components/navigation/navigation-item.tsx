import type { NavigationEntry } from "@/components/navigation/navigation-data";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";
import { NavLink } from "react-router-dom";

interface NavigationItemProps {
  item: NavigationEntry;
  label: string;
  expanded: boolean;
  onNavigate?: () => void;
  compact?: boolean;
}

export function NavigationItem({ item, label, expanded, onNavigate, compact = false }: NavigationItemProps) {
  const Icon = item.icon;
  const link = (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      aria-label={!expanded ? label : undefined}
      className={({ isActive }) => cn(
        "relative flex min-w-0 items-center gap-3 rounded-md px-3 text-muted transition-colors hover:bg-sunken hover:text-ink",
        compact ? "h-[var(--component-navigation-rail-item-height)] text-[13px] font-medium" : "h-12 text-sm font-semibold",
        isActive && (compact
          ? "bg-sunken text-ink before:absolute before:left-0 before:h-4 before:w-0.5 before:rounded-r-sm before:bg-action"
          : "bg-sunken text-ink before:absolute before:left-0 before:h-6 before:w-1 before:rounded-r-sm before:bg-ink"),
        !expanded && "justify-center px-0",
      )}
    >
      <Icon className={cn("shrink-0", compact ? "size-[18px]" : "size-5")} strokeWidth={1.8} aria-hidden="true" />
      {expanded ? <span className="min-w-0 truncate">{label}</span> : null}
    </NavLink>
  );

  return expanded ? link : <Tooltip label={label}>{link}</Tooltip>;
}
