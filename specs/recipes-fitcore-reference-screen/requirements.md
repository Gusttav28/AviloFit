# Recipes FitCore Reference Screen Requirements

## Work-Item Identity

- **Notion work item:** `3a606edf-7ca0-8181-a90d-deb0eda6b5f5`
- **Notion URL:** https://app.notion.com/p/3a606edf7ca08181a90ddeb0eda6b5f5
- **Title:** Build Recipes screen from FitCore reference while renaming Course Release sidebar item
- **Parent epic:** `39006edf-7ca0-81b1-b3e3-e9981eb7c4f9` - Design the first six core user screens
- **Outcome ancestor:** `39006edf-7ca0-81c4-985e-f5d4ef795328` - Complete the Avilo visual identity
- **Branch:** `develop`
- **Reference priority:** `C:\Users\gustt\AviloFitUI\receipes.png` is the visual source of truth. `receipes.html` supplies structure, copy, and card data. `receipes.md` supplies palette, typography, spacing, and shape intent. The misspelled `receipes` filenames are source references only; the product route and user-visible destination are `Recipes` and `/recipes`.

## Problem And Intended Outcome

AviloFit needs a Recipes destination that matches the supplied FitCore recipe discovery screen while preserving the existing AviloFit sidebar. The intended result is a deterministic `/recipes` screen with recipe search, featured recipe content, trending and seasonal discovery panels, category filters, recipe cards, favorite display controls, and quick-add presentation behavior. The only shared-sidebar content change authorized by the user is replacing the existing `Course Release` item label with `Recipes` and wiring that same existing item to the approved Recipes route/current state.

## Scope

### In Scope

- A new `/recipes` route rendered inside the existing `DashboardShell`.
- A Recipes current-section state for the existing AviloFit sidebar.
- Renaming the existing primary sidebar item currently labeled `Course Release` to `Recipes`.
- Converting that same existing sidebar item to a `/recipes` link and active-page target.
- The FitCore-style Recipes screen content: topbar search and actions, featured recipe hero, trending list, seasonal promo, filter chips, recipe cards, favorite buttons, quick-add controls, floating cooking action, responsive layout, independent local states, and accessibility.
- Deterministic local fixture data and local-only interaction states.
- Focused unit, component, privacy/safety, navigation, and Playwright verification.

### Out Of Scope

- Any sidebar redesign, duplicate sidebar, restyle, resize, reorder, layout/geometry change, profile change, settings separation change, brand change, or class-name change.
- Any sidebar icon change. The current `Course Release` item icon must be preserved when the label becomes `Recipes`; replacing it with the FitCore `menu_book` reference icon is not authorized.
- Any change to the existing `Meal Planner` item, route, tests, provider, layout, or completed dirty-worktree behavior except test assertion text updates strictly required by the global sidebar label rename.
- Any change to Dashboard, Activity, Nutrition, Meal Planner, Progress, Statistics, Goals, Settings, profile content, or route behavior other than the Recipes sidebar rename/link/current-state behavior.
- A real recipe database, saved favorites, recipe details route, cooking mode, grocery-list integration, meal-planner mutation, calendar integration, notifications, authentication, health-device integration, backend API, analytics, AI/model call, persistence, migrations, or storage.
- Dependency, config, lockfile, environment, secret, database, deployment, or package changes.
- Runtime remote assets, CDN scripts/fonts, Material Symbols, Google Fonts, Tailwind CDN, or reference HTML imperative scripts.

## Definitions

