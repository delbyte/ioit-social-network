-- Add about column
alter table public.profiles
add column about varchar(500) default '';
