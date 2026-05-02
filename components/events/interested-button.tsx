"use client";

import { useMemo, useState } from "react";
import { CalendarPlus, Heart } from "@phosphor-icons/react";
import type { EventPost } from "@/lib/events";
import { useInterestState } from "@/components/providers/interest-provider";

import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

interface InterestedButtonProps {
  event: EventPost;
  tone?: "default" | "dark";
  compact?: boolean;
}

export function InterestedButton({
  event,
  tone = "default",
  compact = false,
}: InterestedButtonProps) {
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
  const interestLabel =
    interestTotal === 1
      ? "1 person interested"
      : `${interestTotal} people interested`;
  const isDark = tone === "dark";
  const buttonClassName = isDark
    ? interested
      ? "bg-white text-neutral-950 hover:bg-white/90 active:bg-white/80"
      : "border-white/20 bg-white/10 text-white hover:bg-white/15 active:bg-white/20"
    : hasError
      ? "border-destructive/30 text-destructive"
      : "";

  if (compact) {
    return (
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <span className={`text-xs ${isDark ? "text-white/58" : "text-muted-foreground"}`}>
          {interestLabel}
        </span>
        <Tooltip content={buttonLabel}>
          <Button
            type="button"
            onClick={handleClick}
            loading={isLoading}
            disabled={isLoading}
            size="icon-sm"
            variant={interested ? "primary" : "ghost"}
            className={buttonClassName}
            aria-label={buttonLabel}
          >
            <Heart size={18} weight={interested ? "fill" : "regular"} />
          </Button>
        </Tooltip>
      </div>
    );
  }

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
        className={`[&>span]:inline-flex [&>span]:items-center [&>span]:gap-1 ${buttonClassName}`}
      >
        <Heart size={15} weight={interested ? "fill" : "regular"} />
        {buttonLabel}
      </Button>
      <div className={`text-xs ${isDark ? "text-white/58" : "text-muted-foreground"}`}>
        {interestLabel}
      </div>
      {interested && calendarUrl ? (
        <a
          href={calendarUrl}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70 ${
            isDark ? "text-white" : "text-foreground"
          }`}
        >
          <CalendarPlus size={14} />
          Add to Google Calendar
        </a>
      ) : null}
    </div>
  );
}
