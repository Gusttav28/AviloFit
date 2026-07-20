# Dashboard reference redesign design

## Design goals

This design covers R1-R15. The goal is not to invent a new dashboard concept; it is to make the current `/dashboard` screen visually match Gustavo's uploaded reference screenshot first.

The target mood is compact, polished, bright, and app-like: a pale gray rounded desktop frame, crisp white cards, black top pill navigation, bright green accents, small icon controls, dense metric cards, and friendly rounded geometry.

## Current-system observations

- The repo already contains a Next.js app with `/dashboard` at `app/dashboard/page.tsx`.
- The current dashboard is composed through `components/dashboard/dashboard-screen.tsx` and `components/dashboard/dashboard-shell.tsx`.
- Existing components include navigation, contextual utilities, nutrition, activity, goal, recommendations, grocery export, calendar, budget editor, Ask Avilo, and section-state helpers.
- Existing model/provider files under `features/dashboard/` provide deterministic fixture data and selectors.
- Existing tests cover dashboard selectors, formatting, navigation, calendar, recommendations, health/AI safety, screen behavior, and Playwright E2E.
- The existing visual system in `app/globals.css` is built around the earlier Avilo dashboard spec. This redesign should restyle the dashboard rather than add a second app surface.
- `README.md` is empty; no broader architecture documentation was found beyond AGENTS/spec contracts and the existing dashboard spec.

## File scope

The Implementer may modify only the following existing product files for the redesign:

| File | Expected change |
| --- | --- |
| `app/dashboard/page.tsx` | Keep route behavior; adjust only if the dashboard composition API changes. |
| `app/globals.css` | Replace or extend dashboard-specific styling to match the reference visual system and responsive behavior. |
| `components/dashboard/dashboard-screen.tsx` | Recompose first viewport into greeting, Summary, Activity, and lower progress cards. |
| `components/dashboard/dashboard-shell.tsx` | Match the rounded desktop frame, centered pill nav, top-right icon buttons, and page shell. |
| `components/dashboard/adaptive-navigation.tsx` | Render the black pill nav with selected Home and compact icon buttons. |
| `components/dashboard/contextual-utilities.tsx` | Convert or constrain the utility rail to match the floating side rail behavior. |
| `components/dashboard/nutrition-summary.tsx` | Render the screenshot Summary card, weekly chip, mini stats, stacked bars, and macro legend. |
| `components/dashboard/activity-summary.tsx` | Render the screenshot Activity cards, dark Sleep card, sparklines/progress details, and values. |
| `components/dashboard/goal-progress.tsx` | Render lower progress card treatment for Fat Loss Progress and Protein Goal, or expose a reusable progress-card shape. |
| `components/dashboard/section-state.tsx` | Preserve accessible loading/error states if layout wrappers change. |
| `features/dashboard/model.ts` | Add or adapt presentation-only fields only if existing types cannot express screenshot metrics. |
| `features/dashboard/fixture-dashboard-provider.ts` | Add synthetic screenshot-matching values and labels. |
| `features/dashboard/selectors.ts` | Add pure derived values only if needed for summary/activity/progress display. |
| `features/dashboard/format.ts` | Reuse or extend formatting for liters, kilometers, kcal, bpm, and percent display. |

The Implementer may modify only the following verification files:

| File | Expected change |
| --- | --- |
| `tests/dashboard/dashboard-screen.test.tsx` | Assert first-viewport structure, greeting, regions, and responsive order. |
| `tests/dashboard/navigation.test.tsx` | Assert pill nav labels, accessible icon controls, and focus behavior. |
| `tests/dashboard/health-and-ai-safety.test.tsx` | Preserve no-real-data/no-network safety checks for redesigned activity metrics. |
| `tests/dashboard/model.test.ts` | Update type/state assertions if model fields change. |
| `tests/dashboard/selectors.test.ts` | Update pure derivation tests if selectors change. |
| `tests/dashboard/format.test.ts` | Add unit/percent display coverage if formatters change. |
| `e2e/dashboard.spec.ts` | Update visual, keyboard, responsive, and screenshot evidence for the reference redesign. |
| `progress/current.md` | Implementer handoff evidence only; not part of this Spec Author package. |

