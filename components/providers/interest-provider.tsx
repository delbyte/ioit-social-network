"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { EventPost } from "@/lib/events";
import { buildGoogleCalendarUrl } from "@/lib/calendar";

const STORAGE_KEY = "ioit-interests-v1";

type InterestMap = Record<
  string,
  {
    calendarUrl: string;
    joinedAt: string;
  }
>;

interface ToggleResult {
  interested: boolean;
  calendarUrl: string | null;
}

interface InterestContextValue {
  interestedIds: string[];
  isInterested: (eventId: string) => boolean;
  getCalendarUrl: (eventId: string) => string | null;
  toggleInterested: (event: EventPost) => ToggleResult;
}

const InterestContext = createContext<InterestContextValue | undefined>(
  undefined
);

function parseStoredInterests(rawValue: string | null): InterestMap {
  if (!rawValue) {
    return {};
  }

  try {
    const parsed = JSON.parse(rawValue) as InterestMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function InterestProvider({ children }: { children: ReactNode }) {
  const [interests, setInterests] = useState<InterestMap>(() => {
    if (typeof window === "undefined") {
      return {};
    }

    return parseStoredInterests(window.localStorage.getItem(STORAGE_KEY));
  });
  const interestsRef = useRef<InterestMap>(interests);

  useEffect(() => {
    interestsRef.current = interests;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(interests));
  }, [interests]);

  const toggleInterested = useCallback((event: EventPost): ToggleResult => {
    const current = interestsRef.current;

    if (current[event.id]) {
      const next = { ...current };
      delete next[event.id];
      interestsRef.current = next;
      setInterests(next);

      return { interested: false, calendarUrl: null };
    }

    const calendarUrl = buildGoogleCalendarUrl(event);
    const next = {
      ...current,
      [event.id]: {
        calendarUrl,
        joinedAt: new Date().toISOString(),
      },
    };

    interestsRef.current = next;
    setInterests(next);

    return { interested: true, calendarUrl };
  }, []);

  const value = useMemo<InterestContextValue>(
    () => ({
      interestedIds: Object.keys(interests),
      isInterested: (eventId: string) => Boolean(interests[eventId]),
      getCalendarUrl: (eventId: string) => interests[eventId]?.calendarUrl ?? null,
      toggleInterested,
    }),
    [interests, toggleInterested]
  );

  return (
    <InterestContext.Provider value={value}>{children}</InterestContext.Provider>
  );
}

export function useInterestState(): InterestContextValue {
  const context = useContext(InterestContext);

  if (!context) {
    throw new Error("useInterestState must be used inside InterestProvider");
  }

  return context;
}
