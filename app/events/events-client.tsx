"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/events/event-card";
import { useInterestState } from "@/components/providers/interest-provider";
import type { EventPost } from "@/lib/events";
import { isEventPast, sortEventsByDate } from "@/lib/events";

type EventsTab = "upcoming" | "past";

export function EventsClient({ events }: { events: EventPost[] }) {
  const { interestedIds } = useInterestState();
  const [activeTab, setActiveTab] = useState<EventsTab>("upcoming");

  const interestedEvents = useMemo(() => {
    const ids = new Set(interestedIds);
    return sortEventsByDate(events.filter((event) => ids.has(event.id)));
  }, [events, interestedIds]);

  const upcomingEvents = useMemo(
    () => interestedEvents.filter((event) => !isEventPast(event)),
    [interestedEvents]
  );
  const pastEvents = useMemo(
    () => interestedEvents.filter((event) => isEventPast(event)),
    [interestedEvents]
  );

  const visibleEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Your Events</h1>
        <p className="text-sm text-muted-foreground">
          Events you signed up for with the Interested action.
        </p>
      </header>

      <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground" role="tablist" aria-label="Your events tabs">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "upcoming"}
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${activeTab === "upcoming" ? "bg-background text-foreground shadow-sm" : "hover:text-foreground hover:bg-background/50"}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming ({upcomingEvents.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "past"}
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${activeTab === "past" ? "bg-background text-foreground shadow-sm" : "hover:text-foreground hover:bg-background/50"}`}
          onClick={() => setActiveTab("past")}
        >
          Past ({pastEvents.length})
        </button>
      </div>

      {visibleEvents.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-sm text-muted-foreground p-8 text-center">
          <p>
            {activeTab === "upcoming"
              ? "No upcoming signups yet. Tap Interested on an event to join it instantly."
              : "No past signups yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visibleEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}
