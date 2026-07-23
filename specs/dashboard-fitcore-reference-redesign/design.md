# Dashboard FitCore Reference Redesign Design

## Design goals

This design satisfies R1-R24 by replacing only the current `/dashboard` main-content composition with the supplied FitCore reference hierarchy, translated to Avilo Fit and deterministic local data. It freezes the existing sidebar, avoids new dependencies and product workflows, and makes responsive, state, safety, and visual verification explicit.

## Current-system observations

- `app/dashboard/page.tsx` is a server entrypoint that gets a `DashboardViewModel` from `fixtureDashboardProvider` and renders `DashboardScreen`; this boundary is already suitable.
- `DashboardShell` renders `ContextualUtilities` and children. `contextual-utilities.tsx` is the approved sidebar and is immutable for this work.
- `DashboardScreen` currently owns section retry and selected-date state and composes the daily card strip, greeting, nutrition/activity summaries, progress, history, and Ask Avilo. That composition is replaced.
- `model.ts` and `fixture-dashboard-provider.ts` contain typed deterministic dashboard data and section states, but their active reference types describe the outgoing layout.
- `SectionState` already provides generic loading/empty/error/retry behavior and can be reused with a stable region wrapper.
- `format.ts` already centralizes locale, currency, date, and time formatting.
- `app/globals.css` contains all active layout styling, including sidebar rules that must be preserved byte-for-byte within their selector blocks.
- Vitest/Testing Library and Playwright/Axe already cover the dashboard at 360, 768, 1024, and 1440 widths and capture screenshots. Existing tests are tightly coupled to outgoing content and require scoped replacement.
- `public/` is empty. The supplied HTML references remote prototype images, but runtime external requests are prohibited; three local optimized image assets are required for meal thumbnails. The sidebar has no image dependency.

## Exact file scope

### New files

- `components/dashboard/dashboard-topbar.tsx`
- `components/dashboard/weekly-performance.tsx`
- `components/dashboard/quick-metrics.tsx`
- `components/dashboard/todays-meals.tsx`
- `components/dashboard/dashboard-calendar.tsx`
- `components/dashboard/workout-cards.tsx`
- `components/dashboard/smart-insights.tsx`
- `tests/dashboard/fitcore-dashboard-sections.test.tsx`
- `public/dashboard/avocado-poached-egg.webp`
- `public/dashboard/quinoa-chicken-bowl.webp`

The two meal thumbnails are downloaded once from the source URLs embedded in the user-supplied `dashboard.html`, converted/optimized locally, stripped of unnecessary metadata, and committed as static assets. If those URLs are unavailable or licensing/provenance cannot be established, stop with `SPEC_CHANGE_REQUIRED`; do not hotlink or substitute generated/stock content without Gustavo's decision.

### Existing files to modify

- `components/dashboard/dashboard-screen.tsx`
- `features/dashboard/model.ts`
- `features/dashboard/fixture-dashboard-provider.ts`
- `features/dashboard/format.ts`
- `components/dashboard/section-state.tsx`
- `app/globals.css`
- `tests/dashboard/dashboard-screen.test.tsx`
- `tests/dashboard/model.test.ts`
- `tests/dashboard/format.test.ts`
- `tests/dashboard/navigation.test.tsx`
- `tests/dashboard/health-and-ai-safety.test.tsx`
- `e2e/dashboard.spec.ts`
- `progress/current.md`

### Explicitly unchanged

- `components/dashboard/contextual-utilities.tsx`
- `components/dashboard/dashboard-shell.tsx`
- `app/dashboard/page.tsx`
- `features/dashboard/dashboard-provider.ts`
- All other `components/dashboard/*` files, including outgoing components; they remain available for later governed cleanup and existing isolated tests but are not rendered by `DashboardScreen`.
- `tests/dashboard/calendar.test.tsx`, `daily-summary-cards.test.tsx`, `meal-workout-history.test.tsx`, `recommendations.test.tsx`, and `selectors.test.ts`; these continue testing retained modules even though they are not in the active main-content composition.
- `package.json`, lockfiles, Next/Tailwind/TypeScript/Vitest/Playwright config, environment files, and dependencies.

If implementation requires any other file, the Implementer stops with `SPEC_CHANGE_REQUIRED`.