No new product file is expected. If the Implementer believes a new component file is necessary, they must stop for a spec revision unless the file is only an allowed test/evidence artifact already listed above.

## Route and composition

`app/dashboard/page.tsx` continues to obtain the deterministic fixture dashboard model and render `DashboardScreen`.

`DashboardScreen` should no longer lead with the previous day strip, meal recommendation table, and Ask Avilo composition. For this pass, the first viewport composition is:

1. `DashboardShell` outer frame and top controls.
2. Greeting row with `Keep it up, Uzui!`, subtitle, `Filters`, and `Reports`.
3. Main dashboard grid:
   - Left: Summary card with floating rail.
   - Right: Activity section with six metric cards.
4. Lower two-card progress row beginning within or just below the first viewport.

Existing recommendation, calendar, grocery, budget, and Ask Avilo components may be hidden from the first viewport or left out of this route for the redesign pass if they prevent screenshot fidelity. They must not be deleted from the repo unless separately governed.

## Visual layout

### Outer frame

- Use a full-page pale gray canvas.
- Add a large rounded frame effect with a visible gray outer stroke and clipped corners, matching the screenshot's desktop-app viewport.
- The frame should fit the viewport without horizontal scroll.
- Desktop content padding should feel close to the screenshot: generous top/side padding, but compact enough for lower progress cards to peek into view.

### Header controls

- Place the black pill nav centered horizontally near the top.
- Selected `Home` appears as a white inner pill with black text/icon.
- Two icon-only controls sit to the right inside the black pill.
- Top-right notification/profile controls are independent white circular buttons with soft shadows/borders.
- Do not show the old `AviloFit` wordmark in the first viewport if it breaks screenshot fidelity.

### Greeting and actions

- Greeting sits on the upper left below the nav.
- Heading is heavy, black, and compact; subtitle is small muted text.
- `Filters` and `Reports` are compact white rounded buttons aligned on the right at the same vertical band.

### Main grid

- Desktop grid uses approximately 44 percent left Summary column and 56 percent right Activity column, with spacing close to the screenshot.
- Summary card is white, rounded, and taller than the lower compact metric cards.
- Activity area has no enclosing card; the cards sit on the gray canvas under the `Activity` heading.
- Lower progress cards form a two-column row below, each white and rounded.

## Components and details

### Floating side rail

Use `ContextualUtilities` or an equivalent in `DashboardShell` to render the side rail only for the redesigned dashboard composition.

Required visible structure:

- White vertical rounded rail with soft shadow.
- Top green circular active/search button.
- Four secondary icon buttons below, matching the screenshot's simple outline stack.
- Accessible names such as `Search`, `Share`, `Calendar`, `Favorites`, and `Location` or closest existing action labels.
- On narrow widths, collapse to inline icon controls or hide with equivalent accessible actions.

### Summary card

`nutrition-summary.tsx` should become the screenshot's Summary card for this pass:

- Header: `Summary`, helper text `Track your performance.`, `Weekly` chip.
- Mini stat strip: `Calorie Intake` with `2,135,00` and `Active Burn` with `873,00`. If the punctuation looks odd, preserve it for screenshot fidelity unless Gustavo approves corrected numeric formatting.
- Seven weekday stacked bars labeled `S M T W T F S`.
- Bar order: green segment on top, yellow middle, red bottom.
- Legend rows:
  - `Carbohydrates (188gr)` with `43%` and `50% Goal`.
  - `Fat (62gr)` with `32%` and `30% Goal`.
  - `Protein (110gr)` with `25%` and `20% Goal`.
- Use CSS blocks for bars; no chart dependency.

### Activity cards

`activity-summary.tsx` should render:

- Section heading `Activity` and helper text `Track your activity.`
- Top-right circular action buttons.
- Top row:
  - Hydration, green droplet icon, `+11.5%`, `3.2 L`, sage sparkline.
  - Steps, green footsteps/icon, `+4.5%`, `12,560`, sage sparkline.
  - Sleep, dark charcoal card, green moon/icon, `-6.2%`, `7h 20m`, green sparkline.
