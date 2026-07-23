# Meal Planner FitCore Reference Screen Design

## Design goals

Deliver the supplied FitCore Meal Planner composition as a first-class `/meal-planner` destination while preserving the approved AviloFit shell, keeping health-related content deterministic and local, and making the full reference surface responsive, accessible, and testable. This design covers R1-R20.

## Current-system observations

- The repository uses Next.js App Router routes under `app/`, React/TypeScript components, Lucide icons, scoped CSS in `app/globals.css`, typed feature models/providers, and focused Vitest/Playwright coverage.
- `DashboardShell` composes `ContextualUtilities` and accepts a typed `currentSection`. `ContextualUtilities` already route-links Dashboard, Activity, and Nutrition while retaining unbuilt destinations as buttons. Meal Planner should extend this exact pattern narrowly.
- The approved sidebar is fixed on larger viewports and uses the existing responsive rail behavior below the repository breakpoint. Meal Planner content must fit around it and must not duplicate or override it.
- Nutrition and Activity establish deterministic feature providers, `structuredClone` isolation, local state boundaries, scoped state cards, Lucide/native semantics, and request/storage/URL safety checks.
- The current repository has no separate architecture, accessibility, privacy, or visual handbook. The harness, existing specs, current shell implementation, global focus/reduced-motion rules, package scripts, and neighboring screen tests are the applicable conventions.
- The supplied HTML is a visual/structural reference only. Its Tailwind CDN, Google Fonts, Material Symbols, remote image URLs, replacement FitCore sidebar, and imperative alert/hover script are prohibited at runtime.

## Exact file scope

### Existing files expected to modify

- `components/dashboard/contextual-utilities.tsx` - extend the existing typed current-section union and add the existing Meal Planner item as a `/meal-planner` link while preserving its current DOM, label, icon, order, classes, and all other item behavior.
- `app/globals.css` - add only `.meal-planner-*` rules, responsive rules, state geometry, focus treatment, and reduced-motion handling. Do not alter `.avilo-sidebar-*` or unrelated screen declarations.
- `tests/dashboard/navigation.test.tsx` - add the focused route/current-state regression for the existing sidebar contract if the current test file is the established location.
- `progress/current.md` - record the implementation handoff evidence required by neighboring work and the repository workflow.

### New application files

- `app/meal-planner/page.tsx` - server route that reads the typed fixture provider and renders the client screen.
- `features/meal-planner/model.ts` - serializable typed contract for week labels, targets, bands, cards, local statuses, and topbar copy.
- `features/meal-planner/fixture-meal-planner-provider.ts` - deterministic reference fixture provider returning a clone.
- `features/meal-planner/format.ts` - pure locale/target/calorie/progress formatting and clamping helpers where existing helpers do not fit.
- `components/meal-planner/meal-planner-screen.tsx` - client state owner and ordered screen composition.

### New focused tests expected

- `tests/meal-planner/model.test.ts` - fixture cardinality/order, exact reference values, clone isolation, fixed week labels, and no runtime time/random/remote URL dependencies.
- `tests/meal-planner/format.test.ts` - number/calorie formatting and progress clamping at below-zero, exact, and above-target boundaries.
- `tests/meal-planner/meal-planner-screen.test.tsx` - route composition, exact cards, day selection, local feedback, add slots, favorite state, state isolation, labels, and accessible values.
- `tests/meal-planner/health-ai-safety.test.tsx` - deterministic local data, no unsafe clinical/AI claims, no storage/network/URL side effects, and no remote image source.
- `e2e/meal-planner.spec.ts` - responsive route, sidebar, keyboard/touch path, geometry, screenshots, request/storage capture, reduced motion, and accessibility evidence.

### Local asset scope

The implementer may reuse existing approved local food assets such as `public/dashboard/avocado-poached-egg.webp` and `public/dashboard/quinoa-chicken-bowl.webp` where they match the reference. If additional image-bearing cards require visuals, any new files must be local, stable, explicitly listed in the implementation handoff, and sourced through the repository's approved asset process. No remote runtime URL is allowed. If approved local visuals are unavailable, use an accessible neutral local visual and record the fidelity tradeoff; do not hotlink.

