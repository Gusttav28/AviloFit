# Recipes FitCore Reference Screen Design

## Design Goals

Deliver the supplied FitCore Recipes reference as a first-class `/recipes` destination while preserving the existing AviloFit shell, changing only the existing `Course Release` sidebar item into `Recipes`, protecting the dirty Meal Planner worktree, and keeping all recipe/nutrition behavior deterministic, local, accessible, and testable. This design covers R1-R21.

## Current-System Observations

- The repository uses Next.js App Router routes under `app/`, React/TypeScript components, typed feature providers under `features/`, focused Vitest tests, Playwright E2E tests, Lucide icons, and scoped CSS in `app/globals.css`.
- `DashboardShell` composes `ContextualUtilities` and accepts a typed `currentSection`.
- `ContextualUtilities` currently has primary sidebar items in this order: Dashboard, Activity, Nutrition, Meal Planner, Course Release, Progress, Statistics, Goals. Settings is a footer item. The current `Course Release` item uses the `GraduationCap` icon and no `href`.
- The working tree contains prior Meal Planner changes on `develop`. Recipes implementation must work with those changes and avoid reverting, restyling, or rewriting them.
- Nutrition, Activity, Dashboard, and Meal Planner patterns establish deterministic fixture providers, isolated local state, section-state handling, route-aware shell usage, and focused route/navigation tests.
- The supplied `receipes.html` contains Tailwind CDN, Google Fonts, Material Symbols, remote image URLs, a replacement FitCore sidebar, and imperative scripts. Those are reference-only and prohibited at runtime.
- No project-wide architecture, accessibility, privacy, or design-system handbook beyond the harness and existing specs was found. Existing implementation patterns, global focus/reduced-motion rules, package scripts, and this approved package are the governing conventions.

## Exact File Scope

### Existing Files Expected To Modify

- `components/dashboard/contextual-utilities.tsx`
  - Add `"Recipes"` to the `DashboardSection` union.
  - Change only the existing `Course Release` primary item to `{ label: "Recipes", icon: GraduationCap, href: "/recipes" }`.
  - Preserve item order, current icon, classes, DOM grouping, footer/profile/settings, active class, and responsive behavior.
- `app/globals.css`
  - Add only `.recipes-*` scoped styles plus required responsive, focus, state, reduced-motion, and local visual rules.
  - Do not edit `.avilo-sidebar-*`, existing `.meal-planner-*`, `.nutrition-*`, `.activity-*`, `.fitcore-*`, shared tokens, or unrelated screen declarations unless a reviewer later approves a separate spec change.
- `tests/dashboard/navigation.test.tsx`
  - Update sidebar expectations from `Course Release` to `Recipes`.
  - Add Recipes route/current-state assertions.
  - Preserve existing Dashboard/Activity/Nutrition/Meal Planner assertions and sidebar structure counts.
- `tests/activity/activity-screen.test.tsx`
  - If required by existing assertions, update only the global sidebar label expectation from `Course Release` to `Recipes`; do not change Activity behavior expectations.
- `tests/meal-planner/meal-planner-screen.test.tsx`
  - If required by existing assertions, update only the global sidebar label expectation from `Course Release` to `Recipes`; do not change Meal Planner behavior expectations.
- `e2e/dashboard.spec.ts`, `e2e/activity.spec.ts`, or `e2e/meal-planner.spec.ts`
  - Only if existing E2E assertions reference `Course Release`, update the label expectation to `Recipes`; do not otherwise change existing routes.
- `progress/current.md`
  - Implementation-phase evidence only. The Spec Author does not edit this file.

### New Application Files Expected

- `app/recipes/page.tsx`
  - Server route that reads the fixture provider and renders `RecipesScreen`.
- `features/recipes/model.ts`
  - Serializable typed contract for recipe page data, local section states, recipe cards, metrics, categories, hero, trending, and seasonal copy.
- `features/recipes/fixture-recipes-provider.ts`
  - Deterministic local provider returning a structured clone.
- `features/recipes/format.ts`
  - Pure helpers for calories, macro labels, time labels, category matching, and bounded values where existing helpers do not fit.
- `components/recipes/recipes-screen.tsx`
  - Client state owner and ordered Recipes page composition.

### New Focused Tests Expected

- `tests/recipes/model.test.ts`
  - Fixture exactness, ordering, clone isolation, local asset/source policy, no time/random/network dependency.
- `tests/recipes/format.test.ts`
  - Calorie, macro, time, category, and invalid-value formatting/bounds.
- `tests/recipes/recipes-screen.test.tsx`
  - Route composition, topbar, hero, trending/seasonal panels, filters, cards, favorites, quick-add, floating action, section states, accessibility, and local feedback.
