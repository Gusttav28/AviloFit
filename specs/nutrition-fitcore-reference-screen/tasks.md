# Nutrition Screen Implementation Tasks

## Preconditions

- Work item `3a606edf-7ca0-81c9-a674-ec3edd1045b4` is human-approved and moved from `Defining` to `In Progress`.
- The checked-out branch is exactly `develop`.
- Implementer reads this package plus the current dashboard/activity implementations before editing.
- No task below authorizes sidebar redesign, another destination, dependency changes, remote assets, or backend work.

## Ordered checklist

### T1. Confirm route and architecture

- Inspect current route, shell, sidebar, shared state, formatting, fixture, asset, and test conventions.
- Confirm exact files before editing and record any compatibility adjustment in progress evidence.
- Covers: R1, R2, R16, R17.

### T2. Add Nutrition domain model and deterministic fixture

- Create or extend the Nutrition feature model/provider using serializable local values from R4-R10.
- Represent section-ready/loading/empty/error states independently and keep health/AI copy bounded to educational demo language.
- Covers: R4-R10, R12, R15, R16.

### T3. Implement Nutrition route and shared shell integration

- Add the Nutrition route at the repository's established route location.
- Reuse the approved shell/sidebar and set Nutrition active without changing sidebar internals or adding other routes.
- Covers: R1, R2, R11, R14.

### T4. Implement topbar

- Build the FitCore-style heading, search field, Quick Add, notifications, and calendar controls with Lucide icons and accessible names.
- Keep non-specified actions local/inert and avoid new navigation or external effects.
- Covers: R3, R13, R14.

### T5. Implement Daily Calories and Macro Distribution

- Build the accessible calorie ring/card and macro card with exact fixture values, progress text, guidance, secondary nutrients, and micro-nutrient affordance.
- Ensure visual progress has text equivalents and stable responsive dimensions.
- Covers: R4, R5, R11, R14, R15.

### T6. Implement Hydration

- Build the hydration card with ten indicators, six filled by default, Add 250ml action, target cap, and polite live feedback.
- Verify increment is local-only and does not exceed target.
- Covers: R6, R11, R13-R15.

### T7. Implement Meal History and AI analysis

- Build the two reference meal rows, nutrition chips, date, edit affordances, and AI Nutritional Analysis callout with safety boundary.
- Use local/repository-approved visuals and meaningful alternatives.
- Covers: R7, R8, R11, R14, R15.

### T8. Implement AI Recommendations and Discover Recipes

- Build deterministic recommendation/tip content and recipe cards with Browse All affordance, local visuals, durations, names, and descriptors.
- Keep unsupported actions inert and avoid remote image loading.
- Covers: R9, R10, R13-R16.

### T9. Add independent state handling and accessibility polish

- Wire section-level loading, empty, error, and retry rendering using existing project patterns.
- Verify headings, landmarks, labels, focus, contrast, live status, text alternatives, and mobile reflow.
- Covers: R11-R14.

### T10. Verification evidence

- Add focused unit/component tests for fixture formatting, macro/calorie values, hydration increment/cap, safety copy, and section isolation.
- Add route/browser checks at desktop, tablet, and mobile widths for layout, sidebar active state, no overflow, no external requests, and no storage side effects.
- Run documented typecheck, lint, focused tests, dashboard/activity regression tests, build, and accessibility verification. Record outcomes in `progress/current.md`.
- Covers: R1-R17.

### T11. Final scope and handoff audit

- Confirm only Nutrition route/components/feature/tests/progress and any minimal scoped shared style changed.
- Confirm every R1-R17 has passing evidence and no unresolved ambiguity or unauthorized dependency/asset/network change.
- Hand off to Reviewer with exact changed files and commands/results; do not mark the Notion item Completed.
- Covers: R1-R17.

## Traceability matrix

| Requirement | Tasks |
| --- | --- |
| R1 | T1, T3, T10, T11 |
| R2 | T1, T3, T10, T11 |
| R3 | T4, T10 |
| R4 | T2, T5, T10 |
| R5 | T2, T5, T10 |
| R6 | T2, T6, T10 |
| R7 | T2, T7, T10 |
| R8 | T2, T7, T10 |
| R9 | T2, T8, T10 |
| R10 | T2, T8, T10 |
| R11 | T3, T5, T6, T7, T8, T9, T10 |
| R12 | T2, T9, T10 |
| R13 | T4, T6, T8, T10 |
| R14 | T3, T4, T5, T7, T9, T10 |
| R15 | T2, T5, T6, T7, T8, T10 |
| R16 | T1, T2, T8, T10, T11 |
| R17 | T1, T10, T11 |
