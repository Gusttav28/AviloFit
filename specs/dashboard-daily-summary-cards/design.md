# Dashboard Daily Summary Cards Design

## Design goals

This design satisfies R1-R15 by replacing the obsolete header controls with one compact, accessible date-selection strip and making `DashboardScreen` the single owner of selected-day state. It preserves the approved dashboard composition below, keeps synthetic data boundaries, and uses the existing project stack only.

## Current-system observations

- `components/dashboard/dashboard-shell.tsx` renders `.dashboard-topbar`, `AdaptiveNavigation`, Notifications, Profile, and the separate `ContextualUtilities` rail.
- `components/dashboard/dashboard-screen.tsx` renders a static `model.reference` snapshot and owns only section-status retry state.
- `features/dashboard/model.ts` already defines seven `Day` records and `DashboardViewModel.selectedDate`, but `DashboardReferenceData` is a single static snapshot.
- `components/dashboard/day-strip.tsx` is an unused legacy component with materially different content, arrows, and calendar-dialog behavior. It is not compatible with this card reference.
- `components/dashboard/meal-workout-history.tsx` owns a second local selected date. It must become controlled to avoid contradictory dashboard dates.
- `app/globals.css` contains the obsolete top-bar/pill navigation styles, fixed desktop `.utility-rail`, current responsive breakpoints, and all active dashboard layout styles.
- `tests/dashboard/navigation.test.tsx`, `tests/dashboard/dashboard-screen.test.tsx`, `tests/dashboard/meal-workout-history.test.tsx`, and `e2e/dashboard.spec.ts` currently assert the controls and state that this feature changes.
- The worktree already contains unrelated approved modifications in `app/globals.css` and `e2e/dashboard.spec.ts` for the static utility rail. The Implementer must preserve and build on them.

## Exact file scope

### New files

- `components/dashboard/daily-summary-cards.tsx`
- `tests/dashboard/daily-summary-cards.test.tsx`

### Existing files to modify

- `components/dashboard/dashboard-shell.tsx`
- `components/dashboard/dashboard-screen.tsx`
- `components/dashboard/meal-workout-history.tsx`
- `features/dashboard/model.ts`
- `features/dashboard/fixture-dashboard-provider.ts`
- `app/globals.css`
- `tests/dashboard/dashboard-screen.test.tsx`
- `tests/dashboard/navigation.test.tsx`
- `tests/dashboard/meal-workout-history.test.tsx`
- `tests/dashboard/model.test.ts`
- `tests/dashboard/health-and-ai-safety.test.tsx`
- `e2e/dashboard.spec.ts`
- `progress/current.md`

### Existing file to delete

- `components/dashboard/adaptive-navigation.tsx`

### Files explicitly unchanged

- `components/dashboard/contextual-utilities.tsx`
- `components/dashboard/day-strip.tsx`
- `components/dashboard/calendar-dialog.tsx`
- `components/dashboard/nutrition-summary.tsx`
- `components/dashboard/activity-summary.tsx`
- `components/dashboard/goal-progress.tsx`
- `components/dashboard/ask-avilo.tsx`
- `app/dashboard/page.tsx`
- `features/dashboard/dashboard-provider.ts`
- `package.json` and lockfiles/configuration

If implementation requires another file, stop with `SPEC_CHANGE_REQUIRED` rather than expanding scope.

## Data model

Add these concepts to `features/dashboard/model.ts`:

```text
DailySummaryPreview
  nutrition: string | undefined
  activity: string | undefined

DailyDashboardSnapshot
  preview: DailySummaryPreview
  summary: ReferenceSummary
  activityCards: ReferenceActivityCard[]
  progressCards: ReferenceProgressCard[]

DashboardViewModel
  referenceByDate: Record<string, DailyDashboardSnapshot>
```

Retain `DashboardViewModel.selectedDate`, `days`, locale, currency, time zone, contexts, section states, and shared history entries/range. Replace the active single `reference.summary/activityCards/progressCards` read path with `referenceByDate[selectedDate]`. Keep history data shared because its rows already carry dates; its selected date is controlled separately.

The fixture must provide exactly seven unique ascending `Day.date` values and exactly the same seven keys in `referenceByDate`. Use dates `2026-07-20` through `2026-07-26`, with `2026-07-20` initially selected. Every snapshot has explicit preview strings. At least two dates must differ in Summary, all six Activity values/trends, and both progress values. Preserve deterministic demo disclosures and avoid claims that food calories are earned, offset, or medically meaningful.

`fixtureReferenceDashboard` may remain exported for focused legacy component tests, but it must point to or clone the initial date's snapshot plus shared history data; there must be no second independent source of initial values.

Model tests enforce D1, uniqueness, sorted dates, initial-date membership, required snapshot fields, and structured-clone isolation.

## Component interfaces

### `DailySummaryCards`

Create:

```text
DailySummaryCards({
  days,
  summariesByDate,
  selectedDate,
  onSelect,
  locale,
  timeZone
})
```