- `tests/recipes/health-ai-safety.test.tsx`
  - No unsafe health/AI claims, no personal data behavior, no storage/network/URL side effects, no remote runtime assets.
- `e2e/recipes.spec.ts`
  - Browser route, sidebar preservation, responsive geometry, keyboard path, local interactions, no external requests/storage/URL writes, reduced motion, Axe, and screenshots.

### Local Asset Scope

The Implementer may reuse existing approved local assets, such as `public/dashboard/avocado-poached-egg.webp` and `public/dashboard/quinoa-chicken-bowl.webp`, when they reasonably match a recipe. If more visual fidelity is needed, additional assets must be local, stable, explicitly listed in the handoff, and approved by the repository asset process. No runtime remote image URL from `receipes.html` may be used. If no approved local visual exists, render a neutral accessible local visual and record the fidelity tradeoff.

### Explicitly Unchanged

- Sidebar visual CSS, dimensions, breakpoints, active class styling, icon sizes, profile, settings separation, brand text, and responsive behavior.
- The `Meal Planner` sidebar item, `/meal-planner` route, Meal Planner feature/provider/component behavior, Meal Planner CSS, and Meal Planner tests except global sidebar-label expectation updates described above.
- Dashboard, Activity, Nutrition, Progress, Statistics, Goals, and Settings content or route behavior.
- `components/dashboard/dashboard-shell.tsx` unless a type-only import compatibility change is proven necessary; no visual/layout shell change.
- `package.json`, lockfiles, configs, secrets, environment files, API/database/migration files, deployment files, and dependency versions.

## Route And Shared-Shell Design

The route/data flow is:

```text
app/recipes/page.tsx
  -> fixtureRecipesProvider.getRecipes()
  -> RecipesScreen
  -> DashboardShell currentSection="Recipes"
  -> ContextualUtilities active route/link semantics
```

`DashboardShell` remains the only shell boundary. `RecipesScreen` must not render a second sidebar, replacement FitCore aside, alternate profile block, or custom shell offset. The new route must use the existing dashboard frame and place a single `main` element with `id="main"` and `className="recipes-page"` inside the shell.

The `ContextualUtilities` change is intentionally surgical:

```text
Before: { label: "Course Release", icon: GraduationCap }
After:  { label: "Recipes", icon: GraduationCap, href: "/recipes" }
```

No other primary item may move, change icon, change class, change href, become active differently, or switch role. The FitCore `menu_book` icon in the reference is rejected because the user approved a label/sidebar destination change only.

## Recipes Model And Provider

Use explicit serializable types equivalent to:

- `RecipesSectionName = "hero" | "discovery" | "filters" | "recipes"`.
- `RecipesSectionStatus = "ready" | "loading" | "empty" | "error"`.
- `RecipeMetricKey = "cal" | "protein" | "carbs" | "fat"`.
- `RecipeMetric` with key, label, value, and display text.
- `RecipeCardData` with stable id, title, minutes, tags, metrics, image source key or neutral visual key, alt text, and default favorite boolean.
- `TrendingRecipeData` with stable id, title, calories, minutes, image source key or neutral visual key, and alt text.
- `FeaturedRecipeData` with title, badge, description, minutes, calories, protein, CTA label, image source key or neutral visual key, and alt text.
- `RecipesViewModel` with locale, product name, search placeholder, topbar action labels, featured recipe, trending list, seasonal promo, filters, selectedFilterId, recipe cards, floating action label, and section states.

The fixture encodes the exact content from R4-R10:

- Search placeholder `Search elite recipes...`.
- Featured `Mediterranean Quinoa Salad`, `Featured Selection`, `15 Mins`, `420 Kcal`, `24g Protein`, and `Start Cooking`.
- Trending entries: Post-Run Power Smoothie, Classic Lean Muscle Plate, Elite Overnight Oats with exact calories/minutes.
- Seasonal panel: `Seasonal: Spring Fuel`, exact supporting copy, and `Explore Seasonal`.
- Filters: All, Breakfast, Lunch, Dinner, Snacks, High Protein, Low Carb, Vegan.
- Cards and metrics exactly as listed in R9-R10.

The provider returns `structuredClone(model)` or an equivalent deep clone. The fixture path may not call `Date`, `Math.random`, `fetch`, storage, environment variables, model APIs, or remote URLs.

`format.ts` contains pure helpers for `formatCalories(value)`, `formatMinutes(value)`, `formatMacro(value, unit)`, `formatMetricValue(metric)`, and category matching if filtering is implemented. Helpers must reject or bound invalid values so UI never displays NaN or invented metrics.

## Component Design

### `RecipesScreen`

