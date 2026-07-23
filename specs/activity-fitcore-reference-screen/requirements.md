# Activity FitCore Reference Screen Requirements

## Work-item identity

- **Notion work item:** `3a606edf-7ca0-8169-9be0-d993663c3a59` - Build Activity screen from FitCore reference while preserving AviloFit sidebar
- **Notion URL:** https://app.notion.com/p/3a606edf7ca081699be0d993663c3a59
- **Parent Epic:** `39006edf-7ca0-81b1-b3e3-e9981eb7c4f9` - Design the first six core user screens
- **Outcome ancestor:** `39006edf-7ca0-81c4-985e-f5d4ef795328` - Complete the Avilo visual identity
- **Branch:** `develop`
- **Source priority:** `C:\Users\gustt\AviloFitUI\activity.png` is the visual source of truth. `activity.html` supplies structure and content detail, while `activity.md` supplies supporting tokens. Existing repository architecture and the approved AviloFit sidebar override prototype CDN, font, icon, script, and FitCore-sidebar choices.

## Problem and intended outcome

Avilo Fit has an approved dashboard and Jobgio-style AviloFit sidebar, but it has no Activity destination. The intended outcome is a faithful, practical `/activity` screen matching the supplied reference while reusing the approved shell and technology stack. The screen presents deterministic activity summaries, pace and heart-rate analysis, records, history, trend, and clearly disclosed demo AI coaching without creating any other destination or live health workflow.

## Scope

### In scope

- The `/activity` route only.
- Reuse of the approved AviloFit sidebar, with Activity current on `/activity` and Dashboard current on `/dashboard`.
- The reference hierarchy: Activity topbar, four summary cards, Pace & Heart Rate, Personal Records, Recent Activity, Daily Trend, and AI Performance Coach.
- Deterministic fixture data, section states, local interactions, responsive behavior, accessibility, safety disclosure, tests, and visual evidence.

### Out of scope

- Nutrition, Meal Planner, Course Release, Progress, Statistics, Goals, Settings, profile, achievement-detail, analysis-detail, report-detail, notification, calendar, or quick-add destination screens.
- Live health integrations, wearable access, account/authentication changes, databases, APIs, persistence, background sync, analytics, telemetry, AI inference, medical decision support, or user-entered health records.
- Redesigning the approved AviloFit sidebar or approved `/dashboard` content.
- Importing the FitCore sidebar, FitCore branding, Material Symbols, Tailwind CDN, Google Fonts, prototype JavaScript, or remote images.
- New runtime dependencies, package/config/environment changes, migrations, or speculative product improvements.

## Definitions

- **Reference-faithful:** Preserves the PNG's hierarchy, relative proportions, pale green canvas, white rounded cards, dark green accents, typography scale, card order, desktop columns, and information density, allowing only Avilo naming, existing Lucide icons/font stack, accessibility, safety disclosure, and responsive reflow.
- **Activity period:** One of `Week`, `Month`, or `Year`; selecting it changes only the deterministic analysis series and selected state.
- **Synthetic activity data:** Stable local fixture values that are not fetched from, attributed to, or written to a health provider or real person.
- **Presentation-only control:** A semantic interactive control that provides focus/pressed/local state where specified but does not navigate to an unbuilt destination, fetch, persist, or mutate domain data.
- **Supported viewports:** `1440x900`, `1024x900`, `768x900`, and `360x800`.

## Requirements

### R1 - Add only the Activity route

The system must expose `/activity` through the existing Next.js App Router. Loading the route with a ready fixture must render one Activity main landmark inside the shared dashboard shell. No other route or destination screen may be created.

**Evidence:** route render test, production build route output, changed-file audit, and negative route/file audit for other destinations.

### R2 - Preserve and reuse the approved AviloFit sidebar

The Activity route must render the existing `ContextualUtilities` sidebar structure, AviloFit branding, primary item labels, icons, Settings separation, demo profile, fixed desktop geometry, and responsive treatment. Sidebar visual dimensions, colors, spacing, profile content, and item order must not be redesigned.

