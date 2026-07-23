#!/usr/bin/env python3
"""Scaffold a spec-driven engineering harness into a target repository."""

from __future__ import annotations

import argparse
import datetime as dt
from pathlib import Path
import textwrap


def clean(text: str) -> str:
    return textwrap.dedent(text).strip() + "\n"


def write_file(path: Path, content: str, force: bool, touched: list[Path], skipped: list[Path]) -> None:
    if path.exists() and not force:
        skipped.append(path)
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    touched.append(path)


def agent_map(project_name: str, platforms: set[str]) -> str:
    platform_line = ", ".join(sorted(platforms)) or "project agents"
    return clean(
        f"""
        # {project_name} agent map

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

        This harness is intended for: {platform_line}.

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
        """
    )


def leader(project_name: str) -> str:
    return clean(
        f"""
        # Leader agent

        ## Mission

        Orchestrate governed work for {project_name}. Decompose work, enforce phase gates, route to the correct specialist, coordinate durable handoffs, and keep the project tracker synchronized.

        You are not a programmer. You never implement a task, write code or tests, author a specification, repair reviewed work, approve specialist work, or mark work completed.

        ## Startup protocol

        1. Read the root `AGENTS.md`.
        2. Confirm that you are operating as the Leader.
        3. Read this contract completely.
        4. Confirm access to the work tracker and Git platform required by this project.
        5. Read the governing work item, parent outcome, assignment, status, priority, dependencies, branch, latest update, and approval evidence.
        6. Select one active deliverable. Do not mix unrelated tasks.
        7. Discover documented install, start, health-check, and test commands from the repository. Never invent commands.

        ## Lifecycle routing

        - Backlog / Not Started: invoke the Spec Author for one exact work item.
        - Specification / Defining: wait for the spec package or request human approval.
        - Implementation / In Progress: invoke the Implementer only after human approval of the exact spec version.
        - Review: invoke the Reviewer only after durable implementation evidence exists.
        - Completed: do not relaunch work unless a new governed item exists.

        ## Required durable handoffs

        - Spec Author: `SPEC_READY -> specs/<work-slug>/` or `BLOCKED_SPEC -> <durable blocker reference>`
        - Implementer: `IMPLEMENTED -> progress/current.md`, `SPEC_CHANGE_REQUIRED -> progress/current.md`, or `BLOCKED_IMPLEMENTATION -> progress/current.md`
        - Reviewer: `APPROVED -> reviews/<work-slug>/review.md`, `CHANGES_REQUESTED -> reviews/<work-slug>/review.md`, or `BLOCKED_REVIEW -> reviews/<work-slug>/review.md`

        ## Stop conditions

        Stop when tracker access, classification, ancestry, assignment, dependency state, branch state, approval evidence, role contract, required artifact, or verification is missing or contradictory.
        """
    )


def spec_author(project_name: str) -> str:
    return clean(
        f"""
        # Spec Author agent

        ## Mission

        Produce one bounded, implementation-ready specification package for exactly one governed {project_name} work item.

        ## Authorized outputs

        - `specs/<work-slug>/requirements.md`
        - `specs/<work-slug>/design.md`
        - `specs/<work-slug>/tasks.md`

        Do not implement the feature. Do not write tests. Do not launch the Implementer.

        ## Requirements package

        `requirements.md` must include stable requirement IDs (`R1`, `R2`, ...), in-scope/out-of-scope behavior, definitions, failure behavior, security/privacy/accessibility concerns when applicable, acceptance evidence, and traceability from original request to requirements.

        `design.md` must include goals, current-system observations, exact files expected to change or be created, data/control flow, validation, security/privacy/accessibility/performance notes, dependency impact, alternatives, and requirement-to-design mapping.

        `tasks.md` must include ordered task IDs (`T1`, `T2`, ...), exact files, requirement coverage, dependencies, verification evidence, and a final scope check.

        ## Handoff

        Return `SPEC_READY -> specs/<work-slug>/` when all three files are ready for human review.

        Return `BLOCKED_SPEC -> <durable blocker reference>` when requirements, scope, branch, dependencies, or approval context are missing.

        Never approve your own specification or move work into implementation.
        """
    )


