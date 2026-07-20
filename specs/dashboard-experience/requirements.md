# Avilo Fit dashboard experience requirements

## Work identity

- **Master Work item:** `Define the Avilo Fit dashboard experience for web and mobile`
- **Notion:** https://app.notion.com/p/39a06edf7ca081a39851d3c98437568d
- **Branch:** `feature/dashboard-experience`
- **Goal chain:** Task -> `Design the first six core user screens` -> `Complete the Avilo visual identity`
- **Reference:** `C:\Users\gustt\Downloads\AviloFitDash.jpeg`
- **Status at authoring:** `Not Started`
- **Approved exception:** Gustavo approved specification of the initial Next.js dashboard file structure even though no application scaffold exists. This exception authorizes specification only.

## Problem and intended outcome

People who have activity, nutrition, budget, pantry, and grocery information still need one calm answer to the practical question: **what should I eat next, why does it fit me, what will it cost, and what do I need to buy?** The first dashboard must make that answer easy to find while preserving enough detail to understand progress and recommendation context.

The same product language must serve the web platform and future native mobile application. The web dashboard may show more information in parallel; narrow and mobile layouts must preserve the same priority and meaning in a stacked flow.

## Scope

### In scope

- A responsive, web-first dashboard experience that defines the corresponding mobile information hierarchy.
- Adaptive primary navigation, a contextual utility pattern, a day-card calendar/timeline, meal recommendations with budget and pantry context, nutrition and goal summaries, activity summaries, and the `Ask Avilo` surface.
- Typed presentation models, provider boundaries, and deterministic fixtures needed to demonstrate every state before live services exist.
- Accessible, privacy-aware, health-safe presentation and interaction states.
- Component, integration, accessibility, and responsive verification planned for the implementation phase.

### Out of scope

- Native React Native/Expo implementation; this package defines its shared product language but implements web first.
- Authentication, persistence, Supabase schema/migrations, live health sync, live AI generation, geolocation, retailer checkout, direct Walmart or other retailer integration, and production APIs.
- Medical diagnosis, treatment, prescribing, clinical alerts, or claims that a recommendation replaces professional care.
- Nutritionist-facing screens, onboarding, settings implementation, recipe-detail implementation, grocery checkout, dark mode, localization beyond locale-aware formatting, or final brand approval.
- A user-facing web/mobile mode switch. Layout changes responsively.

## Definitions

- **Selected day:** The date whose meals, nutrition, goals, activity, and AI context are shown.
- **Allowed future planning date:** A fixture/provider-supplied date for which a planned meal or recommendation can be displayed. The UI must not imply arbitrary future health observations.
- **Meal occasion:** One of breakfast, snack, pre-workout, lunch, afternoon snack, dinner, or another provider-supplied display label.
- **Nutritional contribution:** Calories and macro contribution attributed to a planned/recommended meal, never a clinical assessment.
- **Observed data:** Activity or health information received from a permissioned source or manually supplied; it is not editable from this dashboard.
- **Planned data:** Recommendations, meal plans, targets, and budget allocations that may describe future intent.
- **Freshness:** The source and last successful update time displayed with integrated activity data.
- **Provider-neutral export:** A downloadable/shareable grocery-list representation. It does not promise direct retailer cart creation.
- **Context chip:** A visible statement of which approved input categories informed an AI recommendation, not proof of causal correctness.
- **Provisional token:** A semantic design token whose exact color value may change after visual-identity approval without changing its role.

## Functional and quality requirements

### R1 — Calm action-first hierarchy

When the dashboard loads, an authenticated-demo user must be able to identify the selected day, the next recommended meal/action, the reason/context for it, current nutrition/activity progress, and the next available action without reading every card. The primary recommendation and date context lead; supporting summaries remain visually quieter. The interface must feel calm, easy, and information-rich without presenting all data at equal emphasis.

**Acceptance evidence:** Desktop and narrow screenshots plus a hierarchy walkthrough identifying each level; design review confirms the primary action remains obvious under the squint test.

### R2 — Shared responsive product language

The same semantic sections, labels, data states, and component language must render at desktop and narrow/mobile widths. Desktop may place related sections in parallel columns. At narrow widths, content must stack in this order: date context, next meal/recommendations, `Ask Avilo`, nutrition/goals, activity. No horizontal page scrolling and no user-facing web/mobile switch are allowed.

