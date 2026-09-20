import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { CalendarDate } from "@internationalized/date";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/data/data-table";
import { TableToolbar } from "@/components/data/table-toolbar";
import { Button } from "@/components/ui/button";
import { DateRangeField } from "@/components/ui/date-range-field";
import { Input } from "@/components/ui/input";
import { SearchField } from "@/components/ui/search-field";
import { SelectField } from "@/components/ui/select-field";
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
  render: () => {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");
    const data = [{ item: "White Sneakers", stock: 14 }, { item: "Matcha Syrup", stock: 3 }]
      .filter((row) => row.item.toLowerCase().includes(query.toLowerCase()))
      .filter((row) => status === "all" || (status === "low" ? row.stock < 5 : row.stock >= 5));

    return (
      <div className="w-[48rem] max-w-full">
        <DataTable
          caption="Inventory example"
          columns={columns}
          data={data}
          emptyMessage="No inventory"
          toolbar={(
            <TableToolbar
              search={<SearchField label="Search inventory" placeholder="Search inventory" value={query} onChange={setQuery} className="h-9" />}
              filters={(
                <SelectField
                  label="Stock status"
                  value={status}
                  onChange={setStatus}
                  options={[{ id: "all", label: "All stock" }, { id: "low", label: "Low stock" }, { id: "available", label: "Available" }]}
                  hideLabel
                  size="compact"
                  className="w-36"
                />
              )}
              meta={`${data.length} results`}
              actions={<Button size="small"><Plus className="size-4" aria-hidden="true" />Add item</Button>}
            />
          )}
        />
      </div>
    );
  },
};
