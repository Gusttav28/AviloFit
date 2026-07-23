# Activity FitCore Reference Screen Design

## Design goals

This design satisfies R1-R25 by adding one `/activity` route that translates the supplied FitCore Activity reference into the existing Next.js/React/TypeScript/CSS/Lucide architecture. It reuses the approved AviloFit shell, introduces a typed deterministic Activity feature boundary, keeps all unapproved controls local/presentation-only, and makes responsive, accessibility, health-safety, state, and visual verification explicit.

## Current-system observations

- `app/dashboard/page.tsx` is a server route that reads a typed fixture provider and renders a client screen. Activity should follow this boundary.
- `DashboardShell` composes `ContextualUtilities` and its child. The approved sidebar is fixed on desktop and becomes a sticky horizontal rail below 900px.
- `ContextualUtilities` hardcodes Dashboard as active and renders all nav items as buttons. Supporting `/activity` requires a narrowly scoped current-section prop and Dashboard/Activity route links without changing visual structure.
- `DashboardScreen` owns local search/calendar/section state for `/dashboard`. It remains functionally unchanged except for explicitly passing or inheriting Dashboard as the shell current section.
- Shared `SectionState` already covers loading, empty, error, and retry copy. Activity may reuse it inside Activity-specific reserved wrappers.
- The current repository has no separate architecture, privacy, or accessibility handbook. The harness, approved dashboard/sidebar specs, existing typed-provider pattern, tests, global focus/reduced-motion rules, and package scripts are the applicable conventions.
- The supplied HTML is structural reference only. Its Tailwind CDN, Google Fonts, Material Symbols, remote avatar, imperative script, and FitCore sidebar are prohibited.

## Exact file scope

### Existing files expected to modify

- `components/dashboard/contextual-utilities.tsx`
- `components/dashboard/dashboard-shell.tsx`
- `components/dashboard/dashboard-screen.tsx`
- `app/globals.css`
- `tests/dashboard/navigation.test.tsx`
- `e2e/dashboard.spec.ts`
- `progress/current.md`

`dashboard-screen.tsx` may only pass `currentSection="Dashboard"` (or rely on a typed default) to the shared shell. No dashboard content, fixture, state, copy, or layout change is allowed.

### New application files

- `app/activity/page.tsx`
- `components/activity/activity-screen.tsx`
- `components/activity/activity-topbar.tsx`
- `components/activity/activity-summary-cards.tsx`
- `components/activity/pace-heart-rate.tsx`
- `components/activity/personal-records.tsx`
- `components/activity/recent-activity.tsx`
- `components/activity/daily-trend.tsx`
- `components/activity/ai-performance-coach.tsx`
- `features/activity/model.ts`
- `features/activity/activity-provider.ts`
- `features/activity/fixture-activity-provider.ts`
- `features/activity/format.ts`

### New test files

- `tests/activity/model.test.ts`
- `tests/activity/format.test.ts`
- `tests/activity/activity-screen.test.tsx`
- `tests/activity/health-ai-safety.test.tsx`
- `e2e/activity.spec.ts`

### Explicitly unchanged

- All existing dashboard content components except the shell/current-section line in `dashboard-screen.tsx`
- `features/dashboard/*`
- `public/dashboard/*`
- Existing dashboard fixture values, labels, images, safety text, and interactions
- `package.json`, lockfiles, framework/test/lint/PostCSS configs, environment files, migrations, APIs, and assets
- Every route other than the new `app/activity/page.tsx`

If implementation needs any file outside this list, it stops with `SPEC_CHANGE_REQUIRED`.

## Route and shared-shell design

`app/activity/page.tsx` remains a server component:

```text
fixtureActivityProvider.getActivity()
  -> ActivityViewModel
  -> ActivityScreen
  -> DashboardShell(currentSection="Activity")
```

