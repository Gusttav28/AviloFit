# SDD artifact templates

Use these templates for each governed work item. Keep requirement IDs stable after review begins.

## requirements.md

```markdown
# Requirements: <work item title>

- Work item: <tracker title and URL>
- Outcome: <parent outcome>
- Branch: <exact branch or "not Git-backed">
- Status: <tracker status>
- Spec version: <date or commit>

## Problem

<What must be solved and for whom.>

## In scope

- <Bounded behavior>

## Out of scope

- <Explicit exclusions>

## Definitions

- <Term>: <definition>

## Requirements

### R1 — <short requirement>

- Trigger:
- Preconditions:
- Actor/system:
- Expected response:
- State change:
- Visible/resulting evidence:
- Failure behavior:
- Acceptance evidence:

## Traceability

| Source request / criterion | Requirement IDs |
| --- | --- |
| <source> | R1 |

## Assumptions

- <Only assumptions that do not change behavior, scope, interfaces, data, permissions, safety, privacy, or architecture.>

## Open questions

- <Block if any question changes behavior or safety.>
```

## design.md

```markdown
# Design: <work item title>

- Governing requirements: R1, ...

## Goals

- <Design goal tied to requirement IDs>

## Current system observations

- <Existing files, flows, constraints>

## Files to change

| Path | Change | Requirement IDs |
| --- | --- | --- |
| <path> | <exact intended change> | R1 |

## New files

| Path | Purpose | Requirement IDs |
| --- | --- | --- |

## Data and control flow

<Describe components, modules, routes, schemas, events, state transitions, and invariants.>

## Validation and failure handling

<Validation, errors, retries, rollback, and observability.>

## Security, privacy, accessibility, and performance

<Controls required by the project and requirements.>

## Dependencies

<State whether new dependencies are prohibited, unnecessary, or explicitly approved.>

## Alternatives considered

| Alternative | Decision | Reason |
| --- | --- | --- |

## Requirement mapping

| Requirement | Design coverage |
| --- | --- |
| R1 | <section/file/flow> |
```

## tasks.md

```markdown
# Tasks: <work item title>

## Implementation checklist

- [ ] T1 — <action>
  - Files:
  - Requirements:
  - Preconditions:
  - Expected evidence:

## Verification

- [ ] TV1 — Run <documented command/check>
  - Covers:
  - Expected result:

## Traceability

| Task | Requirement IDs |
| --- | --- |
| T1 | R1 |

## Final scope check

- [ ] Every requirement maps to at least one task.
- [ ] Every changed file is listed in the design.
- [ ] No unrelated cleanup or unapproved behavior is included.
- [ ] Required tests/checks are defined.
```

## progress/current.md

```markdown
# Current implementation progress

- Work item:
- Branch:
- Spec package:
- Session start:

## Files read

## Files changed

## Task checklist

## Requirement coverage

## Commands run

| Command | Result | Requirement/task coverage |
| --- | --- | --- |

## Tests added or updated

## Known limitations or blockers

## Final implementation summary
```

## reviews/<work-slug>/review.md

```markdown
# Review: <work item title>

- Work item:
- Branch:
- Approved spec:
- Implementer progress:
- Review start:
- Final verdict: APPROVED | CHANGES_REQUESTED | BLOCKED_REVIEW

## Files inspected

## Commands run

| Command | Result |
| --- | --- |

## Requirement verdicts

| Requirement | Verdict | Evidence |
| --- | --- | --- |

## Design verdicts

## Task/checkpoint verdicts

## Findings

### <severity> — <short title>

- Requirement/design/task:
- File:
- Lines:
- Observed:
- Expected:
- Evidence:
- Required correction:

## Cleanup signal

- Durable spec package:
- Durable progress evidence:
- Durable review report:
- Scratch context to reset:
```
