# Ask Avilo Gooey Input Requirements

## Work Identity

- **Master Work item:** `Add Ask anything to Avilo AI gooey input under progress cards`
- **Notion:** `https://app.notion.com/p/3a106edf7ca081c0948ce8c59bda743b`
- **Parent dashboard redesign:** `https://app.notion.com/p/39e06edf7ca081ba8d25cc966f35e9fb`
- **Specification package:** `specs/dashboard-ask-avilo-gooey-input/`
- **Branch:** `feature/dashboard-experience`
- **Department:** `Brand & Design`
- **Workstream:** `UX / UI`
- **Authoring role:** Spec Author only

## Problem And Outcome

The redesigned dashboard has compact `Fat Loss Progress` and `Protein Goal` cards but lacks the new Avilo AI visual entry point Gustavo requested beneath them. The outcome is a restrained, rounded, white, reference-inspired input pill directly under those two cards, with visible prompt text `Ask anything to Avilo AI`, fitting the current dashboard without adding chat behavior.

## Reference And Context

- Reference image: `C:\Users\gustt\AppData\Local\Temp\codex-clipboard-97c80261-f73a-4cce-b50e-121f0ffd3457.png`
- Reference visual: compact white rounded pill, soft shadow, text on the left, small close button on the right, subtly organic or "gooey" rounded form.
- Local Aceternity guidance: use `C:\Users\gustt\.codex\skills\aceternity-ui\SKILL.md` and `references\usage.md` only for restrained React/Next/Tailwind inspiration.
- Current project has no `framer-motion` dependency; no Aceternity install is required or authorized for this work.

## Scope

### In Scope

- Add a visual Avilo AI input entry point directly under the existing `Fat Loss Progress` and `Protein Goal` progress cards on `/dashboard`.
- Use visible prompt text exactly: `Ask anything to Avilo AI`.
- Match the reference direction with a compact white pill, strong rounding, soft border/shadow, and a right-side close or dismiss icon button.
- Keep implementation presentation-only and deterministic.
- Preserve current progress cards, Summary, Activity, history, navigation, dashboard data, and section-state behavior.
- Add focused component and E2E verification for placement, text, accessibility, responsive behavior, and scope boundaries.

### Out Of Scope

- Backend AI chat, live conversation behavior, generated responses, streaming, model calls, persistence, authentication, authorization, new APIs, prompt history, telemetry, analytics, database changes, or health-data processing.
- New routes, new dependencies, package manifest changes, external Aceternity installation, or `framer-motion`.
- Reworking the existing full `AskAvilo` assistant workflow beyond what is necessary for this visual dashboard entry.
- Moving the input anywhere except under the two progress cards.
- Changing the visible progress-card labels, values, descriptions, percentages, or trend icons.

## Definitions

- **Gooey input:** A compact visual input-like pill with very rounded geometry, soft surface treatment, and subtly merged pill/button proportions. This spec does not require physics simulation or blob animation.
- **Prompt text:** The visible placeholder-style copy inside the pill: `Ask anything to Avilo AI`.
- **Under the progress cards:** The pill follows the progress-card region in normal document flow inside the left dashboard column. It is below both `Fat Loss Progress` and `Protein Goal`, not between them, not inside either card, and not in the right Activity/history column.
- **Close button:** A small right-side icon button using an accessible name such as `Dismiss Ask Avilo input`. It may be a no-op unless the existing implementation pattern supports local visual dismissal without persistence.
- **Presentation-only:** The UI may accept focus and may optionally allow local text entry, but it must not send, store, fetch, stream, or generate answers.

## Requirements

### R1 - Exact Placement

When `/dashboard` renders with ready dashboard data, the Avilo AI input must appear immediately after the progress-card region containing `Fat Loss Progress` and `Protein Goal` in the left dashboard column. It must not be rendered above Summary, between Summary and progress cards, inside either progress card, in the Activity column, or below the history panel.

**Evidence:** Component DOM assertions and Playwright geometry checks at desktop and mobile widths show the input is a normal-flow sibling after `.progress-row` within `.dashboard-left-column`.

### R2 - Required Prompt Text

The input must display the exact visible text `Ask anything to Avilo AI`. The text must be discoverable by Testing Library and Playwright text queries and must remain visible at all required viewport widths.

**Evidence:** Component and E2E assertions find exactly one visible occurrence of `Ask anything to Avilo AI` in the new input.

### R3 - Reference-Inspired Visual Treatment

