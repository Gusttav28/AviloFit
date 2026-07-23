# Meal Planner FitCore Reference Screen Requirements

## Work-item identity

- **Notion work item:** `3a606edf-7ca0-811b-a336-ea2db317e74a`
- **Notion URL:** https://app.notion.com/p/3a606edf7ca0811ba336ea2db317e74a
- **Title:** Build Meal Planner screen from FitCore reference while preserving AviloFit sidebar
- **Parent epic:** `39006edf-7ca0-81b1-b3e3-e9981eb7c4f9` - Design the first six core user screens
- **Outcome ancestor:** `39006edf-7ca0-81c4-985e-f5d4ef795328` - Complete the Avilo visual identity
- **Branch:** `develop`
- **Reference priority:** `C:\Users\gustt\AviloFitUI\meal-planner.png` is the visual source of truth. `meal-planner.html` supplies structure and copy detail. `meal-planner.md` supplies palette, type, spacing, and shape tokens. Existing AviloFit shell, dependencies, asset policy, and accessibility conventions override FitCore CDN, font, icon, script, and sidebar choices.

## Problem and intended outcome

AviloFit has a shared shell and Nutrition destination but no Meal Planner destination. The intended outcome is a practical `/meal-planner` screen that presents the supplied FitCore weekly planning composition, preserves the existing AviloFit sidebar and shell, and provides deterministic local interactions that can be verified without a backend, account data, or network access.

## Scope

### In scope

- The `/meal-planner` route and route-aware active navigation for the existing Meal Planner sidebar item.
- The FitCore-style page topbar, weekly nutrition target summary, grocery-list CTA, seven-day selector, breakfast/lunch/dinner meal bands, meal cards, add-meal slots, static dinner favorite state, floating actions, responsive reflow, and accessible interaction feedback.
- Deterministic local fixture data, focused loading/empty/error/retry state handling, scoped styling, and focused unit/component/browser verification.

### Out of scope

- Redesigning, duplicating, resizing, renaming, reordering, or otherwise restyling the existing AviloFit sidebar, profile, settings separation, or shell geometry.
- Implementing a recipe database, grocery-list destination, meal editor, drag-and-drop persistence, authentication, user profiles, health-device integrations, nutrition calculations from personal data, real AI, analytics, or server persistence.
- Adding another destination route, changing Dashboard, Activity, or Nutrition content, changing package/configuration files, or introducing a new dependency.

## Definitions and safety boundaries

- **Reference week:** The seven visible columns `Mon 12`, `Tue 13`, `Wed 14`, `Thu 15`, `Fri 16`, `Sat 17`, and `Sun 18`. `Wed 14` is selected on initial render.
- **Meal band:** One of the ordered `Breakfast`, `Lunch`, or `Dinner` rows. Each band contains exactly seven day slots in reference order.
- **Meal card:** A deterministic local presentation of a named meal, optional local visual, and calorie label. A card is not an editable or draggable data record in this task.
- **Add-meal slot:** A dashed, keyboard-activatable presentation control in a meal band. It has no persistence or destination behavior.
- **Local interaction:** A state change held in the mounted React screen, an accessible announcement, or existing shared navigation. It must not write storage, change the URL except approved route navigation, or transmit data.
- **Health-data demo:** All target, calorie, macro, meal, and favorite values are fixture content for visual verification. They are not personal health records, medical advice, or professional nutrition guidance.

## Requirements

### R1. Meal Planner route and composition

**Trigger:** A user opens `/meal-planner` or activates the existing Meal Planner navigation item.

**Preconditions:** The application is running with the existing Next.js App Router and shared shell.

**Actor/system response:** The system renders one Meal Planner screen at `/meal-planner`, inside the existing `DashboardShell`, with a single page heading and the reference-ordered content sections. The route uses the deterministic local fixture path by default and performs no external data request.

**State and visible result:** The page is a usable Meal Planner destination, and the Meal Planner sidebar item is the only current-page item.

**Failure behavior:** If the route cannot load its fixture, the page renders the bounded page/section error state described by R15 and does not fabricate meal values or blank the shared shell.

**Acceptance evidence:** Route/component test for `/meal-planner`, initial composition/order assertion, and browser navigation assertion.

### R2. Existing AviloFit sidebar and shell are preserved

**Trigger:** The Meal Planner route renders or the user navigates between Dashboard, Activity, Nutrition, and Meal Planner.

**Preconditions:** Existing `DashboardShell`, `ContextualUtilities`, and sidebar CSS are present.