### Explicitly unchanged

- All existing sidebar visual declarations, geometry, labels, profile, settings separation, and responsive behavior.
- `components/dashboard/dashboard-shell.tsx` unless a type-only compatibility adjustment is proven necessary; no shell visual or layout change.
- Dashboard, Activity, and Nutrition screen content, providers, fixtures, and styling.
- `package.json`, lockfiles, framework/test/lint/PostCSS configs, environment files, migrations, APIs, databases, and dependency versions.
- Every route other than the new `/meal-planner` route.

## Route and shared-shell design

The route/data flow is:

```text
app/meal-planner/page.tsx
  -> fixtureMealPlannerProvider.getMealPlanner()
  -> MealPlannerScreen
  -> DashboardShell currentSection="Meal Planner"
  -> ContextualUtilities current-section route/link semantics
```

`DashboardShell` remains the composition boundary. `ContextualUtilities` gains only the `"Meal Planner"` union value and the `href: "/meal-planner"` on its existing Meal Planner item. The item keeps its current icon, label, list position, classes, target size, focus behavior, and responsive layout. The active item alone receives the existing `.active` treatment and `aria-current="page"`. All unbuilt rows remain buttons.

The route screen owns a single `<main id="main" className="meal-planner-page">` with one `h1`. The screen must not create a second sidebar or shell offset. The topbar and content use the current `dashboard-frame` content area and add only scoped Meal Planner styling.

## Meal Planner model and provider

Use explicit serializable types equivalent to:

- `MealPlannerSectionName = "targets" | "grocery" | "planner"`.
- `MealPlannerSectionStatus = "ready" | "loading" | "empty" | "error"`.
- `MealPlannerDay` with stable id, short label, accessible label, and fixed display date.
- `WeeklyTarget` with label, consumed, target, unit, and progress tone.
- `MealCardData` with id, day id, meal type, name, calories, optional local visual key/source, image alternative, and `favorite` boolean.
- `MealBandData` with meal type, icon key, and seven ordered `MealSlot` values where a slot is either a meal card or add slot.
- `MealPlannerViewModel` with locale, product name, search placeholder, days, initial selected day, targets, overall progress, grocery copy, ordered bands, section states, and deterministic safety copy.

The fixture must encode the exact week labels and card matrix in R6-R10. The provider returns `structuredClone(model)` so screen-local state cannot mutate the fixture or subsequent requests. No `Date.now`, `new Date()` for visible content, random values, remote URL, fetch, storage, or model call may enter the fixture path.

`format.ts` should contain pure helpers for locale number formatting, calorie labels, target pair labels, and clamped progress. Progress uses a shared calculation so visible bars, ARIA values, and the overall ring cannot disagree.

## Component design

### `MealPlannerScreen`

This is the only Meal Planner client state owner. It holds:

- controlled `searchValue`;
- `selectedDayId`, initialized to `Wed 14`;
- a local polite `actionMessage` for bounded unsupported actions;
- independent `sectionStates` for targets, grocery, and planner.

It renders `DashboardShell currentSection="Meal Planner"`, `MealPlannerTopbar`, the target/grocery summary row, `DaySelector`, and the three ordered `MealBand` sections. A local `section(name, readyContent)` wrapper uses the existing state pattern and retries only the named section. Ready siblings and selected-day/search state survive a section retry.

### `MealPlannerTopbar`

Renders the `Meal Planner` heading, labeled controlled recipe search, Quick Add, calendar, and notification controls. Uses Lucide `Search`, `Plus`, `CalendarDays`, and `Bell` or repository-equivalent existing icons. Quick Add, calendar, notification, and search are local/inert unless an approved shared behavior already exists. The unread indicator is paired with an accessible name rather than color alone.

### `WeeklyTargetSummary`

Renders the `Weekly Nutrition Target` card with three fixed metric groups, three semantic progress bars, and the circular `82%` summary ring. The ring is a visual enhancement with a nearby text description containing the same values. Use SVG/CSS geometry with stable dimensions; do not hand-draw a new icon glyph.

