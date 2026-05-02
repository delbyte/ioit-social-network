"use client";

import { useMemo, useState } from "react";
import { CalendarPlus, Heart } from "@phosphor-icons/react";
import type { EventPost } from "@/lib/events";
import { useInterestState } from "@/components/providers/interest-provider";

import { Button } from "@/components/ui/button";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function InterestedButton({ event }: { event: EventPost }) {
  const { isInterested, toggleInterested, getCalendarUrl } =
    useInterestState();

  const interested = isInterested(event.id);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const interestTotal = useMemo(
    () => event.interest_count + (interested ? 1 : 0),
    [event.interest_count, interested],
  );

  const calendarUrl = getCalendarUrl(event.id);

  const buttonLabel = interested ? "Interested" : "I'm interested";

  async function handleClick() {
    if (isLoading) {
      return;
    }

    setHasError(false);
    setIsLoading(true);

    try {
      await sleep(220);
      toggleInterested(event);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        type="button"
        onClick={handleClick}
        loading={isLoading}
        disabled={isLoading}
        variant={interested ? "primary" : "tertiary"}
        className={`[&>span]:inline-flex [&>span]:items-center [&>span]:gap-1 ${
          hasError ? "border-destructive/30 text-destructive" : ""
        }`}
      >
        <Heart size={15} weight={interested ? "fill" : "regular"} />
        {buttonLabel}
      </Button>
      <div className="text-xs text-muted-foreground">
        {interestTotal} people interested
      </div>
      {interested && calendarUrl ? (
        <a
          href={calendarUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-foreground transition-opacity hover:opacity-70"
        >
          <CalendarPlus size={14} />
          Add to Google Calendar
        </a>
      ) : null}
    </div>
  );
}
