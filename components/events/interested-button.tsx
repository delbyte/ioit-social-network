"use client";

import { useMemo, useState } from "react";
import type { EventPost } from "@/lib/events";
import { useInterestState } from "@/components/providers/interest-provider";

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

  const buttonLabel = isLoading ? "Saving..." : "Interested";

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
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={
          interested
            ? "btn-primary"
            : hasError
              ? "btn-error"
              : "btn-secondary"
        }
      >
        {buttonLabel}
      </button>
      <div className="text-xs text-[var(--text-muted)]">
        {interestTotal} people interested
      </div>
      {interested && calendarUrl ? (
        <a
          href={calendarUrl}
          target="_blank"
          rel="noreferrer"
          className="calendar-link"
        >
          Add to Google Calendar
        </a>
      ) : null}
    </div>
  );
}
