import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { FeedbackState } from "@/components/patterns/feedback-state";
import { cn } from "@/lib/cn";

export function PageLayout({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn(
      "min-h-screen w-full min-w-0 p-[var(--component-page-mobile-padding)] sm:p-[var(--component-page-tablet-padding)] lg:p-[var(--component-page-desktop-padding)]",
      className,
    )}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function MetricStrip({ children }: { children: ReactNode }) {
  return (
    <section className="mt-5 grid overflow-hidden rounded-md border border-border bg-raised sm:grid-cols-2 xl:grid-cols-4">
      {children}
    </section>
  );
}

export function Metric({
  label,
  value,
  help,
  tone = "neutral",
}: {
  label: string;
  value: string;
  help?: string;
  tone?: "neutral" | "positive" | "warning" | "danger";
}) {
  return (
    <div className="min-w-0 border-b border-border p-4 last:border-b-0 sm:odd:border-r xl:border-b-0 xl:border-r xl:last:border-r-0">
      <span className="text-xs font-semibold text-muted">{label}</span>
      <strong className={cn(
        "mt-2 block truncate text-2xl text-ink tabular-nums",
        tone === "positive" && "text-positive",
        tone === "warning" && "text-warning",
        tone === "danger" && "text-danger",
      )}>{value}</strong>
      {help ? <small className="mt-1 block truncate text-xs text-muted">{help}</small> : null}
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-bold text-ink">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <FeedbackState
      icon={Inbox}
      title={title}
      description={description}
      action={action}
      className="min-h-48 rounded-md border border-dashed border-border p-5"
    />
  );
}

export function SegmentedControl({
  label,
  value,
  options,
  onChange,
  integrated = false,
}: {
  label: string;
  value: string;
  options: Array<{ id: string; label: string }>;
  onChange: (value: string) => void;
  integrated?: boolean;
}) {
  return (
    <div className={cn(
      "flex max-w-full gap-1 overflow-x-auto",
      integrated ? "h-8 rounded-sm bg-transparent p-0" : "rounded-md bg-sunken p-1",
    )} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            "shrink-0 rounded-sm px-3 text-xs font-medium text-muted hover:text-ink",
            integrated ? "h-8 min-h-8" : "min-h-9",
            value === option.id && (integrated ? "bg-raised font-semibold text-ink" : "bg-raised font-semibold text-ink shadow-sm"),
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
