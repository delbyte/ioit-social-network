import { notFound } from "next/navigation";
import { ProfileClient } from "@/app/profile/profile-client";
import { createClient } from "@/lib/supabase/server";
import { fetchEventsByHost } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function ProfileHandlePage({
  params,
}: {
  params: { handle: string };
}) {
  const supabase = await createClient();
  const handle = params.handle;

  const { data: profileByHandle } = await supabase
    .from("profiles")
    .select("id, display_name, handle, bio, about, avatar_url")
    .eq("handle", handle)
    .single();

  const profile = profileByHandle
    ? profileByHandle
    : await supabase
        .from("profiles")
        .select("id, display_name, handle, bio, about, avatar_url")
        .eq("id", handle)
        .single()
        .then((result) => result.data ?? null);

  if (!profile) {
    notFound();
  }

  const createdEvents = await fetchEventsByHost(profile.id);

  return (
    <ProfileClient
      profile={{
        name: profile.display_name || profile.handle || "User",
        handle: profile.handle ? `@${profile.handle}` : "@user",
        bio: profile.bio || "",
        about: profile.about || "",
        avatarUrl: profile.avatar_url || null,
      }}
      createdEvents={createdEvents}
      isOwner={false}
    />
  );
}