`DashboardShell` gains a typed optional `currentSection` prop with default `Dashboard`. It passes this value to `ContextualUtilities`. `ContextualUtilities` derives active state from that prop instead of hardcoding it. Dashboard and Activity rows use Next `Link` to `/dashboard` and `/activity`; all unbuilt destination rows remain buttons. Existing `.avilo-sidebar-*` classes and DOM groups remain stable so the approved visual contract is preserved.

The active item alone receives `.active` and `aria-current="page"`. Route links retain the same icon, label, class, target size, focus, and responsive behavior as the current buttons.

## Activity model and provider

`features/activity/model.ts` defines:

- `ActivitySectionName = "summary" | "analysis" | "records" | "recent" | "trend" | "coach"`
- `ActivitySectionStatus = "loading" | "ready" | "empty" | "error"`
- `ActivityPeriod = "week" | "month" | "year"`
- `ActivitySummaryMetric` with kind, label, numeric/string display parts, trend label, and tone
- `ActivitySeriesPoint` with stable id, x label, heart-rate value, pace-seconds-per-kilometer, and normalized chart coordinates
- `ActivityAnalysisPeriod` with period and ordered points
- `ActivityRecord`, `RecentActivityEntry`, `DailyTrendEntry`, and `ActivityCoachInsight`
- `ActivityViewModel` with locale, timezone, fixed `referenceDate`, topbar copy, ordered collections, analysis series by period, initial period, and all section states

`ActivityProvider` exposes only:

```ts
getActivity(): Promise<ActivityViewModel>
```

`fixtureActivityProvider` returns a `structuredClone` of one stable model. It uses reference values, `en-US`, `America/Costa_Rica`, and a fixed date selected so Today/Yesterday labels remain deterministic. It does not import the dashboard provider, call the clock, or access network/storage/environment.

`features/activity/format.ts` owns Activity-specific pure formatting:

- localized decimal/integer metric formatting;
- duration formatting;
- deterministic display-date labels relative to `referenceDate`;
- pace conversion to `m'ss" /km`;
- progress/normalized-value clamping.

No public dashboard data contract changes.

## Component design

### `ActivityScreen`

This is the only Activity client state owner. It holds:

- `searchValue`;
- selected `ActivityPeriod`;
- six section statuses;
- transient focused/hovered chart-point id when the child callback contract needs it.

It renders `DashboardShell currentSection="Activity"`, one `<main id="main" className="activity-dashboard">`, the topbar, then the reference-ordered sections. A local `section(name, readyContent)` wrapper uses `SectionState` for non-ready states and retries only the named section.

### `ActivityTopbar`

Typed controlled props: title, search placeholder/value/change callback. It renders Activity heading, labeled search, Quick Add, notification, and calendar native controls. The unread notification accessible name includes unread state. Controls have no domain side effects.

### `ActivitySummaryCards`

Accepts exactly four `ActivitySummaryMetric` items and maps kind to existing Lucide icons. Cards are non-interactive articles/list items. Visible labels/trends carry meaning without color. CSS hover polish applies only to pointer-capable environments and is removed under reduced motion.

### `PaceHeartRate`

Accepts the analysis map, selected period, and selection callback. The segmented control uses native buttons with `aria-pressed`; Week/Month/Year labels remain visible. One responsive SVG renders grid, filled area, line, and focusable data points from normalized fixture coordinates. SVG has a title/description and a nearby screen-reader data summary.

The reference point displays `162 bpm` and `4'12" /km`. Hover and focus open the same positioned tooltip; blur/Escape closes it. The tooltip is associated with the point using `aria-describedby` when visible. `Deep Analysis` is a no-op button.

### `PersonalRecords`

Renders the three ordered records as a labeled list with Lucide icon tiles and deterministic dates produced from the fixed reference date. `View All Achievements` is a no-op button.

### `RecentActivity`

