"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <section className="mx-auto max-w-md space-y-6">
      <header className="space-y-2 mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&rsquo;ll send you a magic link to sign in
          instantly &mdash; no password needed.
        </p>
      </header>

      {status === "sent" ? (
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-3 text-center">
          <div className="text-4xl leading-none">
            ✉️
          </div>
          <h2 className="text-lg font-semibold tracking-tight m-0">
            Check your email
          </h2>
          <p className="text-sm text-muted-foreground m-0">
            We sent a magic link to <strong className="font-medium text-foreground">{email}</strong>. Click the link in
            the email to sign in.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Email address
            <input
              type="email"
              required
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "sending"}
              autoFocus
            />
          </label>

          {status === "error" && (
            <p className="text-sm font-medium text-destructive m-0">
              {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            disabled={status === "sending"}
            className="w-full"
          >
            {status === "sending" ? "Sending…" : "Send Magic Link"}
          </Button>
        </form>
      )}
    </section>
  );
}
