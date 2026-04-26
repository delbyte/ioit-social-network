"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

export function NewEventComposer() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("## Event Overview\n\nWhat should people know?");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const hasScheduleError =
    eventStart !== "" && eventEnd !== "" && new Date(eventEnd) <= new Date(eventStart);

  const canSubmit =
    title.trim().length >= 5 && content.trim().length >= 20 && !hasScheduleError;

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
      return;
    }

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      setImageError("Only image uploads are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image exceeds the 2 MB limit.");
      event.target.value = "";
      return;
    }

    setImageError(null);
  }

  function onSubmit() {
    if (!canSubmit) {
      return;
    }

    setStatusMessage(
      "Composer UI is ready. Backend create flow will be wired next with validation and quotas."
    );
  }

  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <h1 className="page-title">Create Event</h1>
        <p className="page-subtitle">
          Event-only composer with markdown, scheduling, and strict media limits.
        </p>
      </header>

      <div className="composer-grid">
        <div className="card-surface space-y-4">
          <label className="field-label">
            Event title
            <input
              className="text-field"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Team Offsite: Product + Design"
            />
          </label>

          <label className="field-label">
            Markdown content
            <textarea
              className="text-area"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={12}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="field-label">
              Start
              <input
                className="text-field"
                type="datetime-local"
                value={eventStart}
                onChange={(event) => setEventStart(event.target.value)}
              />
            </label>
            <label className="field-label">
              End
              <input
                className="text-field"
                type="datetime-local"
                value={eventEnd}
                onChange={(event) => setEventEnd(event.target.value)}
              />
            </label>
          </div>

          {hasScheduleError ? (
            <p className="text-sm text-[var(--danger)]">
              End time must be later than start time.
            </p>
          ) : null}

          <label className="field-label">
            Optional image
            <input className="text-field" type="file" accept="image/*" onChange={onImageChange} />
          </label>
          <p className="text-xs text-[var(--text-muted)]">{imageHint}</p>

          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-primary" disabled={!canSubmit} onClick={onSubmit}>
              Save Draft
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowPreview((value) => !value)}
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
          </div>

          {statusMessage ? <p className="text-sm text-[var(--text-muted)]">{statusMessage}</p> : null}
        </div>

        <aside className="card-surface space-y-3">
          <h2 className="section-title">Live Preview</h2>
          {showPreview ? (
            <div className="markdown-preview">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">
              Enable preview to inspect markdown formatting before publishing.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}
