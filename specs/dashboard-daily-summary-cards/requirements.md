# Dashboard Daily Summary Cards Requirements

## Work identity

- **Master Work item:** `Replace dashboard top bar with interactive daily summary cards`
- **Notion:** `3a406edf-7ca0-81f8-ab04-e3b4927ade90`
- **Notion URL:** `https://app.notion.com/p/3a406edf7ca081f8ab04e3b4927ade90`
- **Parent dashboard redesign:** `39e06edf-7ca0-81ba-8d25-cc966f35e9fb`
- **Outcome ancestry:** `Design the first six core user screens` -> `Complete the Avilo visual identity`
- **Branch:** `develop`
- **Status at authoring:** `Not Started`; this package is prepared for human review in `Defining`.
- **Human reviewer:** Gustavo
- **Visual reference:** `C:\Users\gustt\AppData\Local\Temp\codex-clipboard-e591db6d-bb80-4288-9adc-3f73170db8c5.png`

## Problem and intended outcome

The redesigned dashboard still uses the black pill navigation and separate notification/profile controls from the earlier reference. Those controls consume the upper area without helping users move between daily nutrition and activity snapshots. Replace that entire top-bar area with a compact row of calendar-style cards. Each card represents one available date, previews that date's nutrition and activity, and acts as the dashboard's single selected-day control.

The result lets a user scan recent days and select one date to update all visible date-sensitive dashboard information while preserving the greeting, Filters/Reports controls, Summary, progress goals, Ask Avilo input, Activity, meal/workout history, and fixed utility rail below.

## Scope

### In scope

- Remove the black `Home` pill navigation, its shortcut icons, and the adjacent notification/profile buttons from the rendered dashboard.
- Place one compact daily-summary card strip in the vacated upper area.
- Render seven deterministic available dates, including dates such as 20, 21, and 22, in chronological order.
- Show each date plus a concise nutrition preview and activity preview.
- Select one card initially and update all date-sensitive dashboard sections when another card is selected.
- Synchronize the meal/workout history panel to the same selected date while preserving its existing week-navigation behavior.
- Preserve the static desktop utility rail and existing dashboard layout/content below the replaced top area.
- Verify responsive overflow, keyboard interaction, screen-reader state, data consistency, and the existing dashboard at 1440, 1024, 768, and 360 CSS pixels.

### Out of scope

- Authentication, account, notification, profile, routing, or replacement destinations for the removed top-bar controls.
- Backend, API, database, persistence, URL/query synchronization, telemetry, live AI, live health integrations, or real personal health data.
- Editing nutrition/activity records, opening a calendar dialog, changing available dates, or adding previous/next controls to the new card strip.
- Redesigning the greeting, hero actions, Summary chart structure, Activity card structure, progress cards, Ask Avilo behavior, meal/workout table columns, or utility rail.
- New dependencies, routes, global design tokens, unrelated cleanup, or changes to existing contrast behavior outside this feature.

## Definitions

- **Daily-summary card:** A compact, vertically oriented native button representing one available date and containing a date label, nutrition preview, and activity preview.
- **Card strip:** The labelled horizontal collection of all daily-summary cards. It is a standalone control region, not a navigation landmark and not a nested card inside another card.
- **Selected date:** The single ISO date whose card exposes selected semantics and whose corresponding snapshot supplies all date-sensitive dashboard content.
- **Daily snapshot:** Deterministic in-memory fixture data for one date: card preview values plus Summary, Activity, progress-goal, and history selection.
- **Date-sensitive dashboard information:** Summary values/bars/legend, Activity values/trends/sparklines/progress, progress-goal values, and the meal/workout history selected date and rows. The greeting, Filters/Reports controls, and presentation-only Ask Avilo input are not date-sensitive.
- **Nutrition preview:** A concise visible calorie-intake value with its unit/meaning, such as `2,135 kcal eaten`.
- **Activity preview:** A concise visible exercise/activity amount with its unit/meaning, such as `45 min active`.
- **Available date:** One date present in `DashboardViewModel.days` and the date-keyed reference snapshot map.

## Requirements

### R1 - Remove the obsolete dashboard top bar

When `/dashboard` renders successfully, the black Home pill, Energy shortcut, Overview shortcut, Notifications button, Profile button, and their containing dashboard top-bar region must not be rendered. Their removal must not remove or reposition the fixed Quick utilities rail or the dashboard content below the replaced upper area.

**Failure behavior:** No placeholder, empty top-bar shell, or inaccessible hidden duplicate may remain.

