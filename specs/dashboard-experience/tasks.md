# Avilo Fit dashboard experience implementation tasks

## Execution contract

- Implement only after Gustavo changes the Notion item from `Defining` to `In Progress`.
- Work only on `feature/dashboard-experience` and one governed item in this session.
- Read `requirements.md` and `design.md` completely before T1.
- Create/update `progress/current.md` only under the Implementer contract; it is session evidence and is not part of this Spec Author package.
- Do not add an unlisted file, dependency, service, API, database, integration, route behavior, or product capability. Stop for a spec revision when a design stop condition is reached.

## Ordered task checklist

### T1 — Establish the bounded Next.js testable scaffold

**Depends on:** Human approval (`Status = In Progress`).

**Create:** `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/dashboard/page.tsx`.

**Action/outcome:** Establish the minimal approved Next.js/TypeScript/Tailwind/shadcn web package, strict typing, npm lock, lint/build/test scripts, root layout, `/dashboard` route, and root redirect. Add only the explicitly authorized runtime and verification dependencies. Do not configure any external service, analytics, remote image host, font service, secret, or environment variable.

**Requirements:** R2, R27-R30, R32.

**Evidence/tests:** Record dependency list and scripts; install succeeds; initial lint/typecheck/test/build commands are identifiable; repository scan shows no external SDK/config and root redirects to `/dashboard`.

### T2 — Build the semantic Avilo visual foundation

**Depends on:** T1.

**Create:** `app/globals.css`; approved primitives `components/ui/button.tsx`, `dialog.tsx`, `input.tsx`, `label.tsx`, `popover.tsx`, `progress.tsx`, `skeleton.tsx`, `table.tsx`, `tooltip.tsx`.

**Modify:** `app/layout.tsx`.

**Action/outcome:** Implement provisional semantic color tokens, four-level text hierarchy, 4px spacing basis, radius/border/focus/motion tokens, subtle depth strategy, inset controls, and accessible default styles. Forest green dominates; sage supports nutrition; orange and blue are sparse semantic accents. Use a local/system font stack and tabular numbers. Ensure generated primitives use the same tokens.

**Requirements:** R22-R25, R29.

**Evidence/tests:** Token-to-rendered-color audit; contrast checks; focus and reduced-motion inspection; no arbitrary component hex, gradient, external font request, or dramatic shadow.

### T3 — Define presentation-only models and deterministic providers

**Depends on:** T1.

**Create:** `features/dashboard/model.ts`, `features/dashboard/dashboard-provider.ts`, `features/dashboard/fixture-dashboard-provider.ts`, `features/dashboard/selectors.ts`, `features/dashboard/format.ts`, `tests/dashboard/model.test.ts`, `tests/dashboard/selectors.test.ts`, `tests/dashboard/format.test.ts`.

**Action/outcome:** Implement the discriminated section/access/status types, minimum dashboard view model, provider interfaces without HTTP signatures, synthetic fixtures for every approved state, pure date/range/pantry/grocery/context selectors, and centralized formatters. Fixture state must reset and remain isolated by date.

**Requirements:** R6-R18, R20-R21, R26-R31.

**Evidence/tests:** Unit tests cover every model state, future date boundary, no unknown-to-zero conversion, meal status vs completion, pantry qualification, missing-item export normalization, context availability, safety conflicts, two locales/currencies, and deterministic reset. Scan fixtures for real names, identifiers, credentials, or health data.

### T4 — Compose the responsive shell and adaptive navigation

**Depends on:** T2, T3.

**Create:** `components/dashboard/dashboard-screen.tsx`, `components/dashboard/dashboard-shell.tsx`, `components/dashboard/adaptive-navigation.tsx`, `components/dashboard/contextual-utilities.tsx`, `tests/dashboard/dashboard-screen.test.tsx`, `tests/dashboard/navigation.test.tsx`.

**Modify:** `app/dashboard/page.tsx`.

**Action/outcome:** Compose landmarks and the action-first responsive order; implement Today/Activity/Meals/Profile navigation with Today active; implement accessible icon-label behavior; provide contextual utility parity with an optional extra-wide rail. Non-dashboard destinations must not imply finished routes.

**Requirements:** R1-R5, R23-R26, R29.

**Evidence/tests:** Navigation names/current state/focus behavior, exact narrow semantic order, extra-wide utility visibility plus narrow action parity, no horizontal page overflow, and absence of financial labels.

