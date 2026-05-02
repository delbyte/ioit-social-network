"use client";

import Link from "next/link";
import { CalendarPlus, Compass } from "@phosphor-icons/react";
import { MingleLogo } from "@/components/brand/mingle-logo";
import { buttonVariants } from "@/components/ui/button";

export function HomeHero() {
  return (
    <header className="mingle-grain relative isolate min-h-[560px] overflow-hidden rounded-lg border border-black/10 bg-neutral-950 shadow-[0_26px_90px_rgba(15,23,42,0.24)]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-95"
        style={{ backgroundImage: "url('/images/mingle-hero-market.jpg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.88)_0%,rgba(5,5,5,0.66)_36%,rgba(5,5,5,0.18)_70%,rgba(5,5,5,0.08)_100%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(180deg,rgba(10,10,10,0)_0%,rgba(10,10,10,0.82)_72%,#101010_100%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,rgba(255,250,242,0)_0%,#fffaf2_100%)]" aria-hidden="true" />

      <div className="relative flex min-h-[560px] flex-col justify-center gap-7 p-6 md:p-10">
        <MingleLogo className="[&>span]:text-white" />
        <div className="max-w-3xl space-y-4">
          <h1 className="text-balance text-5xl font-black leading-[0.95] tracking-normal text-white md:text-7xl">
            discover your campus after dark
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-white/82">
            Find the pop-ups, game nights, open mics, study sprints, matches, and little plans people are actually showing up to.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/events/new"
            className={`${buttonVariants({ variant: "primary", size: "lg" })} h-12 bg-white text-neutral-950 hover:bg-white/90 [&>svg]:size-4`}
          >
            <CalendarPlus size={17} />
            Create New Event
          </Link>
          <Link
            href="/discover"
            className={`${buttonVariants({ variant: "tertiary", size: "lg" })} h-12 border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/18 [&>svg]:size-4`}
          >
            <Compass size={17} />
            Discover Events
          </Link>
        </div>
      </div>
    </header>
  );
}
