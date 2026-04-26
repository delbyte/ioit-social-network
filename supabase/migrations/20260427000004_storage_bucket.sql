-- Create event-photos storage bucket (publicly readable)
insert into storage.buckets (id, name, public)
values ('event-photos', 'event-photos', true);

-- Allow authenticated users to upload to event-photos bucket
create policy "Authenticated users upload event photos"
  on storage.objects for insert
  with check (
    bucket_id = 'event-photos'
    and auth.role() = 'authenticated'
  );

-- Allow public read access to event photos
create policy "Public read event photos"
  on storage.objects for select
  using (bucket_id = 'event-photos');

-- Allow users to delete their own uploads (folder = user id)
create policy "Users delete own event photos"
  on storage.objects for delete
  using (
    bucket_id = 'event-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
