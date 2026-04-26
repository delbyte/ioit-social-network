import type { EventCategory, EventPost } from "@/lib/events";

export type DiscoverSort = "date" | "interest" | "trending";

export interface DiscoverFilters {
  sort: DiscoverSort;
  categories: EventCategory[];
}

export function applyDiscoverFilters(
  events: EventPost[],
  filters: DiscoverFilters
): EventPost[] {
  const withCategoryFilter =
    filters.categories.length === 0
      ? events
      : events.filter((event) => filters.categories.includes(event.category));

  return [...withCategoryFilter].sort((a, b) => {
    const dateDelta =
      new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
    const interestDelta = b.interestCount - a.interestCount;

    if (filters.sort === "date") {
      if (dateDelta !== 0) return dateDelta;
      if (interestDelta !== 0) return interestDelta;
      return a.id.localeCompare(b.id);
    }

    if (filters.sort === "interest") {
      if (interestDelta !== 0) return interestDelta;
      if (dateDelta !== 0) return dateDelta;
      return a.id.localeCompare(b.id);
    }

    if (interestDelta !== 0) return interestDelta;
    if (dateDelta !== 0) return dateDelta;
    return a.id.localeCompare(b.id);
  });
}
