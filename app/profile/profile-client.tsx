"use client";

import { EventCard } from "@/components/events/event-card";
import { useInterestState } from "@/components/providers/interest-provider";
import { currentUser, type EventPost } from "@/lib/events";

export function ProfileClient({ createdEvents }: { createdEvents: EventPost[] }) {
  const { interestedIds } = useInterestState();

  return (
    <section className="space-y-6">
      <header className="profile-hero">
        <div className="avatar-ring" aria-hidden="true">
          {currentUser.name
            .split(" ")
            .map((token) => token[0])
            .join("")}
        </div>
        <div className="space-y-2">
          <h1 className="page-title">{currentUser.name}</h1>
          <p className="text-sm text-[var(--text-muted)]">{currentUser.handle}</p>
          <p className="max-w-2xl text-sm text-[var(--text-body)]">{currentUser.bio}</p>
        </div>
      </header>

      <section className="stat-grid" aria-label="Profile stats">
        <article className="stat-card">
          <h2>Created</h2>
          <p>{createdEvents.length}</p>
        </article>
        <article className="stat-card">
          <h2>Interested</h2>
          <p>{interestedIds.length}</p>
        </article>
        <article className="stat-card">
          <h2>Focus</h2>
          <p>Event-Only</p>
        </article>
      </section>

      <section className="space-y-3">
        <h2 className="section-title">Created Events</h2>
        {createdEvents.length === 0 ? (
          <div className="empty-state">
            <p>You have not created any events yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {createdEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
