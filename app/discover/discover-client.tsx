"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/events/event-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { TabItem, Tabs, TabsList } from "@/components/ui/tabs";
import type { EventCategory, EventPost } from "@/lib/events";
import { eventCategoryOptions, isEventPast } from "@/lib/events";
import { applyDiscoverFilters, type DiscoverSort } from "@/lib/discover";
import { useIcons } from "@/lib/icon-context";

export function DiscoverClient({ events }: { events: EventPost[] }) {
  const [sort, setSort] = useState<DiscoverSort>("date");
  const [category, setCategory] = useState<EventCategory | "all">("all");
  const icons = useIcons();

  const filtered = useMemo(() => {
    const upcoming = events.filter((event) => !isEventPast(event));
    return applyDiscoverFilters(upcoming, {
      sort,
      categories: category === "all" ? [] : [category],
    });
  }, [category, events, sort]);
  const EmptyIcon = icons["square-library"];

  return (
    <section className="space-y-8">
      <header className="relative overflow-hidden rounded-lg border border-border/80 bg-[linear-gradient(135deg,#ecfeff_0%,#f8fafc_46%,#fff7ed_100%)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-6">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#22c55e,#06b6d4,#f97316)]" aria-hidden="true" />
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Discover Events</h1>
            <p className="max-w-2xl text-sm leading-6 text-foreground/70">
            Find the right room by timing, momentum, or category.
            </p>
          </div>
          <div className="rounded-full border border-foreground/10 bg-white/75 px-3 py-1.5 text-sm font-medium text-foreground shadow-sm backdrop-blur">
            {filtered.length} matches
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-4 rounded-lg border border-border/80 bg-card/90 p-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Sort by
          </span>
          <Tabs value={sort} onValueChange={(value) => setSort(value as DiscoverSort)}>
            <TabsList aria-label="Sort events">
              <TabItem value="date" label="Date" icon={icons.clock} />
              <TabItem value="interest" label="Interest" icon={icons.users} />
            </TabsList>
          </Tabs>
        </div>

        <label className="flex flex-col gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Category
          <Select
            value={category}
            selectedLabel={category === "all" ? "All categories" : category}
            onValueChange={(value) => setCategory(value as EventCategory | "all")}
          >
            <SelectTrigger className="w-full min-w-[220px] md:w-[240px]" placeholder="Choose category" />
            <SelectContent>
              <SelectItem index={0} value="all" icon={icons["square-library"]}>
                All categories
              </SelectItem>
              {eventCategoryOptions.map((item, index) => (
                <SelectItem key={item} index={index + 1} value={item} icon={icons.dot}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-card/85 p-8 text-center text-sm text-muted-foreground shadow-sm">
          <div className="flex size-14 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#ccfbf1,#fef3c7)] text-foreground">
            <EmptyIcon size={28} />
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-foreground">No matches right now.</p>
            <p>No events match the selected sort and filter right now.</p>
          </div>
          <Button
            type="button"
            variant="tertiary"
            onClick={() => {
              setCategory("all");
              setSort("date");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}
