# Ask Avilo Aceternity Gooey Refinement Design

## Design Goals

This design satisfies R1-R13 by refining the existing dashboard Ask Avilo entry into a larger, horizontal, label-above-input control that locally reproduces Aceternity-style Gooey Input behavior without adding dependencies or expanding into AI chat functionality.

## Current-System Observations

- `/dashboard` renders through `app/dashboard/page.tsx` and `components/dashboard/dashboard-screen.tsx`.
- `DashboardScreen` currently composes `.reference-grid`, `.dashboard-left-column`, `.summary-column`, the `GoalProgress` region, `AskAviloGooeyInput`, `.dashboard-right-column`, `.activity-column`, and history.
- `AskAviloGooeyInput` is exported from `components/dashboard/ask-avilo.tsx` and currently renders a compact region with a button-like field and dismiss button.
- The same file also contains the older full `AskAvilo` provider-backed assistant. This refinement must affect only the dashboard compact entry used by `DashboardScreen`; it must not reintroduce provider behavior there.
- `app/globals.css` already contains `.ask-avilo-gooey` styles, dashboard layout styles, focus-visible styles, and responsive breakpoints.
- `package.json` has no `motion` or `framer-motion` dependency. The allowed implementation must keep that boundary.
- Existing dashboard tests already assert current Ask Avilo placement, prompt text, and no response/status surface. They must be updated for the new label-above-input behavior and expanded interaction.

## Exact File Scope

### Existing Files Expected To Change

| File | Required design responsibility |
| --- | --- |
| `components/dashboard/ask-avilo.tsx` | Refine `AskAviloGooeyInput` into a local stateful, presentation-only, label-above-actual-input component with collapsed/expanded behavior, local value handling, Escape/blur/clear recovery, and no provider/API behavior. Preserve the older `AskAvilo` export unless removing it is separately approved. |
| `components/dashboard/dashboard-screen.tsx` | Keep rendering `AskAviloGooeyInput` immediately after the progress region inside `.dashboard-left-column`. No other layout reordering is authorized. |
| `app/globals.css` | Update `.ask-avilo-gooey` styles and add any child styles needed for the larger horizontal label/input layout, gooey SVG/filter surface, transition states, focus states, reduced-motion handling, and responsive behavior. |
| `tests/dashboard/dashboard-screen.test.tsx` | Update component tests for visible label above actual input, role/name, placement, keyboard/local typing behavior where practical, and dashboard preservation. |
| `e2e/dashboard.spec.ts` | Update E2E geometry, keyboard, interaction, no-request, reduced-motion where practical, and screenshot evidence for the refined behavior. |

### New Files Expected To Be Created

No application source, package, config, route, API, fixture, provider, or model files are expected. If a separate focused component test file is clearer, the only allowed new test file is under `tests/dashboard/`.

## Component Structure

`AskAviloGooeyInput` should render one region with a persistent label and a real text input. The recommended structure is:

```text
section.ask-avilo-gooey[aria-labelledby]
|- label or heading text: Ask anything to Avilo AI
`- div.ask-avilo-gooey-shell[data-state="collapsed|expanded"]
   |- inline svg/filter definition or filtered visual wrapper
   |- input[type="search" or "text"]
   `- button[type="button"] clear/dismiss
```

Implementation notes:

- Prefer a real `<label>` associated to the input via `htmlFor` and `id`, or `aria-labelledby` if the visible label is not a native label.
- The input placeholder may be short supporting text such as `Type your question`, but the required phrase must remain visible above the input.
- The clear/dismiss button accessible name must match behavior:
  - `Clear Ask Avilo input` if it clears typed text.
  - `Dismiss Ask Avilo input` only if it collapses an empty input without clearing hidden data.
- The button must never persistently hide the full entry.
- Use local `useState` for `value` and `open` only. No effects, provider calls, storage, routing, or fetch calls are needed.

## Interaction State Design

States:

