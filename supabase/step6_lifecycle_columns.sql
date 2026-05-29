alter table public.projects
add column if not exists current_phase text not null default 'Execution';

alter table public.projects
add column if not exists phase_status text not null default 'amber';

alter table public.projects
add column if not exists phase_completion integer not null default 55;

update public.projects
set current_phase = coalesce(current_phase, 'Execution'),
    phase_status = coalesce(phase_status, 'amber'),
    phase_completion = coalesce(phase_completion, 55);
