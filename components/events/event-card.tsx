"use client";

import type { EventPost } from "@/lib/events";
import { formatEventDateRange } from "@/lib/date";
import { InterestedButton } from "@/components/events/interested-button";

const imageVariantClassName: Record<EventPost["imageVariant"], string> = {
  sunset: "event-cover event-cover-sunset",
  lagoon: "event-cover event-cover-lagoon",
  ember: "event-cover event-cover-ember",
  none: "",
};

export function EventCard({ event }: { event: EventPost }) {
  const coverClassName = imageVariantClassName[event.imageVariant];

  return (
    <article className="card-surface flex h-full flex-col gap-4">
      {event.imageVariant !== "none" ? (
        <div className={coverClassName} aria-hidden="true" />
      ) : null}

      <div className="flex items-center justify-between gap-2">
        <span className="badge-pill">{event.category}</span>
        <span className="text-xs text-[var(--text-muted)]">{event.location}</span>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold leading-tight text-[var(--text-strong)]">
          {event.title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--text-body)]">{event.excerpt}</p>
      </div>

      <div className="space-y-1 text-sm text-[var(--text-muted)]">
        <p>{formatEventDateRange(event)}</p>
        <p>Hosted by {event.hostName}</p>
      </div>

      <div className="mt-auto border-t border-[var(--border-soft)] pt-4">
        <InterestedButton event={event} />
      </div>
    </article>
  );
}
