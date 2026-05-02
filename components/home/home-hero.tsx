"use client";

import Link from "next/link";
import { CalendarPlus, Compass, Sparkle } from "@phosphor-icons/react";
import { buttonVariants } from "@/components/ui/button";

export function HomeHero() {
  return (
    <header className="grid gap-6 rounded-lg border border-border/80 bg-card p-6 shadow-sm md:grid-cols-[1fr_auto] md:items-end md:p-8">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <Sparkle size={14} weight="regular" />
          Event-only campus social
        </div>
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
          Find the next room worth being in.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          Discover workshops, meetups, games, and low-friction gatherings from people around you.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
        <Link
          href="/events/new"
          className={`${buttonVariants({ variant: "primary", size: "lg" })} [&>svg]:size-4`}
        >
          <CalendarPlus size={17} />
          Create New Event
        </Link>
        <Link
          href="/discover"
          className={`${buttonVariants({ variant: "tertiary", size: "lg" })} [&>svg]:size-4`}
        >
          <Compass size={17} />
          Discover Events
        </Link>
      </div>
    </header>
  );
}
