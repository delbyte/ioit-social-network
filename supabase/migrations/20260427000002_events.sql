-- Create events table
create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text default '',
  content text default '',              -- markdown body
  photos text[] default '{}',           -- array of storage public URLs
  start_at timestamptz not null,
  end_at timestamptz not null,
  location text default '',
  category text not null default 'Community',
  host_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for common queries
create index events_start_at_idx on public.events (start_at);
create index events_host_id_idx on public.events (host_id);
create index events_category_idx on public.events (category);

-- Row Level Security
alter table public.events enable row level security;

create policy "Public read events"
  on public.events for select
  using (true);

create policy "Authenticated users create events"
  on public.events for insert
  with check (auth.uid() = host_id);

create policy "Hosts update own events"
  on public.events for update
  using (auth.uid() = host_id);

create policy "Hosts delete own events"
  on public.events for delete
  using (auth.uid() = host_id);