### T5 — Implement the selected-day Fuel Thread and calendar

**Depends on:** T3, T4.

**Create:** `components/dashboard/day-strip.tsx`, `components/dashboard/calendar-dialog.tsx`, `components/dashboard/section-state.tsx`, `tests/dashboard/calendar.test.tsx`.

**Modify:** `components/dashboard/dashboard-screen.tsx`.

**Action/outcome:** Implement rounded day cards with circular markers and at most three prioritized signals, history/allowed-future navigation, shared selected-day state, accessible full calendar, and loading/empty/future/failure/retry states. Announce selection and preserve focus.

**Requirements:** R6-R9, R23-R26, R31.

**Evidence/tests:** Date synchronization across placeholder regions, card content limit, today/selected non-color cues, disabled future boundary, dialog focus trap/Escape/close/focus return, no unavailable-as-zero, and recovery fixtures.

### T6 — Implement meals, budget, pantry, and grocery export

**Depends on:** T3, T5.

**Create:** `components/dashboard/budget-editor.tsx`, `components/dashboard/recommendations-panel.tsx`, `components/dashboard/grocery-export.tsx`, `tests/dashboard/recommendations.test.tsx`.

**Modify:** `components/dashboard/dashboard-screen.tsx`.

**Action/outcome:** Build the recommendation-led primary surface, budget editor with cadence/validation/local-only disclosure, semantic desktop table and narrow cards, all meal occasions/statuses, nutrition/cost/pantry/missing fields, allergy conflict block, and provider-neutral missing-grocery export preview.

**Requirements:** R1-R2, R10-R14, R21, R23-R28, R30-R31.

**Evidence/tests:** Valid/invalid/cancel budget flows; complete field/occasion/status matrix; recommendation not conflated with completion; pantry qualification; only missing items exported with units/cost/disclaimer; no retailer claim; accessible desktop/narrow presentation.

### T7 — Implement nutrition, goal, and permissioned activity summaries

**Depends on:** T3, T5.

**Create:** `components/dashboard/nutrition-summary.tsx`, `components/dashboard/goal-progress.tsx`, `components/dashboard/activity-summary.tsx`, `tests/dashboard/health-and-ai-safety.test.tsx` (health/access portion).

**Modify:** `components/dashboard/dashboard-screen.tsx`.

**Action/outcome:** Render macro/calorie target/range/provenance states; all supported goal categories with neutral trends; steps, recorded heart/activity metrics, sleep, active calories, and workouts with source/freshness and explicit connection/access states. Do not request permission or allow observed-data editing.

**Requirements:** R6, R15-R18, R21, R23-R28, R30.

**Evidence/tests:** Complete/partial/missing/range/zero-target nutrition; every goal and insufficient data; activity complete/manual/stale/not-connected/denied/unavailable; safe heart/goal copy; no real data or permission prompt.

### T8 — Implement the Ask Avilo contextual signature

**Depends on:** T3, T6, T7.

**Create:** `components/dashboard/ask-avilo.tsx`.

**Modify:** `components/dashboard/dashboard-screen.tsx`, `tests/dashboard/health-and-ai-safety.test.tsx` (AI/context portion).

**Action/outcome:** Implement selected-day composer, cook/buy/prep/swap prompts, deterministic fixture response, available/missing/demo context chips with plain-language details, independent loading/error/retry, and safety/professional-boundary copy. Place it adjacent to recommendations on desktop and immediately after them on narrow layouts.

**Requirements:** R1-R2, R6, R19-R21, R23-R28, R31.

**Evidence/tests:** Empty prevention, example prompt, deterministic response, context variation, retry, allergy escalation, prohibited-claim scan, no network/persistence/log/URL leakage, responsive placement.

### T9 — Complete independent states and responsive/accessibility polish

**Depends on:** T4-T8.

**Modify:** `app/globals.css`, `components/dashboard/dashboard-screen.tsx`, `components/dashboard/dashboard-shell.tsx`, `components/dashboard/adaptive-navigation.tsx`, `components/dashboard/contextual-utilities.tsx`, `components/dashboard/day-strip.tsx`, `components/dashboard/calendar-dialog.tsx`, `components/dashboard/budget-editor.tsx`, `components/dashboard/recommendations-panel.tsx`, `components/dashboard/grocery-export.tsx`, `components/dashboard/nutrition-summary.tsx`, `components/dashboard/goal-progress.tsx`, `components/dashboard/activity-summary.tsx`, `components/dashboard/ask-avilo.tsx`, `components/dashboard/section-state.tsx`.

