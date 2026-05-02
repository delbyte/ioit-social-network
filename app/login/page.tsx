"use client";

import { useState, type FormEvent } from "react";
import { EnvelopeSimple, PaperPlaneTilt } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    <section className="mx-auto max-w-md space-y-6 rounded-lg border border-border/80 bg-card p-6 shadow-sm">
      <header className="space-y-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <EnvelopeSimple size={20} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Sign in</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Enter your email and we&rsquo;ll send you a magic link to sign in instantly. No password needed.
          </p>
        </div>
      </header>

      {status === "sent" ? (
        <div className="space-y-3 py-6 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <EnvelopeSimple size={24} />
          </div>
          <h2 className="m-0 text-lg font-semibold tracking-tight text-foreground">
            Check your email
          </h2>
          <p className="m-0 text-sm leading-6 text-muted-foreground">
            We sent a magic link to <strong className="font-medium text-foreground">{email}</strong>. Click the link in
            the email to sign in.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Email address
            <Input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={status === "sending"}
              autoFocus
            />
          </label>

          {status === "error" && (
            <p className="m-0 text-sm font-medium text-destructive">
              {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            disabled={status === "sending"}
            loading={status === "sending"}
            className="w-full [&>span]:inline-flex [&>span]:items-center [&>span]:gap-1"
          >
            <PaperPlaneTilt size={15} />
            Send Magic Link
          </Button>
        </form>
      )}
    </section>
  );
}
