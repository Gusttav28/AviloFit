# Ask Avilo Aceternity Gooey Refinement Tasks

## Implementation Checklist

### T1 - Confirm Governance, Branch, And File Scope

- **Action:** Confirm the governing Notion item has been moved by Gustavo from `Defining` to `In Progress`, the checkout is on `feature/dashboard-experience`, and no unlisted file changes are needed before implementation.
- **Files:** No writes.
- **Requirements:** R1, R7, R13
- **Preconditions:** Human approval has moved the item to `In Progress`.
- **Evidence:** Record branch, Notion status, and intended changed-file list.

### T2 - Refine AskAviloGooeyInput Into Label Plus Actual Input

- **Action:** Update `AskAviloGooeyInput` so it renders visible label text `Ask anything to Avilo AI` above an actual local text/search input. Add local `value` and `open` state only.
- **Files:** `components/dashboard/ask-avilo.tsx`
- **Requirements:** R2, R3, R4, R8, R12, R13
- **Depends on:** T1
- **Evidence:** The component renders one visible label above one accessible input and accepts typed local text without provider/API wiring.

### T3 - Implement Expand, Collapse, Clear, Escape, Blur, And Enter Behavior

- **Action:** Add local handlers for focus/click expansion, local typing, clear/dismiss, Escape recovery, blur collapse when empty, and Enter prevention.
- **Files:** `components/dashboard/ask-avilo.tsx`
- **Requirements:** R3, R5, R7, R8, R12, R13
- **Depends on:** T2
- **Evidence:** Manual or automated interaction checks show stable collapsed/expanded/value states with no submission, navigation, response UI, or network behavior.

### T4 - Preserve Dashboard Placement

- **Action:** Keep `AskAviloGooeyInput` rendered immediately after the progress region inside `.dashboard-left-column`. Change `components/dashboard/dashboard-screen.tsx` only if the current placement no longer satisfies this exact order after component refinement.
- **Files:** `components/dashboard/dashboard-screen.tsx`
- **Requirements:** R1, R10, R11, R13
- **Depends on:** T2
- **Evidence:** DOM order remains Summary, Progress goals, Ask Avilo entry inside the left column.

### T5 - Add Larger Horizontal Gooey Styling

- **Action:** Update Ask Avilo CSS for label-above-input layout, wider horizontal shell, collapsed and expanded states, input text behavior, clear/dismiss control, SVG/filter gooey surface, focus-visible states, and fallback rounded input visuals.
- **Files:** `app/globals.css`
- **Requirements:** R2, R4, R5, R6, R8, R10, R13
- **Depends on:** T2, T3
- **Evidence:** Styles show a larger horizontal input under the label, with cohesive gooey surface and usable fallback.

### T6 - Add Reduced-Motion Rules

- **Action:** Add or update `prefers-reduced-motion: reduce` handling for Ask Avilo transitions and filters so all animation is removed or minimized while preserving state changes.
- **Files:** `app/globals.css`
- **Requirements:** R5, R6, R9, R10, R13
- **Depends on:** T5
- **Evidence:** CSS review shows reduced-motion coverage for every Ask Avilo transition or animation.

### T7 - Update Component Tests

- **Action:** Update `tests/dashboard/dashboard-screen.test.tsx` or create one focused test under `tests/dashboard/` to verify label placement, actual input role/name, local typing, Enter prevention/no response, Escape/clear recovery, placement after progress cards, and preserved progress content.
- **Files:** `tests/dashboard/dashboard-screen.test.tsx` or one focused file under `tests/dashboard/`
- **Requirements:** R1, R2, R3, R5, R7, R8, R11, R12, R13
- **Depends on:** T2, T3, T4
- **Evidence:** Tests fail on the old button-only compact pill and pass on the refined label/input behavior.

### T8 - Update Responsive E2E Geometry

- **Action:** Update `e2e/dashboard.spec.ts` to verify the refined entry at 1440, 1024, 768, and 360 CSS pixel widths, including label above input, input below progress cards, left-column alignment, collapsed and expanded width behavior, touch target sizes, and no horizontal overflow.
- **Files:** `e2e/dashboard.spec.ts`
- **Requirements:** R1, R2, R4, R5, R6, R8, R10, R11, R13
- **Depends on:** T5, T6
- **Evidence:** Playwright bounding-box assertions and screenshots show the refined layout in collapsed and expanded states where practical.

