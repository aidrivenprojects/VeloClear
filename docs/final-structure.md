# VeloClear Final Structure

This build implements the final 8-phase operating structure as lifecycle-owned workspaces.

## Core Rule

Tools do not live in a separate PM Toolkit menu.

Tools live inside the phase where they are used.

## Structure

```text
Portfolio
→ Project
→ Phase
→ Tool
→ Connected Record
→ Signal
→ Trace Chain
```

## Phases

1. Initiation
2. Planning
3. Mobilisation
4. Risk & RAID
5. Stakeholders
6. Governance
7. Agile Delivery
8. Intelligence

## Key Flow

```text
Business Case
→ Charter
→ WBS
→ Product Backlog
→ PBI
→ Sprint Backlog
→ Sprint Board
→ Blocker
→ Risk Trigger
→ Issue
→ Escalation
→ Decision
→ Resolution
→ Retrospective
→ Learning
→ Future Recommendation
```

## Implemented Routes

Demo context:
- `/final-structure`
- `/lifecycle/initiation`
- `/lifecycle/planning`
- `/lifecycle/mobilisation`
- `/lifecycle/raid`
- `/lifecycle/stakeholders`
- `/lifecycle/governance`
- `/lifecycle/agile-delivery`
- `/lifecycle/intelligence`
- `/lifecycle/[phase]/[tool]`

Project context:
- `/projects/[id]/lifecycle/[phase]`
- `/projects/[id]/lifecycle/[phase]/[tool]`
- `/projects/[id]/trace`

## What Still Needs Future Work

This build creates the final structure and drilldown experience.

Next required engineering layer:
- persist each tool record as graph node
- create/update connected records from UI
- trigger automatic risk → issue → escalation transitions
- AI extraction from uploaded documents
