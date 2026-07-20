# Progress Cards Outside Summary Tasks

## Execution contract

Implement only after Gustavo reviews this package and moves the governed item from `Defining` to `In Progress`. Work on `feature/dashboard-experience`; preserve these three spec files and do not edit unrelated work.

## Ordered checklist

### T1 - Confirm governed baseline

- **Depends on:** Human approval; status `In Progress`.
- **Files:** Read-only inspection of the authorized files and parent specs.
- **Action/outcome:** Confirm current wrapper, state boundary, card content, and responsive baseline before editing.
- **Requirements:** R1-R6.

### T2 - Establish the exact sibling DOM structure

- **Depends on:** T1.
- **Modify:** `components/dashboard/dashboard-screen.tsx`.
- **Action/outcome:** Add/use one non-surfaced left-column wrapper containing `.summary-column` followed by the existing goal section; keep `.activity-column` as the second `.reference-grid` child. Ensure progress is not nested under `.summary-column`.
- **Requirements:** R1, R3, R5.

### T3 - Preserve progress rendering

- **Depends on:** T2.
- **Modify:** `components/dashboard/goal-progress.tsx` only if required.
- **Action/outcome:** Preserve exactly two articles, all existing text/values/percentages/trends, synthetic props, and semantics; add only a narrowly scoped identification hook if needed.
- **Requirements:** R2, R5.

### T4 - End the muted surface above the cards

- **Depends on:** T2-T3.
- **Modify:** `app/globals.css`.
- **Action/outcome:** Style the left wrapper without a muted rounded surface; retain that surface on `.summary-column`; place the progress row below it with existing white card styling, equal tracks, compact sizing, and responsive reflow at the four required widths.
- **Requirements:** R1, R2, R4.

### T5 - Add focused DOM/content verification

- **Depends on:** T2-T4.
- **Modify:** `tests/dashboard/dashboard-screen.test.tsx`.
- **Action/outcome:** Assert sibling ancestry/order, exact two-card content, Activity placement, and preserved state/accessibility behavior.
- **Requirements:** R1-R3, R5.

### T6 - Add responsive browser evidence

- **Depends on:** T4-T5.
- **Modify:** `e2e/dashboard.spec.ts`.
- **Action/outcome:** At 1440, 1024, 768, and 360, verify order, card visibility/readability, equal widths where two tracks fit, one-column fallback at 360, Activity location when applicable, and `scrollWidth <= clientWidth`.
- **Requirements:** R1-R5.

### T7 - Final verification and scope check

- **Depends on:** T1-T6.
- **Files:** No additional files authorized.
- **Action/outcome:** Run documented lint, typecheck, unit/component, build, and E2E checks available in `package.json`; inspect the diff for only the five authorized implementation/test files, no manifest changes, no fixture/model edits, and no contrast or Git-baseline work. Hand off evidence to Reviewer through the Leader.
- **Requirements:** R1-R6.
- **Verification task:** Yes.

## Requirement-to-task coverage

| Requirement | Tasks |
| --- | --- |
| R1 | T2, T4-T7 |
| R2 | T3-T7 |
| R3 | T2, T5-T7 |
| R4 | T4, T6-T7 |
| R5 | T2-T3, T5-T7 |
| R6 | T1, T7 |

## Stop conditions

Stop for Spec Author revision if implementation requires a new dependency, any unlisted file, fixture/model change, Activity relocation, changed card content, persistence/API work, contrast redesign, Git-baseline change, or behavior that cannot meet the no-overflow contract.
