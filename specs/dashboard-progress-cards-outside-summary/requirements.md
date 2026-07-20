# Progress Cards Outside Summary Requirements

## Work identity

- **Master Work item:** `Place compact progress cards outside the muted Summary container`
- **Notion:** `3a006edf-7ca0-81ee-9d97-df5c3051d79d`
- **Parent specifications:** `specs/dashboard-compact-progress-cards/`, `specs/dashboard-reference-redesign/`
- **Branch:** `feature/dashboard-experience`
- **Authoring status:** `Not Started`; this package is ready to transition the item to `Defining`.
- **Human owner:** Gustavo

## Problem and outcome

The approved compact-card layout places `Fat Loss Progress` and `Protein Goal` beneath Summary, but the cards are currently visually and structurally enclosed by the muted rounded `.summary-column`. The correction preserves their left-column position and compact equal sizing while ending the muted Summary surface above them. Activity remains the right column.

## Scope

### In scope

- Change the dashboard composition so Summary and the progress row are siblings in the left-side layout region, with progress cards outside `.summary-column`.
- Preserve the two-card equal compact row, content, trends, synthetic data, and existing readiness behavior.
- Preserve Activity as the right-column region at desktop widths.
- Verify 1440px, 1024px, 768px, and 360px layouts for readability, grouping, and no horizontal overflow.

### Out of scope

- Changing Summary or Activity content, data, sizing, trends, or placement.
- Changing fixture/model contracts, persistence, APIs, authentication, real health data, contrast systems, or Git baseline.
- New dependencies, routes, components, or unrelated cleanup.

## Definitions

- **Muted Summary container:** The rounded element with class `.summary-column` and its muted background/border.
- **Outside:** A progress-card element is not a descendant of `.summary-column`; its visible white surface and DOM ancestor chain must be outside that element.
- **Left-column position:** The progress row occupies the same left grid track as Summary and immediately follows Summary in the normal document flow.
- **Compact equal row:** Exactly two progress articles use equal available-width tracks with preserved compact card sizing.

## Requirements

### R1 - Exact DOM and visual hierarchy

When the dashboard is ready, the main content must use a left-column wrapper containing, in order, `.summary-column` and a progress-row wrapper, followed by `.activity-column` as the right-column sibling at 1440px and 1024px. `GoalProgress` and both progress articles must not be descendants of `.summary-column`. The muted background must visibly terminate before the progress row, with normal-flow spacing between surfaces.

**Evidence:** Component test and browser DOM inspection show `.summary-column` and the progress wrapper as sibling descendants of the left grid track; computed bounds show the progress row begins below the Summary container and Activity remains the right region.

### R2 - Preserve compact cards and content

The progress row renders exactly two equal-width articles, `Fat Loss Progress` and `Protein Goal`, preserving their existing descriptions, values `4.2 kg` and `145 g/day`, percentages `53%` and `81%`, trend directions/icons, sizing, and synthetic fixture source. No text or metric may be clipped, hidden, duplicated, or reformatted by this change.

**Evidence:** Focused component assertions and computed geometry at 1440px and 1024px confirm exact content, two equal tracks, and visible card content.

### R3 - Activity preservation

The Activity region remains the right column at 1440px and 1024px and is not moved into the left-column wrapper or progress row. Its content and section-state handling remain unchanged.

**Evidence:** DOM region assertions identify `.activity-column` as the right grid child and existing Activity assertions continue to pass.

### R4 - Responsive reflow and no overflow

At 768px, the parent dashboard stacking behavior may place the left group before Activity, but Summary and progress remain grouped in that order and the two cards stay equal siblings when their minimum readable width fits. At 360px, cards must reflow to one column, remain readable and accessible, and never overlap, clip, or require horizontal scrolling. All four viewports must satisfy `scrollWidth <= clientWidth`.

**Evidence:** Browser checks at 1440, 1024, 768, and 360 verify bounds, order, visibility, and overflow.

### R5 - Accessibility and state preservation

The change preserves existing Summary, Progress, Activity, and main landmark semantics; meaningful card text remains available to assistive technology; trend icons remain decorative support; and existing ready/non-ready section behavior is retained. No information is conveyed only by trend color.

**Evidence:** Component/accessibility checks verify headings and labels, exactly one progress region in ready state, and the existing goal failure/retry surface when non-ready.

### R6 - File and dependency boundary

Implementation may modify only `components/dashboard/dashboard-screen.tsx`, `components/dashboard/goal-progress.tsx` if markup identification requires it, `app/globals.css`, `tests/dashboard/dashboard-screen.test.tsx`, and `e2e/dashboard.spec.ts`. No dependency or unrelated file may change.

**Evidence:** Final diff and manifest check show only the listed files and no dependency, fixture/model, contrast, or baseline changes.

## Traceability

| Requested behavior | Requirements |
| --- | --- |
| Same compact equal left-column position below Summary | R1, R2 |
| DOM/visual siblings outside muted `.summary-column` | R1 |
| Activity remains right column | R3 |
| Preserve content, sizing, trends, synthetic data | R2, R5 |
| Responsive 1440/1024/768/360 and no overflow | R4 |
| Exact files, no dependencies, no unrelated work | R6 |

## Assumptions and open questions

- Existing parent-spec content and current fixture values are authoritative.
- No open behavioral questions remain; the explicit DOM boundary resolves the parent spec's prior inside-container assumption.
