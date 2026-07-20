# Ask Avilo Aceternity Demo Card Requirements

## Work Identity

- **Master Work item:** `Use Aceternity gooey input demo inside Ask Avilo recipe and workout card`
- **Notion:** `https://app.notion.com/p/3a106edf7ca081c68da6c9c0c424a3ea`
- **Parent dashboard redesign:** `https://app.notion.com/p/39e06edf7ca081ba8d25cc966f35e9fb`
- **Specification package:** `specs/dashboard-ask-avilo-aceternity-demo-card/`
- **Branch:** `feature/dashboard-experience`
- **Department:** `Brand & Design`
- **Workstream:** `UX / UI`
- **Authoring role:** Spec Author only

## Problem And Outcome

The current `/dashboard` Ask Avilo area has a locally reproduced gooey input under the progress cards, but Gustavo's next direction is to try the Aceternity/shadcn registry component and reshape the area into the uploaded reference-card pattern: one rounded white card, prompt text at the top, and the input/search area below inside the same card.

The outcome is a dashboard card under the progress cards that visually matches the reference image's rounded white form container, replaces the business-management copy with recipe/workout Avilo AI copy, and preserves the observable Aceternity Gooey Input behavior without adding backend AI, persistence, telemetry, auth, or health-data flows.

## Source Facts And Install Decision

- User-requested primary command: `npx.cmd shadcn@latest add @aceternity/gooey-input-demo`.
- Official Aceternity page checked by the Leader: `https://ui.aceternity.com/components/gooey-input`.
- Official documented command from the Leader check: `npx shadcn@latest add @aceternity/gooey-input`.
- AI catalog fact from the Leader check: component name `gooey-input`, dependency `motion`, categories utility/form/navigation/special.

This specification authorizes the Implementer, only after human approval moves the work item to `In Progress`, to run a networked shadcn registry install and to accept `motion` plus corresponding `package.json` and `package-lock.json` changes if the registry component requires them.

Fallback rule: the Implementer must first try `npx.cmd shadcn@latest add @aceternity/gooey-input-demo` on Windows. If that exact demo registry item is unavailable, fails with a not-found/registry-item error, or installs no usable demo component, the Implementer must then try the official documented fallback command `npx.cmd shadcn@latest add @aceternity/gooey-input`. This fallback is chosen because the official page and catalog identify `gooey-input` as the canonical registry component. If both commands fail or generate incompatible code that cannot be inspected and safely integrated inside the allowed scope, the Implementer must stop for a human decision.

## Scope

### In Scope

- Replace or refine only the existing dashboard Ask Avilo entry under `Fat Loss Progress` and `Protein Goal`.
- Render one rounded white Ask Avilo card matching the uploaded reference image's structure: top text in the same box, input/search area below it in the same box.
- Use visible prompt copy exactly: `Ask anything about your recipes or workouts to Avilo AI`.
- Use the Aceternity registry component behavior from the installed `@aceternity/gooey-input-demo` if available; otherwise use the official `@aceternity/gooey-input` behavior.
- Preserve the input's Aceternity behavior: local focus/open state, gooey animated/filtered transition, local typing, clear/dismiss behavior where present, keyboard recovery, and reduced-motion safety.
- Keep the card below the dashboard progress cards in the left column.
- Inspect generated registry files after installation and integrate only the minimum component behavior and styling needed for this card.
- Add or update focused component and E2E tests for card structure, placement, behavior parity, accessibility, responsive stability, reduced motion, no unintended requests, and dependency/package review.

### Out Of Scope

- Backend AI chat, generated answers, streaming, provider/model changes, prompt history, persistence, analytics, telemetry, authentication, authorization, APIs, database writes, fixtures, health-data flows, medical/coaching advice, or any request caused by typing/submitting the Ask Avilo input.
- Moving the Ask Avilo card away from the left column or away from the area below the progress cards.
- Changing progress-card labels, values, percentages, trend icons, Summary content, Activity cards, history data, dashboard routes, providers, fixtures, or dashboard model contracts.
- Keeping the old business-management example copy.
- Installing unrelated Aceternity components or broad UI libraries beyond what the registry command generates for Gooey Input and its required dependency.

## Definitions

