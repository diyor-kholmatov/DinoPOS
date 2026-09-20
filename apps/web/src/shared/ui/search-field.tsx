import { Search, X } from "lucide-react";
import {
  Button,
  Input,
  Label,
  SearchField as AriaSearchField,
} from "react-aria-components";
import type { KeyboardEventHandler, RefObject } from "react";
import { cn } from "@/lib/cn";

interface SearchFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  clearLabel?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}

export function SearchField({
  label,
  placeholder,
  value,
  onChange,
  className,
  clearLabel = "Clear search",
  inputRef,
  onKeyDown,
}: SearchFieldProps) {
  return (
    <AriaSearchField
      value={value}
      onChange={onChange}
      aria-label={label}
      className={cn(
        "flex h-12 min-w-0 items-center gap-2 rounded-md border border-border bg-raised px-3 focus-within:border-border-strong",
        className,
      )}
    >
      <Label className="sr-only">{label}</Label>
      <Search className="size-5 shrink-0 text-faint" aria-hidden="true" />
      <Input
        ref={inputRef}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        className="min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-faint"
      />
      <Button
        className="grid size-8 place-items-center rounded-sm text-faint hover:bg-sunken hover:text-ink data-[empty]:hidden"
        aria-label={clearLabel}
      >
        <X className="size-4" aria-hidden="true" />
      </Button>
    </AriaSearchField>
  );
}
