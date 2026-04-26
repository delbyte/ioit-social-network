import { eventPosts } from "@/lib/events";
import { EventsClient } from "@/app/events/events-client";

export default function EventsPage() {
  return <EventsClient events={eventPosts} />;
}