- **Ask Avilo card:** The rounded white container that contains both the top prompt text and the Aceternity input/search area below it.
- **Top prompt text:** The visible text `Ask anything about your recipes or workouts to Avilo AI` rendered inside the card above the input/search area. It is not merely an aria-label, placeholder, tooltip, or hidden string.
- **Aceternity behavior:** The observable behavior of the installed Aceternity Gooey Input component, including its focus/open interaction, gooey visual merge/filter or equivalent motion, input typing behavior, close/clear/search affordance behavior, keyboard handling, and reduced-motion accommodation.
- **Generated registry files:** Files created by the shadcn command before manual integration, expected to be limited to component files under `components/ui/` and package manifest/lockfile changes if `motion` is installed.
- **Presentation-only:** The input can accept local text and animate locally, but the value must not be submitted, stored, logged, sent, routed, persisted, analyzed, or used to generate a response.

## Requirements

### R1 - Governance And Branch Preconditions

**Trigger:** Implementer begins work.
**Preconditions:** Human review has approved this spec and moved the governing Notion item from `Defining` to `In Progress`.
**Expected response:** The Implementer confirms the checkout is on `feature/dashboard-experience`, the Notion item is `In Progress`, and the work is still the single governed item in this package before running any install or modifying files.
**Failure behavior:** If status, branch, or scope does not match, the Implementer stops without running the shadcn command.
**Evidence:** Handoff notes include Notion status, branch name, and changed-file plan.

### R2 - Primary Registry Command Attempt

**Trigger:** Dependency/component acquisition begins.
**Preconditions:** R1 is satisfied and network command approval is available.
**Expected response:** The Implementer runs the exact Windows command `npx.cmd shadcn@latest add @aceternity/gooey-input-demo`.
**State change:** The command may create generated component files and may modify `package.json` and `package-lock.json` if dependencies are installed.
**Failure behavior:** If the command fails because the demo registry item is unavailable, not found, or produces no usable component, proceed to R3. If it fails for an environment/network problem unrelated to item availability, stop and record the error.
**Evidence:** Command output or exact error is recorded in implementation evidence.

### R3 - Official Fallback Registry Command

**Trigger:** R2 reports demo item unavailable, not found, or unusable.
**Preconditions:** R1 is satisfied and the R2 failure was inspected.
**Expected response:** The Implementer runs `npx.cmd shadcn@latest add @aceternity/gooey-input`.
**State change:** The command may create generated component files and may install `motion` with package/lockfile changes if required by the registry.
**Failure behavior:** If the fallback also fails or produces incompatible code, the Implementer stops for a human decision and does not hand-roll behavior as a silent substitute.
**Evidence:** Fallback command output and generated-file list are recorded.

### R4 - Generated File Inspection And Constraint

**Trigger:** A registry command succeeds.
**Preconditions:** Generated files are present in the worktree.
**Expected response:** The Implementer inspects `git status --short`, `package.json`, `package-lock.json`, and every generated component file before integration. Only generated Aceternity Gooey Input files under `components/ui/` plus required package/lock changes may remain from the registry install.
**State change:** Unused demo/example files must be removed only when they are confirmed generated by this command and not user-authored. Manual integration must use the minimum needed code and styling.
**Failure behavior:** If shadcn creates unexpected files outside `components/ui/`, package manifests, or known shadcn support files, the Implementer stops unless the extra file is required and explicitly allowed by a spec revision.
**Evidence:** Changed-file summary identifies generated files kept, removed, and integrated.

### R5 - Rounded White Reference Card

**Trigger:** `/dashboard` renders with ready dashboard data.
**Preconditions:** Ask Avilo card is visible.
**Expected response:** One rounded white card appears, with prompt text at the top and the input/search area below inside the same box. The card must visually match the uploaded reference image's structure: white surface, rounded corners, compact top text, and the input/search region sharing the same container.
**Failure behavior:** The prompt and input must not render as separate unrelated surfaces, a marketing hero, a floating pill without a card, or nested cards.
**Evidence:** Component DOM assertions and Playwright screenshots at required viewport widths show one containing card with the required internal order.

### R6 - Required Copy Replacement

**Trigger:** Ask Avilo card renders in any state.
**Preconditions:** Card is visible.
**Expected response:** The card displays exactly one visible instance of `Ask anything about your recipes or workouts to Avilo AI` above the input/search area.
**Failure behavior:** The text `How is your business management going?` must not appear anywhere on `/dashboard`.
**Evidence:** Tests assert the required copy appears once and the old example copy is absent.

