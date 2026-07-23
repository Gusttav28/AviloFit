# Recipes FitCore Reference Screen Tasks

## Execution Gate

- Governing work item `3a606edf-7ca0-8181-a90d-deb0eda6b5f5` has been reviewed by Gustavo and moved from `Defining` to `In Progress`.
- The checked-out branch is exactly `develop`.
- The Implementer reads `requirements.md`, `design.md`, `tasks.md`, current sidebar code, current Dashboard/Activity/Nutrition/Meal Planner implementations, and current dirty-worktree status before editing.
- No task authorizes a sidebar redesign, sidebar icon change, sidebar reorder, Meal Planner behavior change, new dependency, config change, secret change, backend/API work, persistence, real health-data behavior, or remote runtime asset.

## Ordered Implementation Checklist

### T1. Establish Baseline And Protect Scope

- **Files:** no product-file change; implementation evidence later in `progress/current.md`.
- **Requirements:** R1-R3, R20-R21.
- Confirm branch `develop`, governing work item, approved package, starting `git status --short`, existing Meal Planner dirty files, current sidebar order/roles/icons/classes, current package scripts, and allowed file list. Stop if unrelated user changes conflict with a listed file in a way that cannot be preserved.
- **Depends on:** Human approval and `In Progress` status.

### T2. Add Recipes Model, Fixture, And Format Helpers

- **Files:** create `features/recipes/model.ts`, `features/recipes/fixture-recipes-provider.ts`, `features/recipes/format.ts`, `tests/recipes/model.test.ts`, and `tests/recipes/format.test.ts`.
- **Requirements:** R4-R10, R14, R17, R19-R21.
- Encode exact topbar copy, hero content, trending entries, seasonal promo, filters, four recipe cards, metrics, default states, and local asset/neutral visual references. Return an isolated structured clone. Add pure formatting helpers and tests for exact values, order, cardinality, clone isolation, invalid-value bounds, no current time/random, no remote URLs, and no external dependencies.
- **Depends on:** T1.

### T3. Apply The Only Authorized Sidebar Change

- **Files:** modify `components/dashboard/contextual-utilities.tsx` and `tests/dashboard/navigation.test.tsx`.
- **Requirements:** R1-R3, R18, R21.
- Add `"Recipes"` to `DashboardSection`. Change only the existing `Course Release` primary item to label/accessibility name `Recipes`, preserve the existing `GraduationCap` icon, preserve its exact order after `Meal Planner`, add `href="/recipes"`, and use existing active semantics for `currentSection="Recipes"`. Update navigation tests for order, roles, href, active state, item counts, icon counts, settings separation, and existing Dashboard/Activity/Nutrition/Meal Planner behavior.
- **Depends on:** T1.

### T4. Update Existing Sidebar Assertions Without Changing Existing Screens

- **Files:** modify `tests/activity/activity-screen.test.tsx`, `tests/meal-planner/meal-planner-screen.test.tsx`, and any existing `e2e/dashboard.spec.ts`, `e2e/activity.spec.ts`, or `e2e/meal-planner.spec.ts` assertions only if they reference `Course Release`.
- **Requirements:** R2-R3, R21.
- Replace old global sidebar label expectations with `Recipes` only. Do not alter Activity or Meal Planner behavior assertions, fixtures, CSS, components, or route expectations.
- **Depends on:** T3.

### T5. Add The Recipes Route And Screen State Owner

- **Files:** create `app/recipes/page.tsx` and `components/recipes/recipes-screen.tsx`.
- **Requirements:** R1, R4, R8, R11-R17, R18-R21.
- Implement the route/provider/screen flow. Render `RecipesScreen` inside `DashboardShell currentSection="Recipes"`. Own search, selected filter, favorite, action message, and section states locally. Compose topbar, hero, discovery rail, filters, grid, and floating action in reference order. Do not render a second sidebar or change `DashboardShell` layout.
- **Depends on:** T2-T3.

### T6. Implement Topbar And Featured Hero

- **Files:** modify `components/recipes/recipes-screen.tsx`.
- **Requirements:** R4-R5, R13-R15, R18-R20.
- Render `Search elite recipes...`, `Calendar`, notification control, `Mediterranean Quinoa Salad`, `Featured Selection`, exact description, `15 Mins`, `420 Kcal`, `24g Protein`, and `Start Cooking`. Use Lucide/native controls, local images or neutral visuals, accessible names, and bounded local/inert action behavior.
- **Depends on:** T5.

### T7. Implement Trending And Seasonal Discovery

- **Files:** modify `components/recipes/recipes-screen.tsx`.
- **Requirements:** R6-R7, R15-R20.
- Render `Trending This Week` with three exact entries and `Seasonal: Spring Fuel` with exact copy and `Explore Seasonal`. Use local thumbnails or neutral visuals, stable dimensions, accessible text, and local/inert activation behavior.
- **Depends on:** T5.

### T8. Implement Filters

- **Files:** modify `components/recipes/recipes-screen.tsx`.
- **Requirements:** R8, R14-R18, R21.
- Render filters in exact order with `All` selected initially. Implement native button selection, one-selected invariant, accessible selected state, invalid-value rejection, contained horizontal overflow at narrow widths, and optional deterministic filtering only if tests define it.
- **Depends on:** T5.

