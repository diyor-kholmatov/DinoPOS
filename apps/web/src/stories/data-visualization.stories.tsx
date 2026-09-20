import type { ColumnDef } from "@tanstack/react-table";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@/components/ui/badge";
import { ChartCard } from "@/components/data/chart-card";
import { DataTable } from "@/components/data/data-table";

interface InventoryRow { item: string; stock: number; status: "In stock" | "Low"; }
const rows: InventoryRow[] = [
  { item: "Coffee Beans 1kg", stock: 25, status: "In stock" },
  { item: "Sneaker Cleaner Kit", stock: 2, status: "Low" },
];
const columns: ColumnDef<InventoryRow>[] = [
  { accessorKey: "item", header: "Item" },
  { accessorKey: "stock", header: "Available" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant={row.original.status === "Low" ? "warning" : "neutral"}>{row.original.status}</Badge> },
];

function DataExamples() {
  return (
    <div className="grid w-full max-w-4xl gap-4 bg-canvas p-5">
      <ChartCard title="Sales overview" value="110,131,840 UZS" labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} values={[18, 24, 21, 35, 31, 42, 49]} />
      <DataTable data={rows} columns={columns} caption="Inventory status" emptyMessage="No inventory records" />
    </div>
  );
}

const meta = { title: "Patterns/Data display", component: DataExamples, parameters: { layout: "fullscreen" } } satisfies Meta<typeof DataExamples>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ChartAndTable: Story = {};
