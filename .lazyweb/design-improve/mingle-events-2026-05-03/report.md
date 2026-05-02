# Mingle Events UI Improve

Date: 2026-05-03

## Current Screens Captured

- `current-discover-desktop.png`
- `current-discover-mobile.png`
- `current-new-event-desktop.png`

## Lazyweb References Used

- `references/github-events-filters.png` - GitHub events/webinars page: desktop event discovery with clear filter groups, sorting, and a featured event area.
- `references/partiful-create-event.png` - Partiful create-event flow: event details, date/location inputs, cover editing, RSVP options, and draft/save controls.
- `references/fever-mobile-discovery.png` - Fever mobile discovery: search, category chips, ranked recommendations, event cards, and bottom tab navigation.

## Improvements Implemented

1. Replaced custom-feeling sort/filter controls with Fluid Functionalism tabs and select primitives.
2. Reworked event cards around fixed media ratios, stable metadata rows, category badges, and safer share behavior.
3. Moved the event composer away from custom calendar behavior and onto native `datetime-local` scheduling inputs.
4. Cleaned the composer empty state so placeholder text, counters, and live preview no longer contradict each other.
5. Fixed mobile navigation spacing and desktop nav overlap by using sticky desktop navigation and a dedicated mobile bottom bar.
6. Replaced raw/custom avatar, buttons, badges, tabs, select, tooltip, and input-group usage with library primitives where available.

## Remaining Design Notes

- The current dataset returned no events, so the screenshots mostly validate empty states and controls. Once seed data exists, recheck event-card density with 6-12 cards.
- The desktop discover screen is intentionally quieter than Eventbrite/Fever. If the app becomes discovery-heavy, add search and quick date chips next.
- The create-event form now mirrors Partiful's two-column edit/preview rhythm, but cover-image editing can still be richer later.
