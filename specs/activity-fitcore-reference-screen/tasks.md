# Activity FitCore Reference Screen Tasks

## Execution gate

Do not execute these tasks until Gustavo approves this exact package and moves Notion item `3a606edf-7ca0-8169-9be0-d993663c3a59` from `Defining` to `In Progress` on branch `develop`.

## Ordered implementation checklist

- [ ] **T1 - Establish evidence and protect the dirty worktree**  
  **Requirements:** R1-R3, R24-R25  
  **Files:** modify `progress/current.md` only.  
  Record the approved package, branch, starting revision/status, pre-existing changes, approved sidebar/dashboard baselines, and exact Activity scope. Confirm no conflicting Activity package exists and do not overwrite unrelated work. Depends on human approval.

- [ ] **T2 - Add the typed deterministic Activity model and provider**  
  **Requirements:** R6, R8-R16, R23-R25  
  **Files:** create `features/activity/model.ts`, `features/activity/activity-provider.ts`, `features/activity/fixture-activity-provider.ts`, `features/activity/format.ts`, `tests/activity/model.test.ts`, `tests/activity/format.test.ts`.  
  Implement the exact design types, fixed reference date, three period series, ordered collections, six section states, pure formatting/clamping, and structured-clone provider. Tests cover cardinality/order, exact reference values, fixed relative dates, progress boundaries, pace formatting, clone isolation, and absence of runtime time/random/remote URLs. Depends on T1.

- [ ] **T3 - Make the shared sidebar route-aware without redesigning it**  
  **Requirements:** R2-R3, R20-R25  
  **Files:** modify `components/dashboard/contextual-utilities.tsx`, `components/dashboard/dashboard-shell.tsx`, `components/dashboard/dashboard-screen.tsx`, `tests/dashboard/navigation.test.tsx`, `e2e/dashboard.spec.ts`.  
  Add the typed current-section contract, preserve every existing label/icon/group/profile/class, convert only Dashboard and Activity to route links, and keep other destinations as buttons. Verify Dashboard remains current on `/dashboard`, visual structure is unchanged, keyboard behavior remains intact, and existing dashboard content tests still pass. `dashboard-screen.tsx` receives no change beyond current-section wiring. Depends on T1.

- [ ] **T4 - Add the Activity route and screen composition**  
  **Requirements:** R1, R4, R16-R20, R24-R25  
  **Files:** create `app/activity/page.tsx`, `components/activity/activity-screen.tsx`, `tests/activity/activity-screen.test.tsx`.  
  Wire the server route to the fixture provider and compose the ordered Activity sections inside `DashboardShell currentSection="Activity"`. Own controlled search, selected period, section statuses, and isolated retry. Add initial route/shell/order/state tests. Depends on T2-T3.

- [ ] **T5 - Build the Activity topbar**  
  **Requirements:** R4-R5, R20-R22, R24  
  **Files:** create `components/activity/activity-topbar.tsx`; modify `tests/activity/activity-screen.test.tsx`.  
  Implement heading, controlled search, Quick Add, unread notification, and calendar controls with Lucide/native semantics. Verify typing/clearing, accessible names, unread semantics, focus, and no navigation/domain side effects. Depends on T4.

- [ ] **T6 - Build the ordered summary cards**  
  **Requirements:** R4, R6-R7, R16-R17, R20-R22  
  **Files:** create `components/activity/activity-summary-cards.tsx`; modify `tests/activity/activity-screen.test.tsx`.  
  Render the exact four non-interactive summary cards from typed data with icon mapping and text-complete trends. Verify order, values, semantics, non-navigation, and reduced-motion-compatible polish. Depends on T2, T4.

- [ ] **T7 - Build accessible Pace & Heart Rate analysis**  
  **Requirements:** R4, R8-R10, R16-R22, R24  
  **Files:** create `components/activity/pace-heart-rate.tsx`; modify `tests/activity/activity-screen.test.tsx`, `tests/activity/format.test.ts`.  
  Implement the segmented control, accessible responsive SVG, deterministic period series, legend, data summary, focus/hover tooltip, Escape/blur dismissal, and no-op Deep Analysis. Test pointer and keyboard equivalence, exact tooltip values, idempotence, sibling/search preservation, and no request/storage/URL changes. Depends on T2, T4.

- [ ] **T8 - Build Personal Records and Daily Trend**  
  **Requirements:** R4, R11, R14, R16-R18, R20-R22  
  **Files:** create `components/activity/personal-records.tsx`, `components/activity/daily-trend.tsx`; modify `tests/activity/activity-screen.test.tsx`.  
  Render exact ordered records with fixed-date labels, no-op achievements control, and Monday-Friday semantic trend bars with bounded values and non-color-only current-day semantics. Depends on T2, T4.

