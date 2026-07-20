# Dashboard Meal Recipe and Workout History Design

## Design goals

Satisfy R1-R15 by extending the existing deterministic dashboard reference architecture with one compact, date-filtered history panel. Preserve every approved dashboard box above the insertion point, reuse the current tokens and Lucide library, keep state handling independent, and make the four-column table usable from desktop through 360px without creating a second workflow.

## Current-system observations

- `app/dashboard/page.tsx` resolves `fixtureDashboardProvider.getDashboard()` and passes one `DashboardViewModel` to the client `DashboardScreen`; the route needs no change.
- `components/dashboard/dashboard-screen.tsx` owns local section-state recovery and renders `.dashboard-left-column` and `.activity-column` as the two direct children of `.reference-grid`.
- `app/globals.css` gives `.reference-grid` two columns through 1024px, stacks it below 1024px, and gives `.activity-column` content-driven height through `align-self:start`.
- The left column already contains Summary followed by the equal compact progress row. Adding a second child to the current Activity shell would incorrectly place the history surface inside the muted shell.
- `features/dashboard/model.ts` groups screenshot-specific presentation data under `DashboardReferenceData` and drives independent states through `DashboardSectionName` / `sectionStates`.
- `features/dashboard/fixture-dashboard-provider.ts` returns a structured clone and already supplies `locale = en-US`, `currency = USD`, `timeZone = America/Costa_Rica`, and synthetic meals/prices.
- `features/dashboard/format.ts` centralizes date, number, metric, percent, and currency formatting. `formatCurrency` is the authoritative price formatter.
- `components/dashboard/section-state.tsx` provides the established loading, empty, error alert, and retry behavior.
- `components/ui/table.tsx` provides the existing semantic `Table` wrapper; no table dependency is needed.
- Current unit tests cover screen structure, independent section states, model cloning, formatting, and safety. Playwright already measures 1440/1024/768/360 geometry, keyboard access, overflow, and Axe.
- `README.md` is empty; no additional repository architecture, security, privacy, accessibility, or localization documentation exists beyond the harness, existing specs, source, and tests.

## Exact file scope

### Create

| File | Purpose |
| --- | --- |
| `components/dashboard/meal-workout-history.tsx` | Render and operate the date selector, date-level empty state, semantic history table, signed values, local selection, and live result announcement. |
| `tests/dashboard/meal-workout-history.test.tsx` | Verify exact demo content, week arithmetic, filtering, boundaries, semantics, keyboard/focus, empty behavior, and accessible state. |

### Modify

| File | Expected change |
| --- | --- |
| `components/dashboard/dashboard-screen.tsx` | Replace the direct right Activity grid item with `.dashboard-right-column`; keep Activity first, add the independent `history` section second, and preserve generic retry behavior. |
| `features/dashboard/model.ts` | Add `ReferenceHistoryEntry`, `ReferenceHistoryData`, `history` on `DashboardReferenceData`, and `history` to `DashboardSectionName`. |
| `features/dashboard/fixture-dashboard-provider.ts` | Add exact deterministic history fixtures/range/selection and `history:"ready"` to section states. |
| `features/dashboard/format.ts` | Add shared numeric month/year and signed-calorie formatters with date-only/time-zone-safe behavior. |
| `app/globals.css` | Add right-column, panel, selector, selected pill, table, value, empty, focus, and responsive local-overflow styles using existing tokens. |
| `tests/dashboard/dashboard-screen.test.tsx` | Assert right-column ownership/order, exact panel identity, preserved sections, and all four non-ready `history` states/retry independence. |
| `tests/dashboard/model.test.ts` | Assert clone isolation, exact fixture rows, signs, aligned range, selected date, and history-ready state. |
| `tests/dashboard/format.test.ts` | Assert `MM / YYYY`, signed calorie output, locale digits, and time-zone/cross-month stability. |
| `tests/dashboard/health-and-ai-safety.test.tsx` | Assert history is explicitly deterministic demo content with no connected-health, medical, AI, billing, or purchasing provenance. |
| `e2e/dashboard.spec.ts` | Extend the existing four-width geometry, visual, keyboard, overflow, and Axe coverage for the new wrapper/panel without weakening existing gates. |
| `progress/current.md` | Implementer-only execution evidence and requirement/task handoff after human approval. |

