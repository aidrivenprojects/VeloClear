create table if not exists public.delivery_objects (
  id uuid primary key default gen_random_uuid(),
  project_id text not null,
  phase_slug text not null,
  tool_slug text not null,
  object_type text not null,
  title text not null,
  description text,
  status text not null default 'open',
  owner text,
  severity text default 'medium',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.delivery_relationships (
  id uuid primary key default gen_random_uuid(),
  project_id text not null,
  source_object_id uuid references public.delivery_objects(id) on delete cascade,
  target_object_id uuid references public.delivery_objects(id) on delete cascade,
  relationship_type text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.intelligence_events (
  id uuid primary key default gen_random_uuid(),
  project_id text not null,
  source_object_id uuid references public.delivery_objects(id) on delete set null,
  event_type text not null,
  title text not null,
  explanation text,
  recommendation text,
  severity text not null default 'medium',
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists public.learning_memory (
  id uuid primary key default gen_random_uuid(),
  project_id text not null,
  source_event_id uuid references public.intelligence_events(id) on delete set null,
  lesson_type text not null,
  title text not null,
  lesson text not null,
  future_recommendation text,
  recurrence_status text default 'not_checked',
  created_at timestamptz not null default now()
);

alter table public.delivery_objects enable row level security;
alter table public.delivery_relationships enable row level security;
alter table public.intelligence_events enable row level security;
alter table public.learning_memory enable row level security;

drop policy if exists "public read delivery_objects" on public.delivery_objects;
create policy "public read delivery_objects" on public.delivery_objects for select using (true);
drop policy if exists "public insert delivery_objects" on public.delivery_objects;
create policy "public insert delivery_objects" on public.delivery_objects for insert with check (true);

drop policy if exists "public read delivery_relationships" on public.delivery_relationships;
create policy "public read delivery_relationships" on public.delivery_relationships for select using (true);
drop policy if exists "public insert delivery_relationships" on public.delivery_relationships;
create policy "public insert delivery_relationships" on public.delivery_relationships for insert with check (true);

drop policy if exists "public read intelligence_events" on public.intelligence_events;
create policy "public read intelligence_events" on public.intelligence_events for select using (true);
drop policy if exists "public insert intelligence_events" on public.intelligence_events;
create policy "public insert intelligence_events" on public.intelligence_events for insert with check (true);

drop policy if exists "public read learning_memory" on public.learning_memory;
create policy "public read learning_memory" on public.learning_memory for select using (true);
drop policy if exists "public insert learning_memory" on public.learning_memory;
create policy "public insert learning_memory" on public.learning_memory for insert with check (true);

create index if not exists delivery_objects_project_idx on public.delivery_objects(project_id);
create index if not exists intelligence_events_project_idx on public.intelligence_events(project_id);
create index if not exists learning_memory_project_idx on public.learning_memory(project_id);