- **Existing Course Release item:** The current primary sidebar entry after `Meal Planner` and before `Progress`, implemented in `components/dashboard/contextual-utilities.tsx` with its current icon, DOM position, classes, and inactive button behavior.
- **Recipes sidebar change:** The allowed replacement of that exact item's visible and accessible label from `Course Release` to `Recipes`, plus adding `href="/recipes"` and active-state support when the current route is Recipes. No other sidebar property is included in this definition.
- **Reference screen:** The supplied FitCore Recipes composition visible in `receipes.png` and represented structurally by `receipes.html`.
- **Recipe card:** A deterministic local presentation card with image or neutral visual, tags, title, time, macro/calorie metrics, favorite control, and `Quick Add to Meal Planner` button.
- **Filter chip:** A local category button. Filter selection changes the active chip and may filter the visible fixture recipes only if this package defines the exact behavior; it must not fetch, persist, or navigate.
- **Local feedback:** An in-memory message, selected state, or accessible announcement that resets on refresh and writes no storage.
- **Health/nutrition demo content:** All calories, macros, protein, ingredients, times, tags, and recipe names are synthetic fixture content for UI verification, not personalized advice or medical nutrition guidance.

## Requirements

### R1. Recipes Route And Shell Composition

**Trigger:** A user opens `/recipes` directly or activates the Recipes sidebar item.

**Preconditions:** The app runs with the existing Next.js App Router, shared `DashboardShell`, and deterministic local fixture provider.

**Expected response:** The system renders exactly one Recipes screen at `/recipes` inside the existing AviloFit shell. The route reads local fixture data by default and performs no external request.

**Visible result:** The page contains one `h1` for Recipes, the reference-ordered topbar, hero, discovery/sidebar panels, filters, recipe grid, and floating action.

**Failure behavior:** If the fixture cannot load, the Recipes content area renders the bounded error state in R17 while the shared shell and sidebar remain available.

**Acceptance evidence:** Route/component test, browser direct-navigation test, route screenshot, and no-external-request assertion.

### R2. Existing Sidebar Preservation And Exact Rename

**Trigger:** The sidebar renders on `/recipes` or any existing routed screen.

**Preconditions:** `ContextualUtilities` contains the existing `Course Release` primary item after `Meal Planner` and before `Progress`.

**Expected response:** The implementation changes only that item as follows: label `Course Release` becomes `Recipes`; accessible name becomes `Recipes`; `href="/recipes"` is added; `Recipes` is added to the typed current-section contract; and Recipes receives the existing active item treatment with `aria-current="page"` only on `/recipes`.

**Visible result:** Sidebar order remains exactly Dashboard, Activity, Nutrition, Meal Planner, Recipes, Progress, Statistics, Goals, with Settings still in the footer. The preserved icon, spacing, classes, active class, responsive behavior, profile, and sidebar geometry remain unchanged.

**Failure behavior:** If the Recipes route requires any other sidebar visual or structural change, implementation stops with `SPEC_CHANGE_REQUIRED`.

**Acceptance evidence:** Navigation tests comparing item count, order, link/button roles, active states for Dashboard/Activity/Nutrition/Meal Planner/Recipes, CSS scope audit proving no `.avilo-sidebar-*` edits, and desktop/mobile screenshot geometry evidence.

### R3. Meal Planner Dirty-Worktree Protection

**Trigger:** The Implementer begins or completes Recipes work while Meal Planner files are already changed in the working tree.

**Preconditions:** Prior Meal Planner implementation files and tests may be uncommitted on `develop`.

**Expected response:** The implementation preserves existing Meal Planner behavior, route, provider, tests, and sidebar item. It may update only sidebar-label expectations from `Course Release` to `Recipes` where global sidebar assertions otherwise fail after the authorized rename.

**Visible result:** `/meal-planner` still renders and remains active when `currentSection="Meal Planner"`. Its sidebar item remains labeled `Meal Planner` and linked to `/meal-planner`.

**Failure behavior:** Any required change to Meal Planner UI/content beyond sidebar-label test expectations is a stop condition.

**Acceptance evidence:** Focused Meal Planner tests and E2E still pass; changed-file audit identifies any Meal Planner test changes as assertion-only for the global sidebar rename.

### R4. Topbar Search And Actions

**Trigger:** The Recipes screen reaches ready state.

**Preconditions:** The local fixture includes topbar copy and actions.

