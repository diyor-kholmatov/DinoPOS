import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { CalendarDate } from "@internationalized/date";
import { DataTable } from "@/components/data/data-table";
import { DateRangeField } from "@/components/ui/date-range-field";
import { Input } from "@/components/ui/input";
import { SwitchField } from "@/components/ui/switch-field";

const meta = { title: "Data Entry/Forms and Data" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const columns: ColumnDef<{ item: string; stock: number }>[] = [
  { accessorKey: "item", header: "Item" },
  { accessorKey: "stock", header: "Stock" },
];

export const ControlStates: Story = {
  render: () => {
    const [selected, setSelected] = useState(true);
    return (
      <div className="grid max-w-md gap-4 rounded-md bg-raised p-4 text-ink">
        <Input aria-label="Default input" placeholder="Default" />
        <Input aria-label="Invalid input" aria-invalid="true" defaultValue="Invalid value" />
        <Input aria-label="Disabled input" disabled defaultValue="Disabled" />
        <SwitchField label="Fiscalization" description="Required for fiscal receipts" selected={selected} onChange={setSelected} />
      </div>
    );
  },
};

export const DateRange: Story = {
  render: () => {
    const [value, setValue] = useState({ start: new CalendarDate(2026, 8, 11), end: new CalendarDate(2026, 9, 22) });
    return <DateRangeField label="Date range" value={value} onChange={setValue} />;
  },
};

export const SortableTable: Story = {
  render: () => (
    <div className="max-w-2xl">
      <DataTable
        caption="Inventory example"
        columns={columns}
        data={[{ item: "White Sneakers", stock: 14 }, { item: "Matcha Syrup", stock: 3 }]}
        emptyMessage="No inventory"
      />
    </div>
  ),
};
