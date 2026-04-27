-- =============================================================================
-- Celebr8 — Initial database migration
-- Tables, enums, indexes, triggers and RLS policies for the production app.
-- Run with: supabase db push   (after `supabase link`)
-- =============================================================================

-- Extensions ------------------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Enums -----------------------------------------------------------------------
do $$ begin
  create type event_status as enum ('draft','published','archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type rsvp_status as enum ('pending','accepted','maybe','declined');
exception when duplicate_object then null; end $$;

do $$ begin
  create type plan_key as enum ('free','starter','premium','family','corporate');
exception when duplicate_object then null; end $$;

do $$ begin
  create type template_category as enum ('wedding','birthday','housewarming','baby','festival','corporate');
exception when duplicate_object then null; end $$;

-- Profiles linked to Supabase auth.users --------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text not null,
  phone text,
  country text default 'US',
  default_language text default 'en' check (default_language in ('en','te','hi')),
  timezone text default 'America/New_York',
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Templates -------------------------------------------------------------------
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category template_category not null,
  base_layout text not null,
  is_premium boolean default false,
  supports_photo boolean default false,
  supported_languages text[] default array['en','te','hi'],
  thumbnail_url text,
  preview_image_url text,
  config jsonb not null default '{}'::jsonb,
  default_copy jsonb not null default '{}'::jsonb,
  status text default 'active' check (status in ('active','hidden','draft')),
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Plans -----------------------------------------------------------------------
create table if not exists public.plans (
  key plan_key primary key,
  name text not null,
  price_usd numeric(10,2) default 0,
  max_events int,
  max_guests_per_event int,
  premium_templates boolean default false,
  remove_watermark boolean default false,
  csv_import boolean default false,
  rsvp_dashboard boolean default false,
  stripe_price_id text
);

-- Subscriptions ---------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan plan_key not null default 'free',
  status text not null default 'active',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Events ----------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  template_id uuid references public.templates(id),
  title text not null,
  category template_category not null,
  status event_status default 'draft',
  invite_code text unique not null default encode(gen_random_bytes(8), 'hex'),
  default_language text default 'en' check (default_language in ('en','te','hi')),
  event_date date,
  event_time time,
  timezone text default 'America/New_York',
  venue_name text,
  venue_address text,
  map_url text,
  rsvp_deadline timestamptz,
  is_watermark_removed boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.event_content (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  language text not null check (language in ('en','te','hi')),
  host_names text,
  headline text,
  message text,
  custom_fields jsonb default '{}'::jsonb,
  photo_url text,
  unique(event_id, language)
);

-- Guests ----------------------------------------------------------------------
create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  guest_group text default 'family',
  preferred_language text default 'en' check (preferred_language in ('en','te','hi')),
  invite_code text unique not null default encode(gen_random_bytes(8), 'hex'),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RSVPs -----------------------------------------------------------------------
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  guest_id uuid references public.guests(id) on delete set null,
  guest_name text not null,
  status rsvp_status not null,
  plus_ones int default 0 check (plus_ones >= 0),
  message text,
  dietary_preference text,
  submitted_at timestamptz default now(),
  unique(event_id, guest_id)
);

-- Invite opens (analytics) ----------------------------------------------------
create table if not exists public.invite_opens (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  guest_id uuid references public.guests(id) on delete set null,
  invite_code text,
  user_agent text,
  ip_hash text,
  opened_at timestamptz default now()
);

-- Payments --------------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  plan plan_key,
  amount numeric(10,2),
  currency text default 'usd',
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Audit logs ------------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Indexes ---------------------------------------------------------------------
create index if not exists idx_templates_category on public.templates(category);
create index if not exists idx_templates_status on public.templates(status);
create index if not exists idx_events_user_id on public.events(user_id);
create index if not exists idx_events_invite_code on public.events(invite_code);
create index if not exists idx_event_content_event_id on public.event_content(event_id);
create index if not exists idx_guests_event_id on public.guests(event_id);
create index if not exists idx_guests_invite_code on public.guests(invite_code);
create index if not exists idx_rsvps_event_id on public.rsvps(event_id);
create index if not exists idx_invite_opens_event_id on public.invite_opens(event_id);
create index if not exists idx_payments_user_id on public.payments(user_id);
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);