**Expected response:** The topbar renders a controlled search input with placeholder `Search elite recipes...`, a `Calendar` button, and a notifications icon button. It uses existing Lucide/native controls, not Material Symbols or CDN fonts.

**Visible result:** Search accepts and clears local text. Calendar and notifications are keyboard reachable and have discernible names.

**Failure behavior:** Unsupported actions stay on `/recipes`, preserve page state, and do not claim a real calendar or notification result.

**Acceptance evidence:** Component and browser tests for label, typing, focus order, route stability, no URL mutation, and no request/storage side effects.

### R5. Featured Recipe Hero

**Trigger:** The Recipes ready state renders.

**Preconditions:** The local fixture contains the featured recipe.

**Expected response:** The screen renders a large featured hero for `Mediterranean Quinoa Salad` with badge `Featured Selection`, description `Engineered for recovery. High fiber, high protein, and packed with micro-nutrients to fuel your post-training window.`, metrics `15 Mins`, `420 Kcal`, `24g Protein`, and a `Start Cooking` button.

**Visible result:** The hero uses a local approved image or accessible neutral local visual, dark overlay for text contrast, black border, and stable dimensions matching the reference hierarchy.

**Failure behavior:** Missing local image provenance must not create a broken image or hotlink. Use a neutral local visual or stop for asset approval.

**Acceptance evidence:** Exact text/metric assertions, image-source audit, contrast check, desktop screenshot comparison, and button no-side-effect test.

### R6. Trending This Week Panel

**Trigger:** The discovery rail renders.

**Preconditions:** The local fixture includes three trending recipes.

**Expected response:** The screen renders `Trending This Week` with these exact entries in order: `Post-Run Power Smoothie` (`280 kcal`, `5 mins`), `Classic Lean Muscle Plate` (`540 kcal`, `20 mins`), and `Elite Overnight Oats` (`320 kcal`, `5 mins`).

**Visible result:** Each entry has stable thumbnail space, readable title, calorie/time text, and keyboard/focus semantics if interactive.

**Failure behavior:** Missing thumbnails use accessible local neutral visuals and never remote URLs.

**Acceptance evidence:** Exact text/order test, local image audit, keyboard/focus test, and responsive screenshot.

### R7. Seasonal Promo Panel

**Trigger:** The discovery rail renders below Trending.

**Preconditions:** Seasonal fixture copy is available.

**Expected response:** The screen renders a black seasonal panel with title `Seasonal: Spring Fuel`, copy `Optimized for outdoor training season. Fresh, crisp, and high-energy ingredients.`, and `Explore Seasonal` button.

**Visible result:** The panel keeps the reference dark/green contrast, stable dimensions, and complete text at supported widths.

**Failure behavior:** Activation is local/inert with bounded feedback and no route/storage/network side effect.

**Acceptance evidence:** Component assertions, contrast check, activation no-op test, and responsive screenshot.

### R8. Filter Chips

**Trigger:** The filter row renders or a user activates a filter chip.

**Preconditions:** The fixture contains the categories All, Breakfast, Lunch, Dinner, Snacks, High Protein, Low Carb, and Vegan.

**Expected response:** Chips render in that exact order. `All` is selected initially. Activating a chip changes only local selected-filter state and visible active styling. The recipe cards remain in deterministic order; filtering may either keep all cards visible with selected-state only or show the subset matching the selected chip, but the chosen behavior must be explicit in implementation tests and must not change data or URL state.

**Visible result:** Exactly one chip exposes selected/current semantics. The row remains usable in horizontal overflow at narrow widths without document overflow.

**Failure behavior:** Invalid filter values are rejected without changing selection.

**Acceptance evidence:** Component test for order/default/selection, keyboard selection, invalid value rejection, and browser overflow test.

### R9. Recipe Grid Composition

**Trigger:** Recipe cards reach ready state.

**Preconditions:** The local fixture includes the reference card dataset.

