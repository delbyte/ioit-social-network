"use client";

import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FilterChipProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
  isActive: boolean;
  onClear: () => void;
  children: (props: { close: () => void }) => React.ReactNode;
}

export function FilterChip({
  icon: Icon,
  label,
  value,
  isActive,
  onClear,
  children,
}: FilterChipProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={cn(
              buttonVariants({ variant: "tertiary", size: "sm" }),
              "text-foreground/70 border-dashed",
              isActive &&
                "border-primary/30 bg-primary/2.5 text-foreground hover:bg-primary/10 border-solid",
            )}
          >
            {isActive ? (
              <>
                <Icon className="size-3.5" />
                <span>{value}</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      onClear();
                    }
                  }}
                  className="hover:bg-muted -mr-1 ml-0.5 rounded p-0.5"
                >
                  <XIcon className="size-3" />
                </span>
              </>
            ) : (
              <>
                <PlusIcon className="size-3.5" />
                <span>{label}</span>
              </>
            )}
          </button>
        }
      />
      <PopoverContent className="w-72 p-0" align="start">
        {children({ close: () => setOpen(false) })}
      </PopoverContent>
    </Popover>
  );
}