**Acceptance evidence:** Automated viewport checks at 360, 768, 1024, and 1440 CSS pixels; screenshots show equivalent information and the required narrow ordering.

### R3 — Primary information architecture

The top primary navigation must represent these destinations: `Today` (dashboard/home), `Activity`, `Meals` (meal plan, grocery, and budget entry point), and `Profile` (profile/settings entry point). `Today` is active in this feature. Financial-template labels such as Wallets, Receipts, Contributions, Owes, and Transactions must not appear.

**Acceptance evidence:** Navigation component test asserts exact destinations and active state; text scan demonstrates rejected financial labels are absent.

### R4 — Adaptive navigation behavior

At desktop widths, primary destinations may be icon-first, but the active destination must show a persistent text label. Hover, keyboard focus, or explicit activation must reveal an accessible text label for inactive destinations without moving focus or obscuring adjacent controls. At narrow widths, navigation becomes a labeled bottom or compact top navigation with at least a visible active label. Icon meaning may never be the only accessible name.

**Acceptance evidence:** Pointer and keyboard interaction tests; accessibility tree contains names and current-page state; reduced-motion verification.

### R5 — Contextual utilities, not a permanent generic rail

The financial reference's left rail must not be copied as permanent desktop decoration. Search and saved items belong in the primary content context; share/export appears only on exportable content; help belongs to Profile/support. A slim utility rail may appear at extra-wide desktop widths only when it contains labeled or tooltip-accessible shortcuts to `Search meals`, `Saved meals`, and `Help`; it must disappear below that breakpoint without removing access to those actions.

**Acceptance evidence:** Responsive tests prove no lost action when the rail disappears; keyboard and accessible-name checks cover all utility actions.

### R6 — Shared selected-day context

Selecting a day in either the day-card strip or full calendar must update one shared selected-day state used by meal recommendations, nutrition summary, goal context, activity summary, and `Ask Avilo` context. The visible heading must announce the selected date. A selection change must not alter data for another date or imply persistence when fixtures are used.

**Acceptance evidence:** Integration test selects multiple dates and verifies every section's date key/content changes consistently; selected date is announced to assistive technology.

### R7 — Day-card timeline

The dashboard must show a horizontally navigable strip of large rounded day cards. Each card contains a circular weekday/date marker and no more than three concise signals in this priority: plan/completion state, primary activity signal, and primary meal/nutrition signal. Today and the selected day must be distinguishable by text/icon/shape as well as color. Previous controls navigate history; next controls navigate only to provider-supplied allowed planning dates.

**Acceptance evidence:** Component tests for card content limit, today/selected semantics, backward navigation, allowed future boundary, and disabled end control.

### R8 — Calendar detail and modal

Activating `Open calendar` must open a keyboard-accessible modal or popover that uses the same day-card language, identifies selected/today states, permits month navigation only across available data/planning bounds, and returns focus to its trigger when closed. Selecting a date closes the overlay and applies R6. Escape and an explicit close control must work.

**Acceptance evidence:** Dialog accessibility test covers focus trap, Escape, close control, focus return, and date selection; visual evidence demonstrates card-language continuity.

### R9 — Calendar loading, empty, future, and failure states

Calendar/day data must distinguish loading, a day with no recorded activity/meals, a future planning day, unavailable data, and provider failure. Empty days use neutral copy and an available planning/logging action; future days show planned data only; failure state provides retry. No zero value may be substituted for unavailable health data.

**Acceptance evidence:** Deterministic fixtures and tests cover all five states and confirm unavailable values render as unavailable rather than zero.

### R10 — Visible, editable budget context

The recommendation surface must show the selected period's budget at its upper-right on desktop and near its heading on narrow screens. `Edit budget` opens a local demo control with a currency amount and cadence (`meal`, `day`, or `week`), validates a non-negative finite value, supports cancel, and updates displayed fixture state on save. The UI must label fixture-only behavior and must not claim server persistence.

**Acceptance evidence:** Form tests cover open, valid save, cancel, negative/non-number error, keyboard operation, and non-persistence disclosure.

### R11 — Meal recommendation content

