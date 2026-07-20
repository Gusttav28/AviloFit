# Dashboard Activity Container Height Tasks

## Preconditions

- Gustavo has reviewed this exact package and moved Master Work item `3a006edf-7ca0-811e-beb5-efaf265b0649` from `Defining` to `In Progress`.
- The checked-out branch is exactly `feature/dashboard-experience` and matches Notion.
- The Implementer confirms no newer approved work changes the Activity shell, grid/stretch contract, or authorized file scope.

## Implementation checklist

- [ ] **T1 - Capture the pre-change geometry baseline**  
  **Files:** Read only `app/globals.css`, `components/dashboard/dashboard-screen.tsx`, `components/dashboard/activity-summary.tsx`, and `e2e/dashboard.spec.ts`.  
  **Action:** At 1440, 1024, 768, and 360, record bounding boxes for the Activity shell, disclosure, all six Activity cards, left column, Summary shell, progress row, and reference grid; record document/shell overflow and desktop top alignment or stacked gap. Confirm the current excess desktop tail and existing 23px/15px stacked tails.  
  **Outcome:** A baseline exists for the 1px preservation comparisons required by R3 and R4.  
  **Requirements:** R2, R3, R4, R5.  
  **Depends on:** Preconditions.

- [ ] **T2 - Make only the Activity shell content-driven**  
  **File:** `app/globals.css`.  
  **Action:** Add the scoped Activity-grid-item start alignment described in `design.md`. Keep `.reference-grid { align-items: stretch; }`, all responsive padding, breakpoints, card rules, Summary/progress rules, and content styles unchanged. Do not add height, max-height, positioning, transforms, negative spacing, or overflow masking.  
  **Outcome:** Activity opts out of sibling-height stretching while neighboring layout behavior is unchanged.  
  **Requirements:** R1, R2, R3, R4, R5, R6, R7.  
  **Depends on:** T1.

- [ ] **T3 - Add focused four-width rendered verification**  
  **File:** `e2e/dashboard.spec.ts`.  
  **Action:** Add or extend a focused test at 1440, 1024, 768, and 360 to assert the required 29/25/23/15px tails within 1px; exact Activity child/content/control presence; six-card containment; before/after card and Summary/progress geometry preservation; desktop right-column/top alignment; stacked 24px gap; document and shell `scrollWidth <= clientWidth`; disclosure vertical containment; no sibling overlap; and keyboard reachability/focus visibility for both Activity controls. Preserve existing tests.  
  **Outcome:** R1-R6 have objective responsive evidence and regression protection.  
  **Requirements:** R1, R2, R3, R4, R5, R6.  
  **Depends on:** T1, T2.

- [ ] **T4 - Verify repository quality gates and known unrelated findings**  
  **Files:** No additional edits.  
  **Action:** Run the documented checks `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run test`, and the focused Playwright test covering this work. Run the applicable full E2E suite when the environment permits. Report the known pre-existing muted-text contrast finding separately if it remains; do not change colors or weaken accessibility assertions under this item. Confirm `/dashboard` returns HTTP 200 from the documented local server.  
  **Outcome:** Static, unit, route, and focused rendered checks pass; unrelated baseline failures are accurately isolated rather than hidden.  
  **Requirements:** R3, R5, R6, R7.  
  **Depends on:** T3.

- [ ] **T5 - Final scope and traceability audit**  
  **Files:** `app/globals.css`, `e2e/dashboard.spec.ts`.  
  **Action:** Confirm the only implementation/test changes are the Activity-only alignment declaration and focused E2E coverage. Re-measure all four widths, attach screenshots and geometry output, verify every R1-R7 requirement has evidence, and confirm no component, content, data, dependency, breakpoint, Summary/progress, contrast, or unrelated style changed.  
  **Outcome:** A durable Implementer handoff can identify changed files, commands/results, four-width evidence, and requirement coverage without unauthorized scope.  
  **Requirements:** R1, R2, R3, R4, R5, R6, R7.  
  **Depends on:** T4.

## Verification matrix

| Requirement | Tasks | Required evidence |
| --- | --- | --- |
| R1 | T2, T3, T5 | Content-driven shell, normal-flow containment, no sizing workaround |
| R2 | T1, T2, T3, T5 | 29/25/23/15px tails +/- 1px and screenshots |
| R3 | T1, T2, T3, T4, T5 | Exact content/controls and card boxes unchanged within 1px |
| R4 | T1, T2, T3, T5 | Grid stretch retained; desktop top alignment; stacked 24px gap; left geometry unchanged |
| R5 | T1, T2, T3, T4, T5 | No clipping, overlap, or document/shell horizontal overflow |
| R6 | T2, T3, T4, T5 | Existing semantics/tests and keyboard/focus checks |
| R7 | T2, T4, T5 | Two-file diff, unchanged manifests, documented rollback |
