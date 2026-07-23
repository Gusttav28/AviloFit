# Dashboard FitCore Reference Redesign Requirements

## Work-item identity

- **Notion work item:** `3a506edf-7ca0-8182-b777-cf1adc355591` - Rebuild dashboard content from FitCore reference while preserving Avilo sidebar
- **Notion URL:** https://app.notion.com/p/3a506edf7ca08182b777cf1adc355591
- **Parent Epic:** `39006edf-7ca0-81b1-b3e3-e9981eb7c4f9` - Design the first six core user screens
- **Outcome ancestor:** `39006edf-7ca0-81c4-985e-f5d4ef795328` - Complete the Avilo visual identity
- **Branch:** `develop`
- **Source priority:** `C:\Users\gustt\AviloFitUI\dashboard.png` is the visual source of truth. `dashboard.html` supplies structure/content detail and `dashboard.md` supplies supporting tokens. Repository conventions override the prototype's CDN, Material Symbols, and standalone Tailwind setup.

## Problem and outcome

The current `/dashboard` content is an iterative nutrition/activity composition that is not practical enough for the immediate product direction. The intended outcome is a faithful Avilo Fit implementation of the supplied FitCore dashboard reference, delivered in the repository's existing Next.js, React, TypeScript, Tailwind CSS, Lucide, deterministic-provider, Vitest, and Playwright architecture. The existing Avilo Fit sidebar is already approved and must remain exactly as implemented.

## Scope

### In scope

- The `/dashboard` main content after the existing sidebar: utility header, weekly performance card, four metric cards, today's meals, compact calendar/events, workout cards, and smart-insights card.
- Avilo Fit naming, deterministic fixture content, formatting, states, accessibility, and responsive behavior for those sections.
- Test and visual-regression evidence needed to verify the rebuild.

### Out of scope

- Any edit to `components/dashboard/contextual-utilities.tsx`, its item list, labels, icons, active state, expansion behavior, settings separation, positioning, or responsive behavior.
- The FitCore reference sidebar, Profile card, or any destination screen linked conceptually from either sidebar.
- Live APIs, authentication, persistence, database/schema work, real health-provider access, AI inference, retailer behavior, analytics/telemetry, notifications, or background synchronization.
- Making search, Quick Add, meal editing/logging, plan customization, calendar navigation, or recovery-report controls perform business operations beyond deterministic local presentation state defined below.
- Speculative visual improvements or redesign beyond faithfully adapting the supplied reference to Avilo Fit.

## Definitions

- **Main content:** Everything rendered by `DashboardScreen` beside/after the preserved `ContextualUtilities` sidebar.
- **Reference-faithful:** The same hierarchy, relative proportions, card order, light green canvas, white rounded surfaces, dark green accents, black icon tiles, spacing rhythm, and desktop composition visible in `dashboard.png`, allowing only Avilo naming, repository fonts/icons, accessibility, responsive reflow, and truthful fixture content.
- **Weekly performance:** The large card containing a circular goal indicator, summary copy, points badge, and three inset metrics.
- **Quick metric:** One of Steps Taken, Water Intake, kcal Left, or Deep Sleep.
- **Deterministic fixture:** Local in-memory data returned without network, storage, time-of-day, or random dependencies.
- **Informational health data:** Demo activity/nutrition values that are not diagnosis, treatment, or medical advice.

## Requirements

### R1 - Preserve the existing Avilo sidebar

The Implementer must leave `components/dashboard/contextual-utilities.tsx` unchanged and must not replace it with the FitCore sidebar. Existing sidebar labels, icons, Dashboard active state, Settings separation, hover/focus expansion, collapsed icons, desktop/static positioning, and responsive behavior must remain observable before and after the rebuild. No other sidebar destination screen may be added.

**Evidence:** zero diff for the component; navigation unit tests remain green; E2E compares sidebar structure, labels, focus path, collapsed icon visibility, expansion, and fixed desktop geometry before/after main-content scrolling.

### R2 - Replace only the `/dashboard` main-content hierarchy

