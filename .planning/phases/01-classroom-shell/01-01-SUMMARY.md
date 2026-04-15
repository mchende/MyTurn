---
phase: 01-classroom-shell
plan: 01
subsystem: ui
tags: [nextjs, react, tailwindcss, shadcn, vitest, playwright]
requires: []
provides:
  - "Next.js 16 App Router classroom shell with root layout and global classroom tokens"
  - "shadcn new-york preset wired to src/app/globals.css"
  - "Vitest and Playwright Wave 0 harness with downstream placeholder specs"
affects: [phase-01, classroom-shell, testing]
tech-stack:
  added: [next, react, react-dom, typescript, tailwindcss, @tailwindcss/postcss, zod, shadcn-ui, vitest, @testing-library/react, @testing-library/jest-dom, playwright]
  patterns: [app-router-shell, tablet-first-design-tokens, wave-0-test-placeholders]
key-files:
  created: [package.json, components.json, src/app/layout.tsx, src/app/globals.css, vitest.config.ts, playwright.config.ts, test/unit/lesson-schema.test.ts, test/unit/classroom-shell.test.tsx, test/e2e/classroom-entry.spec.ts]
  modified: [package-lock.json]
key-decisions:
  - "Use Plus Jakarta Sans and Manrope token fallbacks to match the approved UI contract while keeping classroom-focused body and display font variables."
  - "Scope Vitest to test/unit so placeholder Playwright specs do not break the unit runner."
  - "Keep Wave 0 tests intentionally skipped with explicit handoff comments instead of fake passing assertions."
patterns-established:
  - "App Router foundation: root layout and globals live under src/app and expose classroom-themed tokens for later pages."
  - "Validation entrypoints: unit tests live in test/unit and e2e smoke tests live in test/e2e with explicit downstream replacement notes."
requirements-completed: [PLAT-01]
duration: 2m
completed: 2026-04-15
---

# Phase 1 Plan 1: Classroom Shell Summary

**Next.js 16 classroom shell with tablet-first design tokens, shadcn new-york preset, and Wave 0 unit/e2e test entrypoints**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-15T21:51:45+08:00
- **Completed:** 2026-04-15T13:54:05Z
- **Tasks:** 2
- **Files modified:** 15

## Accomplishments

- Built the repo's initial Next.js App Router shell with root layout metadata, home placeholder, and classroom-specific global tokens.
- Wired the base UI stack around Tailwind v4 and shadcn `new-york` so later plans can add shared primitives without redoing setup.
- Established Wave 0 validation entrypoints for unit, component, and e2e coverage with explicit handoff comments for 01-02 and 01-04.

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold the web app shell and classroom design system** - `9e94a5a` (feat)
2. **Task 2: Establish Wave 0 test harness and placeholder specs** - `2160336` (test)

## Files Created/Modified

- `package.json` - Declares the Next.js, Tailwind, testing, and utility stack plus execution scripts.
- `package-lock.json` - Locks the exact dependency graph required for the scaffold and validation harness.
- `components.json` - Registers the shadcn `new-york` preset and project aliases.
- `src/app/layout.tsx` - Defines the root HTML shell and metadata for the classroom app.
- `src/app/globals.css` - Declares tablet-first classroom tokens, theme mappings, and base surface styling.
- `vitest.config.ts` - Configures jsdom-based unit/component testing under `test/unit`.
- `playwright.config.ts` - Configures the e2e harness against the local Next dev server.
- `test/unit/lesson-schema.test.ts` - Provides the Wave 0 placeholder for schema and access-state coverage.
- `test/unit/classroom-shell.test.tsx` - Provides the Wave 0 placeholder for responsive classroom-shell assertions.
- `test/e2e/classroom-entry.spec.ts` - Provides the Wave 0 entry-flow smoke placeholder for the homepage and classroom route.

## Decisions Made

- Used classroom-specific design tokens in `globals.css` instead of generic dashboard colors so later Phase 1 UI work inherits the intended classroom tone by default.
- Added both `playwright` and `@playwright/test` in the validation stack so the explicit e2e runner and test imports work without hidden transitive assumptions.
- Limited Vitest discovery to unit tests to keep the Wave 0 Playwright placeholder skipped under the correct runner.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Resolved `typescript-eslint` peer conflict with TypeScript 6**
- **Found during:** Task 2 (Establish Wave 0 test harness and placeholder specs)
- **Issue:** `typescript-eslint@8.46.1` rejected the plan-mandated `typescript@6.0.2`, blocking `npm install`.
- **Fix:** Upgraded `typescript-eslint` to `8.58.2`, the compatible range that supports `<6.1.0`, and completed install normally.
- **Files modified:** `package.json`, `package-lock.json`
- **Verification:** `npm install` completed successfully.
- **Committed in:** `2160336` (part of task commit)

**2. [Rule 1 - Bug] Prevented Vitest from collecting the Playwright placeholder spec**
- **Found during:** Task 2 (Establish Wave 0 test harness and placeholder specs)
- **Issue:** `npx vitest run` treated the skipped Playwright file as a Vitest suite and failed before downstream plans could use the harness.
- **Fix:** Restricted `vitest.config.ts` to `test/unit/**/*.test.{ts,tsx}`.
- **Files modified:** `vitest.config.ts`
- **Verification:** `npx vitest run` completed with skipped placeholders instead of failing.
- **Committed in:** `2160336` (part of task commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes were required to make the planned validation stack installable and runnable. No scope creep.

## Issues Encountered

- The provided task version for `typescript-eslint` was stale against the required TypeScript version and had to be updated to the compatible latest patch release.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `src/app`, `components.json`, and the test harness are ready for 01-02 through 01-04 to add lesson schema, homepage schedule, and classroom routes.
- The three placeholder tests intentionally remain skipped until their target features exist.

## Known Stubs

- `test/unit/lesson-schema.test.ts:3` keeps the schema contract as a Wave 0 placeholder until 01-02 provides real lesson data and selectors.
- `test/unit/classroom-shell.test.tsx:3` keeps responsive classroom assertions deferred until 01-04 ships the actual layout.
- `test/e2e/classroom-entry.spec.ts:3` leaves the homepage entry smoke test skipped until 01-04 creates the homepage copy and lesson route.

## Self-Check

PASSED

---
*Phase: 01-classroom-shell*
*Completed: 2026-04-15*
