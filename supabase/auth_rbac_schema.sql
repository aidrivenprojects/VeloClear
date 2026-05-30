-- VeloClear Supabase Auth + RBAC
-- Run after full_connected_delivery_os_schema.sql and enterprise_cdos_modules_schema.sql.

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  default_role text not null default 'Project Manager',
  created_at timestamptz not null default now()
);

create table if not exists public.project_memberships (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role_name text not null,
  created_at timestamptz not null default now(),
  unique(project_id, user_id)
);

create table if not exists public.rbac_permissions (
  id uuid primary key default gen_random_uuid(),
  role_name text not null,
  module text not null,
  can_view boolean not null default true,
  can_edit boolean not null default false,
  can_approve boolean not null default false,
  can_export boolean not null default false,
  created_at timestamptz not null default now(),
  unique(role_name, module)
);

alter table public.user_profiles enable row level security;
alter table public.project_memberships enable row level security;
alter table public.rbac_permissions enable row level security;

drop policy if exists "Users can read own profile" on public.user_profiles;
create policy "Users can read own profile"
on public.user_profiles for select
using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.user_profiles;
create policy "Users can insert own profile"
on public.user_profiles for insert
with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile"
on public.user_profiles for update
using (auth.uid() = id);

drop policy if exists "Users can read own memberships" on public.project_memberships;
create policy "Users can read own memberships"
on public.project_memberships for select
using (auth.uid() = user_id);

drop policy if exists "Authenticated users can insert memberships" on public.project_memberships;
create policy "Authenticated users can insert memberships"
on public.project_memberships for insert
with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can read permissions" on public.rbac_permissions;
create policy "Authenticated users can read permissions"
on public.rbac_permissions for select
using (auth.role() = 'authenticated');

insert into public.rbac_permissions(role_name,module,can_view,can_edit,can_approve,can_export)
values
('PMO Head','all',true,true,true,true),
('Project Manager','all',true,true,false,true),
('Scrum Master','agile-delivery',true,true,false,true),
('Scrum Master','planning',true,false,false,false),
('Scrum Master','raid',true,true,false,false),
('Sponsor','governance',true,false,true,true),
('Sponsor','intelligence',true,false,true,true),
('Auditor','audit-trail',true,false,false,true),
('Auditor','governance',true,false,false,true),
('Team Member','agile-delivery',true,true,false,false),
('Stakeholder','rag-dashboard',true,false,false,false),
('Stakeholder','milestones',true,false,false,false)
on conflict(role_name,module) do update set
can_view=excluded.can_view,
can_edit=excluded.can_edit,
can_approve=excluded.can_approve,
can_export=excluded.can_export;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.user_profiles(id,email,full_name,default_role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'default_role', 'Project Manager')
  )
  on conflict(id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