**Acceptance evidence:** Component queries prove the six controls and `.dashboard-topbar` are absent; browser screenshots and geometry prove the utility rail remains present and fixed at desktop widths.

### R2 - Render the daily-summary card strip in the upper area

The dashboard must render one labelled card-strip region before the hero greeting in DOM and visual order. It must contain exactly seven daily-summary cards in ascending date order from the fixture's available dates. Each card must use the reference's compact tall proportions: a small circular date/icon treatment above two concise preview lines within a narrow white surface.

**Boundary behavior:** The strip must not become a full-width enclosing card and must not contain cards inside another card.

**Acceptance evidence:** DOM order, count, date order, computed geometry, and screenshots at all required widths.

### R3 - Show meaningful content on every card

Each card must visibly show the localized day-of-month number, a short weekday label, one nutrition preview, and one activity preview. Labels and units must make both preview values understandable without relying on icons or color. The accessible name must include the full localized date, nutrition preview, activity preview, and selected state when applicable.

**Empty behavior:** If a preview value is unavailable in a valid snapshot, show `Nutrition unavailable` or `Activity unavailable`; do not show `0`, invent a value, or omit the category.

**Acceptance evidence:** Component tests inspect exact text and accessible names for populated and unavailable examples.

### R4 - Establish one initial selected date

On first render, the card matching `model.selectedDate` must be the only selected card. It must expose `aria-pressed="true"` and `aria-current="date"`; all other cards must expose an unpressed state and no `aria-current`. The initial date must exist in both the available-day list and the date-keyed daily snapshot map.

**Failure behavior:** Fixture/model verification must fail for a missing or duplicate initial date; the UI must not silently clamp or choose another date.

**Acceptance evidence:** Model invariants and rendered semantic assertions.

### R5 - Change the selected day through card activation

When a user activates an unselected card by pointer, Enter, or Space, the dashboard must set that card's date as the selected date exactly once, retain focus on the activated card, update selected semantics/styles without layout shift, and leave all other cards unselected.

**Concurrency behavior:** Rapid sequential activations are synchronous local state updates; the final activated valid card wins. No request, timer, optimistic state, or race-prone asynchronous work is permitted.

**Acceptance evidence:** Component and browser tests activate multiple cards by pointer and keyboard and assert final focus/state.

### R6 - Update all date-sensitive dashboard information atomically

After selection, Summary, Activity, progress goals, and meal/workout history must all represent the same selected date during the resulting render. No section may display a snapshot from the previously selected date. At least two fixture dates must have visibly different Summary, Activity, and progress values so synchronization is objectively verifiable.

**State change:** Only local selected-date state changes; provider input objects remain immutable.

**Failure behavior:** A valid available date without a corresponding snapshot is an invalid provider/model state covered by tests, not a partial-render fallback.

**Acceptance evidence:** Tests select a second date and assert changed values in every date-sensitive section and unchanged static content.

### R7 - Synchronize meal/workout history without duplicating date state

The history panel must receive the dashboard selected date as its controlled selection. Selecting a daily-summary card updates its month/year, selected week/day, result announcement, and filtered rows. Using the history panel's existing date or week controls must call the dashboard selection handler for an available date so the corresponding top card and all other daily sections update too.

**Boundary behavior:** Out-of-range history dates remain disabled. Week navigation may expose dates outside the seven-card range, but those dates must be disabled unless they are also available dashboard dates; it must not create a selected date that lacks a daily-summary card.

**Acceptance evidence:** Bidirectional interaction tests prove card-to-history and history-to-card synchronization, empty-date behavior, focus retention, and single selection.

### R8 - Preserve independent section-state behavior

Existing loading, section-empty, error, and retry states for nutrition, goal, activity, and history must continue to affect only their named section. Changing the selected date must not reset section statuses. Retrying a section must not change the selected date or any sibling state.

**Acceptance evidence:** Existing section-state tests are updated and remain green with explicit selected-date assertions.

### R9 - Preserve unrelated dashboard behavior and composition

The greeting, subtitle, Filters and Reports controls, Summary/Activity visual structures, progress-card placement, Ask Avilo input behavior, history table columns, and Quick utilities control set must remain present and function as before. On desktop, the utility rail must remain fixed while the central dashboard content scrolls. At widths below the current desktop breakpoint, its existing static responsive behavior remains unchanged.

**Acceptance evidence:** Regression assertions, geometry comparison, utility-rail scroll checks, and screenshots.

### R10 - Provide responsive card-strip behavior

