# Dashboard reference redesign requirements

## Work identity

- **Master Work item:** `Redesign dashboard to match uploaded nutrition/activity reference`
- **Notion:** https://app.notion.com/p/39e06edf7ca081ba8d25cc966f35e9fb
- **Branch:** `feature/dashboard-experience`
- **Parent epic:** `Design the first six core user screens` (https://app.notion.com/p/39006edf7ca081b1b3e3e9981eb7c4f9)
- **Department / Workstream:** Brand & Design / UX / UI
- **Status at authoring:** `Not Started`
- **Reference image:** Codex uploaded screenshot `codex-clipboard-5bdb74f9-5272-440b-9b36-2844a87e4fc3.png`
- **Human direction:** Match the uploaded screenshot as exactly as possible first; future iteration happens after this baseline is in place.

## Problem and intended outcome

The current dashboard implementation was built from the earlier dashboard-experience specification. Gustavo has selected a new visual reference for the next dashboard direction. This work defines one bounded redesign pass: reshape the existing dashboard route so the first visible dashboard screen closely matches the uploaded nutrition/activity screenshot before adding new product behavior.

The intended outcome is a faithful, implementation-ready specification package for the existing web dashboard. The Implementer should be able to transform the current dashboard UI into the reference composition without guessing layout, scope, file ownership, privacy behavior, or verification evidence.

## Scope

### In scope

- Redesign the existing `/dashboard` web screen to match the screenshot's first viewport composition, hierarchy, colors, spacing, typography, card shapes, navigation, metric cards, and responsive intent.
- Preserve the existing fixture-driven dashboard architecture and synthetic data model where possible.
- Rename, restyle, reorder, or simplify visible dashboard content so the UI reads like the reference: greeting, Summary, Activity, metric cards, progress cards, Filters, Reports, centered pill nav, top-right icon buttons, and floating side rail.
- Add or adjust deterministic fixture values only as needed to render the screenshot target faithfully.
- Update existing component, CSS, unit/component, and Playwright coverage for the redesigned screen.
- Verify visual similarity with screenshots at desktop and responsive viewports.

### Out of scope

- Live Stitch, Magic MCP, Figma, or external design import.
- New backend, database, Supabase, AI SDK, health SDK, retailer integration, analytics, authentication, or persistence.
- Native mobile implementation.
- New dashboard product capabilities beyond what is necessary to reproduce the screenshot surface.
- Committing, merging, deploying, or marking the work complete.
- Replacing the repo harness or changing agent contracts.

## Definitions

- **Reference screenshot:** The uploaded image showing a rounded light-gray desktop dashboard frame with greeting, Summary, Activity cards, progress cards, floating side rail, and top navigation.
- **Screenshot-faithful:** The implemented first viewport matches the screenshot's structure, relative spacing, color roles, card hierarchy, and visible labels as closely as practical in the existing app, while preserving accessibility and privacy requirements.
- **Desktop frame:** The light gray application canvas with a large rounded outer border and clipped viewport-like container shown in the screenshot.
- **Pill navigation:** The centered black rounded top navigation with selected `Home` as a white inner pill and two compact icon-only actions to its right.
- **Floating side rail:** The vertical white rounded control rail at left of the Summary card, with a green active search button and stacked outline icons.
- **Summary card:** The left nutrition card with `Summary`, `Weekly` selector, two mini stat blocks, seven stacked macro bars, and macro legend rows.
- **Activity area:** The right section with `Activity`, small action icons, three large metric cards on the first row, and three compact metric cards on the second row.
- **Progress cards:** Lower white cards for `Fat Loss Progress` and `Protein Goal`, visible at the bottom of the screenshot.

## Requirements

### R1 - Screenshot-first first viewport

When `/dashboard` loads at desktop width, the first viewport must reproduce the reference screenshot's composition: rounded light-gray outer frame, centered black pill nav, top-right icon buttons, greeting at upper left, Filters and Reports buttons at upper right, Summary card on the left, Activity section on the right, and lower progress cards beginning below.

**Acceptance evidence:** Desktop screenshot at 1440 or nearest configured viewport compared against the reference; reviewer can identify every major reference region in the same relative position.

### R2 - Reference visual system

The screen must use the reference color world: pale gray canvas, white cards, black/charcoal text, bright green primary accent, yellow macro bars, red macro/progress accents, muted sage trend lines, and a dark charcoal sleep card. Rounded geometry and subtle shadows/borders must match the soft card treatment in the screenshot.

**Acceptance evidence:** CSS/token review plus screenshot confirming no broad purple/blue/orange theme remains and no earlier cream/forest dashboard aesthetic dominates this screen.

### R3 - Top navigation and icon buttons

The header must visually match the reference: a centered black pill navigation near the top edge, `Home` selected inside a white rounded pill with a home icon and label, two compact icon-only nav buttons to the right inside the black pill, and two white circular icon buttons in the top-right corner. All icon-only controls must have accessible names and focus states.

**Acceptance evidence:** Component or E2E assertions for visible `Home`, accessible icon names, focus order, and desktop screenshot placement.

### R4 - Greeting and utility actions

The greeting region must show the headline `Keep it up, Uzui!` with the subtitle `Track your nutrition, activity, and goals`. `Filters` and `Reports` buttons must sit to the right in white rounded controls with matching icons. The UI must not show the previous `Today's fuel thread` or `Good evening. Let's make the next meal easy.` copy in this redesigned first viewport.

**Acceptance evidence:** Text assertions confirm new copy is present and previous hero copy is absent.

### R5 - Floating side rail

At desktop width, a floating vertical rail must overlap or sit beside the left Summary area as in the screenshot. It must include a green circular active/search control at the top and stacked secondary icon controls below. The rail must be keyboard accessible, have accessible names/tooltips, and not be the only way to reach any necessary action.

**Acceptance evidence:** Screenshot confirms rail placement; accessibility test confirms names and keyboard operation.

### R6 - Summary card content

The Summary card must faithfully render the reference structure: title `Summary`, helper text `Track your performance.`, a `Weekly` selector chip, mini stat area for `Calorie Intake` and `Active Burn`, seven weekday stacked bars, and a macro legend with carbohydrates, fat, and protein rows, percentages, and goal text.

**Acceptance evidence:** Component tests assert visible labels and seven day bars; screenshot confirms stacked green/yellow/red bars and legend placement.

### R7 - Activity section content

The Activity section must render `Activity` with helper text `Track your activity.`, small circular action icons at the section's upper right, and the six metric cards from the reference: Hydration, Steps, Sleep, Active Calories, Distance, and Heart Rate.

**Acceptance evidence:** Component tests assert all six cards and section controls; screenshot confirms card grid proportions.

### R8 - Metric card visual treatment

The first Activity row must use three tall cards: Hydration, Steps, and dark Sleep. Hydration shows `3.2 L`; Steps shows `12,560`; Sleep shows `7h 20m`. The second row must use three compact cards: `450 kcal`, `8.4 km`, and `72 bpm`. Trend indicators and small sparkline/progress details must be visible without using an external charting dependency.

**Acceptance evidence:** Tests assert values and labels; screenshot confirms dark Sleep card and inline trend/progress visuals.

### R9 - Lower progress cards

Below the Summary and Activity region, the first viewport must show the top portions of two white progress cards: `Fat Loss Progress` with `4.2 kg` and `Protein Goal` with `145 g/day`. Each card must include short supporting text, a small trend icon, and a green percentage value near the lower right.

**Acceptance evidence:** Screenshot at desktop shows both lower cards entering the viewport; tests assert labels and values.

### R10 - Existing data boundaries

The redesign may reshape existing fixture/presentation values to match the screenshot, but it must remain deterministic and synthetic. It must not add real health data, user identifiers, external requests, secrets, live AI calls, or persistence.

**Acceptance evidence:** Repository scan and network/E2E observation confirm no new service calls, credentials, or persistence paths.

### R11 - Accessibility preservation

The screenshot-faithful design must remain accessible: semantic landmarks, headings in logical order, accessible icon names, visible focus states, keyboard operability, reduced-motion compliance, non-color cues where state matters, and WCAG 2.2 AA contrast for text and controls.

**Acceptance evidence:** Unit/component accessibility assertions, Playwright keyboard walkthrough, and automated accessibility scan with no serious or critical violations.

### R12 - Responsive behavior

At tablet and narrow widths, the desktop composition must adapt without horizontal page overflow. The content should preserve the screenshot hierarchy in this order: top nav/header controls, greeting/actions, Summary, Activity cards, progress cards. The floating rail may collapse into accessible inline icon controls or hide only if equivalent actions remain reachable.

**Acceptance evidence:** Screenshots and E2E checks at 360, 768, 1024, and desktop widths show no overlap, clipping, unreadable text, or horizontal scroll.

### R13 - Current architecture compatibility

The implementation must work within the existing Next.js dashboard route and current fixture-driven component structure. It must not introduce a new app route, replace the provider boundary with network data, or rewrite unrelated dashboard test infrastructure.

**Acceptance evidence:** Changed-file review confirms edits stay within listed dashboard app, component, feature, style, and test files.

### R14 - Test and visual evidence

The Implementer must update tests and E2E evidence so the redesign is verifiable. Evidence must include responsive screenshots, text/value assertions, navigation/accessibility checks, and a final requirement checklist.

**Acceptance evidence:** Passing `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, and `npm run test:e2e` where available, plus recorded screenshots/evidence in the Implementer handoff.

### R15 - Derived: reference matching tolerance

**Derived from R1-R9.** Exact pixel-perfect matching is required as the target, but practical acceptance allows small differences caused by browser rendering, available icon glyphs, viewport aspect ratio, and accessibility-preserving touch/focus sizing. Any intentional visible deviation from the screenshot must be documented for human review.

**Acceptance evidence:** Visual review notes any deviations and ties them to technical/accessibility constraints, not preference.

## Source-to-requirement traceability

| Requested behavior or source criterion | Requirements |
| --- | --- |
| "New design ... redesign what we already have" | R1, R10, R13 |
| "Exactly like as it show there in the photo" | R1-R9, R15 |
| Light gray rounded desktop frame | R1, R2 |
| Centered black pill nav with selected Home | R3 |
| Top-right icon buttons | R3 |
| Greeting, Filters, Reports | R4 |
| Floating side rail | R5 |
| Summary card with weekly selector, stats, bars, legend | R6 |
| Activity metric cards and dark Sleep card | R7, R8 |
| Lower progress cards | R9 |
| Work from existing dashboard first | R10, R13 |
| Future iterations later | R13-R15 |
| Preserve repo agent/governance process | R14 |

## Assumptions and open questions

- The reference screenshot is the authoritative visual target for this pass, even if some metric values differ from earlier Avilo fixtures.
- `Uzui` is treated as screenshot copy for this visual pass, not as authenticated user data.
- Icon glyphs may use the existing `lucide-react` dependency where available; the exact glyph may differ slightly if an exact screenshot icon is unavailable.
- The screenshot appears to be approximately 655 by 519 pixels. Implementation should scale the same composition to the repo's E2E viewport sizes instead of hard-coding that bitmap size.
- No blocking behavioral question remains for specification. Any future product meaning changes should be a separate governed iteration.

## Human approval gate

After this package is moved to `Defining`, Gustavo must review the three spec files. Only Gustavo may move the work item from `Defining` to `In Progress`. That transition authorizes the Implementer to begin; this package does not implement the redesign.
