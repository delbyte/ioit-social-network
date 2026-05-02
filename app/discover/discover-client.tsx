"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/events/event-card";
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

  return (
    <section className="space-y-8">
      <header className="flex flex-col justify-between gap-4 rounded-lg border border-border/80 bg-card p-5 shadow-sm md:flex-row md:items-end">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Discover Events</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Find the right room by timing, momentum, or category.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {filtered.length} matches
        </div>
      </header>

      <div className="flex flex-col gap-4 rounded-lg border border-border/80 bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Sort by
          </span>
          <Tabs value={sort} onValueChange={(value) => setSort(value as DiscoverSort)}>
            <TabsList aria-label="Sort events">
              <TabItem value="date" label="Date" icon={icons.clock} />
              <TabItem value="interest" label="Interest" icon={icons.users} />
              <TabItem value="trending" label="Trending" icon={icons.star} />
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
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          <p>No events match the selected sort and filter right now.</p>
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
