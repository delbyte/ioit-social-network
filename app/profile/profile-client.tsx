"use client";

import { EventCard } from "@/components/events/event-card";
import { useInterestState } from "@/components/providers/interest-provider";
import type { EventPost } from "@/lib/events";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

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
}: {
  profile: ProfileData;
  createdEvents: EventPost[];
}) {
  const { interestedIds } = useInterestState();

  return (
    <section className="space-y-8">
      <header className="flex flex-col items-center space-y-4 text-center md:items-start md:text-left relative">
        <div className="absolute top-0 right-0 hidden md:block">
          <Link href="/profile/edit" className={buttonVariants({ variant: "outline", size: "sm" })}>Edit Profile</Link>
        </div>
        <div className="flex w-full justify-between items-center md:hidden">
          <div className="w-10"></div>
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold tracking-tight text-primary shadow-inner" aria-hidden="true">
            {profile.name
              .split(" ")
              .map((token) => token[0])
              .join("")}
          </div>
          <Link href="/profile/edit" className={buttonVariants({ variant: "outline", size: "sm" })}>Edit</Link>
        </div>
        <div className="hidden md:flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold tracking-tight text-primary shadow-inner" aria-hidden="true">
          {profile.name
            .split(" ")
            .map((token) => token[0])
            .join("")}
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{profile.name}</h1>
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
      </header>

      <section className="grid grid-cols-3 gap-4" aria-label="Profile stats">
        <article className="rounded-xl border bg-card p-4 text-center shadow-sm">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Created</h2>
          <p className="mt-1 text-2xl font-bold tracking-tight">{createdEvents.length}</p>
        </article>
        <article className="rounded-xl border bg-card p-4 text-center shadow-sm">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Interested</h2>
          <p className="mt-1 text-2xl font-bold tracking-tight">{interestedIds.length}</p>
        </article>
        <article className="rounded-xl border bg-card p-4 text-center shadow-sm">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Focus</h2>
          <p className="mt-1 text-lg font-bold tracking-tight">Event-Only</p>
        </article>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Created Events</h2>
        {createdEvents.length === 0 ? (
          <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground p-4">
            <p>You have not created any events yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {createdEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
