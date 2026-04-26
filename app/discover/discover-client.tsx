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
      <header className="space-y-3">
        <h1 className="page-title">Discover Events</h1>
        <p className="page-subtitle">
          Sort by date, popularity, or a mixed trending mode.
        </p>
      </header>

      <div className="control-panel">
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
              className={sort === value ? "chip-active" : "chip-idle"}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="text-sm font-medium text-[var(--text-body)]">
          Category
          <select
            className="select-field"
            value={category}
            onChange={(event) => setCategory(event.target.value as EventCategory | "all")}
          >
            <option value="all">All categories</option>
            {eventCategoryOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
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
