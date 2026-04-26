"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface InitialProfileData {
  name: string;
  handle: string;
  bio: string;
  about: string;
  avatarUrl: string | null;
}

export function ProfileEditClient({
  initialData,
}: {
  initialData: InitialProfileData;
}) {
  const [displayName, setDisplayName] = useState(initialData.name);
  const [handle, setHandle] = useState(initialData.handle);
  const [bio, setBio] = useState(initialData.bio);
  const [about, setAbout] = useState(initialData.about);

  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("error");
      setErrorMessage("Not authenticated");
      return;
    }

    // Check handle availability
    if (handle !== initialData.handle) {
      const { data: existingHandle } = await supabase
        .from("profiles")
        .select("id")
        .eq("handle", handle)
        .single();

      if (existingHandle && existingHandle.id !== user.id) {
        setStatus("error");
        setErrorMessage("Handle is already taken");
        return;
      }
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        handle,
        bio,
        about,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
    } else {
      window.location.href = "/profile";
    }
  }

  return (
    <section className="mx-auto max-w-xl space-y-6 pt-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Edit Profile</h1>
        <p className="text-sm text-muted-foreground">
          Update your public profile details.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4 md:p-2">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Display Name
            <Input
              type="text"
              required
              placeholder="Jane Doe"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={status === "submitting"}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Username (Handle)
            <Input
              type="text"
              required
              placeholder="janedoe"
              value={handle}
              onChange={(e) =>
                setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
              }
              disabled={status === "submitting"}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Bio (Short)
            <Input
              type="text"
              placeholder="A one-liner about you"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={status === "submitting"}
              maxLength={150}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            About (Long)
            <Textarea
              placeholder="A longer bio (max 500 characters)"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              maxLength={500}
              rows={4}
              disabled={status === "submitting"}
            />
          </label>
        </div>

        {status === "error" && (
          <p className="text-sm font-medium text-destructive">{errorMessage}</p>
        )}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => (window.location.href = "/profile")}
            disabled={status === "submitting"}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              status === "submitting" || !handle.trim() || !displayName.trim()
            }
          >
            {status === "submitting" ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </section>
  );
}
