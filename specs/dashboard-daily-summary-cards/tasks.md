# Dashboard Daily Summary Cards Tasks

## Execution contract

- Implement only after Gustavo reviews all three files and changes Notion item `3a406edf-7ca0-81f8-ab04-e3b4927ade90` from `Defining` to `In Progress`.
- Work only on the existing `develop` branch and keep Notion's Branch value synchronized.
- Read `requirements.md` and `design.md` completely before T1. Do not edit this package during implementation without a new Spec Author revision.
- Modify, create, or delete only the files listed in `design.md`. Preserve the existing uncommitted static-utility-rail work in `app/globals.css` and `e2e/dashboard.spec.ts`.
- Stop with `SPEC_CHANGE_REQUIRED` if implementation needs a backend/API, persistence, dependency, route, unlisted file, expanded date range, restored account controls, changed synchronized-section scope, or other visible behavior not defined by R1-R15.

## Ordered checklist

### T1 - Record baseline and protect existing work

**Depends on:** Human approval; live status `In Progress`; checked-out branch `develop`.

**Modify:** `progress/current.md`.

**Action/outcome:** Record the approved package, work item, branch, existing dirty files, and the pre-existing fixed-utility-rail changes. Capture baseline screenshots and DOM geometry for the top bar, utility rail, hero, Summary, progress row, Ask Avilo, Activity, and history at 1440, 1024, 768, and 360. Record current test expectations that reference Home/account controls.

**Requirements:** R1-R2, R9-R10, R15.

**Evidence:** A reproducible baseline and explicit preservation note distinguish this feature from earlier user changes.

### T2 - Add date-keyed dashboard snapshot contracts and fixtures

**Depends on:** T1.

**Modify:** `features/dashboard/model.ts`, `features/dashboard/fixture-dashboard-provider.ts`, `tests/dashboard/model.test.ts`.

**Action/outcome:** Add the exact preview/snapshot interfaces and `referenceByDate`; align seven unique sorted dates to `2026-07-20` through `2026-07-26`; set initial selection to July 20; provide one snapshot per date; make at least two dates visibly distinct across Summary, all Activity metrics, and both progress cards; keep shared history rows/range and fixture exports internally consistent. Add D1, formatting-input, and clone-isolation model tests.

**Requirements:** R3-R6, R13-R15.

**Evidence:** Tests prove one-to-one keys, deterministic data, initial membership, unique order, populated/unavailable previews, distinct snapshots, and no provider mutation.

### T3 - Build the compact accessible card strip

**Depends on:** T2.

**Create:** `components/dashboard/daily-summary-cards.tsx`, `tests/dashboard/daily-summary-cards.test.tsx`.

**Action/outcome:** Implement the exact controlled component interface, hidden region heading, seven chronological native buttons, full accessible names, date/weekday/preview content, unavailable fallbacks, single selected semantics, local selected-card scrolling, and post-interaction polite announcement. Do not add arrows, dialogs, links, menus, fetching, or internal selected-date ownership.

**Requirements:** R2-R5, R10-R14.

**Evidence:** Component tests cover initial state, exact order/content, fallbacks, pointer/Enter/Space activation, final-wins rapid activation, focus retention, selected semantics, initial announcement suppression, later announcement, and local scroll invocation.

### T4 - Make history a controlled dashboard date consumer

**Depends on:** T2.

**Modify:** `components/dashboard/meal-workout-history.tsx`, `tests/dashboard/meal-workout-history.test.tsx`.

**Action/outcome:** Replace internal selected-date state with the exact controlled props. Enable dates only when they are in the history range and dashboard available-date set. Route date/week actions to `onSelectDate`; disable week navigation when its target date is unavailable. Preserve table structure, filtering, result announcements, empty state, date formatting, focus, and local table overflow.

**Requirements:** R6-R8, R11-R15.

**Evidence:** Tests prove external date updates, card-compatible callbacks from date/week controls, boundary disabling, populated/empty dates, focus retention, table semantics, and no independent stale selection.

### T5 - Replace the shell top bar and compose synchronized dashboard state

**Depends on:** T3-T4.

**Modify:** `components/dashboard/dashboard-shell.tsx`, `components/dashboard/dashboard-screen.tsx`, `tests/dashboard/dashboard-screen.test.tsx`, `tests/dashboard/navigation.test.tsx`, `tests/dashboard/health-and-ai-safety.test.tsx`.

**Delete:** `components/dashboard/adaptive-navigation.tsx`.

**Action/outcome:** Remove top-bar/account imports and markup; render the new strip before the hero; own and guard selected date in `DashboardScreen`; resolve one snapshot per render; pass synchronized values to Summary, Activity, progress, and controlled history; preserve section retry state and all static dashboard/utility behavior. Update tests to remove obsolete-control expectations and prove atomic updates, bidirectional history synchronization, unchanged static content, isolated section states, synthetic-data disclosures, and no unsafe behavior.

**Requirements:** R1-R9, R12-R15.

**Evidence:** Component tests show obsolete controls absent, one utility set present, one selected date across selectors, all daily values update together, static content remains, retry is isolated, and no health/privacy boundary expands.