**Action/outcome:** Ensure every section has loading/success/empty/error/recovery; preserve layout with honest skeletons; finish 360/768/1024/1440 behavior; verify landmarks/headings/table/dialog/status semantics, keyboard order, touch targets, focus, contrast, non-color cues, and reduced motion.

**Requirements:** R1-R2, R22-R26, R29-R30.

**Evidence/tests:** State matrix; axe-equivalent scan with no serious/critical issues; keyboard walkthrough; grayscale/focus review; responsive screenshots; no section failure collapses the page.

### T10 — Add end-to-end dashboard verification

**Depends on:** T4-T9.

**Create:** `e2e/dashboard.spec.ts`.

**Action/outcome:** Verify the primary path at required viewports: arrive on dashboard, understand selected day, navigate history/allowed future, choose a day in calendar, inspect/edit budget, inspect meal/pantry/missing groceries, preview/export list, read nutrition/goal/activity source states, and ask Avilo. Include keyboard-only path and screenshots.

**Requirements:** R1-R30.

**Evidence/tests:** Passing E2E at 360, 768, 1024, and 1440; stable screenshots; no horizontal overflow; focus remains visible; browser network inspection shows no unexpected request/data egress.

### T11 — Final requirement and scope verification

**Depends on:** T1-T10.

**Modify:** Implementer-owned `progress/current.md` only, as allowed by the Implementer contract.

**Action/outcome:** Run the exact available lint, typecheck, unit/component, E2E, and production-build scripts from `package.json`; record commands/results. Record local accessibility and Lighthouse/Web Vitals baseline, viewport screenshots, changed-file list, and R1-R32 checklist. Inspect dependencies, network, URLs, logs, fixtures, and Git diff for privacy and unauthorized scope. Do not mark the Notion item complete; hand off to Reviewer through the Leader.

**Requirements:** R23-R32; verification coverage for R1-R22.

**Evidence/tests:** All checks green; every requirement linked to implementation and evidence; only design-listed product/test/config files plus Implementer progress evidence changed; no backend, database, native app, external integration, analytics, secrets, or unrelated cleanup.

## Dependency order

```text
Human approval
  -> T1
  -> T2 + T3
  -> T4
  -> T5
  -> T6 + T7
  -> T8
  -> T9
  -> T10
  -> T11
  -> Reviewer (Leader-coordinated)
```

T2 and T3 may be implemented sequentially within the one Implementer session; this plan does not authorize parallel agents or multiple work items.

## Requirement-to-task coverage

| Requirement | Tasks |
| --- | --- |
| R1 | T4, T6, T8-T10 |
| R2 | T4, T6, T8-T10 |
| R3 | T4, T9-T10 |
| R4 | T4, T9-T10 |
| R5 | T4, T9-T10 |
| R6 | T3, T5, T7-T10 |
| R7 | T3, T5, T9-T10 |
| R8 | T3, T5, T9-T10 |
| R9 | T3, T5, T9-T10 |
| R10 | T3, T6, T9-T10 |
| R11 | T3, T6, T9-T10 |
| R12 | T3, T6, T9-T10 |
| R13 | T3, T6, T9-T10 |
| R14 | T3, T6, T9-T10 |
| R15 | T3, T7, T9-T10 |
| R16 | T3, T7, T9-T10 |
| R17 | T3, T7, T9-T10 |
| R18 | T3, T7, T9-T10 |
| R19 | T3, T8-T10 |
| R20 | T3, T8-T10 |
| R21 | T3, T6-T10 |
| R22 | T2, T4, T9-T11 |
| R23 | T2, T4, T9-T11 |
| R24 | T2, T4, T9-T11 |
| R25 | T2, T4-T11 |
| R26 | T2, T4-T11 |
| R27 | T1, T3, T6-T8, T10-T11 |
| R28 | T1, T3, T6-T8, T10-T11 |
| R29 | T1, T3-T4, T9-T11 |
| R30 | T1, T3-T4, T9-T11 |
| R31 | T3, T5-T8, T11 |
| R32 | T3, T5-T8, T11 |

## Final stop rule

If any listed task cannot be completed without changing approved behavior, safety/privacy posture, architecture, dependency policy, or exact file scope, stop and document the gap. The Implementer must request a Spec Author revision and human approval; it must not invent a shortcut or implement a fake integration to pass a test.
