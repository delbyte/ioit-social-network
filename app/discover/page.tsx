import { eventPosts } from "@/lib/events";
import { DiscoverClient } from "@/app/discover/discover-client";

export default function DiscoverPage() {
  return <DiscoverClient events={eventPosts} />;
}
