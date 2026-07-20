# Dashboard reference redesign tasks

## Execution contract

- Implement only after Gustavo reviews this package and changes the Notion work item from `Defining` to `In Progress`.
- Work only on `feature/dashboard-experience`.
- Read `requirements.md` and `design.md` completely before T1.
- Do not create or edit application files outside the design file scope.
- Do not add dependencies, secrets, services, backend calls, persistence, or unrelated cleanup.
- Preserve the three Spec Author files unchanged during implementation unless a new Spec Author revision is requested.

## Ordered task checklist

### T1 - Confirm baseline and screenshot target

**Depends on:** Human approval and `Status = In Progress`.

**Files:** `progress/current.md`.

**Action/outcome:** Record the approved work item, branch, reference screenshot name, existing dashboard files, and commands available in `package.json`. Note that the goal is screenshot-faithful redesign of `/dashboard`, not a new feature expansion.

**Requirements:** R1, R13-R15.

**Evidence:** Baseline notes include branch, screenshot target, planned file scope, and no dependency additions.

### T2 - Rebuild dashboard shell and top controls

**Depends on:** T1.

**Modify:** `components/dashboard/dashboard-shell.tsx`, `components/dashboard/adaptive-navigation.tsx`, `app/globals.css`, `tests/dashboard/navigation.test.tsx`.

**Action/outcome:** Implement the rounded desktop frame, centered black pill nav, selected `Home` inner pill, two compact pill icon controls, and top-right circular icon buttons. Remove first-viewport visual dependence on the old wordmark if needed for screenshot fidelity.

**Requirements:** R1-R3, R11-R13.

**Evidence:** Navigation tests pass for visible Home, accessible names, focus order, and no old nav layout assumptions.

### T3 - Replace greeting and utility action band

**Depends on:** T2.

**Modify:** `components/dashboard/dashboard-screen.tsx`, `app/globals.css`, `tests/dashboard/dashboard-screen.test.tsx`.

**Action/outcome:** Render `Keep it up, Uzui!`, subtitle `Track your nutrition, activity, and goals`, and right-aligned `Filters` and `Reports` buttons with icons. Remove old first-viewport greeting copy.

**Requirements:** R1, R4, R11-R12.

**Evidence:** Tests assert new copy/actions and absence of old greeting strings.

### T4 - Implement floating side rail

**Depends on:** T2, T3.

**Modify:** `components/dashboard/contextual-utilities.tsx`, `components/dashboard/dashboard-shell.tsx`, `app/globals.css`, `tests/dashboard/navigation.test.tsx`, `e2e/dashboard.spec.ts`.

**Action/outcome:** Restyle or recompose utilities into the white floating side rail with green active/search button and stacked icon controls. Provide accessible names/tooltips and narrow-width action parity.

**Requirements:** R1, R5, R11-R12.

**Evidence:** Keyboard test covers rail controls; responsive E2E confirms no horizontal overflow.

### T5 - Adapt fixture/model values for the reference screen

**Depends on:** T1.

**Modify:** `features/dashboard/model.ts`, `features/dashboard/fixture-dashboard-provider.ts`, `features/dashboard/selectors.ts`, `features/dashboard/format.ts`, `tests/dashboard/model.test.ts`, `tests/dashboard/selectors.test.ts`, `tests/dashboard/format.test.ts`.

**Action/outcome:** Add only the deterministic presentation data needed for Summary, Activity, and progress cards. Keep values synthetic and local. Add formatter/selector coverage for liters, kilometers, kcal, bpm, percentages, and weekly bar data if not already covered.

**Requirements:** R6-R10, R13-R14.

**Evidence:** Unit tests pass; scan confirms no real personal data, secrets, network contracts, or persistence.

### T6 - Redesign Summary card

**Depends on:** T3, T5.

**Modify:** `components/dashboard/nutrition-summary.tsx`, `components/dashboard/dashboard-screen.tsx`, `app/globals.css`, `tests/dashboard/dashboard-screen.test.tsx`.

**Action/outcome:** Render the screenshot Summary card with title/helper, `Weekly` selector chip, mini stat strip, seven stacked weekday macro bars, and carbohydrate/fat/protein legend rows. Use CSS blocks for stacked bars.

**Requirements:** R1-R2, R6, R11-R12.

**Evidence:** Tests assert labels, values, seven bars, and legend rows; desktop screenshot shows the card in the left column.

### T7 - Redesign Activity metric cards

**Depends on:** T3, T5.

**Modify:** `components/dashboard/activity-summary.tsx`, `components/dashboard/dashboard-screen.tsx`, `app/globals.css`, `tests/dashboard/health-and-ai-safety.test.tsx`, `tests/dashboard/dashboard-screen.test.tsx`.

