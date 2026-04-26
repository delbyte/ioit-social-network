import type { EventPost } from "@/lib/events";

export function formatEventDateRange(event: EventPost): string {
  const start = new Date(event.start_at);
  const end = new Date(event.end_at);

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZoneName: "short",
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${dateFormatter.format(start)} · ${timeFormatter.format(
    start,
  )} - ${timeFormatter.format(end)}`;
}

export function getRelativeEventState(
  event: EventPost,
  now = Date.now(),
): "past" | "ongoing" | "upcoming" {
  const startMs = new Date(event.start_at).getTime();
  const endMs = new Date(event.end_at).getTime();

  if (endMs < now) {
    return "past";
  }

  if (startMs <= now && endMs >= now) {
    return "ongoing";
  }

  return "upcoming";
}
