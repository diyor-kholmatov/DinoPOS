import type { NavigationEntry } from "@/components/navigation/navigation-data";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";
import { NavLink } from "react-router-dom";

interface NavigationItemProps {
  item: NavigationEntry;
  label: string;
  expanded: boolean;
  onNavigate?: () => void;
}

export function NavigationItem({ item, label, expanded, onNavigate }: NavigationItemProps) {
  const Icon = item.icon;
  const link = (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      aria-label={!expanded ? label : undefined}
      className={({ isActive }) => cn(
        "relative flex h-12 min-w-0 items-center gap-3 rounded-md px-3 text-sm font-semibold text-muted transition-colors hover:bg-sunken hover:text-ink",
        isActive && "bg-sunken text-ink before:absolute before:left-0 before:h-6 before:w-1 before:rounded-r-sm before:bg-ink",
        !expanded && "justify-center px-0",
      )}
    >
      <Icon className="size-5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
      {expanded ? <span className="min-w-0 truncate">{label}</span> : null}
    </NavLink>
  );

  return expanded ? link : <Tooltip label={label}>{link}</Tooltip>;
}

