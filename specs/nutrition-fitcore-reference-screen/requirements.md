# Nutrition Screen Requirements

## Work Item

- Notion item: `3a606edf-7ca0-81c9-a674-ec3edd1045b4`
- Title: Build Nutrition screen from FitCore reference while preserving AviloFit sidebar
- Branch: `develop`
- Scope: Nutrition destination only
- References: `C:\Users\gustt\AviloFitUI\nutrition.png`, `nutrition.html`, `nutrition.md`

## Outcome

Implement a responsive Nutrition destination that faithfully follows the supplied FitCore reference while preserving the approved AviloFit sidebar, existing Next/React/TypeScript/Lucide patterns, deterministic local demo data, and the repository's safety and accessibility expectations.

## Scope

In scope: the Nutrition route, shared topbar treatment, Daily Calories, Macro Distribution, Hydration, Meal History, AI Nutritional Analysis, AI Recommendations, Discover Recipes, responsive states, and route navigation.

Out of scope: redesigning the sidebar, implementing other destinations, backend persistence, authentication, food databases, health-device integrations, real AI inference, payments, or new dependencies.

## Definitions and safety

- A nutrition metric is demo health-related information rendered from a local fixture, not a diagnosis or medical recommendation.
- A recommendation is educational demo copy derived from deterministic fixture context; it must not claim clinical certainty.
- “Quick Add”, hydration logging, recipe browsing, and meal editing are presentational interactions unless the requirement explicitly defines a local state update.

## Requirements

### R1. Nutrition route and navigation

When a user opens `/nutrition`, the system MUST render the Nutrition screen with the existing AviloFit sidebar, mark Nutrition active, preserve Dashboard and Activity links, and avoid creating other destination screens. The route MUST render without external data or network requests.

### R2. Approved sidebar compatibility

The screen MUST reuse the existing approved sidebar component and its responsive behavior, branding, iconography, settings separation, profile treatment, and active-state semantics. Nutrition-specific code MUST NOT duplicate or visually override the sidebar.

### R3. Topbar

The topbar MUST show the FitCore-style product heading, food/recipe search field, Quick Add action, notifications control, and calendar control in the supplied order and visual hierarchy. Search MUST have an accessible label and remain locally inert unless an existing shared interaction pattern is reused. Controls MUST be keyboard reachable and have discernible names.

### R4. Daily Calories

The page MUST show a Daily Calories card with a circular progress visualization, consumed calories, target calories, remaining calories, exercise adjustment, and a non-destructive overflow control. The fixture MUST use the reference values `1,420`, `2,100 kcal`, `680`, and `+340`; values MUST be formatted consistently and remain readable at supported sizes.

### R5. Macro Distribution

The page MUST show Macro Distribution with target-achieved status, Protein `112g / 140g`, Carbs `185g / 220g`, Fats `42g / 65g`, three progress bars, guidance copy, Fiber `24g`, Sugar `32g`, and a View Micro-nutrients affordance. Each macro MUST expose an accessible text equivalent in addition to visual progress.

### R6. Hydration

The page MUST show Hydration with `2,100 / 3000 ml`, ten discrete glass indicators with six filled and four unfilled, and an Add 250ml action. Activating Add 250ml MUST update only local displayed hydration state by +250ml, cap at the configured daily target, and provide an accessible status announcement. It MUST not persist or send health data.

### R7. Meal History

The page MUST show Meal History with the current demo date, at least the two supplied meals, meal type/time, calories, and protein/carbohydrate/fat chips. The supplied examples MUST include Steel-cut Oats with Berries (`420 kcal`, breakfast, `08:30 AM`) and Grilled Salmon & Avocado Salad (`580 kcal`, lunch, `01:15 PM`). Edit affordances MUST be named and locally inert unless a deterministic local edit state is implemented.

### R8. AI Nutritional Analysis

Meal History MUST include an AI Nutritional Analysis callout with the supplied Omega-3/fiber observation and dinner suggestion. The callout MUST visibly distinguish informational demo guidance from medical advice and include a concise “not medical advice” boundary where needed. It MUST never imply a diagnosis, treatment, guaranteed outcome, or professional relationship.

### R9. AI Recommendations