No other product, test, config, manifest, lock, evidence, review, or specification file is authorized. `app/dashboard/page.tsx`, `components/dashboard/activity-summary.tsx`, `components/dashboard/goal-progress.tsx`, `components/dashboard/section-state.tsx`, and `components/ui/table.tsx` remain unchanged.

## Model and interfaces

Add these presentation types to `features/dashboard/model.ts` using the repository's existing exported-interface style:

```ts
export interface ReferenceHistoryEntry {
  id: string;
  date: string;
  mealName: string;
  recipe: string;
  workoutCalories: number;
  recipeCalories: number;
  price: number;
}

export interface ReferenceHistoryData {
  selectedDate: string;
  availableDateRange: [string, string];
  entries: ReferenceHistoryEntry[];
}
```

Extend `DashboardReferenceData` with `history: ReferenceHistoryData` and extend `DashboardSectionName` with `"history"`. Do not alter the existing top-level dashboard `selectedDate`, days, recommendations, or provider interface; the new panel is reference-presentation data with its own bounded selection.

Data invariants:

- Every `id` is unique and stable.
- Dates are zero-padded ISO date-only strings.
- `workoutCalories` is a negative integer; `recipeCalories` is a positive integer; `price >= 0`.
- The range is Sunday `2026-06-28` through Saturday `2026-07-25`.
- Initial selection is Monday `2026-07-13`.
- Entries are held in deterministic display order; filtering preserves provider order.
- The provider continues returning `structuredClone(model)`.

## Formatter signatures

Add to `features/dashboard/format.ts`:

```ts
formatNumericMonthYear(date: string, locale: string, timeZone: string): string
formatSignedCalories(value: number, locale: string): string
```

`formatNumericMonthYear` must derive localized numeric month/year parts from the same UTC-noon date convention as `formatDate`, then compose exact month-first `MM / YYYY` output with a two-digit month and no month name. `formatSignedCalories` must use `Intl.NumberFormat` with an explicit sign for positive and negative values, zero decimal places, and append ` kcal`. It must not hand-build thousands separators or currency.

The component continues using existing `formatDate` for full accessible dates and `formatCurrency(entry.price, locale, currency)` for prices.

## Fixture design

Add `history` to `fixtureReferenceDashboard` with the exact R8 range, selection, and entries. Use stable IDs such as `history-2026-07-13-1`. Include only the five approved rows across July 12-15; July 16 has no matching entry. Do not derive rows from `days` or mutate existing meal fixtures because the reference history range and signed pairing are presentation-specific.

Add `history:"ready"` to the existing `sectionStates`. `fixtureWithSectionState("history", status)` then works through the current helper without a parallel state system.

## Component design

### Public signature

`components/dashboard/meal-workout-history.tsx` exports:

```ts
export function MealWorkoutHistory({
  history,
  locale,
  currency,
  timeZone,
}: {
  history: ReferenceHistoryData;
  locale: string;
  currency: string;
  timeZone: string;
})
```

The component owns `selectedDate` local state initialized from `history.selectedDate`. It performs pure in-memory filtering; it does not accept a write callback because no persistence or cross-dashboard selection synchronization is in scope.

### Date-only arithmetic

Use date-only helpers local to the component, based on parsing ISO year/month/day into a UTC-noon `Date` and serializing with UTC parts. Do not use `new Date("YYYY-MM-DD")` plus local getters. Required operations are:

- Find Sunday by subtracting `getUTCDay()` days from selected date.
- Build seven consecutive ISO dates by adding 0 through 6 UTC calendar days.
- Shift selected date by exactly +/-7 UTC calendar days for arrow navigation.
- Compare ISO strings for the aligned fixture range and button disabled states.

When an arrow target lies outside the range, render the native button disabled. When a visible date lies outside the range, its date button is disabled. Because the fixture range is week-aligned, the initial and reachable windows contain seven enabled dates.

### Semantic structure

Render one `<section className="history-panel">` labelled by its `<h2>`:

