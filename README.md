# VeloClear Modular App

A modular Next.js app containing:

- `/demo` polished demo showcase
- `/projects/new` Guided Project Setup Intelligence
- `/dashboard`
- `/raid`
- `/impact-trace`
- `/integrations`
- `/login`

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

```txt
http://localhost:3000/demo
```

## Deploy

Upload this folder to GitHub and import it into Vercel.

## Supabase

When ready, run `supabase/schema.sql` in Supabase SQL Editor.

## Modular structure

- `components/layout` — AppShell, Sidebar, Brand
- `components/ui` — Card, Button, Badge, MetricCard
- `components/demo` — demo-only entry and role flow
- `components/setup` — Guided Setup Intelligence
- `components/dashboard` — dashboard cards and narrative
- `components/raid` — RAID table
- `components/impact` — Impact Trace
- `components/integrations` — upload/integration panels
- `lib` — types, demo data, setup generation logic