For the selected day, each meal row/card must present: meal name; meal occasion/time; concise nutritional contribution (calories, protein, carbohydrates, fat); estimated cost and currency; recommendation status; pantry coverage; missing-grocery count; and a clear primary action such as `View meal`. Desktop may use a semantic table; narrow layouts must transform each row into a readable card without changing field meaning.

**Acceptance evidence:** Desktop table semantics test, narrow-card content test, representative screenshot, and fixture coverage for every required field.

### R12 — Meal timing and status language

The interface must support breakfast, snack, pre-workout, lunch, afternoon snack, and dinner while accepting a provider-supplied localized display label for future occasions. Status must distinguish recommended, planned, prepared/completed, skipped, and unavailable without moral judgment. The dashboard must not infer that a meal was eaten merely because it was recommended.

**Acceptance evidence:** Fixture-driven test renders every occasion and status; copy review confirms no shame language and no recommendation/completion conflation.

### R13 — Pantry and grocery states

Meal details must identify pantry-owned ingredients separately from missing ingredients. Pantry state may be `confirmed`, `assumed`, or `unknown`; assumed/unknown must not be presented as fact. Missing items must be available through `View grocery list`. Changes in the demo may update local fixture state only and must disclose that no inventory sync occurs.

**Acceptance evidence:** Tests cover confirmed, assumed, unknown, and missing states; UI evidence shows source qualification and local-only disclosure.

### R14 — Provider-neutral grocery export

The recommendation area must offer `Export grocery list` for missing ingredients using a provider-neutral printable/downloadable or share-ready list. The export includes ingredient, quantity/unit when known, associated meal(s), estimated line cost when known, and an estimate disclaimer. Direct retailer handoff must be labeled `Coming later` or omitted unless a real approved adapter exists. Walmart or another retailer must not be implied as integrated.

**Acceptance evidence:** Export test verifies normalized list content and disclaimer; text scan confirms no retailer integration claim.

### R15 — Nutrition summary

The nutrition summary must show calories, protein, carbohydrates, and fat for the selected day with consumed/planned amount, target or range, unit, and progress. Range/target provenance must be labeled (`Your plan`, `Nutritionist plan`, or `Demo target`). Values outside a range use neutral language such as `below range` or `above range`, never diagnosis or blame. Missing targets show `No target set` rather than fabricated percentages.

**Acceptance evidence:** Tests cover exact target, range, missing target, under/within/over range, provenance labels, and zero target safety.

### R16 — Goal progress

The goal surface must support weight loss, weight gain/muscle gain, maintenance, general health, and nutrition-adherence goals. It must show an approved measure, time window, trend, and target/range where provided. Trends must be descriptive (`moving toward range`, `stable`, `not enough data`) and must not guarantee results, prescribe a rate, or shame the user.

**Acceptance evidence:** Fixture tests for all goal categories, insufficient data, and neutral copy; product-safety review of all goal messages.

### R17 — Activity summary

The activity section must support steps, heart/activity metrics, sleep duration, active calories, and workouts for the selected day. Every metric displays its source and freshness when integrated. Heart-related data must be labeled as recorded activity data, not interpreted as a medical finding. Metrics may be rearranged by available data but cannot disappear silently when permission is denied or sync is stale.

**Acceptance evidence:** Tests for complete, partial, stale, manual, unavailable, and permission-denied activity fixtures; source/freshness visible in screenshots.

### R18 — Health-data permission and minimum access

The presentation adapter must receive only the fields required by R17. The UI must distinguish not connected, permission denied, temporarily unavailable, and stale sync. It must offer a contextual `Manage connection` action without requesting permissions on dashboard load. Fixtures and logs must contain no real personal health data.

**Acceptance evidence:** Type review shows minimum presentation fields; state tests cover each access condition; repository scan confirms synthetic fixtures and no credentials/PHI.

### R19 — Ask Avilo signature surface

`Ask Avilo` must be a prominent composer tied to the selected day and current recommendation. It must accept a question, expose example prompts focused on cook/buy/prep/swap decisions, and render a deterministic demo response through an adapter. It must be reachable near recommendations on desktop and immediately after recommendations on narrow layouts.

**Acceptance evidence:** Interaction test covers submit, empty input prevention, example prompt, response, retry, and responsive placement.

