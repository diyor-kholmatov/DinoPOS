import { CalendarDays, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState } from "react";
import {
  Button,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Dialog,
  DialogTrigger,
  Group,
  Heading,
  Popover,
  RangeCalendar,
  type RangeValue,
} from "react-aria-components";
import type { CalendarDate, DateValue } from "@internationalized/date";
import { useTranslation } from "react-i18next";
import { useSessionStore } from "@/stores/session-store";
import { LOCALES } from "@/lib/format";
import { cn } from "@/lib/cn";

interface DateRangeFieldProps {
  label: string;
  value: RangeValue<CalendarDate>;
  onChange: (value: RangeValue<CalendarDate>) => void;
  compact?: boolean;
}

function formatCalendarDate(value: CalendarDate, locale: keyof typeof LOCALES): string {
  return new Intl.DateTimeFormat(LOCALES[locale], { day: "2-digit", month: "short", year: "numeric" })
    .format(value.toDate("UTC"));
}

function MonthGrid({
  offset,
  date,
  locale,
  monthLabel,
  yearLabel,
  onMonthChange,
  onYearChange,
}: {
  offset: { months: number };
  date: DateValue;
  locale: keyof typeof LOCALES;
  monthLabel: string;
  yearLabel: string;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}) {
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const years = Array.from({ length: 11 }, (_, index) => date.year - 5 + index);
  return (
    <div className="min-w-64">
      <h3 className="mb-1 flex items-center justify-center gap-1 text-sm font-bold">
        <label className="relative cursor-pointer rounded-sm px-1 hover:bg-sunken">
          <span>{new Intl.DateTimeFormat(LOCALES[locale], { month: "short" }).format(date.toDate("UTC"))}</span>
          <select
            aria-label={monthLabel}
            className="absolute inset-0 cursor-pointer opacity-0"
            value={date.month}
            onChange={(event) => onMonthChange(Number(event.target.value))}
          >
            {months.map((month) => (
              <option key={month} value={month}>{new Intl.DateTimeFormat(LOCALES[locale], { month: "long" }).format(date.set({ month }).toDate("UTC"))}</option>
            ))}
          </select>
        </label>
        <label className="relative cursor-pointer rounded-sm px-1 hover:bg-sunken">
          <span>{date.year}</span>
          <select
            aria-label={yearLabel}
            className="absolute inset-0 cursor-pointer opacity-0"
            value={date.year}
            onChange={(event) => onYearChange(Number(event.target.value))}
          >
            {years.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
        </label>
      </h3>
      <CalendarGrid offset={offset} className="w-full border-separate border-spacing-y-1">
      <CalendarGridHeader>
        {(day) => <CalendarHeaderCell className="h-8 text-center text-xs font-semibold text-faint">{day}</CalendarHeaderCell>}
      </CalendarGridHeader>
      <CalendarGridBody>
        {(date) => (
          <CalendarCell
            date={date}
            className="relative grid size-8 cursor-default place-items-center rounded-sm text-sm text-ink outline-none transition-colors data-[outside-month]:text-faint data-[hovered]:bg-sunken data-[focus-visible]:ring-2 data-[focus-visible]:ring-action data-[selected]:bg-information/15 data-[selection-start]:bg-information data-[selection-start]:text-white data-[selection-end]:bg-information data-[selection-end]:text-white data-[disabled]:opacity-35 sm:size-9"
          />
        )}
      </CalendarGridBody>
      </CalendarGrid>
    </div>
  );
}

export function DateRangeField({ label, value, onChange, compact = false }: DateRangeFieldProps) {
  const { t } = useTranslation();
  const locale = useSessionStore((state) => state.locale);
  const [focusedValue, setFocusedValue] = useState<DateValue>(value.start);
  const moveVisibleMonth = (offset: number, field: { month?: number; year?: number }) => {
    const visible = focusedValue.add({ months: offset }).set(field);
    setFocusedValue(visible.subtract({ months: offset }));
  };

  return (
    <DialogTrigger>
      <Button aria-label={label} className={cn(
        "flex min-w-0 items-center gap-2 rounded-md text-left text-ink",
        compact
          ? "h-8 border-0 bg-transparent px-3 text-xs font-medium hover:bg-raised"
          : "h-10 border border-border bg-raised px-3 text-sm font-semibold hover:border-border-strong",
      )}>
        <CalendarDays className={cn("shrink-0 text-muted", compact ? "size-3.5" : "size-4")} aria-hidden="true" />
        <span className="truncate">{formatCalendarDate(value.start, locale)} – {formatCalendarDate(value.end, locale)}</span>
      </Button>
      <Popover placement="bottom end" className="z-50 w-[min(42rem,calc(100vw-1.5rem))] rounded-md border border-border bg-raised p-3 text-ink shadow-md">
        <Dialog aria-label={label}>
          <RangeCalendar
            value={value}
            onChange={onChange}
            visibleDuration={{ months: 2 }}
            focusedValue={focusedValue}
            onFocusChange={setFocusedValue}
          >
            <div className="mb-2 grid grid-cols-[auto_1fr_auto] items-center gap-2">
              <Group className="flex gap-1">
                <button
                  type="button"
                  aria-label={t("calendar.previousYear")}
                  className="grid size-9 place-items-center rounded-sm text-muted hover:bg-sunken hover:text-ink"
                  onClick={() => setFocusedValue((current) => current.subtract({ years: 1 }))}
                >
                  <ChevronsLeft className="size-4" aria-hidden="true" />
                </button>
                <Button slot="previous" className="grid size-9 place-items-center rounded-sm text-muted hover:bg-sunken hover:text-ink">
                  <ChevronLeft className="size-4" aria-hidden="true" />
                </Button>
              </Group>
              <Heading className="sr-only" />
              <Group className="flex justify-end gap-1">
                <Button slot="next" className="grid size-9 place-items-center rounded-sm text-muted hover:bg-sunken hover:text-ink">
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Button>
                <button
                  type="button"
                  aria-label={t("calendar.nextYear")}
                  className="grid size-9 place-items-center rounded-sm text-muted hover:bg-sunken hover:text-ink"
                  onClick={() => setFocusedValue((current) => current.add({ years: 1 }))}
                >
                  <ChevronsRight className="size-4" aria-hidden="true" />
                </button>
              </Group>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-1">
              <MonthGrid
                offset={{ months: 0 }}
                date={focusedValue}
                locale={locale}
                monthLabel={t("calendar.selectMonth")}
                yearLabel={t("calendar.selectYear")}
                onMonthChange={(month) => moveVisibleMonth(0, { month })}
                onYearChange={(year) => moveVisibleMonth(0, { year })}
              />
              <MonthGrid
                offset={{ months: 1 }}
                date={focusedValue.add({ months: 1 })}
                locale={locale}
                monthLabel={t("calendar.selectMonth")}
                yearLabel={t("calendar.selectYear")}
                onMonthChange={(month) => moveVisibleMonth(1, { month })}
                onYearChange={(year) => moveVisibleMonth(1, { year })}
              />
            </div>
          </RangeCalendar>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
