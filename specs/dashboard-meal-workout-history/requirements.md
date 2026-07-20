# Dashboard Meal Recipe and Workout History Requirements

## Work identity

- **Master Work item:** `Add meal recipe and workout history panel to dashboard`
- **Notion:** `3a006edf-7ca0-8149-ad04-f0090bcaf9f5`
- **Parent dashboard redesign:** `39e06edf-7ca0-81ba-8d25-cc966f35e9fb`
- **Outcome ancestry:** `Design the first six core user screens` -> `Complete the Avilo visual identity`
- **Branch:** `feature/dashboard-experience`
- **Status at authoring:** `Not Started`; this package is authored for human review in `Defining`.
- **Human reviewer:** Gustavo
- **Visual references:** Gustavo's compact history-table and seven-day date-strip images supplied in the governing Codex task.

## Problem and intended outcome

The redesigned dashboard currently ends the right column after the content-height Activity shell while the left column continues with compact Fat Loss Progress and Protein Goal cards. Users need a compact, date-filtered record of demo Avilo meal recommendations paired with workout and recipe calories and an estimated recipe price. The result must add one white history panel immediately below Activity, visually beside the left progress cards, without moving or resizing existing dashboard content above it.

This is a deterministic presentation feature. It does not create a meal-planning, workout-tracking, purchasing, billing, or health-record workflow.

## Scope

### In scope

- Add one white `Meal Recipes & Workout` panel below Activity in the existing right dashboard column.
- Add a compact Sunday-through-Saturday selector with a numeric `MM / YYYY` label, previous/next week buttons, weekday initials, date buttons, and a soft green selected-date pill.
- Filter four-column history rows by the selected date.
- Show deterministic demo pairings with signed workout and recipe calories and locale-formatted estimated recipe prices.
- Integrate loading, empty, and failure states with the existing independent section-state machinery.
- Add focused component, model, formatter, accessibility, and responsive browser verification at 1440, 1024, 768, and 360 CSS pixels.

### Out of scope

- Backend, API, database, persistence, authentication, user accounts, live AI calls, health integrations, real activity or nutrition records, or personal health data.
- Creating, editing, buying, billing, ordering, exporting, or opening a recipe or workout from this panel.
- Medical advice, diagnosis, outcome claims, calorie-balance claims, or language that represents the demo pairing as clinical guidance.
- Changes to existing Summary, Activity, progress-card, navigation, hero, utility-rail, color-token, contrast, or breakpoint behavior except the minimum composition and styles required for this panel.
- New dependencies, routes, dialogs, nested cards, or unrelated cleanup.

## Definitions

- **History panel:** The new standalone white surface titled `Meal Recipes & Workout`; it is a sibling after the muted Activity shell, not a child card inside Activity.
- **Right dashboard column:** A transparent layout wrapper occupying the current second grid track and containing Activity first and the history panel second.
- **Week window:** Seven consecutive local calendar dates from Sunday through Saturday.
- **Selected date:** The one date whose button is pressed, whose month/year drives the header, and whose matching history entries are visible.
- **History pairing:** One deterministic demo row connecting a meal context label, a recipe title, a negative workout calorie amount, a positive recipe calorie amount, and the recipe's estimated demo price for one date.
- **Estimated demo price:** Presentation-only fixture data formatted through the model's existing `locale` and `currency`; it is not a charge, quote, purchase, or billing amount.
- **Preserved geometry:** For an existing element above the history insertion point, its rendered x, y, width, and height differ by no more than 1 CSS pixel from the approved pre-change baseline at the same viewport.

## Requirements

### R1 - Placement and preservation

When `/dashboard` renders at 1440px or 1024px, the system must keep the existing two-track dashboard geometry and render a transparent right-column wrapper in the current right grid area. The content-height muted Activity shell must remain first in that wrapper. The standalone white history panel must follow it in normal flow with a 16px gap and must be visually beside the left Fat Loss Progress / Protein Goal region. The history panel must not be nested inside the Activity shell or either progress card. At 768px and 360px, the existing grid must stack the complete left column before the right wrapper; inside the right wrapper, Activity must remain before history with the same 16px gap. Existing hero, Summary, Activity, and progress-card boxes above the insertion point must preserve their baseline geometry within 1 CSS pixel.

**Evidence:** DOM ownership/order assertions, four-width bounding-box comparisons, and screenshots show the right wrapper, Activity-first/history-second order, desktop side-by-side relationship, stacked order, and preserved existing boxes.