On successful model load, `/dashboard` must render, in order: an Avilo utility header; Weekly Performance; four quick metrics; a lower desktop grid whose large column contains Today's Meals then workout cards and whose narrow column contains calendar/events then Smart Insights. The current daily summary strip, greeting/actions, Summary, Activity, progress cards, meal/workout history, and Ask Avilo input must not render in the rebuilt main content.

**Evidence:** component and E2E role/order assertions; removed-content negative assertions.

### R3 - Match the reference visual direction first

At the primary 1440px desktop evidence viewport, the main content must faithfully match `dashboard.png`: pale green page canvas, white rounded bordered cards with restrained shadow, dark green progress/accent treatment, near-black icon tiles and actions, the large performance card, equal four-card metric row, approximately two-thirds/one-third lower columns, and consistent 24px-class gutters. Visual changes not required by R1, accessibility, truthful Avilo content, or responsive behavior are prohibited.

**Evidence:** full-page screenshot and side-by-side visual review against `dashboard.png`; geometry assertions for order, columns, equal metric dimensions, non-overlap, and bounded card radii.

### R4 - Render an Avilo utility header

The main content header must show `Avilo Fit`, a search input with placeholder `Search analytics...`, a dark `Quick Add` button with a plus icon, and a calendar icon button. Search is local presentation state only: typing and clearing must not issue network requests or filter other sections. Quick Add and calendar controls must be native buttons with descriptive accessible names; activation may preserve the current page without side effects because business workflows are out of scope.

**Evidence:** role/name assertions, typing test, keyboard focus test, and no-external-request evidence.

### R5 - Render weekly performance

The performance card must show a determinate circular goal indicator, percentage and `GOAL` label, `Weekly Performance` heading, short encouraging text using Avilo fixture identity, a positive points badge, and three inset metrics: Activity Score, Calories Burned, and Active Minutes. The ring's visible completion and accessible value must derive from the same bounded `0..100` fixture value.

**Evidence:** semantic progress value assertions, content assertions, and visual screenshot.

### R6 - Render four quick metrics

The metric row must contain exactly four cards in this order: Steps Taken, Water Intake, kcal Left, and Deep Sleep. Each must include a Lucide icon in a dark tile, context label, primary value, descriptive label, and determinate progress bar. Progress must be clamped to `0..100`, represented accessibly, and not depend on color alone.

**Evidence:** ordered card assertions, accessible progress values, boundary model tests for clamping, and visual screenshot.

### R7 - Render Today's Meals faithfully

The meals card must contain a `Today's Meals` heading and `Customize Plan` control. Deterministic fixture rows must represent breakfast, lunch, and dinner in reference order. Logged/planned meals show name, local time, calories, and protein/carbohydrate/fat values; breakfast and lunch show local thumbnail assets and edit buttons. The unlogged scheduled dinner shows a neutral placeholder icon, `Dinner: Not logged yet`, scheduled time, an Avilo suggestion, and a `Log` button. Controls are presentation-only and must not mutate data or claim persistence.

**Evidence:** row order/content assertions, local-image source assertions with useful alt text, control semantics, and zero network requests.

### R8 - Render the compact calendar and events

The calendar card must show a localized month/year heading, weekday headers, a stable visible week/month grid matching the reference density, previous/next controls, selected-date semantics, event indicators, and the day's event list. In deterministic mode, previous/next changes only among fixture-backed periods; unavailable navigation is disabled. Date selection updates the selected calendar date and event list locally without changing unrelated dashboard metrics.

**Evidence:** keyboard/date-selection tests, disabled-boundary tests, localized formatting assertions, and selected-date/event visual state.

### R9 - Render workout cards

Below Today's Meals, render exactly two fixture workout cards matching the reference structure: Morning Run and Strength Training. Each displays a Lucide activity icon in a dark tile, duration, calories, average heart rate, and accessible completion/intensity progress. Heart-rate text must be labeled as recorded/demo data and must not imply diagnosis.

**Evidence:** content/order assertions, accessible progress assertions, safety-copy assertion, and screenshot.

### R10 - Render Smart Insights safely

