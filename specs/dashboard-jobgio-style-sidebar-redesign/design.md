# Dashboard Jobgio-Style Sidebar Redesign Design

## Design goals

This design satisfies R1-R16 by replacing only the current dashboard sidebar with a Jobgio-style AviloFit sidebar, preserving the approved FitCore dashboard content, and updating the shell spacing and verification needed to keep the fixed sidebar usable at supported viewports.

## Current-system observations

- `DashboardShell` renders `ContextualUtilities` before children inside `.dashboard-frame`.
- `ContextualUtilities` currently owns the sidebar items and brand text. It renders a hover-expanding `.utility-rail`, `.rail-brand`, `.rail-primary-panel`, `.rail-secondary`, `.rail-button`, and `.rail-label` structure.
- `app/globals.css` contains all sidebar positioning and visual rules. Current desktop rules place the rail at `left:2px`, make it expand on hover/focus, and switch to horizontal layouts at smaller breakpoints.
- `DashboardScreen` renders the approved FitCore main content in `<main id="main" className="fitcore-dashboard">`. It should not be structurally rewritten for this sidebar task.
- `features/dashboard/fixture-dashboard-provider.ts` and `features/dashboard/model.ts` contain deterministic fixture identity and dashboard values. They should be read only if the profile block needs existing identity data; new data contracts are not required unless no current identity can be safely mapped.
- `tests/dashboard/navigation.test.tsx` and `e2e/dashboard.spec.ts` currently assert the old sidebar behavior and must be updated to the new approved sidebar.
- Existing FitCore tests in `tests/dashboard/fitcore-dashboard-sections.test.tsx` and dashboard E2E assertions protect the main content and should remain functionally equivalent.

## Exact file scope

### Existing files expected to modify

- `components/dashboard/contextual-utilities.tsx`
- `app/globals.css`
- `tests/dashboard/navigation.test.tsx`
- `e2e/dashboard.spec.ts`
- `progress/current.md`

### Existing files allowed only if necessary

- `components/dashboard/dashboard-shell.tsx`: only if a wrapper class or landmark relationship is needed for the sidebar/content offset; no children order change.
- `features/dashboard/model.ts`: only if the current view model already has an identity object that must be typed for the sidebar profile block.
- `features/dashboard/fixture-dashboard-provider.ts`: only if the sidebar profile block needs deterministic demo identity added to the existing fixture model.
- `tests/dashboard/model.test.ts`: only if model/fixture identity is added.

### New files

No new source or test file is required. If the Implementer believes a new file is necessary, stop with `SPEC_CHANGE_REQUIRED`.

### Explicitly unchanged

- `components/dashboard/dashboard-screen.tsx`
- `components/dashboard/dashboard-topbar.tsx`
- `components/dashboard/weekly-performance.tsx`
- `components/dashboard/quick-metrics.tsx`
- `components/dashboard/todays-meals.tsx`
- `components/dashboard/dashboard-calendar.tsx`
- `components/dashboard/workout-cards.tsx`
- `components/dashboard/smart-insights.tsx`
- `components/dashboard/section-state.tsx`
- `features/dashboard/format.ts`
- `app/dashboard/page.tsx`
- `public/dashboard/*`
- `package.json`, lockfiles, framework configs, environment files, and assets outside the scoped dashboard sidebar/profile need.

If any explicitly unchanged file must be edited to satisfy the spec, implementation stops for a spec update.

## Component structure

`ContextualUtilities` remains the sidebar component but changes its rendered structure:

```text
aside.avilo-sidebar aria-label="Dashboard sidebar"
  div.avilo-sidebar-brand aria-label/visible text "AviloFit"
  nav.avilo-sidebar-nav aria-label="Dashboard sections"
    button.avilo-sidebar-item.active aria-current="page" Dashboard
    button.avilo-sidebar-item Activity
    button.avilo-sidebar-item Nutrition
    button.avilo-sidebar-item Meal Planner
    button.avilo-sidebar-item Course Release
    button.avilo-sidebar-item Progress
    button.avilo-sidebar-item Statistics
    button.avilo-sidebar-item Goals
  div.avilo-sidebar-footer
    button/link-like Settings, or separate settings row
    div.avilo-sidebar-profile
      avatar visual
      name
      secondary text
```

The exact DOM may keep existing class names only where helpful for test migration, but the design prefers a new `.avilo-sidebar-*` namespace. The old `.utility-rail` hover-expansion behavior must no longer control the sidebar.

## Navigation and icons

Use `lucide-react` icons already available in the project. The mapping should stay semantically close:

- Dashboard: `LayoutDashboard` or equivalent
- Activity: `Activity`
- Nutrition: `Apple` or utensils/nutrition icon
- Meal Planner: `CalendarCheck`
- Course Release: `GraduationCap`
- Progress: `TrendingUp`
- Statistics: `BarChart3`
- Goals: `Target`
- Settings: `Settings`

Icons are decorative inside labeled controls and should use `aria-hidden="true"`. Button accessible names come from visible text.

## Branding

The top brand area is text-only and renders `AviloFit`. Use split spans if needed: `Avilo` in `var(--ink)` and `Fit` in `var(--green-dark)`. Do not include a logo glyph unless an existing Avilo logo asset is already in the scoped component; do not create or import a new logo for this task. Brand text is visible on desktop and tablet. On the smallest mobile treatment, it may be reduced or moved only if navigation usability requires it.

## Profile block

The lower profile block should visually echo the reference: small circular avatar-like element, compact user name, secondary descriptor/email-like text, and optional tiny status/badge element. Prefer existing deterministic fixture identity if available. If the fixture does not expose a safe identity, use the existing demo identity already visible in the dashboard provider. The avatar should be CSS-generated initials or an existing local fixture image; no remote image is allowed.

