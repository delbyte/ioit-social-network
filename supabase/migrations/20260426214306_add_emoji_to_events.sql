-- Add emoji column to events table
ALTER TABLE public.events ADD COLUMN emoji text DEFAULT '📝' NOT NULL;