### `GroceryListCta`

Renders a distinct primary green panel with grocery icon, `Generate Grocery List`, and `Based on your weekly meals`. It receives a typed local feedback callback and does not navigate, persist, or generate a real list.

### `DaySelector`

Renders seven native buttons in fixed order with `aria-pressed` or an equivalent current semantic. It accepts selected id and callback. On change, it updates selection, retains the full week grid, and announces the selected day in a polite live region.

### `MealBand` and `MealCard`

`MealBand` renders an accessible heading with the reference icon, a divider, and seven slots. `MealCard` renders optional local visual, name, calorie label, and an accessible day/type label. `AddMealSlot` is a native button with stable dimensions and bounded feedback. `favorite` is presentation-only and renders the `FAVORITE` badge plus text equivalent only for Pan-Seared Scallops.

The card matrix is data-driven, not seven separate hard-coded component branches. A responsive card retains its day/type association through visible or screen-reader-readable metadata when the desktop column alignment is reflowed.

### `MealPlannerState`

Use the existing shared state language or a scoped equivalent. Loading reserves the same major geometry. Empty and error states are section-specific, use `role="status"` or `role="alert"` as appropriate, and include retry only when meaningful. No state renders fabricated nutrition values.

## Layout and visual system

- Preserve the reference pale green canvas, white summary/card surfaces, dark green primary action, soft outline separators, compact uppercase meal labels, and high-contrast black/dark text while staying within existing AviloFit tokens.
- Keep the topbar, target summary, grocery CTA, day selector, and meal grid aligned to the existing shell content offset. The sidebar remains outside the screen component's layout ownership.
- At desktop (`>=1200px`), use a seven-column planner grid with stable gaps and full-width meal-band headings. The target summary occupies the wider side of the two-part top row and the grocery CTA the narrower side.
- At tablet widths, the target/CTA row and card slots may wrap. Preserve the seven-day sequence and use a contained planner scroller only if a full-grid reflow cannot preserve association without document overflow.
- At mobile widths, use a readable single-column or contained planning layout with visible day/type association. The day selector may scroll within its own labeled region; the document must not horizontally overflow.
- Use stable `min-height`, `aspect-ratio`, and grid tracks for cards, add slots, the ring, progress bars, and floating buttons. Long meal names wrap rather than resize the grid.
- Use Lucide icons and CSS/SVG only for the progress visualization. Do not import Material Symbols, Tailwind CDN, Google Fonts, remote images, or inline imperative scripts.
- Preserve existing global focus-visible and reduced-motion behavior. Scoped hover motion must be disabled or reduced under `prefers-reduced-motion: reduce`.

## State and interaction flow

Default flow:

1. Route reads the cloned fixture and renders all sections ready.
2. Search is controlled locally and does not filter or fetch unless a pre-existing approved pattern is explicitly reused.
3. `Wed 14` is selected; selecting another day changes underline/current semantics and a polite message only.
4. Add slots, grocery CTA, Quick Add, calendar, notification, meal cards, and floating actions provide bounded local feedback or remain inert.
5. Refreshing or revisiting restores the initial fixture and `Wed 14`.

Invariants:

- Exactly one day is selected.
- Each meal band has exactly seven ordered slots in ready state.
- The Pan-Seared Scallops favorite badge is static and unique.
- The displayed progress ratio and accessible progress values agree.
- No action mutates provider data, writes storage, sends a request, or changes unapproved URL state.
- Existing routes and sidebar active states remain unchanged.

## Loading, empty, failure, and recovery

`targets`, `grocery`, and `planner` are independently stateful. The default fixture is ready. Loading uses a stable skeleton with a screen-reader announcement. Empty states explain the missing section without inventing values. Errors use alert semantics, a section-specific message, and Retry. Retry synchronously restores ready fixture data for only that section in fixture mode and preserves search, selected day, and sibling states.

## Accessibility design

