import { createClient } from "@/lib/supabase/server";
import type { EventPost } from "@/lib/events";

export async function fetchEvents(): Promise<EventPost[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select(`
      id, slug, title, excerpt, content, photos,
      start_at, location, category, host_id,
      created_at,
      profiles!events_host_id_fkey ( display_name, handle, avatar_url, bio, about ),
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
    location: row.location ?? "",
    category: row.category as EventPost["category"],
    host_id: row.host_id,
    host_name:
      (row.profiles as unknown as { display_name: string } | null)
        ?.display_name ?? "Unknown",
    host_handle:
      (row.profiles as unknown as { handle: string | null } | null)?.handle ?? null,
    host_avatar_url:
      (row.profiles as unknown as { avatar_url: string | null } | null)?.avatar_url ?? null,
    host_bio:
      (row.profiles as unknown as { bio: string | null } | null)?.bio ?? null,
    host_about:
      (row.profiles as unknown as { about: string | null } | null)?.about ?? null,
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
      start_at, location, category, host_id,
      created_at,
      profiles!events_host_id_fkey ( display_name, handle, avatar_url, bio, about ),
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
    location: row.location ?? "",
    category: row.category as EventPost["category"],
    host_id: row.host_id,
    host_name:
      (row.profiles as unknown as { display_name: string } | null)
        ?.display_name ?? "Unknown",
    host_handle:
      (row.profiles as unknown as { handle: string | null } | null)?.handle ?? null,
    host_avatar_url:
      (row.profiles as unknown as { avatar_url: string | null } | null)?.avatar_url ?? null,
    host_bio:
      (row.profiles as unknown as { bio: string | null } | null)?.bio ?? null,
    host_about:
      (row.profiles as unknown as { about: string | null } | null)?.about ?? null,
    interest_count:
      ((row.event_interested as unknown as { count: number }[])?.[0]?.count) ??
      0,
    created_at: row.created_at,
  }));
}

export async function fetchEventBySlug(slug: string): Promise<EventPost | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select(`
      id, slug, title, excerpt, content, photos,
      start_at, location, category, host_id,
      created_at,
      profiles!events_host_id_fkey ( display_name, handle, avatar_url, bio, about ),
      event_interested ( count )
    `)
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("fetchEventBySlug error:", error);
    return null;
  }

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt ?? "",
    content: data.content ?? "",
    photos: data.photos ?? [],
    start_at: data.start_at,
    location: data.location ?? "",
    category: data.category as EventPost["category"],
    host_id: data.host_id,
    host_name:
      (data.profiles as unknown as { display_name: string } | null)
        ?.display_name ?? "Unknown",
    host_handle:
      (data.profiles as unknown as { handle: string | null } | null)?.handle ?? null,
    host_avatar_url:
      (data.profiles as unknown as { avatar_url: string | null } | null)?.avatar_url ?? null,
    host_bio:
      (data.profiles as unknown as { bio: string | null } | null)?.bio ?? null,
    host_about:
      (data.profiles as unknown as { about: string | null } | null)?.about ?? null,
    interest_count:
      ((data.event_interested as unknown as { count: number }[])?.[0]?.count) ??
      0,
    created_at: data.created_at,
  };
}