Desktop renders a semantic table with caption/heading association and columns Activity, Date, Duration, Calories, Status, and Actions. The filter and each overflow action are specifically named. At narrow widths, the table remains inside a focusable, labeled horizontal scroll region with a fixed table minimum width; document overflow is prohibited. No control opens an invented menu.

### `DailyTrend`

Renders Monday-Friday as labeled progress rows. Each uses a semantic progressbar with bounded numeric value and visible weekday. The fixture marks the highlighted day, which receives visible text such as `Current fixture day` in accessible-only copy.

### `AiPerformanceCoach`

Renders the dark reference card, deterministic recommendation, safety disclosure, and no-op `Read Full Report` button. Decorative pattern is CSS-only and must not create a gradient/orb or obscure contrast. Copy is explicitly synthetic/general wellness guidance, not medical advice.

## Layout and visual system

Add an `.activity-*` namespace to `app/globals.css`; do not repurpose FitCore dashboard selectors.

- The shell canvas remains `#f7fbf0`; Activity content remains transparent with max width/proportions compatible with the shared sidebar offset.
- Topbar is a clean horizontal band with Activity title, 260px-class search, green Quick Add, and icon controls; it wraps below desktop.
- Summary uses four equal cards at desktop, two columns at tablet, and one at mobile.
- Analytics uses `minmax(0, 2.1fr) minmax(270px, 1fr)` at desktop; the chart card has stable minimum height and records align to it.
- Lower content uses `minmax(0, 3fr) minmax(230px, 1fr)` at desktop; the narrow column stacks trend over coach.
- White surfaces use approximately 16-20px radii, subtle gray-green borders, and restrained shadows, following the PNG over the contradictory sharp/no-shadow markdown.
- The chart SVG uses a stable `viewBox`, width 100%, and bounded minimum block size; tooltip positioning clamps within its chart container.
- At <=900px, shared sidebar behavior remains unchanged and Activity grids stack without overlap.
- At <=600px, topbar wraps, cards become one column, chart controls wrap, and the recent table's own labeled scroller contains overflow.
- Font sizes are fixed by component role, not viewport width. No nested decorative cards, bokeh, color blobs, external font, or unrequested hero treatment.

## State flow and invariants

```text
fixtureActivityProvider -> ActivityViewModel -> ActivityScreen
ActivityScreen.searchValue -----------------> ActivityTopbar
ActivityScreen.selectedPeriod --------------> PaceHeartRate
ActivityScreen.sectionStates ---------------> six isolated section wrappers
DashboardShell.currentSection --------------> ContextualUtilities active item
```

Invariants:

- Exactly four summaries, three records, three recent rows, five trend rows, and three period series exist in ready fixture data.
- Only one sidebar item and one period button are current/selected.
- All displayed values derive from `ActivityViewModel`.
- Period changes affect only the analysis series/selected state.
- Retry affects only one section.
- No action mutates fixture data or uses network/storage/URL state.
- `/dashboard` composition and active Dashboard state remain unchanged.

## Loading, empty, failure, and recovery

Each six-section wrapper has section-appropriate minimum geometry. `loading` uses the shared skeleton plus an accessible announcement. `empty` uses section-specific copy supplied by ActivityScreen or an Activity wrapper without rendering values. `error` uses alert semantics and Retry. Retry synchronously changes only the selected status to ready in fixture mode and preserves search, period, and sibling state.

The provider-level promise is deterministic and expected to resolve. A future provider-level rejection boundary is outside this work item; section errors are the approved failure demonstration.

## Accessibility design

- One main landmark and one H1 `Activity`; sections use descending headings.
- Sidebar links/buttons retain names and current-page semantics.
- Search has a visible or screen-reader label; icon-only buttons have explicit names.
- Summary and record icons are decorative inside already labeled items.
- Segmented controls expose `aria-pressed`.
- SVG exposes title/description; data points are keyboard reachable; a screen-reader series summary prevents reliance on shape/color.
- Tooltip is available on focus and does not trap focus.
- Recent Activity preserves table semantics and gives the mobile scroller a label/tab stop.
- Trend bars use semantic progress values.
- Status text and chart legend prevent color-only meaning.
- Existing focus outline is retained; 44px touch targets apply at <=900px.
- Global reduced-motion rule suppresses Activity transitions; content remains visible.

