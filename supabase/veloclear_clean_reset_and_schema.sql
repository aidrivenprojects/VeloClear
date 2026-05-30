
-- VeloClear CLEAN RESET + PRODUCTION SCHEMA
-- Run this whole file once in Supabase SQL Editor.
-- This resets only VeloClear public schema objects. It does not delete Supabase Auth users.

begin;

-- 1) Drop dependent triggers safely using DO blocks so missing tables do not fail.
do $$
begin
  if to_regclass('public.delivery_records') is not null then
    drop trigger if exists trg_after_record_insert on public.delivery_records;
    drop trigger if exists trg_after_record_update on public.delivery_records;
  end if;
end $$;

-- 2) Drop functions.
drop function if exists public.after_record_change() cascade;
drop function if exists public.recalculate_project_health(uuid) cascade;
drop function if exists public.can_edit_project(uuid) cascade;
drop function if exists public.user_project_role(uuid) cascade;
drop function if exists public.is_project_member(uuid) cascade;
drop function if exists public.is_org_member(uuid) cascade;

-- 3) Drop VeloClear tables.
drop table if exists public.integration_settings cascade;
drop table if exists public.rag_snapshots cascade;
drop table if exists public.audit_events cascade;
drop table if exists public.delivery_signals cascade;
drop table if exists public.delivery_relationships cascade;
drop table if exists public.delivery_records cascade;
drop table if exists public.project_tools cascade;
drop table if exists public.project_phases cascade;
drop table if exists public.project_members cascade;
drop table if exists public.projects cascade;
drop table if exists public.programmes cascade;
drop table if exists public.portfolios cascade;
drop table if exists public.organisation_members cascade;
drop table if exists public.organisations cascade;

-- 4) Drop custom types.
drop type if exists public.vc_role cascade;
drop type if exists public.rag_status cascade;

commit;

-- 5) Fresh schema starts here.
create extension if not exists pgcrypto;

create type public.vc_role as enum (
  'PMO Head',
  'Project Manager',
  'Scrum Master',
  'Sponsor',
  'Auditor',
  'Team Member',
  'Stakeholder'
);

create type public.rag_status as enum ('green', 'amber', 'red');

create table public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.organisation_members (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.vc_role not null default 'Project Manager',
  created_at timestamptz not null default now(),
  unique(organisation_id, user_id)
);

create table public.portfolios (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.programmes (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  portfolio_id uuid references public.portfolios(id) on delete set null,
  programme_id uuid references public.programmes(id) on delete set null,
  slug text not null,
  name text not null,
  methodology text not null default 'Hybrid',
  summary text,
  health public.rag_status not null default 'amber',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organisation_id, slug)
);

create table public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.vc_role not null default 'Project Manager',
  created_at timestamptz not null default now(),
  unique(project_id, user_id)
);

create table public.project_phases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  phase_slug text not null,
  phase_number int not null,
  title text not null,
  purpose text,
  status text not null default 'not_started',
  created_at timestamptz not null default now(),
  unique(project_id, phase_slug)
);

create table public.project_tools (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  phase_slug text not null,
  tool_slug text not null,
  title text not null,
  description text,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  unique(project_id, phase_slug, tool_slug)
);

create table public.delivery_records (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  phase_slug text not null,
  tool_slug text not null,
  record_type text not null,
  title text not null,
  description text,
  status text not null default 'open',
  severity public.rag_status not null default 'amber',
  owner_name text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.delivery_relationships (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  source_record_id uuid not null references public.delivery_records(id) on delete cascade,
  target_record_id uuid not null references public.delivery_records(id) on delete cascade,
  relationship_type text not null,
  created_at timestamptz not null default now()
);

create table public.delivery_signals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  source_record_id uuid references public.delivery_records(id) on delete set null,
  signal_type text not null,
  title text not null,
  explanation text,
  recommendation text,
  severity public.rag_status not null default 'amber',
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  entity_title text,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz not null default now()
);

create table public.rag_snapshots (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  scope_rag public.rag_status not null default 'green',
  schedule_rag public.rag_status not null default 'green',
  cost_rag public.rag_status not null default 'green',
  risk_rag public.rag_status not null default 'green',
  governance_rag public.rag_status not null default 'green',
  overall_rag public.rag_status not null default 'green',
  explanation text,
  created_at timestamptz not null default now()
);

create table public.integration_settings (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  provider text not null,
  status text not null default 'ready',
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(organisation_id, provider)
);

-- Membership helper functions.
create function public.is_org_member(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organisation_members m
    where m.organisation_id = org_id
      and m.user_id = auth.uid()
  );
$$;

create function public.is_project_member(pid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.project_members m
    where m.project_id = pid
      and m.user_id = auth.uid()
  )
  or exists (
    select 1
    from public.projects pr
    join public.organisation_members om
      on om.organisation_id = pr.organisation_id
    where pr.id = pid
      and om.user_id = auth.uid()
  );
$$;

create function public.user_project_role(pid uuid)
returns public.vc_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select role
      from public.project_members
      where project_id = pid
        and user_id = auth.uid()
      limit 1
    ),
    (
      select om.role
      from public.projects pr
      join public.organisation_members om
        on om.organisation_id = pr.organisation_id
      where pr.id = pid
        and om.user_id = auth.uid()
      limit 1
    ),
    'Stakeholder'::public.vc_role
  );
$$;

