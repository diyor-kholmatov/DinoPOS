import { Check, ChevronDown } from "lucide-react";
import {
  Button as AriaButton,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  type Key,
} from "react-aria-components";
import { cn } from "@/lib/cn";

export interface SelectOption {
  id: string;
  label: string;
  description?: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  isDisabled?: boolean;
  className?: string;
  hideLabel?: boolean;
  size?: "default" | "compact";
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  isDisabled,
  className,
  hideLabel = false,
  size = "default",
}: SelectFieldProps) {
  const handleChange = (key: Key | null) => {
    if (key !== null) onChange(String(key));
  };

  return (
    <Select
      aria-label={hideLabel ? label : undefined}
      selectedKey={value}
      onSelectionChange={handleChange}
      isDisabled={isDisabled}
      className={cn("group grid min-w-0 gap-1.5", className)}
    >
      {!hideLabel ? <Label className="text-xs font-semibold text-muted">{label}</Label> : null}
      <AriaButton className={cn(
        "flex min-w-0 items-center justify-between gap-2 rounded-md border border-border bg-raised px-3 text-left text-sm font-semibold text-ink hover:border-border-strong disabled:cursor-not-allowed disabled:bg-sunken disabled:text-faint",
        size === "compact" ? "h-9" : "h-11",
      )}>
        <SelectValue className="min-w-0 truncate" />
        <ChevronDown className="size-4 shrink-0 text-faint" aria-hidden="true" />
      </AriaButton>
      <Popover className="select-popover z-50 max-h-72 overflow-auto rounded-md border border-border bg-raised p-1 shadow-md">
        <ListBox items={options} className="outline-none">
          {(option) => (
            <ListBoxItem
              id={option.id}
              textValue={option.label}
              className="group/item flex min-h-11 cursor-default items-center gap-2 rounded-sm px-3 py-2 text-sm text-ink outline-none hover:bg-sunken focus:bg-sunken selected:bg-sunken"
            >
              <span className="min-w-0 flex-1">
                <strong className="block truncate font-semibold">{option.label}</strong>
                {option.description ? (
                  <small className="block truncate text-xs text-muted">{option.description}</small>
                ) : null}
              </span>
              <Check className="size-4 shrink-0 opacity-0 group-selected/item:opacity-100" aria-hidden="true" />
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </Select>
  );
}
