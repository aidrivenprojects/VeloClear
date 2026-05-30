# VeloClear Canonical Graph Engine

This build adds the first operational graph backbone:

```text
Business Goal → Capability → Epic → Feature → PBI → Sprint Backlog → Sprint → Task → Blocker → Risk → Issue → Escalation → Decision → Resolution → Retrospective → Lesson → Future Recommendation
```

Implemented:
- Supabase schema
- demo graph
- `/trace`
- `/projects/[id]/trace`
- project graph seeding
- delivery signals and recommendations

Pending:
- full CRUD
- automated trigger rules
- AI extraction backend
- cross-project recurrence detection