**Actor/system response:** Meal Planner reuses the existing shell. The only authorized shared navigation change is adding `"Meal Planner"` to the typed current-section contract and making the existing item link to `/meal-planner`; its label, icon, order, class names, responsive behavior, profile, settings separation, and geometry remain unchanged.

**State and visible result:** On `/meal-planner`, Meal Planner has the existing active semantics and `aria-current="page"`; on `/dashboard`, `/activity`, and `/nutrition`, their existing active states remain unchanged. Other unbuilt destinations remain their current inert controls.

**Failure behavior:** If active-state or sidebar regression checks fail, implementation stops and does not compensate by duplicating or overriding the sidebar in Meal Planner.

**Acceptance evidence:** Existing dashboard/activity/navigation tests plus new route-active-state and desktop/mobile sidebar geometry checks; changed-file audit confirms no sidebar visual CSS change.

### R3. Topbar and page hierarchy

**Trigger:** The Meal Planner screen reaches ready state.

**Preconditions:** The shared shell has established content offset and focus styles.

**Actor/system response:** The system renders, in order, the `Meal Planner` heading, a controlled `Search recipes...` field, `Quick Add`, calendar, and notifications controls. It uses existing Lucide icons and native controls rather than Material Symbols or CDN resources.

**State and visible result:** The heading is the page `h1`; the search field accepts and clears local text; icon-only controls have discernible names; the topbar remains aligned to the existing shell content area.

**Failure behavior:** Unsupported actions remain on the route and expose no fabricated success. Search does not navigate, persist, or request data.

**Acceptance evidence:** Component test for heading/order/labels and browser keyboard/type/no-navigation checks.

### R4. Weekly nutrition target summary

**Trigger:** The target summary reaches ready state.

**Preconditions:** The fixture contains the reference weekly values.

**Actor/system response:** The system renders one summary section labeled `Weekly Nutrition Target` with these exact values and target pairs: `14,200` calories of `17,500`, `920g` protein of `1,050g`, and `340g` fats of `420g`. Each metric has a bounded progress bar and a text equivalent.

**State and visible result:** The summary shows progress equivalent to approximately 81%, 87%, and 81%, and the overall ring shows `82%` with visible `ON TRACK` text. Progress is clamped to its target bounds.

**Failure behavior:** Missing or invalid metric data produces a labeled target-summary error state rather than misleading zeroes or NaN values.

**Acceptance evidence:** Model/format test for exact values and clamping, component assertions for visible/ARIA text, and reference comparison at desktop width.

### R5. Grocery-list CTA

**Trigger:** The user views or activates `Generate Grocery List`.

**Preconditions:** The ready summary and weekly plan are present.

**Actor/system response:** The system renders a prominent green CTA labeled `Generate Grocery List` with supporting copy `Based on your weekly meals` and a grocery icon. Activation may provide local polite feedback acknowledging that the demo action is not connected, but it must not create a destination or persistence contract.

**State and visible result:** The CTA is visually distinct, keyboard reachable, and its text remains complete at supported widths.

**Failure behavior:** A failed or unsupported activation stays on `/meal-planner`, preserves all plan state, and communicates no false generation or saved-list result.

**Acceptance evidence:** Component/browser activation test for label, focus, route stability, state preservation, and no request/storage activity.

### R6. Seven-day selector

**Trigger:** The user focuses or activates a day control.

**Preconditions:** The reference week is ready.

**Actor/system response:** The system renders seven native day controls in order: `Mon 12`, `Tue 13`, `Wed 14`, `Thu 15`, `Fri 16`, `Sat 17`, `Sun 18`. `Wed 14` is selected initially. Selecting another day changes only the local selected-day state and updates a polite announcement; the week grid remains visible and ordered.

**State and visible result:** The selected day has the reference active underline/emphasis and `aria-pressed="true"` or equivalent current semantics; all other days are not selected.

**Failure behavior:** Invalid day values are rejected without changing the current selection. No date is inferred from the system clock.

**Acceptance evidence:** Component test for exact order/default, pointer and keyboard selection, one-selected invariant, announcement, invalid-value rejection, and no URL/storage change.

### R7. Meal planner grid structure and order

**Trigger:** The meal plan reaches ready state.

**Preconditions:** Seven day controls and three meal-band datasets are available.

**Actor/system response:** The system renders a seven-column desktop grid with one full-width labeled band for each meal type in the order Breakfast, Lunch, Dinner. Each band has exactly seven day slots aligned to the day selector order, with separators and the reference compact uppercase labels.

