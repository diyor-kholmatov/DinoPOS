import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        primary: "bg-action text-action-ink hover:bg-action-hover",
        secondary: "border border-border bg-raised text-ink hover:bg-sunken",
        quiet: "bg-transparent text-muted hover:bg-sunken hover:text-ink",
        danger: "border border-danger bg-transparent text-danger hover:bg-danger hover:text-white",
      },
      size: {
        default: "min-h-11",
        small: "min-h-9 px-3 text-xs",
        large: "min-h-12 px-5 text-base",
        icon: "size-11 p-0",
        iconSmall: "size-9 min-h-9 p-0",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    asChild = false,
    className,
    variant,
    size,
    isLoading = false,
    disabled,
    children,
    ...props
  },
  ref,
) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={!asChild ? disabled || isLoading : undefined}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </Component>
  );
});