This is the only Recipes client state owner. It holds:

- controlled `searchValue`;
- `selectedFilterId`, initialized to `all`;
- local favorite state by recipe id;
- local polite `actionMessage`;
- independent `sectionStates`.

It renders `DashboardShell currentSection="Recipes"`, `RecipesTopbar`, `FeaturedRecipeHero`, `RecipesDiscoveryRail`, `RecipeFilters`, `RecipeGrid`, and `RecipeFloatingAction` in reference order. A local section wrapper handles loading, empty, error, and retry states without resetting ready siblings or unrelated local state.

### `RecipesTopbar`

Renders the search input, `Calendar` button, and notification icon button. Use Lucide `Search`, `CalendarDays`, and `Bell` or existing equivalents. Search is controlled local input and does not filter unless the Implementer explicitly chooses deterministic local filtering and tests it. Calendar and notifications provide bounded local feedback or remain inert.

### `FeaturedRecipeHero`

Renders the large hero image/neutral visual, dark overlay, badge, title, description, three inline metrics, and `Start Cooking` CTA. The hero image area must have stable dimensions and accessible alt or equivalent text. Hover effects must be subtle and disabled/reduced under reduced motion.

### `RecipesDiscoveryRail`

Renders the left discovery column at desktop and reflows above or between content on smaller screens. It contains `Trending This Week` and `Seasonal: Spring Fuel`. Trending entries are data-driven and keyboard-safe. Seasonal CTA is local/inert with bounded feedback.

### `RecipeFilters`

Renders fixed-order native buttons. `All` is selected initially. Buttons expose `aria-pressed` or equivalent current semantics and one selected invariant. The reference active state uses black for `All` and green for `High Protein`; implementation must choose a single selected-state rule that is accessible and testable. If visual fidelity uses a green emphasis for the `High Protein` chip while `All` is selected, it must not expose two selected states to assistive technology.

### `RecipeGrid` And `RecipeCard`

`RecipeGrid` renders the deterministic card list in reference order. `RecipeCard` renders:

- local image or neutral visual;
- favorite button with recipe-specific accessible name and pressed state;
- tag chips;
- title;
- time;
- four metric boxes for Cal, P, C, F;
- `Quick Add to Meal Planner` button.

Favorite toggles are local and reset on refresh. Quick-add is local/inert and must not mutate the Meal Planner route or fixture. Long titles wrap within stable card dimensions.

### `RecipeFloatingAction`

Renders one fixed bottom-right primary action corresponding to the reference restaurant-menu button. It uses a Lucide icon with an accessible name and local/inert behavior. It must stay within the content safe area and not hide card controls or sidebar items.

### `RecipesState`

Use the existing section-state language or a scoped equivalent. Loading reserves section geometry. Empty states are section-specific. Errors use `role="alert"` and retry where meaningful. Retry restores only the affected section to fixture-ready state.

## Layout And Visual System

- Preserve the reference pale green canvas, white cards, black borders, dark hero overlay, primary green action blocks, sharp/low-radius controls, uppercase compact labels, and strong dark text.
- Use existing project CSS variables where practical and add scoped `.recipes-*` declarations only.
- At desktop, use a sticky topbar, a wide hero, then a content area with fixed-width discovery rail and flexible two-column recipe grid.
- At tablet, the discovery rail and recipe grid reflow without collision.
- At mobile, content becomes readable single-column, filter chips use a contained horizontal scroller, recipe cards keep stable image and metric areas, and no document-level horizontal overflow occurs.
- Use stable `min-height`, `aspect-ratio`, grid tracks, and button dimensions for hero, thumbnails, card images, metric boxes, filter chips, quick-add buttons, and floating action.
- Do not use viewport-scaled font sizes, negative letter spacing in newly written CSS, remote fonts, Material Symbols, Tailwind CDN, or inline imperative scripts.
- Preserve existing global focus-visible and reduced-motion behavior. Add scoped focus states only where a Recipes component lacks a visible indicator.

## State And Interaction Flow

Default flow:

1. `/recipes` route reads a cloned fixture and renders all sections ready.
2. Search starts empty and updates only local input state.
3. `All` starts selected. Selecting a filter updates only local selected-filter state and optional deterministic visible subset.
4. Favorite buttons toggle local pressed state by recipe id and announce the change.
5. Calendar, notification, Start Cooking, seasonal CTA, quick-add, and floating action provide bounded local feedback or remain inert.
6. Refreshing resets to the deterministic fixture.

Invariants:

