# Adoption checklist

Use this checklist before installing the harness into another project.

## 1. Project fit

- [ ] The project has recurring human/AI software contributions.
- [ ] Work needs traceability from request to requirement to implementation to verification.
- [ ] Human approval gates are valuable enough to justify the workflow.
- [ ] The repository can hold durable agent guidance and artifacts.

## 2. Sources of truth

- [ ] Work tracker is named.
- [ ] Git platform is named.
- [ ] Repository documentation entrypoints are named.
- [ ] Security/privacy/compliance ownership is named when applicable.
- [ ] Fallback behavior is written for unavailable tools.

## 3. Lifecycle mapping

- [ ] Backlog or Not Started state exists.
- [ ] Specification/Defining state exists.
- [ ] Human approval point is explicit.
- [ ] Implementation/In Progress state exists.
- [ ] Review state exists.
- [ ] Human completion rule is explicit.
- [ ] Blocked state and dependency representation are explicit.

## 4. Role files

- [ ] Root `AGENTS.md` or equivalent points to role contracts.
- [ ] Leader contract exists.
- [ ] Spec Author contract exists.
- [ ] Implementer contract exists.
- [ ] Reviewer contract exists.
- [ ] Each role states allowed writes and forbidden writes.
- [ ] Cursor projects include `.cursor/rules/engineering-harness.mdc`.
- [ ] Cursor projects include `.cursor/rules/sdd-lifecycle.mdc`.

## 5. Artifacts

- [ ] Requirements template exists.
- [ ] Design template exists.
- [ ] Tasks template exists.
- [ ] Progress log template exists.
- [ ] Review report template exists.
- [ ] Requirements-to-tests traceability is required.
- [ ] Installing the harness creates real Markdown files, not only instructions in chat.

## 6. Branch and PR governance

- [ ] Branch ownership is defined.
- [ ] Branch creation permission rule is explicit.
- [ ] PR/check/review/merge state ownership is defined.
- [ ] Tracker synchronization fields or equivalent notes are defined.
- [ ] Completion does not depend solely on merged PRs or closed issues.

## 7. Verification

- [ ] Startup or health-check command is documented, or absence is recorded.
- [ ] Focused test command is documented.
- [ ] Full verification command is documented.
- [ ] Manual verification expectations are documented when automation is missing.
- [ ] Failure capture and blocker creation rules are documented.

## 8. Safety

- [ ] Secrets and private data are out of scope for artifacts.
- [ ] Minimum-necessary access is required.
- [ ] Health, financial, legal, or regulated data controls are explicit if relevant.
- [ ] Agents stop on missing approval, ambiguous scope, or unsafe requests.

## 9. Pilot

- [ ] Run one low-risk task through the full lifecycle.
- [ ] Record friction points.
- [ ] Tighten role contracts before broader rollout.