### T9. Implement Recipe Cards, Favorites, Quick Add, And Floating Action

- **Files:** modify `components/recipes/recipes-screen.tsx`; add approved local visual assets only if explicitly accepted by the current repository asset process and listed in handoff.
- **Requirements:** R9-R13, R15-R20.
- Render the four exact cards, tags, times, metric blocks, favorite buttons, `Quick Add to Meal Planner` buttons, and one floating cooking action. Favorite may toggle only local mounted state. Quick-add and floating action must not mutate Meal Planner, navigate, persist, or send requests.
- **Depends on:** T2, T5, T8.

### T10. Add Scoped Recipes Styling

- **Files:** modify `app/globals.css` with `.recipes-*` rules only.
- **Requirements:** R2-R3, R5-R13, R16, R18-R20.
- Match the reference page hierarchy, pale canvas, black borders, green primary actions, white cards, hero overlay, discovery rail, chips, card metrics, stable dimensions, responsive reflow, focus states, reduced-motion behavior, and no document overflow. Do not edit `.avilo-sidebar-*`, `.meal-planner-*`, existing screen classes, shared tokens, or global config.
- **Depends on:** T6-T9.

### T11. Add Focused Component And Safety Coverage

- **Files:** create `tests/recipes/recipes-screen.test.tsx` and `tests/recipes/health-ai-safety.test.tsx`.
- **Requirements:** R1-R21.
- Cover route composition, `h1`, topbar, hero, trending, seasonal, filters, card count/order/metrics, favorite local toggle/reset, quick-add no-op, floating action, section loading/empty/error/retry isolation, local state preservation, accessible labels/states, no unsafe health/AI claims, no storage/network/URL side effects, no remote image sources, and sidebar preservation.
- **Depends on:** T5-T10.

### T12. Add Recipes Browser Verification

- **Files:** create `e2e/recipes.spec.ts`; write screenshots/evidence only to the repository's existing evidence location if current E2E conventions require artifacts.
- **Requirements:** R1-R3, R4-R18, R20-R21.
- Verify `/recipes` direct navigation, sidebar active state, exact sidebar order/geometry, Meal Planner route preservation, topbar keyboard path, filters, favorite local toggle, quick-add no-op, hero/discovery/card visibility, floating action reachability, no overlap/overflow, no external requests/storage/URL writes, reduced motion, touch targets, Axe, and screenshots at 1440x900, 1024x900, 768x900, and 390x844. Compare desktop hierarchy with `C:\Users\gustt\AviloFitUI\receipes.png`.
- **Depends on:** T10-T11.

### T13. Run Verification And Prepare Review Handoff

- **Files:** update `progress/current.md` only.
- **Requirements:** R1-R21.
- Run focused Recipes tests, sidebar/navigation tests, focused Activity and Meal Planner tests affected by the sidebar label, `npm run lint`, `npm run typecheck`, full unit/component tests, `npm run build`, focused Recipes Playwright, and full Playwright as available. Record pass/fail counts, command outputs, screenshot/evidence paths, external-request/storage/URL results, Axe result, package/config diff audit, changed-file audit, sidebar CSS audit, Meal Planner protection result, local asset tradeoffs, and rollback boundary. Move the Notion item to `Review`, assign Gustavo, and do not mark it `Completed`.
- **Depends on:** T1-T12.

## Requirement-To-Task Traceability

| Requirement | Tasks |
| --- | --- |
| R1 | T1, T3, T5, T11-T13 |
| R2 | T1, T3-T4, T10-T13 |
| R3 | T1, T4, T12-T13 |
| R4 | T2, T5-T6, T11-T13 |
| R5 | T2, T6, T10-T13 |
| R6 | T2, T7, T10-T13 |
| R7 | T2, T7, T10-T13 |
| R8 | T2, T5, T8, T10-T13 |
| R9 | T2, T9-T13 |
| R10 | T2, T9, T11-T13 |
| R11 | T5, T9, T11-T13 |
| R12 | T9, T11-T13 |
| R13 | T6, T9-T13 |
| R14 | T2, T5, T8-T13 |
| R15 | T5-T13 |
| R16 | T8-T13 |
| R17 | T2, T5, T11-T13 |
| R18 | T3, T5-T13 |
| R19 | T2, T5-T13 |
| R20 | T1-T2, T6-T13 |
| R21 | T1-T13 |

## Final Verification Checklist

- Exactly the approved Recipes route and narrow sidebar rename/link/current-state behavior were implemented.
- No sidebar icon, style, class, order, dimensions, profile, settings, brand, or responsive behavior changed.
- Existing Meal Planner dirty work remains intact and passing.
- No dependency, config, lockfile, secret, backend, database, migration, telemetry, AI/model, storage, or remote runtime asset was added.
- Every R1-R21 has passing evidence.
- The Notion item is moved to `Review`, assigned to Gustavo, with implementation evidence in `Latest Update`; it is not moved to `Completed`.

## Stop Conditions

The Implementer must stop and request `SPEC_CHANGE_REQUIRED` if satisfying any task requires a sidebar redesign or duplicate, sidebar icon change, sidebar reorder, Meal Planner behavior change, another route, unrelated screen changes, new package/config/environment/API/migration/secret work, runtime remote assets, real health data, live AI/network/storage behavior, or a new user-visible interaction contract not described by this package.
