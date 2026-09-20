import { Switch } from "react-aria-components";
import { cn } from "@/lib/cn";

export function SwitchField({
  label,
  description,
  selected,
  onChange,
  isDisabled = false,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onChange: (selected: boolean) => void;
  isDisabled?: boolean;
}) {
  return (
    <Switch
      isSelected={selected}
      onChange={onChange}
      isDisabled={isDisabled}
      className="group flex min-h-12 items-center justify-between gap-4 border-b border-border py-2 last:border-b-0 data-[disabled]:opacity-45"
    >
      <span className="min-w-0">
        <strong className="block text-sm text-ink">{label}</strong>
        {description ? <small className="block text-xs text-muted">{description}</small> : null}
      </span>
      <span className={cn("relative h-6 w-10 shrink-0 rounded-full bg-sunken transition-colors group-data-[selected]:bg-action") }>
        <span className="absolute left-1 top-1 size-4 rounded-full bg-raised shadow-sm transition-transform group-data-[selected]:translate-x-4" />
      </span>
    </Switch>
  );
}
