# Ask Avilo Gooey Input Design

## Design Goals

This design satisfies R1-R10 by adding one restrained Avilo AI visual entry point below the existing progress cards. It should look like the uploaded white pill reference, use existing dashboard CSS and React patterns, and avoid expanding the product into a working AI chat feature.

## Current-System Observations

- `/dashboard` renders through `app/dashboard/page.tsx` and `components/dashboard/dashboard-screen.tsx`.
- `DashboardScreen` currently composes `.reference-grid`, `.dashboard-left-column`, `.summary-column`, `.progress-row`, `.dashboard-right-column`, `.activity-column`, and history.
- `GoalProgress` owns the two progress cards and renders a region named `Progress goals`.
- `components/dashboard/ask-avilo.tsx` exists, but it is an older assistant surface with form submission, prompt chips, contextual provider calls, response states, and health disclosure. This work needs a much smaller visual entry under the progress cards.
- `app/globals.css` contains the dashboard layout, progress-card styling, focus-visible rules, and older `.ask-*` styles.
- `package.json` confirms Next.js, React, Tailwind CSS, lucide-react, Playwright, Testing Library, and Vitest are available; `framer-motion` is not installed.

## Exact File Scope

### Existing Files Expected To Change

| File | Required design responsibility |
| --- | --- |
| `components/dashboard/ask-avilo.tsx` | Convert, split internally, or add an exported compact presentation-only dashboard entry component for this feature. Remove provider-driven behavior from the variant used in the redesigned dashboard. |
| `components/dashboard/dashboard-screen.tsx` | Render the compact Ask Avilo entry immediately after `section("goal", <GoalProgress ... />)` inside `.dashboard-left-column`. |
| `app/globals.css` | Add or adjust styles for the compact pill, right-side icon button, responsive width, focus states, and reduced-motion handling. |
| `tests/dashboard/dashboard-screen.test.tsx` | Assert DOM order, prompt text, accessible names, preservation of progress cards, and absence of response/chat requirements. |
| `e2e/dashboard.spec.ts` | Add geometry, overflow, keyboard, screenshot, and no-external-request checks for the input across required widths. |

### Optional Test File Alternative

The Implementer may place focused component tests in a new or existing dashboard test file under `tests/dashboard/` only if that keeps `dashboard-screen.test.tsx` simpler. No fixtures, models, providers, routes, config, or package files may be changed.

## Component Design

Use a compact dashboard-specific variant rather than the older full assistant experience. Acceptable shapes:

- Export a new component such as `AskAviloGooeyInput` from `components/dashboard/ask-avilo.tsx`.
- Or refactor that file so the existing `AskAvilo` export remains available while a new compact export is used by `DashboardScreen`.

The component should render:

- A containing region or form-like surface with a stable class such as `.ask-avilo-gooey`.
- A text entry element or input-like button with visible text `Ask anything to Avilo AI`.
- A right-side icon button using lucide-react, such as `X`, with `aria-label="Dismiss Ask Avilo input"`.
- If an actual `<input>` is used, pair it with a persistent label for assistive technology and use the required phrase as the visible placeholder or displayed value only when empty.
- If a non-submitting button/input-like surface is used, use appropriate accessible naming and avoid implying that a question has been sent.

The preferred implementation is a presentational form or searchbox-style group with submit disabled/prevented. This preserves familiar input affordance while satisfying the no-backend scope.

## Layout And Placement

`DashboardScreen` must keep this order:

```text
.reference-grid
|- .dashboard-left-column
|  |- .summary-column
|  |- .progress-row / Progress goals region
|  `- .ask-avilo-gooey / Ask anything to Avilo AI entry
`- .dashboard-right-column
   |- .activity-column
   `- history region