**State and visible result:** The grid preserves card order and association across desktop, tablet, and mobile layouts. A card has a day and meal-type label available to assistive technology even when responsive reflow changes its visual position.

**Failure behavior:** A missing or malformed band renders only that band in the independent state component from R15; other bands remain available.

**Acceptance evidence:** Component cardinality/order test, semantic heading/association test, and browser geometry/reflow checks.

### R8. Breakfast band content

**Trigger:** The Breakfast band reaches ready state.

**Preconditions:** The breakfast fixture has seven ordered slots.

**Actor/system response:** The system renders these exact slots: `Avocado Toast & Poached Egg` (`420 kcal`), `Blueberry Protein Oats` (`380 kcal`), an `Add Meal` slot, `Super Green Smoothie` (`310 kcal`), `Spinach Frittata` (`350 kcal`), `Greek Yogurt Parfait` (`290 kcal`), and `Keto Pancakes` (`440 kcal`).

**State and visible result:** The first, second, and fourth cards may use stable local/repository-approved visuals with meaningful alternatives; the add slot is visibly dashed and labeled.

**Failure behavior:** Optional visual data is omitted or replaced by a local neutral visual, never a broken image or remote runtime request. Missing meal data does not invent a name or calorie value.

**Acceptance evidence:** Exact text/card-count test, image policy test, and desktop/mobile visual evidence.

### R9. Lunch band content

**Trigger:** The Lunch band reaches ready state.

**Preconditions:** The lunch fixture has seven ordered slots.

**Actor/system response:** The system renders these exact slots: `Grilled Chicken Caesar` (`520 kcal`), `Quinoa Power Bowl` (`480 kcal`), `Salmon Poke Bowl` (`610 kcal`), `Turkey Club Wrap` (`450 kcal`), `Lentil Soup & Sourdough` (`390 kcal`), an `Add Meal` slot, and `Steak Salad` (`580 kcal`).

**State and visible result:** The lunch band follows the same seven-column alignment, card sizing, local visual policy, and accessible naming as Breakfast.

**Failure behavior:** The band shows its own empty/error state when unavailable and does not replace adjacent Breakfast or Dinner content.

**Acceptance evidence:** Exact text/card-count/order test and responsive browser evidence.

### R10. Dinner band and static favorite state

**Trigger:** The Dinner band reaches ready state.

**Preconditions:** The dinner fixture has seven ordered slots.

**Actor/system response:** The system renders these exact slots: `Baked Cod with Asparagus` (`380 kcal`), `Stir-Fry Beef & Broccoli` (`550 kcal`), `Pan-Seared Scallops` (`420 kcal`), `Chickpea Curry` (`510 kcal`), `Zucchini Noodles Carbonara` (`320 kcal`), `Grilled Tofu & Veggies` (`440 kcal`), and `Turkey Chili` (`560 kcal`). The Pan-Seared Scallops card includes the visible `FAVORITE` badge and equivalent accessible favorite text.

**State and visible result:** Favorite is a deterministic display state, not a toggle or persistence feature. The dinner band matches the reference card hierarchy and visual emphasis.

**Failure behavior:** Favorite metadata missing from another card does not cause a second favorite or a fabricated user preference.

**Acceptance evidence:** Exact dinner order/card-count/favorite assertion, non-toggle behavior check, and reference comparison.

### R11. Add-meal controls

**Trigger:** The user views or activates an add slot.

**Preconditions:** Breakfast and Lunch have the reference add slots; Dinner has none in the supplied week.

**Actor/system response:** The system renders a native button labeled `Add Meal` in Breakfast day 3 and Lunch day 6. Activation may announce that adding meals is not connected in this demo, but must not open an unimplemented editor, mutate the fixture, navigate, persist, or transmit data.

**State and visible result:** Add slots retain stable dimensions, dashed borders, visible plus icon, text label, keyboard focus, and a touch target of at least 44 CSS px.

**Failure behavior:** An unsupported activation leaves all card order, selected day, and target values unchanged.

**Acceptance evidence:** Component/browser activation, focus, no-op, stable-geometry, and no-side-effect checks.

### R12. Meal-card interaction and presentation contract

**Trigger:** A user hovers, focuses, or scans a meal card.

**Preconditions:** The card is in a ready band.

**Actor/system response:** The system applies a restrained local hover/focus treatment without changing layout order or invoking drag behavior. Each card exposes meal name, meal type, day, and calories as readable text.

