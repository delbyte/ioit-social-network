-- Remove end_at; events are start-only
alter table public.events drop column end_at;