**Evidence:** shared sidebar unit assertions, screenshot comparison with the approved sidebar, fixed-geometry E2E, and scoped diff review.

### R3 - Expose correct current-page and route navigation semantics

On `/activity`, Activity must expose `aria-current="page"` and Dashboard must not. On `/dashboard`, Dashboard must remain current and Activity must not. Dashboard and Activity sidebar items must navigate to their existing routes with native link semantics. All unbuilt sidebar destinations remain non-navigating presentation controls and must not create screens.

**Evidence:** unit tests for both shell states, keyboard/click E2E between `/dashboard` and `/activity`, current-page assertions, and route inventory.

### R4 - Match the reference hierarchy and visual direction

At 1440px, ready content must appear in this order: Activity topbar; four summary cards; a two-column analytics row with Pace & Heart Rate and Personal Records; a lower row with Recent Activity and a narrow stack containing Daily Trend and AI Performance Coach. The composition must match the PNG's proportions, pale green canvas, white rounded bordered cards, restrained shadows, green/near-black accents, and generous gaps. Unrequested visual redesign is prohibited.

**Evidence:** deterministic full-page screenshot and side-by-side review against `activity.png`; DOM order and geometry assertions.

### R5 - Render the Activity topbar

The topbar must show the `Activity` heading, a labeled search field with placeholder `Search exercises...`, green `Quick Add`, notification, and calendar controls using existing Lucide icons. Notification must include a non-color-only unread accessible label. Search text is local controlled state and does not filter sections in this scope. Buttons are presentation-only and preserve the route without requests or storage changes.

**Evidence:** role/name/placeholder assertions, typing and clearing test, keyboard focus, unread accessible-name assertion, and no-side-effect request/storage/URL test.

### R6 - Render four ordered activity summary cards

Exactly four cards must appear in order: Running `42.8 km` with `+12%`, Walking `78,412 steps` with `+4%`, Cycling `115.2 km` with `-2%`, and Strength `4 sessions` with `New!`. Each card must include a semantic Lucide icon, category label, value/unit, and trend/status text. Trend meaning may not rely on color alone.

**Evidence:** ordered content/cardinality tests, visual screenshot, and accessible text inspection.

### R7 - Keep summary-card interaction bounded

Summary cards may provide the reference hover/focus elevation treatment but must not be links or mutate data because no detail destination is approved. Keyboard focus is required only if a card is implemented as an actual control; otherwise hover decoration must not imply activation.

**Evidence:** semantic inspection, no-navigation test, pointer/focus visual review, and reduced-motion verification.

### R8 - Render Pace & Heart Rate analysis

The main analytics card must show `Pace & Heart Rate`, the supporting analysis description, an accessible visualization, the Week/Month/Year segmented period control, Heart Rate (Avg) and Pace (Avg) legend entries, and `Deep Analysis` presentation-only control. The visualization must use platform SVG/CSS and must not add a charting dependency.

**Evidence:** component content/role tests, SVG accessible-name/description assertion, dependency diff audit, and screenshot.

### R9 - Support deterministic period switching

`Week` is selected initially. Selecting Month or Year must update the pressed/selected semantics and visible deterministic series from the typed fixture while keeping summary cards, records, history, trend, search text, and sidebar unchanged. Re-selecting the active period is idempotent. No network, URL, or storage state is allowed.

**Evidence:** mouse and keyboard period tests, series-change assertion, sibling-state preservation, idempotence, and request/storage/URL capture.

### R10 - Provide chart focus and tooltip equivalence

At least one deterministic chart point must expose the paired values `162 bpm` and `4'12" /km` through an accessible focusable data-point control or an equivalent chart data summary. Pointer hover and keyboard focus must reveal the same tooltip content without clipping. Escape or blur dismisses a transient tooltip without changing data.

**Evidence:** pointer and keyboard tests, accessible chart summary, tooltip geometry screenshot, and dismissal assertion.

### R11 - Render Personal Records