**State and visible result:** Cards have stable dimensions/aspect ratios; long names wrap within the card; image-bearing cards have meaningful alternatives and do not rely on color alone.

**Failure behavior:** Missing optional image or metadata does not make the card inaccessible or shift neighboring cards unpredictably.

**Acceptance evidence:** Component semantics test, focus/hover browser check, long-name geometry check, and reduced-motion check.

### R13. Floating actions

**Trigger:** The user views or activates the fixed bottom-right actions.

**Preconditions:** The planner has enough viewport space for the actions and sidebar safe area.

**Actor/system response:** The system renders two distinct circular actions matching the reference hierarchy: a secondary magic-wand action and a primary plus action. Each has an accessible name and local/inert behavior unless an existing approved interaction is reused.

**State and visible result:** Actions remain reachable above content and do not obscure cards, add slots, browser focus, or the preserved sidebar at desktop, tablet, and mobile widths.

**Failure behavior:** When viewport space is constrained, actions reposition within the content safe area rather than causing document overflow or becoming unreachable.

**Acceptance evidence:** Browser geometry, z-order/occlusion, keyboard/touch reachability, accessible-name, and no-side-effect checks.

### R14. Interaction and persistence boundaries

**Trigger:** Any search, Quick Add, calendar, notification, grocery, day, add-meal, meal-card, or floating-action control is used.

**Preconditions:** The screen is mounted.

**Actor/system response:** Only selected-day state and explicitly defined local feedback may change. Approved shared navigation may change routes. All other controls remain presentation-only and do not invent backend behavior.

**State and visible result:** Refreshing or revisiting the route returns to the deterministic initial fixture, including selected `Wed 14`, target values, card order, and static favorite.

**Failure behavior:** Any attempted unsupported action fails closed: no network call, URL query mutation, storage write, credential use, analytics event, or false success message.

**Acceptance evidence:** Browser request/storage/URL capture and component tests for state reset and sibling-state preservation.

### R15. Independent loading, empty, error, and recovery states

**Trigger:** A planner section is loading, empty, or fails, or the user activates its retry control.

**Preconditions:** The screen state wrapper can represent `targets`, `grocery`, and `planner` independently, using the repository's existing state pattern.

**Actor/system response:** The affected section alone renders a stable skeleton, section-specific empty message, or alert with a retry control. Retry restores the deterministic ready fixture for that section without resetting search, selected day, or ready siblings.

**State and visible result:** Ready state is the default. Loading reserves geometry; empty does not fabricate values; error explains what failed and how to retry; recovery is announced where needed.

**Failure behavior:** A retry failure remains an error for the affected section and does not blank the page or alter the sidebar.

**Acceptance evidence:** Parameterized component tests for loading/empty/error/retry and browser isolation/recovery checks.

### R16. Responsive behavior

**Trigger:** The viewport changes across supported desktop, tablet, and mobile widths.

**Preconditions:** The route is rendered with the existing sidebar responsive behavior.

**Actor/system response:** At desktop, the target summary and grocery CTA form the reference two-part top row and the planner uses seven columns. At tablet, the summary/CTA and meal slots reflow without collision. At mobile, content becomes a readable single-column or contained horizontal planning layout, the day selector remains usable, and meal cards/add slots preserve day association.

**State and visible result:** Supported checks at 1440x900, 1024x900, 768x900, and 390x844 show no horizontal document overflow, clipped text, overlapping controls, unreachable actions, or content hidden beneath the sidebar.

**Failure behavior:** If the full weekly grid requires scrolling, scrolling is contained to the planner region and is labeled; the document itself does not overflow horizontally.

**Acceptance evidence:** Playwright viewport matrix, screenshot comparison to the supplied reference at desktop, scroll/overflow assertions, and touch-target checks.

### R17. Accessibility

**Trigger:** A keyboard or assistive-technology user navigates the page.

**Preconditions:** The page is in any supported state.

**Actor/system response:** The implementation provides semantic landmarks, one `h1`, ordered section headings, native buttons/links/inputs, visible focus indicators, accessible names for icon-only controls, `aria-current`/pressed semantics for navigation/day selection, text equivalents for ring/bar progress, meaningful image alternatives, and polite announcements for local feedback.

**State and visible result:** Keyboard users can reach and operate navigation, search, day controls, add slots, CTA, and floating actions in a logical order. Color, underline, or badge styling is never the only indication of state.

