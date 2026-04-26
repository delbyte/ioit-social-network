"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
      <header className="space-y-2">
        <h1 className="page-title">Sign in</h1>
        <p className="page-subtitle">
          Enter your email and we&rsquo;ll send you a magic link to sign in
          instantly &mdash; no password needed.
        </p>
      </header>

      {status === "sent" ? (
        <div className="card-surface space-y-3">
          <div
            style={{
              fontSize: "2.4rem",
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            ✉️
          </div>
          <h2
            className="section-title"
            style={{ textAlign: "center", margin: 0 }}
          >
            Check your email
          </h2>
          <p className="page-subtitle" style={{ textAlign: "center" }}>
            We sent a magic link to <strong>{email}</strong>. Click the link in
            the email to sign in.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card-surface space-y-4">
          <label className="field-label">
            Email address
            <input
              type="email"
              required
              className="text-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "sending"}
              autoFocus
            />
          </label>

          {status === "error" && (
            <p
              style={{
                color: "var(--danger)",
                fontSize: "0.85rem",
                margin: 0,
              }}
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={status === "sending"}
            style={{ width: "100%" }}
          >
            {status === "sending" ? "Sending…" : "Send Magic Link"}
          </button>
        </form>
      )}
    </section>
  );
}
