import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-border bg-raised px-3 text-sm text-ink placeholder:text-faint hover:border-border-strong focus:border-border-strong disabled:cursor-not-allowed disabled:bg-sunken disabled:text-faint",
        className,
      )}
      {...props}
    />
  );
}

