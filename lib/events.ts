export type EventCategory =
  | "Technology"
  | "Business"
  | "Wellness"
  | "Networking"
  | "Arts"
  | "Environmental"
  | "Sports"
  | "Community";

export interface EventPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  emoji?: string;
  photos: string[];
  start_at: string;
  end_at: string;
  location: string;
  category: EventCategory;
  host_id: string;
  host_name: string;
  interest_count: number;
  created_at: string;
}

export const eventCategoryOptions: EventCategory[] = [
  "Technology",
  "Business",
  "Wellness",
  "Networking",
  "Arts",
  "Environmental",
  "Sports",
  "Community",
];

export function isEventPast(event: EventPost, now = Date.now()): boolean {
  return new Date(event.end_at).getTime() < now;
}

export function sortEventsByDate(events: EventPost[]): EventPost[] {
  return [...events].sort(
    (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime(),
  );
}

export function sortEventsByInterest(events: EventPost[]): EventPost[] {
  return [...events].sort((a, b) => b.interest_count - a.interest_count);
}