create function public.can_edit_project(pid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.user_project_role(pid) in ('PMO Head', 'Project Manager', 'Scrum Master');
$$;

-- Enable RLS.
alter table public.organisations enable row level security;
alter table public.organisation_members enable row level security;
alter table public.portfolios enable row level security;
alter table public.programmes enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.project_phases enable row level security;
alter table public.project_tools enable row level security;
alter table public.delivery_records enable row level security;
alter table public.delivery_relationships enable row level security;
alter table public.delivery_signals enable row level security;
alter table public.audit_events enable row level security;
alter table public.rag_snapshots enable row level security;
alter table public.integration_settings enable row level security;

-- RLS policies.
create policy "org select" on public.organisations
for select using (public.is_org_member(id) or created_by = auth.uid());

create policy "org insert" on public.organisations
for insert with check (created_by = auth.uid());

create policy "org members select" on public.organisation_members
for select using (user_id = auth.uid() or public.is_org_member(organisation_id));

create policy "org members insert" on public.organisation_members
for insert with check (user_id = auth.uid() or public.is_org_member(organisation_id));

create policy "portfolio select" on public.portfolios
for select using (public.is_org_member(organisation_id));

create policy "portfolio insert" on public.portfolios
for insert with check (public.is_org_member(organisation_id));

create policy "programme select" on public.programmes
for select using (
  exists (
    select 1
    from public.portfolios pf
    where pf.id = portfolio_id
      and public.is_org_member(pf.organisation_id)
  )
);

create policy "programme insert" on public.programmes
for insert with check (
  exists (
    select 1
    from public.portfolios pf
    where pf.id = portfolio_id
      and public.is_org_member(pf.organisation_id)
  )
);

create policy "project select" on public.projects
for select using (public.is_project_member(id));

create policy "project insert" on public.projects
for insert with check (public.is_org_member(organisation_id));

create policy "project update" on public.projects
for update using (public.can_edit_project(id));

create policy "project members select" on public.project_members
for select using (public.is_project_member(project_id));

create policy "project members insert" on public.project_members
for insert with check (public.can_edit_project(project_id));

create policy "phase select" on public.project_phases
for select using (public.is_project_member(project_id));

create policy "phase insert" on public.project_phases
for insert with check (public.can_edit_project(project_id));

create policy "phase update" on public.project_phases
for update using (public.can_edit_project(project_id));

create policy "tool select" on public.project_tools
for select using (public.is_project_member(project_id));

create policy "tool insert" on public.project_tools
for insert with check (public.can_edit_project(project_id));

create policy "tool update" on public.project_tools
for update using (public.can_edit_project(project_id));

create policy "records select" on public.delivery_records
for select using (public.is_project_member(project_id));

create policy "records insert" on public.delivery_records
for insert with check (public.can_edit_project(project_id));

create policy "records update" on public.delivery_records
for update using (public.can_edit_project(project_id));

create policy "relationships select" on public.delivery_relationships
for select using (public.is_project_member(project_id));

create policy "relationships insert" on public.delivery_relationships
for insert with check (public.can_edit_project(project_id));

create policy "signals select" on public.delivery_signals
for select using (public.is_project_member(project_id));

create policy "signals insert" on public.delivery_signals
for insert with check (public.can_edit_project(project_id));

create policy "signals update" on public.delivery_signals
for update using (public.can_edit_project(project_id));

create policy "audit select" on public.audit_events
for select using (project_id is null or public.is_project_member(project_id));

create policy "audit insert" on public.audit_events
for insert with check (project_id is null or public.is_project_member(project_id));

create policy "rag select" on public.rag_snapshots
for select using (public.is_project_member(project_id));

create policy "rag insert" on public.rag_snapshots
for insert with check (public.can_edit_project(project_id));

create policy "integrations select" on public.integration_settings
for select using (public.is_org_member(organisation_id));

create policy "integrations insert" on public.integration_settings
for insert with check (public.is_org_member(organisation_id));

create policy "integrations update" on public.integration_settings
for update using (public.is_org_member(organisation_id));

-- Trigger functions must be created AFTER tables exist.
create function public.recalculate_project_health(pid uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  red_count int;
  amber_count int;
  next_health public.rag_status;
begin
  select count(*) into red_count
  from public.delivery_records
  where project_id = pid
    and severity = 'red';

  select count(*) into amber_count
  from public.delivery_records
  where project_id = pid
    and severity = 'amber';

  if red_count > 0 then
    next_health := 'red';
  elsif amber_count > 0 then
    next_health := 'amber';
  else
    next_health := 'green';
  end if;

  update public.projects
  set health = next_health,
      updated_at = now()
  where id = pid;
end;
$$;

create function public.after_record_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.recalculate_project_health(new.project_id);

  insert into public.audit_events (
    project_id,
    actor_id,
    action,
    entity_type,
    entity_id,
    entity_title,
    after_state
  )
  values (
    new.project_id,
    auth.uid(),
    tg_op,
    'delivery_record',
    new.id,
    new.title,
    to_jsonb(new)
  );

  if new.severity = 'red' then
    insert into public.delivery_signals (
      project_id,
      source_record_id,
      signal_type,
      title,
      explanation,
      recommendation,
      severity
    )
    values (
      new.project_id,
      new.id,
      'record_red',
      new.record_type || ' needs governance action',
      new.title || ' is red / blocked.',
      'Review the record, assign owner and escalate if unresolved.',
      'red'
    );
  end if;

  return new;
end;
$$;

create trigger trg_after_record_insert
after insert on public.delivery_records
for each row execute function public.after_record_change();

create trigger trg_after_record_update
after update on public.delivery_records
for each row execute function public.after_record_change();

-- Indexes.
create index idx_projects_org on public.projects(organisation_id);
create index idx_records_project on public.delivery_records(project_id);
create index idx_relationships_project on public.delivery_relationships(project_id);
create index idx_signals_project on public.delivery_signals(project_id);
create index idx_audit_project on public.audit_events(project_id);