1. Header block with exact title and subtitle.
2. Period row with visible `MM / YYYY` and previous/next icon buttons.
3. Seven-column date grid. Each date is one native button containing a presentational weekday initial and day number. Use full localized date in `aria-label`, `aria-pressed`, and `aria-current="date"` only for the selection.
4. One visually hidden `aria-live="polite"` status announcing selected full date and result count.
5. Either the exact date-level empty status or a table overflow region.
6. A concise disclosure that the rows and estimated prices are deterministic demo data, if the component tests require explicit provenance beyond existing dashboard context.

Use Lucide `ChevronLeft` and `ChevronRight`; mark icon glyphs `aria-hidden="true"`. Keep both arrow buttons before date buttons in DOM order as required by R11. Button activation updates state without focus movement.

### Table structure

Use the existing `Table` component inside a `.history-table-scroll` region with `role="region"`, a date-specific accessible label, and `tabIndex={0}`. Include a visually hidden `<caption>` naming the selected full date, one header row with four `<th scope="col">` cells, and one `<tbody>` row per filtered entry.

Column content:

- **Meal Name:** `entry.mealName`.
- **Recipe:** `entry.recipe`.
- **Value:** two block lines, `Workout ${formatSignedCalories(...)}` and `Recipe ${formatSignedCalories(...)}`. Text labels and signs are always visible; color may reinforce but never replace them.
- **Price:** `formatCurrency(entry.price, locale, currency)`.

Do not add icons, links, menus, row actions, status chips, purchase controls, or nested surfaces inside rows.

## Dashboard composition and state flow

In `DashboardScreen`, preserve `.reference-grid` children count and order as left column then right column, but change the second child from `.activity-column` to `.dashboard-right-column`:

```text
.reference-grid
  .dashboard-left-column
    .summary-column
    Progress goals
  .dashboard-right-column
    Activity section/state (.activity-column remains the visual shell)
    History section/state (white history panel when ready)
```

`.dashboard-right-column` is transparent, `min-width:0`, `display:flex`, `flex-direction:column`, `gap:16px`, and `align-self:start`. Keep `.activity-column` selectors, padding, border, radius, and `align-self:start` behavior intact so its border box remains equal to the approved baseline. Do not apply a background, border, padding, or shadow to the wrapper.

Render history through the existing helper:

```text
section("history", <MealWorkoutHistory ... />)
```

The current retry closure changes only the named state to `ready`, so no new state machine or error boundary is needed. A date-level empty result is owned inside the ready component and does not change `sectionStates.history`.

## Visual and responsive design

Use existing `--card`, `--ink`, `--muted`, `--line`, `--green`, `--green-dark`, `--shadow`, and `--focus` tokens. A soft selected pill may use an alpha/tint derived from the existing green token through `color-mix` only if already supported by the target toolchain, or an existing green-family value already present in the stylesheet; do not add a global token or alter contrast elsewhere.

- Panel radius must be 20px or less, consistent with compact supporting surfaces and the no-oversized-card guidance.
- Desktop panel padding should be compact (approximately 20-24px) and align with Activity's right-track edges.
- Month/year and arrow controls share one stable-height row. Icon buttons use existing circular control treatment and native focus.
- The date grid uses seven stable equal tracks. Selected treatment is a vertical rounded pill around weekday/date content, not a layout-changing transform.
- Table type remains compact but readable; headers are small and strong, body rows use quiet separators, and numeric cells use tabular numerals.
- At 1440 and 1024, the table fits the panel without internal horizontal overflow.
- At 768, the entire right wrapper stacks after the left column; the table should still fit naturally.
- At 360, reduce panel padding to 12px so seven date hit areas can retain approximately 44px tracks. Keep the table at a readable minimum width (approximately 560px) and set only `.history-table-scroll` to `overflow-x:auto`; the document and panel remain non-scrolling horizontally.
- Do not reduce font size with viewport-width formulas, collapse words letter-by-letter, hide columns, or convert table rows to cards.

## Accessibility and interaction invariants