The page MUST show AI Recommendations with Next Meal Suggestion, Lemon Garlic Cod affordance, and Micro-nutrients Tip content matching the reference intent. Recommendation text MUST be deterministic, educational, and framed as a suggestion. No real model call, user profiling, or external side effect is permitted.

### R10. Discover Recipes

The page MUST show Discover Recipes with Browse All affordance, two recipe cards, local or repository-approved visual assets, preparation-time labels, names, and dietary descriptors. The reference recipes MUST include Quinoa Power Bowl (`15 MIN`, High Protein, Gluten Free) and Lean Turkey Wrap (`10 MIN`, Low Carb, Energy Boost). Image alternatives MUST be supplied; remote reference image URLs MUST NOT be used.

### R11. Responsive layout

At desktop, tablet, and mobile widths supported by the project, the page MUST preserve the reference hierarchy: topbar, daily-summary row, hydration/meal row, and recommendations/recipes row. Cards MUST reflow without horizontal document overflow, clipped controls, unreadable text, or overlap with the sidebar. The sidebar remains compatible with its established responsive behavior.

### R12. Loading, empty, and failure states

Nutrition data sections MUST have independently representable loading, empty, and error/retry states using existing project state patterns. A failure in one section MUST not blank unrelated sections. States MUST explain what is unavailable, offer retry when meaningful, and remain accessible. The deterministic fixture path MUST render the success state by default.

### R13. Interaction and state boundaries

Only explicitly permitted local interactions MAY change state: hydration increment and existing shared navigation. Search, Quick Add, notifications, calendar, recipe browsing, micro-nutrient, edit, and recommendation affordances MUST either use an existing approved local interaction or remain clearly inert; they MUST not navigate to unimplemented destinations or mutate external systems.

### R14. Accessibility

The implementation MUST provide semantic landmarks, heading hierarchy, accessible names for icon-only controls, keyboard operation, visible focus indicators, sufficient color contrast, non-color equivalents for progress/status, meaningful image alternatives, and screen-reader-readable values. SVG progress visuals MUST have text alternatives.

### R15. Health-data privacy and AI safety

All nutrition, hydration, meal, macro, and recommendation values MUST be deterministic local demo data. The screen MUST not collect, persist, transmit, infer, or expose real personal health data. AI copy MUST remain non-diagnostic and include safety boundary language. No secrets, credentials, analytics calls, or third-party requests may be introduced.

### R16. Performance and compatibility

The screen MUST reuse existing dependencies and shared primitives, avoid unnecessary client state, avoid unoptimized remote images, and preserve typecheck, lint, unit tests, build, and existing dashboard/activity behavior. No dependency or configuration changes are authorized.

### R17. Verification and traceability

The implementation MUST provide evidence for every requirement through focused unit/component tests and responsive browser verification. Verification MUST cover route rendering, sidebar active state, displayed values, hydration increment/cap, safety text, accessibility names, responsive overflow, isolated state/error handling, and absence of external requests or side effects.

## Traceability

| Supplied intent / acceptance criterion | Requirements |
| --- | --- |
| Nutrition-only FitCore screen | R1, R2, R11 |
| Topbar, search, Quick Add, notifications, calendar | R3, R13, R14 |
| Daily Calories | R4, R12, R14 |
| Macro Distribution and micronutrients | R5, R12, R14, R15 |
| Hydration tracker and Add 250ml | R6, R12, R13, R15 |
| Meal History and meal details | R7, R12, R14, R15 |
| AI Nutritional Analysis | R8, R12, R15 |
| AI Recommendations | R9, R12, R15 |
| Discover Recipes | R10, R12, R14, R16 |
| Preserve approved sidebar | R1, R2, R11 |
| Responsive, accessible, safe, deterministic behavior | R11-R17 |

## Assumptions and derived requirements

- The existing approved sidebar and shared shell are the source of truth for navigation and brand treatment.
- Recipe visuals will use existing local assets or newly added repository assets only if the existing architecture already permits them; no external URLs are authorized. (Derived from R10, R15.)
- “Today, 24 Oct” remains fixture copy unless existing date-format utilities require a deterministic equivalent. (Derived from R7.)
- No unresolved behavioral ambiguity blocks this package; all non-reference interactions are intentionally bounded as local/inert behavior.
