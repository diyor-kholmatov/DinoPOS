import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TableToolbarProps extends HTMLAttributes<HTMLDivElement> {
  search?: ReactNode;
  filters?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
}

export function TableToolbar({ search, filters, meta, actions, className, ...props }: TableToolbarProps) {
  return (
    <div
      className={cn("flex min-h-14 min-w-0 flex-wrap items-center gap-2 px-3 py-2", className)}
      {...props}
    >
      {search ? <div className="min-w-56 flex-1 sm:max-w-sm">{search}</div> : null}
      {filters ? <div className="flex min-w-0 flex-wrap items-center gap-2">{filters}</div> : null}
      {meta ? <div className="text-xs text-muted tabular-nums">{meta}</div> : null}
      {actions ? <div className="ml-auto flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
