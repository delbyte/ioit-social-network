import { notFound } from "next/navigation";
import { ProfileClient } from "@/app/profile/profile-client";
import { createClient } from "@/lib/supabase/server";
import { fetchEventsByHost } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function ProfileHandlePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const supabase = await createClient();
  const { handle: routeHandle } = await params;
  const rawHandle = decodeURIComponent(routeHandle);
  const normalizedHandle = rawHandle.replace(/^@+/, "").trim().toLowerCase();
  const handleCandidates = Array.from(
    new Set([rawHandle, normalizedHandle].filter(Boolean)),
  );

  const { data: profileByHandle } = await supabase
    .from("profiles")
    .select("id, display_name, handle, bio, about, avatar_url")
    .in("handle", handleCandidates)
    .limit(1)
    .maybeSingle();

  const profile = profileByHandle
    ? profileByHandle
    : UUID_PATTERN.test(rawHandle)
      ? await supabase
          .from("profiles")
          .select("id, display_name, handle, bio, about, avatar_url")
          .eq("id", rawHandle)
          .maybeSingle()
          .then((result) => result.data ?? null)
      : null;

  if (!profile) {
    notFound();
  }

  const createdEvents = await fetchEventsByHost(profile.id);

  return (
    <ProfileClient
      profile={{
        name: profile.display_name || profile.handle || "User",
        handle: profile.handle ? `@${profile.handle.replace(/^@+/, "")}` : "@user",
        bio: profile.bio || "",
        about: profile.about || "",
        avatarUrl: profile.avatar_url || null,
      }}
      createdEvents={createdEvents}
      isOwner={false}
    />
  );
}