The component renders a `<section aria-labelledby="daily-summary-heading">` with a visually hidden heading `Daily dashboard summaries` and a local horizontal scroll viewport. It maps `days` in provider order to native `<button type="button">` cards. Do not add previous/next arrows, a calendar dialog, tooltips, links, or menus.

Each card contains:

1. A stable circular date marker using the localized day-of-month number. A small existing Lucide calendar/activity icon may be decorative inside the circle, but the number remains visible.
2. A short localized weekday label.
3. The nutrition preview or `Nutrition unavailable`.
4. The activity preview or `Activity unavailable`.

The button's accessible name concatenates full localized date, nutrition text, activity text, and `Selected` when selected. Selected buttons expose `aria-pressed=true` and `aria-current=date`; unselected buttons expose `aria-pressed=false` and omit `aria-current`.

The component keeps refs keyed by date. After `selectedDate` changes, if the selected card is outside the local viewport, call `scrollIntoView({block:"nearest", inline:"nearest"})`. Respect the existing reduced-motion policy; do not request smooth scrolling. This effect never changes document scroll intentionally.

Render a visually hidden polite live region. Suppress an announcement on initial mount; after a user/history selection change announce `Dashboard updated for <full date>.`.

### `DashboardShell`

Remove the entire header markup and imports for Bell, UserRound, and `AdaptiveNavigation`. Render only the frame, unchanged `ContextualUtilities`, then children. Delete `adaptive-navigation.tsx` because it has no remaining consumer or approved product role.

### `DashboardScreen`

Add `selectedDate` state initialized exactly from `model.selectedDate`. Resolve `const snapshot = model.referenceByDate[selectedDate]` and render:

```text
DashboardShell
  DailySummaryCards
  main.reference-dashboard
    hero-row
    reference-grid
      dashboard-left-column
        NutritionSummary(snapshot.summary)
        GoalProgress(snapshot.progressCards)
        AskAviloGooeyInput (existing presentation-only UI unchanged)
      dashboard-right-column
        ActivitySummary(snapshot.activityCards)
        MealWorkoutHistory(controlled selectedDate/onSelect)
```

The current rendered `AskAviloGooeyInput` is presentation-only and has no date prop or visible daily value. Keep its behavior and public API unchanged; do not manufacture invisible date state.

Before changing state, `onSelect` validates membership in both `model.days` and `model.referenceByDate`. Child controls only emit valid available dates. Invalid values are ignored and may be covered by unit tests; do not throw into the rendered route or silently select a fallback.

Keep `states` independent. Selection does not alter `states`; retry changes one status and leaves `selectedDate` intact.

### `MealWorkoutHistory`

Change the public interface from internal ownership to:

```text
MealWorkoutHistory({history, selectedDate, onSelectDate, availableDates, locale, currency, timeZone})
```

Remove its local `useState(history.selectedDate)`. Derive the visible week and rows from `selectedDate`. Date buttons are enabled only when the date is in both `history.availableDateRange` and `availableDates`. Date and week controls invoke `onSelectDate` with a valid date. Previous/next week selects the same weekday seven days away only when that exact target is available; otherwise disable the control. Existing table semantics, row filtering, announcements, empty state, and horizontal keyboard scroll remain unchanged.

This controlled design gives the dashboard one state owner (D2) and makes history-to-card synchronization deterministic.

## Visual design and layout

Add `.daily-summary-section`, `.daily-summary-scroll`, `.daily-summary-row`, `.daily-summary-card`, and tightly scoped child selectors. Use existing `--card`, `--ink`, `--muted`, `--line`, `--green`, `--green-dark`, `--shadow`, and `--focus` tokens.

- The strip occupies the former header area before `.reference-dashboard`, with the same frame-side alignment as central content.
- Cards are narrow vertical surfaces with radius no greater than 18px, a stable aspect ratio near 0.58-0.66, and desktop dimensions approximately 112-128px wide by 168-190px tall. Exact values may be tuned against the reference while remaining stable across states.
- Use a seven-column grid at 1440 and 1024, with equal tracks and a compact 12-16px gap. The strip must fit without covering the fixed rail.
- Keep headings and previews compact. Do not scale font size with viewport width. Use tabular numerals for dates and numeric previews.
- Selected state uses the existing dark ink/green visual language on the circular marker plus a clearly visible border or inset indicator on the card. Selection must not use transform, size, margin, or font-weight changes that shift layout.
- At 768 and 360, retain the card dimensions and change only `.daily-summary-scroll` to `overflow-x:auto`; the row width is max-content or equivalent. The scrollbar may use native behavior and must remain keyboard/trackpad operable.
- Do not add a muted enclosing panel, gradient, decorative orb, nested card, absolute positioning, fixed page height, or document-level horizontal overflow.
- Remove obsolete `.dashboard-topbar`, `.pill-nav`, `.pill-nav-item`, and `.topbar-actions` rules only after confirming no remaining usage. Preserve `.utility-rail` rules, including `position:fixed` at desktop and existing responsive `position:static` override.