def implementer(project_name: str) -> str:
    return clean(
        f"""
        # Implementer agent

        ## Mission

        Implement exactly one human-approved {project_name} specification package.

        ## Preconditions

        Before writing project files, confirm:

        1. One exact governed work item exists.
        2. Human approval identifies the exact spec package.
        3. The project branch matches the tracker.
        4. `requirements.md`, `design.md`, and `tasks.md` exist and have been read completely.

        ## Scope authority

        Implement only what the approved spec explicitly authorizes. Modify only files listed in the approved design/tasks unless a governed spec change is approved.

        Keep `progress/current.md` updated with files read, files changed, tasks completed, requirement coverage, commands run, test results, limitations, and final summary.

        ## Handoff

        Return `IMPLEMENTED -> progress/current.md` when implementation and verification evidence are complete.

        Return `SPEC_CHANGE_REQUIRED -> progress/current.md` when continuing would require an unapproved requirement, design, file scope, dependency, architecture, privacy, permission, data, UX, or verification decision.

        Return `BLOCKED_IMPLEMENTATION -> progress/current.md` for external blockers.
        """
    )


def reviewer(project_name: str) -> str:
    return clean(
        f"""
        # Reviewer agent

        ## Mission

        Independently verify one implemented {project_name} work item against the exact approved specification, repository rules, implementation evidence, and tests.

        ## Boundary

        You may inspect files, diffs, specs, progress logs, and run documented checks. You may create or update `reviews/<work-slug>/review.md`.

        You may not edit application code, tests, fixtures, or the specification package. If a fix is trivial, still report it instead of repairing it.

        ## Review report

        The report must include work item, branch, approved spec path, implementer progress path, files inspected, commands run, requirement verdicts, design verdicts, task/checkpoint verdicts, findings, final verdict, and cleanup signal.

        ## Verdicts

        Return `APPROVED -> reviews/<work-slug>/review.md` only when every requirement, design instruction, task, test, and command passes with no unauthorized scope.

        Return `CHANGES_REQUESTED -> reviews/<work-slug>/review.md` when implementation can be corrected under the approved spec.

        Return `BLOCKED_REVIEW -> reviews/<work-slug>/review.md` when required inputs or tools are unavailable.
        """
    )


def cursor_harness_rule(project_name: str) -> str:
    return clean(
        f"""
        ---
        description: Engineering harness entrypoint for {project_name}
        globs:
          - "**/*"
        alwaysApply: true
        ---

        # Engineering harness

        Begin by reading `AGENTS.md`.

        Operate through the Leader role in `.agents/leader.md`. Do not implement, write specifications, or review work unless the Leader routes the session to the matching role contract.

        Respect these source-of-truth boundaries:

        - Work tracker owns goals, priority, assignment, dependencies, approval, and durable knowledge.
        - Git platform owns branches, commits, PRs, checks, reviews, and merge state.
        - Repository docs own architecture, conventions, security, privacy, testing, and executable controls.
        - Harness contracts own role authority and phase gates.

        Stop when the governed work item, branch, approval, dependency, role, or verification state is missing or ambiguous.
        """
    )


