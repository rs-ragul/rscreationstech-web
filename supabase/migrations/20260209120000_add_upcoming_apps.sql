alter table public.apps
add column if not exists is_upcoming boolean default false,
add column if not exists release_at timestamptz;

update public.apps
set is_upcoming = false
where is_upcoming is null;
