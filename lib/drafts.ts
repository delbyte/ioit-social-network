import type { EventCategory } from "@/lib/events";

export const DRAFT_STORAGE_KEY = "ioit-event-drafts-v1";

export interface EventDraft {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  location: string;
  category: EventCategory;
  emoji: string;
  eventDate: string;
  eventTime: string;
  createdAt: string;
  updatedAt: string;
}

export function readDrafts(): EventDraft[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as EventDraft[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeDrafts(drafts: EventDraft[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
}

export function upsertDraft(draft: EventDraft): EventDraft[] {
  const drafts = readDrafts();
  const index = drafts.findIndex((item) => item.id === draft.id);

  if (index === -1) {
    const next = [draft, ...drafts];
    writeDrafts(next);
    return next;
  }

  const next = [...drafts];
  next[index] = draft;
  writeDrafts(next);
  return next;
}

export function removeDraft(id: string): EventDraft[] {
  const drafts = readDrafts();
  const next = drafts.filter((draft) => draft.id !== id);
  writeDrafts(next);
  return next;
}
