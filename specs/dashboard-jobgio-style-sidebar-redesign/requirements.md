# Dashboard Jobgio-Style Sidebar Redesign Requirements

## Work-item identity

- **Notion work item:** `3a606edf-7ca0-8139-94de-d77651547a33` - Redesign dashboard sidebar from Jobgio-style reference with AviloFit branding
- **Notion URL:** https://app.notion.com/p/3a606edf7ca0813994ded77651547a33
- **Parent Epic:** `39006edf-7ca0-81b1-b3e3-e9981eb7c4f9` - Design the first six core user screens
- **Outcome ancestor:** `39006edf-7ca0-81c4-985e-f5d4ef795328` - Complete the Avilo visual identity
- **Branch:** `develop`
- **Reference image:** `C:\Users\gustt\AppData\Local\Temp\codex-clipboard-3f79af95-af79-4f12-ac34-ad8c8dfeda7f.png`

## Problem and outcome

The current Avilo Fit dashboard sidebar is an expanding pill rail created during earlier dashboard iteration. Gustavo now wants the dashboard sidebar redesigned to follow the supplied Jobgio-style reference: a slim white rounded vertical sidebar with a top brand area, icon-plus-label navigation rows, a dark active Dashboard pill, muted inactive rows, and a lower user/profile identity block. The reference brand must be replaced with AviloFit, and the already-approved dashboard content must remain unchanged except for spacing adjustments required so it no longer collides with the new fixed sidebar.

## Scope

### In scope

- `/dashboard` sidebar structure, branding, labels, icons, active state, profile block, fixed positioning, responsive behavior, and content offset.
- Sidebar-specific accessibility, keyboard, focus, visual regression, and responsive verification.
- Dashboard-shell/main-content spacing adjustments required by the new sidebar width.
- Updating existing sidebar/navigation tests and dashboard E2E coverage to match the new approved sidebar.

### Out of scope

- Rebuilding, restyling, reordering, or replacing the approved FitCore dashboard content.
- Creating destination screens or route navigation for sidebar items.
- Adding live authentication, profile APIs, messages, notifications, analytics, persistence, database/schema changes, or user-uploaded avatars.
- Importing Jobgio branding, the Jobgio logo, Jobgio labels, or any proprietary brand asset from the reference.
- New dependencies, package/config changes, remote images, external fonts, or network requests.
- Completing the work item or launching implementation before human approval.

## Definitions

- **Jobgio-style sidebar:** The visual pattern in the reference image: tall white rail, rounded outer corners, compact brand area, stacked icon-label rows, dark active pill, muted inactive rows, bottom profile identity block.
- **AviloFit brand area:** Text-only top brand treatment that says `AviloFit`; it must not include the Jobgio wordmark or logo. `Avilo` may be black/near-black and `Fit` dark Avilo green.
- **Sidebar navigation item:** A button-like row with a Lucide icon, visible label, accessible name, and optional active state. It does not perform route changes in this task.
- **Profile block:** A lower user identity area modeled after the reference, using deterministic existing fixture identity where available and a local CSS/avatar treatment that does not require external data.
- **Approved dashboard content:** The current FitCore-style main content implemented under the prior dashboard specification.

## Requirements

### R1 - Replace the current rail with the Jobgio-style sidebar

On `/dashboard`, the current hover-expanding pill rail must be replaced with a fixed, slim, white, rounded vertical sidebar that visually follows the supplied reference. The sidebar must sit along the left side of the viewport, remain visible during page scroll, and present a stable non-hover layout rather than expanding on hover.

**Evidence:** desktop screenshot at 1440px; Playwright geometry showing fixed position before and after scroll; no hover expansion width change.

### R2 - Use AviloFit branding and remove Jobgio branding

The top brand area must display `AviloFit` and must not render `Jobgio`, the Jobgio logo, or any Jobgio-specific asset. The brand area must remain visually separated from the navigation list, with `Avilo` black/near-black and `Fit` dark green when split styling is practical.

**Evidence:** role/text assertions for `AviloFit`; negative assertions for `Jobgio`; visual screenshot of the top brand area.

### R3 - Preserve Avilo dashboard navigation semantics

The sidebar must use Avilo dashboard nav items where possible: Dashboard, Activity, Nutrition, Meal Planner, Course Release, Progress, Statistics, Goals, and Settings. Dashboard must remain the active current page. No Jobgio labels such as Jobs, Applications, Companies, Users, Categories, or Reports may appear.

**Evidence:** unit and E2E assertions for all Avilo labels; negative assertions for Jobgio labels.

### R4 - Match the reference navigation row treatment

Each navigation item must render as an icon plus visible label in a compact vertical list. Dashboard must appear as a dark rounded active pill with light text and icon. Inactive items must be low-contrast but readable, with neutral icon containers or icon treatment matching the reference. Row spacing must be tighter and more practical than the previous expanded rail.

**Evidence:** screenshot review; computed active background/foreground assertions; row count and spacing geometry.

### R5 - Keep Settings visually separated

Settings must appear outside the primary navigation group, visually lower or separated by spacing/divider consistent with the reference and current Avilo intent. Settings must remain a sidebar action with an accessible name and icon.

**Evidence:** DOM/role assertions that Settings is not inside the primary navigation group; screenshot showing separation.

### R6 - Add a lower profile identity block

The sidebar must include a lower user/profile block modeled after the reference. It must show deterministic profile identity from existing dashboard fixture data when available; otherwise it may use the stable existing approved demo identity. The block must include an avatar-like visual, user name, and secondary text such as email/member descriptor only if already available or safely synthetic. It must not fetch remote images or expose real personal data.

