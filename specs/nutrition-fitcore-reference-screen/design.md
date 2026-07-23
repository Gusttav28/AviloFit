# Nutrition Screen Design

## Design goals

Deliver the supplied FitCore Nutrition composition as a first-class `/nutrition` destination while preserving the approved AviloFit shell and keeping demo health data deterministic, safe, local, and testable. Governing requirements: R1-R17.

## Current-system observations

- The repository uses Next.js App Router routes under `app/`, React/TypeScript components, Lucide icons, shared dashboard styling, feature models/providers, and focused Vitest/Playwright coverage.
- `/dashboard` and `/activity` already establish the approved AviloFit sidebar and screen-level patterns. Nutrition should follow their route, shell, fixture, state, and test conventions rather than introducing a parallel architecture.
- The sidebar currently exposes Nutrition as a navigation item but it is not an authorized implementation target in this package beyond active-state compatibility.
- Supplied HTML is a visual reference only. Its remote image URLs, Material Symbols, inline event handlers, and Tailwind classes are not to be copied as external/runtime dependencies.

## Explicit file scope

Expected existing files to modify, subject to the implementer's read-only compatibility check:

- `app/nutrition/page.tsx` or the repository's exact Nutrition route location.
- New Nutrition screen/component files under `components/nutrition/`.
- New or extended Nutrition feature files under `features/nutrition/` if required by existing feature conventions.
- Focused Nutrition tests under `tests/nutrition/` and the existing route/navigation or E2E test location when needed.
- `app/globals.css` only if existing shared tokens cannot express the reference layout without a scoped, minimal addition.
- `progress/current.md` for the required governed handoff evidence.

No sidebar component, unrelated dashboard/activity component, dependency manifest, lockfile, configuration, or remote asset file may be modified for this work unless a reviewer documents an unavoidable compatibility fix.

## Component and data structure

Use a screen composition equivalent to:

1. `NutritionScreen` route composition.
2. Existing shared shell/sidebar with `currentSection="Nutrition"`.
3. `NutritionTopbar` for heading, food search, Quick Add, notifications, and calendar.
4. `DailyCaloriesCard` with an accessible progress/ring representation.
5. `MacroDistributionCard` with three macro rows and secondary fiber/sugar row.
6. `HydrationCard` with local increment state and glass indicators.
7. `MealHistoryCard` with deterministic meal items and analysis callout.
8. `AiRecommendationsCard`.
9. `DiscoverRecipesCard` using local/repository-approved assets.

Keep the data contract serializable and explicit. A nutrition fixture should include daily calories, target, remaining, exercise adjustment, macros, secondary nutrients, hydration consumed/target, meals, analysis copy, recommendations, and recipes. Section state should be independently representable as `loading`, `ready`, `empty`, or `error`, using the existing shared state pattern where available.

## Layout and visual behavior

- Preserve the pale green page canvas, white outlined cards, restrained dark-green primary color, serif-like display headings where the existing design system supports them, and compact uppercase labels shown by the reference.
- Keep the topbar aligned with existing shell geometry and the sidebar's content offset.
- Use a responsive grid: Daily Calories narrower than Macro Distribution on desktop; Hydration narrower than Meal History; AI Recommendations narrower than Discover Recipes. Collapse to one column at mobile widths.
- Use stable progress dimensions and text values so ring/bar layout cannot shift as content changes.
- Use semantic buttons/links for actions and Lucide icons for iconography. Do not recreate Material Symbols or inline SVG icon glyphs when an existing Lucide equivalent is available.
- Use local or repository-approved image assets with `alt` text. A neutral placeholder is preferred over a remote request when an asset is unavailable.

## State and interaction flow

- Default route: all sections render deterministic ready fixtures.
- Hydration action: click Add 250ml -> increment local consumed amount by 250ml -> cap at target -> update glass state and polite live status -> remain on route.
- Unsupported controls: preserve visible affordance and accessible name, but do not invent persistence, API behavior, or destination routes. Existing shared navigation may operate normally.
- Section error: replace only the affected section with explanatory error and retry control; retry returns to ready fixture deterministically.
- Section empty: show section-specific empty copy and next action without affecting neighboring sections.

## Safety, privacy, and observability

All values remain local demo data. Do not add API calls, storage, telemetry, model calls, user identifiers, or credentials. Analysis and recommendation copy must state or visibly imply informational/demo status and avoid diagnosis, treatment, guarantees, or prescriptive clinical advice. Test for no external requests and no storage writes.

## Accessibility and verification design

Use landmarks, one page heading, logical section headings, labeled search and icon controls, native buttons, visible focus, text equivalents for ring/bar values, `aria-live="polite"` for hydration feedback, and non-color status cues. Verification must include unit/model tests, component rendering tests, route-level responsive browser checks, accessibility scan, and regression checks for dashboard/activity/sidebar.

## Alternatives considered

- Reusing the old dashboard nutrition summary as the whole screen was rejected because it cannot represent the supplied Macro Distribution, Hydration, Meal History, recommendations, and recipe composition (R1, R4-R10).
- Copying the supplied HTML verbatim was rejected because it relies on remote images, Material Symbols, inline scripts, and a different styling system, conflicting with R2, R15, and R16.
- Building a real nutrition/AI backend was rejected because the governed item explicitly requests a reference-faithful screen and deterministic local demo behavior, not persistence or integrations (R12, R15).

## Requirement-to-design mapping

| Requirements | Design coverage |
| --- | --- |
| R1-R3 | Route, shared shell, sidebar compatibility, topbar |
| R4-R6 | Daily calories, macro, hydration components and state flow |
| R7-R10 | Meal history, analysis, recommendations, recipe components |
| R11-R12 | Responsive grid and independent section states |
| R13 | Bounded local interactions and navigation behavior |
| R14 | Semantic, keyboard, focus, text-equivalent, and image design |
| R15 | Local deterministic data and AI/health boundaries |
| R16 | Existing architecture, dependencies, assets, and performance constraints |
| R17 | Focused tests, browser verification, and regression evidence |
