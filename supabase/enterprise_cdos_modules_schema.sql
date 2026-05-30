-- VeloClear Enterprise CDOS Modules
-- Run after full_connected_delivery_os_schema.sql.

create table if not exists public.methodology_packs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  phases jsonb not null default '[]'::jsonb,
  tools jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  id uuid primary key default gen_random_uuid(),
  role_name text not null,
  module text not null,
  can_view boolean not null default true,
  can_edit boolean not null default false,
  can_approve boolean not null default false,
  can_export boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.report_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  audience text not null,
  sections jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.integration_connections (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  status text not null default 'not_connected',
  mapping jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.workflow_ingestions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  source_name text not null,
  source_type text not null default 'manual',
  extracted_workflow jsonb not null default '{}'::jsonb,
  generated_backlog jsonb not null default '[]'::jsonb,
  generated_risks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.methodology_packs enable row level security;
alter table public.role_permissions enable row level security;
alter table public.report_templates enable row level security;
alter table public.integration_connections enable row level security;
alter table public.workflow_ingestions enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array['methodology_packs','role_permissions','report_templates','integration_connections','workflow_ingestions']
  loop
    execute format('drop policy if exists "public read %s" on public.%I', tbl, tbl);
    execute format('create policy "public read %s" on public.%I for select using (true)', tbl, tbl);
    execute format('drop policy if exists "public insert %s" on public.%I', tbl, tbl);
    execute format('create policy "public insert %s" on public.%I for insert with check (true)', tbl, tbl);
    execute format('drop policy if exists "public update %s" on public.%I', tbl, tbl);
    execute format('create policy "public update %s" on public.%I for update using (true)', tbl, tbl);
  end loop;
end $$;