**Expected response:** The ready grid renders the four reference recipe cards in deterministic order: `Seared Salmon & Wild Rice`, `Elite Vegan Power Bowl`, `Lean Ginger Beef Stir-fry`, and `Avocado & Egg Sourdough`.

**Visible result:** Desktop uses the reference two-column card grid beside the discovery rail. Tablet and mobile reflow without overlap, clipped text, or hidden controls.

**Failure behavior:** If a recipe card section fails, it renders the section error state in R17 and does not fabricate cards.

**Acceptance evidence:** Exact count/order assertions and Playwright viewport matrix at 1440x900, 1024x900, 768x900, and 390x844.

### R10. Recipe Card Data

**Trigger:** Each recipe card renders.

**Preconditions:** Card fixture values are present.

**Expected response:** Cards render exact metrics:

| Recipe | Time | Tags | Cal | P | C | F |
| --- | --- | --- | --- | --- | --- | --- |
| Seared Salmon & Wild Rice | 25m | High Protein, Easy Prep | 580 | 42g | 38g | 22g |
| Elite Vegan Power Bowl | 15m | Vegan, Low Carb | 410 | 18g | 52g | 14g |
| Lean Ginger Beef Stir-fry | 20m | Dinner, High Protein | 490 | 38g | 28g | 18g |
| Avocado & Egg Sourdough | 10m | Breakfast, Healthy Fats | 380 | 16g | 32g | 24g |

**Visible result:** Metrics use the compact `Cal`, `P`, `C`, `F` blocks from the reference with text equivalents and no color-only meaning.

**Failure behavior:** Missing or invalid values produce a bounded card/section error rather than zero, NaN, or invented nutrition data.

**Acceptance evidence:** Fixture/model tests, component assertions for every value, and health-safety copy tests.

### R11. Card Favorites

**Trigger:** A user views or activates a favorite button on a recipe card.

**Preconditions:** Recipe card fixture data is loaded.

**Expected response:** Each card renders a favorite button matching the reference heart control. Activation may toggle local in-memory visual/pressed state for that mounted page only, with a polite announcement.

**Visible result:** Favorite controls have accessible names that include the recipe title and expose pressed state. Refreshing resets to deterministic fixture defaults.

**Failure behavior:** No favorite action persists, writes storage, sends a request, mutates fixture data, or claims a saved account preference.

**Acceptance evidence:** Component/browser toggle test, refresh/reset test, storage/request capture, and accessibility assertions.

### R12. Quick Add To Meal Planner Controls

**Trigger:** A user activates `Quick Add to Meal Planner` on any recipe card.

**Preconditions:** Recipe cards are visible.

**Expected response:** Each card renders the exact label `Quick Add to Meal Planner`. Activation provides bounded local feedback or remains inert.

**Visible result:** Button dimensions remain stable and keyboard/touch targets are at least 44 CSS px.

**Failure behavior:** The button must not mutate `/meal-planner`, create meals, navigate, write storage, send a request, or claim that a real meal plan was updated.

**Acceptance evidence:** Activation no-side-effect test, `/meal-planner` preservation test, and browser geometry/touch-target check.

### R13. Start Cooking And Floating Cooking Action

**Trigger:** A user activates `Start Cooking` or the fixed bottom-right cooking action.

**Preconditions:** Hero and floating action are visible.

**Expected response:** Both controls are local/inert unless an existing approved route exists. The floating action has an accessible name such as `Open recipe tools` or `Recipe cooking action`.

**Visible result:** The floating action remains within the Recipes content safe area and does not cover sidebar navigation, card controls, or focused elements at supported widths.

**Failure behavior:** No modal, recipe-detail route, cooking timer, persistence, or network behavior is invented.

**Acceptance evidence:** Keyboard/touch reachability, z-order/occlusion checks, route stability, and no-side-effect assertions.

### R14. Deterministic Fixture Boundary

**Trigger:** The screen initializes, refreshes, retries, or tests access the provider.

**Preconditions:** The fixture provider is used.

