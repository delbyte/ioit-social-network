"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  CalendarBlank,
  Clock,
  Image as ImageIcon,
  MapPin,
} from "@phosphor-icons/react";
import { useSearchParams } from "next/navigation";
import EmojiPicker from "emoji-picker-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { TabItem, Tabs, TabsList } from "@/components/ui/tabs";
import { TimePicker } from "@/components/ui/time-picker";
import { Textarea } from "@/components/ui/textarea";
import { readDrafts, removeDraft, upsertDraft, type EventDraft } from "@/lib/drafts";
import { createClient } from "@/lib/supabase/client";
import type { EventCategory } from "@/lib/events";
import { eventCategoryOptions } from "@/lib/events";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const DEFAULT_EMOJI = "\u{1F4DD}";
const DRAFT_SAVE_DELAY_MS = 600;

type MobileView = "edit" | "preview";

export function NewEventComposer() {
  const [emoji, setEmoji] = useState(DEFAULT_EMOJI);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<EventCategory>("Community");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [mobileView, setMobileView] = useState<MobileView>("edit");
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const searchParams = useSearchParams();
  const draftParam = searchParams.get("draft");

  const canSubmit =
    title.trim().length >= 5 &&
    title.trim().length <= 100 &&
    excerpt.trim().length <= 180 &&
    content.trim().length >= 20 &&
    content.trim().length <= 5000 &&
    location.trim().length >= 2 &&
    eventDate !== "" &&
    eventTime !== "";

  const imageHint = useMemo(
    () =>
      imageError
        ? imageError
        : "Optional image only. JPG, PNG, or WEBP. Maximum 2 MB. No videos.",
    [imageError],
  );

  const hasDraftContent = useMemo(
    () =>
      [title, excerpt, content, location, eventDate, eventTime].some(
        (value) => value.trim() !== "",
      ),
    [content, eventDate, eventTime, excerpt, location, title],
  );

  const previewSchedule = useMemo(() => {
    if (!eventDate || !eventTime) return "";
    const value = new Date(`${eventDate}T${eventTime}`);
    if (Number.isNaN(value.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(value);
  }, [eventDate, eventTime]);

  function createDraftId() {
    return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  useEffect(() => {
    const drafts = readDrafts();
    const resolvedDraft = draftParam
      ? drafts.find((draft) => draft.id === draftParam)
      : drafts[0];

    if (!resolvedDraft) {
      setDraftLoaded(true);
      return;
    }

    setDraftId(resolvedDraft.id);
    setEmoji(resolvedDraft.emoji || DEFAULT_EMOJI);
    setTitle(resolvedDraft.title);
    setExcerpt(resolvedDraft.excerpt);
    setContent(resolvedDraft.content);
    setLocation(resolvedDraft.location);
    setCategory(resolvedDraft.category);
    setEventDate(resolvedDraft.eventDate);
    setEventTime(resolvedDraft.eventTime);
    setDraftLoaded(true);
  }, [draftParam]);

  useEffect(() => {
    if (!draftLoaded) return;

    if (!hasDraftContent) {
      if (draftId) {
        removeDraft(draftId);
        setDraftId(null);
      }
      return;
    }

    const handle = window.setTimeout(() => {
      const id = draftId ?? createDraftId();
      const now = new Date().toISOString();
      const draft: EventDraft = {
        id,
        title,
        excerpt,
        content,
        location,
        category,
        emoji,
        eventDate,
        eventTime,
        createdAt: now,
        updatedAt: now,
      };

      if (!draftId) {
        setDraftId(id);
      }

      upsertDraft(draft);
    }, DRAFT_SAVE_DELAY_MS);

    return () => window.clearTimeout(handle);
  }, [
    category,
    content,
    draftId,
    draftLoaded,
    emoji,
    eventDate,
    eventTime,
    excerpt,
    hasDraftContent,
    location,
    title,
  ]);

  function onImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setImageError(null);
      setImageFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageError("Only image uploads are allowed.");
      setImageFile(null);
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image exceeds the 2 MB limit.");
      setImageFile(null);
      event.target.value = "";
      return;
    }

    setImageError(null);
    setImageFile(file);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("Publishing event...");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatusMessage("You must be logged in to create an event.");
      setIsSubmitting(false);
      return;
    }

    let photoUrl = "";

    if (imageFile) {
      setStatusMessage("Uploading image...");
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("event-photos")
        .upload(fileName, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setStatusMessage(`Upload failed: ${uploadError.message}`);
        setIsSubmitting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("event-photos")
        .getPublicUrl(fileName);

      photoUrl = publicUrlData.publicUrl;
    }

    const cleanExcerpt =
      excerpt.trim() ||
      content
        .replace(/[#*_>`[\]()]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 180);

    const startAt = new Date(`${eventDate}T${eventTime}`);
    if (Number.isNaN(startAt.getTime())) {
      setStatusMessage("Please choose a valid event date and time.");
      setIsSubmitting(false);
      return;
    }

    const slugBase = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const slug = `${slugBase || "event"}-${Math.random()
      .toString(36)
      .substring(2, 6)}`;

    const { error: insertError } = await supabase.from("events").insert({
      title: title.trim(),
      slug,
      excerpt: cleanExcerpt,
      content: content.trim(),
      emoji,
      start_at: startAt.toISOString(),
      location: location.trim(),
      category,
      photos: photoUrl ? [photoUrl] : [],
      host_id: user.id,
    });

    if (insertError) {
      setStatusMessage(`Event creation failed: ${insertError.message}`);
      setIsSubmitting(false);
      return;
    }

    if (draftId) {
      removeDraft(draftId);
      setDraftId(null);
    }

    window.location.href = "/events";
  }

  return (
    <section className="space-y-8">
      <header className="flex flex-col justify-between gap-4 rounded-lg border border-border/80 bg-card p-5 shadow-sm md:flex-row md:items-end">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Create Event</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Share the full plan, then publish it to the timeline.
          </p>
        </div>
      </header>

      <div className="md:hidden">
        <Tabs value={mobileView} onValueChange={(value) => setMobileView(value as MobileView)}>
          <TabsList className="w-full">
            <TabItem value="edit" label="Edit" />
            <TabItem value="preview" label="Preview" />
          </TabsList>
        </Tabs>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <form
          onSubmit={onSubmit}
          className={`space-y-6 rounded-lg border border-border/80 bg-card p-5 shadow-sm ${mobileView === "preview" ? "hidden md:block" : "block"}`}
        >
          <div className="flex items-start gap-4">
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    title="Pick an event emoji"
                    className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-3xl transition-colors hover:bg-muted"
                  >
                    {emoji}
                  </button>
                }
              />
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <EmojiPicker
                  width={320}
                  onEmojiClick={(entry) => {
                    setEmoji(entry.emoji);
                    setShowEmojiPicker(false);
                  }}
                />
              </PopoverContent>
            </Popover>

            <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium">
              <div className="flex items-center justify-between">
                <span>Event title</span>
                <span className={`text-xs ${title.length > 100 ? "text-destructive" : "text-muted-foreground"}`}>
                  {title.length} / 100
                </span>
              </div>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Team Offsite: Product + Design"
                maxLength={100}
                required
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Category
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as EventCategory)}
                name="category"
                required
              >
                <SelectTrigger className="w-full" placeholder="Choose category" />
                <SelectContent>
                  {eventCategoryOptions.map((item, index) => (
                    <SelectItem key={item} index={index} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Location
              <div className="relative">
                <MapPin
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <Input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Innovation Lab, Block C"
                  className="pl-8"
                  required
                />
              </div>
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            <div className="flex items-center justify-between">
              <span>Short description / Tagline</span>
              <span className={`text-xs ${excerpt.length > 180 ? "text-destructive" : "text-muted-foreground"}`}>
                {excerpt.length} / 180
              </span>
            </div>
            <Input
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="A crisp one-line summary for event cards"
              maxLength={180}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            <div className="flex items-center justify-between">
              <span>Full Description</span>
              <span className={`text-xs ${content.length > 5000 ? "text-destructive" : "text-muted-foreground"}`}>
                {content.length} / 5000
              </span>
            </div>
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder={"## Event Overview\n\nWhat should people know?"}
              rows={12}
              maxLength={5000}
              required
            />
          </label>

          <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground">Schedule</h3>
              <span className="text-xs text-muted-foreground">Local time</span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarBlank size={16} />
                  Event date
                </span>
                <DatePicker value={eventDate} onChange={setEventDate} />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={16} />
                  Event time
                </span>
                <TimePicker value={eventTime} onChange={setEventTime} />
              </label>
            </div>
          </div>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            <span className="inline-flex items-center gap-1.5">
              <ImageIcon size={16} />
              Optional image
            </span>
            <Input type="file" accept="image/*" onChange={onImageChange} />
          </label>
          <p className={`text-xs ${imageError ? "text-destructive" : "text-muted-foreground"}`}>
            {imageFile && !imageError ? `${imageFile.name} ready to upload.` : imageHint}
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            {statusMessage ? <p className="text-sm text-muted-foreground">{statusMessage}</p> : <span />}
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              loading={isSubmitting}
              className="w-full sm:w-auto"
            >
              Publish Event
            </Button>
          </div>
        </form>

        <aside className={`sticky top-24 space-y-4 rounded-lg border border-border/80 bg-card p-5 shadow-sm ${mobileView === "edit" ? "hidden md:block" : "block"}`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Live Preview</h2>
            <span className="text-2xl leading-none" aria-hidden="true">
              {emoji}
            </span>
          </div>
          <div>
            <p className="text-lg font-semibold leading-tight text-foreground">
              {title || "Untitled event"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {location || "Location to be announced"} - {category}
            </p>
            {previewSchedule ? (
              <p className="mt-2 text-sm font-medium text-foreground/80">
                {previewSchedule}
              </p>
            ) : null}
          </div>
          <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-a:text-foreground">
            {content.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            ) : (
              <p className="text-sm text-muted-foreground">
                Add an event overview to preview it here.
              </p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
