# Compact Progress Cards Requirements

## Work identity

- **Master Work item:** `Reposition compact progress goal cards beneath dashboard Summary`
- **Notion:** `3a006edf-7ca0-81d0-a201-c66a4ebf3f10`
- **Parent specification:** `specs/dashboard-reference-redesign/`
- **Branch:** `feature/dashboard-experience`
- **Status at authoring:** `Not Started`; this package is authored to transition the item to `Defining`.
- **Owner for review:** Gustavo

## Problem and outcome

The existing dashboard renders the two goal cards after the full Summary/Activity region. The requested correction makes `Fat Loss Progress` and `Protein Goal` equal compact cards directly beneath the white Summary card, within the left muted Summary section. Activity remains in the right column. The result is a readable, screenshot-faithful dashboard hierarchy without new product behavior.

## Scope

### In scope

- Move the existing progress-card region into the left Summary column, directly after the white Summary card.
- Render the two cards side by side at desktop widths, equal in width and compact in height.
- Preserve labels, descriptions, values `4.2 kg` and `145 g/day`, percentages `53%` and `81%`, trend icons/directions, synthetic fixture data, and existing accessibility semantics.
- Define responsive behavior and verify no horizontal overflow at 1440, 1024, 768, and 360 CSS pixels.

### Out of scope

- Changes to Activity placement or content.
- Changes to Summary content, labels, data values, trend meaning, persistence, APIs, backend, authentication, health integrations, or real health data.
- New dependencies, new visual systems, new dashboard capabilities, or implementation outside the exact files in `design.md`.

## Definitions

- **White Summary card:** Existing `.summary-card` surface containing the Summary metrics and macro visualization.
- **Left muted Summary section:** Existing `.summary-column` container that visually groups the Summary card and its supporting cards.
- **Compact card:** A bounded supporting metric card with equal sibling width, reduced vertical footprint relative to the main Summary card, and all required content visible without clipping.
- **Directly beneath:** The progress row follows the Summary card in normal document flow with the approved vertical spacing; it is not placed below the right Activity column or positioned independently of the Summary column.

## Requirements

### R1 - Correct hierarchy and placement

When `/dashboard` is ready at 1440px and 1024px viewport widths, the system must render `Fat Loss Progress` and `Protein Goal` directly after the white Summary card inside the left muted Summary section. Activity must remain in the right column at these widths. The progress row must not span the full dashboard grid.

**Evidence:** Desktop screenshots and DOM/layout assertions show both cards as descendants of the Summary column, after `.summary-card`, while Activity remains a sibling right column.

### R2 - Equal compact cards

The two progress cards must use equal grid tracks and equal rendered widths within their row. Their height and padding must be compact relative to the Summary card, with no required content clipped or hidden.

**Evidence:** Computed geometry at 1440px and 1024px confirms equal widths and visible card content.

### R3 - Content preservation

The cards must preserve these exact visible values and labels: `Fat Loss Progress`, `4.2 kg`, `53%`; and `Protein Goal`, `145 g/day`, `81%`. Existing descriptions and trend icon directions must remain unchanged. Data remains deterministic and synthetic.

**Evidence:** Component and existing safety/model tests assert all strings and values; fixture inspection confirms no data-source change.

### R4 - Responsive behavior

At 768px, the Summary and Activity columns may stack according to the parent dashboard responsive layout, but the two progress cards must remain together within the Summary section and remain equal-width siblings when space permits. At 360px, they must stack into one column or otherwise reflow without clipping, overlap, or horizontal overflow; each card remains readable and accessible.

**Evidence:** Responsive browser checks at 768px and 360px record card bounding boxes, visibility, and `scrollWidth <= clientWidth`.

### R5 - Accessibility and interaction preservation

The change must preserve the existing semantic section/heading structure, meaningful card text, trend icons as decorative where appropriate, keyboard focus behavior for any interactive descendants, and visible focus styling. No information may be conveyed only by color or trend icon.

**Evidence:** Existing dashboard accessibility/component tests pass, and responsive keyboard/screenshot checks show readable labels and no focus clipping.

### R6 - Scope and dependency boundary

Implementation must use the existing dashboard components, CSS, fixture model, and test harness only. No dependency, API, persistence, authentication, real health-data, or unrelated dashboard change may be introduced.

**Evidence:** Changed-file and dependency diff review shows only the files listed in `design.md` and no package manifest changes.

## Traceability

| Approved input | Requirements |
| --- | --- |
| Equal compact cards side by side beneath Summary | R1, R2 |
| Inside left muted Summary section; Activity stays right | R1 |
| Preserve labels, descriptions, values, percentages, trends | R3 |
| Preserve synthetic data and accessibility | R3, R5 |
| Responsive behavior at 1440/1024/768/360 with no overflow | R2, R4, R5 |
| Exact files/tests and no dependencies | R6 |

## Assumptions and derived requirements

- **Assumption:** Existing Summary, Activity, fixture, and progress-card content are the approved baseline from the parent specification.
- **Derived:** Normal document flow is required for placement (R1) because it is necessary to verify the requested hierarchy and responsive reflow without changing behavior.
- **Open questions:** None that alter scope or user-visible behavior.
