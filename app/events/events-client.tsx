"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/events/event-card";
import { useInterestState } from "@/components/providers/interest-provider";
import { TabItem, Tabs, TabsList } from "@/components/ui/tabs";
import type { EventPost } from "@/lib/events";
import { isEventPast, sortEventsByDate } from "@/lib/events";
import { useIcons } from "@/lib/icon-context";

type EventsTab = "upcoming" | "past";

export function EventsClient({ events }: { events: EventPost[] }) {
  const { interestedIds } = useInterestState();
  const [activeTab, setActiveTab] = useState<EventsTab>("upcoming");
  const icons = useIcons();

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
    <section className="space-y-8">
      <header className="flex flex-col justify-between gap-4 rounded-lg border border-border/80 bg-card p-5 shadow-sm md:flex-row md:items-end">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Your Events</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Your saved plan for what is next.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {interestedEvents.length} saved
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as EventsTab)}>
        <TabsList aria-label="Your events tabs">
          <TabItem value="upcoming" label={`Upcoming (${upcomingEvents.length})`} icon={icons.clock} />
          <TabItem value="past" label={`Past (${pastEvents.length})`} icon={icons.check} />
        </TabsList>
      </Tabs>

      {visibleEvents.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          <p>
            {activeTab === "upcoming"
              ? "No upcoming signups yet. Tap Interested on an event to join it instantly."
              : "No past signups yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}