- [ ] **T9 - Build Recent Activity**  
  **Requirements:** R4, R12-R13, R16-R22, R24  
  **Files:** create `components/activity/recent-activity.tsx`; modify `tests/activity/activity-screen.test.tsx`.  
  Implement the semantic table, exact ordered rows and fields, named filter/overflow controls, and labeled contained mobile scroller. Verify no invented menu/filter/navigation/persistence and all essential data remains available at narrow widths. Depends on T2, T4.

- [ ] **T10 - Build the safely disclosed AI Performance Coach**  
  **Requirements:** R4, R15-R19, R21-R24  
  **Files:** create `components/activity/ai-performance-coach.tsx`, `tests/activity/health-ai-safety.test.tsx`; modify `tests/activity/activity-screen.test.tsx`.  
  Render the reference dark card, deterministic recommendation, explicit demo/general-wellness/non-medical disclosure, and no-op report control. Tests reject diagnosis, treatment, guaranteed outcomes, connected-health attribution, and live-AI claims. Depends on T2, T4.

- [ ] **T11 - Complete independent loading, empty, error, and retry coverage**  
  **Requirements:** R17-R19, R21-R22  
  **Files:** modify `components/activity/activity-screen.tsx`, `tests/activity/activity-screen.test.tsx`.  
  Parameterize all six sections through loading, empty, error, and retry. Verify reserved geometry hooks, announcements/alerts, section-specific copy, no fabricated values, ready-sibling isolation, and preservation of search/period/tooltip state. Depends on T5-T10.

- [ ] **T12 - Implement reference-faithful responsive styling**  
  **Requirements:** R2, R4-R15, R17-R22, R24  
  **Files:** modify `app/globals.css`.  
  Add only `.activity-*` rules for the reference canvas, topbar, cards, analytics, tooltip, records, table, trend, coach, state geometry, breakpoints, focus containment, and reduced motion. Preserve `.avilo-sidebar-*` and `.fitcore-*` visual declarations except a strictly necessary shared link reset that leaves computed appearance unchanged. No document overflow or viewport-scaled text. Depends on T3-T11.

- [ ] **T13 - Add Activity E2E, accessibility, privacy, and visual evidence**  
  **Requirements:** R1-R24  
  **Files:** create `e2e/activity.spec.ts`; modify `e2e/dashboard.spec.ts` only if shared link semantics require regression assertion updates.  
  Cover route navigation/current state, exact composition and cardinalities, local search/no-op controls, period switching, chart keyboard tooltip, section recovery, table scroller, keyboard path, touch targets, reduced motion, Axe, no external/API requests, no storage/URL health data, sidebar geometry, no overlap/overflow, and `/dashboard` regression. Capture full-page screenshots at 1440x900, 1024x900, 768x900, and 360x800 plus focused desktop evidence for topbar, tooltip, records, recent activity, trend, and coach. Compare 1440 evidence with `C:\Users\gustt\AviloFitUI\activity.png`. Depends on T12.

- [ ] **T14 - Run complete verification and scope audit**  
  **Requirements:** R1-R25  
  **Files:** modify `progress/current.md` with exact evidence only.  
  Run `npm run lint`, `npm run typecheck`, Activity/dashboard-focused Vitest, Activity/dashboard Playwright, and `npm run build`. Record exact pass/fail counts, route output, Axe results, request/storage/URL evidence, screenshot paths, and environment-only reruns. Audit every changed file against design, verify package/lock/config/environment/migration/API and `features/dashboard/*` have zero task diff, confirm no destination route except `/activity` was added, and map every R1-R25 to evidence. Depends on T1-T13.

## Requirement-to-task traceability

| Requirement | Tasks |
| --- | --- |
| R1 | T1, T4, T13-T14 |
| R2 | T1, T3, T12-T14 |
| R3 | T3-T4, T13-T14 |
| R4 | T4-T13 |
| R5 | T5, T12-T13 |
| R6 | T2, T6, T12-T13 |
| R7 | T6, T12-T13 |
| R8 | T2, T7, T12-T13 |
| R9 | T2, T4, T7, T13 |
| R10 | T2, T7, T12-T13 |
| R11 | T2, T8, T12-T13 |
| R12 | T2, T9, T12-T13 |
| R13 | T9, T13 |
| R14 | T2, T8, T12-T13 |
| R15 | T2, T10, T12-T13 |
| R16 | T2, T4, T6-T10, T14 |
| R17 | T4, T6, T8, T10-T13 |
| R18 | T4, T8, T10-T13 |
| R19 | T4, T10-T13 |
| R20 | T3-T13 |
| R21 | T3, T5, T7-T13 |
| R22 | T3, T5-T13 |
| R23 | T2, T5, T7, T9-T10, T13-T14 |
| R24 | T1-T5, T7, T9-T14 |
| R25 | T1-T14 |

## Final stop conditions

The Implementer must stop rather than improvise if any task requires another screen/route, sidebar visual redesign, dashboard content/data change, new dependency/config/asset, live API/AI/health permission/storage, migration, remote runtime resource, real personal data, unsupported source substitution, or a file outside the exact design scope.
