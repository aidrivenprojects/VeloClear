# VeloClear True Production-Grade Foundation

This package is Supabase-first. It does not use localStorage as the source of truth.

## Required setup

1. Create a Supabase project.
2. Run `supabase/001_production_schema.sql` in Supabase SQL Editor.
3. In Vercel, set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy this repository to Vercel.
5. Open `/signup`, create an account, then sign in.

## Production features included

- Supabase Auth
- Middleware route protection
- Supabase Postgres persistence
- Row Level Security
- Organisation membership
- Project membership
- RBAC functions
- Project creation writes to Supabase
- Lifecycle phases generated in Supabase
- Tools generated in Supabase
- Records CRUD writes to Supabase
- Audit events written by trigger
- Project health recalculated by trigger
- Red records generate delivery signals
- Project-context sidebar
- Operating system view from database
- Management report from database
- Audit trail from database

## Routes

- `/login`
- `/signup`
- `/dashboard`
- `/projects`
- `/new-project`
- `/projects/[id]`
- `/projects/[id]/lifecycle/[phase]`
- `/projects/[id]/lifecycle/[phase]/[tool]`
- `/projects/[id]/operating-system`
- `/projects/[id]/audit`
- `/management-report`

## Acceptance test

1. Sign up.
2. Sign in.
3. Open `/dashboard`.
4. Default organisation is created.
5. Create a project.
6. Open Planning → Product Backlog.
7. Add a record.
8. Mark it red.
9. Confirm:
   - project health becomes red
   - signal appears in Operating System
   - audit event appears
   - management report reflects live data
