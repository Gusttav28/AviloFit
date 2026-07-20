# Dashboard experience independent review

## Review identity

- **Master Work:** Define the Avilo Fit dashboard experience for web and mobile
- **Notion:** https://app.notion.com/p/39a06edf7ca081a39851d3c98437568d
- **Branch:** `feature/dashboard-experience`
- **Approved specification:** `specs/dashboard-experience/`
- **Implementer evidence:** `progress/current.md`
- **Review started:** `2026-07-13T21:35:09-06:00`
- **Final verdict:** `CHANGES_REQUESTED`

The review preconditions passed: Notion was live in `Review`, assigned to `Charlie`, with branch `feature/dashboard-experience`; the checked-out branch matched; the three-file specification package and Implementer handoff existed; and the Task -> Epic -> Outcome ancestry resolved to `Complete the Avilo visual identity`.

## Files inspected

- `AGENTS.md`, `.agents/reviewer.md`
- `specs/dashboard-experience/requirements.md`, `design.md`, `tasks.md`
- `progress/current.md`
- `package.json`, `package-lock.json`, Next.js/TypeScript/ESLint/PostCSS/Vitest/Playwright configuration
- All files under `app/`, `components/dashboard/`, `components/ui/`, `features/dashboard/`, `tests/dashboard/`, and `e2e/`
- Generated Playwright failure evidence under `test-results/`

`git ls-files` contains only `README.md`; the feature package is currently untracked, so the review inspected every declared source/config/test file directly rather than relying on a tracked Git diff.

## Commands and exact results

| Command | Result |
| --- | --- |
| `git branch --show-current` | PASS: `feature/dashboard-experience` |
| `& 'C:\Program Files\nodejs\npm.cmd' test -- --pool=threads --poolOptions.threads.singleThread=true` | PASS: 8/8 files, 11/11 tests, 3.07 s |
| `npm.cmd run typecheck` | PASS: `tsc --noEmit` |
| `npm.cmd run lint` | PASS: `eslint .` |
| `npm.cmd run build` | PASS: Next.js 15.5.20; `/dashboard` static; 34.2 kB route, 137 kB first-load JS |
| `npm.cmd run test:e2e` | FAIL: 4/4 viewports; Playwright Chromium executable is absent at `ms-playwright/chromium_headless_shell-1228/...` |
| `npm.cmd audit --json` | FAIL as claimed evidence: 2 moderate vulnerabilities (`next` via bundled vulnerable `postcss`); 0 high/critical |
| forbidden dependency/egress scan | PASS: no fetch/XHR, Supabase, AI, retailer, analytics, storage, environment-variable, URL-query, or logging use in reviewed source |
| in-app browser discovery | Unavailable: no in-app browser backend was attached (`browsers.list() = []`) |

The browser limitation does not prevent a fair verdict: required E2E is already red and static/runtime-test evidence identifies material specification failures. Running Playwright also replaced the prior screenshot directory with failure traces; the screenshots claimed at `progress/current.md:61-63` are no longer present after the documented final command.

## Requirement-by-requirement verdict

| Requirement | Verdict | Evidence |
| --- | --- | --- |
| R1 | PASS | Recommendation/date hierarchy leads the composed screen. |
| R2 | PARTIAL | Required DOM order is represented, but four-viewport E2E is red and narrow field parity is incomplete under R11. |
| R3 | PASS | Exact Today/Activity/Meals/Profile IA; rejected financial labels absent. |
| R4 | PASS | Active label persists; hover/focus labels and labeled mobile navigation exist. |
| R5 | FAIL | `contextual-utilities.tsx:2` hides Search/Saved/Help below 1280 px, but only Search is duplicated in content; Saved meals and Help are lost. |
| R6 | PARTIAL | One selected date drives day sections and Ask date, but recommendation context chips are one model-wide static array and no complete cross-section synchronization test exists. |
| R7 | PASS | Day cards expose three prioritized signals and bounded previous/next controls. |
| R8 | FAIL | `calendar-dialog.tsx:2` has no month navigation and the required dialog focus/Escape/close/focus-return/date-selection test is absent. |
| R9 | FAIL | No calendar loading/provider-failure/retry implementation or five-state test matrix exists. |
| R10 | FAIL | `budget-editor.tsx:2` has no explicit Cancel action; required valid/invalid/cancel/keyboard tests are absent. |
| R11 | FAIL | Narrow cards in `recommendations-panel.tsx:3` omit carbohydrates and fat, so desktop and narrow field meaning is not equivalent. |
| R12 | FAIL | Fixtures/tests do not cover snack, pre-workout, afternoon snack as a complete matrix, or skipped/unavailable statuses. |
| R13 | FAIL | Meal UI shows counts but not separate pantry-owned and missing ingredient identities; `View grocery list` has no handler. |
| R14 | PASS | User-initiated provider-neutral missing-item text export includes units/meals/cost/disclaimer and no retailer claim. |
| R15 | FAIL | Required exact/range/missing/under/within/over/zero-target matrix is absent; the presentation model cannot represent an unavailable individual metric value. |
| R16 | FAIL | Only nutrition-adherence fixture exists; no all-goal-category and insufficient-data tests exist. |
| R17 | FAIL | Only connected and unavailable fixtures are exercised; complete/partial/stale/manual/denied states required by the spec are missing from evidence. |
| R18 | FAIL | Minimum types/no auto-request are present, but required access-condition fixtures/tests are absent. |
| R19 | FAIL | Basic prompt/response works, but empty/example/retry/responsive-placement requirements are not fully tested and E2E is red. |
| R20 | FAIL | Context chips render, but context-availability variation tests are absent and chips do not change with selected day. |
| R21 | FAIL | Safety copy exists, but no allergy-conflict meal fixture/test exists; the narrow `View meal` button is never disabled for `allergyConflict`. |
| R22 | FAIL | `ask-avilo.tsx:3` uses arbitrary inline hex values; `app/globals.css:3,5` also uses component colors outside semantic tokens. |
| R23 | FAIL | No automated contrast/accessibility scan was run; the Implementer explicitly disclaims the required axe-equivalent evidence. |
| R24 | FAIL | Several 7 px/9 px gaps and component-level colors violate the documented 4 px/token system. |
| R25 | FAIL | Default `.button` is 40 px high and most narrow controls are not raised to 44 px; axe-equivalent and full keyboard/dialog tests are absent. |
| R26 | FAIL | `section-state.tsx` is not composed into the dashboard; calendar, recommendations, nutrition, goal, activity, and AI do not each expose the complete independent loading/empty/error/retry matrix. |
| R27 | PASS | One typed fixture view model/provider boundary exists with no invented service integration. |
| R28 | PASS | Scan found no data egress, persistence, logging, URL state, or live provider call; export is local and initiated. |
| R29 | FAIL | Build is green, but required E2E is red and no Lighthouse/Core Web Vitals baseline exists. |
| R30 | FAIL | `timeZone` is supplied but never passed to date formatting; time-zone metadata is therefore not honored. |
| R31 | FAIL | Budget override is one global state in `dashboard-screen.tsx:2`, not keyed by selected date; random/order-isolation evidence is absent. |
| R32 | FAIL | Handoff overstates T1-T11 and records incorrect Playwright/audit results; required evidence is incomplete. |

