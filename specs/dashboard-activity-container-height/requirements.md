# Dashboard Activity Container Height Requirements

## Work identity

- **Master Work item:** `Remove excess empty space from dashboard Activity container`
- **Notion:** `3a006edf-7ca0-811e-beb5-efaf265b0649`
- **Parent dashboard redesign:** `39e06edf-7ca0-81ba-8d25-cc966f35e9fb`
- **Outcome ancestry:** `Design the first six core user screens` -> `Complete the Avilo visual identity`
- **Branch:** `feature/dashboard-experience`
- **Status at authoring:** `Not Started`; this package is authored for human review in `Defining`.
- **Human reviewer:** Gustavo
- **Reference:** Gustavo's annotated Activity screenshot supplied with this work item.

## Problem and outcome

At desktop widths, the two-column dashboard grid stretches the muted Activity container to the height of the taller left column. The Activity disclosure has finished, but the muted shell continues through an unused lower band. The requested outcome is a content-driven Activity shell whose bottom edge follows the disclosure with the existing responsive bottom padding, while every Activity card, control, Summary element, progress card, and neighboring layout relationship remains unchanged.

## Scope

### In scope

- Remove only the unused lower band between the Activity disclosure and the muted Activity container's bottom edge.
- Preserve the current Activity header, controls, three large cards, three compact cards, disclosure, visual tokens, and responsive card grids.
- Preserve Summary and progress placement, geometry, content, and state handling.
- Preserve desktop two-column and tablet/mobile stacked behavior without clipping or horizontal overflow.
- Add focused rendered geometry coverage at 1440, 1024, 768, and 360 CSS pixels.

### Out of scope

- Moving, resizing, restyling, adding, or removing any Activity card, content, control, or disclosure text.
- Changing Summary, progress cards, utility rail, hero, navigation, data, fixtures, section states, accessibility labels, colors, contrast, APIs, persistence, authentication, or health-data behavior.
- Restoring equal bottom edges between the left column and Activity shell.
- New dependencies, breakpoints, components, or product behavior.

## Definitions

- **Activity shell:** The muted rounded `.activity-column` grid item surrounding `ActivitySummary`.
- **Disclosure tail:** The vertical distance from the disclosure's border-box bottom to the Activity shell's border-box bottom.
- **Intentional bottom padding:** Existing responsive `.activity-column` padding plus its one-pixel border: 29px at 1440, 25px at 1024, 23px at 768, and 15px at 360.
- **Content-driven height:** The Activity shell's rendered height is determined by its own content, padding, and border instead of the taller sibling grid item.
- **Preserved geometry:** A rendered element's x, y, width, and height differ by no more than 1 CSS pixel between the pre-change baseline and the implementation at the same viewport.

## Requirements

### R1 - Content-driven Activity shell

When `/dashboard` renders the ready Activity section, `.activity-column` must size to its own content at every required viewport. Its bottom edge must follow the disclosure with only the intentional bottom padding. The shell must not retain unused height solely to match the left column. If Activity content grows, wraps, loads, or changes within the existing model, the shell must expand in normal flow and contain it; content must never be clipped or overlaid.

**Evidence:** Rendered bounding-box and containment checks show the shell contains the disclosure and all Activity descendants, with no fixed height, max-height clipping, absolute positioning, or overflow concealment introduced.

### R2 - Measurable disclosure tail at four widths

At viewport heights sufficient to show the measured region, the disclosure tail must be:

| Viewport width | Required tail |
| --- | --- |
| 1440px | 29px +/- 1px |
| 1024px | 25px +/- 1px |
| 768px | 23px +/- 1px |
| 360px | 15px +/- 1px |

The measurement uses `activityColumn.getBoundingClientRect().bottom - disclosure.getBoundingClientRect().bottom`. No viewport may show a second blank band below this tail.

**Evidence:** Focused Playwright geometry assertions and full-page screenshots record the computed tail at all four widths.

### R3 - Activity content, controls, and card geometry preservation

The implementation must preserve the Activity heading and helper text, both icon controls and accessible names, all six existing cards, labels, values, trends, sparklines/progress indicators, dark Sleep treatment, and disclosure text. For each Activity card, x, y, width, and height must match a pre-change baseline at the same required viewport within 1 CSS pixel. No text, icon, chart, progress indicator, or focus outline may be clipped, overlapped, hidden, duplicated, or moved to another card.