## Component composition

```text
DashboardShell (unchanged)
  ContextualUtilities (unchanged sidebar)
  main.fitcore-dashboard
    DashboardTopbar
    section.fitcore-dashboard-content
      WeeklyPerformance | SectionState
      QuickMetrics | SectionState
      div.fitcore-lower-grid
        div.fitcore-primary-column
          TodaysMeals | SectionState
          WorkoutCards | SectionState
        aside.fitcore-secondary-column
          DashboardCalendar | SectionState
          SmartInsights | SectionState
```

`DashboardScreen` remains the only client state owner. It owns section status retries, header search text, and selected calendar date. None of those values are persisted or sent to a provider.

## Data model and interfaces

Extend `features/dashboard/model.ts` with presentation-neutral typed records:

```text
DashboardSectionName += "performance" | "metrics" | "meals" | "workouts" | "insights"

FitCoreProgress { value: number; max: number }
FitCorePerformance {
  goalPercent; title; message; points;
  metrics: [{ kind; label; value } x3]
}
FitCoreQuickMetric {
  kind: "steps" | "water" | "calories" | "sleep";
  context; value; label; progress
}
FitCoreMeal {
  id; state: "logged" | "scheduled";
  occasion; name?; suggestion?; time; calories?;
  protein?; carbs?; fat?; imageSrc?; imageAlt?
}
FitCoreCalendarDay { date; inCurrentMonth; hasEvent }
FitCoreCalendarEvent { id; date; label; tone: "primary" | "neutral" }
FitCoreWorkout {
  id; kind: "run" | "strength"; name; durationMinutes;
  calories; averageHeartRate; progress
}
FitCoreInsight { recommendation; recoveryPercent; disclaimer }
FitCoreDashboardData {
  productName; searchPlaceholder; performance; quickMetrics;
  meals; calendarRange; calendarDays; events; workouts; insight
}
DashboardViewModel { fitCore: FitCoreDashboardData }
```

Retain current model exports so unchanged neighboring components/tests compile. Add the six new section-state keys to the deterministic `sectionStates`. The fixture uses stable dates around the existing `2026-07-20` through `2026-07-26` range rather than the prototype's November 2023 date. Values visually follow the reference: 75% goal, 94/100, 12,450 calories burned, 480m, 8,432 steps, 70% water, 640 kcal left, 7h 45m sleep, breakfast/lunch/dinner, two workouts, and 85% recovery. The user-facing name follows the existing Avilo fixture identity (`Uzui`) rather than importing `Alex Carter` from FitCore.

All progress values use `{value,max}` and a shared pure clamp/percentage helper in `format.ts` (or an equivalently named existing-format export) so SVG/CSS width and ARIA values cannot diverge. Date/time/number output uses existing `Intl` helpers and configured locale/time zone.

## Component contracts

### `DashboardTopbar`

Accepts `productName`, `searchValue`, `onSearchChange`, `searchPlaceholder`. It renders a labeled search input and native Quick Add/calendar buttons. Icons come from `lucide-react`; decorative icon nodes use `aria-hidden`. Buttons have stable no-op handlers or no action beyond native focus/pressed feedback; no links, dialogs, or promises are invented.

### `WeeklyPerformance`

Accepts `FitCorePerformance`. The goal ring is an SVG with a neutral track and primary stroke, rotated so progress begins at 12 o'clock. It exposes `role="progressbar"`, label, `aria-valuemin=0`, `aria-valuemax=100`, and clamped `aria-valuenow`. Visible percent reads the same value. Three inset metrics map from the typed array in fixed fixture order.

### `QuickMetrics`

Accepts exactly four `FitCoreQuickMetric` records. It maps each kind to an existing Lucide icon and renders an ordered grid. Each card's progress element is labeled by metric and exposes the same clamped value used for width.

### `TodaysMeals`

Accepts `meals`, `locale`, and `timeZone`. Logged rows render local images only when `imageSrc` and `imageAlt` are present. Scheduled rows use a Lucide utensils tile. Edit, Customize Plan, and Log are native buttons with specific accessible names and no persistence. Missing optional nutrition values are omitted, not rendered as zero.

### `DashboardCalendar`

