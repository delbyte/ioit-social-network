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
      <header className="hero-splash">
        <div className="space-y-4">
          <p className="eyebrow">Event-only social feed</p>
          <h1 className="page-title max-w-2xl">
            Plan together, RSVP instantly, and drop events straight into Google
            Calendar.
          </h1>
          <p className="page-subtitle max-w-xl">
            No random posts. Every post is an event with schedule, context, and
            signup intent.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/events/new" className="btn-primary">
            Create New Event
          </Link>
          <Link href="/discover" className="btn-secondary">
            Explore Discover
          </Link>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="section-title">Upcoming Timeline</h2>
        {upcoming.length === 0 ? (
          <div className="empty-state">
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
