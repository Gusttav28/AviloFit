# Dashboard FitCore Reference Redesign Tasks

## Execution gate

Do not execute these tasks until Gustavo approves this exact package and moves Notion item `3a506edf-7ca0-8182-b777-cf1adc355591` from `Defining` to `In Progress` on branch `develop`.

## Ordered implementation checklist

- [ ] **T1 - Establish implementation evidence and protect scope**  
  **Requirements:** R1, R22, R24  
  **Files:** modify `progress/current.md` only for implementation evidence.  
  Confirm `develop`, record the starting commit/status, record the approved spec paths, capture the current sidebar structure/geometry behavior, and list pre-existing worktree changes. Do not edit or overwrite unrelated changes. Verify `components/dashboard/contextual-utilities.tsx` has no task diff before proceeding.

- [ ] **T2 - Extend the typed deterministic dashboard model**  
  **Requirements:** R5-R11, R19-R22  
  **Files:** modify `features/dashboard/model.ts`, `features/dashboard/fixture-dashboard-provider.ts`, `features/dashboard/format.ts`, `tests/dashboard/model.test.ts`, `tests/dashboard/format.test.ts`.  
  Add the exact `FitCore*` types and six section-state keys from the design, populate one stable Avilo fixture, and add shared clamped progress/format behavior. Preserve existing exports and provider signature. Tests cover exact cardinalities/order, stable date membership, formatting, progress boundaries below 0/above 100, local asset paths, clone isolation, and absence of remote URLs/random/time dependencies. Depends on T1.

- [ ] **T3 - Vendor the two reference meal thumbnails locally**  
  **Requirements:** R7, R11, R19, R21  
  **Files:** create `public/dashboard/avocado-poached-egg.webp`, `public/dashboard/quinoa-chicken-bowl.webp`; modify `progress/current.md` with provenance/optimization evidence.  
  Download only the two source URLs embedded in `C:\Users\gustt\AviloFitUI\dashboard.html`, convert/optimize as WebP, strip unnecessary metadata, and confirm deterministic local rendering. Do not hotlink. If access or provenance is not acceptable, stop with `SPEC_CHANGE_REQUIRED`. Depends on T1.

- [ ] **T4 - Build the Avilo utility header**  
  **Requirements:** R2-R4, R11, R16-R18, R21  
  **Files:** create `components/dashboard/dashboard-topbar.tsx`; create/modify `tests/dashboard/fitcore-dashboard-sections.test.tsx`.  
  Implement the typed controlled search field, Avilo Fit label, Quick Add button, and calendar icon button with Lucide and native semantics. Verify typing remains local, accessible names/focus work, and activation causes no navigation/network/persistence. Depends on T2.

- [ ] **T5 - Build weekly performance and quick metrics**  
  **Requirements:** R3, R5, R6, R11, R16-R18, R21  
  **Files:** create `components/dashboard/weekly-performance.tsx`, `components/dashboard/quick-metrics.tsx`; modify `tests/dashboard/fitcore-dashboard-sections.test.tsx`.  
  Implement the SVG/CSS goal ring, points badge, inset metrics, four ordered quick cards, Lucide icon mapping, and semantic progress bars using one clamped calculation. Test visible/ARIA consistency, ordering, and reduced-motion-compatible final state. Depends on T2.

- [ ] **T6 - Build Today's Meals**  
  **Requirements:** R3, R7, R11, R16-R21  
  **Files:** create `components/dashboard/todays-meals.tsx`; modify `tests/dashboard/fitcore-dashboard-sections.test.tsx`.  
  Render the three ordered fixture rows with local thumbnails, explicit dimensions/alts, localized times/nutrition, edit controls, scheduled dinner state, suggestion, and presentation-only Log/Customize controls. Verify missing optional data is omitted and no control mutates or transmits data. Depends on T2-T3.

- [ ] **T7 - Build the calendar and event selector**  
  **Requirements:** R3, R8, R11, R15-R18  
  **Files:** create `components/dashboard/dashboard-calendar.tsx`; modify `tests/dashboard/fitcore-dashboard-sections.test.tsx`, `tests/dashboard/format.test.ts`.  
  Implement localized month/year, weekday/date grid, selected date, event dots/list, polite announcement, and bounded previous/next behavior. Test mouse and keyboard selection, disabled boundaries, `aria-current`, event updates, and invalid-date rejection. Depends on T2.

- [ ] **T8 - Build workout and Smart Insights cards**  
  **Requirements:** R3, R9-R11, R16-R21  
  **Files:** create `components/dashboard/workout-cards.tsx`, `components/dashboard/smart-insights.tsx`; modify `tests/dashboard/fitcore-dashboard-sections.test.tsx`, `tests/dashboard/health-and-ai-safety.test.tsx`.  
  Render two ordered workout cards and the dark insights card with semantic progress, demo heart-rate labeling, visible deterministic/non-medical disclaimer, and side-effect-free recovery-report control. Test prohibited health claims are absent and existing allergy safety remains green. Depends on T2.

