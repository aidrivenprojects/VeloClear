create extension if not exists "uuid-ossp";
create table public.projects(id uuid primary key default uuid_generate_v4(),name text not null,delivery_method text not null default 'hybrid',complexity text not null default 'multi_team',risk_focus text not null default 'vendor_dependency',health_status text not null default 'amber',narrative text,created_at timestamptz default now());
create table public.raid_items(id uuid primary key default uuid_generate_v4(),project_id uuid references public.projects(id) on delete cascade,item_type text not null check (item_type in ('risk','assumption','issue','dependency')),title text not null,trigger text,mitigation text,owner text,status text not null default 'open',probability int,impact int,created_at timestamptz default now());
create table public.impact_events(id uuid primary key default uuid_generate_v4(),project_id uuid references public.projects(id) on delete cascade,event_type text not null,title text not null,description text,created_at timestamptz default now());
create table public.uploads(id uuid primary key default uuid_generate_v4(),project_id uuid references public.projects(id) on delete cascade,file_name text not null,file_type text,storage_path text,created_at timestamptz default now());
alter table public.projects enable row level security;
alter table public.raid_items enable row level security;
alter table public.impact_events enable row level security;
alter table public.uploads enable row level security;
