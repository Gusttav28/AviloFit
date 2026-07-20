# Independent Review: Progress Cards Outside Summary

## Work Identity

- **Master Work item:** [Place compact progress cards outside the muted Summary container](https://app.notion.com/p/3a006edf7ca081ee9d97df5c3051d79d)
- **Branch:** `feature/dashboard-experience`
- **Approved specification:** `specs/dashboard-progress-cards-outside-summary/`
- **Implementer evidence:** `progress/current.md`
- **Review started:** `2026-07-16T21:37:00-06:00`
- **Review completed:** `2026-07-16T21:43:13-06:00`
- **Reviewer role:** Independent Reviewer

## Governance Preconditions

| Check | Verdict | Evidence |
| --- | --- | --- |
| Exact work item and handoff | PASS | User invoked this review for item `3a006edf-7ca0-81ee-9d97-df5c3051d79d`; `progress/current.md` contains `IMPLEMENTED` evidence. |
| Live lifecycle status | PASS | Notion status is `Review`. |
| Assignment and classification | PASS | `Assigned = Gustavo`, `Department = Brand & Design`, `Workstream = UX / UI`, `Priority = P1 - Next`, `Type = Task`. Gustavo is the human next-action owner; this review was explicitly invoked by Gustavo. |
| Branch | PASS | Notion and `git branch --show-current` both report `feature/dashboard-experience`. |
| Goal ancestry | PASS | Task -> `Reposition compact progress goal cards beneath dashboard Summary` -> `Redesign dashboard to match uploaded nutrition/activity reference` -> `Design the first six core user screens` -> Outcome `Complete the Avilo visual identity`. |
| Complete spec package | PASS | `requirements.md`, `design.md`, and `tasks.md` exist and were read completely. |
| Reviewable Git baseline | BLOCKED | `git ls-files` returns only `README.md`; the application, tests, specs, and evidence are untracked, so Git cannot prove the R6 changed-file boundary. |

## Files Inspected

- `AGENTS.md`
- `.agents/reviewer.md`
- `specs/dashboard-progress-cards-outside-summary/requirements.md`
- `specs/dashboard-progress-cards-outside-summary/design.md`
- `specs/dashboard-progress-cards-outside-summary/tasks.md`
- Parent packages `specs/dashboard-compact-progress-cards/` and `specs/dashboard-reference-redesign/`
- `progress/current.md`
- `components/dashboard/dashboard-screen.tsx`
- `components/dashboard/goal-progress.tsx`
- `app/globals.css`
- `tests/dashboard/dashboard-screen.test.tsx`
- `e2e/dashboard.spec.ts`
- `features/dashboard/fixture-dashboard-provider.ts`
- `features/dashboard/model.ts`
- `package.json`, `playwright.config.ts`, and Git metadata
- Generated screenshots at 360px and 1440px

## Commands And Exact Results

| Command | Result |
| --- | --- |
| `git branch --show-current` | PASS: `feature/dashboard-experience`. |
| `git status --short` | BLOCKED SCOPE EVIDENCE: the complete application tree is untracked. |
| `git ls-files` | BLOCKED SCOPE EVIDENCE: only `README.md` is tracked. |
| `npm.cmd run test -- tests/dashboard/dashboard-screen.test.tsx` | Initial sandbox run could not spawn esbuild (`EPERM`); approved rerun outside sandbox PASS: 1 file, 4/4 tests. |
| `npm.cmd run typecheck` | PASS. |
| `npm.cmd run lint` | PASS. |
| `npm.cmd run test` | PASS: 8 files, 28/28 tests. |
| `npm.cmd run build` | PASS: Next.js 15.5.20 production build; `/dashboard` static route generated. |
| `npm.cmd run test:e2e -- --grep "compact progress card geometry"` | PASS: 4/4 at 360, 768, 1024, and 1440. |
| `npm.cmd run test:e2e` | FAIL: 12/16 pass. Four `dashboard reference redesign` cases fail at 360, 768, 1024, and 1440 on the serious Axe color-contrast assertion at `e2e/dashboard.spec.ts:96`. |

The full E2E failure is independently reproduced as `#60706a` text on computed `#e5e8e4`, contrast `4.22:1` where `4.5:1` is required. Affected text includes `Track your performance.`, `Track your activity.`, and the activity disclosure. The feature-focused geometry tests all pass before this separate Axe assertion.

## Requirement Verdicts

| Requirement | Verdict | Independent evidence |
| --- | --- | --- |
| R1 - Exact DOM and visual hierarchy | PASS | `dashboard-screen.tsx:30-39` gives `.reference-grid` exactly two direct children. `.dashboard-left-column` directly contains `.summary-column` then the goal section. Component assertions at `dashboard-screen.test.tsx:50-55` and Playwright assertions at `dashboard.spec.ts:23-26,46` pass. Screenshots show the muted surface ending above progress. |
| R2 - Preserve compact cards and content | PASS | `goal-progress.tsx:4-18` still maps fixture cards. Fixture values at `fixture-dashboard-provider.ts:68-71` are unchanged. Exact content/count/trend assertions pass; responsive geometry proves equal widths. |
| R3 - Activity preservation | PASS | `.activity-column` remains the second grid child at `dashboard-screen.tsx:37-39`. At 1024/1440 its x-bound begins after the left track; at 360/768 it stacks after the left group. Existing Activity content tests pass. |
| R4 - Responsive reflow and no overflow | PASS | Focused Playwright passes all four widths. Two equal tracks render at 768/1024/1440; 360 renders equal-width cards in one column; card and document overflow assertions pass. |
| R5 - Accessibility and state preservation | PASS FOR FEATURE / FULL GATE RED | Progress region, articles, headings, decorative trend icons, exact content, and non-ready retry behavior are preserved. However, the repository-wide required Axe check remains red for a pre-existing contrast defect. |
| R6 - File and dependency boundary | BLOCKED | Authorized source shape and unchanged manifest/fixture content are consistent with the handoff, but Git tracks only `README.md`; no independent baseline diff can prove which files changed in this implementation session. |

## Design Verdicts

- **Exact composition contract:** PASS. The implementation matches the specified two-child grid and direct Summary/Progress siblings.
- **Non-surfaced left wrapper:** PASS. `.dashboard-left-column` has layout only at `app/globals.css:192-197`; muted surface styling applies to `.summary-column,.activity-column` at `app/globals.css:198-204`.
- **Normal flow and spacing:** PASS. The left wrapper uses column flex layout with a 16px gap, reduced to 12px below 768px; no positioning shortcut is used.
- **Equal compact tracks:** PASS. `.progress-row` uses `repeat(2,minmax(0,1fr))` at `app/globals.css:432-437`, then one track at `app/globals.css:533-534`.
- **Data/state ownership:** PASS. `DashboardScreen` retains `section()` readiness boundaries; `GoalProgress` remains fixture-driven; Activity rendering is unchanged in place.
- **Authorized files and dependencies:** BLOCKED. File contents fit the design and `package.json` has no observed task-related dependency change, but the missing tracked baseline prevents independent scope proof.
- **Rejected alternative avoided:** PASS. Progress is not visually repositioned while remaining under `.summary-column`; DOM inspection proves no Summary ancestor.

## Task And Checkpoint Audit

| Task | Verdict | Checkpoint truthfulness |
| --- | --- | --- |
| T1 - Confirm governed baseline | PASS | Live Notion, branch, state boundaries, parent specs, and current source were independently inspected. |
| T2 - Establish sibling DOM structure | PASS | Exact wrapper/order exists and tests prove it. |
| T3 - Preserve progress rendering | PASS | `goal-progress.tsx` is unchanged by timestamp relative to this session and fixture/card semantics match the spec. |
| T4 - End muted surface above cards | PASS | CSS and screenshots prove the muted Summary bounds terminate before progress. |
| T5 - Focused DOM/content verification | PASS | The component test covers direct ancestry/order, two cards, exact content, trends, Activity placement, and state recovery. |
| T6 - Responsive browser evidence | PASS | Four-width focused suite passes and screenshots were independently inspected at 360 and 1440. |
| T7 - Final verification and scope check | BLOCKED | Lint, typecheck, unit, build, and focused E2E pass. Full E2E is red 12/16, and the exact changed-file scope cannot be proven from Git. The progress claim correctly disclosed both limitations rather than falsely claiming a green final gate. |

## Architecture And Convention Audit

- Existing component ownership, fixture model, section-state boundary, route, dependencies, and Activity composition are preserved.
- No test-specific production branch or layout shortcut was found.
- Responsive layout uses normal flow, `min-width: 0`, equal grid tracks, and an existing breakpoint.
- The visual and DOM behavior requested by this work item is implemented correctly.
- The review cannot approve a red required command or an unverifiable R6 scope boundary under `.agents/reviewer.md`.

## Findings

### F1 - Blocker: required full E2E accessibility gate is red

- **Severity:** Blocker
- **Violates:** Reviewer test gate; T7; R5 acceptance evidence
- **Locations:** `e2e/dashboard.spec.ts:95-96`, `app/globals.css:7`, `app/globals.css:198-204`
- **Observed:** `npm.cmd run test:e2e` fails 4 of 16 cases at all required widths. Axe reports serious contrast `4.22:1` for `#60706a` text on computed `#e5e8e4`, below the required `4.5:1`.
- **Expected:** Every required command must pass before approval.
- **Classification:** Independently reproduced and not caused by the sibling-layout correction. The current spec explicitly excludes contrast-system changes, so the Reviewer cannot waive it and the Implementer cannot repair it under this package.
- **Smallest unblock action:** Leader/human must provide a governed contrast correction or an explicit governed change to the required full-suite gate, then request re-review.

### F2 - Blocker: R6 exact scope cannot be independently verified

- **Severity:** Blocker
- **Violates:** R6 evidence; T7 scope check; Reviewer precondition against mixed unrelated implementation
- **Location:** Repository Git index at `2dd15b2`
- **Observed:** `git ls-files` contains only `README.md`; `git status --short` reports the entire application tree as untracked. There is no baseline diff for the claimed four implementation/test edits.
- **Expected:** A final diff must prove only authorized files changed and no unrelated implementation is mixed into the review.
- **Classification:** Missing repository prerequisite, not a code correction authorized by this spec. Timestamps corroborate the handoff but are not an independent Git diff.
- **Smallest unblock action:** Leader/human must establish a reviewable governed Git baseline for the application tree without discarding concurrent work, then request re-review.

## Final Verdict

`BLOCKED_REVIEW`

The requested DOM, visual boundary, Activity placement, equal compact cards, 360 stacking, and no-overflow behavior all pass independent inspection and focused verification. Approval is blocked because the required full E2E command remains red and R6 cannot be independently verified from the repository's current Git baseline. The item must remain in `Review`; only Gustavo may complete it.

**Durable handoff:** `BLOCKED_REVIEW -> reviews/dashboard-progress-cards-outside-summary/review.md`