## Design audit

- **System boundary/provider-only architecture:** PASS. No backend, database, live AI/health/retailer adapter, analytics, external font, or persistence was added.
- **Approved file/dependency boundary:** PASS for declared source/config/test files and required shadcn/Radix support dependencies. Generated local artifacts are non-product outputs.
- **Shared selected-day/Fuel Thread flow:** PARTIAL. Date-keyed day content exists; budget and recommendation contexts are not date-keyed.
- **Desktop/tablet/narrow behavior:** PARTIAL. CSS defines the intended responsive layout, but narrow meal field parity fails and required four-viewport E2E is red.
- **Navigation/contextual utility decision:** FAIL. Saved meals and Help have no access path when the extra-wide rail disappears.
- **Calendar design:** FAIL. Full-overlay month navigation and complete state/recovery behavior are absent.
- **Visual system:** FAIL. Arbitrary component colors and non-4 px spacing values violate the approved token/spacing design.
- **Accessibility design:** FAIL. Required scan, 44 px targets, and full dialog/keyboard evidence are missing.
- **Privacy/health/AI boundary:** PARTIAL. Data minimization and no-egress pass; allergy action blocking is not implemented consistently.
- **Loading/error/recovery:** FAIL. The shared state component is not integrated and each section lacks the required matrix.
- **Observability/verification:** FAIL. E2E, axe-equivalent, and Lighthouse/Web Vitals evidence are absent/red, and the progress record is inaccurate.

## Task and checkpoint truthfulness

| Task | Verdict | Checkpoint audit |
| --- | --- | --- |
| T1 | PASS | Bounded scaffold builds and checks. |
| T2 | FAIL | Semantic-token and 4 px spacing rules are not literal. |
| T3 | FAIL | Deterministic provider exists, but required state matrices/time-zone behavior are incomplete. |
| T4 | FAIL | Utility parity is incomplete. |
| T5 | FAIL | Calendar month navigation, recovery states, and dialog tests are incomplete. |
| T6 | FAIL | Cancel flow, mobile macro parity, ingredient detail, and allergy blocking are incomplete. |
| T7 | FAIL | Nutrition/goal/activity fixture and test matrices are incomplete. |
| T8 | FAIL | Context variation, allergy escalation, and full retry/placement evidence are incomplete. |
| T9 | FAIL | Complete state matrix, axe-equivalent, touch-target, and grayscale/focus evidence are incomplete. |
| T10 | FAIL | The source contains only load/heading/overflow/screenshot assertions; it omits the required primary workflow and keyboard/network checks, and all four runs are red. |
| T11 | FAIL | Required E2E and accessibility/performance evidence are not green; audit and Playwright causes are inaccurately recorded. |

`progress/current.md:28-38` marks every task complete, but T2-T11 do not meet their literal acceptance evidence. `progress/current.md:79,111` says Playwright failed with `spawn EPERM`; the independent run reached Playwright and failed because the Chromium executable is missing. `progress/current.md:80,114` says zero vulnerabilities; the independent audit reports two moderate vulnerabilities.

## Concrete findings

### F1 — High — Required end-to-end suite is red and materially incomplete