The dark Smart Insights card must include heading, `RECOMMENDATION` label, one deterministic recommendation, Workout Recovery percentage/progress, and `View Recovery Report` button. The recommendation must be explicitly labeled demo/general guidance and include the existing health-data disclaimer that values are deterministic demo data, not medical findings or medical advice. The button is presentation-only and causes no network, navigation, or persistence.

**Evidence:** disclaimer and recommendation assertions, button side-effect test, accessible progress value, and safety test.

### R11 - Use a single typed deterministic dashboard model

All visible content in R4-R10 must be supplied through a typed dashboard view-model extension returned by `fixtureDashboardProvider`; components must not hardcode independent copies of domain values. Fixtures must use stable dates, locale `en-US`, currency `USD`, timezone `America/Costa_Rica`, local asset paths, and structured-clone isolation. No `Date.now`, randomness, fetch, storage, environment secret, or remote image/CDN URL may affect rendering.

**Evidence:** model shape/value tests, clone-isolation test, source inspection, and E2E network capture.

### R12 - Provide section loading states

When a section status is `loading`, its reserved card/region must render an accessible loading announcement and skeleton geometry close enough to the ready state to avoid disruptive reflow. The independently stateful sections are performance, metrics, meals, calendar, workouts, and insights. The header and preserved sidebar remain available.

**Evidence:** parameterized component tests for each section and layout-shift-oriented screenshot evidence.

### R13 - Provide section empty states

When a section is `empty`, its region must show concise section-specific copy. Meals, calendar events, and workouts must distinguish `no items for this day` from failure. Performance/metrics/insights empty states must not fabricate values or recommendations. Sibling sections remain rendered.

**Evidence:** parameterized empty-state tests and sibling-isolation assertions.

### R14 - Provide section error and recovery states

When a section is `error`, its region must expose an alert, explain that other dashboard data is unaffected, and provide a `Retry section` button. Retry changes only that local presentation status to ready, preserves calendar selection/search text, and issues no network request in fixture mode.

**Evidence:** parameterized error/retry tests and state-preservation assertions.

### R15 - Responsive desktop, tablet, and mobile layout

At 1440 and 1024 widths, the layout must preserve reference hierarchy without sidebar overlap. At 768, major content becomes one column or two-card metric/workout grids as space permits. At 360, header actions wrap, every major card is one column, meal rows reflow without truncating essential content, and calendar remains usable. No supported viewport may create document-level horizontal scrolling, clipped controls, overlapping text, or fixed-height content loss.

**Evidence:** Playwright geometry and screenshots at 1440x900, 1024x900, 768x900, and 360x800; horizontal-overflow assertion.

### R16 - Keyboard and focus behavior

Every interactive element must be reachable in DOM order, operable with native Enter/Space behavior, and display the existing visible focus treatment without clipping. Search, header buttons, meal controls, calendar controls/dates, and report control must not trap focus. Disabled dates/period controls must be skipped or expose native disabled semantics.

**Evidence:** keyboard-only E2E path at desktop and mobile, focus-style assertions, and disabled-control tests.

### R17 - Semantic and screen-reader accessibility

The route must have one main landmark, logical heading hierarchy, labeled regions/cards, accessible names for icon-only buttons, informative image alt text, decorative icons hidden from assistive technology, and progress semantics with labels and current values. Selected calendar dates must expose `aria-current="date"` or equivalent. Status changes use appropriate polite/alert announcements. Information may not rely on color alone.

**Evidence:** Testing Library role assertions and Axe with zero serious/critical violations introduced by the redesign.

### R18 - Contrast, motion, and target size

Text, controls, progress indicators, and focus indicators must meet WCAG 2.1 AA contrast under the actual backgrounds. Meaningful controls must provide at least 44x44 CSS-pixel targets on touch layouts. Any ring/progress transition must honor `prefers-reduced-motion`; the ready content remains understandable with animation disabled.

**Evidence:** computed geometry, Axe/contrast review, and reduced-motion E2E or CSS inspection.

### R19 - Privacy and minimum necessary data

