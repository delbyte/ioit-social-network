"use client";

import { useState } from "react";
import Link from "next/link";
import type { EventPost } from "@/lib/events";
import { formatEventDateRange } from "@/lib/date";
import { InterestedButton } from "@/components/events/interested-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge, type BadgeColor } from "@/components/ui/badge";
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

const categoryThemes: Record<
  string,
  { badge: BadgeColor; poster: string; accent: string }
> = {
  Technology: {
    badge: "cyan",
    poster: "bg-[linear-gradient(135deg,#111827_0%,#155e75_48%,#facc15_100%)]",
    accent: "bg-cyan-400",
  },
  Business: {
    badge: "blue",
    poster: "bg-[linear-gradient(135deg,#111827_0%,#1d4ed8_50%,#fb923c_100%)]",
    accent: "bg-blue-500",
  },
  Wellness: {
    badge: "emerald",
    poster: "bg-[linear-gradient(135deg,#052e16_0%,#10b981_50%,#fef08a_100%)]",
    accent: "bg-emerald-500",
  },
  Networking: {
    badge: "violet",
    poster: "bg-[linear-gradient(135deg,#18181b_0%,#7c3aed_48%,#f472b6_100%)]",
    accent: "bg-violet-500",
  },
  Arts: {
    badge: "pink",
    poster: "bg-[linear-gradient(135deg,#1f2937_0%,#db2777_48%,#fbbf24_100%)]",
    accent: "bg-pink-500",
  },
  Environmental: {
    badge: "lime",
    poster: "bg-[linear-gradient(135deg,#1a2e05_0%,#65a30d_48%,#67e8f9_100%)]",
    accent: "bg-lime-500",
  },
  Sports: {
    badge: "orange",
    poster: "bg-[linear-gradient(135deg,#1c1917_0%,#ea580c_48%,#38bdf8_100%)]",
    accent: "bg-orange-500",
  },
  Community: {
    badge: "green",
    poster: "bg-[linear-gradient(135deg,#111827_0%,#16a34a_46%,#f97316_100%)]",
    accent: "bg-green-500",
  },
};

function PosterPlaceholder({
  event,
  theme,
}: {
  event: EventPost;
  theme: { poster: string; accent: string };
}) {
  const titleWords = event.title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .join(" ");

  return (
    <div className={`mingle-grain absolute inset-0 overflow-hidden ${theme.poster}`}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.46)_100%)]" aria-hidden="true" />
      <div className="absolute -left-8 top-5 h-10 w-36 -rotate-12 bg-white/88" aria-hidden="true" />
      <div className={`absolute right-0 top-0 h-full w-2 ${theme.accent}`} aria-hidden="true" />
      <div className="relative flex h-full flex-col justify-between p-3">
        <span className="w-fit rounded-full bg-black/32 px-2 py-1 text-[10px] font-black uppercase text-white/86 backdrop-blur">
          {event.category}
        </span>
        <div>
          <span className="text-4xl drop-shadow-sm" aria-hidden="true">
            {event.emoji || "M"}
          </span>
          <p className="mt-2 line-clamp-3 text-xl font-black leading-none tracking-normal text-white">
            {titleWords || "campus event"}
          </p>
        </div>
      </div>
    </div>
  );
}

export function EventCard({ event }: { event: EventPost }) {
  const hasPhoto = event.photos && event.photos.length > 0;
  const theme = categoryThemes[event.category] ?? categoryThemes.Community;
  const [shareState, setShareState] = useState<"idle" | "copied" | "error">("idle");
  const profileHref = event.host_handle
    ? `/profile/${encodeURIComponent(event.host_handle.replace(/^@+/, ""))}`
    : `/profile/${event.host_id}`;
  const hostDescription =
    event.host_about ||
    event.host_bio ||
    (event.host_handle ? `@${event.host_handle.replace(/^@+/, "")}` : "Event host");
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
    <article className="group flex h-full min-h-[188px] overflow-hidden rounded-lg border border-black/10 bg-[#242424] text-white shadow-[0_18px_45px_rgba(15,23,42,0.16)] transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[0_24px_58px_rgba(15,23,42,0.22)]">
      <div className="relative min-h-[188px] w-32 shrink-0 overflow-hidden bg-neutral-900 sm:w-40">
        {hasPhoto ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.04]"
            style={{ backgroundImage: `url(${event.photos[0]})` }}
            aria-hidden="true"
          />
        ) : (
          <PosterPlaceholder event={event} theme={theme} />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <Link href={profileHref} className="flex min-w-0 items-center gap-2 rounded-md -m-1 p-1 transition-colors hover:bg-white/10">
            <Avatar size="sm">
              {event.host_avatar_url ? (
                <AvatarImage src={event.host_avatar_url} alt="" />
              ) : null}
              <AvatarFallback className="bg-white/10 text-white">{initials || "U"}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">{event.host_name}</p>
              <p className="truncate text-[11px] text-white/50">{hostDescription}</p>
            </div>
          </Link>
          <Badge color={theme.badge} variant="dot" size="sm" className="hidden shrink-0 border-white/10 bg-white/10 text-white sm:inline-flex">
            {getCategoryIcon(event.category)}
            {event.category}
          </Badge>
        </div>

        <div className="min-w-0">
          <h3 className="line-clamp-2 text-lg font-black leading-tight tracking-normal text-white">
            {event.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm font-medium text-white/78">
            {formatEventDateRange(event)}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-white/50">
            <MapPin size={15} />
            <span className="truncate">{event.location || "Location to be announced"}</span>
          </p>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-white/58">
          {event.excerpt || event.content}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/10 pt-3">
          <InterestedButton event={event} tone="dark" compact />
          <div className="flex items-center gap-1">
            <Button asChild size="sm" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
              <Link href={`/events/${event.slug}`}>Read more</Link>
            </Button>
            <Tooltip content="Share event">
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="text-white/72 hover:bg-white/10 hover:text-white"
                onClick={handleShare}
                aria-label="Share event"
              >
                <ShareNetwork size={18} weight="regular" />
              </Button>
            </Tooltip>
          </div>
        </div>
        {shareState !== "idle" ? (
          <span className={`text-[11px] ${shareState === "copied" ? "text-white/70" : "text-red-200"}`}>
            {shareState === "copied" ? "Copied" : "Try again"}
          </span>
        ) : null}
      </div>
    </article>
  );
}
