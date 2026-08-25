import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ErrorState, FeedbackState, LoadingState } from "@/components/patterns/feedback-state";
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
  toolbar?: ReactNode;
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
  toolbar,
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
      {toolbar ? <div className="border-b border-border">{toolbar}</div> : null}
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
                <td colSpan={columns.length} className="p-0">
                  <LoadingState label={t("common.loading")} className="min-h-32" />
                </td>
              </tr>
            ) : errorMessage ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <ErrorState
                    title={errorMessage}
                    action={onRetry ? <Button size="small" onClick={onRetry}>{t("common.tryAgain")}</Button> : null}
                    className="min-h-32"
                  />
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
                <td colSpan={columns.length} className="p-0">
                  <FeedbackState title={emptyMessage} className="min-h-32" />
                </td>
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