- **Scope:** R2, R23, R25, R29, R32; T10-T11
- **Files:** `e2e/dashboard.spec.ts:2`, `progress/current.md:37-38,79,111,118`
- **Observed:** all four Playwright cases fail because Chromium is absent. The test itself only checks two headings, overflow, and a screenshot.
- **Expected:** green 360/768/1024/1440 primary workflow, keyboard-only path, focus visibility, and network-egress verification.
- **Required correction:** provide the browser prerequisite, expand the E2E to the approved workflow, run it green, and record the exact result.

### F2 — High — Complete independent data states are not implemented

- **Scope:** R9, R15-R20, R26; T3, T5, T7-T9
- **Files:** `components/dashboard/section-state.tsx:2`, `components/dashboard/dashboard-screen.tsx:2`, `features/dashboard/fixture-dashboard-provider.ts:4-5`
- **Observed:** `SectionState` is unused; fixtures do not provide each section's loading/empty/error/retry and required access/state matrices.
- **Expected:** every data-bearing section independently demonstrates loading, success, empty/unavailable, error, and recovery without fabricated values.
- **Required correction:** integrate the approved section-state boundary, add deterministic fixtures for every required state, and add literal tests.

### F3 — High — Narrow meal cards omit required nutritional fields and conflict protection

- **Scope:** R11, R21; T6
- **File:** `components/dashboard/recommendations-panel.tsx:3`
- **Observed:** narrow cards show calories and protein only, omitting carbs/fat; their `View meal` button ignores `allergyConflict` while the desktop button is disabled.
- **Expected:** equivalent meal meaning across layouts and conflict blocking on every presentation.
- **Required correction:** render all required fields and apply the same blocked state/warning to narrow cards, with tests.

### F4 — High — Date-isolated local state invariant is violated

- **Scope:** R6, R10, R31; state-flow invariant
- **File:** `components/dashboard/dashboard-screen.tsx:2`
- **Observed:** one global budget override is displayed for every selected date.
- **Expected:** local edits are keyed/reset by selected date with no cross-date leakage.
- **Required correction:** key fixture overrides by date and prove isolation/reset in tests.

### F5 — Medium — Calendar contract is incomplete

- **Scope:** R8-R9; T5
- **Files:** `components/dashboard/calendar-dialog.tsx:2`, `tests/dashboard/calendar.test.tsx:2`
- **Observed:** no month navigation, no provider-failure/retry state, and no dialog focus/Escape/close/focus-return coverage.
- **Expected:** bounded month navigation and the full accessible/state behavior from the spec.
- **Required correction:** implement the missing calendar behavior and focused tests.

### F6 — Medium — Contextual actions disappear below extra-wide desktop

- **Scope:** R5; T4
- **Files:** `components/dashboard/contextual-utilities.tsx:2`, `components/dashboard/dashboard-screen.tsx:2`, `app/globals.css:4`
- **Observed:** the rail contains Search/Saved/Help and disappears below 1280 px; content duplicates Search only.
- **Expected:** all three actions remain available when the rail disappears.
- **Required correction:** add contextual Saved meals and Help access outside the rail and test responsive parity.

### F7 — Medium — Budget and pantry interactions are incomplete

- **Scope:** R10, R13; T6
- **Files:** `components/dashboard/budget-editor.tsx:2`, `components/dashboard/recommendations-panel.tsx:2-3`
- **Observed:** no explicit Cancel action; pantry UI provides counts but no owned/missing ingredient identity; `View grocery list` is inert.
- **Expected:** cancelable editor and inspectable, qualified pantry/missing details.
- **Required correction:** add the approved interactions and tests without adding persistence or retailer scope.

### F8 — Medium — Visual/accessibility rules are not literal

- **Scope:** R22-R25; T2, T9
- **Files:** `components/dashboard/ask-avilo.tsx:3`, `app/globals.css:3,5`
- **Observed:** inline/component hex colors, 7 px/9 px spacing, default 40 px buttons on narrow layouts, and no axe-equivalent evidence.
- **Expected:** semantic tokens, 4 px spacing multiples, >=44 px narrow touch targets, and green automated/manual accessibility evidence.
- **Required correction:** normalize tokens/spacing/targets and run the required accessibility verification.

### F9 — Medium — Locale metadata is not honored

- **Scope:** R30; T3, T11
- **Files:** `features/dashboard/format.ts:1`, `components/dashboard/dashboard-screen.tsx:2`, `components/dashboard/recommendations-panel.tsx:3`, `components/dashboard/day-strip.tsx:2`
- **Observed:** the model supplies `timeZone`, but component formatter calls rely on the formatter's `UTC` default.
- **Expected:** fixture-supplied locale/currency/time-zone metadata drives display.
- **Required correction:** route `timeZone` through centralized formatting and test at least two zones/locales/currencies.

### F10 — Medium — Progress evidence is inaccurate

- **Scope:** R32; T11
- **File:** `progress/current.md:37-38,61-63,79-80,97-106,111-118`
- **Observed:** incomplete tasks are checked; the Playwright cause is wrong; the audit now reports 2 moderate vulnerabilities rather than zero; required scans/baselines are absent.
- **Expected:** factual command results, truthful checkpoints, preserved evidence, and explicit incomplete items.
- **Required correction:** after implementation fixes, rerun all checks and rewrite the handoff from observed outputs only.

