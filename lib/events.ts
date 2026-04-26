export type EventCategory =
  | "Technology"
  | "Business"
  | "Wellness"
  | "Networking"
  | "Arts"
  | "Environmental"
  | "Sports"
  | "Community";

export type ImageVariant = "sunset" | "lagoon" | "ember" | "none";

export interface EventPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  markdown: string;
  startAt: string;
  endAt: string;
  location: string;
  hostName: string;
  hostId: string;
  category: EventCategory;
  interestCount: number;
  imageVariant: ImageVariant;
}

export const currentUser = {
  id: "user-arnav",
  name: "Arnav Mehta",
  handle: "@arnav",
  bio: "Building event-first communities one meetup at a time.",
};

export const eventPosts: EventPost[] = [
  {
    id: "evt-001",
    slug: "react-conf-2026",
    title: "React Conference 2026",
    excerpt:
      "Annual React developer conference with keynotes, workshops, and deep technical tracks.",
    markdown:
      "# React Conference 2026\n\nJoin us for a full day of React talks and workshops.\n\n## Tracks\n- React performance\n- Full-stack architecture\n- Design systems at scale\n\nBring your laptop for the hands-on labs.",
    startAt: "2026-05-15T09:00:00-07:00",
    endAt: "2026-05-15T17:00:00-07:00",
    location: "San Francisco, CA",
    hostName: "Sarah Chen",
    hostId: "user-sarah",
    category: "Technology",
    interestCount: 284,
    imageVariant: "sunset",
  },
  {
    id: "evt-002",
    slug: "startup-pitch-night-may",
    title: "Startup Pitch Night",
    excerpt: "Ten early startups pitch live to founders, investors, and makers.",
    markdown:
      "# Startup Pitch Night\n\nAn evening of high-energy demos and focused networking.\n\n## Format\n1. Five-minute startup pitches\n2. Live Q and A with judges\n3. Open networking",
    startAt: "2026-05-22T18:00:00-04:00",
    endAt: "2026-05-22T21:00:00-04:00",
    location: "New York, NY",
    hostName: "Marcus Thompson",
    hostId: "user-marcus",
    category: "Business",
    interestCount: 157,
    imageVariant: "ember",
  },
  {
    id: "evt-003",
    slug: "sunrise-yoga-june",
    title: "Sunrise Yoga in the Park",
    excerpt: "Outdoor guided flow session with a beginner-friendly pacing.",
    markdown:
      "# Sunrise Yoga\n\nStart your week with a calm vinyasa session.\n\n- Bring a mat\n- Bring water\n- All levels welcome",
    startAt: "2026-06-01T06:30:00-04:00",
    endAt: "2026-06-01T07:30:00-04:00",
    location: "Central Park, New York, NY",
    hostName: "Elena Rodriguez",
    hostId: "user-elena",
    category: "Wellness",
    interestCount: 92,
    imageVariant: "none",
  },
  {
    id: "evt-004",
    slug: "ux-workshop-june",
    title: "UX and UI Systems Workshop",
    excerpt:
      "Hands-on workshop on Figma prototyping, accessibility, and scalable component libraries.",
    markdown:
      "# UX and UI Systems Workshop\n\nA practical workshop for product teams.\n\n## You will practice\n- UX research framing\n- Component architecture\n- Accessibility reviews",
    startAt: "2026-06-10T10:00:00-04:00",
    endAt: "2026-06-10T13:00:00-04:00",
    location: "Brooklyn, NY",
    hostName: "James Hartley",
    hostId: "user-james",
    category: "Technology",
    interestCount: 203,
    imageVariant: "lagoon",
  },
  {
    id: "evt-005",
    slug: "seattle-tech-coffee-june",
    title: "Tech Coffee Meetup",
    excerpt: "Casual coffee networking for engineers, designers, and PMs.",
    markdown:
      "# Tech Coffee Meetup\n\nDrop in, meet local builders, and share what you are shipping this month.",
    startAt: "2026-06-15T08:00:00-07:00",
    endAt: "2026-06-15T09:30:00-07:00",
    location: "Seattle, WA",
    hostName: "Arnav Mehta",
    hostId: "user-arnav",
    category: "Networking",
    interestCount: 45,
    imageVariant: "none",
  },
  {
    id: "evt-006",
    slug: "indie-music-festival-july",
    title: "Indie Music Festival 2026",
    excerpt: "A full-day festival with three stages and local food vendors.",
    markdown:
      "# Indie Music Festival\n\nTwelve hours of independent music and art installations across three stages.",
    startAt: "2026-07-18T12:00:00-07:00",
    endAt: "2026-07-18T23:00:00-07:00",
    location: "Los Angeles, CA",
    hostName: "Priya Patel",
    hostId: "user-priya",
    category: "Arts",
    interestCount: 512,
    imageVariant: "sunset",
  },
  {
    id: "evt-007",
    slug: "python-bootcamp-aug",
    title: "Python for Data Science Bootcamp",
    excerpt:
      "Two-week intensive on Python, pandas, and production-ready ML workflows.",
    markdown:
      "# Python for Data Science Bootcamp\n\nA guided two-week bootcamp for aspiring data practitioners.\n\nIncludes capstone reviews and hiring prep.",
    startAt: "2026-08-05T09:00:00+00:00",
    endAt: "2026-08-16T17:00:00+00:00",
    location: "Online and Hybrid",
    hostName: "Dr. Raj Gupta",
    hostId: "user-raj",
    category: "Technology",
    interestCount: 387,
    imageVariant: "lagoon",
  },
  {
    id: "evt-008",
    slug: "climate-summit-april",
    title: "Climate Action Summit",
    excerpt: "Panels and workshops on practical sustainability outcomes.",
    markdown:
      "# Climate Action Summit\n\nThis summit concluded with 12 workshops and policy roundtables.",
    startAt: "2026-04-12T08:30:00-06:00",
    endAt: "2026-04-12T18:00:00-06:00",
    location: "Denver, CO",
    hostName: "Michael Zhang",
    hostId: "user-michael",
    category: "Environmental",
    interestCount: 418,
    imageVariant: "ember",
  },
  {
    id: "evt-009",
    slug: "contemporary-art-showcase",
    title: "Contemporary Art Showcase",
    excerpt: "Emerging artists present multi-format installations.",
    markdown:
      "# Contemporary Art Showcase\n\nA gallery night focused on new voices and experimental formats.",
    startAt: "2026-03-28T18:00:00-05:00",
    endAt: "2026-03-28T22:00:00-05:00",
    location: "Chicago, IL",
    hostName: "Sofia Moretti",
    hostId: "user-sofia",
    category: "Arts",
    interestCount: 134,
    imageVariant: "sunset",
  },
  {
    id: "evt-010",
    slug: "city-marathon-2026",
    title: "City Marathon 2026",
    excerpt: "A 26.2-mile race through historic city neighborhoods.",
    markdown:
      "# City Marathon 2026\n\nCongratulations to all runners and volunteers who made this event happen.",
    startAt: "2026-04-19T07:00:00-04:00",
    endAt: "2026-04-19T14:00:00-04:00",
    location: "Boston, MA",
    hostName: "Coach Nina Park",
    hostId: "user-nina",
    category: "Sports",
    interestCount: 876,
    imageVariant: "ember",
  },
  {
    id: "evt-011",
    slug: "hackathon-weekend-april",
    title: "36-Hour Hackathon",
    excerpt: "Build, ship, and present in a rapid collaboration sprint.",
    markdown:
      "# 36-Hour Hackathon\n\nA weekend sprint for engineers, designers, and product thinkers.",
    startAt: "2026-04-10T18:00:00-05:00",
    endAt: "2026-04-12T06:00:00-05:00",
    location: "Austin, TX",
    hostName: "Arnav Mehta",
    hostId: "user-arnav",
    category: "Technology",
    interestCount: 203,
    imageVariant: "none",
  },
  {
    id: "evt-012",
    slug: "book-club-classics-april",
    title: "Classic Literature Book Club",
    excerpt: "Monthly reading discussion with guided prompts.",
    markdown:
      "# Classic Literature Book Club\n\nThis month we discuss *Jane Eyre* and themes of autonomy and identity.",
    startAt: "2026-04-24T19:00:00-07:00",
    endAt: "2026-04-24T20:30:00-07:00",
    location: "Portland, OR",
    hostName: "Rebecca Holmes",
    hostId: "user-rebecca",
    category: "Community",
    interestCount: 67,
    imageVariant: "none",
  },
];

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
  return new Date(event.endAt).getTime() < now;
}

export function sortEventsByDate(events: EventPost[]): EventPost[] {
  return [...events].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  );
}

export function sortEventsByInterest(events: EventPost[]): EventPost[] {
  return [...events].sort((a, b) => b.interestCount - a.interestCount);
}
