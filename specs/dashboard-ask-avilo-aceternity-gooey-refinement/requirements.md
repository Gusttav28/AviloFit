# Ask Avilo Aceternity Gooey Refinement Requirements

## Work Identity

- **Master Work item:** `Refine Ask Avilo input with label and Aceternity gooey behavior`
- **Notion:** `https://app.notion.com/p/3a106edf7ca0818296fde328caf99ce4`
- **Parent dashboard redesign:** `https://app.notion.com/p/39e06edf7ca081ba8d25cc966f35e9fb`
- **Specification package:** `specs/dashboard-ask-avilo-aceternity-gooey-refinement/`
- **Branch:** `feature/dashboard-experience`
- **Department:** `Brand & Design`
- **Workstream:** `UX / UI`
- **Authoring role:** Spec Author only

## Problem And Outcome

The current Ask Avilo dashboard entry is a compact single-line pill under the progress cards. Gustavo's follow-up direction is to make this area larger and more horizontal, place the visible text above the input instead of using it only inside the control, and match the observable behavior of Aceternity UI's Gooey Input: a search-style input that expands and collapses with a gooey SVG/filter feel and shared-layout-style motion.

The outcome is still a dashboard visual and interaction refinement only. It must not become a working AI chat, persistence surface, provider integration, or health-data workflow.

## Aceternity Decision

This specification authorizes **local reproduction of the essential Aceternity Gooey Input behavior without adding dependencies**.

The Implementer must not run `npx shadcn@latest add @aceternity/gooey-input`, must not add `motion`, and must not change package or lock files. This is the safest path for this repo because the requested behavior is narrow, the current project has no motion dependency, the previous Ask Avilo spec explicitly disallowed new dependencies, and the necessary expand/collapse behavior can be implemented with existing React state, CSS transitions, and an inline SVG filter.

## Scope

### In Scope

- Refine only the existing dashboard Ask Avilo entry under the `Fat Loss Progress` and `Protein Goal` cards on `/dashboard`.
- Put visible text `Ask anything to Avilo AI` above the actual input.
- Make the actual input wider, lower, and more horizontal than the current compact pill.
- Locally reproduce Aceternity-style gooey input behavior: collapsed resting state, expanded focus/open state, smooth width/shape transition, gooey SVG/filter visual connection, and collapse recovery.
- Preserve dashboard layout, progress cards, Summary, Activity, history, navigation, and existing section-state behavior.
- Add or update focused tests for placement, visible label, input behavior, keyboard behavior, reduced motion, responsiveness, and no external requests.

### Out Of Scope

- Backend AI chat, generated answers, streaming, provider/model changes, prompt history, persistence, analytics, telemetry, authentication, authorization, APIs, database writes, fixtures, health-data flows, or medical/coaching advice.
- Installing Aceternity, shadcn registry components, `motion`, `framer-motion`, or any new dependency.
- Moving the Ask Avilo entry away from the left dashboard column below the two progress cards.
- Changing progress-card labels, values, percentages, trend icons, Summary content, Activity cards, history data, dashboard routes, or provider fixtures.

## Definitions

- **Visible label:** The text `Ask anything to Avilo AI` rendered above the input as persistent visible text. It is not merely placeholder text.
- **Actual input:** A focusable text entry control, preferably `input type="search"` or `input type="text"`, that can receive keyboard text locally without submitting it anywhere.
- **Collapsed state:** The resting state before focus/open. The component is still wider and more horizontal than the previous compact pill, but the input body is visually shorter than the expanded state.
- **Expanded state:** The open state after click, focus, or typing, where the input grows horizontally within the available dashboard column and shows the gooey connection effect.
- **Gooey behavior:** A visual treatment inspired by Aceternity's component where the input and its control elements appear to merge during expansion via SVG filter or equivalent CSS/SVG masking, with smooth shared-layout-style motion. It does not require importing Aceternity code.
- **Presentation-only:** The component may manage local UI state and local text, but it must not send, store, persist, log, infer from, or generate content from the question.

## Requirements

### R1 - Governed Placement

When `/dashboard` renders with ready dashboard data, the Ask Avilo entry must remain in `.dashboard-left-column` immediately after the progress-card region containing `Fat Loss Progress` and `Protein Goal`.

**Trigger:** `/dashboard` initial render.
**Preconditions:** Dashboard model sections are ready.
**Expected response:** The entry appears below both progress cards as a normal-flow sibling of the progress region.
**Failure behavior:** If progress is loading, empty, or error, the Ask Avilo entry must not be inserted inside the section-state surface.
**Evidence:** Component DOM assertions and Playwright geometry checks verify order and containment.

### R2 - Persistent Label Above Input

The text `Ask anything to Avilo AI` must be rendered visibly above the actual input. The same text must not be available only as a placeholder, button label, aria-label, tooltip, or hidden text.

