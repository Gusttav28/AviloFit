# Dashboard Meal Recipe and Workout History Tasks

## Execution contract

- Implement only after Gustavo reviews all three files and changes Master Work item `3a006edf-7ca0-8149-ad04-f0090bcaf9f5` from `Defining` to `In Progress`.
- Work only on the existing `feature/dashboard-experience` branch and keep Notion's Branch value synchronized.
- Read `requirements.md` and `design.md` completely before T1. Preserve this specification package unchanged unless a new Spec Author revision is requested.
- Modify or create only the files explicitly listed in `design.md`. Do not add dependencies, services, routes, persistence, real data, health claims, purchase behavior, unrelated contrast changes, or cleanup.
- Stop with `SPEC_CHANGE_REQUIRED` if implementation needs an unlisted file, changed visible behavior, expanded data contract, backend/API, dependency, new workflow, or exception to an R1-R15 invariant.

## Ordered checklist

### T1 - Capture the approved baseline and current geometry

**Depends on:** Human approval; live status `In Progress`; exact branch confirmed.

**Modify:** `progress/current.md` only.

**Action/outcome:** Record the approved package, work item, branch, existing all-untracked Git limitation, known pre-existing contrast finding, and available package commands. Before product edits, capture DOM order and x/y/width/height for hero, `.reference-grid`, `.dashboard-left-column`, `.summary-column`, `.progress-row`, `.activity-column`, and all existing Summary/Activity/progress cards at 1440, 1024, 768, and 360. Capture baseline screenshots. Do not modify or normalize unrelated files.

**Requirements:** R1, R10, R15.

**Evidence:** Durable baseline tables/screenshots and truthful repository-state notes allow the Reviewer to distinguish this feature's geometry from existing conditions.

### T2 - Extend the deterministic model, fixture, state, and formatters

**Depends on:** T1.

**Modify:** `features/dashboard/model.ts`, `features/dashboard/fixture-dashboard-provider.ts`, `features/dashboard/format.ts`, `tests/dashboard/model.test.ts`, `tests/dashboard/format.test.ts`.

**Action/outcome:** Add the exact history interfaces, `DashboardReferenceData.history`, `DashboardSectionName = ... | "history"`, ready section state, aligned range, initial selection, five exact R8 fixture rows, and shared numeric month/year and signed-calorie formatters. Preserve structured-clone isolation and all existing model fields/formatters.

**Requirements:** R3-R5, R8, R9, R13-R15.

**Evidence:** Unit tests prove exact values/order, unique IDs, ISO dates, sign/price/range invariants, clone isolation, `07 / 2026`, explicit +/- calorie output, locale/time-zone stability, and no regression in existing formatters.

### T3 - Build the accessible history panel component

**Depends on:** T2.

**Create:** `components/dashboard/meal-workout-history.tsx`, `tests/dashboard/meal-workout-history.test.tsx`.

**Modify:** `tests/dashboard/health-and-ai-safety.test.tsx`.

**Action/outcome:** Implement the exact public component signature, UTC-noon date-only week helpers, local selected-date state, +/-7-day arrow navigation, disabled boundaries, seven native date buttons, exact title/subtitle, polite result announcement, date-level empty state, semantic four-column table, explicit signed Value lines, locale Price cells, and concise deterministic-demo provenance. Use only existing Lucide icons, `Table`, formatters, and tokens; create no row actions or workflow.

**Requirements:** R2, R4-R8, R10-R14.

**Evidence:** Component tests verify initial and additional rows, header/date order, cross-month navigation, both arrow directions, boundary disabling, populated/empty/disabled selection, focus retention, Enter/Space activation, exact table semantics, live status/caption, no extra columns/actions, and safe demo-only language.

### T4 - Compose the right dashboard column and independent state

**Depends on:** T2, T3.

**Modify:** `components/dashboard/dashboard-screen.tsx`, `tests/dashboard/dashboard-screen.test.tsx`.

**Action/outcome:** Add the transparent `.dashboard-right-column` as the second grid child, keep the existing Activity section/state first, and render the history section/state second through the existing `section()` helper. Pass `model.reference.history`, `locale`, `currency`, and `timeZone`. Extend screen tests to prove ownership/order, one panel instance, exact title/subtitle, preserved left content, and independent loading/empty/error/retry behavior for history without changing sibling states.

**Requirements:** R1-R3, R9, R12-R15.

**Evidence:** DOM and state tests show left/right wrapper order, Activity-first/history-second order, no nesting in Activity/progress, preserved existing labels, all four section modes, and isolated retry.

### T5 - Add token-driven panel, selector, table, and responsive styles

**Depends on:** T3, T4.

**Modify:** `app/globals.css`.

**Action/outcome:** Add only the selectors defined in `design.md`: transparent right wrapper, standalone white panel, compact header, stable month/arrow row, seven equal date tracks, soft green selected vertical pill, semantic compact table, signed Value layout, status/disclosure, visible focus, and local 360px table overflow. Preserve all existing tokens, Activity shell styles, grid tracks, breakpoints, colors, and existing geometry above the insertion point. Do not create nested cards, fixed-height content, transforms that shift layout, hidden columns, or page overflow.

**Requirements:** R1-R2, R4, R7-R12, R14-R15.