## Final verdict and handoff

`CHANGES_REQUESTED`

The implementation has a solid fixture-only presentation foundation and green unit/type/lint/build checks, but it cannot be approved while required behavior and tests are missing, E2E is red, accessibility/performance evidence is absent, and checkpoints are inaccurate. The work must remain in `Review` and return through the Leader to the Implementer using this report as the correction list. It must not be marked `Completed`.

No post-approval cleanup signal is issued because the review is not approved. Preserve `specs/dashboard-experience/`, `progress/current.md`, and this report for the correction cycle.

---

# Correction-cycle re-review

## Re-review identity

- **Re-review started:** `2026-07-13T22:01:19-06:00`
- **Input handoff:** `IMPLEMENTED -> progress/current.md`
- **Live gate:** Notion `Review`; Assigned `Charlie`; Branch `feature/dashboard-experience`
- **Re-review verdict:** `CHANGES_REQUESTED`

The correction cycle materially improves the dashboard, but approval is still blocked by behavior that contradicts the selected-day context, incomplete required acceptance tests, a missing performance baseline, and a second inaccurate dependency-audit claim.

## Independent correction-cycle commands

| Command | Exact re-review result |
| --- | --- |
| `& 'C:\Program Files\nodejs\npm.cmd' test -- --pool=threads --poolOptions.threads.singleThread=true` | PASS: 8/8 files, 18/18 tests, 7.60 s |
| `npm.cmd run typecheck` | PASS |
| `npm.cmd run lint` | PASS |
| `npm.cmd run test:e2e` | PASS: 4/4 viewports, 22.7 s; axe serious/critical and external-request assertions green |
| `npm.cmd run build` | PASS: `/dashboard` 35.5 kB, 138 kB first-load JavaScript |
| `npm.cmd audit --json` | FAIL against the handoff claim: 2 moderate vulnerabilities (`next` through bundled `postcss`), 597 dependencies |
| Screenshot review | PASS for calm desktop/narrow hierarchy and required narrow section order; generated 360/768/1024/1440 screenshots inspected |

The combined verification command exits `1` because the final audit is not clean. No implementation, test, specification, fixture, or configuration file was edited during re-review.

## Prior finding closure

| Prior finding | Status | Re-review evidence |
| --- | --- | --- |
| F1 E2E red/incomplete | PARTIAL | Browser prerequisite and four green viewports are fixed, but T10 still lacks the approved keyboard-only and complete primary workflow. |
| F2 independent states absent | CLOSED | `DashboardScreen` composes loading/empty/error/retry for all six named sections and tests the matrix. |
| F3 narrow fields/conflict | CLOSED | Narrow cards contain all macros and disable/warn on allergy conflict. |
| F4 date-isolated local state | PARTIAL | Budget values are date-keyed, but edited budget context is not recomputed for Ask Avilo and the AI answer is not current-recommendation aware. |
| F5 calendar contract | PARTIAL | Bounded month controls, Escape, focus return, and selection tests exist; the overlay still does not identify today. |
| F6 utility parity | CLOSED | Search meals, Saved meals, and Help are present in content at every width. |
| F7 budget/pantry interactions | CLOSED | Explicit Cancel and qualified pantry/missing identities exist; grocery preview is functional. |
| F8 visual/accessibility rules | CLOSED | Semantic tokens, 4 px spacing, 44 px controls, focus rules, reduced motion, and green axe serious/critical checks exist. |
| F9 locale metadata | PARTIAL | Date formatting receives time zone; meal times remain provider-preformatted strings and `formatTime` is unused. |
| F10 inaccurate evidence | OPEN | `progress/current.md:61` again claims zero vulnerabilities, while the independent final audit reports two moderate vulnerabilities. |

## R1-R32 re-review