### R20 — Explainable recommendation context

The recommendation and `Ask Avilo` response must show available context chips for budget, activity, nutrition goal/plan, preferences/restrictions, pantry, and nearby grocery context. Each chip opens or exposes plain-language source/freshness/detail and explicitly marks missing or demo context. The UI must not claim that every category was used when it was unavailable.

**Acceptance evidence:** Tests vary context availability and assert chip presence/detail; screenshot demonstrates explanation without exposing raw sensitive records.

### R21 — AI and nutrition safety boundaries

Every AI response/recommendation surface must label output as assistance, not diagnosis or professional care; avoid diagnosis, treatment, medication, eating-disorder coaching, unsafe rapid-weight promises, or certainty claims; and provide a neutral escalation message for questions requiring a qualified professional. Allergy/restriction conflicts in fixtures must block the affected meal action and display a concrete warning rather than generating a workaround.

**Acceptance evidence:** Safety-copy snapshot, allergy-conflict test, prohibited-claim text scan, and reviewer checklist against Product Review boundaries.

### R22 — Semantic color system

The UI must use semantic tokens, with exact hex values marked provisional pending visual-identity approval: forest green for identity and primary action; warm cream plus charcoal for canvas and text; sage for nutrition/progress support; orange sparingly for movement/active-energy emphasis; and blue sparingly for information, integrations, and connected-health context. Green, orange, and blue must not receive equal visual weight. No arbitrary component hex values are allowed.

**Acceptance evidence:** Token audit maps every rendered color to a semantic token; visual review confirms forest green dominance and sparse semantic accents.

### R23 — Contrast and non-color cues

Text and interactive controls must meet WCAG 2.2 AA contrast (4.5:1 normal text, 3:1 large text and meaningful graphical/control boundaries). Selected, current, success, warning, error, stale, and denied states must use text, icon, or shape in addition to color. Focus indication must meet 3:1 adjacent contrast and remain visible in every surface.

**Acceptance evidence:** Automated contrast/accessibility scan plus manual focus and grayscale review.

### R24 — Quiet visual system

The dashboard must use warm surface shifts, subtle borders and at most subtle shadows as one coherent depth strategy; consistent spacing based on a 4px unit; a documented radius scale; and a four-level text hierarchy. Inputs appear inset relative to their parent. Pure-white cards on colored backgrounds, harsh borders, decorative gradients, large dramatic shadows, and color-only decoration are prohibited.

**Acceptance evidence:** CSS token review, visual regression evidence, and design checklist for depth/spacing/radius/type consistency.

### R25 — Interaction accessibility

All actions must be keyboard operable with logical focus order, accessible names, visible focus, and at least 44 by 44 CSS-pixel touch targets on narrow layouts. Semantic headings, landmarks, table markup where applicable, dialog semantics, status announcements, and error associations are required. Motion must be brief and functional and must be removed or reduced under `prefers-reduced-motion`.

**Acceptance evidence:** Keyboard walkthrough, automated axe-equivalent scan with no serious/critical violations, touch-target check, and reduced-motion test.

### R26 — Complete data states and recovery

Every data-bearing section (calendar, recommendations, nutrition, goal, activity, AI) must have loading, success, empty/unavailable, error, and retry/recovery behavior. Skeletons must preserve approximate layout without presenting fake values. One section failing must not replace the whole dashboard with an error. Error text must identify the affected section without exposing internal details.

**Acceptance evidence:** Fixture/story matrix and integration tests show independent section failures and recoveries; no fake numeric value appears during loading/error.

### R27 — Presentation adapters and fixture honesty

The web feature must consume a single typed dashboard view model through provider interfaces. The initial provider is a deterministic static fixture. Health, AI, grocery, and persistence contracts must remain presentation adapters only; no unapproved backend endpoint, database schema, geolocation lookup, retailer API, or AI SDK may be invented. Demo/estimated/stale values must be labeled.

**Acceptance evidence:** Architecture review of types and imports, deterministic fixture tests, and scan confirming no network call or secret/config requirement.

### R28 — Privacy by presentation