## State flow and invariants

```text
Provider model.selectedDate
  -> DashboardScreen selectedDate
  -> referenceByDate[selectedDate]
  -> Summary + Activity + progress values
  -> DailySummaryCards selected semantics
  -> MealWorkoutHistory controlled date and rows

DailySummaryCards onSelect(date) ----+
MealWorkoutHistory onSelectDate(date)+-> one guarded DashboardScreen setter
```

Invariants:

- Exactly one selected date/card exists.
- Selected date is always present in `days`, `referenceByDate`, and `availableDates` supplied to history.
- All snapshot consumers read from the same `snapshot` variable in one render.
- Selection never mutates provider data or section statuses.
- No asynchronous fetch, persistence, URL update, or side effect occurs.
- Static hero and utility controls do not rerender with different content.

## Loading, empty, failure, and recovery

The card strip is part of the already-loaded dashboard model and has no independent loading/error state. Missing snapshot mappings are prevented by fixture/model tests and guarded at selection boundaries. Existing section loading/empty/error/retry rendering stays unchanged and uses the selected snapshot when the section becomes ready.

An unavailable preview is a valid per-category display state, not a failed card. The history date-level empty state remains visible for selected dates with no rows. No toast, modal, skeleton, or page-level error is added.

## Accessibility

- Native buttons provide keyboard activation and disabled semantics.
- Region heading, full-date accessible names, `aria-pressed`, `aria-current=date`, visible selected styling, and a polite live region expose context without color dependence.
- Card hit areas exceed 44px in both dimensions.
- Focus uses the existing focus token and must not be clipped by card or scroll viewport overflow.
- Date marker icons are decorative; visible date, weekday, and category labels carry meaning.
- Local horizontal scrolling remains reachable by keyboard and does not trap focus.
- Existing reduced-motion and Axe checks remain active; do not suppress violations.

## Security, privacy, and health data

Only synthetic in-memory fixture values are handled. No sensitive health record, account, notification, profile, consent, permission, retention, audit, logging, analytics, network, storage, or export boundary changes. Existing demo disclosures remain. The card text describes intake and activity factually and does not claim calorie compensation, diagnosis, or treatment.

## Performance, observability, compatibility, migration, and rollback

- Seven cards and small snapshot objects require no memoization, virtualization, code splitting, or new package.
- Existing `Intl`-backed formatting and React state are compatible with the current Next.js/React client component.
- No operational telemetry is added; unit/component/E2E evidence is sufficient observability for this deterministic UI.
- No route, schema, API, config, environment, or data migration exists.
- Rollback restores `DashboardShell` top-bar markup and its CSS/tests, removes the card component and date-keyed snapshots, and restores history local selection. The fixed utility-rail changes that predate this feature must not be rolled back.

## Alternatives considered

### Reuse `DayStrip`

Rejected because it is a large enclosing surface with arrows, a calendar dialog, plan-state text, and meal/activity signals. Those behaviors and proportions conflict with the supplied compact card reference and this bounded replacement.

### Put selected-date state inside `DailySummaryCards`

Rejected because Summary, Activity, progress, and history would require duplicate state or callbacks with stale intermediate renders. One owner in `DashboardScreen` directly satisfies R6-R7.

### Keep history selection independent

Rejected because two selected dates could be visible at once, violating the user's requirement that selecting a card changes dashboard information for that day.

### Keep removed top-bar components hidden in CSS

Rejected because hidden interactive controls remain an accessibility/testing risk and leave dead product behavior. R1 requires them absent from rendered output; the unused navigation module is deleted.

### Fetch date snapshots on selection

Rejected because this work is explicitly deterministic and local. A backend contract, loading state, privacy review, and error recovery would expand scope.

### Wrap cards on mobile

Rejected because wrapping creates a tall multi-row header and changes the reference's calendar-strip scan pattern. Local horizontal overflow preserves stable proportions and document width.

## Requirement-to-design mapping

| Requirement | Design coverage |
| --- | --- |
| R1 | `DashboardShell`, deletion of adaptive navigation, obsolete CSS removal |
| R2 | `DailySummaryCards` structure and upper-area composition |
| R3 | Card content, fallback text, accessible-name contract |
| R4 | Model invariants and initial controlled selection |
| R5 | Native buttons, guarded synchronous setter, focus/state rules |
| R6 | Date-keyed snapshot model and shared render flow |
| R7 | Controlled `MealWorkoutHistory` interface and availability rules |
| R8 | Existing section-status state preserved independently |
| R9 | Exact unchanged files/components and utility-rail preservation |
| R10 | Seven-track desktop grid and local mobile overflow |
| R11 | Native controls, target size, focus token, keyboard path |
| R12 | Region label, semantic selection, live announcement |
| R13 | Synthetic fixture-only boundary and retained disclosures |
| R14 | Existing date formatting, deterministic values, synchronous render |
| R15 | Exact file scope, existing stack, verification gates, rollback |
