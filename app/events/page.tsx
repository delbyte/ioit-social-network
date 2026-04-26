import { EventsClient } from "@/app/events/events-client";
import { fetchEvents } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await fetchEvents();
  return <EventsClient events={events} />;
}