- `collapsed-empty`: default state. Label visible, input shell at collapsed width/shape, value empty.
- `expanded-empty`: input focused or opened, value empty, shell wider within the left column.
- `expanded-with-value`: value non-empty, shell remains expanded even if focus moves to the clear button.
- `collapsed-after-clear`: clear/Escape returns to empty collapsed state when safe.

Transitions:

| Trigger | Current state | Result |
| --- | --- | --- |
| Click or focus input | `collapsed-empty` | `expanded-empty` |
| Type text | `expanded-empty` | `expanded-with-value` |
| Blur input while value empty and focus leaves component | `expanded-empty` | `collapsed-empty` |
| Blur input while value exists | `expanded-with-value` | remains expanded or visually open enough to show text |
| Escape while value exists | `expanded-with-value` | clear value, keep focus, collapse or return to `expanded-empty` per implementation consistency |
| Escape while value empty | `expanded-empty` | collapse to `collapsed-empty` |
| Clear button click | any state | value becomes empty and shell collapses or stays focused empty with no persisted state |
| Enter | any state | prevent submit/navigation and keep local state |

Invariants:

- The visible label never disappears.
- The input remains keyboard reachable.
- No external side effect occurs during any transition.
- Rapid focus/blur/click sequences must not leave hidden typed text or invisible controls.

## Gooey Visual Design

The Aceternity behavior should be interpreted as a local dashboard-appropriate version of a fluid expanding search input:

- Use an inline SVG filter in the component or CSS-applied SVG filter reference to create a gooey merge between the input body and the clear/action control.
- The filtered visual may be applied to wrapper pseudo-elements or child shape elements while the native input remains readable and accessible.
- Use data attributes or classes such as `[data-state="expanded"]` for visual state.
- The surface should be white or near-white with a subtle border, soft shadow, high radius, and smooth horizontal expansion.
- Avoid decorative background blobs, unrelated orbs, heavy gradients, or animation that competes with the progress cards.
- If the filter is unsupported, the fallback is a polished rounded input with the same dimensions and interactions.

## Layout And Placement

`DashboardScreen` must preserve this order:

```text
.reference-grid
|- .dashboard-left-column
|  |- .summary-column
|  |- Progress goals region / .progress-row
|  `- AskAviloGooeyInput / .ask-avilo-gooey
`- .dashboard-right-column
   |- .activity-column
   `- history region
