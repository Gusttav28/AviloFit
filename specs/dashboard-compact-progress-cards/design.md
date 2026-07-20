# Compact Progress Cards Design

## Design goals

Satisfy R1-R6 with the smallest structural change: make the existing progress component a child of the Summary column, retain its fixture-driven props, and use a two-track compact grid that reflows at the existing responsive breakpoints.

## Current-system observations

- `components/dashboard/dashboard-screen.tsx` renders `.progress-row` after `.reference-grid`, causing full-dashboard placement.
- `components/dashboard/goal-progress.tsx` already renders both cards from `model.reference.progressCards` and preserves descriptions, values, percentages, and trend icon direction.
- `features/dashboard/fixture-dashboard-provider.ts` already contains the approved synthetic values.
- `app/globals.css` owns `.reference-grid`, `.summary-column`, `.progress-row`, `.progress-card`, and responsive rules.

## Authorized file scope

Modify only:

- `components/dashboard/dashboard-screen.tsx`: move the existing `GoalProgress` render into `.summary-column`, after `NutritionSummary`.
- `components/dashboard/goal-progress.tsx`: adjust only markup/class semantics needed to identify the compact supporting row; preserve props, text, trend mapping, and accessibility.
- `app/globals.css`: define compact row spacing, equal tracks, card sizing, and responsive reflow at the existing breakpoints.
- `tests/dashboard/dashboard-screen.test.tsx`: add assertions for placement/order and preserved content.
- `e2e/dashboard.spec.ts`: add responsive geometry and overflow checks at 1440, 1024, 768, and 360.

Create only the three specification files in this package. Do not modify fixture/model files because R3 requires their current values to remain unchanged. Do not add dependencies.

## Layout and data flow

`DashboardScreen` continues to receive `DashboardViewModel`. The existing `section("goal", ...)` wrapper remains the readiness/error boundary, but its resulting `GoalProgress` element is placed immediately after `NutritionSummary` within `.summary-column`. `.activity-column` and `ActivitySummary` remain unchanged. `GoalProgress` continues to map the existing two-card array and the existing `TrendingDown`/`TrendingUp` choice.

The progress row is a two-column grid at desktop/tablet widths where two cards fit. The tracks must be equal (`minmax(0, 1fr)` or equivalent), with a fixed small gap and compact padding/min-height. The row must remain inside the muted Summary column and inherit the existing card visual language.

Responsive contract:

- **1440px:** two equal cards below Summary; Activity is the right sibling column; no overflow.
- **1024px:** two equal cards below Summary within the narrower left column; text and values remain inside cards; no overflow.
- **768px:** preserve the parent one-column dashboard stacking behavior; progress cards stay grouped below Summary and use two equal tracks only if their minimum readable width fits.
- **360px:** one progress card per row is the required fallback; cards span the available Summary-column content width; no horizontal overflow or overlap.

## Invariants and failure behavior

- `model.reference.progressCards` remains the sole source for progress values and descriptions.
- No card is duplicated: exactly two progress articles render in the ready state.
- A non-ready `goal` state still uses the existing `SectionState` behavior and does not introduce a second error surface.
- Existing section accessibility labels and headings remain intact. Trend icons remain decorative and text remains the source of meaning.
- If a breakpoint calculation would make content overflow, the layout must reflow to one column; it must never use horizontal scrolling or clipped fixed widths.

## Alternative considered

Keeping `.progress-row` after `.reference-grid` and using CSS placement to visually pull it under Summary was rejected because it breaks the requested DOM hierarchy, risks overlap at responsive widths, and makes the Activity/progress relationship harder to verify. Moving the existing render into the Summary column satisfies R1 with fewer layout exceptions.

## Requirement-to-design mapping

| Requirement | Design coverage |
| --- | --- |
| R1 | Render order and Summary-column ownership |
| R2 | Equal grid tracks and compact sizing |
| R3 | Existing `GoalProgress` props and fixture/model invariants |
| R4 | Explicit four-viewport breakpoint contract and one-column fallback |
| R5 | Existing semantics, decorative icons, focus and readable flow |
| R6 | Authorized file list and no-dependency boundary |