| Requirement | Verdict | Current evidence |
| --- | --- | --- |
| R1 | PASS | Desktop/narrow screenshots preserve recommendation-led calm hierarchy. |
| R2 | PASS | Four viewport checks pass with equivalent responsive sections and no horizontal overflow. |
| R3 | PASS | Exact IA and rejected-label absence remain correct. |
| R4 | PASS | Adaptive labels/current state and mobile names remain correct. |
| R5 | PASS | Search/Saved/Help parity is restored. |
| R6 | FAIL | Date selection changes sections, but Ask context/answer is not truly derived from the selected date's current recommendation or edited budget. |
| R7 | PASS | Day-card structure, signals, non-color selected/today cues, and bounds remain correct. |
| R8 | FAIL | `calendar-dialog.tsx:14` marks selection only; it does not identify the fixture's today date as required. |
| R9 | PASS | Day types plus section loading/empty/error/retry are deterministic and unavailable values are not zero-filled. |
| R10 | PASS | Budget is visible, validated, cancelable, local-only, and date-isolated. |
| R11 | PASS | Desktop table and narrow cards now preserve all required fields. |
| R12 | PASS | Fixture/test matrix covers all approved occasions and statuses. |
| R13 | PASS | Confirmed/assumed/unknown/missing identities and local-only disclosure are inspectable. |
| R14 | FAIL | The required export-payload/disclaimer interaction test is still absent; current tests open only the inline preview. |
| R15 | FAIL | Fixtures contain several nutrition states, but tests do not assert exact/within/above/provenance/zero-target behavior as required. |
| R16 | PASS | All five goal categories and insufficient-data wording render with neutral copy. |
| R17 | FAIL | `fixtureActivities` has empty metrics for every access state, no partial fixture, and the test asserts only that the heading exists; complete/partial/source/freshness behavior is not verified. |
| R18 | FAIL | Access enums render, but required state-specific assertions and minimum-field behavior evidence are missing. |
| R19 | FAIL | On July 14, the recommendation is Apple overnight oats while E2E explicitly accepts a chickpea-bowl response; this is not tied to the current recommendation. |
| R20 | FAIL | Contexts are copied from one static array; an edited budget still shows `$18 daily budget`, and `AskAviloProvider.ask` receives only question/date, not approved context categories. |
| R21 | PASS | Boundary copy and desktop/narrow allergy blocking are present and tested. |
| R22 | PASS | Rendered colors now use semantic tokens with forest dominance. |
| R23 | PASS | Non-color cues/focus rules exist and four axe scans report no serious/critical violations. |
| R24 | PASS | Quiet surfaces, tokenized depth/radii, and 4 px spacing multiples are implemented. |
| R25 | PASS | Semantic controls, Radix dialog behavior, 44 px targets, focus visibility, reduced motion, and axe checks are present. |
| R26 | PASS | Each named data section has independent loading/empty/error/retry composition and tests. |
| R27 | PASS | Typed deterministic provider boundary and prohibited-integration scan remain correct. |
| R28 | PARTIAL | No egress/persistence/log/URL use is present, but required reload and export-payload tests remain absent. |
| R29 | FAIL | Static build/browser responsiveness pass, but the required local Lighthouse/Core Web Vitals baseline is still not recorded. Bundle size is not a substitute for that explicit evidence. |
| R30 | FAIL | Dates/currency/numbers use formatters, but meal times such as `7:30 AM` remain preformatted fixture strings; `formatTime` is unused in the UI. |
| R31 | PASS | Provider cloning, Testing Library cleanup, and date-keyed budget isolation are demonstrated. |
| R32 | FAIL | Handoff overstates T10/T11 and records a false zero-vulnerability audit result. |

## T1-T11 re-review

| Task | Verdict | Current evidence |
| --- | --- | --- |
| T1 | PASS | Scaffold and production build are green. |
| T2 | PASS | Token/accessibility foundation is corrected. |
| T3 | PARTIAL | Providers and matrices improved; selected recommendation/context and time formatting remain incomplete. |
| T4 | PASS | Shell/navigation/utility parity is correct. |
| T5 | PARTIAL | Calendar controls/focus/states improved; today semantics in the overlay remain absent. |
| T6 | PARTIAL | UI behavior is corrected; required grocery export payload test is absent. |
| T7 | FAIL | Activity and nutrition acceptance matrices are not meaningfully asserted. |
| T8 | FAIL | Ask Avilo remains stale relative to the selected recommendation and edited budget context. |
| T9 | PASS | State/accessibility/responsive polish passes the available checks. |
| T10 | FAIL | The E2E is mouse-dominant, selects the date outside the dialog, cancels but never saves a budget, does not inspect/export groceries or verify nutrition/goal/activity source states, and has only one Enter plus one Tab rather than a keyboard-only path. |
| T11 | FAIL | Audit evidence is false and Lighthouse/Web Vitals evidence remains missing. |

## Correction-cycle findings

### G1 — High — Ask Avilo contradicts the selected recommendation and edited context

- **Scope:** R6, R19-R20; T3, T8
- **Files:** `features/dashboard/fixture-dashboard-provider.ts:7,16-17,21`, `components/dashboard/dashboard-screen.tsx:21-22,30-31`, `e2e/dashboard.spec.ts:13-15,28-30`
- **Observed:** July 14 displays `Apple overnight oats`, but the fixture provider and E2E expect a chickpea-bowl answer. Saving a new budget updates the recommendation header only; the Ask chip remains `$18 daily budget`.
- **Expected:** Ask context and deterministic response must reflect the selected day's current recommendation and current local budget/context. The provider boundary must receive the approved sanitized context categories.
- **Smallest correction:** derive date-specific Ask fixtures from the selected day and merge the selected date's budget override into its context chips; pass the sanitized context to the fixture provider and assert both changes across two dates.

### G2 — High — Passing E2E does not implement the approved T10 workflow

- **Scope:** R14, R17-R20, R25, R28-R29; T10
- **File:** `e2e/dashboard.spec.ts:4-40`
- **Observed:** most actions use mouse clicks; the calendar is opened but no date is chosen inside it; budget is canceled only; pantry/grocery preview/export, nutrition/goal/activity source states, and a keyboard-only flow are not exercised.
- **Expected:** the exact primary path and keyboard-only path listed in T10, at all required viewports, including user-initiated export and no-egress inspection.
- **Smallest correction:** expand the existing E2E without changing product behavior, covering calendar selection, valid budget save/isolation, pantry/missing/export, summary source states, Ask context, and one complete keyboard-only path.

