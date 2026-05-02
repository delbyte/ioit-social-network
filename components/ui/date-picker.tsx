"use client";

import { useMemo, useState } from "react";
import { CalendarBlank, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useShape } from "@/lib/shape-context";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateParts(value: string) {
  const [year, month, day] = value.split("-").map((part) => Number(part));
  if (!year || !month || !day) return null;
  return { year, month: month - 1, day };
}

function toValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatLabel(value: string) {
  const parts = toDateParts(value);
  if (!parts) return "";
  const date = new Date(parts.year, parts.month, parts.day);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getMonthCells(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [] as Array<{ date: Date; inMonth: boolean }>;

  for (let i = 0; i < 42; i += 1) {
    const dayOffset = i - firstDay + 1;
    const inMonth = dayOffset >= 1 && dayOffset <= daysInMonth;
    const day = inMonth
      ? dayOffset
      : dayOffset < 1
        ? daysInPrevMonth + dayOffset
        : dayOffset - daysInMonth;
    const date = new Date(year, month + (inMonth ? 0 : dayOffset < 1 ? -1 : 1), day);
    cells.push({ date, inMonth });
  }

  return cells;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const shape = useShape();
  const selectedParts = toDateParts(value);
  const selectedDate = selectedParts
    ? new Date(selectedParts.year, selectedParts.month, selectedParts.day)
    : null;
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(() =>
    selectedDate ? new Date(selectedDate) : new Date(),
  );

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(viewDate);

  const cells = useMemo(() => getMonthCells(viewDate), [viewDate]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            disabled={disabled}
            aria-label="Choose event date"
            className={cn(
              "border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 dark:bg-input/30 flex h-8 w-full items-center justify-between gap-2 rounded-lg border bg-white px-2.5 text-left text-sm text-foreground transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
              shape.input,
              className,
            )}
          >
            <span className={cn("truncate", value ? "text-foreground" : "text-muted-foreground")}
            >
              {value ? formatLabel(value) : placeholder}
            </span>
            <CalendarBlank size={16} className="text-muted-foreground" />
          </button>
        }
      />
      <PopoverContent className="w-[320px] p-3" align="start">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
            onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
            aria-label="Previous month"
          >
            <CaretLeft size={16} />
          </button>
          <span className="text-sm font-medium text-foreground">{monthLabel}</span>
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
            onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
            aria-label="Next month"
          >
            <CaretRight size={16} />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1 text-xs text-muted-foreground">
          {WEEKDAYS.map((day) => (
            <span key={day} className="text-center">
              {day}
            </span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {cells.map(({ date, inMonth }, index) => {
            const dayValue = toValue(date);
            const isSelected = value === dayValue;
            return (
              <button
                key={`${dayValue}-${index}`}
                type="button"
                onClick={() => {
                  onChange(dayValue);
                  setOpen(false);
                }}
                className={cn(
                  "flex h-9 items-center justify-center rounded-md text-sm transition",
                  inMonth ? "text-foreground" : "text-muted-foreground/60",
                  isSelected ? "bg-foreground text-background" : "hover:bg-muted",
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
