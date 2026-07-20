# Ask Avilo Gooey Input Tasks

## Implementation Checklist

### T1 - Confirm Branch And Scope

- **Action:** Verify the checkout is on `feature/dashboard-experience` and inspect the current dashboard diff before editing.
- **Files:** No writes.
- **Requirements:** R10
- **Preconditions:** Human has moved the governing Notion item from `Defining` to `In Progress`.
- **Evidence:** Record current branch and confirm no unauthorized files need changes.

### T2 - Add Compact Ask Avilo Entry Component

- **Action:** In `components/dashboard/ask-avilo.tsx`, add or refactor a compact dashboard entry component for the visual gooey input. Keep it presentation-only and avoid provider calls, response state, prompt chips, context chips, persistence, or network behavior in the variant used by `DashboardScreen`.
- **Files:** `components/dashboard/ask-avilo.tsx`
- **Requirements:** R2, R3, R4, R7, R8, R9, R10
- **Depends on:** T1
- **Evidence:** Component exposes a compact entry with visible `Ask anything to Avilo AI` text and accessible close/clear icon naming.

### T3 - Place Input Under Progress Cards

- **Action:** Import and render the compact Ask Avilo entry in `components/dashboard/dashboard-screen.tsx` immediately after `section("goal", <GoalProgress ... />)` inside `.dashboard-left-column`.
- **Files:** `components/dashboard/dashboard-screen.tsx`
- **Requirements:** R1, R5, R6, R10
- **Depends on:** T2
- **Evidence:** DOM order is Summary, Progress goals, Ask Avilo input inside the left column; the input is outside `.summary-column` and outside all `.progress-card` elements.

### T4 - Style The Gooey Pill

- **Action:** Add CSS for the compact white pill, prompt text, embedded right-side icon button, focus-visible states, stable sizing, responsive behavior, and reduced-motion handling.
- **Files:** `app/globals.css`
- **Requirements:** R2, R3, R6, R7, R8, R10
- **Depends on:** T2, T3
- **Evidence:** The pill visually aligns with the progress row, stays compact, and shows no overlap or clipping at 1440, 1024, 768, and 360 widths.

### T5 - Preserve Existing Dashboard Content

- **Action:** Ensure Summary, Activity, history, navigation, section states, and progress-card content remain unchanged except for natural layout changes caused by the new input below progress cards.
- **Files:** `components/dashboard/dashboard-screen.tsx`, `components/dashboard/ask-avilo.tsx`, `app/globals.css`
- **Requirements:** R5, R9, R10
- **Depends on:** T3, T4
- **Evidence:** Existing tests for progress labels, values, percentages, trends, and dashboard regions continue to pass.

### T6 - Add Component-Level Placement And Accessibility Tests

- **Action:** Update `tests/dashboard/dashboard-screen.test.tsx` or a focused dashboard component test to assert required prompt text, exact DOM placement after `Progress goals`, accessible close/clear naming, no response/chat surface requirement, and preservation of progress content.
- **Files:** `tests/dashboard/dashboard-screen.test.tsx` or one focused file under `tests/dashboard/`
- **Requirements:** R1, R2, R4, R5, R7, R10
- **Depends on:** T2, T3
- **Evidence:** Vitest assertions cover DOM order, text, accessibility naming, and content preservation.

### T7 - Add Responsive E2E Geometry Coverage

- **Action:** Update `e2e/dashboard.spec.ts` to verify the input at 1440, 1024, 768, and 360 CSS pixel widths. Assert it sits below progress cards, aligns with the left/progress row at desktop widths, remains visible and reachable, and does not cause horizontal overflow.
- **Files:** `e2e/dashboard.spec.ts`
- **Requirements:** R1, R2, R3, R5, R6, R7, R10
- **Depends on:** T4
- **Evidence:** Playwright bounding-box checks and screenshots show the input in the required position across viewports.

### T8 - Add No-External-Request Interaction Check

- **Action:** In E2E coverage, monitor page requests while focusing, typing if editable, clicking the icon button, and pressing Enter or clicking any submit affordance. Fail if the new input triggers any external or application API request.
- **Files:** `e2e/dashboard.spec.ts`
- **Requirements:** R4, R9, R10
- **Depends on:** T2, T7
- **Evidence:** Test proves the feature remains presentation-only during common interactions.

### T9 - Verify Reduced Motion And Dependency Boundary

- **Action:** Review CSS and package diff to confirm any transitions are disabled or made harmless under `prefers-reduced-motion: reduce`, and no package/dependency/config file changed.
- **Files:** `app/globals.css`; package files must not change.
- **Requirements:** R8, R10
- **Depends on:** T4
- **Evidence:** Diff review confirms no dependency additions and reduced-motion CSS exists if transitions/animations are used.

### T10 - Run Required Verification

- **Action:** Run the repository checks normally used for dashboard work: `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run test`, and `npm.cmd run test:e2e` or the focused dashboard Playwright test command documented by the repo.
- **Files:** No direct writes except normal test output/evidence.
- **Requirements:** R1, R2, R3, R4, R5, R6, R7, R8, R9, R10
- **Depends on:** T6, T7, T8, T9
- **Evidence:** Record pass/fail output. If an existing unrelated failure remains, document the exact failing assertion and why it is unrelated.

### T11 - Final Scope Review

- **Action:** Inspect the final diff and verify only authorized files changed: `components/dashboard/ask-avilo.tsx`, `components/dashboard/dashboard-screen.tsx`, `app/globals.css`, the selected dashboard component test file, `e2e/dashboard.spec.ts`, and this spec package if still present in the branch.
- **Files:** No writes.
- **Requirements:** R10
- **Depends on:** T10
- **Evidence:** Changed-file summary contains no routes, APIs, model/provider files, fixtures, package files, config, persistence, or unrelated dashboard edits.

## Requirement Coverage

| Requirement | Tasks |
| --- | --- |
| R1 | T3, T6, T7, T10 |
| R2 | T2, T4, T6, T7, T10 |
| R3 | T2, T4, T7, T10 |
| R4 | T2, T6, T8, T10 |
| R5 | T3, T5, T6, T7, T10 |
| R6 | T3, T4, T7, T10 |
| R7 | T2, T4, T6, T7, T10 |
| R8 | T2, T4, T9, T10 |
| R9 | T2, T5, T8, T10 |
| R10 | T1, T2, T3, T4, T6, T7, T8, T9, T11 |

## Verification Notes

- The Implementer must not start until Gustavo changes the Notion item from `Defining` to `In Progress`.
- The Implementer must treat any need for backend AI, persistence, new dependencies, API routes, model/provider edits, or unlisted files as a stop condition requiring spec revision.
- Screenshots should show the input directly under the two progress cards, with the exact prompt text visible.
