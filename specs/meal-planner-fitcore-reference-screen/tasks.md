# Meal Planner FitCore Reference Screen Tasks

## Execution gate

- Work item `3a606edf-7ca0-811b-a336-ea2db317e74a` is human-approved and moved from `Defining` to `In Progress`.
- The checked-out branch is exactly `develop`.
- The Implementer reads this package and the current Dashboard, Activity, and Nutrition implementations before editing.
- No task below authorizes a sidebar redesign, another destination, dependency/configuration changes, remote runtime assets, backend work, or real health-data behavior.

## Ordered implementation checklist

### T1. Establish evidence and protect governed scope

- **Files:** no product-file change; record in `progress/current.md`.
- **Requirements:** R1, R2, R19, R20.
- Confirm the approved package, exact branch, starting revision/status, pre-existing worktree changes, current sidebar structure/geometry, and current Dashboard/Activity/Nutrition regression baseline. Confirm the route slug and allowed file list before editing. Stop if unrelated work conflicts with a listed file.
- **Depends on:** human approval and exact `develop` branch.

### T2. Add the typed deterministic Meal Planner model, fixture, and format helpers

- **Files:** create `features/meal-planner/model.ts`, `features/meal-planner/fixture-meal-planner-provider.ts`, and `features/meal-planner/format.ts`; create `tests/meal-planner/model.test.ts` and `tests/meal-planner/format.test.ts`.
- **Requirements:** R4, R6-R10, R14-R15, R18-R20.
- Encode the exact week labels, default `Wed 14`, target values, overall 82% state, seven-slot breakfast/lunch/dinner matrices, two add slots, static Pan-Seared Scallops favorite, and deterministic section states. Return structured clones. Test exact cardinalities/order/values, fixed labels, progress/clamping, clone isolation, no current-clock/random dependency, no remote image URLs, and bounded safety copy.
- **Depends on:** T1.

### T3. Extend only the existing Meal Planner navigation contract

- **Files:** modify `components/dashboard/contextual-utilities.tsx`; modify `tests/dashboard/navigation.test.tsx` only for the route/current-state regression described here.
- **Requirements:** R1-R2, R17, R20.
- Add `"Meal Planner"` to the existing typed section contract and add only the existing `/meal-planner` link behavior. Preserve every sidebar label, icon, order, class, profile, settings boundary, inactive button, focus rule, and responsive behavior. Test active Meal Planner on `/meal-planner`, existing active Dashboard/Activity/Nutrition states, and unchanged sidebar geometry/structure.
- **Depends on:** T1.

### T4. Add the Meal Planner route and screen state owner

- **Files:** create `app/meal-planner/page.tsx` and `components/meal-planner/meal-planner-screen.tsx`.
- **Requirements:** R1-R3, R6, R7, R14-R15, R17, R20.
- Read the fixture from the established server-route boundary, render `MealPlannerScreen` inside `DashboardShell currentSection="Meal Planner"`, own search/selected-day/action/section state, and compose the exact topbar, target/CTA row, day selector, and meal-band order. Add isolated section-state wrappers with stable geometry and retry behavior. Do not add another shell or route.
- **Depends on:** T2-T3.

### T5. Implement the topbar and weekly target summary

- **Files:** modify `components/meal-planner/meal-planner-screen.tsx`.
- **Requirements:** R3-R4, R14, R17-R19.
- Render the heading, controlled search, Quick Add, calendar, notifications, weekly target values, three semantic progress bars, 82% ring, and `ON TRACK` label. Use Lucide/native controls, exact fixture formatting, accessible text equivalents, local/inert control behavior, and no remote assets or requests.
- **Depends on:** T2 and T4.

### T6. Implement the grocery CTA and bounded local feedback

- **Files:** modify `components/meal-planner/meal-planner-screen.tsx`.
- **Requirements:** R5, R13-R14, R17-R18.
- Render `Generate Grocery List` with the reference supporting copy and accessible grocery icon. Define one local polite feedback path or explicit inert behavior for the CTA, Quick Add, and floating actions. Verify route, selected day, targets, and plan remain unchanged and no request/storage/URL side effect occurs.
- **Depends on:** T4-T5.

### T7. Implement the day selector

- **Files:** modify `components/meal-planner/meal-planner-screen.tsx`.
- **Requirements:** R6, R14, R16-R17.
- Render the seven fixed day buttons with `Wed 14` selected initially. Implement pointer and keyboard selection, one-selected invariant, selected-day polite announcement, invalid-value rejection, and contained narrow-screen behavior without changing the full week grid.
- **Depends on:** T4.

### T8. Implement meal bands, cards, add slots, and favorite state