**Action/outcome:** Render Activity heading/helper, section action icons, three tall cards for Hydration/Steps/Sleep, and three compact cards for Active Calories/Distance/Heart Rate. Implement dark Sleep card and local CSS/SVG sparkline/progress details.

**Requirements:** R1-R2, R7-R8, R10-R12.

**Evidence:** Tests assert all labels/values; safety tests confirm no real health data or external call; screenshot confirms card proportions.

### T8 - Redesign lower progress cards

**Depends on:** T5, T6, T7.

**Modify:** `components/dashboard/goal-progress.tsx`, `components/dashboard/dashboard-screen.tsx`, `app/globals.css`, `tests/dashboard/dashboard-screen.test.tsx`.

**Action/outcome:** Render `Fat Loss Progress` and `Protein Goal` cards in the lower row with values, descriptions, trend icons, and percentages. Position them so they are visible at the bottom of the desktop reference viewport.

**Requirements:** R1-R2, R9, R11-R12.

**Evidence:** Tests assert card labels/values and desktop screenshot confirms bottom-row visibility.

### T9 - Align desktop spacing, sizing, typography, and colors

**Depends on:** T6-T8.

**Modify:** `app/globals.css` plus dashboard component files touched in T2-T8 as needed.

**Action/outcome:** Tune the outer frame, grid widths, gaps, card radii, shadows, typography weights, icon sizes, accent colors, and first-viewport fit to closely match the screenshot.

**Requirements:** R1-R2, R15.

**Evidence:** Visual comparison notes document any intentional deviations and their reason.

### T10 - Complete responsive adaptation

**Depends on:** T9.

**Modify:** `app/globals.css`, `components/dashboard/dashboard-screen.tsx`, `components/dashboard/dashboard-shell.tsx`, `components/dashboard/contextual-utilities.tsx`, `e2e/dashboard.spec.ts`.

**Action/outcome:** Ensure tablet and narrow layouts preserve hierarchy, avoid overlap, keep text readable, maintain action access, and remove horizontal overflow.

**Requirements:** R11-R12, R14.

**Evidence:** E2E screenshots/checks at 360, 768, 1024, and desktop widths pass.

### T11 - Preserve accessibility and privacy safety

**Depends on:** T2-T10.

**Modify:** `tests/dashboard/navigation.test.tsx`, `tests/dashboard/health-and-ai-safety.test.tsx`, `tests/dashboard/dashboard-screen.test.tsx`, `e2e/dashboard.spec.ts`, component files as needed for fixes.

**Action/outcome:** Verify keyboard operation, focus states, accessible names, headings/regions, dark-card contrast, reduced motion, synthetic data boundaries, and no network/persistence behavior.

**Requirements:** R10-R14.

**Evidence:** Accessibility and safety tests pass; Playwright keyboard path works; no serious/critical accessibility issues.

### T12 - Final verification and handoff

**Depends on:** T1-T11.

**Modify:** `progress/current.md`.

**Action/outcome:** Run available checks: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, and `npm run test:e2e`. Record results, changed-file list, screenshot evidence, requirement checklist, known deviations, and confirmation that no unauthorized files/dependencies/services were added. Hand off for Reviewer through the Leader; do not mark Notion Completed.

**Requirements:** R1-R15.

**Evidence:** Handoff includes command results, screenshot paths, requirement coverage, and scope verification.

## Dependency order

```text
Human approval
  -> T1
  -> T2 + T5
  -> T3
  -> T4
  -> T6 + T7
  -> T8
  -> T9
  -> T10
  -> T11
  -> T12
  -> Reviewer
```

## Requirement-to-task coverage

| Requirement | Tasks |
| --- | --- |
| R1 | T1-T4, T6-T10, T12 |
| R2 | T6-T9, T12 |
| R3 | T2, T11-T12 |
| R4 | T3, T12 |
| R5 | T4, T10-T12 |
| R6 | T5-T6, T12 |
| R7 | T5, T7, T12 |
| R8 | T5, T7, T12 |
| R9 | T5, T8, T12 |
| R10 | T5, T7, T11-T12 |
| R11 | T2-T8, T10-T12 |
| R12 | T4, T6-T10, T12 |
| R13 | T1-T2, T5, T12 |
| R14 | T1, T10-T12 |
| R15 | T1, T9, T12 |

## Final stop rule

If any task requires a new dependency, unlisted file, external design import, backend/API/schema, real personal data, persistence, authentication, product capability expansion, or a visible deviation not covered by R15, stop and request a Spec Author revision with human approval.