**Evidence:** content assertions for the deterministic profile block; no external request capture; privacy/source inspection.

### R7 - Do not alter approved dashboard content

The FitCore dashboard content after the sidebar must remain the same: topbar, weekly performance, quick metrics, meals, calendar, workouts, and smart insights. Only the left offset, available width, or shell spacing may change to accommodate the new sidebar. Existing content labels, order, fixture values, local meal images, controls, and safety copy must not be intentionally changed.

**Evidence:** existing dashboard content tests remain green; E2E assertions for key FitCore sections and counts; changed-file review focused on sidebar/shell/CSS/test/progress only during implementation.

### R8 - Prevent overlap and horizontal overflow

At supported widths, the fixed sidebar must not overlap the main dashboard content, and the page must not introduce document-level horizontal scrolling. Desktop content must reserve enough left space for the sidebar. Tablet and mobile must use a responsive treatment that keeps sidebar actions reachable and content readable.

**Evidence:** Playwright geometry at 1440x900, 1024x900, 768x900, and 360x800; document `scrollWidth <= clientWidth`.

### R9 - Responsive behavior

At desktop widths, the sidebar must remain a vertical left rail similar to the reference. At tablet/mobile widths, it may become a compact horizontal or scrollable top/bottom rail only if a fixed vertical rail would make the dashboard unusable; labels may be visually hidden on the smallest width only when accessible names remain. The brand and profile block may be simplified on mobile but must not disappear from desktop.

**Evidence:** screenshots at 1440, 1024, 768, and 360; role assertions that navigation remains reachable at each width.

### R10 - Keyboard and focus behavior

Every sidebar item must be keyboard reachable in DOM order, use native button semantics, and display the existing visible focus treatment without clipping. The active Dashboard item must not trap focus. Tab order should move through the sidebar predictably before or alongside the main content.

**Evidence:** Playwright keyboard traversal through all sidebar items; focus ring visibility screenshot or computed outline assertions.

### R11 - Semantic accessibility

The sidebar must be exposed as a complementary landmark or navigation landmark with clear labels. The primary nav group must be a `nav` region. Dashboard must expose `aria-current="page"`. Decorative icons must be hidden from assistive technology when their button has a label. The profile block must not be announced as a button unless it is interactive.

**Evidence:** Testing Library role/name assertions and Axe scan with no serious/critical violations introduced by this redesign.

### R12 - Touch target, contrast, and reduced motion

Sidebar controls must meet 44x44 CSS-pixel touch target guidance where practical, maintain WCAG AA contrast for text and focus states, and not require motion or hover to reveal essential desktop labels. Any transition used for hover/active polish must respect `prefers-reduced-motion`.

**Evidence:** computed target-size checks; visual/contrast review; reduced-motion CSS inspection or E2E.

### R13 - No new data, network, or dependency surface

The redesign must not add dependencies, package/lockfile changes, network requests, external images, external fonts, live profile APIs, local storage, analytics, or secret/environment use. Any avatar must be local CSS or existing local fixture asset.

**Evidence:** package/config diff review; Playwright request capture; source inspection.

### R14 - Preserve health-data and privacy boundaries

The sidebar must not reveal additional health, nutrition, activity, or private account data. It may show deterministic demo user identity only. The existing dashboard health disclaimer and safety tests must not be weakened.

**Evidence:** source/content scan; existing health/AI safety tests remain green.

### R15 - Visual regression evidence

Implementation must produce deterministic screenshots covering the new sidebar at desktop, tablet, and mobile sizes, plus a focused desktop screenshot of the brand/nav/profile structure. The desktop screenshot must be reviewed against the supplied Jobgio-style image for structural fidelity while verifying AviloFit branding replacement.

**Evidence:** named Playwright screenshots under existing test-results conventions and reviewer visual notes.

### R16 - Derived: keep implementation within explicit file boundaries

**Derived from R1-R15.** Implementation must remain within the exact file scope defined in `design.md`, use existing React/TypeScript/CSS/Lucide patterns, and pass `npm run lint`, `npm run typecheck`, focused dashboard Vitest, dashboard E2E, and `npm run build`. This adds no user-visible behavior; it is required to verify the approved sidebar requirements.

**Evidence:** changed-file audit and command outputs recorded during implementation.

## Assumptions and non-blocking interpretations

- The reference screenshot is vertically narrow and low resolution; structure, hierarchy, active state, and proportions matter more than pixel-perfect icon glyphs.
- `AviloFit` is the requested brand text. If the existing product later standardizes on `Avilo Fit` with a space, that should be a separate human decision.
- The profile identity may use deterministic fixture/demo data because no real signed-in user data exists in this dashboard slice.
- Sidebar buttons remain presentation-only in this task because destination screens and routing behavior are not requested.

## Traceability to requested behavior

| Original request / acceptance intent | Requirements |
| --- | --- |
| Redesign the sidebar to match the supplied Jobgio-style reference | R1, R4, R15 |
| Remove Jobgio name/logo and place AviloFit there instead | R2 |
| Preserve existing Avilo dashboard nav semantics | R3, R5 |
| Keep the already-approved dashboard content unless spacing is required | R7, R8 |
| Include profile/user identity block from the reference | R6, R13, R14 |
| Make it practical across desktop and mobile | R8, R9, R12 |
| Ensure keyboard, focus, and accessibility | R10, R11, R12 |
| Avoid new dependencies, data exposure, or network behavior | R13, R14, R16 |
| Provide verifiable screenshots/tests | R15, R16 |
