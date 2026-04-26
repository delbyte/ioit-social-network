-- Create event_interested junction table
create table public.event_interested (
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (event_id, user_id)
);

-- Index for counting interested users per event
create index event_interested_event_id_idx on public.event_interested (event_id);
create index event_interested_user_id_idx on public.event_interested (user_id);

-- Row Level Security
alter table public.event_interested enable row level security;

create policy "Public read interested"
  on public.event_interested for select
  using (true);

create policy "Authenticated users toggle interest"
  on public.event_interested for insert
  with check (auth.uid() = user_id);

create policy "Users remove own interest"
  on public.event_interested for delete
  using (auth.uid() = user_id);