**Evidence:** Existing component tests remain green; focused browser evidence records before/after card boxes, exact visible content, control accessibility, and screenshots at all four widths.

### R4 - Preserve neighboring grid and responsive relationships

The existing `.reference-grid` stretch contract must remain in place for neighboring layout compatibility, while `.activity-column` alone must opt out of cross-axis stretching and align at the start of its grid area. At 1440 and 1024, Activity remains the right grid item and its top aligns with `.dashboard-left-column` within 1 CSS pixel; its shorter bottom is intentional. At 768 and 360, Activity remains after the complete left column in normal flow with a 24px +/- 1px grid gap. Summary and progress card x, y, width, and height must preserve their pre-change geometry within 1 CSS pixel at all four widths.

**Evidence:** CSS readback confirms `.reference-grid` retains `align-items: stretch` and the Activity-only alignment rule. Browser assertions verify child order, top alignment or stack gap, and before/after Summary/progress geometry.

### R5 - No clipping, overlap, or horizontal overflow

At 1440, 1024, 768, and 360, the document and Activity shell must satisfy `scrollWidth <= clientWidth`; all Activity descendants must remain within the shell's horizontal bounds; and the shell must contain its final disclosure vertically. The Activity shell must not overlap Summary, progress, or following page content. Failure must remain visible through the existing section-state behavior rather than being masked by sizing or overflow rules.

**Evidence:** Focused browser assertions cover document/shell overflow, descendant containment, sibling non-overlap, and existing Activity non-ready state behavior.

### R6 - Accessibility and interaction preservation

The existing section heading relationship, Activity controls' keyboard access and accessible names, progressbar semantics, decorative icon treatment, reading order, and visible focus behavior must remain unchanged. The sizing correction must not add or remove interactive elements or alter tab order.

**Evidence:** Existing component/accessibility checks pass, focused keyboard checks reach both Activity controls without focus clipping, and the browser accessibility scan is run with any pre-existing unrelated findings reported separately.

### R7 - File, dependency, and rollback boundary

Implementation may modify only `app/globals.css` and `e2e/dashboard.spec.ts`. It must not change application markup, component logic, tests outside the focused E2E file, package manifests, dependencies, data, or unrelated styling. Rollback is the removal of the Activity-only alignment declaration and its focused E2E assertions; no migration or data recovery is required.

**Evidence:** Final changed-file inspection names only the two authorized files and package manifests are unchanged.

## Scenario coverage

- **Success:** Ready Activity content ends with the required disclosure tail at all four widths.
- **Empty/loading/failure/recovery:** Existing section-state rendering and retry behavior remain unchanged; the shell follows whichever existing state surface is rendered without clipping.
- **Boundary:** Long/wrapped disclosure at 360 remains contained and produces the 15px tail after its final line.
- **Concurrency/persistence:** Not applicable; this is presentational CSS with no asynchronous write or persisted state.
- **Permissions/security/privacy/health data:** No permission, data-access, retention, consent, or health-data handling changes are authorized.
- **Localization:** No copy changes are authorized; existing wrapping remains supported.
- **Performance/observability:** No runtime dependency or instrumentation is added; rendered geometry is the required observable evidence.

## Traceability

| Approved input | Requirements |
| --- | --- |
| Remove unused lower band beneath disclosure | R1, R2 |
| End with intentional bottom padding | R1, R2 |
| Preserve every Activity card/content/control | R3, R6 |
| Preserve Summary and progress placement | R4 |
| Preserve existing card dimensions and responsive behavior | R3, R4 |
| Handle current grid/stretch relationship explicitly | R4, R7 |
| Measure 1440/1024/768/360 with no clipping or overflow | R2, R5 |
| Keep scope narrow and reversible | R7 |

## Assumptions and derived requirements

- **Assumption:** Current source and the supplied annotated screenshot are the approved visual baseline; the red annotation marks the intended end region, not a new visible UI element.
- **Derived from R1/R4:** Preserve grid-level `align-items: stretch` and apply a scoped Activity override. This is necessary to avoid changing neighboring layout behavior while removing Activity's inherited height.
- **Derived from R2:** Tail values use existing padding plus the one-pixel shell border, making the acceptance geometry objective without introducing new spacing tokens.
- **Known unrelated condition:** Existing accessibility evidence reports a color-contrast finding for `#60706a` on the muted shell. This work must not change colors; the finding must be reported truthfully and must not be attributed to the height correction.
- **Open questions:** None that change behavior or scope.
