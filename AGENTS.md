# Avilo Fit agent map

This file is the entrypoint for every human or AI agent working in this repository. It is a navigation map, not the complete rulebook.

## Sources of truth

- **Notion Master Work:** goals, work admission, status, priority, assignment, dependencies, approval, and durable project knowledge.
- **GitHub:** branches, commits, pull requests, checks, reviews, and merge state.
- **Repository documentation:** architecture, conventions, specifications, verification, and executable controls.
- **Engineering harness:** the permissions and phase gates that agents must obey.

Do not make a substantive project change unless the governing Master Work item is ready, assigned, on an exact existing branch, and in the phase required by its role contract.

## Agent roles

| Role | Contract | Authority |
| --- | --- | --- |
| Leader | [`.agents/leader.md`](.agents/leader.md) | Orchestrates work. Never implements or approves it. |
| Spec Author | [`.agents/spec-author.md`](.agents/spec-author.md) | Defines requirements, design, tasks, risks, and traceability. |
| Implementer | [`.agents/implementer.md`](.agents/implementer.md) | Implements only an exact human-approved specification. |
| Reviewer | [`.agents/reviewer.md`](.agents/reviewer.md) | Independently verifies implementation and emits a verdict. |

The Leader, Spec Author, Implementer, and Reviewer contracts exist at this stage.

## Mandatory entrypoint

Begin as the Leader and follow [`.agents/leader.md`](.agents/leader.md). Load additional context progressively and only when the active governed work requires it.

## Hard boundaries

- The Leader never writes application code, tests, specifications, or implementation files.
- The Spec Author writes only the three files in the active specification package. It never writes application code or tests.
- The Implementer writes application code and tests only from the approved specification for one `In Progress` work item.
- The Reviewer reads implementation code and runs verification, but never edits implementation code or tests.
- A `Not Started` item cannot go directly to implementation.
- Only a human may move approved work from `Defining` to `In Progress`.
- Only a human may move reviewed work from `Review` to `Completed`.
- Chat-only specialist results are not valid handoffs. Durable artifacts are required, and artifacts do not replace human approval.
- After an approved review, active per-session working context must be cleaned or reset through the Leader after durable evidence is linked.
- Missing, ambiguous, conflicting, or newly discovered scope is a stop condition, not permission to guess.