At 1440 and 1024 CSS pixels, all seven cards must remain in one row in the available content width without overlapping the fixed utility rail or hero. At 768 and 360 CSS pixels, the cards must retain stable readable dimensions in a single horizontal row inside a locally scrollable strip; the document must not scroll horizontally. The selected card must be scrolled into view when changed through programmatic/history synchronization if it is outside the visible strip viewport.

**Boundary behavior:** Text may wrap only at intended line boundaries and must not clip, overlap, or resize cards on selection/focus.

**Acceptance evidence:** Card and container boxes, local scroll-width checks, selected-card viewport checks, and no-document-overflow assertions.

### R11 - Meet keyboard and focus requirements

Cards must be native buttons in chronological DOM order. Tab reaches each enabled card once; Enter and Space activate it. Every card has a visible `:focus-visible` treatment with at least a 3:1 non-text contrast against adjacent colors and no clipping. Pointer targets must be at least 44 by 44 CSS pixels.

**Acceptance evidence:** Keyboard path, focus-style inspection, target geometry, and Axe analysis.

### R12 - Announce selected-date changes accessibly

The strip must have an accessible region/group label such as `Daily dashboard summaries`. A polite live status must announce the newly selected full date after a user-initiated change without moving focus. Selected state must be conveyed by semantics and visible text/treatment, not color alone. Decorative icons must be hidden from assistive technology.

**Acceptance evidence:** Accessibility tree queries, live-region assertions, selected-state semantics, and serious/critical Axe results.

### R13 - Protect health-data and privacy boundaries

All dates, nutrition values, calorie values, activity amounts, and history rows in this implementation must remain deterministic synthetic fixture data. The feature must add no collection, storage, network transfer, logging, analytics, authentication, authorization, consent, retention, export, or real-health-data behavior. Visible demo-data disclosures already present in affected sections must remain.

**Acceptance evidence:** Fixture/source inspection, request monitoring during interaction, and safety tests.

### R14 - Preserve deterministic formatting and performance

Full dates, weekday labels, and day numbers must use the model locale and time zone through existing date-formatting utilities. Selection and rendering must not depend on the runtime current date, random values, or browser time zone. Rendering and selection must remain synchronous over seven cards and small fixture objects; no memoization, virtualization, loading spinner, or animation is required.

**Acceptance evidence:** Locale/time-zone unit tests, deterministic fixture checks, and browser interaction without network activity.

### R15 - Constrain implementation and verification scope

Implementation must use the existing React, TypeScript, CSS, Lucide, Testing Library, Vitest, Playwright, and Axe stack. No dependency, route, API, environment, config, migration, or global token change is authorized. Required gates are `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run test`, `npm.cmd run build`, and `npm.cmd run test:e2e`, plus a `/dashboard` smoke check and changed-file audit.

**Acceptance evidence:** Package/lock/config comparison, command transcripts, smoke result, and exact changed-file list.

## Derived requirements

- **D1 (from R4 and R6):** The fixture must enforce a one-to-one date-key relationship between the seven available `Day` records and seven daily reference snapshots. This is necessary to verify atomic synchronization and does not add user-visible behavior.
- **D2 (from R5 and R7):** Selected-date state must have one owner in `DashboardScreen`; child selectors must be controlled. This prevents contradictory selections and does not alter the requested behavior.
- **D3 (from R10):** Programmatic selection must call the platform's nearest non-disruptive scrolling behavior only within the card-strip container. This is necessary to keep the selected control perceivable on narrow screens without changing page scroll position.

## Assumptions and open questions

- The seven existing deterministic `days` entries are the approved available dates; fixture values may be adjusted so the visible day numbers include the requested 20-23 range, provided every related fixture and test stays internally consistent.
- Compact proportions are judged from the supplied reference rather than exact pixels because the image provides no measured design tokens. Requirements fix relative structure, stable card geometry, and responsive behavior.
- There are no unresolved behavioral questions. Any request to retain account controls elsewhere, persist the date, add more dates, or change which sections synchronize requires a new Spec Author revision.

## Traceability from requested behavior

| Requested behavior / success criterion | Requirements |
| --- | --- |
| Remove black Home top bar and adjacent account icons | R1, R9 |
| Add compact cards in the former top area matching reference proportions | R2, R3, R10 |
| Cards represent dates such as 20, 21, 22, 23 | R2-R4, R14 |
| Show a quick nutrition and activity summary for each day | R3, R13-R14 |
| Selecting a card changes the selected dashboard day | R4-R5, R12 |
| Dashboard information changes for the selected date | R6-R8 |
| Preserve static utility rail and dashboard redesign below | R1, R9-R10 |
| Keyboard interaction and mobile overflow verified | R10-R12, R15 |
