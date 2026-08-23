import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  caption: string;
  emptyMessage: string;
  pageSize?: number;
  density?: "compact" | "comfortable";
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
}

export function DataTable<TData>({
  data,
  columns,
  caption,
  emptyMessage,
  pageSize = 8,
  density = "comfortable",
  isLoading = false,
  errorMessage = null,
  onRetry,
}: DataTableProps<TData>) {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });

  return (
    <div className="overflow-hidden rounded-md border border-border bg-raised">
      <div className="overflow-x-auto">
        <table className="w-full min-w-176 border-collapse text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-sunken text-xs font-bold text-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  const canSort = header.column.getCanSort();
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      className="h-11 border-b border-border px-4"
                      aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          className="inline-flex min-h-9 items-center gap-2 rounded-sm text-left hover:text-ink"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sorted === "asc" ? <ArrowUp className="size-3.5" aria-hidden="true" />
                            : sorted === "desc" ? <ArrowDown className="size-3.5" aria-hidden="true" />
                              : <ArrowUpDown className="size-3.5 opacity-60" aria-hidden="true" />}
                        </button>
                      ) : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="h-32 px-4 text-center text-muted">
                  <span className="inline-flex items-center gap-2" role="status">
                    <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                    {t("common.loading")}
                  </span>
                </td>
              </tr>
            ) : errorMessage ? (
              <tr>
                <td colSpan={columns.length} className="h-32 px-4 text-center">
                  <p className="font-semibold text-danger">{errorMessage}</p>
                  {onRetry ? <Button className="mt-3" size="small" onClick={onRetry}>{t("common.tryAgain")}</Button> : null}
                </td>
              </tr>
            ) : table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-b-0 hover:bg-sunken">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn("px-4 text-ink", density === "compact" ? "h-10" : "h-12")}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length} className="h-32 px-4 text-center text-muted">{emptyMessage}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {table.getPageCount() > 1 ? (
        <div className="flex items-center justify-between border-t border-border px-3 py-2">
          <span className="text-xs text-muted tabular-nums">
            {t("table.page", { current: table.getState().pagination.pageIndex + 1, total: table.getPageCount() })}
          </span>
          <div className="flex gap-1">
            <Button
              variant="quiet"
              size="iconSmall"
              aria-label={t("table.previousPage")}
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </Button>
            <Button
              variant="quiet"
              size="iconSmall"
              aria-label={t("table.nextPage")}
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