### T9 - Add No-External-Request Interaction Guard

- **Action:** In the Ask Avilo E2E coverage, reset request capture after page load, then focus, type, press Enter, press Escape, clear/dismiss, and blur the input. Fail if those interactions trigger any external or `/api` request.
- **Files:** `e2e/dashboard.spec.ts`
- **Requirements:** R3, R5, R7, R12, R13
- **Depends on:** T3, T8
- **Evidence:** Request log remains empty for input-caused external or application API calls.

### T10 - Verify Accessibility

- **Action:** Ensure component and E2E checks cover accessible input naming, visible focus, keyboard path through input and clear/dismiss control, no focus trap, and no serious/critical axe violations scoped to `.ask-avilo-gooey`.
- **Files:** `tests/dashboard/dashboard-screen.test.tsx` or focused dashboard test, `e2e/dashboard.spec.ts`, `app/globals.css`
- **Requirements:** R2, R3, R5, R8, R9, R10
- **Depends on:** T7, T8
- **Evidence:** Accessibility assertions pass at representative viewport widths.

### T11 - Verify Dependency And Privacy Boundary

- **Action:** Review the diff to confirm no package, lockfile, route, API, provider, model, fixture, storage, auth, telemetry, or health-data files changed and no Aceternity/shadcn install was run.
- **Files:** No writes.
- **Requirements:** R7, R11, R12, R13
- **Depends on:** T2-T10
- **Evidence:** Changed-file summary contains only authorized files and no dependency changes.

### T12 - Run Required Checks

- **Action:** Run `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run test`, and `npm.cmd run test:e2e` or a focused documented Playwright command with justification if the full suite is impractical.
- **Files:** No direct writes except ordinary test output/evidence.
- **Requirements:** R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13
- **Depends on:** T7, T8, T9, T10, T11
- **Evidence:** Record pass/fail output. If an existing unrelated failure remains, document exact failure text and why it is unrelated.

### T13 - Final Scope Review And Handoff Evidence

- **Action:** Inspect final diff and screenshots, confirm every requirement is covered by implementation and evidence, and summarize the result for the governing Notion record without moving it to `Completed`.
- **Files:** No writes unless attaching allowed evidence under existing evidence conventions is separately authorized by the active implementation spec.
- **Requirements:** R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13
- **Depends on:** T12
- **Evidence:** Final implementation handoff includes requirement coverage, commands run, screenshots or paths, changed files, and remaining risks.

## Requirement Coverage

| Requirement | Tasks |
| --- | --- |
| R1 | T1, T4, T7, T8, T12, T13 |
| R2 | T2, T5, T7, T8, T10, T12, T13 |
| R3 | T2, T3, T7, T9, T10, T12, T13 |
| R4 | T2, T5, T8, T12, T13 |
| R5 | T3, T5, T6, T7, T8, T9, T10, T12, T13 |
| R6 | T5, T6, T8, T12, T13 |
| R7 | T1, T3, T9, T11, T12, T13 |
| R8 | T2, T3, T7, T8, T10, T12, T13 |
| R9 | T6, T10, T12, T13 |
| R10 | T4, T5, T6, T8, T10, T12, T13 |
| R11 | T4, T7, T8, T11, T12, T13 |
| R12 | T2, T3, T7, T9, T11, T12, T13 |
| R13 | T1, T2, T3, T4, T5, T6, T7, T8, T9, T11, T13 |

## Verification Notes

- The Implementer must not start until Gustavo changes the governing Notion item from `Defining` to `In Progress`.
- The Implementer must not install Aceternity, run the shadcn registry command, add `motion`, or edit package files.
- Any need for backend AI, persistence, APIs, provider/model/fixture changes, telemetry, auth, health-data flows, moving the entry away from the progress cards, or editing unlisted files is a stop condition requiring spec revision.
- The final verification must prove the text label is above the actual input, the input expands/collapses with local gooey behavior, interactions make no requests, and the dashboard remains stable at 1440, 1024, 768, and 360 widths.