### T6 - Implement reference-led and responsive styling

**Depends on:** T5.

**Modify:** `app/globals.css`.

**Action/outcome:** Add only the daily-summary selectors described in design; create stable compact white card proportions, circular date treatment, selected/focus states, equal desktop tracks, and narrow-screen local overflow. Remove only verified-unused top-bar/pill/action selectors. Preserve existing global tokens, fixed desktop utility rail, responsive static rail override, hero/grid/card geometry below, and current unrelated changes.

**Requirements:** R1-R3, R5, R9-R12, R15.

**Evidence:** CSS audit plus rendered measurements show no empty top-bar shell, nested card, layout-shifting selected state, utility-rail regression, clipping, overlap, or document overflow.

### T7 - Extend four-width browser verification

**Depends on:** T5-T6.

**Modify:** `e2e/dashboard.spec.ts`.

**Action/outcome:** Replace Home/account assertions and keyboard steps with daily-card assertions at 1440, 1024, 768, and 360. Verify seven-card order/content, initial semantics, pointer and keyboard selection, changed Summary/Activity/progress/history values, history-to-card synchronization, focus/live announcement, 44px targets, selected-card visibility, local-only overflow, unchanged dashboard composition, and fixed desktop utility rail after central scrolling. Monitor for external/API requests, run Axe without suppression, and capture full-page screenshots.

**Requirements:** R1-R15.

**Evidence:** Passing focused cases and screenshots at all four widths, geometry/overflow output, no interaction requests, and serious/critical accessibility results.

### T8 - Audit scope, privacy, compatibility, and rollback

**Depends on:** T2-T7.

**Modify:** `progress/current.md`.

**Action/outcome:** Inspect the diff for exact authorized files, preserved prior user edits, no dependency/config/route/API changes, no network/storage/logging/real-health-data behavior, no current-date/random logic, no duplicate selected-date owner, and no stale top-bar output. Confirm all unchanged files listed in design remain unchanged. Document rollback boundaries without reverting the pre-existing fixed utility rail.

**Requirements:** R1, R6-R9, R13-R15.

**Evidence:** Changed-file audit, invariant checklist, package/config comparison, and explicit privacy/health/rollback report.

### T9 - Run complete verification and prepare handoff

**Depends on:** T1-T8.

**Modify:** `progress/current.md`.

**Action/outcome:** Run `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run test`, `npm.cmd run build`, and `npm.cmd run test:e2e`; smoke-check `/dashboard`; record exact commands, exit codes, counts, route result, screenshot paths, and any pre-existing unrelated failures without suppressing them. Map every R1-R15 requirement to implementation and evidence, confirm no unauthorized scope, and hand back through the Leader for independent review. Do not commit, approve, or complete the work item.

**Requirements:** R1-R15.

**Evidence:** Complete reproducible transcript, route result, traceability matrix, and truthful final changed-file list.

## Dependency order

```text
Human approval and In Progress
  -> T1 baseline
  -> T2 model/fixtures
  -> T3 daily cards ----+
  -> T4 controlled history
  -> T5 synchronized composition
  -> T6 styles
  -> T7 browser verification
  -> T8 scope/privacy audit
  -> T9 full gates and handoff
  -> Leader routes independent Reviewer
```

## Requirement-to-task coverage

| Requirement | Tasks |
| --- | --- |
| R1 | T1, T5-T9 |
| R2 | T1, T3, T5-T7, T9 |
| R3 | T2-T3, T6-T7, T9 |
| R4 | T2-T3, T5, T7, T9 |
| R5 | T3, T5-T7, T9 |
| R6 | T2, T4-T5, T7-T9 |
| R7 | T4-T5, T7-T9 |
| R8 | T4-T5, T7-T9 |
| R9 | T1, T5-T9 |
| R10 | T1, T3, T6-T7, T9 |
| R11 | T3-T7, T9 |
| R12 | T3, T5-T7, T9 |
| R13 | T2-T5, T7-T9 |
| R14 | T2-T5, T7-T9 |
| R15 | T1-T9 |

## Final verification checklist

- [ ] Exactly seven chronological cards render before the hero and match the compact reference structure.
- [ ] Home, shortcut, notification, profile, and empty top-bar markup are absent.
- [ ] One selected date controls card semantics, Summary, Activity, progress, and history in both directions.
- [ ] Initial, populated alternate, unavailable-preview, and empty-history dates are verified.
- [ ] Existing section loading/empty/error/retry behavior remains independent.
- [ ] Fixed desktop and static responsive utility-rail behavior remains unchanged.
- [ ] 1440/1024 desktop fit and 768/360 local strip overflow are verified without document overflow.
- [ ] Keyboard, focus, live-region, target-size, selected-state, and Axe evidence passes.
- [ ] Data is deterministic, synthetic, in-memory, and produces no external/API request.
- [ ] No dependency, route, config, migration, persistence, telemetry, account workflow, or unauthorized file change exists.
- [ ] Lint, typecheck, unit, build, E2E, route smoke, diff audit, and R1-R15 traceability are recorded truthfully.
- [ ] Implementer has not self-approved, self-reviewed, committed, or marked the Notion item Completed.
