import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  children,
  className,
  closeLabel = "Close dialog",
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & { closeLabel?: string }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <DialogPrimitive.Content
        className={cn(
          "dialog-panel fixed left-1/2 top-1/2 z-50 max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-raised p-5 text-ink shadow-md",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close asChild>
          <IconButton
            label={closeLabel}
            size="small"
            tooltipSide="left"
            className="absolute right-3 top-3"
          >
            <X className="size-4" aria-hidden="true" />
          </IconButton>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ children }: { children: ReactNode }) {
  return <div className="mb-5 pr-10">{children}</div>;
}

export function DialogTitle(props: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className="text-lg font-bold" {...props} />;
}

export function DialogDescription(props: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className="mt-1 text-sm text-muted" {...props} />;
}
