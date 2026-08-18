import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex min-h-6 items-center gap-1 rounded-sm px-2 text-xs font-semibold",
  {
    variants: {
      variant: {
        neutral: "bg-sunken text-muted",
        positive: "bg-positive/10 text-positive",
        warning: "bg-warning/10 text-warning",
        danger: "bg-danger/10 text-danger",
        information: "bg-information/10 text-information",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