## Security, privacy, health, and AI safety

Only synthetic local fixture data crosses component boundaries. No raw provider payload, real identity, health permission, credential, environment value, or external URL is used. Heart rate, calories, pace, distance, and records are labeled or disclosed as demo data at the page/coach level. AI copy is static fixture guidance, visibly non-medical, and must not claim live personalization or guaranteed gains.

No logging, telemetry, persistence, URL serialization, export, consent change, retention, or audit surface is introduced.

## Performance, compatibility, observability, migration, and rollback

- Use React, CSS, SVG, Lucide, `Intl`, and existing shared components only.
- No package/config/asset changes.
- Static fixture and SVG avoid data fetching and chart runtime cost.
- Existing dashboard provider and route remain compatible.
- Verification observability consists of component/model tests, Axe, request/storage/URL capture, geometry assertions, and deterministic screenshots.
- No API/database/environment migration.
- Rollback removes the Activity route/feature/components/tests/E2E and reverts only the narrow shared-shell/sidebar/CSS/dashboard-regression edits listed above.

## Alternatives considered

### Import the supplied HTML

Rejected because it uses CDN Tailwind, Google Fonts, Material Symbols, remote image data, imperative script, and a replacement sidebar, violating R2, R16, R23, and R24.

### Duplicate the sidebar inside Activity

Rejected because R2 requires reuse of the approved shared sidebar and duplication would drift visual/accessibility behavior.

### Leave Activity as a non-navigating sidebar button

Rejected because an actual `/activity` destination requires discoverable route navigation and correct current-page semantics. Only Dashboard and Activity become links; unbuilt destinations remain inert.

### Put Activity data into `DashboardViewModel`

Rejected because it couples destination-specific state to the dashboard provider and expands an approved contract unnecessarily. A focused Activity provider preserves feature boundaries.

### Add a chart library

Rejected because the one deterministic line/area visualization is achievable with accessible SVG/CSS and new dependencies are prohibited.

### Fully implement all reference controls

Rejected because destination workflows, persistence, menus, filters, and live AI are out of scope. Semantic no-op controls preserve fidelity without inventing product behavior.

### Hide the table columns on mobile

Rejected because essential activity data would be lost. A contained labeled table scroller preserves all fields without document overflow.

## Requirement-to-design mapping

| Requirement | Design coverage |
| --- | --- |
| R1 | Route and shared-shell design; exact file scope |
| R2-R3 | Shared-shell/sidebar design; accessibility; invariants |
| R4 | Component order; layout and visual system |
| R5 | `ActivityTopbar` |
| R6-R7 | `ActivitySummaryCards` |
| R8-R10 | `PaceHeartRate`; model; accessibility |
| R11 | `PersonalRecords`; deterministic formatting |
| R12-R13 | `RecentActivity`; responsive and control behavior |
| R14 | `DailyTrend` |
| R15 | `AiPerformanceCoach`; safety |
| R16 | Activity model/provider/format; state flow |
| R17-R19 | Loading/empty/failure/recovery |
| R20 | Layout and visual system |
| R21-R22 | Accessibility design; interaction contracts |
| R23 | Security/privacy/health/AI safety |
| R24 | Performance/compatibility/observability/rollback |
| R25 | Exact file scope; verification design |

## Implementation stop conditions

Stop with `SPEC_CHANGE_REQUIRED` if satisfying the work requires another route, sidebar visual redesign, dashboard content/data change, package/config/environment/migration/API change, real health data or permissions, live AI/network/storage behavior, remote runtime asset, unsupported source file, or any file outside the exact scope.