- **Files:** modify `components/meal-planner/meal-planner-screen.tsx`; add approved local visuals only in explicitly listed asset paths if required.
- **Requirements:** R7-R13, R16-R19.
- Build data-driven `MealBand`, `MealCard`, and `AddMealSlot` rendering for the exact seven-slot Breakfast, Lunch, and Dinner matrices. Preserve card/day/type association, stable dimensions, wrapped names, meaningful image alternatives, static Pan-Seared Scallops `FAVORITE`, two add slots, and bounded no-op feedback. Do not implement drag persistence, editor, favorite toggle, or remote images.
- **Depends on:** T2, T4, T7.

### T9. Add scoped responsive and accessibility styling

- **Files:** modify `app/globals.css` with `.meal-planner-*` rules only.
- **Requirements:** R2-R4, R7, R11-R13, R16-R19.
- Match the supplied desktop hierarchy and palette using existing tokens, stable card/progress/action dimensions, seven-column desktop layout, tablet reflow, mobile readable layout or contained planner scroll, focus-visible states, 44px targets, reduced-motion behavior, and no document overflow. Do not change `.avilo-sidebar-*`, existing screen CSS, or global tokens unless a reviewer documents unavoidable compatibility impact.
- **Depends on:** T5-T8.

### T10. Add focused component, privacy, and state coverage

- **Files:** create `tests/meal-planner/meal-planner-screen.test.tsx` and `tests/meal-planner/health-ai-safety.test.tsx`.
- **Requirements:** R1-R15, R17-R20.
- Cover route/composition/order, exact target values, target progress, CTA labels, day selection/announcement, exact meal/card counts/order, add-slot positions, favorite uniqueness/static behavior, accessible names/text equivalents, section loading/empty/error/retry isolation, state reset, unsafe-copy rejection, no remote image source, and no network/storage/URL side effects.
- **Depends on:** T2-T8.

### T11. Add responsive browser and visual evidence

- **Files:** create `e2e/meal-planner.spec.ts`; write screenshots/evidence only to the repository's approved evidence location if required by current E2E conventions.
- **Requirements:** R1-R3, R5-R7, R10-R17, R19-R20.
- Verify `/meal-planner` navigation and active sidebar state, exact visible composition, keyboard path, day selection, bounded actions, card/add-slot geometry, favorite state, sidebar reachability, no overlap/overflow, no external requests/storage/URL writes, reduced motion, touch targets, Axe, and screenshots at 1440x900, 1024x900, 768x900, and 390x844. Compare desktop hierarchy/proportions/color/card order with `C:\Users\gustt\AviloFitUI\meal-planner.png`.
- **Depends on:** T9-T10.

### T12. Run full verification and scope audit

- **Files:** update `progress/current.md` with exact results; no other product files.
- **Requirements:** R1-R20.
- Run the repository-documented `npm run lint`, `npm run typecheck`, focused Meal Planner/dashboard/activity tests, `npm run test`, `npm run test:e2e`, and `npm run build` as available. Record pass/fail counts, browser/evidence paths, Axe result, external-request/storage/URL result, and any environment-only rerun. Audit changed files against `design.md`; confirm no sidebar visual diff, no unrelated route/content/config/dependency/API/migration change, and every R1-R20 has evidence.
- **Depends on:** T1-T11.

### T13. Prepare the Reviewer handoff

- **Files:** update `progress/current.md` only.
- **Requirements:** R1-R2, R17-R20.
- List exact changed files, exact commands/results, screenshot paths, known fidelity tradeoffs for local assets, and rollback boundary. Keep the Notion item in `Review` only when the human workflow directs that transition; do not mark it `Completed` from implementation.
- **Depends on:** T12.

## Requirement-to-task traceability

| Requirement | Tasks |
| --- | --- |
| R1 | T1, T3-T4, T10-T13 |
| R2 | T1, T3, T9, T11-T13 |
| R3 | T4-T5, T9-T11 |
| R4 | T2, T5, T10-T12 |
| R5 | T6, T10-T12 |
| R6 | T2, T4, T7, T10-T12 |
| R7 | T2, T4, T8, T10-T12 |
| R8 | T2, T8, T10-T12 |
| R9 | T2, T8, T10-T12 |
| R10 | T2, T8, T10-T12 |
| R11 | T8-T12 |
| R12 | T8-T12 |
| R13 | T6, T8, T10-T12 |
| R14 | T2, T4, T6-T8, T10-T12 |
| R15 | T2, T4, T10-T12 |
| R16 | T7-T12 |
| R17 | T3-T12 |
| R18 | T2, T6, T8, T10-T12 |
| R19 | T1-T2, T5, T8-T9, T11-T12 |
| R20 | T1-T3, T10-T13 |

## Final stop conditions

The Implementer must stop and request `SPEC_CHANGE_REQUIRED` if satisfying a task requires a sidebar redesign or duplicate, another route, unrelated screen changes, a new package/configuration/environment/API/migration, remote runtime asset, real health data or permission, live AI/network/storage behavior, a new user-visible interaction contract, or any file outside the exact scope in `design.md`.

