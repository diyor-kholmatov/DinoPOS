import { AlertTriangle, LoaderCircle, type LucideIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FeedbackStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: LucideIcon;
  tone?: "neutral" | "danger";
  isLoading?: boolean;
  className?: string;
  role?: "status" | "alert";
  ariaLabel?: string;
  style?: CSSProperties;
}

export function FeedbackState({
  title,
  description,
  action,
  icon: Icon,
  tone = "neutral",
  isLoading = false,
  className,
  role = tone === "danger" ? "alert" : "status",
  ariaLabel,
  style,
}: FeedbackStateProps) {
  const StateIcon = isLoading ? LoaderCircle : Icon;

  return (
    <div
      className={cn("grid place-items-center text-center", className)}
      role={role}
      aria-label={ariaLabel}
      aria-busy={isLoading || undefined}
      style={style}
    >
      <div className="min-w-0">
        {StateIcon ? (
          <StateIcon
            className={cn(
              "mx-auto size-8 text-faint",
              tone === "danger" && "text-danger",
              isLoading && "size-5 animate-spin",
            )}
            aria-hidden="true"
          />
        ) : null}
        {title ? (
          <strong className={cn("block text-sm font-semibold text-ink", StateIcon && "mt-3", tone === "danger" && "text-danger")}>
            {title}
          </strong>
        ) : null}
        {description ? <p className="mt-1 max-w-sm text-sm text-muted">{description}</p> : null}
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  );
}

export function LoadingState({ label, className }: { label: string; className?: string }) {
  return <FeedbackState title={label} isLoading ariaLabel={label} className={className} />;
}

export function ErrorState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <FeedbackState
      icon={AlertTriangle}
      title={title}
      description={description}
      action={action}
      tone="danger"
      className={className}
    />
  );
}