Accepts `calendarDays`, `events`, `selectedDate`, `onSelectDate`, `locale`, `timeZone`, and `calendarRange`. It derives the month label and selected event list. Previous/next select the first available date in the adjacent fixture-backed month/period; controls disable at range boundaries. Native date buttons expose full-date labels and `aria-current=date`. A polite live region announces selected date changes after user action, not on mount.

### `WorkoutCards`

Accepts exactly two workout records. It maps kind to Lucide icon; values use `Intl` formatting. Heart rate is visibly suffixed `bpm Avg (demo)` or accompanied by equivalent nearby demo-source text. Progress is semantic and clamped.

### `SmartInsights`

Accepts `FitCoreInsight`. It renders the dark reference card, deterministic recommendation, semantic recovery progress, and disclaimer. `View Recovery Report` is a native button whose activation does not navigate or fetch.

### `SectionState`

Retain the existing public contract. Add an optional class/stable-height hook only if necessary to reserve section geometry; do not specialize its copy by embedding FitCore data. DashboardScreen supplies the section name and wrapper semantics.

## Layout and visual system

Add a new `.fitcore-*` namespace in `app/globals.css`. Existing `.utility-rail`, `.rail-*`, and their media rules are not edited. Existing outgoing dashboard selectors may remain because cleanup is outside scope.

- Main content uses a pale green canvas close to the PNG/HTML (`#f7fbf0`) and a max width near 1440px, with enough left clearance at desktop that the fixed collapsed sidebar does not overlap content.
- Header is sticky only if it does not conflict with the existing sidebar stacking context; otherwise it remains in normal flow. It uses an Avilo Fit wordmark, 256-288px search, dark Quick Add, and calendar icon control.
- Cards use white backgrounds, subtle gray-green borders, 20-24px radius for major surfaces, 16-20px for metric cards, and restrained shadows matching the PNG. This screenshot direction overrides the contradictory sharp/no-shadow prose in `dashboard.md`.
- Weekly Performance is a horizontal desktop card with a roughly 200px ring and flexible content; under 768px it stacks without shrinking the ring below legibility.
- Quick metrics use four equal columns desktop, two at tablet, one at mobile.
- Lower grid uses `minmax(0,2fr) minmax(280px,1fr)` desktop; one column below the established breakpoint. Primary column contains meals and a two-card workout grid. Secondary column contains calendar and insights.
- Meal rows preserve thumbnail, content, time, and action alignment desktop; mobile uses a stable grid/reflow so text and controls never overlap.
- No font size scales with viewport width, no gradient/orb/bokeh decoration is added, and no card is nested inside a decorative card except the reference-required inset metric/progress surfaces.

## State flow and invariants

```text
fixtureDashboardProvider -> DashboardViewModel.fitCore -> DashboardScreen
DashboardScreen searchValue ---------------------------> DashboardTopbar
DashboardScreen selectedCalendarDate ------------------> DashboardCalendar
DashboardScreen sectionStates -> independent section wrapper -> ready/state
```

Invariants:

- Sidebar render tree and behavior are unchanged.
- Exactly four quick metrics, three meals, and two workouts exist in the ready fixture.
- All visible numeric values come from `model.fitCore`.
- Progress DOM width/stroke and ARIA value share one clamped calculation.
- Calendar selection can only be one of `calendarDays`; unrelated metrics do not change.
- Search and buttons do not cause network, storage, URL, or fixture mutation.
- Retrying one section does not reset search, calendar date, or sibling states.

## Loading, empty, failure, and recovery

`DashboardScreen` wraps performance, metrics, meals, calendar, workouts, and insights independently. Loading renders the existing skeleton/status within a wrapper with section-appropriate minimum geometry. Empty states use the shared message pattern; list components render no fabricated placeholder items. Error renders an alert and Retry. Retry synchronously marks only that section ready in fixture mode. The header and sidebar are always available after the page model has loaded.

## Accessibility

