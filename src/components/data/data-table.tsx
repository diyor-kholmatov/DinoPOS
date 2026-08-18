import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  caption: string;
  emptyMessage: string;
}

export function DataTable<TData>({ data, columns, caption, emptyMessage }: DataTableProps<TData>) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="overflow-x-auto rounded-md border border-border bg-raised">
      <table className="w-full min-w-160 border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-sunken text-xs font-bold text-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} scope="col" className="h-11 border-b border-border px-4">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-border last:border-b-0 hover:bg-sunken">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="h-12 px-4 text-ink">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length} className="h-24 px-4 text-center text-muted">{emptyMessage}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