### R7 - Placement Under Progress Cards

**Trigger:** `/dashboard` renders with ready dashboard data.
**Preconditions:** The progress region containing `Fat Loss Progress` and `Protein Goal` is ready.
**Expected response:** The Ask Avilo card remains in `.dashboard-left-column` immediately after the progress-card region and before no unrelated left-column content.
**Failure behavior:** If the progress section is loading, empty, or error, the Ask Avilo card must not be inserted inside that section-state surface.
**Evidence:** Component DOM order and Playwright bounding boxes verify the card is below the progress region and outside progress cards.

### R8 - Aceternity Behavior Parity

**Trigger:** User focuses, clicks, types, presses Enter, presses Escape, blurs, and uses clear/dismiss/search controls provided by the installed component.
**Preconditions:** The Aceternity component or its inspected local integration is mounted inside the card.
**Expected response:** The input preserves the installed Aceternity behavior as closely as possible: focus/open visual state, local typing, gooey visual transition, clear/dismiss recovery where present, keyboard support, and stable collapse/blur behavior. Any adaptation required for the card layout must not remove the core behavior.
**Failure behavior:** If exact behavior depends on a demo wrapper unavailable after both install attempts, the Implementer stops for human decision instead of substituting a simpler static input.
**Evidence:** E2E interaction checks, screenshots, and code review compare implemented behavior to the installed source.

### R9 - Presentation-Only And No Requests

**Trigger:** User interacts with the input: focus, type, Enter, Escape, clear/dismiss, blur, and pointer click.
**Preconditions:** Page load is complete and request capture is reset after navigation.
**Expected response:** The component updates only local UI state and must not call `/api`, external hosts, providers, router navigation, analytics, telemetry, storage APIs, or persistence.
**Failure behavior:** Pressing Enter must not submit, navigate, fetch, or create a response panel.
**Evidence:** E2E network guard records no input-caused external or `/api` requests; diff review confirms no provider/API/storage/logging changes.

### R10 - Accessibility And Keyboard Support

**Trigger:** Screen reader query, Tab/Shift+Tab navigation, input typing, Escape, Enter, and clear/dismiss activation.
**Preconditions:** The card is rendered at supported viewport widths.
**Expected response:** The top prompt text is visible. The input/search control has an accessible name tied to the prompt intent. Any icon button has an accessible name matching its behavior. Focus indicators are visible and not clipped. Keyboard users can enter and leave the component without traps.
**Failure behavior:** Placeholder-only naming, hidden focus, clipped focus outlines, inaccessible icon-only controls, or keyboard-only dead ends are unacceptable.
**Evidence:** Testing Library role/name assertions, Playwright keyboard path, and axe serious/critical checks scoped to the card.

### R11 - Responsive Stability

