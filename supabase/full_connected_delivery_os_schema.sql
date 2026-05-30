create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  methodology text not null default 'Hybrid',
  summary text,
  health text not null default 'amber',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_phases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  phase_slug text not null,
  phase_number integer not null,
  title text not null,
  status text not null default 'not_started',
  unique(project_id, phase_slug)
);

create table if not exists public.project_tools (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  phase_slug text not null,
  tool_slug text not null,
  title text not null,
  enabled boolean not null default true,
  unique(project_id, phase_slug, tool_slug)
);

create table if not exists public.delivery_objects (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  phase_slug text not null,
  tool_slug text not null,
  object_type text not null,
  title text not null,
  description text,
  status text not null default 'open',
  owner text,
  severity text not null default 'amber',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.delivery_relationships (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  source_object_id uuid references public.delivery_objects(id) on delete cascade,
  target_object_id uuid references public.delivery_objects(id) on delete cascade,
  relationship_type text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.intelligence_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  source_object_id uuid references public.delivery_objects(id) on delete set null,
  event_type text not null,
  title text not null,
  explanation text,
  recommendation text,
  severity text not null default 'amber',
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists public.learning_memory (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  source_event_id uuid references public.intelligence_events(id) on delete set null,
  lesson_type text not null default 'delivery_learning',
  title text not null,
  lesson text not null,
  future_recommendation text,
  recurrence_status text default 'not_checked',
  created_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  event_type text not null,
  object_type text,
  object_id uuid,
  actor text default 'system',
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.rag_snapshots (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  scope_rag text not null default 'green',
  schedule_rag text not null default 'green',
  cost_rag text not null default 'green',
  risk_rag text not null default 'green',
  governance_rag text not null default 'green',
  overall_rag text not null default 'green',
  explanation text,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.project_phases enable row level security;
alter table public.project_tools enable row level security;
alter table public.delivery_objects enable row level security;
alter table public.delivery_relationships enable row level security;
alter table public.intelligence_events enable row level security;
alter table public.learning_memory enable row level security;
alter table public.audit_events enable row level security;
alter table public.rag_snapshots enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array['projects','project_phases','project_tools','delivery_objects','delivery_relationships','intelligence_events','learning_memory','audit_events','rag_snapshots']
  loop
    execute format('drop policy if exists "public read %s" on public.%I', tbl, tbl);
    execute format('create policy "public read %s" on public.%I for select using (true)', tbl, tbl);
    execute format('drop policy if exists "public insert %s" on public.%I', tbl, tbl);
    execute format('create policy "public insert %s" on public.%I for insert with check (true)', tbl, tbl);
    execute format('drop policy if exists "public update %s" on public.%I', tbl, tbl);
    execute format('create policy "public update %s" on public.%I for update using (true)', tbl, tbl);
  end loop;
end $$;
