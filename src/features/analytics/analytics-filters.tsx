import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";
import type { RangeValue } from "react-aria-components";
import { Check, ChevronDown, Store } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DateRangeField } from "@/components/ui/date-range-field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/patterns/page";
import { cn } from "@/lib/cn";
import { useSessionStore } from "@/stores/session-store";

export type AnalyticsPeriod = "yesterday" | "today" | "week" | "month" | "year" | "custom";

export function rangeForPeriod(period: AnalyticsPeriod): RangeValue<CalendarDate> {
  const end = today(getLocalTimeZone());
  if (period === "yesterday") {
    const yesterday = end.subtract({ days: 1 });
    return { start: yesterday, end: yesterday };
  }
  const days = period === "today" ? 0 : period === "week" ? 6 : period === "month" ? 29 : 364;
  return { start: end.subtract({ days }), end };
}

export function StorePicker({
  selectedStores,
  onStoresChange,
  prominent = false,
  className,
}: {
  selectedStores: string[];
  onStoresChange: (stores: string[]) => void;
  prominent?: boolean;
  className?: string;
}) {
  const { t } = useTranslation();
  const stores = useSessionStore((state) => state.stores);
  const toggleStore = (storeId: string) => {
    if (selectedStores.includes(storeId)) {
      if (selectedStores.length > 1) onStoresChange(selectedStores.filter((id) => id !== storeId));
    } else {
      onStoresChange([...selectedStores, storeId]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size={prominent ? "default" : "small"}
          variant={prominent ? "quiet" : "secondary"}
          className={cn(
            "gap-2",
            prominent && "-ml-2 h-10 min-h-10 px-2 text-2xl font-semibold leading-[30px] text-ink",
            className,
          )}
        >
          {!prominent ? <Store className="size-4 text-muted" aria-hidden="true" /> : null}
          {selectedStores.length === stores.length
            ? t("dashboard.allStores")
            : t("dashboard.storesSelected", { count: selectedStores.length })}
          {prominent ? <ChevronDown className="size-4 text-faint" aria-hidden="true" /> : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-1">
        {stores.map((store) => {
          const checked = selectedStores.includes(store.id);
          return (
            <button
              key={store.id}
              type="button"
              className="flex min-h-11 w-full items-center gap-3 rounded-sm px-3 text-left text-sm hover:bg-sunken"
              aria-pressed={checked}
              onClick={() => toggleStore(store.id)}
            >
              <span className="grid size-5 place-items-center rounded-sm border border-border">
                {checked ? <Check className="size-3.5" aria-hidden="true" /> : null}
              </span>
              <span className="font-semibold">{store.name}</span>
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

export function AnalyticsFilters({
  period,
  onPeriodChange,
  selectedStores,
  onStoresChange,
  range,
  onRangeChange,
  showStore = true,
  integrated = false,
  className,
}: {
  period: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
  selectedStores: string[];
  onStoresChange: (stores: string[]) => void;
  range: RangeValue<CalendarDate>;
  onRangeChange: (range: RangeValue<CalendarDate>) => void;
  showStore?: boolean;
  integrated?: boolean;
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <section aria-label={t("dashboard.analyticsFilters")} className={cn(
      "mt-5 flex flex-wrap items-center gap-2",
      integrated && "w-fit max-w-full gap-1 rounded-md bg-panel p-1",
      className,
    )}>
      <SegmentedControl
        label={t("dashboard.periodLabel")}
        value={period}
        onChange={(value) => {
          const next = value as AnalyticsPeriod;
          onPeriodChange(next);
          onRangeChange(rangeForPeriod(next));
        }}
        options={[
          { id: "yesterday", label: t("dashboard.periodYesterday") },
          { id: "today", label: t("dashboard.periodToday") },
          { id: "week", label: t("dashboard.periodWeek") },
          { id: "month", label: t("dashboard.periodMonth") },
          { id: "year", label: t("dashboard.periodYear") },
        ]}
        integrated={integrated}
      />
      {showStore ? <StorePicker selectedStores={selectedStores} onStoresChange={onStoresChange} /> : null}
      <div className={integrated ? "border-l border-border pl-1" : undefined}>
        <DateRangeField
          label={t("dashboard.dateRange")}
          value={range}
          compact={integrated}
          onChange={(next) => {
            onPeriodChange("custom");
            onRangeChange(next);
          }}
        />
      </div>
    </section>
  );
}
