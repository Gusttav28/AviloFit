# Independent Review: Dashboard Activity Container Height

## Review identity

- **Master Work item:** [Remove excess empty space from dashboard Activity container](https://app.notion.com/p/3a006edf7ca0811ebeb5efaf265b0649)
- **Branch:** `feature/dashboard-experience`
- **Approved specification:** `specs/dashboard-activity-container-height/`
- **Implementer handoff:** `progress/current.md`
- **Review started:** `2026-07-16T22:33:02.1459948-06:00`
- **Final verdict:** `BLOCKED_REVIEW`

The current implementation exhibits the requested Activity-only content-driven height at all four widths. Focused geometry, content, placement, containment, overflow, and keyboard checks pass. Approval is nevertheless blocked under the strict Reviewer contract because the required full Playwright gate is red in four serious Axe contrast cases and the all-untracked application tree prevents an independent actual-diff and pre-change-baseline audit. The contrast defect is independently classified as known before this implementation and outside its approved scope; that classification does not waive the red gate.

## Governance and inputs

- Live Notion confirmed `Status = Review`, `Assigned = Gustavo`, `Priority = P1 - Next`, `Department = Brand & Design`, `Workstream = UX / UI`, and `Branch = feature/dashboard-experience`.
- The checked-out branch exactly matches Notion.
- Outcome ancestry resolves through `Design the first six core user screens` to the `Complete the Avilo visual identity` Outcome.
- The complete approved package contains `requirements.md`, `design.md`, and `tasks.md`.
- `progress/current.md` contains checkpoints, changed-file claims, commands/results, test notes, geometry tables, and requirement coverage.
- The work concerns one focused Activity shell sizing change.

## Files inspected

- `AGENTS.md`, `.agents/leader.md`, `.agents/reviewer.md`
- Avilo Notion governance skill and its workspace, operating, and project-governance references
- `specs/dashboard-activity-container-height/requirements.md`
- `specs/dashboard-activity-container-height/design.md`
- `specs/dashboard-activity-container-height/tasks.md`
- `progress/current.md`
- `app/globals.css`
- `e2e/dashboard.spec.ts`
- `components/dashboard/dashboard-screen.tsx`
- `components/dashboard/activity-summary.tsx`
- `package.json`, `playwright.config.ts`, `README.md`
- Fresh screenshots `test-results/dashboard-activity-content-driven-{1440,1024,768,360}.png`
- Git index, status, branch, and commit history

## Commands and exact results

| Command | Result |
| --- | --- |
| `git branch --show-current` | PASS: `feature/dashboard-experience`. |
| `git status --short` / `git ls-files` / `git log --oneline -5` | Baseline blocker confirmed: Git tracks only `README.md`; application, E2E, specs, progress, and reviews are untracked against commit `2dd15b2`. |
| `npm.cmd run lint` | PASS: exit 0. |
| `npm.cmd run typecheck` | PASS: exit 0. |
| `npm.cmd run test` | PASS outside the sandbox: 8 files and 28/28 tests. Initial sandbox attempt failed at config startup with `spawn EPERM`; this was an environment restriction, not a test failure. |
| `npm.cmd run test:e2e -- --grep "activity shell content-driven geometry"` | PASS: 4/4 at 1440, 1024, 768, and 360. |
| `npm.cmd run test:e2e` | FAIL: 16/20 pass. Four broad dashboard tests fail at 360, 768, 1024, and 1440 on the same serious Axe color-contrast violation. |
| `npm.cmd run build` | PASS: Next.js 15.5.20; `/dashboard` 22.2 kB and 125 kB first-load JS. |
| Temporary `npm.cmd run dev` plus `Invoke-WebRequest http://127.0.0.1:3000/dashboard` | PASS outside the sandbox: HTTP 200, 54,765 bytes, `text/html; charset=utf-8`; server terminated after the check. |

Visual inspection of all four fresh full-page screenshots found no clipping, overlap, second lower blank band, or horizontal overflow. Desktop Activity remains right of and top-aligned with the left column; 768 and 360 stack Activity after the complete left column.

## Requirement verdicts

| Requirement | Verdict | Independent evidence |
| --- | --- | --- |
| R1 | PASS | `app/globals.css:186-206` retains grid stretch and gives only `.activity-column` `align-self:start`. Focused computed-style checks confirm `align-self:start`, `max-height:none`, `position:static`, and `overflow:visible`; descendant containment passes at all widths. |
| R2 | PASS | Focused rendered assertions at `e2e/dashboard.spec.ts:71-128` pass the required 29/25/23/15px disclosure tails within 1px at 1440/1024/768/360. Fresh screenshots show no second blank band. |
| R3 | BLOCKED ON BASELINE PROVENANCE | Current content, both named controls, all six cards, values, trends, disclosure, dark Sleep treatment, containment, and current hard-coded box comparisons pass. Git cannot independently prove that the hard-coded pre-change boxes at `e2e/dashboard.spec.ts:14-63` came from an unchanged reviewable baseline. |
| R4 | BLOCKED ON BASELINE PROVENANCE | Current placement passes: grid `align-items:stretch`, desktop top alignment/right placement, stacked 24px gap, and current Summary/progress comparisons. The all-untracked tree prevents independent before/after proof that Summary/progress geometry was preserved rather than merely encoded as current expected values. |
| R5 | PASS | Focused tests prove document and Activity horizontal fit, all visible descendants within the shell, disclosure vertical containment, desktop separation, and stacked placement. Screenshots at all four widths corroborate the assertions. |
| R6 | BLOCKED BY BROAD GATE | Both controls are keyboard reachable in order, receive focus, and use the shared visible `button:focus-visible` rule at `app/globals.css:34`; the focused suite passes. The required broad Axe gate remains red for the real contrast defect classified below. |
| R7 | BLOCKED | The current CSS mechanism is narrow and package manifests are unchanged in current content, but Git cannot prove that only `app/globals.css` and `e2e/dashboard.spec.ts` changed for this item because both are wholly untracked. |

## Design verdicts

- **Activity-only alignment:** PASS. `.activity-column` alone opts out of cross-axis stretch.
- **Retained grid contract:** PASS. `.reference-grid { align-items:stretch; }` remains at `app/globals.css:186-191`.
- **Normal-flow intrinsic sizing:** PASS. No fixed/max height, absolute positioning, transform, negative margin, or overflow concealment is used for the Activity shell.
- **Responsive padding-derived tails:** PASS. Current rendered tails are exactly the specified four values.
- **Desktop and stacked placement:** PASS for current behavior at all four widths.
- **Current six-card and Summary/progress geometry assertions:** PASS, but historical preservation is not independently auditable without a tracked pre-change baseline.
- **Components, data flow, state ownership, privacy, and dependencies:** No current evidence of a change; Git cannot provide authoritative changed-file scope.
- **Rejected alternatives:** None are present in the current Activity shell implementation.

## Task and checkpoint audit

| Task | Verdict | Truthfulness evidence |
| --- | --- | --- |
| T1 | BLOCKED ON INDEPENDENT PROVENANCE | `progress/current.md` contains a detailed baseline table, and the E2E file embeds matching values. No tracked pre-change source or retained baseline screenshots remain from which the Reviewer can independently reconstruct those values. |
| T2 | PASS | The current CSS is exactly the scoped `align-self:start` mechanism while grid stretch and responsive padding remain. |
| T3 | PASS WITH BASELINE LIMITATION | The focused four-width suite substantively checks tails, content, six cards, current box expectations, placement, containment, overflow, and keyboard reachability. Historical box preservation inherits T1's provenance blocker. |
| T4 | BLOCKED | Lint, typecheck, unit tests, focused E2E, build, and route smoke pass. Required full E2E is red at 16/20. |
| T5 | BLOCKED | Current R1-R6 behavior was remeasured and screenshots inspected, but exact two-file scope and before/after preservation cannot be independently established from Git. |

## Axe classification

The full suite reports one serious Axe `color-contrast` violation in each broad dashboard test at 360, 768, 1024, and 1440. The repeated violation is foreground `#60706a` over effective background `#e5e8e4`, ratio `4.22:1` versus required `4.5:1`, affecting:

- Summary helper text `Track your performance.`
- Activity helper text `Track your activity.`
- Activity disclosure text `Values are deterministic demo activity data, not medical findings.`

**Causality:** The approved requirements package itself records this exact muted-shell contrast finding as a known unrelated condition before implementation. The current Activity change at `app/globals.css:206` changes cross-axis sizing only and does not change `--muted`, section backgrounds, text size/weight, or Axe assertions. It is therefore pre-existing relative to this work and not caused by the Activity height correction.

**Scope:** The defect is real and outside R1-R7's authorized implementation scope; colors and contrast are explicitly out of scope. The Reviewer did not suppress Axe or broaden implementation scope. Under `.agents/reviewer.md`, a required red command still forbids `APPROVED` regardless of causation.

## Findings

### B1 - Blocking - required full E2E gate is red

- **Scope:** R6; T4; Reviewer command gate.
- **Files:** `app/globals.css:7`, `app/globals.css:37`, `e2e/dashboard.spec.ts:240-241`.
- **Observed:** `npm.cmd run test:e2e` exits 1 with 16/20 passing and four serious Axe contrast failures at the required widths.
- **Expected:** Every required command is green before approval.
- **Classification:** Known before and not caused by this sizing implementation; correction is outside the current approved specification.
- **Smallest unblock action:** Through the Leader, activate a separately governed contrast correction or obtain a governed change to the applicable gate, then rerun the full E2E suite and re-review. This task's Implementer must not change colors without revised approval.

### B2 - Blocking - no reviewable Git baseline or actual diff

- **Scope:** R3, R4, R7; T1, T5; Reviewer mandatory actual-diff requirement.
- **Files:** repository-wide Git baseline; `e2e/dashboard.spec.ts:14-67`.
- **Observed:** Git tracks only `README.md`; `app/globals.css`, `e2e/dashboard.spec.ts`, and the rest of the application tree are untracked. `git diff` cannot distinguish this item from prior work or authenticate the embedded pre-change geometry constants.
- **Expected:** A reviewable baseline and actual diff proving the two-file scope and before/after geometry preservation.
- **Classification:** Repository-state blocker, not proof of an unauthorized implementation change. The current content is consistent with the handoff, but consistency is weaker than independent evidence.
- **Smallest unblock action:** Establish a governed Git baseline preserving all current work, then provide an independently reviewable diff or other durable pre-change artifact for this exact item and rerun review. Do not discard or rewrite unrelated work.

## Progress truthfulness audit

- The Implementer accurately reports the current CSS mechanism, tail values, focused 4/4 result, lint, typecheck, unit 28/28, build, route health, full-suite 16/20 result, contrast details, and all-untracked Git limitation.
- Current content, placement, containment, overflow, and keyboard claims are independently reproduced.
- The claim that only two source/test files changed and that all card/Summary/progress boxes are preserved cannot be independently authenticated from the repository state; it remains an Implementer claim supported only by its own captured constants and progress record.
- No false green result or hidden Axe suppression was found.

## Architecture and convention audit

- The current one-declaration CSS solution follows the approved architecture and introduces no dependency or component coupling.
- Existing grid, responsive breakpoint, state, accessibility-label, and data-flow structures remain present.
- No implementation or test repair was made by the Reviewer.
- Generated `.next` and `test-results` artifacts changed as a consequence of required verification only; the Reviewer manually edited only this report.

## Final verdict and handoff

`BLOCKED_REVIEW`

Keep the Master Work item in `Review`, assigned to Gustavo. Preserve:

- `specs/dashboard-activity-container-height/`
- `progress/current.md`
- `reviews/dashboard-activity-container-height/review.md`
- current responsive test evidence

No post-review cleanup is authorized because the verdict is not approved. The Leader must coordinate the contrast-gate and Git-baseline unblock actions. Only a human may move this work to `Completed`.