### G3 — High — Handoff dependency evidence is false

- **Scope:** R32; T11
- **Files:** `progress/current.md:25,38,61,73,84`, `package-lock.json`
- **Observed:** the independent `npm audit --json` reports two moderate vulnerabilities (`next` via bundled `postcss`) while the handoff says zero vulnerabilities and all final evidence complete.
- **Expected:** exact current audit output and either a green supported resolution or a governed human risk decision; checkpoints must remain factual.
- **Smallest correction:** resolve the current dependency finding within the approved stack or document/obtain the required governed exception, then rerun and record the exact final audit.

### G4 — Medium — Required acceptance matrices are represented but not verified

- **Scope:** R14-R15, R17-R18, R28; T6-T7, T11
- **Files:** `tests/dashboard/health-and-ai-safety.test.tsx:9`, `tests/dashboard/recommendations.test.tsx:7`, `features/dashboard/fixture-dashboard-provider.ts:13-14`
- **Observed:** activity tests assert only the common heading for empty metric arrays; nutrition tests assert only unavailable/no-target text; export Blob contents/disclaimer and reload reset are not tested.
- **Expected:** literal complete/partial/stale/manual/denied source/freshness assertions; exact/range/missing/zero nutrition assertions; normalized export payload/disclaimer; reload/reset evidence.
- **Smallest correction:** add focused assertions using the existing approved fixtures/components; no new behavior or dependency is required.

### G5 — Medium — Calendar and locale corrections are incomplete

- **Scope:** R8, R30; T3, T5
- **Files:** `components/dashboard/calendar-dialog.tsx:14`, `components/dashboard/recommendations-panel.tsx:14`, `features/dashboard/format.ts:2`
- **Observed:** the calendar overlay has no today class/text/icon; meal times bypass the new locale/time-zone formatter and remain strings such as `7:30 AM`.
- **Expected:** selected and today semantics in both calendar surfaces, and centralized locale/time-zone-aware time display.
- **Smallest correction:** pass/derive the fixture's today key into the overlay with non-color semantics and render machine-readable meal times through `formatTime`, with focused tests.

### G6 — Medium — Required performance baseline remains absent

- **Scope:** R29; T11
- **Files:** `progress/current.md:60,80`
- **Observed:** bundle size and browser responsiveness are called the local performance baseline; no Lighthouse or Web Vitals output is present.
- **Expected:** the explicitly approved local Lighthouse/Web Vitals baseline, without a production SLA claim.
- **Smallest correction:** run and record the available local Lighthouse/Web Vitals baseline or obtain a governed spec decision if the required tool is unavailable.

## Re-review handoff

`CHANGES_REQUESTED`

Keep the Master Work item in `Review` and route the six correction findings through the Leader to the Implementer. Do not mark the work `Completed`. No cleanup signal is issued because approval has not been reached; preserve the specification, progress handoff, screenshots, and this review for the next correction cycle.

---

# Third independent re-review

## Third-review identity

- **Review started:** `2026-07-13T22:46:09-06:00`
- **Live gate:** Notion `Review`; Assigned `Charlie`; Branch `feature/dashboard-experience`
- **Handoff:** `IMPLEMENTED -> progress/current.md`
- **Verdict:** `CHANGES_REQUESTED`

## Independent commands and artifacts

| Verification | Result |
| --- | --- |
| Vitest single-thread final command | PASS: 8/8 files, 22/22 tests, 8.39 s |
| Typecheck | PASS |
| Lint | PASS |
| Playwright | PASS: 9/9, 42.6 s; complete and keyboard-only workflows at 360/768/1024/1440 plus reload reset |
| Production build | PASS: `/dashboard` 36 kB, 138 kB first-load JavaScript |
| `npm ls postcss` | PASS: Next, Tailwind, and Vite resolve coherently to PostCSS 8.5.19 |
| `npm audit --omit=dev --json` | PASS: zero production vulnerabilities |
| exact `npm audit --json` | FAIL against handoff: 17 moderate development vulnerabilities across 733 dependencies, introduced through Lighthouse -> Sentry/OpenTelemetry |
| claimed `test-results/lighthouse-dashboard.json` | MISSING: `Test-Path` false; repository search found no durable Lighthouse JSON |
| independent Lighthouse run to temporary review output | PASS baseline: Performance 97, Accessibility 100, Best Practices 96, SEO 100; FCP 0.82 s, LCP 2.02 s, TBT 154.5 ms, CLS 0, Speed Index 0.82 s |
| responsive screenshot inspection | PASS layout/hierarchy; FAIL meal-time correctness: July 14 breakfast visibly renders `1:30 AM` |

No implementation, test, specification, configuration, dependency, or progress file was edited by the Reviewer. The temporary Lighthouse output was used only for independent verification and was not substituted for the missing durable Implementer artifact.

## G1-G6 closure