**Evidence:** CSS inspection shows token reuse and scoped selectors; component tests remain green; browser measurements/screenshots in T6 prove rendered behavior.

### T6 - Extend four-width rendered verification

**Depends on:** T4, T5.

**Modify:** `e2e/dashboard.spec.ts`.

**Action/outcome:** Add a focused history-panel scenario at exactly 1440, 1024, 768, and 360. Compare existing baseline boxes within 1px; assert wrapper/panel placement and 16px gap; verify exact initial rows and prices; select populated and empty dates; navigate weeks; exercise native keyboard controls; inspect selected/non-color semantics; assert local table overflow only at 360; assert document/panel containment, focus-ring containment, no overlap, and no page horizontal scroll. Capture full-page screenshots. Extend, but do not suppress or weaken, existing Axe coverage.

**Requirements:** R1-R2, R4-R12, R14-R15.

**Evidence:** Four focused browser cases and screenshots report geometry, DOM order, interaction, overflow, and accessibility results at every required width.

### T7 - Verify safety, scope, and architectural boundaries

**Depends on:** T2-T6.

**Modify:** `progress/current.md` only.

**Action/outcome:** Inspect the implementation for network/storage/AI/connected-health/medical/billing/purchase behavior, random or current-date defaults, non-token colors, nested cards, new dependencies, unlisted files, and mutation of provider data. Confirm `app/dashboard/page.tsx`, existing Activity/Progress/SectionState/Table components, manifests, lockfile, config, and prior specs remain unchanged.

**Requirements:** R2-R3, R6-R8, R13-R15.

**Evidence:** Handoff contains a changed-file list, invariant checklist, manifest/config comparison, and explicit confirmation that data is synthetic and in-memory only.

### T8 - Run the complete repository verification gates

**Depends on:** T6, T7.

**Modify:** `progress/current.md` only.

**Action/outcome:** Run the documented commands from repository root: `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run test`, `npm.cmd run build`, and `npm.cmd run test:e2e`. Smoke-check `/dashboard` through the documented Playwright web server or a temporary local dev server if required. Record exact commands, exit codes, counts, route result, and failures. Report the known pre-existing Axe contrast and Git-baseline conditions separately; do not waive, suppress, or misattribute a red gate.

**Requirements:** R1-R15.

**Evidence:** Durable command transcript and route result are complete and truthful. Any regression caused by this feature is resolved within scope or returned as `SPEC_CHANGE_REQUIRED`; unrelated blockers are handed to the Leader.

### T9 - Complete traceability and Implementer handoff

**Depends on:** T1-T8 all complete with no unresolved feature-caused failure.

**Modify:** `progress/current.md` only.

**Action/outcome:** Map every R1-R15 requirement to implementation files, unit/component/browser evidence, screenshot paths, and command results. Re-check that only authorized files changed and all exact R8 content is present. Return the durable Implementer status through the Leader for independent review; do not change Notion to Completed and do not self-review.

**Requirements:** R1-R15.

**Evidence:** Final handoff has no unmapped requirement/task, names all deviations or blockers, and gives the Reviewer enough evidence to reproduce the result.

## Dependency order

```text
Human approval and In Progress
  -> T1 baseline
  -> T2 model/fixture/formatters
  -> T3 component
  -> T4 composition/state
  -> T5 styles
  -> T6 browser verification
  -> T7 scope/safety audit
  -> T8 full command gates
  -> T9 traceable handoff
  -> Leader routes independent Reviewer
```

## Requirement-to-task coverage

| Requirement | Tasks |
| --- | --- |
| R1 | T1, T4-T6, T8-T9 |
| R2 | T3, T5-T9 |
| R3 | T2, T4, T7-T9 |
| R4 | T2-T3, T5-T6, T8-T9 |
| R5 | T2-T3, T6, T8-T9 |
| R6 | T3, T6-T9 |
| R7 | T3, T5-T6, T8-T9 |
| R8 | T2-T3, T6-T9 |
| R9 | T2, T4, T6, T8-T9 |
| R10 | T1, T3, T5-T6, T8-T9 |
| R11 | T3, T5-T6, T8-T9 |
| R12 | T3-T6, T8-T9 |
| R13 | T2-T3, T7-T9 |
| R14 | T2-T3, T5-T6, T8-T9 |
| R15 | T1-T9 |

## Final verification checklist

- [ ] All R1-R15 behaviors have implementation and evidence.
- [ ] Initial selected date, week, exact two rows, signs, labels, and prices match R8.
- [ ] Activity remains content-height and existing dashboard boxes preserve the captured baseline within 1px.
- [ ] Loading, section empty, error/retry, and date-level empty states are distinct and verified.
- [ ] Keyboard, screen-reader, focus, table semantics, and local 360px overflow are verified.
- [ ] 1440/1024/768/360 screenshots and geometry/overflow results exist.
- [ ] No backend, persistence, AI, real data, health claim, purchase/billing path, dependency, nested card, token change, or unauthorized file exists.
- [ ] Lint, typecheck, unit, build, E2E, route smoke, changed-file inspection, and known unrelated blockers are reported truthfully.
- [ ] The Implementer has not approved, reviewed, committed, or completed the work item.
