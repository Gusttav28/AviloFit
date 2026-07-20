# Ask Avilo Aceternity Demo Card Tasks

## Implementation Checklist

### T1 - Confirm Governance And Branch

- **Action:** Confirm Gustavo has moved the governing Notion item from `Defining` to `In Progress`, the checkout is on `feature/dashboard-experience`, and the task scope is exactly this spec package.
- **Files:** No writes.
- **Requirements:** R1
- **Preconditions:** Human approval of the spec package.
- **Evidence:** Implementation notes record Notion status, branch, and scope.

### T2 - Capture Pre-Install Worktree State

- **Action:** Run `git status --short` before any registry command and identify existing user/unrelated changes so generated files can be distinguished from pre-existing work.
- **Files:** No writes.
- **Requirements:** R4, R15
- **Depends on:** T1
- **Evidence:** Pre-install changed-file list is recorded.

### T3 - Try User-Requested Demo Command

- **Action:** Run the exact Windows command `npx.cmd shadcn@latest add @aceternity/gooey-input-demo`.
- **Files:** May generate registry files under `components/ui/` and package/lock changes.
- **Requirements:** R2, R4, R14, R15
- **Depends on:** T1, T2
- **Evidence:** Command output or exact failure text is recorded.

### T4 - Apply Official Fallback If Needed

- **Action:** If T3 fails because the demo registry item is unavailable, not found, or unusable, run `npx.cmd shadcn@latest add @aceternity/gooey-input`. If T3 succeeds with a usable component, skip this task and record that fallback was unnecessary.
- **Files:** May generate registry files under `components/ui/` and package/lock changes.
- **Requirements:** R3, R4, R14, R15
- **Depends on:** T3
- **Evidence:** Fallback command output or skip note is recorded.

### T5 - Inspect Generated Files And Dependencies

- **Action:** Inspect `git status --short`, every generated `components/ui/*gooey*input*.tsx` file, `package.json`, and `package-lock.json`. Confirm generated files are limited to the allowed scope and dependency changes are required by Aceternity Gooey Input.
- **Files:** `components/ui/*gooey*input*.tsx`, `package.json`, `package-lock.json`
- **Requirements:** R4, R8, R14, R15
- **Depends on:** T3 or T4
- **Evidence:** Generated-file and dependency inspection summary.

### T6 - Stop If Registry Path Is Incompatible

- **Action:** If both commands fail, generated code is uninspectable, required files fall outside allowed scope, or the component cannot preserve Aceternity behavior inside the Ask Avilo card without forbidden changes, stop for human decision.
- **Files:** No additional writes.
- **Requirements:** R3, R4, R8, R14, R15
- **Depends on:** T5
- **Evidence:** `BLOCKED_IMPLEMENTATION`-style note with exact command/error/generated-file reason.

### T7 - Integrate Aceternity Input Into Ask Avilo Card

- **Action:** Update `AskAviloGooeyInput` to render a rounded white card with visible prompt text `Ask anything about your recipes or workouts to Avilo AI` at the top and the generated Aceternity Gooey Input below inside the same card.
- **Files:** `components/dashboard/ask-avilo.tsx`; generated `components/ui/*gooey*input*.tsx` only if minimal prop/control adaptation is needed.
- **Requirements:** R5, R6, R8, R9, R10, R12, R15
- **Depends on:** T5 and not blocked by T6
- **Evidence:** Component renders one card with required internal order and Aceternity input behavior.

### T8 - Preserve Dashboard Placement

- **Action:** Confirm `AskAviloGooeyInput` remains immediately after the progress region inside `.dashboard-left-column`. Edit `components/dashboard/dashboard-screen.tsx` only if needed to restore that exact order.
- **Files:** `components/dashboard/dashboard-screen.tsx`
- **Requirements:** R7, R11, R13, R15
- **Depends on:** T7
- **Evidence:** DOM order is Summary, Progress goals, Ask Avilo card inside the left column.

### T9 - Style The Reference Card

- **Action:** Update Ask Avilo CSS for the rounded white card, top prompt text, input/search area below, internal spacing, focus-visible styles, responsive width, no-overlap behavior, and reduced-motion handling for generated motion/filter classes where needed.
- **Files:** `app/globals.css`
- **Requirements:** R5, R6, R10, R11, R12, R15
- **Depends on:** T7, T8
- **Evidence:** CSS and screenshots show one rounded white card matching the reference structure.

### T10 - Enforce Presentation-Only Behavior

- **Action:** Ensure the dashboard integration prevents submit/navigation/request side effects. Keep typed text local only. Do not call `AskAviloProvider`, `/api`, router navigation, storage, analytics, telemetry, fixtures, or model/provider code.
- **Files:** `components/dashboard/ask-avilo.tsx`; generated `components/ui/*gooey*input*.tsx` only if needed to prevent side effects.
- **Requirements:** R8, R9, R13, R15
- **Depends on:** T7
- **Evidence:** Code review and tests show no response/status panel, no provider/API/storage/logging path, and no submit side effect.

### T11 - Update Component Tests

