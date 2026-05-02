"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  CalendarBlank,
  Image as ImageIcon,
  MapPin,
  Sparkle,
} from "@phosphor-icons/react";
import EmojiPicker from "emoji-picker-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { TabItem, Tabs, TabsList } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import type { EventCategory } from "@/lib/events";
import { eventCategoryOptions } from "@/lib/events";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const DEFAULT_EMOJI = "\u{1F4DD}";

type MobileView = "edit" | "preview";

export function NewEventComposer() {
  const [emoji, setEmoji] = useState(DEFAULT_EMOJI);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<EventCategory>("Community");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [mobileView, setMobileView] = useState<MobileView>("edit");
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasScheduleError =
    eventStart !== "" && eventEnd !== "" && new Date(eventEnd) <= new Date(eventStart);

  const canSubmit =
    title.trim().length >= 5 &&
    title.trim().length <= 100 &&
    excerpt.trim().length <= 180 &&
    content.trim().length >= 20 &&
    content.trim().length <= 5000 &&
    location.trim().length >= 2 &&
    eventStart !== "" &&
    eventEnd !== "" &&
    !hasScheduleError;

  const imageHint = useMemo(
    () =>
      imageError
        ? imageError
        : "Optional image only. JPG, PNG, or WEBP. Maximum 2 MB. No videos.",
    [imageError],
  );

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
    setStatusMessage("Creating event...");

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

    const { error: insertError } = await supabase.from("events").insert({
      title: title.trim(),
      slug:
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "") +
        "-" +
        Math.random().toString(36).substring(2, 6),
      excerpt: cleanExcerpt,
      content: content.trim(),
      emoji,
      start_at: new Date(eventStart).toISOString(),
      end_at: new Date(eventEnd).toISOString(),
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

    window.location.href = "/events";
  }

  return (
    <section className="space-y-8">
      <header className="flex flex-col justify-between gap-4 rounded-lg border border-border/80 bg-card p-5 shadow-sm md:flex-row md:items-end">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Create Event</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Put the essential details in one calm place.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <Sparkle size={14} />
          Draft mode
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
              <span>Short description</span>
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
              <span>Markdown content</span>
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

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              <span className="inline-flex items-center gap-1.5">
                <CalendarBlank size={16} />
                Start
              </span>
              <Input
                type="datetime-local"
                value={eventStart}
                onChange={(event) => setEventStart(event.target.value)}
                required
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              <span className="inline-flex items-center gap-1.5">
                <CalendarBlank size={16} />
                End
              </span>
              <Input
                type="datetime-local"
                value={eventEnd}
                onChange={(event) => setEventEnd(event.target.value)}
                required
              />
            </label>
          </div>

          {hasScheduleError ? (
            <p className="text-sm font-medium text-destructive">
              End time must be later than start time.
            </p>
          ) : null}

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
              Create Event
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
