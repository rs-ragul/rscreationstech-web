alter table public.site_stats
  add column if not exists apps_label text not null default 'Apps Published',
  add column if not exists projects_label text not null default 'Projects Built',
  add column if not exists users_label text not null default 'Active Users',
  add column if not exists apps_suffix text not null default '+',
  add column if not exists projects_suffix text not null default '+',
  add column if not exists users_suffix text not null default '+';