**Failure behavior:** An accessibility scan or keyboard path failure blocks handoff until corrected within the listed files; no visual shortcut may remove essential semantics.

**Acceptance evidence:** Focused component assertions, keyboard browser path, Axe scan, contrast inspection, and reduced-motion browser check.

### R18. Health-data privacy and AI safety

**Trigger:** The screen renders nutrition targets, meals, favorite status, or any feedback copy.

**Preconditions:** The fixture/provider is used.

**Actor/system response:** All values remain deterministic local demo content. Copy must not claim diagnosis, treatment, clinical certainty, personalized medical advice, real AI inference, or a professional nutrition relationship.

**State and visible result:** No health data is collected, persisted, transmitted, inferred, or exposed through URLs, logs, analytics, third-party assets, or credentials.

**Failure behavior:** Any implementation path that requires personal data, permission, API access, real model calls, or third-party tracking is outside this spec and must stop with `SPEC_CHANGE_REQUIRED`.

**Acceptance evidence:** Static copy safety assertions, request/storage/URL capture, dependency audit, and focused privacy test.

### R19. Asset, dependency, performance, and compatibility policy

**Trigger:** The screen is implemented or built.

**Preconditions:** Existing repository dependencies and local assets are available.

**Actor/system response:** The implementation reuses existing React, TypeScript, Lucide, CSS, provider, and shared UI patterns. Meal visuals use existing or project-approved local assets only; remote reference URLs, CDN scripts/fonts, Material Symbols, inline imperative scripts, and new packages are prohibited.

**State and visible result:** The route is deterministic, renders without image/network stalls, has stable dimensions for progress/cards/actions, and preserves existing Dashboard, Activity, and Nutrition behavior.

**Failure behavior:** Missing local visual assets use an accessible local neutral visual or stop for a spec decision; they are never hotlinked.

**Acceptance evidence:** Lint, typecheck, build, focused performance/geometry checks, external-request test, and changed-file/dependency audit.

### R20. Verification and traceability

**Trigger:** Implementation is proposed for review.

**Preconditions:** All tasks in `tasks.md` are complete.

**Actor/system response:** Focused unit/component/browser evidence covers route and sidebar preservation, all target values, CTA, day selection, exact meal content/order, add slots, favorite state, floating actions, responsive behavior, accessibility, state recovery, privacy, and no external side effects. Full repository checks required by the task are run and recorded.

**State and visible result:** Every requirement R1-R20 maps to at least one implementation task and evidence item. The implementation handoff names changed files and exact command results without marking the work completed.

**Failure behavior:** Missing evidence, unauthorized file changes, regression failures, or unresolved behavioral ambiguity blocks handoff and keeps the Notion item in `Defining` or the truthful dependency state.

**Acceptance evidence:** Completed traceability tables in this package and `tasks.md`, test/browser output, screenshots, and scope audit.

## Traceability

| Requested behavior or acceptance intent | Requirements |
| --- | --- |
| Build the Meal Planner destination from the FitCore reference | R1, R3, R7-R13, R16, R19 |
| Preserve the existing AviloFit sidebar and shell | R1-R2, R16, R19-R20 |
| Weekly nutrition target summary | R4 |
| Grocery-list CTA | R5, R14, R17 |
| Day selector | R6, R14, R16-R17 |
| Breakfast, lunch, and dinner rows/cards | R7-R10, R12 |
| Add-meal controls | R11, R14, R16-R17 |
| Dinner favorite state | R10, R12, R14 |
| Floating actions | R13-R14, R16-R17 |
| Responsive behavior | R16 |
| Accessibility | R3, R6, R11-R13, R16-R17 |
| Deterministic local behavior and safety | R14, R18-R19 |
| Focused test traceability | R15, R17, R20 |

## Assumptions and derived requirements

- The existing `DashboardShell` and `ContextualUtilities` remain the source of truth for AviloFit navigation and shell behavior. The narrow route-awareness change described in R2 is necessary to make this governed route discoverable and current-state compliant. (Derived from R1-R2 and existing Activity/Nutrition pattern.)
- The supplied HTML's remote meal URLs are reference provenance only. The implementer must use existing or project-approved local assets and may not add runtime network dependencies. (Derived from R8-R10 and R19.)
- The supplied week labels and values are deterministic fixture copy, not dates calculated from the current clock. (Derived from R4, R6, and R14.)
- Unsupported controls intentionally remain local/inert because the governed work item does not authorize a grocery backend, meal editor, recipe system, or persistence. (Derived from R5, R11, R13-R14.)