### R2 - Panel identity and visual structure

The ready panel must be one white surface using existing dashboard surface, border, shadow, radius, spacing, typography, and color tokens. It must display the exact title `Meal Recipes & Workout` and exact subtitle `Avilo Fit Recipes History`. The date selector and table are unframed internal regions of this surface; they must not become nested cards. No decorative gradient, new palette, unrelated contrast change, or non-token color may be introduced. Long text must wrap or truncate only where explicitly allowed by R10 and must never overlap another element.

**Evidence:** Component assertions and screenshots confirm exact copy, one outer white panel, no nested surface/card wrappers, token reuse, and non-overlap.

### R3 - Deterministic model and provider contract

The existing dashboard model/provider architecture must expose a presentation-only history dataset under `DashboardReferenceData`. Each entry must have a stable ID, ISO `YYYY-MM-DD` date, meal name, recipe title, signed integer `workoutCalories` less than zero, signed integer `recipeCalories` greater than zero, and non-negative numeric `price`. The history dataset must also expose an initial selected date and a Sunday/Saturday-aligned available date range. `DashboardSectionName` and `sectionStates` must include `history`. The fixture provider must return an isolated structured clone, and all data must remain deterministic, local, and synthetic.

**Evidence:** Type inspection and model tests prove the field contract, sign/range invariants, `history` state, deterministic values, and clone isolation.

### R4 - Seven-day selector appearance and date semantics

The selector must show a numeric month/year label in exact `MM / YYYY` order with a two-digit month and no month name. It must render weekday initials in Sunday-through-Saturday order as `S M T W T F S`, with one selectable date beneath each initial. The visible window must always contain exactly seven consecutive dates beginning Sunday. The header must reflect the selected date's month and year, including when the visible week spans two months or years. The selected date must use a soft green vertical pill treatment and must also be identifiable without color through shape, text, and programmatic state.

**Evidence:** Formatter/component tests cover `07 / 2026`, weekday/date order, seven consecutive dates, a cross-month week, and the visible/programmatic selected state.

### R5 - Previous and next week navigation

The selector must use existing Lucide `ChevronLeft` and `ChevronRight` icons in native icon buttons with accessible names `Previous week` and `Next week`. Activating either button must move the week window and selected date exactly seven calendar days backward or forward, preserving the selected weekday, updating the `MM / YYYY` label, and immediately filtering rows for the new selected date. A navigation button must be disabled when its target selected date would fall outside the fixture's available date range. Navigation must use date-only calendar arithmetic that does not drift because of browser locale, daylight-saving changes, or the dashboard time zone.

**Evidence:** Interaction tests activate both buttons, assert +/-7-day selection and row filtering, verify cross-month/year labels, disabled boundaries, and run with the fixture time zone.

### R6 - Direct date selection and filtering

Activating an enabled date button must set that date as selected and show only entries whose ISO date exactly matches it. Selection must not mutate or persist provider data, navigate away, open a dialog, or invent another workflow. Focus must remain on the activated control and no automatic focus jump to the table is permitted. Dates outside the available range, if visible in a boundary week, must be disabled and must not change selection.

**Evidence:** Component tests select populated, empty, and disabled dates; assert `aria-pressed`, focus retention, exact row changes, and absence of navigation/dialog behavior.

### R7 - Compact four-column table

The ready panel must render a semantic table closely matching the density and hierarchy of the supplied compact reference. Its columns, in exact order, must be `Meal Name`, `Recipe`, `Value`, and `Price`. The table must have a date-specific screen-reader caption, column headers with `scope="col"`, stable row keys, restrained separators, and tabular numerals for numeric values. It must not add Activity, Ref, Status, Date, actions, row menus, links, checkboxes, purchase controls, or another column.

**Evidence:** Semantic queries assert the table, caption, four exact headers/order, header scope, row count, and absence of out-of-scope controls/columns.

### R8 - Exact initial demo rows, signed values, and price formatting

The initial selected date must be `2026-07-13`, within the visible Sunday `2026-07-12` through Saturday `2026-07-18` window, and show exactly these two rows in this order:

| Meal Name | Recipe | Workout calories | Recipe calories | Price |
| --- | --- | ---: | ---: | ---: |
| Post-workout lunch | Herby chickpea bowl | -450 kcal | +420 kcal | 6.80 |
| Afternoon recovery | Cocoa banana bites | -210 kcal | +420 kcal | 2.60 |

