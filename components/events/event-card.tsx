"use client";

import { useState } from "react";
import Link from "next/link";
import type { EventPost } from "@/lib/events";
import { formatEventDateRange } from "@/lib/date";
import { InterestedButton } from "@/components/events/interested-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";

import {
  Basketball,
  Briefcase,
  Code,
  Handshake,
  Leaf,
  MapPin,
  Palette,
  ShareNetwork,
  Tag,
  UsersThree,
  Waveform,
} from "@phosphor-icons/react";

function getCategoryIcon(category: string) {
  switch (category) {
    case "Technology":
      return <Code size={14} weight="regular" />;
    case "Business":
      return <Briefcase size={14} weight="regular" />;
    case "Wellness":
      return <Waveform size={14} weight="regular" />;
    case "Networking":
      return <Handshake size={14} weight="regular" />;
    case "Arts":
      return <Palette size={14} weight="regular" />;
    case "Environmental":
      return <Leaf size={14} weight="regular" />;
    case "Sports":
      return <Basketball size={14} weight="regular" />;
    case "Community":
      return <UsersThree size={14} weight="regular" />;
    default:
      return <Tag size={14} weight="regular" />;
  }
}

export function EventCard({ event }: { event: EventPost }) {
  const hasPhoto = event.photos && event.photos.length > 0;
  const [shareState, setShareState] = useState<"idle" | "copied" | "error">("idle");
  const profileHref = event.host_handle
    ? `/profile/${event.host_handle}`
    : `/profile/${event.host_id}`;
  const hostDescription =
    event.host_about ||
    event.host_bio ||
    (event.host_handle ? `@${event.host_handle}` : "Event host");
  const initials = event.host_name
    .split(" ")
    .filter(Boolean)
    .map((token) => token[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleShare() {
    const shareUrl = `${window.location.origin}/events/${event.slug}`;
    const shareText = `${event.title} on Mingle\n${shareUrl}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, text: event.excerpt, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareText);
        setShareState("copied");
        window.setTimeout(() => setShareState("idle"), 1800);
      }
    } catch {
      setShareState("error");
      window.setTimeout(() => setShareState("idle"), 1800);
    }
  }

  return (
    <article className="group flex h-full min-h-[360px] flex-col overflow-hidden rounded-lg border border-border/80 bg-card shadow-sm transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-md">
      <div className="flex flex-1 flex-col gap-4 p-5">
        <Link href={profileHref} className="flex items-center gap-3">
          <Avatar size="sm">
            {event.host_avatar_url ? (
              <AvatarImage src={event.host_avatar_url} alt="" />
            ) : null}
            <AvatarFallback>{initials || "U"}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{event.host_name}</p>
            <p className="truncate text-xs text-muted-foreground">{hostDescription}</p>
          </div>
        </Link>

        <div className="space-y-1">
          <div className="flex items-start gap-2">
            {event.emoji && <span className="mt-0.5 text-2xl leading-none">{event.emoji}</span>}
            <h3 className="line-clamp-2 text-lg font-semibold leading-tight tracking-tight text-foreground">
              {event.title}
            </h3>
          </div>
        </div>

        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
          {hasPhoto ? (
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.02]"
              style={{
                backgroundImage: `url(${event.photos[0]})`,
              }}
              aria-hidden="true"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.16),transparent_34%),radial-gradient(circle_at_80%_35%,rgba(249,115,22,0.14),transparent_28%),linear-gradient(135deg,#ffffff,#eef2f7)]">
              <span className="text-5xl" aria-hidden="true">
                {event.emoji || "M"}
              </span>
            </div>
          )}
          <div className="absolute left-3 top-3">
            <Badge color="green" variant="dot" size="sm" className="bg-card/90 backdrop-blur">
              {getCategoryIcon(event.category)}
              {event.category}
            </Badge>
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {event.excerpt || event.content}
        </p>

        <div className="mt-auto space-y-2 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{formatEventDateRange(event)}</p>
          <p className="flex items-center gap-1.5">
            <MapPin size={15} />
            <span className="truncate">{event.location || "Location to be announced"}</span>
          </p>
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-border/70 pt-4">
          <InterestedButton event={event} />
          <div className="flex flex-col items-end gap-2">
            <Button asChild size="sm" variant="tertiary">
              <Link href={`/events/${event.slug}`}>Read more</Link>
            </Button>
            <div className="flex flex-col items-end gap-1">
              <Tooltip content="Share event">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={handleShare}
                  aria-label="Share event"
                >
                  <ShareNetwork size={18} weight="regular" />
                </Button>
              </Tooltip>
              {shareState !== "idle" ? (
                <span
                  className={`text-[11px] ${shareState === "copied" ? "text-foreground" : "text-destructive"}`}
                >
                  {shareState === "copied" ? "Copied" : "Try again"}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
