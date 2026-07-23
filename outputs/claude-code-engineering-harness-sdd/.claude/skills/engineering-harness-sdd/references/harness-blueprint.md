# Harness blueprint

Use this reference when creating or reshaping a project’s engineering harness.

## Root entrypoint

Create a compact `AGENTS.md` or equivalent. It should be a navigation map, not the full rulebook.

Include:

- sources of truth;
- role table with links to detailed contracts;
- mandatory startup workflow;
- hard boundaries;
- stop conditions.

Recommended skeleton:

```markdown
# Project agent map

## Sources of truth

- Work tracker: goals, admission, status, priority, assignment, dependencies, approval, and durable knowledge.
- Git platform: branches, commits, pull requests, checks, reviews, and merge state.
- Repository documentation: architecture, conventions, specifications, verification, and executable controls.
- Engineering harness: phase gates and role authority.

Do not make a substantive project change unless the governed work item is ready, assigned, on the required branch, and in the phase required by its role contract.

## Agent roles

| Role | Contract | Authority |
| --- | --- | --- |
| Leader | `.agents/leader.md` | Orchestrates work. Never implements or approves it. |
| Spec Author | `.agents/spec-author.md` | Defines requirements, design, tasks, risks, and traceability. |
| Implementer | `.agents/implementer.md` | Implements only an approved specification. |
| Reviewer | `.agents/reviewer.md` | Independently verifies implementation and emits a verdict. |

## Mandatory entrypoint

Begin as the Leader. Load additional context progressively and only when the active governed work requires it.
```

## Source-of-truth boundaries

Define these for every project:

- Work tracker owns goals, priorities, ownership, dependencies, approval, historical knowledge, and success measures.
- Git platform owns branches, commits, PRs, checks, reviews, and merge state.
- Repository docs own architecture, conventions, security, privacy, testing, and executable rules.
- Harness owns what agents are allowed to do in each phase.

If a project lacks one of these systems, write the fallback explicitly. Do not imply access to a tracker or Git platform just because a skill is installed.

## Artifact structure

Recommended default:

```text
.agents/
  leader.md
  spec-author.md
  implementer.md
  reviewer.md
specs/
  <work-slug>/
    requirements.md
    design.md
    tasks.md
progress/
  current.md
reviews/
  <work-slug>/
    review.md
.cursor/
  rules/
    engineering-harness.mdc
    sdd-lifecycle.mdc
AGENTS.md
```

Use existing project folders when they already express the same concept.

## Cursor compatibility

Cursor can consume the same harness when the repository includes concise `.cursor/rules/*.mdc` files that route the agent back to the canonical Markdown contracts.

Use Cursor rules for activation and navigation:

- `.cursor/rules/engineering-harness.mdc`: always-applied entrypoint that tells Cursor to read `AGENTS.md`, start as Leader, and respect source-of-truth boundaries.
- `.cursor/rules/sdd-lifecycle.mdc`: SDD lifecycle rule for `AGENTS.md`, `.agents/**/*.md`, `specs/**/*.md`, `progress/**/*.md`, and `reviews/**/*.md`.

Do not duplicate every role contract inside Cursor rules. Keep `AGENTS.md` and `.agents/*.md` authoritative so Codex, Claude Code, Cursor, and other agents share one process.

## Lifecycle mapping

Map the harness phases to the project tracker:

| Harness phase | Tracker meaning |
| --- | --- |
| Backlog / Not Started | admitted but not specified |
| Specification | requirements, design, and implementation tasks being prepared |
| Human Approval | exact spec awaits approval |
| Implementation | approved work is being built |
| Review | implementation evidence awaits independent verification |
| Human Completion | success measure and Definition of Done are verified |
| Blocked | unresolved prerequisite or missing decision |

Do not allow a work item to skip directly from backlog to implementation.

## Stop conditions

Stop and ask for human direction when:

- there is no governed work item;
- source-of-truth ownership is unclear;
- branch state conflicts with the tracker;
- required human approval is missing;
- requirements, design, dependencies, or privacy/security posture are ambiguous;
- a role would need to perform another role’s authority;
- verification cannot run or cannot prove the success measure.