**Trigger:** Render and interaction at 1440, 1024, 768, and 360 CSS pixel viewport widths.
**Preconditions:** Dashboard data is ready.
**Expected response:** The card remains below the progress cards; the prompt remains above the input; text and controls do not overlap; the input fits inside the card; `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
**Failure behavior:** Long typed text may scroll or truncate inside the input, but it must not expand the page width or obscure the control.
**Evidence:** Playwright geometry and overflow assertions across all required widths.

### R12 - Reduced Motion Safety

**Trigger:** Normal interaction and `prefers-reduced-motion: reduce`.
**Preconditions:** User interacts with the input.
**Expected response:** Normal mode may use the installed Aceternity motion/filter behavior. Reduced-motion mode disables or minimizes non-essential animation while preserving all states, usability, and card layout.
**Failure behavior:** No flashing, continuous motion, layout thrash, motion-required feedback, or broken reduced-motion state.
**Evidence:** CSS/component review and practical E2E or screenshot evidence for reduced-motion behavior.

### R13 - Dashboard Preservation

**Trigger:** Normal render, section-state render, history interactions, and responsive checks.
**Preconditions:** Existing dashboard fixture data and tests.
**Expected response:** Summary, Activity, history, navigation, utility rail, section retries, and progress-card content continue to behave as before, except for natural vertical/layout adjustment from replacing the Ask Avilo entry.
**Failure behavior:** Existing unrelated sections must not gain changed copy, hidden content, modified data, new errors, or altered provider behavior.
**Evidence:** Existing dashboard tests continue to pass or are updated only for Ask Avilo card expectations.

### R14 - Dependency And Package Review

**Trigger:** Final implementation review.
**Preconditions:** Registry install and integration are complete.
**Expected response:** Package changes are limited to dependencies required by the installed Aceternity Gooey Input component, expected to include `motion` if the registry installs it. No unrelated dependencies, scripts, overrides, build config, or package-manager changes are allowed.
**Failure behavior:** Unexplained package changes require rollback or spec revision before review.
**Evidence:** Final diff review summarizes dependency additions and why each is required.

### R15 - Authorized File Scope

**Trigger:** Final diff review.
**Preconditions:** Implementation is complete.
**Expected response:** Manual implementation changes are limited to `components/dashboard/ask-avilo.tsx`, `components/dashboard/dashboard-screen.tsx` only if placement needs adjustment, `app/globals.css`, focused dashboard tests under `tests/dashboard/`, and `e2e/dashboard.spec.ts`. Registry-generated component files under `components/ui/` and required `package.json`/`package-lock.json` changes are allowed only if produced or required by R2/R3.
**Failure behavior:** Routes, APIs, providers, fixtures, models, migrations, auth, telemetry, unrelated components, or config files must not change.
**Evidence:** Final changed-file review.

## Derived Requirements

- **DR1 from R8 and R10:** The integration must expose stable accessible names or state attributes sufficient for E2E tests to distinguish resting/open/typed/cleared states. Rationale: behavior parity cannot be objectively verified without observable state. This does not add product capability.
- **DR2 from R9:** E2E request capture must be reset after initial page navigation before input interactions. Rationale: this separates normal app load requests from Ask Avilo-caused requests without changing user-visible behavior.

## Acceptance Evidence Matrix

| Requirement | Required evidence |
| --- | --- |
| R1 | Notion/branch preflight note |
| R2 | Primary command output or exact unavailable error |
| R3 | Fallback command output when R2 is unavailable, or note that fallback was unnecessary |
| R4 | Generated-file inspection summary |
| R5 | DOM assertions and screenshots showing one white card with top text and input below |
| R6 | Text assertions for required copy and absence of old business-management copy |
| R7 | DOM order and geometry under progress cards |
| R8 | Interaction tests and source comparison to installed Aceternity component |
| R9 | No-request E2E guard and code review |
| R10 | Role/name, keyboard, focus, and axe evidence |
| R11 | Responsive geometry and no-overflow checks |
| R12 | Reduced-motion review/check |
| R13 | Existing dashboard tests and preservation checks |
| R14 | Package/dependency diff review |
| R15 | Final changed-file review |

## Traceability

| Requested behavior or constraint | Requirements |
| --- | --- |
| Try `npx shadcn@latest add @aceternity/gooey-input-demo` | R2 |
| Use official `@aceternity/gooey-input` fallback or stop rule | R3 |
| Authorize networked command and package/lock changes if `motion` installs | R1, R2, R3, R14 |
| Keep rounded white box with top text and input/search below in same box | R5, R6, R11 |
| Replace business-management copy with recipe/workout Avilo AI copy | R6 |
| Put Aceternity UI input below text inside same card | R5, R8 |
| Same behavior as Aceternity component | R4, R8, R12 |
| Constrain generated paths after install inspection | R4, R15 |
| No backend AI/API/provider/fixture/persistence/auth/telemetry/health-data flows | R9, R13, R15 |
| Keep under progress cards in dashboard left column | R7, R11, R13 |
| Accessibility, keyboard, responsive, reduced motion, no unintended requests, dependency review | R9, R10, R11, R12, R14 |

## Assumptions

- `feature/dashboard-experience` remains the shared branch for the dashboard redesign and this focused Ask Avilo follow-up.
- The current `AskAviloGooeyInput` in `components/dashboard/ask-avilo.tsx` is the nearest integration point and should be replaced/refined rather than adding a second Ask Avilo entry.
- The registry component can be adapted locally for the card while preserving behavior, provided the generated source is inspected and kept within the allowed file scope.

## Open Questions

None. If both registry commands fail or install incompatible/uninspectable code, that is an implementation stop condition, not an open product question.
