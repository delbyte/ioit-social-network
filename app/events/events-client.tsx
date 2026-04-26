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
      <header className="space-y-3">
        <h1 className="page-title">Your Events</h1>
        <p className="page-subtitle">
          Events you signed up for with the Interested action.
        </p>
      </header>

      <div className="tab-row" role="tablist" aria-label="Your events tabs">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "upcoming"}
          className={activeTab === "upcoming" ? "tab-active" : "tab-idle"}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming ({upcomingEvents.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "past"}
          className={activeTab === "past" ? "tab-active" : "tab-idle"}
          onClick={() => setActiveTab("past")}
        >
          Past ({pastEvents.length})
        </button>
      </div>

      {visibleEvents.length === 0 ? (
        <div className="empty-state">
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