```

The refined entry:

- Sits under both progress cards, not inside either card.
- Uses the left-column/progress width at desktop sizes.
- Has a label stacked above the input shell.
- Adds only the natural vertical height required by the label and larger horizontal input.
- Does not force the right column to reflow on desktop except through existing grid behavior.

## Responsive Design

- `>= 1024px`: The shell expands horizontally inside the left column. Collapsed state should still read as a meaningful wide search input, not a tiny icon.
- `768px-1023px`: The entry follows the stacked left column width. Expansion must not push beyond the column.
- `< 768px`: The label remains above the input; the input and clear button stay on one row if possible. If space is tight, input text may scroll inside the native input, but the control must not create page overflow.
- The clear/dismiss target should be at least 40px by 40px on touch widths.

## Accessibility Design

- Use a real label/input relationship or equivalent `aria-labelledby`.
- Use an input role discoverable as `textbox` or `searchbox`.
- Expose state with `aria-expanded` on the input or wrapper only if it accurately describes the open/collapsed visual state.
- Provide visible focus styles for input and clear/dismiss button.
- Preserve keyboard order: dashboard controls, progress cards if focusable, Ask Avilo input, Ask Avilo clear/dismiss button, then later DOM controls.
- Avoid placeholder-only naming.
- Ensure typed text and label contrast remains accessible against the white surface.
- Axe serious/critical violations caused by `.ask-avilo-gooey` must be zero.

## Reduced Motion And Performance

- Use CSS transitions only for non-essential visual changes.
- Allowed transitions: width/max-width, transform, opacity, color, shadow, filter intensity, or border radius.
- Keep durations short and avoid continuous animation.
- Add or preserve `@media (prefers-reduced-motion: reduce)` so transitions/animations are effectively disabled for this component.
- No JavaScript animation loop, canvas, dependency animation, or layout polling is authorized.

## Security, Privacy, And Health-Data Design

- The local value must not be passed to a provider, API, router, telemetry system, storage API, query string, console log, or fixture.
- The component must not introduce consent, auth, health-data, nutrition-processing, or medical advice behavior.
- Existing provider-backed `AskAvilo` code must not be wired into this dashboard entry as part of this task.

## Dependency Impact

No new dependency is authorized.

Prohibited commands and changes:

- Do not run `npx shadcn@latest add @aceternity/gooey-input`.
- Do not add `motion`, `framer-motion`, or any animation package.
- Do not edit `package.json`, `package-lock.json`, `next.config.ts`, test config, or build config.

Considered but rejected dependency path:

- Installing Aceternity's registry component would match source behavior more directly, but it requires network approval and a new `motion` dependency for a small isolated UI refinement. Local reproduction satisfies the requested behavior with lower repo risk and honors the previous no-dependency boundary.

## Verification Design

Component tests should verify:

- The required label text appears above the input.
- The control below the label is an actual input with accessible name.
- The input accepts typed text locally.
- Enter does not create a response/status/alert or submit side effect.
- Escape and clear/dismiss behavior recover to empty/collapsed state.
- The entry remains after the progress region and outside progress cards.
- Existing progress-card content remains unchanged.

E2E tests should verify:

- Viewports: 1440, 1024, 768, and 360.
- Label top is above input top.
- Input region is below progress row and aligned with the progress row/left column.
- Collapsed width is smaller than expanded width where viewport allows, and expanded width remains within the left column.
- Typing, Escape, clear/dismiss, blur, and Enter do not issue external or `/api` requests.
- No horizontal overflow.
- Keyboard focus reaches input and clear/dismiss button with visible focus.
- Screenshots capture collapsed and expanded states or the closest practical evidence.

Required commands for the Implementer:

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- `npm.cmd run test:e2e` or a narrower documented Playwright command plus justification if the full suite is impractical

## Alternatives Considered

| Alternative | Decision | Reason |
| --- | --- | --- |
| Install Aceternity gooey-input through shadcn registry | Rejected | It requires network approval and `motion` for a small interaction that can be reproduced locally. |
| Add `motion` or `framer-motion` manually | Rejected | New dependency is unnecessary and conflicts with the previous no-dependency boundary. |
| Keep the current compact button-like pill | Rejected | It does not satisfy the new larger/horizontal, label-above-input, actual-input behavior. |
| Build a real AI chat submission flow | Rejected | Backend chat, provider calls, and persistence are explicitly out of scope. |
| Use a decorative non-input div | Rejected | The user asked for an input; the spec requires an actual text input for accessible, testable behavior. |

## Requirement-To-Design Mapping

| Requirement | Design coverage |
| --- | --- |
| R1 | Layout and placement |
| R2 | Component structure and accessibility design |
| R3 | Component structure and interaction state design |
| R4 | Layout, responsive design, visual design |
| R5 | Interaction state design |
| R6 | Gooey visual design |
| R7 | Dependency impact, security/privacy design, verification design |
| R8 | Accessibility design and verification design |
| R9 | Reduced motion and performance |
| R10 | Responsive design and verification design |
| R11 | Current-system observations, layout preservation, verification design |
| R12 | Security, privacy, and health-data design |
| R13 | Exact file scope and dependency impact |

## Stop Conditions

The Implementer must stop for spec revision before proceeding if the desired result appears to require new dependencies, Aceternity registry installation, `motion`, backend AI/provider/API behavior, persistence, auth, telemetry, model or fixture edits, moving the entry outside the left progress-card area, changing unlisted files, or changing dashboard content unrelated to this Ask Avilo refinement.
