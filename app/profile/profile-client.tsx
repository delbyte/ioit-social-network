"use client";

import { EventCard } from "@/components/events/event-card";
import { useInterestState } from "@/components/providers/interest-provider";
import type { EventPost } from "@/lib/events";

interface ProfileData {
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string | null;
}

export function ProfileClient({
  profile,
  createdEvents,
}: {
  profile: ProfileData;
  createdEvents: EventPost[];
}) {
  const { interestedIds } = useInterestState();

  return (
    <section className="space-y-6">
      <header className="profile-hero">
        <div className="avatar-ring" aria-hidden="true">
          {profile.name
            .split(" ")
            .map((token) => token[0])
            .join("")}
        </div>
        <div className="space-y-2">
          <h1 className="page-title">{profile.name}</h1>
          <p className="text-sm text-[var(--text-muted)]">{profile.handle}</p>
          {profile.bio && (
            <p className="max-w-2xl text-sm text-[var(--text-body)]">
              {profile.bio}
            </p>
          )}
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
