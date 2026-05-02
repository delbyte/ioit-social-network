"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PencilSimple } from "@phosphor-icons/react";
import { EventCard } from "@/components/events/event-card";
import { useInterestState } from "@/components/providers/interest-provider";
import type { EventPost } from "@/lib/events";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { readDrafts, removeDraft, type EventDraft } from "@/lib/drafts";

interface ProfileData {
  name: string;
  handle: string;
  bio: string;
  about: string;
  avatarUrl: string | null;
}

export function ProfileClient({
  profile,
  createdEvents,
  isOwner = true,
}: {
  profile: ProfileData;
  createdEvents: EventPost[];
  isOwner?: boolean;
}) {
  const { interestedIds } = useInterestState();
  const [drafts, setDrafts] = useState<EventDraft[]>([]);
  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .map((token) => token[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const statsColumns = isOwner ? "grid-cols-3" : "grid-cols-2";

  const draftCount = drafts.length;

  const draftScheduleLabels = useMemo(() => {
    return drafts.map((draft) => {
      if (!draft.eventDate || !draft.eventTime) return "";
      const date = new Date(`${draft.eventDate}T${draft.eventTime}`);
      if (Number.isNaN(date.getTime())) return "";
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(date);
    });
  }, [drafts]);

  useEffect(() => {
    if (!isOwner) return;

    const updateDrafts = () => {
      setDrafts(readDrafts());
    };

    updateDrafts();
    window.addEventListener("storage", updateDrafts);
    return () => window.removeEventListener("storage", updateDrafts);
  }, [isOwner]);

  function handleDiscardDraft(id: string) {
    const next = removeDraft(id);
    setDrafts(next);
  }

  return (
    <section className="space-y-8">
      <header className="relative grid gap-5 rounded-lg border border-border/80 bg-card p-5 shadow-sm md:grid-cols-[auto_1fr_auto] md:items-start md:p-6">
        <Avatar className="mx-auto size-24 md:mx-0" aria-hidden="true">
          {profile.avatarUrl ? <AvatarImage src={profile.avatarUrl} alt="" /> : null}
          <AvatarFallback className="text-3xl font-semibold text-foreground">
            {initials || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{profile.name}</h1>
          <p className="text-base text-muted-foreground">{profile.handle}</p>
          {profile.bio && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground">
              {profile.bio}
            </p>
          )}
          {profile.about && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {profile.about}
            </p>
          )}
        </div>

        {isOwner ? (
          <Link
            href="/profile/edit"
            className={`${buttonVariants({ variant: "tertiary", size: "sm" })} mx-auto md:mx-0 [&>svg]:size-3.5`}
          >
            <PencilSimple size={14} />
            Edit Profile
          </Link>
        ) : null}
      </header>

      <section className={`grid ${statsColumns} gap-4`} aria-label="Profile stats">
        <article className="rounded-lg border border-border/80 bg-card p-4 text-center shadow-sm">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Created</h2>
          <p className="mt-1 text-2xl font-bold tracking-tight">{createdEvents.length}</p>
        </article>
        {isOwner ? (
          <article className="rounded-lg border border-border/80 bg-card p-4 text-center shadow-sm">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Interested</h2>
            <p className="mt-1 text-2xl font-bold tracking-tight">{interestedIds.length}</p>
          </article>
        ) : null}
        <article className="rounded-lg border border-border/80 bg-card p-4 text-center shadow-sm">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Focus</h2>
          <p className="mt-1 text-lg font-bold tracking-tight">Events</p>
        </article>
      </section>

      {isOwner && draftCount > 0 ? (
        <section className="space-y-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Drafts</h2>
              <p className="text-sm text-muted-foreground">Saved locally on this device.</p>
            </div>
            <span className="text-sm text-muted-foreground">{draftCount} saved</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {drafts.map((draft, index) => (
              <article
                key={draft.id}
                className="flex flex-col gap-3 rounded-lg border border-border/80 bg-card p-4 shadow-sm"
              >
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {draft.title || "Untitled event"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {draftScheduleLabels[index] || "Schedule not set"}
                    {draft.location ? ` · ${draft.location}` : ""}
                  </p>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {draft.excerpt || draft.content || "No description yet."}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Button asChild size="sm" variant="primary">
                    <Link href={`/events/new?draft=${draft.id}`}>Continue</Link>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDiscardDraft(draft.id)}
                  >
                    Discard
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Created Events</h2>
        {createdEvents.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-dashed border-border bg-card p-4 text-sm text-muted-foreground">
            <p>You have not created any events yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {createdEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