Within each `Value` cell, both visible lines must name their meaning and include an explicit sign: `Workout -450 kcal` / `Recipe +420 kcal`, and `Workout -210 kcal` / `Recipe +420 kcal`. Sign or meaning must not depend on red/green color alone. `Price` must use the existing `formatCurrency` helper with `locale = en-US` and `currency = USD`, producing `$6.80` and `$2.60` for the initial fixture. The component must not label these amounts as savings, charges, totals, balances, or purchase prices.

The fixture must additionally include `Recovery breakfast` / `Garden egg toast` on `2026-07-12` (-320/+420 kcal, 4.70), `Morning meal` / `Apple overnight oats` on `2026-07-14` (-280/+420 kcal, 3.90), and `Midday refuel` / `Roasted veggie wrap` on `2026-07-15` (-390/+420 kcal, 5.70). `2026-07-16` must intentionally have no entries for empty-state verification. The available range must be `2026-06-28` through `2026-07-25`.

**Evidence:** Fixture, formatter, component, and screenshot checks assert exact initial/order content, additional date filtering, explicit signs/labels, locale prices, and the intentional empty date.

### R9 - Loading, empty, failure, and recovery behavior

The history section must use the existing `DashboardScreen` section-state machinery and `SectionState` behavior independently of nutrition, goal, and activity. For `loading`, expose `history is loading.` to assistive technology and render the existing skeleton treatment. For a section-level `empty`, show the existing no-data message. For `error`, expose the existing alert message and `Retry section` button; retry changes only `history` to `ready` and leaves every other section state unchanged. Separately, when a ready dataset has no entries for the selected date, keep the title and date selector visible, omit data rows, and show `No meal and workout history for this date.` in a polite status region.

**Evidence:** Dashboard state-loop tests include `history`; focused component tests cover date-level empty state; retry tests prove independent recovery and no sibling-state mutation.

### R10 - Responsive table and overflow behavior

At 1440px and 1024px, all four table columns must fit within the panel with no panel or document horizontal overflow. At 768px, the stacked panel must use the available content width and retain the four-column table without clipping. At 360px, the panel and document must remain within the viewport; the table must keep a readable minimum width and scroll horizontally only inside a labelled, keyboard-focusable table overflow region. The title, subtitle, month/year, arrow controls, seven date targets, empty/failure content, and focus rings must fit without overlap. Recipe and meal names may wrap to two lines at 1440/1024/768; at 360 the table cells retain readable intrinsic width instead of collapsing text letter-by-letter. No page-level horizontal scroll is allowed.

**Evidence:** Four-width browser assertions cover panel/table/document `scrollWidth`, local overflow at 360, cell bounds, focus-ring containment, text overlap, and screenshots.

### R11 - Keyboard and focus behavior

All week and date controls must be native buttons reachable in logical DOM order: previous week, next week, then Sunday through Saturday dates. Every enabled control must activate with Enter and Space and use the existing visible `:focus-visible` treatment without changing layout bounds. Disabled controls must be skipped by activation and expose native disabled semantics. The table overflow region must be keyboard reachable and horizontally scrollable at 360. No custom arrow-key roving behavior is required, and no control may trap focus.

**Evidence:** Component and Playwright keyboard paths verify order, Enter/Space activation, disabled behavior, visible unclipped focus, overflow-region reachability, and escape from the panel.

### R12 - Screen-reader and non-color accessibility

The panel must be a labelled section associated with its heading. Each date button must expose its full localized date, selected state through `aria-pressed`, and `aria-current="date"` only when selected; weekday initials may be hidden from assistive technology when the full date label is present. The selected-date/result change must be announced through one polite live status containing the localized date and result count. The table caption must identify the selected date. Workout and recipe values must include textual labels and signs. Decorative Lucide icons must be hidden from assistive technology. Focus order must follow visual reading order, and the implementation must introduce no serious or critical Axe finding.

**Evidence:** Accessibility queries, live-region assertions, keyboard checks, and Axe scans at all four widths verify semantics without relying on color.

### R13 - Privacy, health, safety, and workflow boundary

The panel must identify its content as deterministic demo history through the existing dashboard demo-data context or a concise panel disclosure if needed for safety-test clarity. It must not read or write storage, call a network service, invoke AI, use connected-health provenance, collect consent, create an audit trail, or process real personal or health data. It must not claim that workout calories offset recipe calories or that the pairing produces a health outcome. No authorization, retention, migration, telemetry, or billing behavior is introduced.

**Evidence:** Safety/component inspection and tests find only fixture data and no network/storage/AI/connected-health/purchase language or behavior.