The input must visually follow the provided reference: compact white rounded pill, soft border or shadow, left-aligned prompt text, and a small rounded/circular right-side close icon button. The treatment must be restrained enough to fit the existing dashboard visual system and must not introduce decorative effects that dominate the progress cards.

**Evidence:** Playwright screenshots at 1440, 1024, 768, and 360 CSS pixels show a compact white pill directly under the progress cards with the required right-side icon button.

### R4 - Presentation-Only Behavior

The feature must not create backend AI chat, response generation, persistence, authentication, API calls, network requests, database writes, analytics, telemetry, or saved local state. If the pill is implemented as a form or input, submitting must be disabled, inert, or locally prevented with no external side effect.

**Evidence:** Diff review shows no API/provider/persistence changes; E2E network guard reports no external requests caused by the input; tests assert no response surface is required.

### R5 - Existing Dashboard Preservation

The implementation must preserve existing Summary, Activity, history, navigation, section-state, and progress-card behavior. The two progress cards must retain their existing labels, descriptions, values, percentages, trend icons, synthetic fixture source, and responsive row/stack behavior.

**Evidence:** Existing dashboard component tests and E2E checks continue to pass or are updated only to account for the additional input geometry.

### R6 - Responsive Layout And No Overflow

At 1440px and 1024px widths, the input must align to the progress-card row width in the left column and sit below it with a balanced vertical gap. At 768px, it must remain below the progress cards in the stacked dashboard flow. At 360px, it must fit within the viewport, allow text to remain readable, keep the icon button reachable, and satisfy `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.

**Evidence:** E2E checks record input and progress bounds at 1440, 1024, 768, and 360 and verify no horizontal overflow.

### R7 - Accessibility And Keyboard Support

The input surface must have an accessible role and name appropriate to its chosen implementation. If implemented as an actual input, it must have an accessible label matching the Avilo AI prompt intent. The close icon button must have an accessible name and a visible focus state. Keyboard focus must not be trapped, hidden, or clipped. The prompt text must not be the only accessible name when a placeholder-only implementation would disappear during typing.

**Evidence:** Component tests assert accessible input/button naming; Playwright keyboard path reaches the new interactive element(s) at representative viewport widths; axe serious/critical violations do not increase because of this feature.

### R8 - Motion And Reduced-Motion Safety

Any "gooey" effect must be static CSS or very subtle non-essential motion. Motion must respect `prefers-reduced-motion: reduce` and must not animate layout size, trigger flashing, or impair repeated dashboard use. No `framer-motion` or motion dependency may be added.

**Evidence:** CSS review shows reduced-motion handling for any animation and package diff shows no new dependency.

### R9 - Security, Privacy, And Health-Data Boundary

The component must not collect, transmit, persist, log, or infer personal health, nutrition, authentication, or AI prompt data. It must not imply medical advice, diagnosis, or professional care. If helper/disclosure text is used, it must remain compact and not expand scope beyond a visual entry point.

**Evidence:** Diff review confirms no provider/model/API/storage changes and no new health-data flow.

### R10 - File And Dependency Boundary

Implementation may modify only `components/dashboard/ask-avilo.tsx`, `components/dashboard/dashboard-screen.tsx`, `app/globals.css`, `tests/dashboard/dashboard-screen.test.tsx` or another focused dashboard component test under `tests/dashboard/`, and `e2e/dashboard.spec.ts`. It may create no new dependency, route, API, fixture, model, provider, config, or build file.

**Evidence:** Final changed-file review shows only authorized implementation/test files and this spec package.

## Traceability

| Requested behavior or constraint | Requirements |
| --- | --- |
| Add pictured rounded/gooey input | R1, R3, R6 |
| Under the two boxes Fat Loss Progress and Protein Goal | R1, R5, R6 |
| Visible prompt text `Ask anything to Avilo AI` | R2, R7 |
| Use local Aceternity direction for restrained inspiration | R3, R8, R10 |
| Do not define backend AI chat or persistence | R4, R9 |
| No new dependencies, current project has no framer-motion | R8, R10 |
| Accessibility, responsive behavior, reduced motion | R6, R7, R8 |
| Exact placement/alignment constraints | R1, R3, R6 |

## Assumptions

- Existing `feature/dashboard-experience` dashboard structure is the baseline for this spec.
- The existing `components/dashboard/ask-avilo.tsx` file may be reused or visually constrained for this dashboard entry if doing so does not preserve or reintroduce out-of-scope live assistant behavior.
- The close icon button may be inert/no-op if local dismissal would create hidden state or persistence beyond the visual request.

## Open Questions

None. The reference image and user request provide enough direction for a bounded visual specification.
