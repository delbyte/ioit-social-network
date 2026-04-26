"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import EmojiPicker from "emoji-picker-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { createClient } from "@/lib/supabase/client";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

type MobileView = "edit" | "preview";

export function NewEventComposer() {
  const [emoji, setEmoji] = useState("📝");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("## Event Overview\n\nWhat should people know?");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [mobileView, setMobileView] = useState<MobileView>("edit");
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const hasScheduleError =
    eventStart !== "" && eventEnd !== "" && new Date(eventEnd) <= new Date(eventStart);

  const canSubmit =
    title.trim().length >= 5 &&
    title.trim().length <= 100 &&
    content.trim().length >= 20 &&
    content.trim().length <= 5000 &&
    !hasScheduleError;

  const imageHint = useMemo(
    () =>
      imageError
        ? imageError
        : "Optional image only. JPG, PNG, or WEBP. Maximum 2 MB. No videos.",
    [imageError]
  );

  function onImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setImageError(null);
      setImageFile(null);
      return;
    }

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
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

  async function onSubmit() {
    if (!canSubmit) {
      return;
    }

    setStatusMessage("Creating event...");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatusMessage("You must be logged in to create an event.");
      return;
    }

    let photoUrl = "";

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("event-photos")
        .upload(fileName, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setStatusMessage(`Upload failed: ${uploadError.message}`);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("event-photos")
        .getPublicUrl(fileName);

      photoUrl = publicUrlData.publicUrl;
    }

    const { error: insertError } = await supabase.from("events").insert({
      title,
      slug:
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "") +
        "-" +
        Math.random().toString(36).substring(2, 6),
      content,
      emoji,
      start_at: new Date(eventStart).toISOString(),
      end_at: new Date(eventEnd).toISOString(),
      photos: photoUrl ? [photoUrl] : [],
      host_id: user.id,
    });

    if (insertError) {
      setStatusMessage(`Event creation failed: ${insertError.message}`);
      return;
    }

    window.location.href = "/events";
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Create Event</h1>
        <p className="text-sm text-muted-foreground">
          Event-only composer with markdown, scheduling, and strict media limits.
        </p>
      </header>

      {/* Mobile Toggle */}
      <div className="md:hidden flex p-1 mb-4 rounded-md bg-muted">
        <button
          className={`flex-1 py-1.5 text-sm font-medium rounded-sm transition-all ${
            mobileView === "edit" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
          }`}
          onClick={() => setMobileView("edit")}
        >
          Edit
        </button>
        <button
          className={`flex-1 py-1.5 text-sm font-medium rounded-sm transition-all ${
            mobileView === "preview" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
          }`}
          onClick={() => setMobileView("preview")}
        >
          Preview
        </button>
      </div>

      <div className="grid md:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] gap-6 xl:gap-8 items-start">
        <div className={`space-y-6 md:p-2 ${mobileView === "preview" ? "hidden md:block" : "block"}`}>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  type="button"
                  title="Pick an emotional icon"
                  className="flex h-14 w-14 items-center justify-center rounded-md border text-3xl hover:bg-muted/50 transition-colors"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                >
                  {emoji}
                </button>
                {showEmojiPicker && (
                  <div className="absolute top-16 left-0 z-50 shadow-xl">
                    <EmojiPicker
                      onEmojiClick={(e) => {
                        setEmoji(e.emoji);
                        setShowEmojiPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
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
                />
              </div>
            </div>

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
              rows={12}
              maxLength={5000}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Start
              <Input
                type="datetime-local"
                value={eventStart}
                onChange={(event) => setEventStart(event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              End
              <Input
                type="datetime-local"
                value={eventEnd}
                onChange={(event) => setEventEnd(event.target.value)}
              />
            </label>
          </div>

          {hasScheduleError ? (
            <p className="text-sm font-medium text-destructive">
              End time must be later than start time.
            </p>
          ) : null}

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Optional image
            <Input type="file" accept="image/*" onChange={onImageChange} />
          </label>
          <p className="text-xs text-muted-foreground">{imageHint}</p>

          <div className="pt-2">
            <Button disabled={!canSubmit} onClick={onSubmit} className="w-full sm:w-auto">
              Save Draft
            </Button>
          </div>

          {statusMessage ? <p className="text-sm text-muted-foreground">{statusMessage}</p> : null}
        </div>

        <aside className={`space-y-6 sticky top-20 md:p-2 ${mobileView === "edit" ? "hidden md:block" : "block"}`}>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Live Preview</h2>
          <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </aside>
      </div>
    </section>
  );
}
