"use client";

import type { EventPost } from "@/lib/events";
import { formatEventDateRange } from "@/lib/date";
import { InterestedButton } from "@/components/events/interested-button";

import { Confetti, ChalkboardTeacher, Basketball, Globe, MusicNotes, ForkKnife, Tag } from "@phosphor-icons/react";

function getCategoryIcon(category: string) {
  switch (category) {
    case "Party": return <Confetti weight="fill" className="mr-1 h-3.5 w-3.5 text-pink-500" />;
    case "Workshop": return <ChalkboardTeacher weight="fill" className="mr-1 h-3.5 w-3.5 text-blue-500" />;
    case "Sports": return <Basketball weight="fill" className="mr-1 h-3.5 w-3.5 text-orange-500" />;
    case "Online": return <Globe weight="fill" className="mr-1 h-3.5 w-3.5 text-indigo-500" />;
    case "Music": return <MusicNotes weight="fill" className="mr-1 h-3.5 w-3.5 text-violet-500" />;
    case "Food": return <ForkKnife weight="fill" className="mr-1 h-3.5 w-3.5 text-amber-500" />;
    default: return <Tag weight="fill" className="mr-1 h-3.5 w-3.5 text-muted-foreground" />;
  }
}

export function EventCard({ event }: { event: EventPost }) {
  const hasPhoto = event.photos && event.photos.length > 0;

  return (
    <article className="flex h-full flex-col gap-4 rounded-xl border bg-transparent p-5 transition-colors hover:bg-card">
      {hasPhoto ? (
        <div
          className="min-h-28 rounded-md bg-muted"
          style={{
            backgroundImage: `url(${event.photos[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />
      ) : null}

      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          {getCategoryIcon(event.category)}
          {event.category}
        </span>
        <span className="text-xs text-muted-foreground">
          {event.location}
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold leading-tight text-foreground flex items-baseline gap-2">
          {event.emoji && <span className="text-2xl">{event.emoji}</span>}
          <span>{event.title}</span>
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {event.excerpt}
        </p>
      </div>

      <div className="space-y-1 text-sm text-muted-foreground">
        <p>{formatEventDateRange(event)}</p>
        <p>Hosted by {event.host_name}</p>
      </div>

      <div className="mt-auto border-t pt-4 flex items-center justify-between">
        <InterestedButton event={event} />
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard.writeText(`Check out ${event.title} on Mingle! ${window.location.origin}`);
            alert("Share text copied to clipboard!");
          }}
          className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted/50 transition-colors"
          title="Share the event"
          aria-label="Share Event"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" x2="12" y1="2" y2="15" />
          </svg>
        </button>
      </div>
    </article>
  );
}