### R14 - Localization, compatibility, performance, and reliability

Date labels, full accessible dates, signed calorie numbers, and prices must use the dashboard model's `locale`, `currency`, and `timeZone` through shared formatter behavior. The visible month/year remains `MM / YYYY` as required even when other locale formatting differs. Rendering and filtering must be in-memory over the small fixture array with no timers, random values, hydration-dependent date defaults, animation requirement, or external assets. Existing reduced-motion behavior and supported browser/toolchain compatibility must remain unchanged.

**Evidence:** Formatter tests cover locale/time-zone stability and signed output; source inspection confirms deterministic in-memory filtering and no asynchronous/external behavior.

### R15 - File, dependency, verification, and rollback boundary

Implementation may modify or create only the files listed in `design.md`. It must not change package manifests, lockfiles, build configuration, routes, unrelated components/tests, existing color tokens, or prior specification packages. No dependency is authorized. Rollback consists of removing the new history component and its styles/tests, removing history fields/state from the model fixture, and restoring the current direct Activity grid composition; no data migration or recovery is required. Final verification must run the repository's documented lint, typecheck, unit, build, and E2E commands and truthfully report the known pre-existing contrast/Git-baseline conditions separately from regressions caused by this feature.

**Evidence:** Changed-file inspection, package-manifest comparison, command results, and requirement-to-test handoff prove authorized scope and reversible behavior.

## Scenario summary

- **Success:** Initial Monday shows the exact two fixture rows and locale prices; selecting another populated date replaces them.
- **Date empty:** Thursday July 16 keeps selector context and shows the exact polite empty message.
- **Section loading/empty/failure/recovery:** Existing independent state surfaces render and retry only history.
- **Boundary:** Previous/next buttons disable at the aligned range ends; out-of-range dates cannot be selected.
- **Cross-month/year:** Header follows the selected date while the visible week remains Sunday-Saturday.
- **Concurrency/persistence:** Not applicable; local component state is the only mutable state and is discarded on unmount/reload.
- **Permission/security/privacy:** No permission, secret, network, storage, personal-data, or health-data surface exists.
- **Recovery/rollback:** Retry returns the fixture section to ready; source rollback requires no migration.

## Traceability to approved input

| Approved behavior | Requirements |
| --- | --- |
| White panel directly below content-height Activity beside left progress cards; preserve geometry above | R1, R2, R10 |
| Exact title and subtitle | R2 |
| Compact seven-day reference, numeric month/year, arrows, initials, selected pill | R4, R5, R6 |
| Arrows move one seven-day window and date filters rows | R5, R6 |
| Four exact table columns and compact reference structure | R7, R10 |
| Pair negative workout and positive recipe calories accessibly | R3, R8, R12 |
| Locale-style estimated demo price; no billing/purchasing | R8, R13, R14 |
| Deterministic model/provider demo data only | R3, R8, R13 |
| Existing loading/empty/failure machinery | R9 |
| Keyboard, screen reader, focus, responsive overflow, four exact widths | R10-R12 |
| Existing icons/tokens; no nested cards, dependencies, contrast changes, or unrelated work | R2, R15 |
| Screenshot-faithful exact demo content without a new workflow | R7, R8, R13 |

## Assumptions and derived requirements

- **Assumption:** The approved dashboard and the two supplied images are the visual baseline; the references guide density and selector/table treatment, not their original labels or data schema.
- **Assumption:** `en-US`, `USD`, and `America/Costa_Rica` remain the initial fixture locale contract already present in the provider.
- **Derived from R1:** A transparent right-column wrapper is required because the current `.activity-column` is itself the right grid item; nesting the new white panel inside it would violate the requested placement.
- **Derived from R4-R6:** Week windows use Sunday as the first day because the supplied reference and approved weekday sequence begin with Sunday. Arrow navigation advances the selected date by seven days so selection remains visible and filtering has an unambiguous result.
- **Derived from R5:** The finite, week-aligned demo range provides deterministic disabled boundaries without introducing unbounded/generated history.
- **Derived from R10:** Local table scrolling at 360 preserves the requested four-column table and prevents page overflow; converting rows into cards would depart from the supplied table reference.
- **Known unrelated conditions:** Current review evidence records an existing muted-text contrast failure and an all-untracked Git baseline. This feature does not authorize contrast changes or pretending those conditions are green.
- **Open questions:** None that change behavior, scope, interfaces, data, permissions, safety, privacy, architecture, or user experience.