- Sidebar primary item count stays eight and footer settings count stays one.
- Sidebar order is Dashboard, Activity, Nutrition, Meal Planner, Recipes, Progress, Statistics, Goals.
- The Recipes sidebar item keeps the previous Course Release icon and position.
- Exactly one sidebar item is active for each routed screen.
- Exactly one filter is selected.
- Recipe card order is deterministic in the default ready state.
- Quick-add does not alter Meal Planner data or route.
- No user action writes storage, sends requests, mutates URLs, or changes unapproved screens.

## Loading, Empty, Failure, And Recovery

Section states are independent for `hero`, `discovery`, `filters`, and `recipes`. Ready is the default. Loading uses skeletons with stable geometry. Empty states explain the missing content without inventing values. Errors use alert semantics and retry. Retry restores the deterministic ready content for only that section and preserves search/filter/favorite state where valid.

## Accessibility Design

- Use one `main`, one `h1`, ordered section headings, native buttons/links/inputs, and semantic article/list structures where appropriate.
- The active sidebar link uses `aria-current="page"`.
- Filter and favorite controls expose selected/pressed state and accessible names.
- Icon-only controls have `aria-label`.
- Images have meaningful alt text; neutral/decorative visuals are hidden from assistive technology and paired with text content.
- Metric values are visible text, not color-only encodings.
- Local feedback uses `aria-live="polite"`.
- Errors use `role="alert"`.
- Focus order follows visual order and all controls have visible focus.
- Controls meet 44 CSS px touch target guidance.
- Verify reduced motion, contrast, keyboard path, and Axe at desktop and mobile widths.

## Security, Privacy, Health, And Observability

All data is local fixture content. Do not add API calls, model calls, storage, cookies, telemetry, identifiers, credentials, permissions, third-party requests, or personal profile access. Copy must not imply diagnosis, treatment, clinical certainty, personalized medical advice, saved preferences, or real AI generation. Verification must capture external requests, storage writes, URL mutations, console errors, broken images, and package/config diffs.

## Performance, Compatibility, Migration, And Rollback

- No new dependency, config, migration, environment, or backend change is required or authorized.
- Local visuals must be sized to avoid layout shift.
- The route must build under existing Next.js and TypeScript settings.
- Existing Dashboard, Activity, Nutrition, and Meal Planner checks must continue passing.
- Rollback removes only the `/recipes` route, `features/recipes`, `components/recipes`, `tests/recipes`, `e2e/recipes.spec.ts`, `.recipes-*` CSS, and the narrow sidebar item rename/link/current-section change. It must not revert unrelated dirty Meal Planner work or other user changes.

## Alternatives Considered

### Copy `receipes.html` Verbatim

Rejected because it uses Tailwind CDN, Google Fonts, Material Symbols, remote images, replacement sidebar markup, and imperative scripts, violating R2, R14, R18-R20.

### Replace The Course Release Icon With A Book Icon

Rejected because the user authorized changing what the sidebar says, not its icon. Preserving the existing `GraduationCap` icon is the safest interpretation of the sidebar constraint.

### Duplicate The FitCore Sidebar In Recipes

Rejected because AviloFit already has an approved sidebar and R2 forbids duplication, redesign, restyle, resize, or reorder.

### Implement Real Search, Favorites, Meal Planner Mutation, Or Cooking Mode

Rejected because those require product/data contracts, persistence, or backend behavior outside the governed work item. Local presentation feedback is sufficient for this reference screen.

### Hotlink The Reference Images

Rejected because runtime remote assets create privacy, reliability, performance, and verification issues. Local approved assets or neutral visuals are required.

## Requirement-To-Design Mapping

| Requirement | Design coverage |
| --- | --- |
| R1 | Route/shared-shell design, exact file scope |
| R2 | Sidebar surgical change, invariants, tests |
| R3 | Exact file scope, rollback, verification |
| R4 | `RecipesTopbar`, state flow, accessibility |
| R5 | `FeaturedRecipeHero`, model, layout |
| R6-R7 | `RecipesDiscoveryRail`, model |
| R8 | `RecipeFilters`, state flow |
| R9-R10 | `RecipeGrid`, `RecipeCard`, model |
| R11-R13 | Favorite, quick-add, floating action components |
| R14-R15 | Provider boundary and interaction flow |
| R16 | Layout and responsive design |
| R17 | Section state design |
| R18 | Accessibility design |
| R19-R20 | Security/privacy/assets/dependencies/performance |
| R21 | Verification, rollback, exact scope |

## Implementation Stop Conditions

Stop with `SPEC_CHANGE_REQUIRED` if satisfying this package requires any sidebar visual/style/icon/order/geometry change; any Meal Planner behavior change; any unlisted route/content/config/dependency/API/database/migration/secret change; runtime remote assets; real health data; real AI/network/storage behavior; or any user-visible behavior not described by R1-R21.
