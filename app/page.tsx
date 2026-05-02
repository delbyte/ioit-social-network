import Link from "next/link";
import { EventCard } from "@/components/events/event-card";
import { HomeHero } from "@/components/home/home-hero";
import { Button } from "@/components/ui/button";
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
        <div className="flex flex-col justify-between gap-3 rounded-lg border border-border/80 bg-card/80 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Upcoming Timeline</h2>
            <p className="text-sm text-muted-foreground">
              {upcoming.length} upcoming of {events.length} total events
            </p>
          </div>
          <Link href="/discover" className="text-sm font-medium text-foreground hover:opacity-70">
            Explore all events
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-card/80 p-8 text-center text-sm text-muted-foreground shadow-sm">
            <div className="flex size-14 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#fef3c7,#ccfbf1)] text-xl font-semibold text-foreground">
              M
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-foreground">No upcoming events yet.</p>
              <p>Start with Discover, or create the first thing people should show up for.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild variant="primary">
                <Link href="/discover">Discover events</Link>
              </Button>
              <Button asChild variant="tertiary">
                <Link href="/events/new">Create event</Link>
              </Button>
            </div>
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
