"use client";

import { useMemo, useState } from "react";
import { Clock } from "@phosphor-icons/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useShape } from "@/lib/shape-context";

function buildOptions(stepMinutes: number) {
  const options: Array<{ value: string; label: string }> = [];
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  for (let minutes = 0; minutes < 24 * 60; minutes += stepMinutes) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    const date = new Date(2020, 0, 1, hour, minute);
    options.push({ value, label: formatter.format(date) });
  }

  return options;
}

function formatLabel(value: string) {
  const [hour, minute] = value.split(":").map((part) => Number(part));
  if (Number.isNaN(hour) || Number.isNaN(minute)) return "";
  const date = new Date(2020, 0, 1, hour, minute);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function TimePicker({
  value,
  onChange,
  placeholder = "Pick a time",
  disabled = false,
  className,
  stepMinutes = 30,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  stepMinutes?: number;
}) {
  const shape = useShape();
  const [open, setOpen] = useState(false);
  const options = useMemo(() => buildOptions(stepMinutes), [stepMinutes]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            disabled={disabled}
            aria-label="Choose event time"
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
            <Clock size={16} className="text-muted-foreground" />
          </button>
        }
      />
      <PopoverContent className="w-[240px] p-2" align="start">
        <div className="max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm transition",
                option.value === value
                  ? "bg-foreground text-background"
                  : "text-foreground hover:bg-muted",
              )}
            >
              <span>{option.label}</span>
              <span className="text-xs text-muted-foreground">{option.value}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
