# Avilo Fit dashboard experience design

## Design intent

**Human:** A person opening Avilo after activity or while planning a meal, often with limited attention and a real budget. They need a practical next action, not a wall of health metrics.

**Task:** Understand what to cook or buy next, why it fits today's activity and nutrition context, what it costs, what is already in the pantry, and how the day is progressing.

**Feeling:** A calm kitchen counter after the ingredients have been organized: warm, grounded, quietly informative, and immediately actionable.

This design governs R1-R32.

## Domain exploration

### Domain territory

1. **Fuel and recovery:** the relationship between movement and the next meal.
2. **Mise en place:** what is already available, what is missing, and what comes next.
3. **Daily rhythm:** breakfast, training, recovery, lunch, snacks, dinner, and sleep.
4. **Pantry and market:** owned ingredients, missing groceries, price, availability, and substitutions.
5. **Range and balance:** nutrition targets represented as usable ranges rather than judgment.
6. **Coaching with permission:** explanation and guidance without pretending to diagnose.
7. **Progress over time:** a quiet trail of days rather than a competitive scoreboard.

### Color world

- Deep leafy forest and herb green: identity, nourishment, primary actions.
- Soft sage and eucalyptus: progress, nutrition ranges, secondary emphasis.
- Oat, parchment, and warm cream: calm canvas and food-adjacent surfaces.
- Charcoal and dark seed brown: readable text without sterile pure black.
- Citrus/terracotta orange: brief energy and active-movement emphasis.
- Clear-water blue: connected data, source information, and integrations.

Exact color values are provisional. Their semantic hierarchy is not: forest green dominates; orange and blue remain sparse.

### Signature

The signature is the **Fuel Thread**: the selected day connects activity -> remaining nutrition context -> recommended meal -> pantry/missing groceries -> cost/action. It appears in at least five concrete places:

1. Day cards summarize movement plus the next meal.
2. Recommendation context chips expose budget, activity, plan, pantry, and grocery inputs.
3. Meal rows distinguish pantry coverage and missing items beside cost.
4. Nutrition and activity summaries share the selected-day context and restrained semantic accents.
5. `Ask Avilo` starts with action prompts such as cook, buy, prep, or swap and explains the context used.

### Rejected dashboard defaults

1. **Default: equal metric-card grid.** Replaced by an action-led recommendation surface with supporting summaries, because Avilo is an execution layer rather than another tracker (R1, R11, R19).
2. **Default: permanent colored sidebar.** Replaced by adaptive primary navigation and contextual utilities on the same calm canvas, preventing a separate "navigation world" and preserving mobile parity (R2-R5).
3. **Default: bright multi-color rings for every metric.** Replaced by forest-led semantic tokens, quiet ranges, text labels, and sparse orange/blue accents so color carries meaning and is never the only cue (R22-R24).
4. **Default: generic AI chat bubble.** Replaced by `Ask Avilo` as a contextual recommendation explanation/composer with visible source chips and safety boundaries (R19-R21).
5. **Default: transactions table copied from the financial reference.** Replaced by a meal-decision table/timeline whose columns answer what, when, why, cost, pantry, and next action (R11-R14).

## Current-system observations

- The repository currently has no application scaffold, source tree, package manifest, architecture files, test setup, or executable commands. `README.md` is empty; the only other repository artifacts are harness contracts.
- The approved bootstrap exception permits this specification to define the first Next.js file structure. It does not authorize the Spec Author to create it.
- Approved stack: TypeScript, Next.js/React, Tailwind CSS, shadcn/ui; React Native/Expo later; TypeScript/Node APIs.
- Approved architecture: modular monolith with domain boundaries. Mobile will eventually consume the same API contracts.
- Approved hosting: Vercel for web/initial APIs and Supabase for future data/storage; neither is required for this fixture-only dashboard.
- Approved data direction includes user goals, activity summaries, nutrition plans/meals, supermarket context, AI inputs/recommendations, consent, and audit/access records. This feature must not create those tables.
- Engineering flow requires this branch to return to `develop` after implementation and independent review.

## System boundary

The first implementation is a **responsive presentation slice** inside the future web modular monolith. It consumes one `DashboardViewModel` from a provider boundary. The only provider implemented by this task is a deterministic local fixture.

```text
app/dashboard/page.tsx
        |
        v
DashboardScreen (composition and selected-day state)
        |
        +--> DashboardProvider interface
        |       `--> fixtureDashboardProvider (synthetic, no network)
        |
        +--> date/calendar + recommendation + nutrition + goal + activity sections
        |
        `--> AskAviloProvider interface
                `--> fixtureAskAviloProvider (deterministic, no model call)