**Expected response:** All Recipes data is local, deterministic, serializable, and returned as an isolated clone. The fixture does not depend on `Date.now`, random values, storage, fetch, network, account state, environment variables, or remote image URLs.

**Visible result:** Refresh restores search empty, `All` filter selected, fixture card order, and default favorite states.

**Failure behavior:** Any need for external data, credentials, personal data, or runtime remote assets stops implementation with `SPEC_CHANGE_REQUIRED`.

**Acceptance evidence:** Model/provider tests for clone isolation and fixed data, request/storage capture, URL audit, and dependency audit.

### R15. Interaction And Persistence Boundaries

**Trigger:** Any search, filter, favorite, topbar, hero, seasonal, quick-add, recipe-card, or floating-action control is used.

**Preconditions:** The screen is mounted.

**Expected response:** Only local component state described by this package may change. Approved shared navigation may change routes only through sidebar links.

**Visible result:** Unsupported actions preserve layout and expose no false success.

**Failure behavior:** No URL query/hash mutation, local/session storage write, cookie write, analytics call, API call, model call, or cross-screen mutation occurs.

**Acceptance evidence:** Browser instrumentation and component tests for route, storage, request, and state reset behavior.

### R16. Responsive Behavior

**Trigger:** The viewport changes across desktop, tablet, and mobile sizes.

**Preconditions:** The existing AviloFit sidebar responsive behavior is active.

**Expected response:** Desktop matches the reference hierarchy: topbar, hero, left discovery rail, filter row, and two-column recipe grid. Tablet and mobile reflow into readable single-column or contained-scroller layouts while preserving content order and control reachability.

**Visible result:** No horizontal document overflow, overlapped controls, clipped important text, hidden focus, or content trapped under the sidebar.

**Failure behavior:** If a horizontal scroller is required for filters, it is contained and labeled; the document itself does not overflow.

**Acceptance evidence:** Playwright viewport matrix, overflow assertions, screenshots, touch-target checks, and sidebar geometry snapshots.

### R17. Independent Loading, Empty, Error, And Retry States

**Trigger:** A section is loading, empty, errors, or a user activates retry.

**Preconditions:** The model supports section states for hero, discovery, filters, and recipes.

**Expected response:** The affected section alone renders a stable skeleton, empty state, or alert with retry where meaningful. Retry restores the deterministic ready fixture for that section while preserving search, selected filter, favorite local state where still valid, and ready siblings.

**Visible result:** Ready is the default. Loading reserves geometry. Empty states do not fabricate nutrition data. Errors explain the section failure.

**Failure behavior:** A retry failure remains scoped to the affected section and does not blank the page or sidebar.

**Acceptance evidence:** Parameterized component tests and browser recovery/isolation checks.

### R18. Accessibility

**Trigger:** A keyboard or assistive-technology user navigates the Recipes route.

**Preconditions:** The route is in any supported state.

**Expected response:** The page uses semantic landmarks, one `h1`, ordered headings, native buttons/links/inputs, visible focus, accessible names for icon-only buttons, `aria-current="page"` for active sidebar route, pressed/current semantics for selected filter/favorite controls, meaningful image alternatives, progress/metric text equivalents, and polite announcements for local feedback.

**Visible result:** Keyboard users can reach sidebar, search, calendar, notification, hero CTA, trending/seasonal controls, filter chips, favorites, quick-add buttons, and floating action in logical order.

**Failure behavior:** Axe, contrast, focus, or keyboard failures block handoff.

**Acceptance evidence:** Component semantic assertions, keyboard Playwright path, Axe scan, contrast inspection, and reduced-motion check.

### R19. Health-Data Privacy And Nutrition Safety

**Trigger:** Nutrition values, recipe copy, tags, or feedback messages render.

**Preconditions:** The local fixture is used.

**Expected response:** Copy remains informational demo content and must not claim diagnosis, treatment, clinical certainty, personalized medical advice, account-specific inference, real AI generation, or professional nutrition care.

**Visible result:** No personal health data is collected, persisted, inferred, logged, transmitted, or exposed in URLs.