- **Action:** Update `tests/dashboard/dashboard-screen.test.tsx` or create one focused file under `tests/dashboard/` to verify card copy, old-copy absence, one-card containment, input/control accessible names, local typing, Enter/Escape/clear behavior, placement under progress cards, and preserved progress content.
- **Files:** `tests/dashboard/dashboard-screen.test.tsx` or one focused file under `tests/dashboard/`
- **Requirements:** R5, R6, R7, R8, R9, R10, R13, R15
- **Depends on:** T7, T8, T10
- **Evidence:** Tests fail against the previous copy/card structure and pass with the new card.

### T12 - Update E2E Geometry And Behavior

- **Action:** Update `e2e/dashboard.spec.ts` to verify the Ask Avilo card at 1440, 1024, 768, and 360 CSS pixel widths, including card below progress cards, prompt above input in the same card, alignment, no horizontal overflow, focus/open/typing/Escape/clear/blur behavior, and screenshots.
- **Files:** `e2e/dashboard.spec.ts`
- **Requirements:** R5, R6, R7, R8, R10, R11, R12, R13, R15
- **Depends on:** T9, T10
- **Evidence:** Playwright assertions and screenshots capture resting and interacted states.

### T13 - Add No-Request Guard

- **Action:** In E2E coverage, reset request capture after `/dashboard` loads, then interact with the Ask Avilo input. Fail on any input-caused external request or `/api` request.
- **Files:** `e2e/dashboard.spec.ts`
- **Requirements:** R9, R13, R15
- **Depends on:** T10, T12
- **Evidence:** Request log remains empty during Ask Avilo interactions.

### T14 - Verify Accessibility And Keyboard

- **Action:** Ensure tests cover accessible names, visible focus, keyboard path through input and icon controls, no focus trap, and no serious/critical axe violations scoped to the Ask Avilo card.
- **Files:** `tests/dashboard/dashboard-screen.test.tsx` or focused dashboard test, `e2e/dashboard.spec.ts`, `app/globals.css`
- **Requirements:** R10, R11, R12
- **Depends on:** T11, T12
- **Evidence:** Accessibility assertions and axe-scoped checks pass.

### T15 - Review Package And Generated Component Scope

- **Action:** Review final diff for generated files, dependency changes, and unauthorized scope. Confirm package changes are limited to Aceternity-required dependency changes such as `motion`.
- **Files:** `components/ui/*gooey*input*.tsx`, `package.json`, `package-lock.json`
- **Requirements:** R4, R14, R15
- **Depends on:** T7-T14
- **Evidence:** Final dependency/generated-file summary.

### T16 - Run Required Verification Commands

- **Action:** Run `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run test`, and `npm.cmd run test:e2e` or a narrower documented Playwright command with justification if the full suite is impractical.
- **Files:** No direct writes except ordinary test output/evidence.
- **Requirements:** R1, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15
- **Depends on:** T11, T12, T13, T14, T15
- **Evidence:** Record command results. If failures remain, include exact failure text and whether they are related.

### T17 - Final Implementation Handoff

- **Action:** Summarize requirement coverage, commands run, dependency/install result, generated files, screenshots/evidence, changed files, and remaining risks for the governing Notion record. Do not move the work item to `Completed`.
- **Files:** No additional repository writes unless evidence paths are already generated by tests.
- **Requirements:** R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15
- **Depends on:** T16
- **Evidence:** Final handoff is ready for independent review.

## Requirement Coverage

| Requirement | Tasks |
| --- | --- |
| R1 | T1, T16, T17 |
| R2 | T3, T17 |
| R3 | T4, T6, T17 |
| R4 | T2, T5, T6, T15, T17 |
| R5 | T7, T9, T11, T12, T16, T17 |
| R6 | T7, T9, T11, T12, T16, T17 |
| R7 | T8, T11, T12, T16, T17 |
| R8 | T5, T6, T7, T10, T11, T12, T16, T17 |
| R9 | T7, T10, T11, T13, T16, T17 |
| R10 | T7, T9, T11, T14, T16, T17 |
| R11 | T8, T9, T12, T14, T16, T17 |
| R12 | T7, T9, T12, T14, T16, T17 |
| R13 | T8, T10, T11, T12, T13, T16, T17 |
| R14 | T3, T4, T5, T6, T15, T16, T17 |
| R15 | T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T15, T16, T17 |

## Verification Notes

- The Implementer must not start until Gustavo changes the governing Notion item from `Defining` to `In Progress`.
- The primary command is exactly `npx.cmd shadcn@latest add @aceternity/gooey-input-demo`.
- The fallback command is exactly `npx.cmd shadcn@latest add @aceternity/gooey-input`, only after the demo item is unavailable, not found, or unusable.
- If both commands fail or generated files exceed the allowed scope, stop for human decision.
- Package and lockfile edits are authorized only for Aceternity-required dependency changes, expected to include `motion` if installed by the registry.
- Final verification must prove the prompt and input are inside one rounded white card, the old business-management copy is gone, Aceternity behavior is preserved, no requests occur, the card stays below progress cards, and the dashboard remains stable at 1440, 1024, 768, and 360 widths.
