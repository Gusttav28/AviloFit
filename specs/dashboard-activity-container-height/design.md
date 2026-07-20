# Dashboard Activity Container Height Design

## Design goals

Satisfy R1-R7 with one scoped layout rule and focused rendered verification. The Activity shell becomes intrinsically tall while the established dashboard grid, left column, cards, state boundaries, and responsive spacing remain intact.

## Current-system observations

- `components/dashboard/dashboard-screen.tsx` renders `.dashboard-left-column` and `.activity-column` as the two direct children of `.reference-grid`; no markup change is needed.
- `components/dashboard/activity-summary.tsx` renders the heading, controls, large grid, compact grid, and disclosure in normal flow; no component change is needed.
- `app/globals.css` sets `.reference-grid { align-items: stretch; }`, which stretches `.activity-column` to the grid row height at desktop widths when the left column is taller.
- `.activity-column` already owns responsive padding of 28px at 1440, 24px at 1024, 22px at 768, and 14px at 360. Including its border, those tokens produce the required 29/25/23/15px disclosure tails.
- At stacked widths the current Activity shell already has a content-driven tail; the new rule must preserve that behavior.
- The current E2E suite already iterates 360, 768, 1024, and 1440 and checks neighboring progress/card layout and document overflow.

## Exact implementation design

Keep `.reference-grid { align-items: stretch; }` unchanged. In `app/globals.css`, add a scoped cross-axis override to the existing `.activity-column` rule so that this grid item uses start alignment rather than the inherited stretch. The declaration must be equivalent in behavior to `align-self: start`; do not set a fixed/minimum/maximum height, hide overflow, position the shell, or change padding.

This leaves the grid row sized by the taller direct child while allowing Activity to use its max-content block size. At desktop widths, both columns retain their shared top edge but no longer share a forced bottom edge. At stacked widths, the grid's 24px row gap remains the sole spacing between the left column and Activity.

## Geometry contract

The focused browser check must capture pre-change and post-change boxes for `.activity-column`, `.activity-section .disclosure`, every `.activity-metric`, `.dashboard-left-column`, `.summary-column`, `.progress-row`, and `.reference-grid`.

- **1440:** Activity/right-column top aligns with the left column; disclosure tail is 29px +/- 1px.
- **1024:** Activity/right-column top aligns with the left column; disclosure tail is 25px +/- 1px.
- **768:** Activity follows the left column by 24px +/- 1px; disclosure tail is 23px +/- 1px.
- **360:** Activity follows the left column by 24px +/- 1px; wrapped disclosure tail is 15px +/- 1px.
- At every width, Activity card and left-column/Summary/progress geometry is unchanged within 1 CSS pixel, document and Activity horizontal overflow are non-positive, and the shell bottom contains the disclosure.

## Components, interfaces, and data flow

No component, TypeScript interface, prop, route, event, schema, fixture, state transition, API, or data flow changes. `DashboardScreen` continues to pass `model.reference.activityCards` to `ActivitySummary`; existing ready/loading/empty/failure handling remains owned by `section()` and `SectionState`.

## Exact file scope

Modify only:

- `app/globals.css`: add the Activity-only cross-axis alignment behavior without changing grid stretch, padding, card styling, breakpoints, or neighboring selectors.
- `e2e/dashboard.spec.ts`: add or extend focused four-width geometry, containment, card-preservation, keyboard, and overflow assertions.

Create no implementation or test files. Do not modify `components/dashboard/dashboard-screen.tsx`, `components/dashboard/activity-summary.tsx`, Summary/progress components, fixtures, unit tests, manifests, configuration, or package locks.

## Invariants and failure behavior

- Activity content remains in normal document flow and determines shell height.
- Existing padding and border produce the bottom tail; no compensating margin or pseudo-element is allowed.
- The shell expands for wrapped or state-surface content and never masks failures through clipping.
- `.reference-grid` remains stretched; only Activity opts out.
- Activity remains second in DOM reading order and right/stacked placement follows existing breakpoints.
- Existing accessibility semantics, focus behavior, and content remain unchanged.

## Compatibility, performance, privacy, and rollback

- Use existing CSS Grid support; no browser-specific feature or dependency is needed.
- The change affects layout calculation only and adds no network, storage, data, health-data, security, privacy, logging, or migration behavior.
- Roll back by removing the scoped Activity alignment declaration and focused assertions. No data rollback exists.

## Alternatives considered

### Change `.reference-grid` to `align-items: start`

Rejected because it changes the cross-axis contract for both direct children and could disturb the previously approved left-column/stretch relationship. R4 requires a scoped Activity correction.

### Set an explicit Activity height or max-height

Rejected because fixed geometry would fail wrapped content and responsive/state variants, and could clip content contrary to R1 and R5.

### Use negative margin, transform, absolute positioning, or hidden overflow

Rejected because these approaches only conceal the band, remove content from normal flow, and risk overlap or focus clipping.

### Reduce `.activity-column` bottom padding

Rejected because the existing responsive padding is already intentional; the defect is inherited stretch, not excessive padding.

## Requirement-to-design mapping

| Requirement | Design coverage |
| --- | --- |
| R1 | Scoped intrinsic Activity sizing and normal-flow invariants |
| R2 | Existing padding-derived four-width tail contract |
| R3 | No component/card changes and before/after geometry evidence |
| R4 | Preserve grid stretch; Activity-only start alignment and placement checks |
| R5 | Containment, non-overlap, and overflow assertions |
| R6 | Unchanged semantics plus focused keyboard/accessibility evidence |
| R7 | Exact two-file scope, no dependencies, simple rollback |