**Failure behavior:** Any requirement for personal data, permission grants, backend profile access, model calls, analytics, or third-party tracking stops implementation.

**Acceptance evidence:** Static copy tests, no-storage/no-request capture, no secret/config diff audit, and dependency audit.

### R20. Asset, Dependency, Performance, And Compatibility Policy

**Trigger:** The Recipes screen is implemented, built, or verified.

**Preconditions:** Existing repository dependencies and local assets are available.

**Expected response:** The implementation reuses existing React, TypeScript, Next.js, Lucide, CSS, provider, and testing patterns. Images are local approved assets or accessible neutral visuals. Stable dimensions are used for hero, cards, thumbnails, metric boxes, chips, and floating action.

**Visible result:** The route renders without remote image stalls, layout jump, external font/icon dependencies, console errors, or regressions to existing routes.

**Failure behavior:** Missing local visual assets do not justify hotlinking or adding packages; stop for approval or use a neutral local visual if acceptable.

**Acceptance evidence:** Lint, typecheck, build, tests, Playwright, external-request audit, package/config diff audit, and screenshot evidence.

### R21. Verification And Traceability

**Trigger:** Implementation is proposed for review.

**Preconditions:** All implementation tasks are complete.

**Expected response:** Evidence covers every requirement, exact changed files, command results, screenshots, external side-effect checks, sidebar preservation, dirty Meal Planner protection, and rollback boundary. The Notion work item is moved to `Review`, not `Completed`, only after implementation passes.

**Visible result:** The Reviewer can verify the screen without guessing intent or hidden scope.

**Failure behavior:** Missing evidence, unauthorized file changes, unresolved ambiguity, or failing checks block Review handoff.

**Acceptance evidence:** Completed task traceability, command output summary, screenshots/evidence paths, changed-file audit, and Notion update.

## Traceability

| Requested behavior or acceptance intent | Requirements |
| --- | --- |
| Build the Recipes screen from supplied FitCore references | R1, R4-R13, R16, R20 |
| Rename Course Release to Recipes | R2 |
| Do not change sidebar besides the requested rename | R2, R3, R16, R20-R21 |
| Preserve AviloFit sidebar order, styling, geometry, and Meal Planner work | R2-R3 |
| Use deterministic local data and no remote runtime assets | R1, R5-R6, R9-R10, R14-R15, R19-R20 |
| Topbar search, calendar, and notifications | R4, R15, R18 |
| Featured Mediterranean Quinoa Salad hero | R5 |
| Trending and seasonal panels | R6-R7 |
| Filter chips | R8, R15, R18 |
| Recipe grid cards, metrics, favorites, quick add | R9-R12, R15, R18-R19 |
| Floating cooking action | R13, R16, R18 |
| Loading, empty, error, retry | R17 |
| Accessibility and responsive behavior | R16-R18 |
| Verification and handoff | R20-R21 |

## Assumptions And Derived Requirements

- **Derived from R2:** Preserving the current `GraduationCap` icon is required because the user authorized a label/sidebar destination change only and explicitly warned against icon changes unless justified. The FitCore reference book icon is therefore visual provenance, not implementation scope.
- **Derived from R2-R3:** Existing tests that assert the old `Course Release` label must be updated only where the global sidebar contract changes to `Recipes`; those updates are not permission to change screen behavior.
- **Derived from R14-R20:** Remote image URLs in `receipes.html` are source provenance only. The Implementer must use approved local assets or neutral visuals.
- **Derived from R8:** Filter chips may be selected locally because the reference script changes active chip state. Filtering the card set is optional only if deterministic and explicitly tested; otherwise selection-only is acceptable.
- **Derived from R11-R15:** Favorite toggling may be local because the reference script toggles hearts, but saved favorites are out of scope.
- **Open questions:** None blocking. Image fidelity may vary if approved local recipe visuals are unavailable; the implementation must record that tradeoff and avoid remote assets.
