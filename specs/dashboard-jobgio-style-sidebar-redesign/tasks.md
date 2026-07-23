# Dashboard Jobgio-Style Sidebar Redesign Tasks

## Preconditions

- The governing Notion item `3a606edf-7ca0-8139-94de-d77651547a33` has been reviewed by Gustavo and moved from `Defining` to `In Progress`.
- The checked-out branch is exactly `develop`.
- The Implementer has read `AGENTS.md`, `.agents/implementer.md`, and this full spec package.
- No implementation starts while the work item remains `Defining`.

## Tasks

### T1 - Verify baseline and scope

Confirm the current branch is `develop`, inspect the current diff, and record pre-existing unrelated changes before editing. Re-read `components/dashboard/contextual-utilities.tsx`, `components/dashboard/dashboard-shell.tsx`, `components/dashboard/dashboard-screen.tsx`, `app/globals.css`, `tests/dashboard/navigation.test.tsx`, and `e2e/dashboard.spec.ts`.

**Files:** `progress/current.md`  
**Requirements:** R7, R16  
**Expected outcome:** Baseline is documented, and implementation scope is limited to the approved sidebar files.

### T2 - Rebuild the sidebar component structure

Replace the current hover-expanding rail structure in `ContextualUtilities` with the Jobgio-style AviloFit sidebar: top brand area, primary nav group, separated settings area, and lower profile identity block. Keep Avilo labels and Dashboard active state.

**Files:** `components/dashboard/contextual-utilities.tsx`  
**Requirements:** R1, R2, R3, R5, R6, R11, R13, R14  
**Depends on:** T1  
**Expected outcome:** The component renders the new sidebar structure without Jobgio branding or labels.

### T3 - Map icons and accessible semantics

Apply Lucide icons for every Avilo nav item and Settings. Ensure visible labels, accessible names, decorative icon hiding, `aria-current="page"` on Dashboard, and non-interactive semantics for any profile block unless a safe existing action already exists.

**Files:** `components/dashboard/contextual-utilities.tsx`  
**Requirements:** R3, R4, R10, R11, R12  
**Depends on:** T2  
**Expected outcome:** Sidebar is semantically navigable and accessible by role/name.

### T4 - Style the desktop Jobgio-style sidebar

Add or replace sidebar CSS so the desktop sidebar is fixed, white, rounded, compact, label-visible, and visually close to the reference. Remove old hover expansion behavior and prior green circular rail treatment from the active sidebar path. Style the active Dashboard pill, inactive rows, settings separation, profile block, hover, and focus states.

**Files:** `app/globals.css`  
**Requirements:** R1, R2, R4, R5, R6, R10, R11, R12, R15  
**Depends on:** T2, T3  
**Expected outcome:** Desktop visual structure matches the supplied reference with AviloFit branding.

### T5 - Adjust main content offset without changing dashboard content

Update only shell/sidebar-related spacing so `.fitcore-dashboard` starts to the right of the new sidebar and keeps the outer dashboard frame removed. Do not edit `DashboardScreen` or FitCore content components unless a spec change is approved.

**Files:** `app/globals.css`; `components/dashboard/dashboard-shell.tsx` only if necessary  
**Requirements:** R7, R8, R9, R16  
**Depends on:** T4  
**Expected outcome:** Sidebar and main content do not overlap, and approved dashboard content remains intact.

### T6 - Implement responsive sidebar behavior

Add responsive CSS for tablet and mobile. Preserve desktop vertical sidebar. At smaller widths, keep controls reachable and avoid horizontal document overflow; labels may collapse only where necessary while accessible names remain.

**Files:** `app/globals.css`  
**Requirements:** R8, R9, R10, R11, R12  
**Depends on:** T5  
**Expected outcome:** Sidebar remains usable at 1024, 768, and 360 widths.

### T7 - Update sidebar unit tests

Revise navigation tests to assert AviloFit brand, absence of Jobgio and Jobgio labels, primary Avilo nav labels, Dashboard active state, Settings separation, profile block rendering, and icon count/semantics. Remove assertions that encode the old expanding rail.

