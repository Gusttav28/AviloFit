---
name: engineering-harness-sdd
description: Create, adapt, install, or operate a spec-driven engineering harness for software projects, based on the Avilo Fit harness and the betta-tech/harness-sdd pattern. Use when a user wants to scaffold AGENTS.md, Cursor .cursor/rules, agent role contracts, SDD requirements/design/tasks templates, human approval gates, branch and PR governance, implementation/review separation, progress evidence, requirements-to-tests traceability, or a portable AI-agent contribution process for Codex, Claude Code, Cursor, or other coding agents.
---

# Engineering Harness SDD

Use this skill to set up or run a safe engineering harness where humans and AI agents contribute through explicit roles, durable artifacts, approval gates, and verification evidence.

The harness is project-portable. Do not assume Avilo Fit, Notion, GitHub, or any specific repository unless the target project declares them as sources of truth.

## Quick scaffold

When the user asks to install or add the harness to a repository, create the actual Markdown files. Prefer the bundled script:

```bash
python <skill-dir>/scripts/scaffold_harness.py --repo <target-repo> --project-name "<Project Name>" --platforms codex,claude,cursor
```

The scaffold creates:

- `AGENTS.md`
- `.agents/leader.md`
- `.agents/spec-author.md`
- `.agents/implementer.md`
- `.agents/reviewer.md`
- `.cursor/rules/engineering-harness.mdc` when Cursor support is requested
- `.cursor/rules/sdd-lifecycle.mdc` when Cursor support is requested
- `specs/_template/requirements.md`
- `specs/_template/design.md`
- `specs/_template/tasks.md`
- `progress/current.md`
- `reviews/_template/review.md`

Use `--force` only with explicit user permission after inspecting existing files. Without `--force`, the script refuses to overwrite existing files.

## Core contract

Separate the work into four roles:

- **Leader**: orchestrates the workflow, loads governance, checks readiness, routes work, and records handoffs. It does not implement, author specs, review its own work, or approve completion.
- **Spec Author**: writes exactly one specification package for one admitted work item. It does not implement.
- **Implementer**: implements only a human-approved specification. It does not redefine requirements or review itself.
- **Reviewer**: independently verifies the implementation against the approved specification and evidence. It does not repair the work.

Use the lifecycle:

`Backlog / Not Started -> Specification -> Human Approval -> Implementation -> Review -> Human Completion`

Map those states to the target project’s real tracker. Do not invent a second status system when the project already has one.

## Startup workflow

1. Read the target repository’s root agent entrypoint, usually `AGENTS.md`, `CLAUDE.md`, or equivalent.
2. Identify the project’s sources of truth for:
   - work admission, ownership, status, priority, dependencies, and durable knowledge;
   - branches, commits, pull requests, checks, reviews, and merge state;
   - architecture, coding standards, security, privacy, testing, and verification.
3. Find the governed work item before changing project files.
4. Confirm the item has a clear outcome, owner/assignee, status, success measure, dependencies, and branch policy.
5. Stop before implementation if a required work item, approval, branch, dependency, or role contract is missing.
6. Load only the role reference needed for the current phase:
   - setup or orchestration: `references/harness-blueprint.md`
   - role boundaries: `references/role-contracts.md`
   - spec artifacts: `references/spec-templates.md`
   - adoption planning: `references/adoption-checklist.md`

## Setup workflow

When creating a harness in a project:

1. Inspect the existing repository guidance and task tracker.
2. Run `scripts/scaffold_harness.py` or create the same files manually when a script cannot be used.
3. Create or update a compact root entrypoint, normally `AGENTS.md`, as a navigation map.
4. Create role contracts under a project-appropriate path such as `.agents/leader.md`, `.agents/spec-author.md`, `.agents/implementer.md`, and `.agents/reviewer.md`.
5. For Cursor, create `.cursor/rules/engineering-harness.mdc` and `.cursor/rules/sdd-lifecycle.mdc`; keep them concise and point Cursor back to `AGENTS.md` and `.agents/*.md`.
6. Create durable artifact locations, commonly:
   - `specs/<work-slug>/requirements.md`
   - `specs/<work-slug>/design.md`
   - `specs/<work-slug>/tasks.md`
   - `progress/current.md`
   - `reviews/<work-slug>/review.md`
7. Define the target project’s approval gates explicitly.
8. Define how branch, issue, PR, check, review, and merge state synchronize with the work tracker.
9. Add a minimal validation path: startup command, focused tests, full verification, or a documented blocker when the project is not runnable.
10. Preserve existing project conventions. Do not replace a working governance system merely to match the reference pattern.

## Operating rules

- Search before creating work items, branches, specs, or records.
- Use one governed work item per implementation chain.
- Require human approval before implementation begins.
- Require independent review before human completion.
- Never mark work complete only because an issue closed or a PR merged; verify the success measure.
- Never create a missing Git branch without explicit permission when the project requires permission.
- Treat chat summaries as insufficient handoffs. Require durable artifacts.
- Treat missing or conflicting scope as a stop condition.
- Keep `AGENTS.md` compact. Put detailed role rules and templates in referenced files.
- Keep Cursor rules compact. Use them as activation/navigation rules, not as a duplicate copy of every contract.
- For privacy, security, regulated, or health-data work, require explicit requirements, design controls, verification evidence, and minimum-necessary access.

## When adapting from Avilo or harness-sdd

Use Avilo’s harness as a proven model for strict phase separation, Notion/GitHub synchronization, and Codex/Claude compatibility.

Use `betta-tech/harness-sdd` as the baseline pattern for:

- compact repository navigation;
- initialization checks;
- SDD artifacts;
- human approval at spec readiness;
- leader/spec-author/implementer/reviewer roles;
- checkpoint and hook concepts;
- requirements-to-tests traceability;
- progress and session history.

Adapt these concepts to the target project’s own tracker, repository structure, risk level, and team norms. Do not blindly copy Avilo-specific Notion database names, assignees, departments, or private workspace URLs into another project.

## Handoff format

Require role handoffs in this form:

- Spec Author: `SPEC_READY -> specs/<work-slug>/` or `BLOCKED_SPEC -> <durable blocker reference>`
- Implementer: `IMPLEMENTED -> progress/current.md`, `SPEC_CHANGE_REQUIRED -> progress/current.md`, or `BLOCKED_IMPLEMENTATION -> progress/current.md`
- Reviewer: `APPROVED -> reviews/<work-slug>/review.md`, `CHANGES_REQUESTED -> reviews/<work-slug>/review.md`, or `BLOCKED_REVIEW -> reviews/<work-slug>/review.md`

Only the human owner approves the transition from specification to implementation and from approved review to completion.
