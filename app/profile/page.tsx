import { ProfileClient } from "@/app/profile/profile-client";
import { createClient } from "@/lib/supabase/server";
import { fetchEventsByHost } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, handle, bio, avatar_url")
    .eq("id", user.id)
    .single();

  const createdEvents = await fetchEventsByHost(user.id);

  return (
    <ProfileClient
      profile={{
        name: profile?.display_name || user.email?.split("@")[0] || "User",
        handle: profile?.handle || `@${user.email?.split("@")[0] || "user"}`,
        bio: profile?.bio || "",
        avatarUrl: profile?.avatar_url || null,
      }}
      createdEvents={createdEvents}
    />
  );
}
