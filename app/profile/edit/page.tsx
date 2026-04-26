import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileEditClient } from "@/app/profile/edit/profile-edit-client";

export const dynamic = "force-dynamic";

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, handle, bio, about, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <ProfileEditClient
      initialData={{
        name: profile?.display_name || user.email?.split("@")[0] || "User",
        handle: profile?.handle || "",
        bio: profile?.bio || "",
        about: profile?.about || "",
        avatarUrl: profile?.avatar_url || null,
      }}
    />
  );
}