- [ ] **T9 - Replace DashboardScreen composition and wire independent states**  
  **Requirements:** R1-R14, R16-R20, R22  
  **Files:** modify `components/dashboard/dashboard-screen.tsx`, `components/dashboard/section-state.tsx`, `tests/dashboard/dashboard-screen.test.tsx`.  
  Remove outgoing main-content imports/rendering and compose the new header/performance/metrics/lower columns under unchanged `DashboardShell`. Own controlled search, calendar selection, and section statuses in DashboardScreen. Parameterize loading/empty/error/retry tests for all six sections; verify retry isolation and preservation of search/date state. Assert outgoing daily strip, greeting, Summary, Activity, progress, history, and Ask Avilo are absent. Depends on T4-T8.

- [ ] **T10 - Implement reference-faithful and responsive styling**  
  **Requirements:** R1-R3, R12, R15-R18, R21, R23  
  **Files:** modify `app/globals.css`.  
  Add only `.fitcore-*` styles and responsive rules for the pale canvas, utility header, performance card, metric row, lower columns, meals, calendar, workouts, insights, states, and reduced motion. Preserve every `.utility-rail`/`.rail-*` rule and behavior. Use stable dimensions/aspect ratios, no viewport-scaled fonts, no decorative gradient/orbs, and no document overflow. Depends on T9.

- [ ] **T11 - Preserve and strengthen sidebar regression coverage**  
  **Requirements:** R1, R15-R18, R22-R24  
  **Files:** modify `tests/dashboard/navigation.test.tsx`, `e2e/dashboard.spec.ts`.  
  Keep unit assertions for the nine existing sidebar controls, brand/settings separation, icons, active Dashboard state, and shell composition. Add E2E evidence that the component remains fixed during desktop main scroll, responsive controls remain reachable, focus/hover expansion remains usable, and no FitCore sidebar/profile content appears. Confirm zero diff in `contextual-utilities.tsx`. Depends on T9-T10.

- [ ] **T12 - Replace dashboard E2E and visual-regression coverage**  
  **Requirements:** R2-R23  
  **Files:** modify `e2e/dashboard.spec.ts`.  
  Replace outgoing main-content assertions with role/order/content, section states, calendar interaction, no-op controls, local images, no external requests/storage/URL health data, keyboard focus, reduced motion, Axe, geometry, and horizontal-overflow coverage. Capture deterministic full-page screenshots at 1440x900, 1024x900, 768x900, and 360x800 plus focused desktop section evidence. Compare the 1440 result with `C:\Users\gustt\AviloFitUI\dashboard.png` for hierarchy, proportions, color, spacing, and card order. Depends on T9-T11.

- [ ] **T13 - Run complete verification and scope audit**  
  **Requirements:** R1-R24  
  **Files:** modify `progress/current.md` with exact evidence only.  
  Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`, and `npm run build`. Record exact pass/fail counts, route artifact summary, screenshot paths, Axe result, external-request result, and any environment-only rerun. Audit changed files against this spec; assert no diff to `components/dashboard/contextual-utilities.tsx`, package/lock/config/environment/migration files, provider signature, or other routes. Confirm every R1-R24 has test or inspection evidence and rollback is limited to this work item's files. Depends on T1-T12.

## Requirement-to-task traceability

| Requirement | Tasks |
| --- | --- |
| R1 | T1, T9, T10, T11, T13 |
| R2 | T4-T10, T12, T13 |
| R3 | T5-T10, T12 |
| R4 | T4, T9, T12 |
| R5 | T2, T5, T12 |
| R6 | T2, T5, T12 |
| R7 | T2, T3, T6, T12 |
| R8 | T2, T7, T9, T12 |
| R9 | T2, T8, T12 |
| R10 | T2, T8, T12 |
| R11 | T2-T9, T12 |
| R12 | T9, T10, T12 |
| R13 | T9, T12 |
| R14 | T9, T12 |
| R15 | T7, T10-T12 |
| R16 | T4-T12 |
| R17 | T4-T12 |
| R18 | T4-T12 |
| R19 | T2-T3, T6, T8-T9, T12-T13 |
| R20 | T2, T8-T9, T12-T13 |
| R21 | T2-T10, T12-T13 |
| R22 | T1, T9, T11, T13 |
| R23 | T10, T12-T13 |
| R24 | T1, T11-T13 |

## Final stop conditions

The Implementer must stop rather than improvise if any task requires a sidebar edit, another route/screen, new package or config, live API/storage, remote runtime asset, unapproved image substitution, public contract change, migration, unlisted file, or user-visible behavior not specified by R1-R24.
