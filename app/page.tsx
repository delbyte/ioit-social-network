import Link from "next/link";
import { EventCard } from "@/components/events/event-card";
import { HomeHero } from "@/components/home/home-hero";
import { isEventPast } from "@/lib/events";
import { fetchEvents } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const events = await fetchEvents();
  const upcoming = events.filter((e) => !isEventPast(e)).slice(0, 6);

  return (
    <section className="space-y-10">
      <HomeHero />

      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Upcoming Timeline</h2>
            <p className="text-sm text-muted-foreground">{upcoming.length} upcoming of {events.length} total events</p>
          </div>
          <Link href="/events" className="text-sm font-medium text-foreground hover:opacity-70">
            View your events
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-dashed border-border bg-card text-sm text-muted-foreground">
            <p>No upcoming events yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
