# VeloClear Intelligence Engine

## Purpose

The intelligence engine connects delivery signals into causal explanations.

It should answer:

1. Why is this happening?
2. What will happen next?
3. Where is delivery risk accumulating?
4. What governance action is needed?
5. Did learning prevent recurrence?

## Signal Types

### Delivery Signals
- blocked PBI
- sprint slip
- velocity drop
- carry-forward increase
- overdue dependency
- recurring defect
- delayed acceptance

### Governance Signals
- overdue decision
- unresolved escalation
- change request aging
- RAG deterioration
- sponsor inactivity
- approval SLA breach

### Learning Signals
- recurring blocker
- retro action not closed
- prior mitigation reused
- repeated vendor issue
- future recurrence prevented

## Propagation Rules

Example:

```text
IF PBI is blocked
AND blocker is linked to dependency
AND sprint completion drops below commitment
THEN create delivery signal: sprint_slip_risk
```

Example:

```text
IF risk trigger fires
THEN create issue
AND open impact trace
AND update project RAG
```

Example:

```text
IF retro action prevents recurrence in future sprint
THEN mark learning as effective
```

## Intelligence Output

VeloClear should generate:

- root cause explanation
- likely impact
- recommended governance action
- affected project objects
- learning recommendation