```

Placement constraints:

- The input is a sibling after the progress region in `.dashboard-left-column`.
- The input aligns to the available left-column width at desktop sizes.
- The input is not a descendant of `.summary-column` or `.progress-card`.
- Vertical gap should feel related to the progress cards, using the existing left-column rhythm rather than a large new section gap.
- The right dashboard column and history panel positions may shift only by the natural height added to the left column; their content and ordering remain unchanged.

## Visual Design

Use the reference image as a shape and surface cue, not as a request for heavy animation.

Required styling:

- White or near-white pill surface.
- High border radius, at least pill-like `999px` or an organic equivalent.
- Soft border and shadow consistent with existing card shadows.
- Compact height, approximately normal input height rather than a large card.
- Left-aligned prompt text with readable weight and contrast.
- Right-side circular icon button visually embedded in the pill.
- `min-width: 0`, constrained width, and stable dimensions to prevent layout shift.

The "gooey" quality may come from CSS border radius, subtle inset/outer shadows, or a static pseudo-element. Do not add blob backgrounds, decorative orbs, or dominant Aceternity-style spectacle.

## Behavior And State

- The component is presentation-only for this work.
- No provider prop, AI provider call, response panel, prompt chips, contextual chips, loading state, retry state, analytics, or network behavior is required for this dashboard entry.
- If text entry is supported, state must be local, unsaved, and reset only through normal component lifecycle or the optional close/clear button.
- Close button behavior may be either:
  - clear local text if text entry is supported, or
  - no-op/inert visual control if the pill is a non-editable entry point.
- The close button must never hide the entry persistently or write to storage.

## Accessibility Design

- Preserve existing `main`, Summary, Activity, Progress, and history semantics.
- Provide an accessible label such as `Ask anything to Avilo AI` for the entry.
- Provide `aria-label="Dismiss Ask Avilo input"` or `aria-label="Clear Ask Avilo input"` for the icon button, matching actual behavior.
- Ensure focus-visible styling is visible on both the input surface and icon button.
- Do not rely on placeholder-only text as the sole accessible label.
- Maintain text contrast against the white pill and icon-button background.
- Keyboard tab order should encounter the input after the progress cards and before the right-column/history controls that follow in DOM order.

## Responsive Design

- `>= 1024px`: width follows the left column/progress row; prompt and icon sit on one line.
- `768px-1023px`: width follows the stacked left column; text remains readable with no overlap.
- `< 768px`: pill may keep one-line layout if text fits; otherwise allow prompt text to truncate gracefully only after the exact phrase remains accessible by label. Icon button remains at least 40px by 40px.
- All breakpoints must avoid horizontal overflow and text/icon overlap.

## Reduced Motion And Performance

- Prefer static styling.
- If a subtle visual transition is used, limit it to opacity, color, shadow, or transform on hover/focus.
- Add a `prefers-reduced-motion: reduce` rule to remove non-essential transitions or animations.
- No layout animation, spring physics, continuous motion, canvas, or dependency-driven animation is authorized.

## Security, Privacy, And Health-Data Design

- No AI question should leave the browser.
- No prompt should be logged, persisted, sent to a provider, encoded into the URL, or stored in local/session storage.
- No personal health/nutrition data access changes are authorized.
- No authentication or permission UI is introduced.
- No medical or coaching claim is added.

## Dependency Impact

No new dependency is authorized. Do not run Aceternity or shadcn registry install commands for this work. Use existing React, Next.js, CSS, Tailwind/global CSS patterns, and lucide-react icons.

## Verification Design

Component tests should verify:

- The required prompt text appears once.
- The input follows the progress region in `.dashboard-left-column`.
- The input is outside `.summary-column` and outside `.progress-card`.
- The close/clear icon has the correct accessible name.
- Existing progress-card content remains unchanged.

E2E tests should verify:

- Viewports: 1440, 1024, 768, 360.
- Input below progress cards by comparing bounding boxes.
- Desktop left-edge and width alignment with progress row within a small tolerance.
- No horizontal overflow.
- Keyboard focus reaches the entry and icon button.
- No external network request is triggered by focusing, typing, clicking, or submitting/preventing submit.
- Screenshot evidence is captured or existing screenshot checks are updated.

## Alternatives Considered

| Alternative | Decision | Reason |
| --- | --- | --- |
| Reuse the full existing `AskAvilo` assistant card unchanged | Rejected | It includes provider-driven chat behavior, prompt chips, responses, and disclosure content that exceed this visual input scope. |
| Install an Aceternity component through shadcn registry | Rejected | The requested element is small, the project lacks motion dependencies, and local CSS can satisfy the reference without dependency risk. |
| Add `framer-motion` for a gooey animation | Rejected | The user explicitly noted the project has no framer-motion dependency, and the spec requires reduced, dashboard-appropriate motion. |
| Place the input under the entire dashboard grid | Rejected | The user explicitly requested it under the two progress boxes; it must remain in the left column below those cards. |
| Build a real Avilo AI chat entry with backend calls | Rejected | Backend AI chat, persistence, and live conversation behavior are out of scope. |

## Requirement-To-Design Mapping

| Requirement | Design coverage |
| --- | --- |
| R1 | Layout and placement; component tests; E2E geometry |
| R2 | Component design; accessibility design; component and E2E tests |
| R3 | Visual design; Aceternity-inspired dependency boundary |
| R4 | Behavior and state; security/privacy design; no-network verification |
| R5 | Current-system observations; layout preservation; verification design |
| R6 | Responsive design; E2E viewport checks |
| R7 | Accessibility design; keyboard verification |
| R8 | Reduced motion and performance; dependency impact |
| R9 | Security, privacy, and health-data design |
| R10 | Exact file scope; dependency impact |

## Stop Conditions

The Implementer must stop for a spec revision before proceeding if the desired result appears to require new dependencies, a real AI provider, API routes, model/provider changes, persistence, authentication, moving the input outside the left progress-card area, modifying unlisted files, or changing visible dashboard content beyond adding this input.