The initial dashboard must not transmit, persist, log, or place in URLs any prompt, health, goal, budget, pantry, or grocery data. Client-side demo state must reset on reload. Visible source details reveal category and freshness, not raw records or identifiers. Export must be user initiated and include only the selected grocery-list content.

**Acceptance evidence:** Network inspection shows no dashboard data egress; URL/log scan; reload test; export payload review.

### R29 — Performance and resilience

With deterministic fixtures, the dashboard route must render meaningful structure without waiting for network data, avoid layout shift caused by late section sizing, and keep navigation/date/recommendation interactions responsive. The implementation must pass the repository's eventual production build and establish a measured baseline for route bundle and Core Web Vitals without claiming a production SLA.

**Acceptance evidence:** Successful build, local Lighthouse/Web Vitals baseline recorded, no unexpected network requests, and visual layout-shift review.

### R30 — Locale-aware display without premature localization scope

Dates, times, currency, units, and numbers must use centralized locale-aware formatters and fixture-supplied currency/time-zone metadata. English copy is acceptable for this feature; Spanish translation and language switching remain out of scope. No hard-coded US retailer, dollar symbol, or date order may be embedded in components.

**Acceptance evidence:** Formatter tests cover at least two locales/currencies and component scan confirms centralized formatting.

### R31 — Derived: deterministic state isolation

**Derived from R6, R10, R26, R27, and R28.** Fixture data and local edits must be keyed by selected date and resettable so tests can independently reproduce every state without order dependence. This is necessary to verify approved behavior and does not add user-visible capability.

**Acceptance evidence:** Tests run in random/isolated order with state reset and no cross-date leakage.

### R32 — Derived: traceable implementation evidence

**Derived from the approved engineering standards.** Implementation handoff must record the branch, changed files, requirement checklist, test/build/lint commands and results, responsive screenshots, accessibility evidence, known limitations, and any justified deviation. No deviation may change behavior, safety, privacy, architecture, or scope without a spec revision and human approval.

**Acceptance evidence:** Completed review-evidence checklist linked from `progress/current.md` before Reviewer invocation.

## Source-to-requirement traceability

| Approved behavior or source criterion | Requirements |
| --- | --- |
| Easy, calm, understandable, detailed without overwhelm | R1, R2, R24, R25 |
| Shared web/mobile language; web parallel, mobile stacked; no switch | R2 |
| Expandable top icon navigation | R3, R4 |
| Questioned left search/favorite/share rail | R5 |
| Rounded calendar cards, circle day marker, history/future carousel, full calendar | R6-R9 |
| Budget at recommendation header and editable | R10 |
| Meals by name, occasion/time, nutrition, cost | R11, R12 |
| Pantry-owned vs missing groceries; retailer/list export | R13, R14 |
| Calories, protein, carbohydrates, fats | R15 |
| Loss/gain/maintenance/adherence progress | R16 |
| Steps, heart/activity metrics, sleep, active calories, workouts | R17, R18 |
| `Ask Avilo` with budget/activity/goals/pantry/grocery context | R19-R21 |
| Forest green, cream/charcoal, sage, sparse orange and blue | R22-R24 |
| Accessible states, motion, errors, loading, stale/denied data | R23-R26 |
| Approved modular-monolith/web-first architecture without invented services | R27-R29 |
| International-ready formatting without expanding localization | R30 |
| Harness evidence and deterministic verification | R31, R32 |

## Assumptions and non-blocking limitations

- This package defines and implements a responsive web dashboard first. Native Expo work will reuse the information hierarchy in a separately governed item.
- Exact palette hex values, typography family, and final logo treatment are provisional until the visual-identity Outcome is approved. Semantic roles and accessibility constraints are fixed.
- Fixture values are synthetic and illustrative. No live provider, retailer, AI, location, authentication, or persistence contract is approved by this specification.
- The initial navigation destinations are information-architecture commitments; routes beyond `Today` may be disabled placeholders or absent until governed work exists.
- Direct retailer handoff is explicitly integration-dependent. Provider-neutral grocery export is the only approved export behavior here.
- English interface copy is used initially; formatter architecture must not prevent later localization.

## Human approval gate

After this package moves the work item to `Defining`, Gustavo must review all three files. Only Gustavo may change the task to `In Progress`. That transition is the authorization for the Implementer to begin; this specification does not launch implementation.
