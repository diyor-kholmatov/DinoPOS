import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  size?: "default" | "small";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      label,
      children,
      className,
      tooltipSide,
      size = "default",
      ...props
    },
    ref,
  ) {
    return (
      <Tooltip label={label} side={tooltipSide}>
        <Button
          ref={ref}
          type="button"
          variant="quiet"
          size={size === "small" ? "iconSmall" : "icon"}
          aria-label={label}
          className={cn(className)}
          {...props}
        >
          {children}
        </Button>
      </Tooltip>
    );
  },
);