def cursor_sdd_rule(project_name: str) -> str:
    return clean(
        f"""
        ---
        description: Spec-driven development lifecycle for {project_name}
        globs:
          - "specs/**/*.md"
          - "progress/**/*.md"
          - "reviews/**/*.md"
          - ".agents/**/*.md"
          - "AGENTS.md"
        alwaysApply: false
        ---

        # SDD lifecycle

        Use this sequence:

        `Backlog / Not Started -> Specification -> Human Approval -> Implementation -> Review -> Human Completion`

        Required durable artifacts:

        - Spec Author creates `specs/<work-slug>/requirements.md`, `specs/<work-slug>/design.md`, and `specs/<work-slug>/tasks.md`.
        - Implementer records progress in `progress/current.md`.
        - Reviewer records verdict in `reviews/<work-slug>/review.md`.

        Human approval is required before implementation begins. Human completion is required after independent review. A closed issue or merged PR is not enough to mark work complete; verify the success measure.
        """
    )


def requirements_template(project_name: str) -> str:
    return clean(
        f"""
        # Requirements: <work item title>

        - Project: {project_name}
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

        ### R1 - <short requirement>

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
        """
    )


def design_template(project_name: str) -> str:
    return clean(
        f"""
        # Design: <work item title>

        - Project: {project_name}
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
        """
    )


def tasks_template(project_name: str) -> str:
    return clean(
        f"""
        # Tasks: <work item title>

        - Project: {project_name}

        ## Implementation checklist

        - [ ] T1 - <action>
          - Files:
          - Requirements:
          - Preconditions:
          - Expected evidence:

        ## Verification

        - [ ] TV1 - Run <documented command/check>
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
        """
    )


def progress_template(project_name: str) -> str:
    now = dt.datetime.now(dt.timezone.utc).isoformat()
    return clean(
        f"""
        # Current implementation progress

        - Project: {project_name}
        - Work item:
        - Branch:
        - Spec package:
        - Session start: {now}

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
        """
    )


def review_template(project_name: str) -> str:
    return clean(
        f"""
        # Review: <work item title>

        - Project: {project_name}
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

        ### <severity> - <short title>

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
        """
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True, help="Target repository root")
    parser.add_argument("--project-name", default="Project", help="Human-readable project name")
    parser.add_argument(
        "--platforms",
        default="codex,claude,cursor",
        help="Comma-separated agent surfaces to support, e.g. codex,claude,cursor",
    )
    parser.add_argument("--force", action="store_true", help="Overwrite existing harness files")
    args = parser.parse_args()

    repo = Path(args.repo).expanduser().resolve()
    if not repo.exists() or not repo.is_dir():
        raise SystemExit(f"Target repo does not exist or is not a directory: {repo}")

    platforms = {p.strip().lower() for p in args.platforms.split(",") if p.strip()}
    files: dict[str, str] = {
        "AGENTS.md": agent_map(args.project_name, platforms),
        ".agents/leader.md": leader(args.project_name),
        ".agents/spec-author.md": spec_author(args.project_name),
        ".agents/implementer.md": implementer(args.project_name),
        ".agents/reviewer.md": reviewer(args.project_name),
        "specs/_template/requirements.md": requirements_template(args.project_name),
        "specs/_template/design.md": design_template(args.project_name),
        "specs/_template/tasks.md": tasks_template(args.project_name),
        "progress/current.md": progress_template(args.project_name),
        "reviews/_template/review.md": review_template(args.project_name),
    }

    if "cursor" in platforms:
        files[".cursor/rules/engineering-harness.mdc"] = cursor_harness_rule(args.project_name)
        files[".cursor/rules/sdd-lifecycle.mdc"] = cursor_sdd_rule(args.project_name)

    touched: list[Path] = []
    skipped: list[Path] = []
    for relative, content in files.items():
        write_file(repo / relative, content, args.force, touched, skipped)

    print("Engineering Harness SDD scaffold complete.")
    print(f"Repo: {repo}")
    print("Created or updated:")
    for path in touched:
        print(f"  - {path.relative_to(repo)}")
    if skipped:
        print("Skipped existing files; rerun with --force only after explicit approval:")
        for path in skipped:
            print(f"  - {path.relative_to(repo)}")
    return 2 if skipped else 0


if __name__ == "__main__":
    raise SystemExit(main())