**Trigger:** Any render state.
**Preconditions:** Ask Avilo entry is visible.
**Expected response:** A persistent text label sits above the input and remains visible when the input is focused, expanded, typed into, empty, or collapsed.
**State change:** None beyond normal input focus/open state.
**Failure behavior:** If the input value changes, the label remains unchanged.
**Evidence:** Tests find the visible text above the input and verify it remains visible after focus and typing.

### R3 - Actual Local Text Input

The control below the label must be an actual focusable input control that accepts local typing.

**Trigger:** User clicks or tabs into the input and types text.
**Preconditions:** Component is enabled.
**Expected response:** The input receives focus, displays typed text locally, and does not submit or fetch.
**State change:** Local component value may change in memory only.
**Failure behavior:** Empty input remains valid and must not show an error.
**Evidence:** Component and E2E tests type into the input and observe local value without network requests or response UI.

### R4 - Larger Horizontal Form Factor

The refined entry must be visibly wider and more horizontal than the prior compact pill.

**Trigger:** Initial render and expanded state at desktop, tablet, and mobile widths.
**Preconditions:** Entry is in the left dashboard column.
**Expected response:** The control spans the available left-column/progress width or a deliberate max width within it, uses a stable horizontal input shape, and keeps the label above it.
**Boundary behavior:** At 360px width, it must fit inside the viewport without horizontal scrolling.
**Evidence:** Playwright bounding boxes verify width alignment, minimum touch target sizes, and no overflow at 1440, 1024, 768, and 360 CSS pixels.

### R5 - Aceternity-Style Expand And Collapse

The input must locally reproduce the essential Aceternity Gooey Input interaction.

**Trigger:** Focus, click, typing, Escape, blur, and clear/dismiss interaction.
**Preconditions:** The input is enabled and visible.
**Expected response:** Click or focus opens the input from collapsed to expanded state. Typing keeps it expanded. Escape collapses the input when empty or clears/collapses according to the design. Blur collapses only when the input is empty. A clear/dismiss control clears local text and collapses the control when appropriate.
**State change:** `open` and local value state may change only in the component.
**Failure behavior:** The component must recover from rapid focus/blur or repeated clear actions without stuck open, stuck focused, invisible text, or lost label.
**Evidence:** E2E keyboard and pointer tests assert collapsed, expanded, typed, cleared, Escape, and blur states.

### R6 - Gooey SVG/Filter Visual

The expanded/collapsed transition must include a local gooey SVG/filter or equivalent SVG/CSS filter effect that visually merges the input body with the action/clear affordance during state changes.

**Trigger:** Transition between collapsed and expanded states, plus hover/focus if implemented.
**Preconditions:** Browser supports SVG filters.
**Expected response:** The input and attached control read as one fluid search-style surface without decorative blobs or unrelated background ornaments.
**Failure behavior:** If the SVG/filter is unsupported, the control remains usable as a clean rounded input with no broken visuals.
**Evidence:** Code review confirms local SVG/filter or equivalent CSS/SVG implementation; screenshots show the input as one cohesive gooey surface.

### R7 - Dependency And Network Boundary

No new dependency, registry install, package manifest change, lockfile change, runtime API call, or external request is allowed for this refinement.

**Trigger:** Implementation and common interactions.
**Preconditions:** User focuses, types, clears, presses Enter, presses Escape, and blurs the input.
**Expected response:** No external or application API request is made because of the Ask Avilo entry.
**Failure behavior:** Pressing Enter must be prevented or inert and must not navigate or submit.
**Evidence:** Diff review shows package files unchanged; Playwright network guard records no external or `/api` requests from interactions.

### R8 - Accessibility And Keyboard

The entry must be accessible by label, role, focus order, focus indication, and keyboard operation.

**Trigger:** Keyboard Tab, Shift+Tab, typing, Escape, Enter, and clear/dismiss activation.
**Preconditions:** Page is loaded at supported viewport widths.
**Expected response:** Focus reaches the input after the progress cards and before later DOM controls. The input has an accessible name tied to the visible label. The clear/dismiss control has an accessible name matching its behavior. Focus outlines are visible and not clipped.
**Failure behavior:** Keyboard users must be able to leave the component without traps.
**Evidence:** Testing Library role/name assertions, Playwright keyboard path, and axe serious/critical checks scoped to Ask Avilo.

### R9 - Reduced Motion And Motion Safety

Animation must be non-essential, short, and reduced-motion safe.

**Trigger:** System `prefers-reduced-motion: reduce` and normal interaction.
**Preconditions:** User has any motion preference.
**Expected response:** Normal mode may use subtle width, transform, opacity, shadow, or filter transitions. Reduced-motion mode disables or minimizes transitions while preserving all states and usability.
**Failure behavior:** No flashing, continuous motion, layout thrash, or motion-required feedback.
**Evidence:** CSS review confirms `prefers-reduced-motion`; E2E or screenshot checks verify usable reduced-motion state when practical.

### R10 - Responsive Stability