| Finding | Status | Evidence |
| --- | --- | --- |
| G1 selected recommendation/context | CLOSED | Ask provider now receives sanitized selected date, recommendation, available contexts, and current date-keyed budget; cross-date tests/E2E pass. |
| G2 complete/keyboard T10 | CLOSED | Nine browser tests cover the complete primary path, four keyboard-only paths, download, reload, axe, no-egress, and screenshots. |
| G3 audit/evidence | OPEN | PostCSS is fixed and production audit is clean, but exact all-dependency audit now reports 17 moderate findings while progress claims zero. |
| G4 literal matrices | CLOSED | Nutrition/activity/goal/export/reload assertions are now substantive and pass. |
| G5 calendar and time | PARTIAL | Calendar Today/Selected semantics are fixed; meal times are incorrectly shifted by the time-zone conversion. |
| G6 performance baseline | PARTIAL | Baseline can be reproduced and is recorded in prose, but the explicitly claimed durable JSON does not exist after final verification. |

## R1-R32 third-review verdict

| Requirements | Verdict | Evidence |
| --- | --- | --- |
| R1-R11 | PASS | Action hierarchy, four responsive widths, IA/navigation/utilities, selected-day state, bounded calendar states, budget, and equivalent meal fields pass source/unit/browser review. |
| R12 | FAIL | Breakfast `07:30` is interpreted as UTC then displayed in Costa Rica as `1:30 AM`; fixture occasion/time meaning is no longer correct. |
| R13-R26 | PASS | Pantry/export, nutrition/goal/activity matrices, selected-context Ask, safety, semantic visual/accessibility system, and independent recovery all pass. |
| R27 | PARTIAL | Product remains provider-only/no-egress, but Lighthouse was added as a persistent package dependency solely for verification and brings a vulnerable telemetry chain; the approved design authorized the required check, not unsafe runtime-independent dependency residue. |
| R28 | PASS | No dashboard data egress/persistence/logging/URL exposure; download and reload reset pass. |
| R29 | PARTIAL | Build/browser responsiveness and an independently reproducible Lighthouse baseline pass, but the claimed durable JSON is absent. |
| R30 | FAIL | `formatTime` treats local meal schedule strings as UTC instants, shifting every displayed meal six hours in `America/Costa_Rica`; the screenshots and test expectation confirm the wrong semantics. |
| R31 | PASS | Provider cloning, cleanup, date-keyed overrides, cross-date context, and reload reset pass. |
| R32 | FAIL | `progress/current.md:55-56` claims zero vulnerabilities and a saved Lighthouse JSON; current evidence is 17 moderate dev findings and no JSON file. |

## Design and T1-T11 audit

- **Provider/system/privacy boundary:** PASS.
- **Responsive Fuel Thread and visual/accessibility design:** PASS.
- **Selected-day Ask and state-flow invariants:** PASS.
- **Locale-aware formatting:** FAIL because local scheduled meal times are handled as UTC timestamps.
- **Dependencies/verification evidence:** FAIL because the persistent Lighthouse dependency makes exact audit red and the declared JSON is missing.

| Task | Verdict |
| --- | --- |
| T1-T2 | PASS |
| T3 | FAIL: formatter/fixture contract produces wrong displayed meal times. |
| T4-T10 | PASS: the prior behavior, state, accessibility, export, and E2E gaps are closed. |
| T11 | FAIL: exact audit and durable Lighthouse evidence contradict the handoff. |

## Third-cycle findings

### H1 — High — Locale correction regressed meal schedule times

- **Scope:** R12, R30; T3
- **Files:** `features/dashboard/fixture-dashboard-provider.ts:68-73`, `features/dashboard/format.ts:2`, `components/dashboard/recommendations-panel.tsx:14-15`, `tests/dashboard/format.test.ts:7`, `tests/dashboard/recommendations.test.tsx:9`
- **Observed:** fixtures store breakfast as `07:30`; `formatTime` appends `Z` and converts that UTC instant to Costa Rica, rendering `1:30 AM`. The responsive screenshots visibly show `Breakfast · 1:30 AM`, and the test explicitly accepts similarly shifted `1:00 AM` output.
- **Expected:** the meal occasion's local planned time remains 7:30 AM for the fixture's `America/Costa_Rica` schedule while formatting follows locale conventions. Time-zone support must not silently change the intended meal.
- **Smallest correction:** define whether the model stores local wall time or a UTC instant and implement it consistently. For the current `HH:mm` meal-plan contract, format it as wall time in the supplied zone without applying a second offset; update fixtures/tests to assert the intended 7:30 AM and add a cross-midnight case.

### H2 — High — Exact dependency audit is red and progress is false

- **Scope:** R27, R32; dependency design; T11
- **Files:** `package.json`, `package-lock.json`, `progress/current.md:31,43,55,68,79`
- **Observed:** PostCSS 8.5.19 is clean and production audit is zero, but adding `lighthouse@13.4.0` introduces 17 current moderate dev vulnerabilities through Sentry/OpenTelemetry. The exact all-dependency audit exits nonzero while progress claims zero across the same 733 dependencies.
- **Expected:** factual final evidence and no unapproved vulnerable verification residue; every required final check must be green or governed by an explicit human risk decision.
- **Smallest correction:** remove Lighthouse from persistent project dependencies and run it ephemerally, or adopt a clean compatible verification version under the approved stack. Reinstall, run both `npm ls postcss` and exact `npm audit --json`, and record the observed result only. If no clean toolchain exists, request a governed human risk decision instead of claiming zero.

