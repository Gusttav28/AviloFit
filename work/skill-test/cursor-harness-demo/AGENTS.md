# Cursor Harness Demo agent map

This file is the entrypoint for every human or AI agent working in this repository. It is a navigation map, not the complete rulebook.

## Sources of truth

- **Work tracker:** goals, work admission, status, priority, assignment, dependencies, approval, and durable project knowledge.
- **Git platform:** branches, commits, pull requests, checks, reviews, and merge state.
- **Repository documentation:** architecture, conventions, specifications, verification, and executable controls.
- **Engineering harness:** permissions and phase gates that agents must obey.

Do not make a substantive project change unless the governed work item is ready, assigned, on the required branch, and in the phase required by its role contract.

## Agent roles

| Role | Contract | Authority |
| --- | --- | --- |
| Leader | [`.agents/leader.md`](.agents/leader.md) | Orchestrates work. Never implements or approves it. |
| Spec Author | [`.agents/spec-author.md`](.agents/spec-author.md) | Defines requirements, design, tasks, risks, and traceability. |
| Implementer | [`.agents/implementer.md`](.agents/implementer.md) | Implements only a human-approved specification. |
| Reviewer | [`.agents/reviewer.md`](.agents/reviewer.md) | Independently verifies implementation and emits a verdict. |

## Mandatory entrypoint

Begin as the Leader and follow [`.agents/leader.md`](.agents/leader.md). Load additional context progressively and only when the active governed work requires it.

## Platform notes

This harness is intended for: claude, codex, cursor.

Cursor agents should also follow `.cursor/rules/engineering-harness.mdc` and `.cursor/rules/sdd-lifecycle.mdc` when those files are present.

## Hard boundaries

- The Leader never writes application code, tests, specifications, or implementation files.
- The Spec Author writes only the three files in the active specification package.
- The Implementer writes application code and tests only from an approved specification.
- The Reviewer reads implementation code and runs verification, but never edits implementation code or tests.
- A backlog item cannot go directly to implementation.
- Only a human may approve specification-to-implementation.
- Only a human may mark reviewed work completed.
- Chat-only specialist results are not valid handoffs. Durable artifacts are required.
- Missing, ambiguous, conflicting, or newly discovered scope is a stop condition, not permission to guess.