The label, input, icon/control, and surrounding dashboard content must not overlap or cause layout instability across supported widths.

**Trigger:** Render and interaction at 1440, 1024, 768, and 360 CSS pixels.
**Preconditions:** Dashboard content is ready.
**Expected response:** The entry remains below progress cards; the label stays above the input; text does not overlap controls; icon/control remains reachable; `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
**Failure behavior:** Long typed text scrolls or truncates inside the input without expanding page width.
**Evidence:** Playwright geometry and overflow assertions across all required widths.

### R11 - Dashboard Preservation

The implementation must preserve existing dashboard content and behavior outside the Ask Avilo entry.

**Trigger:** Normal render, section-state render, history interactions, and responsive checks.
**Preconditions:** Existing dashboard fixture data and tests.
**Expected response:** Summary, Activity, history, navigation, utility rail, section retries, and progress-card content continue to behave as before, except for natural vertical space added by the refined Ask Avilo entry.
**Failure behavior:** Existing unrelated sections must not gain new errors, hidden content, changed labels, or modified data.
**Evidence:** Existing focused component and E2E dashboard tests continue to pass or are updated only for Ask Avilo geometry.

### R12 - Privacy And Health-Data Boundary

The input must not collect, transmit, persist, log, analyze, or infer health, nutrition, authentication, or AI prompt data.

**Trigger:** User types health-like or arbitrary text.
**Preconditions:** Input is enabled.
**Expected response:** Text remains only in local component state and disappears on reload/remount.
**Failure behavior:** No warning, diagnosis, generated advice, storage fallback, or telemetry is introduced.
**Evidence:** Code review confirms no provider/model/API/storage/logging changes and no medical/coaching claim.

### R13 - Authorized File Scope

Implementation may modify only the focused dashboard component, dashboard placement, dashboard CSS, and focused dashboard tests.

**Allowed application files:** `components/dashboard/ask-avilo.tsx`, `components/dashboard/dashboard-screen.tsx`, `app/globals.css`.
**Allowed test files:** `tests/dashboard/dashboard-screen.test.tsx` or one focused file under `tests/dashboard/`, and `e2e/dashboard.spec.ts`.
**Forbidden files:** package manifests, lockfiles, routes, APIs, providers, fixtures, model files, configs, migrations, auth files, telemetry files, and unrelated dashboard components.
**Evidence:** Final diff review shows no unauthorized files changed beyond this spec package.

## Derived Requirements

- **DR1 from R5 and R8:** The component must expose stable selectors or accessible names sufficient for E2E tests to distinguish collapsed and expanded states. Rationale: without observable state hooks or accessible state, Aceternity-style behavior cannot be verified objectively. This does not change product behavior.
- **DR2 from R7 and R12:** E2E coverage must reset network request capture after page load before interacting with the input. Rationale: this separates normal app navigation from input-caused requests. This does not change product behavior.

## Acceptance Evidence Matrix

| Requirement | Required evidence |
| --- | --- |
| R1 | DOM order test and Playwright bounding-box placement |
| R2 | Visible label test before and after input interaction |
| R3 | Input role/name test and local typing test |
| R4 | Width/alignment checks at 1440, 1024, 768, 360 |
| R5 | Focus/click/type/Escape/blur/clear interaction tests |
| R6 | Code review plus screenshot evidence of gooey surface |
| R7 | Package diff review and no-request E2E guard |
| R8 | Accessibility role/name, keyboard path, focus outline, axe scoped check |
| R9 | Reduced-motion CSS review and usable reduced-motion state |
| R10 | Responsive no-overflow and no-overlap checks |
| R11 | Existing dashboard tests still passing or narrowly updated |
| R12 | Code review of no provider/API/storage/logging changes |
| R13 | Final changed-file review |

## Traceability

| Requested behavior or constraint | Requirements |
| --- | --- |
| Make the Ask Avilo input more horizontal/larger | R3, R4, R10 |
| Put the text above and the input below | R2, R3, R8, R10 |
| Same behavior as Aceternity UI Gooey Input | R5, R6, R9 |
| Keep it under Fat Loss Progress and Protein Goal cards | R1, R10, R11 |
| Decide dependency path explicitly | R7, R13 |
| No backend AI chat, persistence, APIs, auth, telemetry, provider/model/fixture changes, or health-data flows | R7, R11, R12, R13 |
| Accessibility, keyboard, reduced motion, responsive behavior | R8, R9, R10 |
| No external/API request assertions | R7, R12 |

## Assumptions

- `feature/dashboard-experience` remains the shared branch for the parent dashboard redesign and its focused follow-up refinements.
- The current `AskAviloGooeyInput` dashboard entry is the nearest source surface and should be refined rather than replaced with a second separate entry.
- The Aceternity docs and catalog description supplied by the Leader are sufficient for this spec because the chosen path is a local behavioral reproduction, not a registry install.

## Open Questions

None. The dependency decision is resolved by this spec: no new dependency or network install is authorized.
