# VeloClear Canonical Architecture

## Product Definition

VeloClear is a Delivery Intelligence Operating System.

It is not a generic PM dashboard, a Jira clone, or a static PM toolkit. Its purpose is to turn project intent into structured delivery, track work across lifecycle states, explain delivery drift, trigger governance actions, and preserve organisational learning.

## Canonical Hierarchy

```text
Organisation
└── Portfolio
    └── Programme
        └── Project
            └── Lifecycle
                ├── Initiation
                ├── Planning
                ├── Execution
                ├── Monitoring & Controlling
                └── Closure
```

## Delivery Graph

The connected delivery graph is the backbone of VeloClear.

```text
Business Goal
→ Capability
→ Epic
→ Feature
→ PBI / User Story
→ Sprint Backlog
→ Sprint
→ Task
→ Blocker
→ Risk
→ Issue
→ Escalation
→ Decision
→ Resolution
→ Retrospective Learning
→ Future Recommendation
```

Every module in VeloClear must connect to this graph. No module should exist as a disconnected page.

## Lifecycle Ownership

### Initiation
Defines why the project exists.

Owns:
- Business Case
- Charter
- Stakeholders
- Scope
- Constraints
- Assumptions
- Initial Governance
- Initial RAID

### Planning
Turns intent into executable delivery structure.

Owns:
- Requirements
- Product Vision
- WBS
- Epics
- Features
- Product Backlog
- Release Plan
- Sprint Planning
- Sprint Backlog
- Budget / EVM Baseline
- RACI
- Dependencies
- Resource Plan
- Communications Plan

### Execution
Delivers the work.

Owns:
- Sprint Board
- Sprint Execution
- Tasks
- Blockers
- Dependencies
- Defects
- RAID Tracking
- Velocity
- Burn-down
- Throughput
- Sprint Reviews
- Sprint Retrospectives

### Monitoring & Controlling
Explains delivery health and triggers governance.

Owns:
- RAG
- EVM
- CPI / SPI / EAC
- Governance
- Escalations
- Decision Tracking
- Change Control
- Impact Trace
- Predictability
- Delivery Signals
- Audit Trail

### Closure
Closes the project and preserves learning.

Owns:
- Final Signoffs
- Handover
- Transition to BAU
- Financial Closure
- Contract Closure
- Final Audit
- Benefits Review
- Final Lessons Learned
- Archive
- Organisational Learning

## Key Rule

PM Toolkit items are not top-level navigation sections. They are contextual tools inside lifecycle phases.

Example:

```text
Planning
├── WBS
├── Product Backlog
├── Sprint Planning
└── Sprint Backlog
```

not:

```text
PM Toolkit
├── WBS
├── Product Backlog
└── Sprint Backlog
```

## VeloClear Differentiator

Standard PM tools track activity.

VeloClear explains:
- why delivery is drifting
- where risk is accumulating
- what will likely happen next
- which governance action is needed
- whether learning prevented recurrence