- Use `main`, `header`, `nav` from the shared shell, one `h1`, and ordered `h2`/`h3` hierarchy.
- Use native `button`, `a`, and `input` semantics; provide text labels or `aria-label` for icon-only controls.
- Use `aria-current="page"` for the active sidebar route, `aria-pressed` for day selection, `role="progressbar"` with values for bars, and a textual `role="img"`/description or equivalent for the ring.
- Expose meal name, meal type, day, calories, and favorite text to assistive technology. Images need meaningful alternatives; neutral decorative backgrounds must be marked hidden.
- Provide `aria-live="polite"` for selected-day and bounded-action feedback. Use `role="alert"` for errors.
- Maintain visible focus, contrast, 44px minimum action targets, logical keyboard order, and no color-only status cue.
- Verify Axe and reduced motion at desktop and mobile widths.

## Security, privacy, health, and observability

All data is local fixture content. Do not add API calls, storage, telemetry, identifiers, credentials, model calls, permissions, or third-party requests. Copy must remain informational demo content and must not imply diagnosis, treatment, clinical certainty, personalized medical advice, or professional nutrition care. Verification captures failed external requests, storage writes, URL mutations, console errors, and broken local images.

## Performance, compatibility, migration, and rollback

- Reuse existing dependencies and provider patterns; no package or lockfile change is authorized.
- Keep images local and explicitly sized. Prefer existing assets; use a neutral local visual if approved provenance is unavailable.
- Preserve the existing dashboard-frame and sidebar geometry; add scoped CSS only.
- No migration, API, database, or environment change is required.
- Rollback removes only the Meal Planner route, feature/components, scoped styles, focused tests/assets, and the narrow Meal Planner navigation link change listed above. It must not revert unrelated user changes or other screen behavior.

## Alternatives considered

### Copy the supplied HTML verbatim

Rejected because it relies on CDN Tailwind, Google Fonts, Material Symbols, remote images, a replacement sidebar, and imperative script behavior, conflicting with R2, R17-R19.

### Duplicate the FitCore sidebar inside Meal Planner

Rejected because R2 requires the existing AviloFit sidebar and duplication would create drift in navigation, profile, settings, focus, and responsive behavior.

### Put Meal Planner data into the Nutrition provider

Rejected because it couples destination-specific weekly planning state to Nutrition and expands an existing public data contract. A focused feature provider matches the Dashboard, Activity, and Nutrition boundaries.

### Implement a real grocery list, meal editor, drag-and-drop, or favorite toggle

Rejected because those capabilities require persistence, data contracts, or product decisions not authorized by the governed work item. The reference states are represented faithfully as deterministic local presentation and bounded feedback.

### Use a permanent seven-column mobile overflow canvas

Rejected as the default because it makes day/card association difficult on narrow screens and risks unreachable content. A contained scroller is allowed only as a fallback after a responsive reflow cannot preserve the reference order and association without document overflow.

## Requirement-to-design mapping

| Requirement | Design coverage |
| --- | --- |
| R1-R2 | Route/shared-shell design and exact file scope |
| R3 | `MealPlannerTopbar`, accessibility, interaction boundaries |
| R4 | `WeeklyTargetSummary`, model, formatting, layout |
| R5 | `GroceryListCta`, local feedback, accessibility |
| R6 | `DaySelector`, state flow, invariants |
| R7-R10 | Model, `MealBand`, `MealCard`, exact reference matrix |
| R11-R13 | `AddMealSlot`, floating actions, bounded interaction design |
| R14-R15 | State/interaction flow and independent section states |
| R16 | Responsive layout and stable geometry |
| R17 | Accessibility design and verification |
| R18-R19 | Privacy, asset, dependency, performance, and compatibility policy |
| R20 | Exact file scope, verification, rollback, and task traceability |

## Implementation stop conditions

Stop with `SPEC_CHANGE_REQUIRED` if satisfying this package requires a sidebar redesign or duplicate, another route, a dashboard/activity/nutrition content change, package/config/environment/migration/API/database change, remote runtime asset, real health data or permission, live AI/network/storage behavior, a new interaction contract, an unlisted file, or a user-visible behavior not described by R1-R20.

