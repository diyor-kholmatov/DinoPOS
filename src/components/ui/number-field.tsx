import { Minus, Plus } from "lucide-react";
import {
  Button,
  Group,
  Input,
  Label,
  NumberField as AriaNumberField,
} from "react-aria-components";

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  formatOptions?: Intl.NumberFormatOptions;
}

export function NumberField({
  label,
  value,
  onChange,
  minValue,
  maxValue,
  formatOptions,
}: NumberFieldProps) {
  return (
    <AriaNumberField
      value={value}
      onChange={onChange}
      minValue={minValue}
      maxValue={maxValue}
      formatOptions={formatOptions}
      className="grid gap-1.5"
    >
      <Label className="text-xs font-semibold text-muted">{label}</Label>
      <Group className="quantity-field-grid grid h-11 overflow-hidden rounded-md border border-border bg-raised focus-within:border-border-strong">
        <Button slot="decrement" className="grid place-items-center border-r border-border text-muted hover:bg-sunken">
          <Minus className="size-4" aria-hidden="true" />
        </Button>
        <Input className="min-w-0 bg-transparent px-3 text-center text-sm font-semibold text-ink tabular-nums" />
        <Button slot="increment" className="grid place-items-center border-l border-border text-muted hover:bg-sunken">
          <Plus className="size-4" aria-hidden="true" />
        </Button>
      </Group>
    </AriaNumberField>
  );
}