-- updated_at trigger ----------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_events_updated on public.events;
create trigger trg_events_updated before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists trg_guests_updated on public.guests;
create trigger trg_guests_updated before update on public.guests
for each row execute function public.set_updated_at();

drop trigger if exists trg_subscriptions_updated on public.subscriptions;
create trigger trg_subscriptions_updated before update on public.subscriptions
for each row execute function public.set_updated_at();

-- Auto-create profile on auth signup -----------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;

  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'active')
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists trg_auth_user_created on auth.users;
create trigger trg_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
alter table public.profiles        enable row level security;
alter table public.events          enable row level security;
alter table public.event_content   enable row level security;
alter table public.guests          enable row level security;
alter table public.rsvps           enable row level security;
alter table public.invite_opens    enable row level security;
alter table public.payments        enable row level security;
alter table public.subscriptions   enable row level security;
alter table public.audit_logs      enable row level security;
alter table public.templates       enable row level security;
alter table public.plans           enable row level security;

-- Templates and plans are publicly readable -----------------------------------
drop policy if exists "templates_public_read" on public.templates;
create policy "templates_public_read" on public.templates
  for select using (status = 'active');

drop policy if exists "plans_public_read" on public.plans;
create policy "plans_public_read" on public.plans
  for select using (true);

-- Profiles --------------------------------------------------------------------
drop policy if exists "profiles_self_read" on public.profiles;
create policy "profiles_self_read" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_self_upsert" on public.profiles;
create policy "profiles_self_upsert" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Events ----------------------------------------------------------------------
drop policy if exists "events_owner_select" on public.events;
create policy "events_owner_select" on public.events
  for select using (auth.uid() = user_id);

drop policy if exists "events_owner_insert" on public.events;
create policy "events_owner_insert" on public.events
  for insert with check (auth.uid() = user_id);

drop policy if exists "events_owner_update" on public.events;
create policy "events_owner_update" on public.events
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "events_owner_delete" on public.events;
create policy "events_owner_delete" on public.events
  for delete using (auth.uid() = user_id);

-- Event content (owner via parent event) --------------------------------------
drop policy if exists "event_content_owner_all" on public.event_content;
create policy "event_content_owner_all" on public.event_content
  for all using (
    exists (
      select 1 from public.events e
      where e.id = event_content.event_id and e.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.events e
      where e.id = event_content.event_id and e.user_id = auth.uid()
    )
  );

-- Guests ----------------------------------------------------------------------
drop policy if exists "guests_owner_all" on public.guests;
create policy "guests_owner_all" on public.guests
  for all using (
    exists (
      select 1 from public.events e
      where e.id = guests.event_id and e.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.events e
      where e.id = guests.event_id and e.user_id = auth.uid()
    )
  );

-- RSVPs (owner can read; submission goes via server route with service role) -
drop policy if exists "rsvps_owner_select" on public.rsvps;
create policy "rsvps_owner_select" on public.rsvps
  for select using (
    exists (
      select 1 from public.events e
      where e.id = rsvps.event_id and e.user_id = auth.uid()
    )
  );

-- Invite opens (owner only) ---------------------------------------------------
drop policy if exists "invite_opens_owner_select" on public.invite_opens;
create policy "invite_opens_owner_select" on public.invite_opens
  for select using (
    exists (
      select 1 from public.events e
      where e.id = invite_opens.event_id and e.user_id = auth.uid()
    )
  );

-- Subscriptions (self read) ---------------------------------------------------
drop policy if exists "subscriptions_self_select" on public.subscriptions;
create policy "subscriptions_self_select" on public.subscriptions
  for select using (auth.uid() = user_id);

-- Payments (self read) --------------------------------------------------------
drop policy if exists "payments_self_select" on public.payments;
create policy "payments_self_select" on public.payments
  for select using (auth.uid() = user_id);

-- Audit logs (no client read; service role only) ------------------------------
-- Intentionally no policy → only service role can read/write.

-- Storage buckets -------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('event-photos', 'event-photos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('template-assets', 'template-assets', true)
on conflict (id) do nothing;
