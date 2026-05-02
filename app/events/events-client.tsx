"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EventCard } from "@/components/events/event-card";
import { useInterestState } from "@/components/providers/interest-provider";
import { Button } from "@/components/ui/button";
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
  const EmptyIcon = activeTab === "upcoming" ? icons.clock : icons.check;

  return (
    <section className="space-y-8">
      <header className="relative overflow-hidden rounded-lg border border-border/80 bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_48%,#fff7ed_100%)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-6">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#06b6d4,#22c55e,#f97316)]" aria-hidden="true" />
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Your Events</h1>
          <p className="max-w-2xl text-sm leading-6 text-foreground/70">
            Your saved plan for what is next.
          </p>
        </div>
        <div className="rounded-full border border-foreground/10 bg-white/75 px-3 py-1.5 text-sm font-medium text-foreground shadow-sm backdrop-blur">
          {interestedEvents.length} saved
        </div>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as EventsTab)}>
        <TabsList aria-label="Your events tabs">
          <TabItem value="upcoming" label={`Upcoming (${upcomingEvents.length})`} icon={icons.clock} />
          <TabItem value="past" label={`Past (${pastEvents.length})`} icon={icons.check} />
        </TabsList>
      </Tabs>

      {visibleEvents.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-card/85 p-8 text-center text-sm text-muted-foreground shadow-sm">
          <div className="flex size-14 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#dbeafe,#dcfce7)] text-foreground">
            <EmptyIcon size={28} />
          </div>
          <p className="max-w-md">
            {activeTab === "upcoming"
              ? "No upcoming signups yet. Tap Interested on an event to join it instantly."
              : "No past signups yet."}
          </p>
          {activeTab === "upcoming" ? (
            <Button asChild variant="primary">
              <Link href="/discover">Discover events</Link>
            </Button>
          ) : null}
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
