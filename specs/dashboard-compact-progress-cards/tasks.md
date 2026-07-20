# Compact Progress Cards Tasks

## Ordered implementation checklist

### T1 - Confirm baseline and scope

- **Precondition:** Human moves this governed item from `Defining` to `In Progress` after review.
- **Files:** Read-only inspection of the five authorized implementation/test files and existing parent spec.
- **Action/outcome:** Confirm current progress values, class names, section readiness wrapper, and no conflicting local edits in the authorized files.
- **Requirements:** R1-R6.

### T2 - Move progress ownership into Summary column

- **Depends on:** T1.
- **Modify:** `components/dashboard/dashboard-screen.tsx`.
- **Action/outcome:** Render the existing goal section immediately after `NutritionSummary` inside `.summary-column`; leave `.activity-column` and Activity rendering in place.
- **Requirements:** R1, R3, R5.

### T3 - Preserve compact-card semantics

- **Depends on:** T2.
- **Modify:** `components/dashboard/goal-progress.tsx` only if needed.
- **Action/outcome:** Keep exactly two articles, existing labels/descriptions/values/percentages/trend directions, and accessible text; add only a narrowly scoped class or semantic attribute needed by layout tests.
- **Requirements:** R2, R3, R5.

### T4 - Implement equal compact responsive layout

- **Depends on:** T2-T3.
- **Modify:** `app/globals.css`.
- **Action/outcome:** Style the progress row as equal compact tracks under Summary, preserve card visual language, and define the 1440/1024/768/360 behavior. Use a one-column fallback at 360px and ensure no fixed width creates overflow.
- **Requirements:** R1, R2, R4, R5.

### T5 - Add focused component assertions

- **Depends on:** T2-T4.
- **Modify:** `tests/dashboard/dashboard-screen.test.tsx`.
- **Action/outcome:** Assert both cards render once with exact labels, descriptions, values, percentages, and trend indicators; assert the progress region follows the Summary card and is within the Summary column.
- **Requirements:** R1-R3, R5.

### T6 - Add responsive browser evidence

- **Depends on:** T4-T5.
- **Modify:** `e2e/dashboard.spec.ts`.
- **Action/outcome:** At 1440, 1024, 768, and 360 viewport widths, assert visibility/readability, equal sibling widths where two columns are required, grouped placement, Activity location at desktop/tablet, and `scrollWidth <= clientWidth`. Capture screenshots for review.
- **Requirements:** R1, R2, R4, R5.

### T7 - Final verification and scope check

- **Depends on:** T1-T6.
- **Files:** No additional files authorized.
- **Action/outcome:** Run the repository-documented lint, typecheck, unit/component, build, and E2E checks available in `package.json`; inspect the diff for exactly the authorized implementation/test files, no dependency changes, no fixture/model changes, and no unrelated dashboard edits. Record evidence for every requirement and hand off to Reviewer through the Leader.
- **Requirements:** R1-R6.
- **Verification task:** Yes.

## Requirement-to-task coverage

| Requirement | Tasks |
| --- | --- |
| R1 | T2, T4-T7 |
| R2 | T3-T7 |
| R3 | T2-T3, T5, T7 |
| R4 | T4, T6-T7 |
| R5 | T2-T7 |
| R6 | T1, T7 |

## Stop conditions

Stop and return for specification revision if implementation requires a new dependency, a fixture/model change, an unlisted file, changed labels/values/trends, Activity relocation, persistence/API work, or a responsive behavior that cannot meet the no-overflow contract.
