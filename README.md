# VeloClear Complete Functional Package

This is a consolidated build from the clean architecture.

## What is included

- Auth gate
- Portfolio dashboard
- Project registry
- New project creation
- Correct project-context sidebar
- 8 lifecycle phases
- Nested phase tools
- Tool-level records CRUD
- Health recalculation
- Signals
- Operating System trace
- Reports
- Audit trail
- Supabase-ready schema
- Local fallback so the app works immediately without Supabase

## Routes

- `/auth`
- `/dashboard`
- `/projects`
- `/new-project`
- `/projects/[id]`
- `/projects/[id]/lifecycle/[phase]`
- `/projects/[id]/lifecycle/[phase]/[tool]`
- `/projects/[id]/operating-system`
- `/projects/[id]/reports`
- `/projects/[id]/audit`
- `/lifecycle/[phase]` redirects to `/projects`

## Test

1. Open `/projects` signed out.
2. Confirm redirect to `/auth`.
3. Sign in.
4. Open `/projects`.
5. Open a project.
6. Confirm sidebar changes into project-context lifecycle tree.
7. Open Planning → Product Backlog.
8. Add a record.
9. Mark it red.
10. Open Operating System.
11. Confirm signals and trace update.
12. Open Reports and Audit Trail.

## Supabase

Optional for now. The app works in browser local storage. To prepare the database, run:

`supabase/schema.sql`
