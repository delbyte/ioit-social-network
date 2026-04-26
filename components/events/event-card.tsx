"use client";

import type { EventPost } from "@/lib/events";
import { formatEventDateRange } from "@/lib/date";
import { InterestedButton } from "@/components/events/interested-button";

export function EventCard({ event }: { event: EventPost }) {
  const hasPhoto = event.photos && event.photos.length > 0;

  return (
    <article className="card-surface flex h-full flex-col gap-4">
      {hasPhoto ? (
        <div
          className="event-cover"
          style={{
            backgroundImage: `url(${event.photos[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />
      ) : null}

      <div className="flex items-center justify-between gap-2">
        <span className="badge-pill">{event.category}</span>
        <span className="text-xs text-[var(--text-muted)]">
          {event.location}
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold leading-tight text-[var(--text-strong)]">
          {event.title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--text-body)]">
          {event.excerpt}
        </p>
      </div>

      <div className="space-y-1 text-sm text-[var(--text-muted)]">
        <p>{formatEventDateRange(event)}</p>
        <p>Hosted by {event.host_name}</p>
      </div>

      <div className="mt-auto border-t border-[var(--border-soft)] pt-4">
        <InterestedButton event={event} />
      </div>
    </article>
  );
}