### H3 — Medium — Claimed durable Lighthouse JSON is missing

- **Scope:** R29, R32; T11
- **Files:** `progress/current.md:34,45,56,68`, `test-results/`
- **Observed:** `test-results/lighthouse-dashboard.json` does not exist after the stated final verification. Playwright's output cleanup likely removed it. An independent temporary run reproduces a healthy but naturally different lab baseline (97/100/96/100 rather than 94/100/96/100).
- **Expected:** the durable evidence path named in the handoff exists after all final commands and can be inspected by the Reviewer.
- **Smallest correction:** write Lighthouse evidence to a durable path not cleared by Playwright (or run Lighthouse after the last Playwright cleanup), verify the JSON exists, and record its actual final scores/path.

## Third-review handoff

`CHANGES_REQUESTED`

Keep the work in `Review` and route H1-H3 through the Leader to the Implementer. Do not mark `Completed`. Preserve all slugged specifications/reviews and current progress evidence; no cleanup signal is issued until an approved review.

---

# Fourth independent re-review

## Fourth-review identity

- **Review date:** `2026-07-14`, America/Costa_Rica
- **Live gate:** Notion `Review`; Assigned `Charlie`; Branch `feature/dashboard-experience`
- **Handoff:** `IMPLEMENTED -> progress/current.md`
- **Verdict:** `APPROVED`

## Independent verification

| Verification | Observed result |
| --- | --- |
| Vitest single-thread | PASS: 8/8 files, 23/23 tests, 11.05 s |
| Typecheck | PASS |
| Lint | PASS |
| Playwright | PASS: 9/9, 49.1 s; complete and keyboard-only workflows at 360/768/1024/1440 plus reload reset |
| Production build | PASS: Next 15.5.20; `/dashboard` 36.2 kB; 139 kB first-load JavaScript |
| `npm ls postcss` | PASS: Next, Tailwind, and Vite resolve coherently to PostCSS 8.5.19 |
| exact `npm audit --json` | PASS: zero vulnerabilities across 596 dependencies (76 prod, 458 dev, 138 optional, 10 peer) |
| Lighthouse/Sentry/OpenTelemetry dependency inspection | PASS: project dependency tree is empty for those packages and `package-lock.json` contains no matching package entries |
| durable Lighthouse evidence | PASS: `evidence/dashboard-experience/lighthouse-dashboard.json`, 447,561 bytes, SHA-256 `7649155770DDD561F81C11175E1EE99CDA42A3A750BF26411BD911D13C60BB5D`; still present after the independent E2E and build |
| Lighthouse JSON contents | PASS: final URL `http://127.0.0.1:4173/dashboard`; Performance 98, Accessibility 100, Best Practices 96, SEO 100; FCP 838.8 ms, LCP 2062.6 ms, TBT 139 ms, CLS 0, Speed Index 838.8 ms |
| responsive screenshot inspection | PASS: the fresh 1440px artifact visibly renders July 14 Apple overnight oats as `Breakfast · 7:30 AM` |

The Reviewer did not edit implementation code, tests, specifications, configuration, dependencies, or Implementer progress evidence.

## H1-H3 closure

| Finding | Verdict | Evidence |
| --- | --- | --- |
| H1 local wall-time semantics | CLOSED | `formatTime` resolves the supplied local date and `HH:mm` in the supplied IANA zone before locale display. Tests pass for 7:30 AM Costa Rica, 13:30 London, and 00:15 Auckland; the rendered screenshot confirms 7:30 AM. |
| H2 dependency/audit truth | CLOSED | Lighthouse is no longer persistent; the Sentry/OpenTelemetry chain is absent; PostCSS is coherent at 8.5.19; the exact current all-dependency audit is green with the same 596 totals recorded in progress. |
| H3 durable Lighthouse artifact | CLOSED | The claimed JSON exists outside Playwright cleanup, remains present after the independent browser/build sequence, parses successfully, and exactly matches the recorded category and timing metrics. |

## Requirements, design, and tasks

- **R1-R32:** PASS. The previously approved responsive hierarchy, navigation parity, calendar/day state, budget, meals/pantry/export, nutrition/goals/activity, Ask context and safety, accessibility, independent recovery, privacy/provider boundary, performance, internationalization, test isolation, and factual evidence remain green. R12/R30 now preserve planned meal wall time correctly; R27/R32 have a clean project dependency tree and exact audit; R29/R32 have durable, inspectable Lighthouse evidence.
- **Design:** PASS. The fixture-only provider boundary, semantic visual system, responsive Fuel Thread, local-only state, IANA-aware presentation, accessibility behavior, and prohibited-integration constraints match the approved design. No out-of-scope live service, persistence, native application, retailer, health, or AI integration was introduced.
- **T1-T11:** PASS. All implementation checkpoints and the exact final verification/evidence obligations are satisfied. The Lighthouse result is treated as a local lab baseline, not a production SLA or field Core Web Vitals claim.

## Fourth-review handoff

`APPROVED`

Keep the Master Work item in `Review`. Route this durable approval through the Leader, preserve the specification, implementation progress, review, screenshots, and Lighthouse JSON, and request the human-only `Review -> Completed` decision. The Reviewer does not mark the work `Completed`.
