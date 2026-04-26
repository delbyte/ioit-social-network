import Link from "next/link";
import { EventCard } from "@/components/events/event-card";
import { isEventPast } from "@/lib/events";
import { fetchEvents } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const events = await fetchEvents();
  const upcoming = events.filter((e) => !isEventPast(e)).slice(0, 6);

  return (
    <section className="space-y-8">
      <header className="py-6 md:py-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl max-w-2xl text-foreground">
            Upcoming Events
          </h1>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/events/new" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
            Create New Event
          </Link>
          <Link href="/discover" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
            Discover Events
          </Link>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Upcoming Timeline</h2>
        {upcoming.length === 0 ? (
          <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
            <p>No upcoming events yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
