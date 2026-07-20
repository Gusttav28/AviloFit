# Progress Cards Outside Summary Design

## Design goals

Satisfy R1-R6 with a structural layout correction only. Keep existing progress rendering and data flow intact, move the muted background boundary above the cards, and reuse existing responsive breakpoints and card styles.

## Current-system observations

- `components/dashboard/dashboard-screen.tsx` currently nests `NutritionSummary` and `GoalProgress` in the same `.summary-column`.
- `components/dashboard/goal-progress.tsx` maps the existing synthetic `progressCards` array and preserves labels, values, percentages, and trend direction.
- `app/globals.css` owns `.reference-grid`, `.summary-column`, `.progress-row`, `.progress-card`, and responsive rules.

## Exact composition contract

The `.reference-grid` must have two children:

```text
.reference-grid
|- .dashboard-left-column
|  |- .summary-column
|  |  `- NutritionSummary / existing nutrition state surface
|  `- .progress-row (or an explicitly named equivalent progress wrapper)
|     |- article.progress-card: Fat Loss Progress
|     `- article.progress-card: Protein Goal
`- .activity-column
```

The progress wrapper is a DOM/visual sibling of `.summary-column`, not a descendant. The left wrapper is the left grid track and must not itself create a muted rounded background. Summary retains its existing muted surface; the progress row uses the existing white card surfaces below it. `GoalProgress` remains the owner of the progress row unless a minimal class/attribute adjustment is required for this boundary.

## Layout and data flow

`DashboardScreen` continues to receive `DashboardViewModel`, applies the existing `section()` state boundary, and renders Summary followed by goal progress within `.dashboard-left-column`. Activity remains in `.activity-column`. `GoalProgress` continues to receive `model.reference.progressCards`; no model, selector, formatter, fixture, or API changes are authorized.

- **1440px / 1024px:** left wrapper and Activity are grid siblings; progress has two equal `minmax(0, 1fr)` tracks below Summary.
- **768px:** follow the existing parent stacking rule; preserve Summary then progress order in the left group, retaining two tracks only when readable.
- **360px:** progress tracks become one column; card widths are constrained by the available left-group width.
- All layouts use normal flow, `min-width: 0`, existing gaps, and no fixed width or horizontal scroll.

## Invariants and failure behavior

- Ready goal state renders exactly two articles; non-ready goal state retains the existing `SectionState` boundary.
- Activity markup and state behavior are unchanged.
- Progress values remain fixture-derived and synthetic.
- If two tracks cannot meet readable content width, the row reflows; it must not clip or overflow.

## Authorized files

Modify only:

- `components/dashboard/dashboard-screen.tsx` for the exact wrapper and render order.
- `components/dashboard/goal-progress.tsx` only if a class/semantic hook is necessary; preserve content and props.
- `app/globals.css` for left-group layout, muted boundary, equal tracks, spacing, and responsive fallback.
- `tests/dashboard/dashboard-screen.test.tsx` for DOM/order/content assertions.
- `e2e/dashboard.spec.ts` for four-viewport geometry and overflow evidence.

Create no other implementation or test files. Do not add dependencies.

## Alternative considered

Using CSS grid placement to visually pull `.progress-row` below Summary while leaving it inside `.summary-column` was rejected: it violates the requested DOM boundary and leaves the muted surface enclosing the cards. Moving the existing render into a non-surfaced left wrapper is the smallest compliant change.

## Requirement-to-design mapping

| Requirement | Design coverage |
| --- | --- |
| R1 | Exact composition contract and normal-flow layout |
| R2 | Existing GoalProgress ownership and equal tracks |
| R3 | Two-child reference grid and unchanged Activity |
| R4 | Four-viewport responsive contract and overflow invariant |
| R5 | State/accessibility invariants |
| R6 | Authorized file list and dependency boundary |
