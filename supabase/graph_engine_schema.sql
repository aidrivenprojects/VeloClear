create table if not exists public.graph_nodes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  node_type text not null,
  title text not null,
  description text,
  status text not null default 'open',
  owner text,
  phase text,
  severity text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.graph_edges (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  source_node_id uuid references public.graph_nodes(id) on delete cascade,
  target_node_id uuid references public.graph_nodes(id) on delete cascade,
  relationship text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.delivery_signals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  node_id uuid references public.graph_nodes(id) on delete set null,
  signal_type text not null,
  severity text not null default 'medium',
  title text not null,
  explanation text,
  recommended_action text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

alter table public.graph_nodes enable row level security;
alter table public.graph_edges enable row level security;
alter table public.delivery_signals enable row level security;

drop policy if exists "Allow public read graph_nodes" on public.graph_nodes;
create policy "Allow public read graph_nodes" on public.graph_nodes for select using (true);
drop policy if exists "Allow public insert graph_nodes" on public.graph_nodes;
create policy "Allow public insert graph_nodes" on public.graph_nodes for insert with check (true);
drop policy if exists "Allow public update graph_nodes" on public.graph_nodes;
create policy "Allow public update graph_nodes" on public.graph_nodes for update using (true);

drop policy if exists "Allow public read graph_edges" on public.graph_edges;
create policy "Allow public read graph_edges" on public.graph_edges for select using (true);
drop policy if exists "Allow public insert graph_edges" on public.graph_edges;
create policy "Allow public insert graph_edges" on public.graph_edges for insert with check (true);

drop policy if exists "Allow public read delivery_signals" on public.delivery_signals;
create policy "Allow public read delivery_signals" on public.delivery_signals for select using (true);
drop policy if exists "Allow public insert delivery_signals" on public.delivery_signals;
create policy "Allow public insert delivery_signals" on public.delivery_signals for insert with check (true);
drop policy if exists "Allow public update delivery_signals" on public.delivery_signals;
create policy "Allow public update delivery_signals" on public.delivery_signals for update using (true);

create index if not exists graph_nodes_project_idx on public.graph_nodes(project_id);
create index if not exists graph_edges_project_idx on public.graph_edges(project_id);
create index if not exists delivery_signals_project_idx on public.delivery_signals(project_id);