- Bottom row:
  - Active Calories, `450 kcal`, green progress line, `-2.1%`.
  - Distance, `8.4 km`, green progress line, `+0.8km`.
  - Heart Rate, `72 bpm`, green progress line, `Stable`.
- Use CSS or inline SVG sparklines local to the component. Do not add chart libraries.

### Lower progress cards

`goal-progress.tsx` may become or provide the lower progress card treatment:

- Card 1: `Fat Loss Progress`, `Progress toward your body fat goal.`, `4.2 kg`, `53%`, small red trend icon.
- Card 2: `Protein Goal`, `Daily protein intake progress.`, `145 g/day`, `81%`, small green trend icon.
- Cards should sit at the bottom of the desktop screenshot frame with enough content visible to prove placement.

## Data and state design

The redesign remains presentation-only and deterministic:

- Prefer adapting fixture data in `fixture-dashboard-provider.ts` to contain screenshot metrics.
- If current model types are too broad or mismatched, add presentation fields such as `dashboardReferenceSummary`, `activityCards`, or `progressCards` only as read-only fixture data.
- Do not remove existing safety-oriented types unless tests confirm they are unused by the redesigned route.
- Do not introduce persistence for filters, reports, nav, or side rail actions.
- Controls that are not functional in this pass may be inert buttons if they are accessible and do not imply unavailable backend behavior. Prefer visible affordance plus no-op only when the screenshot requires the control.

## Responsive design

- At `>= 1024px`, match the desktop screenshot composition closely.
- At `768px-1023px`, use a two-column or stacked hybrid only if all cards remain readable and non-overlapping.
- At `< 768px`, stack in this order: nav/top controls, greeting/actions, Summary, Activity top cards, Activity compact cards, progress cards.
- The side rail must not create horizontal overflow on narrow viewports.
- Text must not overlap or clip inside cards. Long labels can wrap to a second line but should keep the dense metric-card feel.

## Accessibility and safety

- Preserve header/main landmarks and region labels for Summary, Activity, and Progress.
- Use buttons for interactive controls, with accessible names for icons.
- Focus states must be visible on the black pill nav, white icon buttons, side rail, Filters, Reports, and all card controls.
- The Sleep dark card must maintain readable contrast.
- Metric trend color must be supported by text and/or icon direction.
- The fixture values remain synthetic and must not be logged, sent externally, or stored.

## Dependencies

No new runtime or development dependency is authorized. Use existing `lucide-react`, React, Next.js, CSS, existing test tools, and local SVG/CSS for any chart-like details.

## Alternatives considered

| Option | Decision | Reason |
| --- | --- | --- |
| Import design with Magic/Stitch | Rejected for this spec | The screenshot is available and the work item is screenshot-driven; external access remains unreliable and is not needed for the spec. |
| Keep previous dashboard information architecture visible | Rejected for first viewport | The human instruction requires matching the photo first. Existing features can return in later iterations. |
| Build a new route for the reference design | Rejected | The task says redesign what already exists; current `/dashboard` should be reshaped. |
| Add charting library for sparklines | Rejected | Tiny decorative sparklines can be CSS/SVG and no new dependency is authorized. |
| Pixel-lock to 655x519 only | Rejected | The app must be responsive and verified at repo viewports while matching the reference proportions. |

## Requirement-to-design mapping

| Requirement | Design coverage |
| --- | --- |
| R1 | Route composition, outer frame, main grid |
| R2 | Visual layout and reference color system |
| R3 | Header controls and navigation |
| R4 | Greeting and actions |
| R5 | Floating side rail |
| R6 | Summary card |
| R7 | Activity section |
| R8 | Activity cards and CSS/SVG details |
| R9 | Lower progress cards |
| R10 | Data and state design; accessibility and safety |
| R11 | Accessibility and safety |
| R12 | Responsive design |
| R13 | File scope and route composition |
| R14 | Verification files and evidence |
| R15 | Visual layout, alternatives, and evidence expectations |

## Stop conditions

The Implementer must stop for a spec revision if matching the screenshot requires a new dependency, external design access, backend/API/schema work, real personal or health data, authentication, persistence, a new route, unlisted files, or product behavior beyond this visual redesign.
