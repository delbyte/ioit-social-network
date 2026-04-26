"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/providers/auth-provider";

export default function OnboardingPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [about, setAbout] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setStatus("submitting");
    setErrorMessage("");

    const supabase = createClient();
    
    // Check if handle is taken
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

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        handle,
        about,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <section className="mx-auto max-w-md space-y-6 pt-10">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Complete your profile</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to Mingle! Set up your profile to continue.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Display Name
          <Input
            type="text"
            required
            placeholder="Jane Doe"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={status === "submitting"}
            autoFocus
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Username (Handle)
          <Input
            type="text"
            required
            placeholder="janedoe"
            value={handle}
            onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
            disabled={status === "submitting"}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          About
          <Textarea
            placeholder="A short bio about yourself (max 500 characters)"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            maxLength={500}
            rows={4}
            disabled={status === "submitting"}
          />
        </label>

        {status === "error" && (
          <p className="text-sm font-medium text-destructive m-0">
            {errorMessage}
          </p>
        )}

        <Button
          type="submit"
          disabled={status === "submitting" || !handle.trim() || !displayName.trim()}
          className="w-full"
        >
          {status === "submitting" ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </section>
  );
}
