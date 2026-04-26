import { createClient } from "@/lib/supabase/server";
import type { EventPost } from "@/lib/events";

export async function fetchEvents(): Promise<EventPost[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select(`
      id, slug, title, excerpt, content, photos,
      start_at, end_at, location, category, host_id,
      created_at,
      profiles!events_host_id_fkey ( display_name ),
      event_interested ( count )
    `)
    .order("start_at", { ascending: true });

  if (error || !data) {
    console.error("fetchEvents error:", error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    content: row.content ?? "",
    photos: row.photos ?? [],
    start_at: row.start_at,
    end_at: row.end_at,
    location: row.location ?? "",
    category: row.category as EventPost["category"],
    host_id: row.host_id,
    host_name:
      (row.profiles as unknown as { display_name: string } | null)
        ?.display_name ?? "Unknown",
    interest_count:
      ((row.event_interested as unknown as { count: number }[])?.[0]?.count) ??
      0,
    created_at: row.created_at,
  }));
}

export async function fetchEventsByHost(
  hostId: string,
): Promise<EventPost[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select(`
      id, slug, title, excerpt, content, photos,
      start_at, end_at, location, category, host_id,
      created_at,
      profiles!events_host_id_fkey ( display_name ),
      event_interested ( count )
    `)
    .eq("host_id", hostId)
    .order("start_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    content: row.content ?? "",
    photos: row.photos ?? [],
    start_at: row.start_at,
    end_at: row.end_at,
    location: row.location ?? "",
    category: row.category as EventPost["category"],
    host_id: row.host_id,
    host_name:
      (row.profiles as unknown as { display_name: string } | null)
        ?.display_name ?? "Unknown",
    interest_count:
      ((row.event_interested as unknown as { count: number }[])?.[0]?.count) ??
      0,
    created_at: row.created_at,
  }));
}