The rebuild must display only synthetic fixture data and must not log, transmit, persist, export, or place health/nutrition values in URLs. Image assets must be local and contain no user metadata requirement. No new consent, authorization, retention, audit, or account boundary is introduced.

**Evidence:** source inspection, request capture, storage/URL assertions, and dependency/config diff review.

### R20 - Health-data language and safety

Calories, steps, hydration, sleep, heart rate, workout recovery, macros, and suggestions must be framed as informational demo values. The interface must not state or imply diagnosis, treatment, guaranteed outcomes, calorie compensation/earning, or professional medical advice. Existing allergy-conflict protections in unused neighboring components must not be weakened.

**Evidence:** safety-copy tests, prohibited-claim text scan, and unchanged existing health/AI safety tests where still applicable.

### R21 - Performance and reliability

The implementation must add no runtime dependency, external font/icon/image request, charting library, or unnecessary client data fetch. The circular goal visualization must use CSS/SVG already available to the platform. The dashboard must pass the existing production build and remain within the current route's first-load architecture; no performance regression requiring a new subsystem is authorized.

**Evidence:** package/lockfile zero diff, successful build, no-external-request E2E, and route artifact summary.

### R22 - Compatibility, migration, and rollback

The route and provider interface remain compatible with the existing Next.js App Router entrypoint. No API, database, environment, or persisted-data migration is allowed. Rollback must consist only of reverting this work item's scoped source/test/asset changes; the preserved sidebar and its prior approved work must not be rolled back.

**Evidence:** route render/build tests, zero migration/config diff, and scoped changed-file review.

### R23 - Visual-regression evidence

The Implementer must capture deterministic full-page screenshots for the four supported widths after fonts/assets settle, plus focused desktop evidence for the header, performance card, metric row, meals, calendar, workouts, and insights. The 1440 screenshot must be reviewed against `dashboard.png`; responsive screenshots verify faithful reflow rather than pixel identity to a desktop-only source.

**Evidence:** named Playwright screenshots under existing `test-results` conventions and geometry assertions that fail on material hierarchy/proportion drift.

### R24 - Derived: preserve repository boundaries and verification gates

**Derived from R1-R23.** Implementation must remain within the exact design file scope, use existing helpers and Lucide icons, and pass `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`, and `npm run build`. This adds no user-visible behavior; it is required by the existing repository harness to verify the approved requirements.

**Evidence:** changed-file audit and command outputs recorded in `progress/current.md` during implementation.

## Assumptions and non-blocking interpretations

- `dashboard.png` governs layout even where `dashboard.md` says sharp corners/no shadows; the screenshot visibly uses rounded cards and restrained shadows.
- FitCore product naming is adapted to `Avilo Fit`; the FitCore sidebar and profile card are ignored because R1 preserves the current Avilo sidebar.
- Reference values and names are demonstrative. Stable Avilo fixtures may use the visible reference values while adding truthful demo/safety labeling.
- The existing project font stack remains; downloading Manrope or adding a font package is not authorized.
- Header and row controls without an existing approved workflow remain accessible presentation-only controls. This prevents invented navigation, persistence, or APIs.

## Traceability to requested behavior

| Original request / acceptance intent | Requirements |
| --- | --- |
| Redesign the entire dashboard content from the supplied image | R2, R3, R4-R10, R23 |
| Preserve the sidebar exactly as currently implemented | R1, R15, R22 |
| Work only on the Dashboard screen; do not create destination screens | R1, R2, R22 |
| Use PNG as exact visual target, HTML/MD as support | R3, R23 and Source priority |
| Use the existing governed technology stack | R11, R21, R22, R24 |
| Match first, improve later | R3 and Scope |
| Map the reference to Avilo Fit and existing data contracts | R4, R7, R10, R11 |
| Responsive and robust states | R12-R15 |
| Accessibility and keyboard/focus | R16-R18 |
| Deterministic fixture/data mapping | R11, R19 |
| Health disclaimer and safety | R10, R19, R20 |
| Performance, rollback, and visual evidence | R21-R24 |

