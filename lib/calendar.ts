import type { EventPost } from "@/lib/events";

const DEFAULT_EVENT_DURATION_MINUTES = 60;

function toGoogleDate(dateString: string): string {
  return new Date(dateString)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function addMinutes(dateString: string, minutes: number): string {
  const base = new Date(dateString).getTime();
  return new Date(base + minutes * 60 * 1000).toISOString();
}

export function buildGoogleCalendarUrl(event: EventPost): string {
  const url = new URL("https://calendar.google.com/calendar/render");

  const details = `${event.excerpt}\n\nHosted by ${event.host_name}`;

  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", event.title);
  url.searchParams.set(
    "dates",
    `${toGoogleDate(event.start_at)}/${toGoogleDate(
      addMinutes(event.start_at, DEFAULT_EVENT_DURATION_MINUTES),
    )}`,
  );
  url.searchParams.set("details", details.slice(0, 3000));
  url.searchParams.set("location", event.location);
  url.searchParams.set(
    "ctz",
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  );

  return url.toString();
}
