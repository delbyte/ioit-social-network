import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { InterestedButton } from "@/components/events/interested-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatEventDateRange } from "@/lib/date";
import { fetchEventBySlug } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await fetchEventBySlug(slug);

  if (!event) {
    notFound();
  }

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

  return (
    <section className="space-y-8">
      <header className="overflow-hidden rounded-lg border border-border/80 bg-card shadow-[0_22px_60px_rgba(15,23,42,0.1)]">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted md:aspect-[21/9]">
          {event.photos.length ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${event.photos[0]})` }}
              aria-hidden="true"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#fff7ed_0%,#ecfeff_48%,#fef9c3_100%)]">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.38)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.38)_1px,transparent_1px)] bg-[size:34px_34px]" aria-hidden="true" />
              <span className="relative text-7xl drop-shadow-sm" aria-hidden="true">
                {event.emoji || "M"}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_34%,rgba(0,0,0,0.7)_100%)]" aria-hidden="true" />
          <div className="absolute left-4 top-4">
            <Badge color="green" variant="dot" size="sm" className="bg-card/90 backdrop-blur">
              {event.category}
            </Badge>
          </div>
        </div>

        <div className="space-y-5 p-5 md:p-6">
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to discover
          </Link>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {formatEventDateRange(event)}
            </p>
            <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              {event.title}
            </h1>
            {event.excerpt ? (
              <p className="max-w-3xl text-base leading-7 text-muted-foreground">{event.excerpt}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Location
              </span>
              <span>{event.location || "Location to be announced"}</span>
            </div>
            <Link href={profileHref} className="inline-flex items-center gap-2">
              <Avatar size="sm">
                {event.host_avatar_url ? (
                  <AvatarImage src={event.host_avatar_url} alt="" />
                ) : null}
                <AvatarFallback>{initials || "U"}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">{event.host_name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {hostDescription}
              </span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <InterestedButton event={event} />
            <Link
              href="/events"
              className="text-sm font-medium text-foreground transition-opacity hover:opacity-70"
            >
              Back to events
            </Link>
          </div>
        </div>
      </header>

      <article className="prose prose-lg max-w-none rounded-lg border border-border/80 bg-card/95 p-6 shadow-sm dark:prose-invert prose-headings:text-foreground prose-a:text-foreground md:p-8">
        {event.content.trim() ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{event.content}</ReactMarkdown>
        ) : (
          <p className="text-muted-foreground">No description yet.</p>
        )}
      </article>
    </section>
  );
}
