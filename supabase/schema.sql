create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  programme text,
  methodology text default 'Hybrid',
  summary text,
  health text default 'amber',
  created_at timestamptz default now()
);

create table if not exists public.delivery_records (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  phase_slug text not null,
  tool_slug text not null,
  type text not null,
  title text not null,
  description text,
  status text default 'open',
  severity text default 'amber',
  owner text,
  created_at timestamptz default now()
);

create table if not exists public.delivery_relationships (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  source_id uuid references public.delivery_records(id) on delete cascade,
  target_id uuid references public.delivery_records(id) on delete cascade,
  relationship_type text not null,
  created_at timestamptz default now()
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  action text not null,
  entity text,
  entity_title text,
  actor text default 'Current User',
  created_at timestamptz default now()
);
