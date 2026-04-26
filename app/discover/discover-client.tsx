"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/events/event-card";
import type { EventCategory, EventPost } from "@/lib/events";
import { eventCategoryOptions, isEventPast } from "@/lib/events";
import { applyDiscoverFilters, type DiscoverSort } from "@/lib/discover";

export function DiscoverClient({ events }: { events: EventPost[] }) {
  const [sort, setSort] = useState<DiscoverSort>("date");
  const [category, setCategory] = useState<EventCategory | "all">("all");

  const filtered = useMemo(() => {
    const upcoming = events.filter((event) => !isEventPast(event));
    return applyDiscoverFilters(upcoming, {
      sort,
      categories: category === "all" ? [] : [category],
    });
  }, [category, events, sort]);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Discover Events</h1>
        <p className="text-sm text-muted-foreground">
          Sort by date, popularity, or a mixed trending mode.
        </p>
      </header>

      <div className="flex flex-col gap-4 mb-8">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Sort by
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            ["date", "Date"],
            ["interest", "Interest"],
            ["trending", "Trending"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setSort(value as DiscoverSort)}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${sort === value ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-2">
          Categories
        </label>
        <div className="flex overflow-x-auto pb-2 -mx-1 px-1 gap-2 scrollbar-hide">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors shrink-0 ${category === "all" ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
          >
            All
          </button>
          {eventCategoryOptions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors shrink-0 ${category === item ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground p-8 text-center">
          <p>No events match the selected sort and filter right now.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}