The records card must show `Personal Records` and exactly three ordered synthetic records matching the reference: Longest Run `21.1 km` / `Oct 14`, Fastest 5k `19:42` / `Nov 02`, and Max Deadlift `140 kg` / `Yesterday`, derived from a fixed fixture reference date rather than the runtime clock. `View All Achievements` is presentation-only.

**Evidence:** ordered/cardinality assertions, fixed-date model test, no-op control test, and screenshot.

### R12 - Render Recent Activity

The recent-activity region must show a heading, accessible filter control, and exactly three ordered fixture rows: Evening Run, Push Day #4, and Commute Cycle. Each row includes icon, deterministic display date/time, duration, calories, and `Completed` status. Desktop uses the reference table hierarchy; narrow viewports must reflow or provide a labeled contained horizontal scroller without document-level overflow.

**Evidence:** row/column content tests, status semantics, mobile geometry/scroll-container assertion, and screenshot.

### R13 - Keep Recent Activity controls presentation-only

The filter and row overflow controls must have specific accessible names and visible focus, but activation must not fabricate filtering, menus, navigation, or persistence. If a row action has no approved behavior, it remains a no-op button.

**Evidence:** accessible-name tests, keyboard activation, and no-side-effect assertions.

### R14 - Render Daily Trend

The Daily Trend card must render Monday through Friday in order with deterministic bounded values matching the relative bar lengths in the reference. Each bar must expose its weekday and numeric value to assistive technology; the highlighted day must be identified by text/semantics, not green alone.

**Evidence:** ordered weekday tests, progress/value assertions, boundary model tests, and screenshot.

### R15 - Render AI Performance Coach safely

The dark coach card must show `AI Performance Coach`, the deterministic reference-style recommendation, and `Read Full Report`. It must visibly identify the content as demo/general wellness guidance and state that it is not medical advice or a medical finding. The recommendation must not claim diagnosis, treatment, guaranteed performance, or live AI personalization. The report control is presentation-only.

**Evidence:** safety-copy and prohibited-claim tests, button no-op test, visual screenshot, and health/AI review.

### R16 - Use one typed deterministic Activity model

All visible Activity values, labels, dates, series, records, rows, trends, and coach copy must come from one typed `ActivityViewModel` returned by a fixture provider. The fixture uses locale `en-US`, timezone `America/Costa_Rica`, a fixed reference date, structured-clone isolation, and no runtime clock, randomness, fetch, storage, environment secret, remote URL, or real health provenance.

**Evidence:** model shape/cardinality/order tests, clone-isolation test, source inspection, and request/storage capture.

### R17 - Provide independent section loading states

Summary, analysis, records, recent activity, daily trend, and coach must each support `loading`. A loading section reserves approximately ready-state geometry, announces loading accessibly, and does not hide the topbar, sidebar, or ready siblings.

**Evidence:** parameterized component tests for all six sections, sibling-isolation assertions, and loading screenshot.

### R18 - Provide independent empty states

Each independently stateful section must support `empty` with section-specific concise copy and no fabricated values. Recent Activity must distinguish no recorded activities from failure; records and coach must not invent achievements or advice. Ready siblings remain visible.

**Evidence:** parameterized empty-state tests and no-fabricated-content assertions.

### R19 - Provide failure and local recovery states

Each independently stateful section must support `error` with alert semantics, explain that other Activity data is unaffected, and expose `Retry section`. In fixture mode, retry restores only that section to ready while preserving search text, selected period, chart tooltip state where applicable, and sibling states; it performs no request.

**Evidence:** parameterized error/retry tests, local-state preservation, and request capture.

### R20 - Responsive layout without overlap

At 1440 and 1024 widths, the sidebar and desktop hierarchy must not overlap. At 768, summary cards may use two columns and major analytics/lower regions stack. At 360, topbar actions wrap, cards become one column, the chart remains legible, and recent activity remains usable. No supported viewport may have document-level horizontal scrolling, clipped focus rings, overlapping text, or fixed-height content loss.

**Evidence:** Playwright geometry and full-page screenshots at all supported viewports; `scrollWidth <= clientWidth`.

