-- =============================================
-- BasiQ Platform — Supabase Schema
-- Run this in Supabase SQL editor
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- ADMINS
-- =============================================
create table admins (
  id          uuid primary key default uuid_generate_v4(),
  email       text unique not null,
  password_hash text not null,
  name        text not null,
  totp_secret text,
  totp_enabled boolean default false,
  created_at  timestamptz default now(),
  last_login  timestamptz
);

-- =============================================
-- CLIENTS
-- =============================================
create table clients (
  id          uuid primary key default uuid_generate_v4(),
  username    text unique not null,
  password_hash text not null,
  name        text not null,
  telegram    text,
  telegram_group text,
  created_by  uuid references admins(id),
  created_at  timestamptz default now(),
  last_login  timestamptz
);

-- =============================================
-- SETUPS
-- =============================================
create table setups (
  id            uuid primary key default uuid_generate_v4(),
  client_id     uuid references clients(id) on delete cascade,
  type          text not null,
  current_step  int default 1,
  action_step   int default 0,
  status        text default 'active' check (status in ('active', 'completed', 'paused', 'cancelled')),
  start_date    date,
  est_date      date,
  notes         text,
  clickup_task_id text,
  created_by    uuid references admins(id),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- =============================================
-- SETUP STEPS LOG (audit trail)
-- =============================================
create table setup_logs (
  id          uuid primary key default uuid_generate_v4(),
  setup_id    uuid references setups(id) on delete cascade,
  admin_id    uuid references admins(id),
  action      text not null,
  old_value   jsonb,
  new_value   jsonb,
  created_at  timestamptz default now()
);

-- =============================================
-- AUTH RATE LIMITING
-- =============================================
create table login_attempts (
  id          uuid primary key default uuid_generate_v4(),
  identifier  text not null,
  ip_address  text,
  success     boolean default false,
  created_at  timestamptz default now()
);

-- =============================================
-- INDEXES
-- =============================================
create index idx_setups_client_id on setups(client_id);
create index idx_setup_logs_setup_id on setup_logs(setup_id);
create index idx_login_attempts_identifier on login_attempts(identifier, created_at);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table admins enable row level security;
alter table clients enable row level security;
alter table setups enable row level security;
alter table setup_logs enable row level security;
alter table login_attempts enable row level security;

-- Only service role can access everything (we use service role key in API routes)
create policy "Service role only" on admins using (auth.role() = 'service_role');
create policy "Service role only" on clients using (auth.role() = 'service_role');
create policy "Service role only" on setups using (auth.role() = 'service_role');
create policy "Service role only" on setup_logs using (auth.role() = 'service_role');
create policy "Service role only" on login_attempts using (auth.role() = 'service_role');

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger setups_updated_at
  before update on setups
  for each row execute function update_updated_at();