- The panel section is labelled by the exact title.
- Full date labels use `formatDate` with weekday, month, day, and year and the model time zone.
- The selected button exposes both `aria-pressed=true` and `aria-current=date`; only one button has either selected state.
- Visible initials are supplementary; full dates are the accessible names.
- Live result announcements are polite and do not move focus.
- Native button disabled semantics govern unavailable navigation/dates.
- All controls retain shared visible focus; `.history-table-scroll:focus-visible` receives the same focus token without clipping.
- Table caption, header scope, text labels, and explicit signs make relationships available without color.
- No animation is required; existing reduced-motion rules remain sufficient.

## Failure, recovery, and invariants

- Section loading/empty/error replace only the ready history panel through existing `SectionState` behavior.
- Retry changes only `states.history`; nutrition, goal, and activity remain untouched.
- Date-level empty keeps panel context and selector visible.
- Invalid/out-of-range provider selection is not expected from the deterministic fixture; model tests enforce the invariant. The Implementer must not silently generate dates or clamp malformed provider data outside the approved range.
- Filtering never reorders entries and never mutates the provider object.
- Existing dashboard content remains in normal flow; no absolute positioning, negative margins, clipping, or fixed heights are permitted for placement.

## Security, privacy, health, and observability

The feature has no network, storage, authentication, authorization, consent, telemetry, logging, audit, retention, backend, AI, billing, or personal-data path. Calories and prices are demo presentation values. Do not add medical or offset language. No operational observability is required; rendered test evidence and existing command results are the verification record.

## Performance, compatibility, migration, and rollback

- At most a small fixture array is filtered during render; memoization, virtualization, lazy loading, and a data-grid library are unnecessary.
- Use React, TypeScript, CSS Grid/Flexbox, `Intl`, existing Lucide icons, and existing test tools only.
- No schema, route, API, environment, build, or data migration exists.
- Rollback removes the component, related styles/tests, history model/fixture/state fields, and right wrapper, restoring Activity as the second direct grid child.

## Alternatives considered

### Put the panel inside `.activity-column`

Rejected because the new white panel would become nested inside the muted Activity shell and would enlarge Activity rather than sit directly beneath its content-height boundary, violating R1-R2.

### Add the panel as a third `.reference-grid` child

Rejected because implicit grid placement would not reliably keep the panel under Activity and beside progress across desktop and stacked breakpoints. A right-column wrapper expresses the required ownership and preserves responsive order.

### Reuse the existing `DayStrip`

Rejected because `DayStrip` advances one day, displays rich plan/activity/meal signals, opens a calendar dialog, and uses a separate surface. Those behaviors conflict with the compact seven-day reference and would introduce an unapproved workflow.

### Derive history directly from existing `days` and `meals`

Rejected because existing day data has a different range and no signed workout-recipe pairing. Explicit reference fixture data keeps the screenshot contract deterministic without changing legacy meal behavior.

### Stack rows as mobile cards

Rejected because the approved reference requires a compact four-column table. A locally scrollable semantic table preserves structure, header relationships, and readable cell widths at 360.

### Add a date or table library

Rejected because seven-day date-only arithmetic and a small semantic table are fully supported by existing platform APIs and components; R15 prohibits dependencies.

## Requirement-to-design mapping

| Requirement | Design coverage |
| --- | --- |
| R1 | Right-column wrapper, composition tree, geometry invariants |
| R2 | Panel semantic/visual structure and token-only styling |
| R3 | Model interfaces, fixture invariants, independent section state |
| R4 | Date-only week construction, formatter, seven-track selector |
| R5 | UTC-noon week shift, icon controls, finite boundaries |
| R6 | Local selected state, filtering, disabled dates, focus invariants |
| R7 | Semantic table structure and prohibited columns/actions |
| R8 | Exact fixture rows, signed formatter, currency formatter |
| R9 | Existing section helper plus component-owned date empty state |
| R10 | Four-width responsive and local-overflow design |
| R11 | Native control DOM order, keyboard behavior, focus styles |
| R12 | Section/date/table/live-region semantics and non-color meaning |
| R13 | Synthetic local data and prohibited service/workflow paths |
| R14 | Shared `Intl` formatting, deterministic render, compatibility |
| R15 | Exact file scope, no dependencies, command gates, rollback |