### R21 - Keyboard, focus, and interaction accessibility

Every interactive control must be reachable in logical DOM order, operable using native keyboard behavior, and show the existing visible focus style without clipping. Period controls expose selected state; icon-only buttons have explicit names; tooltip behavior works without pointer; no focus trap is introduced.

**Evidence:** desktop and mobile keyboard-only E2E, focus-style checks, and selected-state assertions.

### R22 - Semantic, contrast, target, and motion accessibility

The route must provide one main landmark, logical headings, labeled regions, table semantics or an equivalent accessible narrow-screen representation, decorative icons hidden from assistive technology, and chart/trend information available without color. Text and controls meet WCAG 2.1 AA contrast; touch controls are at least 44x44 CSS pixels at touch widths; animations honor `prefers-reduced-motion`.

**Evidence:** Testing Library roles, Axe with zero serious/critical violations, computed target geometry, contrast review, and reduced-motion E2E/CSS inspection.

### R23 - Privacy and minimum-necessary health-data handling

Only synthetic fixture data may render. The route must not request health permissions; log, transmit, persist, export, or place activity/heart-rate data in URLs; or imply a connected device/source. No new consent, authorization, retention, audit, account, or professional-access boundary is introduced.

**Evidence:** source inspection, network/storage/URL assertions, rendered provenance scan, and config diff review.

### R24 - Performance, compatibility, rollback, and visual evidence

Implementation must add no dependency, remote font/icon/image, runtime data fetch, or migration. It must preserve `DashboardProvider.getDashboard()`, `/dashboard` behavior, and the approved sidebar visual contract. Activity visual evidence includes full-page screenshots at all supported viewports plus focused desktop screenshots for the topbar, chart tooltip, records, recent activity, trend, and coach. Rollback is limited to the files listed in design and must leave prior dashboard/sidebar work intact.

**Evidence:** package/lock/config zero diff, build output, dashboard regression tests, request capture, screenshot inventory, and changed-file/rollback audit.

### R25 - Derived: pass repository verification within exact scope

**Derived from R1-R24.** The Implementer must remain within the exact file scope in `design.md` and pass `npm run lint`, `npm run typecheck`, Activity/dashboard-focused Vitest, Activity/dashboard Playwright, and `npm run build`. This adds no user-visible capability; it is required to verify the approved behavior and existing harness.

**Evidence:** command outputs and scoped changed-file audit recorded in `progress/current.md`.

## Assumptions and non-blocking interpretations

- The PNG governs when `activity.md` conflicts with it; rounded cards and restrained shadows are retained despite the markdown's sharp/no-shadow prose.
- FitCore branding and prototype profile/sidebar are context only. The approved AviloFit sidebar is reused.
- Visible reference values are synthetic demo fixtures. Relative labels such as Today/Yesterday are derived from a fixed fixture reference date, never the machine clock.
- Search, Quick Add, notifications, calendar, Deep Analysis, achievements, filter, row actions, and report controls remain presentation-only because their workflows or destination screens are not approved.
- The chart may use a deterministic SVG approximation of the reference, provided hierarchy, data-point values, accessibility, and visual proportions remain faithful.
- No unresolved behavioral question changes scope, interfaces, privacy, safety, or architecture.

## Traceability to original request

| Requested behavior / acceptance intent | Requirements |
| --- | --- |
| Do exactly the same governed workflow as the dashboard | R1-R25 |
| Build only the Activity screen | R1, R3, R24 |
| Match supplied PNG/HTML/MD faithfully | R4-R15, R20, R24 |
| Preserve and reuse the approved AviloFit sidebar | R2, R3, R24 |
| Do not create other screens | R1, R3, Scope |
| Use existing stack and architecture | R8, R16, R24, R25 |
| Responsive behavior | R12, R20 |
| Accessibility and interaction states | R5, R7-R10, R13, R17-R22 |
| Deterministic demo data | R6, R9-R16, R23 |
| Health and AI safety disclosures | R15, R23 |
| Requirement-to-test traceability and verification | Evidence under R1-R25; R24-R25 |
