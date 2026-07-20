# Independent Review: Compact Progress Cards

## Review identity

- **Master Work item:** [Reposition compact progress goal cards beneath dashboard Summary](https://app.notion.com/p/3a006edf7ca081d0a201c66a4ebf3f10)
- **Branch:** `feature/dashboard-experience`
- **Approved specification:** `specs/dashboard-compact-progress-cards/`
- **Implementer handoff:** `progress/current.md`
- **Review started:** `2026-07-16T20:45:00-06:00`
- **Verdict recorded:** `2026-07-16T20:53:47-06:00`
- **Final verdict:** `BLOCKED_REVIEW`

The feature-specific implementation satisfies R1-R6 and T1-T6. Approval is blocked because the required full Playwright command is red in four broad Axe tests. The failure is independently confirmed as a pre-existing, out-of-scope contrast defect rather than a regression caused by this compact-card implementation. The Reviewer contract forbids approval while a required command is red, and the current specification forbids repairing unrelated dashboard styling.

## Governance and inputs

- Live Notion fetch confirmed `Status = Review`, `Assigned = Gustavo`, `Priority = P1 - Next`, `Department = Brand & Design`, `Workstream = UX / UI`, and `Branch = feature/dashboard-experience`.
- The checked-out branch exactly matches Notion.
- Outcome ancestry resolves through `Design the first six core user screens` to the Avilo visual-identity Outcome.
- The complete approved package contains `requirements.md`, `design.md`, and `tasks.md`.
- `progress/current.md` contains checkpoints, changed files, commands/results, test notes, and requirement coverage.
- The supplied compact-card reference was inspected. It shows two small equal sibling metric cards beneath the main visual.

## Files inspected

- `AGENTS.md`, `.agents/leader.md`, `.agents/reviewer.md`
- `specs/dashboard-compact-progress-cards/requirements.md`
- `specs/dashboard-compact-progress-cards/design.md`
- `specs/dashboard-compact-progress-cards/tasks.md`
- Complete parent package `specs/dashboard-reference-redesign/`
- `progress/current.md`
- `components/dashboard/dashboard-screen.tsx`
- `components/dashboard/goal-progress.tsx`
- `components/dashboard/activity-summary.tsx`
- `app/globals.css`
- `features/dashboard/model.ts`
- `features/dashboard/fixture-dashboard-provider.ts`
- `tests/dashboard/dashboard-screen.test.tsx`
- `tests/dashboard/health-and-ai-safety.test.tsx`
- `tests/dashboard/model.test.ts`
- `e2e/dashboard.spec.ts`
- `package.json`, `package-lock.json`, `playwright.config.ts`, `vitest.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `README.md`
- Parent durable review `reviews/dashboard-reference-redesign/review.md`
- Fresh screenshots `test-results/dashboard-compact-progress-{360,768,1024,1440}.png`

## Commands and exact results

| Command | Result |
| --- | --- |
| `git status --short --branch` / `git branch --show-current` | Branch PASS; `feature/dashboard-experience`. Repository application tree remains entirely untracked relative to the lone README commit. |
| `npm.cmd run test -- tests/dashboard/dashboard-screen.test.tsx` | PASS: 1 file, 4/4 tests. Initial sandbox run hit `spawn EPERM`; approved rerun completed normally. |
| `npm.cmd run lint` | PASS: exit 0. |
| `npm.cmd run typecheck` | PASS: exit 0. |
| `npm.cmd run test` | PASS: 8 files, 28/28 tests. |
| `npm.cmd run build` | PASS: Next.js 15.5.20; `/dashboard` 22.2 kB, 125 kB first-load JS. |
| Temporary production `npm.cmd run start -- -p 3010` plus HTTP request | PASS: `/dashboard` HTTP 200, 48,299 bytes; temporary process stopped. |
| `npm.cmd run test:e2e -- --grep "compact progress card geometry"` | PASS: 4/4 at 360, 768, 1024, and 1440. |
| `npm.cmd run test:e2e` | FAIL: 12/16 pass. Exactly four broad Axe cases fail, one at each required width, on the same serious color-contrast violation. |

The focused geometry run regenerated all four required screenshots. Visual inspection found no clipping, overlap, incoherent placement, or horizontal overflow.

## Requirement verdicts

| Requirement | Verdict | Independent evidence |
| --- | --- | --- |
| R1 | PASS | `dashboard-screen.tsx:30-38` makes `.progress-row` a descendant of `.summary-column`, immediately after the Summary render. Activity remains the sibling `.activity-column`. Browser assertions pass at 1024/1440. |
| R2 | PASS | `globals.css:426-460` uses `repeat(2,minmax(0,1fr))`, 12px gap, 112px minimum card height, and compact 18/16px padding. Geometry confirms sibling width delta <=1px at 768/1024/1440; all content remains visible. |
| R3 | PASS | Fixture remains the sole source and contains the exact two descriptions, labels, values, percentages, and down/up directions at `fixture-dashboard-provider.ts:68-70`. Component assertions verify every string once and one icon in each direction. |
| R4 | PASS | Geometry tests pass at all four widths. The `max-width:767px` rule changes the row to one column at 360; 768 keeps equal siblings. Card and document `scrollWidth <= clientWidth` assertions pass. Activity follows the Summary section below 1024 and stays right at 1024/1440. |
| R5 | BLOCKED BY BROAD GATE | Feature semantics pass: the named Progress goals region, two articles, headings, decorative icons, keyboard checks, focus styling, and readable responsive screenshots are present. The broad Axe command remains red for the pre-existing muted-text contrast defect classified below. |
| R6 | PASS WITH BASELINE LIMITATION | No manifest, dependency, model, fixture, API, persistence, auth, or integration change is indicated; file timestamps align with the four implementation/test files named by the handoff, while `goal-progress.tsx`, fixtures, and manifests predate this work. Because the application tree is untracked, Git cannot independently prove a complete changed-file diff. |

## Design verdicts

- **Summary ownership and normal flow:** PASS. No CSS visual reordering or independent positioning is used.
- **Exactly two cards and fixture-driven mapping:** PASS. `GoalProgress` maps the unchanged two-item fixture array to two articles.
- **Equal compact tracks and responsive fallback:** PASS. The implementation matches the approved two-track design and required 360 one-column fallback.
- **Activity invariance:** PASS. Activity markup/render location remains the sibling right column and focused browser assertions pass.
- **Semantics and failure behavior:** PASS. The existing `section("goal", ...)` readiness boundary remains intact; section recovery tests pass.
- **No rejected alternative or new dependency:** PASS. No full-grid row or visual pull-up technique is present; package files predate the item.
- **Authorized scope:** No unauthorized implementation file is identified by the handoff or timestamps, but the all-untracked Git state prevents a cryptographically reliable diff against a repository baseline.

## Task and checkpoint audit

| Task | Verdict | Truthfulness evidence |
| --- | --- | --- |
| T1 | PASS | Baseline classes, fixture values, readiness wrapper, branch, and approved package were inspected. |
| T2 | PASS | Goal section is immediately after Nutrition Summary inside `.summary-column`. |
| T3 | PASS | `goal-progress.tsx` required no change and preserves two articles, text, and decorative trend mapping. |
| T4 | PASS | Equal compact CSS, readable wrapping, no fixed width, and 360 fallback are present. |
| T5 | PASS | Focused component test substantively checks ownership/order, count, exact descriptions/values/percentages, and trend directions. |
| T6 | PASS | Focused E2E substantively checks four widths, Activity location, grouping, equal widths, stacking, card overflow, page overflow, and screenshot generation. |
| T7 | BLOCKED | Lint, typecheck, component/full unit tests, build, route smoke, focused E2E, and scope inspection pass. The required full E2E command is not green. |

## Axe causality and scope classification

The four broad failures are the same Axe `color-contrast` violation at 360, 768, 1024, and 1440. Axe reports foreground `#60706a` over effective background `#e5e8e4` at `4.22:1`, below the required `4.5:1`, for:

- Summary helper text `Track your performance.`
- Activity helper text `Track your activity.`
- Activity disclosure text `Values are deterministic demo activity data, not medical findings.`

**Causality:** Not caused by this item. The compact-card implementation changes DOM placement and progress-row/card geometry. It does not change `--muted`, the muted section background, the three failing nodes, or their font sizing/weight. The parent review records the identical color pair, ratio, nodes, and four-width failure before this item (`reviews/dashboard-reference-redesign/review.md:585-599`).

**Scope:** Real broad dashboard accessibility defect, outside this approved item. The package explicitly excludes unrelated Summary/Activity content and visual-system changes and authorizes only the compact progress-card correction. The Reviewer did not modify it or suppress Axe.

## Findings

### B1 - Blocking - required broad E2E gate remains red

- **Scope:** R5; T7; Reviewer test-command gate.
- **Files:** `app/globals.css:7`, `app/globals.css:162-166`, `e2e/dashboard.spec.ts:89-90`.
- **Observed:** `npm.cmd run test:e2e` exits 1 with 12/16 passing and four serious Axe contrast failures at the required widths.
- **Expected:** Every required command must pass before `APPROVED`.
- **Classification:** Pre-existing and not caused by the compact-card implementation; correction is outside the current approved specification.
- **Smallest unblock action:** Through the Leader, create/activate a separately governed accessibility correction (or obtain an explicit governed specification/risk decision that changes this review gate), correct the muted-text contrast, rerun the complete E2E suite, then re-review this item. The current Implementer must not broaden this task unilaterally.

### B2 - Medium - Git cannot independently prove authorized changed-file scope

- **Scope:** R6; T7; Reviewer actual-diff requirement.
- **Files:** repository-wide Git baseline.
- **Observed:** Git tracks only `README.md`; all application, test, spec, evidence, and review files are untracked. `git diff` cannot distinguish this item from prior dashboard work.
- **Expected:** A reviewable actual diff proving only authorized implementation/test files changed.
- **Classification:** Repository-state limitation, not evidence of an unauthorized change. Content/timestamp inspection is consistent with the handoff but is weaker than a real diff.
- **Smallest unblock action:** Establish a governed repository baseline that preserves all current work, then provide a reviewable diff for this item without rewriting or discarding existing evidence.

## Progress truthfulness audit

- R1-R4, R6 and T1-T6 claims are supported by source inspection and independent checks.
- The exact focused/full test counts, build output, and route response in `progress/current.md` were independently reproduced.
- The Implementer accurately disclosed the four Axe failures and the all-untracked Git limitation.
- `progress/current.md:72` says there is no blocker to review. Review could be performed, but approval is blocked under the literal Reviewer gate because the required full E2E command is red.

## Final verdict and handoff

`BLOCKED_REVIEW`

Keep the Master Work item in `Review`, assigned to Gustavo. Preserve:

- `specs/dashboard-compact-progress-cards/`
- `progress/current.md`
- `reviews/dashboard-compact-progress-cards/review.md`
- the four responsive screenshots

No post-review cleanup is authorized because the verdict is not approved. The Leader must coordinate the contrast-gate and Git-baseline unblock decisions; only a human may move this work to `Completed`.