```

Future Supabase, health, AI, and retailer adapters are intentionally absent. They require separately governed contracts, privacy review, credentials, and tests.

## Proposed file scope under the bootstrap exception

None of the following files exist today. The Implementer must create only this bounded scaffold and feature set; existing `AGENTS.md`, `.agents/**`, and `README.md` are not modified by this work.

### Bootstrap and configuration

| File to create | Responsibility |
| --- | --- |
| `package.json` | Next.js/React/TypeScript/Tailwind/shadcn-compatible scripts and dependencies; no AI, health, chart, analytics, or retailer SDK. |
| `package-lock.json` | Reproducible npm resolution for this initial package. This is a branch-local bootstrap choice, not an assertion that a prior repo convention existed. |
| `next.config.ts` | Minimal Next.js configuration; no remote image or external service allowance. |
| `tsconfig.json` | Strict TypeScript and `@/*` path alias. |
| `postcss.config.mjs` | Tailwind/PostCSS integration required by the approved stack. |
| `eslint.config.mjs` | Next.js/TypeScript lint baseline. |
| `vitest.config.ts` | Unit/component test environment and path alias. |
| `vitest.setup.ts` | Testing Library matchers and deterministic browser mocks only. |
| `playwright.config.ts` | Desktop/narrow route and interaction verification. |

If current `create-next-app` output requires a materially different Tailwind configuration file, that discrepancy is a stop condition for a spec revision rather than permission to add arbitrary configuration.

### App shell and semantic system

| File to create | Responsibility |
| --- | --- |
| `app/layout.tsx` | Root metadata, global stylesheet, accessible document shell, provisional typography setup without a new font dependency. |
| `app/page.tsx` | Redirect to `/dashboard`; no landing page. |
| `app/dashboard/page.tsx` | Server route that obtains the fixture view model and renders the dashboard feature. |
| `app/globals.css` | Tailwind import, provisional semantic design tokens, 4px spacing basis, type/radius/border/focus/motion rules. |
| `components/dashboard/dashboard-screen.tsx` | Feature composition, selected-day/local-demo state, independent section errors, and responsive ordering. |
| `components/dashboard/dashboard-shell.tsx` | Landmarks, max-width canvas, responsive grid, navigation placement, and user context. |
| `components/dashboard/adaptive-navigation.tsx` | R3-R4 primary navigation behavior. |
| `components/dashboard/contextual-utilities.tsx` | R5 desktop-extra-wide shortcuts and equivalent content actions. |

### Dashboard feature components

| File to create | Responsibility |
| --- | --- |
| `components/dashboard/day-strip.tsx` | Rounded day cards, carousel controls, selected/today/boundary behavior. |
| `components/dashboard/calendar-dialog.tsx` | Full calendar overlay, month navigation, focus management, and selection. |
| `components/dashboard/budget-editor.tsx` | Local-only currency/cadence edit with validation and disclosure. |
| `components/dashboard/recommendations-panel.tsx` | Recommendation heading, date/budget context, desktop table/narrow cards, status and primary actions. |
| `components/dashboard/grocery-export.tsx` | Provider-neutral normalized list preview/export and integration disclaimer. |
| `components/dashboard/nutrition-summary.tsx` | Calories/macros, target/range/provenance, and progress states. |
| `components/dashboard/goal-progress.tsx` | Goal category, safe trend/range language, insufficient-data state. |
| `components/dashboard/activity-summary.tsx` | Steps, heart/activity metric, sleep, active calories, workouts, source/freshness/access states. |
| `components/dashboard/ask-avilo.tsx` | Contextual composer, example prompts, deterministic response, chips, safety copy, and failures. |
| `components/dashboard/section-state.tsx` | Shared loading/empty/error/denied/stale patterns without fake values. |

### Approved shadcn/ui primitives

Create only the primitives actually used by the files above:

- `components/ui/button.tsx`
- `components/ui/dialog.tsx`
- `components/ui/input.tsx`
- `components/ui/label.tsx`
- `components/ui/popover.tsx`
- `components/ui/progress.tsx`
- `components/ui/skeleton.tsx`
- `components/ui/table.tsx`
- `components/ui/tooltip.tsx`

Their generated support dependencies are permitted only when required by the approved shadcn primitive. No broad component-library installation is authorized.

### Models, providers, selectors, and formatting

| File to create | Responsibility |
| --- | --- |
| `features/dashboard/model.ts` | Presentation-only types and state discriminants. |
| `features/dashboard/dashboard-provider.ts` | `DashboardProvider` and `AskAviloProvider` interfaces; no HTTP contract. |
| `features/dashboard/fixture-dashboard-provider.ts` | Synthetic deterministic dates, meals, nutrition, goals, activity, contexts, and failures. |
| `features/dashboard/selectors.ts` | Pure selected-day, allowed-future, range, pantry, and grocery-list derivations. |
| `features/dashboard/format.ts` | Central locale-aware date/time/currency/number/unit formatting. |

### Planned test files (written only by the Implementer)

| File to create | Coverage |
| --- | --- |
| `tests/dashboard/model.test.ts` | State/type invariants, safe range calculations, data minimization. |
| `tests/dashboard/selectors.test.ts` | Date isolation, future bounds, grocery normalization, context availability. |
| `tests/dashboard/format.test.ts` | Multiple locales/currencies, dates, time zones, and units. |
| `tests/dashboard/dashboard-screen.test.tsx` | Shared date context, responsive semantic order, independent section states. |
| `tests/dashboard/navigation.test.tsx` | Active labels, keyboard/focus behavior, utility parity. |
| `tests/dashboard/calendar.test.tsx` | Carousel, modal, focus return, boundary and state matrix. |
| `tests/dashboard/recommendations.test.tsx` | Meal fields/statuses, budget validation, pantry/missing/export behavior. |
| `tests/dashboard/health-and-ai-safety.test.tsx` | Access/freshness states, context chips, allergy conflict, safe copy. |
| `e2e/dashboard.spec.ts` | 360/768/1024/1440 layouts, keyboard path, primary workflow, screenshots. |

## Presentation model

`features/dashboard/model.ts` defines discriminated, read-only presentation types. They are not backend schemas.

```text
DashboardViewModel
  locale, currency, timeZone, selectedDate, availableDateRange
  days[]
  recommendationSection
  nutritionSection
  goalSection
  activitySection
  askAviloContext

SectionState<T> = loading | ready<T> | empty | error
ActivityAccess = connected | manual | not-connected | denied | unavailable | stale
PantryState = confirmed | assumed | unknown
MealStatus = recommended | planned | completed | skipped | unavailable
GoalKind = weight-loss | muscle-gain | maintenance | general-health | nutrition-adherence
ContextKind = budget | activity | nutrition-plan | preferences | pantry | grocery
```

Every numeric display value pairs with a unit and availability/provenance. Components never parse raw provider records. No personally identifying fields are required in the dashboard model.

## State and data flow

1. The server route requests a deterministic fixture model and renders the initial selected day.
2. `DashboardScreen` initializes a local selected-date key and a resettable local budget override.
3. Selecting a day calls one reducer/action. Pure selectors derive every section from the same date key (R6, R31).
4. Opening the calendar changes overlay state only. Choosing a date commits selected day, closes the dialog, announces the date, and returns focus.
5. Budget editing validates locally. Save updates a demo override and recomputes displayed budget context; reload resets it.
6. Grocery export derives only missing items for the selected day, presents a preview, and creates a user-initiated provider-neutral artifact in the browser.
7. `Ask Avilo` sends the sanitized question and selected context categories to the fixture provider in memory. The fixture returns deterministic safe text or a deterministic error; nothing leaves the browser/server fixture boundary.

### Invariants

- All dashboard sections derive from one selected date.
- Future days display planned data only; observed health values are unavailable unless explicitly fixture-supplied as a plan, which this package does not do.
- Recommendation does not mean consumed/completed.
- Unknown, denied, and unavailable never become numeric zero.
- Pantry `assumed`/`unknown` never becomes `confirmed` through display logic.
- Only missing ingredients enter export.
- No AI/health/budget/pantry text enters URL, logs, analytics, persistence, or network calls.
- Allergy/restriction conflict disables the meal action.

## Layout and responsive behavior

### Desktop (>= 1024px)

- Quiet top navigation within the same warm canvas.
- Day strip spans the dashboard width below navigation.
- Main content uses an asymmetric grid: recommendations/Fuel Thread receives the wider column; nutrition, goal, and activity occupy the supporting column/row.
- `Ask Avilo` is visually connected to recommendations, not a floating generic chat widget.
- Optional utility rail appears only at an extra-wide breakpoint (recommended >= 1280px) and mirrors accessible actions in content.

### Tablet (768-1023px)

- Navigation remains compact and labeled for the active destination.
- Two columns are allowed only when each section remains readable; recommendations stay full width.
- Utilities move into section headers/menus.

### Narrow/mobile (< 768px)

- One-column order required by R2.
- Primary navigation becomes bottom navigation or a compact labeled top control; touch targets are >=44px.
- Meal table becomes cards with label/value pairs; no horizontal table scroll.
- Day cards remain horizontally scrollable with explicit previous/next buttons and scroll-snap as enhancement, not the only control.
- Budget sits directly below/alongside the recommendation heading.

The native Expo implementation is not created here. Its later design must preserve the narrow hierarchy and semantic model rather than reuse web DOM components.

## Navigation rationale

- `Today`: the execution dashboard and active destination.
- `Activity`: source details, trends, connections, and workouts in future governed work.
- `Meals`: meal plan, saved meals, groceries, and budget; these form one decision domain rather than separate financial-style tabs.
- `Profile`: profile, goals, permissions, connections, settings, and help.

Search/saved/share are actions within those domains, not top-level destinations. The optional extra-wide rail is contextual convenience, never the only route.

## Visual system

### Provisional semantic tokens

Token names must communicate Avilo's world. Exact values are provisional and must be contrast-tested:

- `--avilo-forest`: primary identity/action.
- `--avilo-leaf`: interactive hover/active support.
- `--avilo-sage`: nutrition/progress support.
- `--avilo-oat`: page canvas.
- `--avilo-parchment`: raised surface.
- `--avilo-seed`: primary charcoal text.
- `--avilo-stone`: secondary/tertiary text.
- `--avilo-citrus`: sparse movement/active-energy emphasis.
- `--avilo-water`: sparse connected-data/information emphasis.
- `--avilo-danger`, `--avilo-warning`, `--avilo-success`: accessible semantic states, each paired with text/icon.

Surfaces use warm hue-consistent shifts. Forest green is the only brand action accent. Citrus and water may not be used decoratively.

### Depth, spacing, radius, typography

- **Depth:** subtle shadows plus low-contrast borders, consistently. Modals/popovers are one elevation above cards; inputs are inset. No dramatic shadows or mixed strategies.
- **Spacing:** 4px base; component gaps/padding use documented multiples.
- **Radius:** small controls, medium cards, large overlays; day cards use the medium/large family without pill-shaped containers for long content.
- **Typography:** system font stack for bootstrap (no unapproved font dependency), with display, body, label, metadata, and tabular-number roles. Final family waits for visual identity.
- **Icons:** one consistent icon source supplied by approved shadcn requirements; icons clarify and always receive accessible labels where standalone.

## Accessibility design

- Landmarks: header/nav/main and named regions for recommendations, nutrition, goals, activity, and AI.
- Date cards use buttons with full spoken date and summary; selected state uses `aria-pressed` or current semantics consistently.
- The desktop recommendation presentation uses a semantic table; the narrow DOM may use cards but preserves an equivalent reading sequence.
- Dialog follows accessible-name, focus trap, close, Escape, focus-return, and announcement requirements.
- Validation is associated with fields; async fixture responses use polite status announcements.
- Reduced motion removes expansion/scroll animation while preserving instant state changes.
- Contrast, non-color cues, focus, touch targets, and heading order follow R23-R25.

## Privacy, health, and AI safety design

- Presentation types intentionally omit names, account IDs, provider record IDs, raw heart samples, coordinates, and prompt history.
- Activity shows source category and freshness only. Permission is never requested automatically.
- `Ask Avilo` context chips reveal category-level explanations, not raw records.
- Synthetic fixtures use clearly fictional values and no copied user data.
- Allergy/restriction conflict is a blocking UI state.
- AI copy contains assistance/professional-review boundaries and never presents diagnosis, treatment, medication, or guaranteed outcomes.
- Export is explicit, local, scoped to missing grocery items, and preceded by a preview.
- Future real adapters require separate AI lifecycle, privacy/consent, integration, retention, monitoring, and domain-professional review.

## Loading, error handling, and recovery

Each section owns its `SectionState`. A failure in activity does not hide recommendations. Skeletons reserve layout and contain no values. Errors use section-specific plain language and retry the fixture-provider call/reset for that section. Denied/stale/unavailable activity uses dedicated states rather than generic errors. The calendar prevents selection beyond supplied bounds.

## Dependencies and prohibited additions

Authorized: approved Next.js/React/TypeScript/Tailwind/shadcn stack, Vitest/Testing Library for component verification, and Playwright for responsive/interaction verification. The test tools are necessary to satisfy the approved testing standard.

Prohibited in this work: Supabase client, AI SDK, health SDK, retailer SDK, geolocation, analytics/telemetry, charting library, state-management library, form library, date library, animation library, external font service, or any dependency that transmits dashboard data. Use platform APIs and small pure functions.

## Alternatives and decisions

| Choice | Selected | Rejected alternative | Reason |
| --- | --- | --- | --- |
| Responsive strategy | One responsive web experience defining mobile hierarchy | User-facing web/mobile switch | Duplicates modes, creates drift, and violates R2. |
| Left utility rail | Contextual, extra-wide-only convenience | Permanent icon rail | Adds unexplained navigation and weakens simplicity/accessibility (R5). |
| Calendar | Day-card strip plus accessible full overlay | Tiny date picker or full always-visible month | Tiny picker loses daily signals; permanent month consumes action space (R7-R9). |
| Recommendations | Semantic desktop table -> narrow cards | Horizontally scrolling mobile table | Preserves field meaning without mobile scanning burden (R11). |
| Activity visuals | Small purposeful trends/ranges using CSS/SVG only where meaningful | Four generic bright rings and chart library | Avoids tracker-template appearance and unapproved dependency (R17, R22-R24). |
| AI | Contextual `Ask Avilo` fixture adapter | Live model integration or floating chatbot | Live contract/safety/monitoring is unapproved; generic chat disconnects from the Fuel Thread (R19-R21, R27). |
| Grocery | Provider-neutral export | Walmart/direct cart claim | No retailer contract exists (R14). |
| Data | Typed deterministic fixtures | Invented backend/Supabase schema | Preserves architecture boundary and honest scope (R27-R28). |
| Mobile | Responsive product-language definition | React Native files in same task | Native implementation is independently reviewable and requires its own governed item. |

## Rollback and compatibility

The feature is additive. Rollback removes the new dashboard route/scaffold files on this branch before merge; it requires no data rollback because there is no persistence or migration. Browsers must support current evergreen releases. If progressive CSS features are used, core navigation, content, and actions must remain functional without them.

## Observability and verification design

There is no production telemetry in this task. Verification records local build/lint/test results, accessibility output, viewport screenshots, network inspection, and a local Lighthouse/Web Vitals baseline in `progress/current.md`. Runtime errors are represented in section UI; they are not sent externally.

## Requirement-to-design mapping

| Requirement | Design coverage |
| --- | --- |
| R1 | Design intent; Fuel Thread; asymmetric action-led layout |
| R2 | Desktop/tablet/narrow responsive behavior |
| R3 | Navigation rationale and `adaptive-navigation.tsx` |
| R4 | Adaptive icon/label and narrow navigation behavior |
| R5 | Contextual utilities decision and parity rule |
| R6 | Shared selected-date state and data flow |
| R7 | `day-strip.tsx`, date bounds, and day-card invariants |
| R8 | `calendar-dialog.tsx` and focus/selection flow |
| R9 | Calendar section-state model and recovery |
| R10 | `budget-editor.tsx` and local override flow |
| R11 | Recommendation table-to-card design |
| R12 | Meal status/occasion presentation model |
| R13 | Pantry invariants and selectors |
| R14 | Provider-neutral grocery export boundary |
| R15 | `nutrition-summary.tsx` and range/provenance model |
| R16 | `goal-progress.tsx` and safe trend language |
| R17 | `activity-summary.tsx` and source/freshness model |
| R18 | Minimum presentation model and access states |
| R19 | `ask-avilo.tsx` signature and placement |
| R20 | Context-chip model and sanitized detail |
| R21 | AI/nutrition safety design and conflict invariant |
| R22 | Domain color world and provisional semantic tokens |
| R23 | Contrast, focus, and non-color accessibility design |
| R24 | Depth, spacing, radius, and typography system |
| R25 | Accessibility design section and UI primitives |
| R26 | Independent `SectionState` and recovery design |
| R27 | Provider interfaces, fixtures, and prohibited integrations |
| R28 | Privacy-by-presentation boundaries and export scope |
| R29 | Bootstrap/build baseline and resilient layout |
| R30 | Centralized `format.ts` design |
| R31 | Resettable date-keyed fixture/selectors design |
| R32 | Observability and verification evidence design |

## Implementation stop conditions

The Implementer must stop and request a spec revision if implementation requires any live backend/API/schema, real provider data, retailer behavior, AI model behavior, new health permission, persistence, new route/destination behavior, native application files, unlisted file, unapproved dependency, or material change to the information hierarchy. Exact palette/font approval may be applied later only through a governed visual-identity decision.