**Files:** `tests/dashboard/navigation.test.tsx`  
**Requirements:** R2, R3, R5, R6, R10, R11, R13, R14  
**Depends on:** T2-T4  
**Expected outcome:** Unit tests describe the new approved sidebar behavior.

### T8 - Update dashboard E2E sidebar coverage

Revise Playwright tests for fixed sidebar geometry, no hover expansion, keyboard path, no overlap, no horizontal overflow, no Jobgio text, AviloFit presence, no external requests, and preserved FitCore dashboard content. Capture screenshots at 1440, 1024, 768, and 360 plus a focused sidebar screenshot if practical.

**Files:** `e2e/dashboard.spec.ts`  
**Requirements:** R1, R2, R3, R4, R7, R8, R9, R10, R11, R12, R13, R15  
**Depends on:** T4-T6  
**Expected outcome:** E2E tests guard visual layout, accessibility, and content preservation.

### T9 - Verify dashboard content preservation

Run or update only existing assertions needed to prove the FitCore content still renders the same topbar, weekly performance, quick metrics, meals, calendar, workouts, smart insights, local images, safety disclaimer, and no external requests. Do not intentionally update content values or order.

**Files:** `tests/dashboard/fitcore-dashboard-sections.test.tsx` only if current assertions conflict with sidebar-only layout; otherwise no edit  
**Requirements:** R7, R13, R14, R16  
**Depends on:** T5, T8  
**Expected outcome:** Dashboard content regression coverage remains green without broadening scope.

### T10 - Run required verification

Run the repository checks required for this work: `npm run typecheck`, `npm run lint`, focused dashboard Vitest, dashboard Playwright E2E, and `npm run build`. Record any existing warnings separately from new failures.

**Files:** `progress/current.md`  
**Requirements:** R8, R10, R11, R12, R13, R15, R16  
**Depends on:** T7-T9  
**Expected outcome:** Verification evidence is durable and every requirement has test or inspection support.

### T11 - Final scope audit and handoff

Audit changed files against this spec. Confirm there are no package/config/asset/route/dashboard-content changes beyond allowed scope, no Jobgio text/assets, no external requests, no overlap, and no unintended FitCore content changes. Update Notion according to Implementer contract and move the item to `Review` assigned to Gustavo.

**Files:** `progress/current.md`; Notion work item  
**Requirements:** R1-R16  
**Depends on:** T10  
**Expected outcome:** Implementation is ready for independent review with clear evidence and no unauthorized scope.

## Requirement coverage

| Requirement | Tasks |
| --- | --- |
| R1 | T2, T4, T8, T11 |
| R2 | T2, T4, T7, T8, T11 |
| R3 | T2, T3, T7, T8 |
| R4 | T3, T4, T8 |
| R5 | T2, T4, T7 |
| R6 | T2, T4, T7 |
| R7 | T1, T5, T8, T9, T11 |
| R8 | T5, T6, T8, T10 |
| R9 | T6, T8 |
| R10 | T3, T4, T6, T8, T10 |
| R11 | T3, T7, T8, T10 |
| R12 | T4, T6, T8, T10 |
| R13 | T2, T7, T8, T9, T10, T11 |
| R14 | T2, T7, T9, T11 |
| R15 | T4, T8, T10 |
| R16 | T1, T5, T9, T10, T11 |

## Final verification checklist

- Exactly the approved spec file scope was used or a spec-change stop occurred.
- Sidebar visually follows the reference and displays AviloFit, not Jobgio.
- Primary Avilo nav, separated Settings, active Dashboard, and profile block are present.
- Sidebar is fixed and stable during scroll on desktop.
- Sidebar does not expand on hover.
- Main dashboard content remains the approved FitCore composition.
- No supported viewport has sidebar/content overlap or document-level horizontal overflow.
- Keyboard, focus, labels, `aria-current`, and Axe checks pass.
- No new dependency, config, remote asset, network request, persistence, or private data exposure exists.
- Verification outputs and screenshots are recorded before moving to Review.