The profile block is non-interactive unless the current sidebar already has a profile action that can be safely mapped. If non-interactive, do not render it as a button.

## Layout and CSS

Add or replace sidebar CSS in `app/globals.css`:

- Desktop sidebar:
  - fixed or sticky fixed-like left rail;
  - white background;
  - rounded right-side/outer corners following the reference;
  - slim width sufficient for icon plus label, approximately 110-150px;
  - vertical padding, top brand spacing, compact nav row gaps, footer pinned lower with `margin-top:auto`;
  - shadow/border subtle enough to sit on the pale dashboard canvas.
- Active Dashboard row:
  - dark near-black/green-black pill;
  - white text;
  - circular light icon chip or clear icon treatment matching the reference.
- Inactive rows:
  - muted text and icon;
  - hover/focus background that remains quiet and accessible;
  - no green selected circles from the prior rail.
- Main content offset:
  - update `.fitcore-dashboard` desktop margin/max-width and any `.dashboard-frame` padding so content starts to the right of the sidebar with a comfortable gap;
  - preserve the recently removed outer frame behavior: `.fitcore-dashboard` remains transparent and the shell canvas remains the pale dashboard background.
- Responsive:
  - above 900px: vertical sidebar with visible labels and profile block;
  - 768-900px: either narrower vertical sidebar with labels if it fits, or compact horizontal rail before content;
  - 360px: no horizontal document overflow; labels may be hidden in nav controls only if accessible names remain and controls stay at least 44px.

Do not use viewport-scaled font sizes, decorative gradients/orbs, external fonts, or nested decorative cards.

## State and interactions

- Sidebar buttons are presentation-only for this task.
- Dashboard active item exposes `aria-current="page"`.
- Hover may add subtle row background but must not expand the sidebar or reveal essential labels.
- Focus uses the existing global `:focus-visible` treatment or a scoped equivalent with visible outline and no clipping.
- Scroll behavior: the sidebar remains fixed/visible while the main dashboard scrolls.
- No sidebar action may mutate dashboard fixture values, selected calendar date, search text, route, storage, or network state.

## Accessibility

- Use a clear landmark: either `<aside aria-label="Dashboard sidebar">` containing `<nav aria-label="Dashboard sections">`, or `<nav aria-label="Dashboard sidebar">` when no separate aside is used. The preferred structure is `aside` plus inner `nav`.
- All controls have visible text on desktop and accessible names at every breakpoint.
- The active item uses `aria-current="page"`, not only color.
- Decorative icons and avatar styling are hidden from assistive tech unless meaningful.
- Profile text is read as text, not a control, unless intentionally interactive.
- The component must pass Axe with no serious/critical new issues.

## Security, privacy, health safety

The sidebar does not render health/nutrition/activity metrics. It may render only deterministic demo profile identity. It must not access credentials, environment variables, storage, URLs, real profile APIs, or remote assets. Existing health/safety copy in the FitCore content must remain unchanged.

## Testing and verification design

Update `tests/dashboard/navigation.test.tsx` to assert:

- AviloFit brand appears and Jobgio does not.
- The primary nav contains Dashboard, Activity, Nutrition, Meal Planner, Course Release, Progress, Statistics, and Goals.
- Dashboard has `aria-current="page"`.
- Settings is separated from the primary nav.
- The profile block renders deterministic safe identity.
- Old hover rail affordances or old class expectations are removed only if replaced by new sidebar expectations.

Update `e2e/dashboard.spec.ts` to assert:

- sidebar fixed geometry remains stable before/after scroll at desktop;
- sidebar does not expand on hover;
- no main content overlap at 1440, 1024, 768, and 360 widths;
- no document-level horizontal overflow;
- all sidebar controls are reachable by keyboard;
- Jobgio labels are absent and AviloFit is present;
- key FitCore content still renders unchanged;
- no external requests occur;
- screenshots are captured for visual review.

Run existing dashboard-focused Vitest and Playwright suites, plus `typecheck`, `lint`, and `build`.

## Alternatives considered

### Keep the current hover-expanding rail and only restyle colors

Rejected because the reference is a stable icon-label sidebar, and Gustavo explicitly asked for the sidebar in the screenshot.

### Copy Jobgio labels and logo

Rejected because Gustavo explicitly asked to remove Jobgio branding and replace it with AviloFit, and Avilo dashboard semantics already exist.

### Add a fully routed app shell

Rejected because the task is a visual/sidebar redesign only and destination screens are out of scope.

### Add an image avatar from the web

Rejected because the repository currently uses deterministic local presentation and the sidebar must not introduce external requests or real profile data.

### Rewrite `DashboardScreen` layout

Rejected because the approved FitCore dashboard content must remain unchanged except for sidebar-driven spacing.

## Requirement-to-design mapping

| Requirement | Design coverage |
| --- | --- |
| R1 | Component structure; layout and CSS; state/interactions |
| R2 | Branding |
| R3 | Navigation and icons |
| R4 | Navigation row treatment; CSS |
| R5 | Component structure; testing |
| R6 | Profile block |
| R7 | Exact file scope; explicitly unchanged files |
| R8 | Layout and CSS; E2E geometry |
| R9 | Responsive layout |
| R10 | State/interactions; accessibility; E2E |
| R11 | Accessibility |
| R12 | CSS; accessibility; verification |
| R13 | Security/privacy; exact file scope |
| R14 | Security/privacy; unchanged dashboard content |
| R15 | Testing and verification |
| R16 | Exact file scope; verification design |

## Implementation stop conditions

Stop with `SPEC_CHANGE_REQUIRED` if satisfying the task requires editing approved dashboard content components, adding routes, adding dependencies/config/assets, using remote images/fonts, exposing real user/profile data, adding persistence/network behavior, or modifying files outside the allowed scope.
