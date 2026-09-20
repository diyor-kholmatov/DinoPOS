import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PageContextHeader({
  context,
  actions,
  className,
}: {
  context: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex min-h-10 min-w-0 items-center justify-between gap-4", className)}>
      <div className="min-w-0">{context}</div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function WorkspaceSurface({
  className,
  elevated = false,
  ...props
}: ComponentPropsWithoutRef<"section"> & { elevated?: boolean }) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--component-workspace-radius)] border border-border bg-raised",
        elevated && "shadow-[var(--shadow-sm)]",
        className,
      )}
      {...props}
    />
  );
}

export function WorkspaceRegion({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("min-w-0 p-[var(--component-workspace-padding)]", className)} {...props} />;
}

export interface SummaryItem {
  label: ReactNode;
  value: ReactNode;
}

export function SummaryList({
  title,
  items,
  className,
}: {
  title: ReactNode;
  items: SummaryItem[];
  className?: string;
}) {
  return (
    <aside className={cn("bg-panel/55 p-[var(--component-workspace-padding)]", className)}>
      <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
      <dl className="mt-3 grid sm:grid-cols-2 sm:gap-x-6 xl:grid-cols-1 xl:gap-x-0">
        {items.map(({ label, value }, index) => (
          <div key={index} className="grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border/70 py-2 last:border-0">
            <dt className="min-w-0 text-xs leading-4 text-muted">{label}</dt>
            <dd className="whitespace-nowrap text-right text-[13px] font-semibold text-ink tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
