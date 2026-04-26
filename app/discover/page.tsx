import { DiscoverClient } from "@/app/discover/discover-client";
import { fetchEvents } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const events = await fetchEvents();
  return <DiscoverClient events={events} />;
}