- One `<main>` and logical headings: page/product context is not duplicated as an H1 if the performance section provides the main visible hierarchy; use a visually hidden H1 `Avilo Fit dashboard` if needed, then H2 section headings.
- Regions use heading references instead of repeated generic labels.
- Native inputs/buttons/date buttons preserve browser semantics and keyboard activation.
- Icon-only controls have explicit names; decorative icons are hidden.
- Images have meal-specific alt text and fixed dimensions/aspect ratio to prevent layout shift.
- Progress rings/bars expose names and values; selected date exposes `aria-current`.
- Focus uses the existing `--focus` outline and is never removed or clipped.
- Status announcements are polite except errors, which use alert semantics.
- Reduced motion removes ring/bar transitions without hiding final values.

## Security, privacy, and health safety

Only synthetic local fixture values are rendered. Components receive data, never credentials, raw provider payloads, or private user records. There is no logging, telemetry, storage, export, URL state, or request. Local images are metadata-minimized static assets. Recommendation and health metrics retain a visible deterministic-demo/non-medical disclaimer. No calorie earning/offset, diagnosis, treatment, or guaranteed-outcome language is allowed.

## Performance, compatibility, observability, migration, and rollback

- No package changes. Use CSS/SVG, React state, Lucide, and existing `Intl` utilities.
- Static image dimensions and local WebP assets avoid network and layout shift. Use Next `<Image>` only if it requires no config change; otherwise native `<img>` with explicit dimensions is acceptable under the existing architecture.
- No runtime telemetry is introduced. Unit/component tests, Axe, request capture, geometry, and screenshots provide implementation observability.
- No API/schema/environment/data migration exists. `DashboardProvider.getDashboard()` signature remains unchanged.
- Rollback reverts only the scoped files and removes the seven new components, one new test file, and two assets. It must not revert the sidebar or previous governed artifacts.

## Alternatives considered

### Import the supplied HTML directly

Rejected because it loads Tailwind CDN, Google fonts, Material Symbols, remote images, and imperative script, conflicting with R11, R19, R21, and repository architecture.

### Replace the Avilo sidebar with the FitCore sidebar

Rejected by the explicit user boundary and R1. The screenshot sidebar is context only.

### Restyle existing Summary/Activity components into the new screen

Rejected because their data contracts and semantics represent a different hierarchy. New focused view components reduce conditional complexity while retained modules remain untouched for possible future use.

### Delete outgoing dashboard components and tests

Rejected because cleanup is unrelated, prior specs may still reference them, and deletion increases rollback risk. They simply stop rendering in the active screen.

### Add a charting or circular-progress dependency

Rejected because one SVG/CSS ring is sufficient and package changes are prohibited.

### Hotlink prototype images

Rejected because external runtime requests are unreliable and privacy/performance hostile. The two source-provided meal images are vendored locally only if provenance and access are valid.

### Make every reference control fully functional

Rejected because workflows, persistence, dialogs, and destinations are not specified. Accessible presentation-only controls preserve reference fidelity without inventing product behavior.

## Requirement-to-design mapping

| Requirement | Design coverage |
| --- | --- |
| R1 | Exact unchanged scope; composition; sidebar invariants |
| R2 | Component composition and `DashboardScreen` replacement |
| R3 | Layout and visual system; reference-source precedence |
| R4 | `DashboardTopbar` contract and local search state |
| R5 | `WeeklyPerformance` contract and typed performance model |
| R6 | `QuickMetrics` contract and progress helper |
| R7 | `TodaysMeals`, local assets, fixture meals |
| R8 | `DashboardCalendar`, state ownership, calendar model |
| R9 | `WorkoutCards` and workout model |
| R10 | `SmartInsights`, safety and no-op control |
| R11 | Data model, fixture flow, invariants |
| R12-R14 | Loading/empty/error/recovery design and SectionState reuse |
| R15 | Responsive layout rules and stable reflow |
| R16-R18 | Accessibility section and component contracts |
| R19-R20 | Security, privacy, and health safety |
| R21 | Performance design and prohibited dependencies |
| R22 | Compatibility, migration, rollback |
| R23 | Observability and visual evidence |
| R24 | Exact file scope and verification gates |

## Implementation stop conditions

Stop with `SPEC_CHANGE_REQUIRED` if the work requires editing the sidebar component/behavior, adding a destination screen, package/config/environment change, live API or persistence, remote runtime asset, unavailable/unlicensed source image substitution, unlisted file, health-permission change, or materially different information hierarchy.

