---
phase: 01-classroom-shell
plan: 03
subsystem: ui
tags: [nextjs, react, tailwind, shadcn, vitest, schedule]
requires:
  - phase: 01-01
    provides: Next.js/Tailwind/shadcn scaffold and unit test harness
  - phase: 01-02
    provides: day-session builder, access-state selector, and seeded weekday schedule
provides:
  - Stitch-style `我的课堂` homepage shell with left nav and responsive session grid
  - schedule homepage view-model with current session and next-session emphasis
  - entry countdown and stateful session cards wired to `/lesson/{sessionId}`
affects: [homepage-shell, lesson-entry, classroom-route]
tech-stack:
  added: []
  patterns: [server-side homepage view-model mapping, shadcn-style UI primitives, contract-tested schedule surface]
key-files:
  created:
    - src/app/(marketing)/page.tsx
    - src/components/ui/button.tsx
    - src/components/ui/card.tsx
    - src/components/ui/badge.tsx
    - src/lib/utils.ts
    - src/features/schedule/get-today-schedule-view-model.ts
    - src/features/schedule/entry-countdown.tsx
    - src/features/schedule/session-card.tsx
    - test/unit/homepage-shell.test.tsx
  modified:
    - test/unit/homepage-shell.test.tsx
    - src/app/page.tsx
key-decisions:
  - "Move the root homepage into `src/app/(marketing)/page.tsx` so the homepage contract lives on the actual marketing route group instead of a temporary root stub."
  - "Keep homepage data server-safe by mapping seeded day sessions into labeled card view models before rendering."
  - "Use duplicated mobile header plus desktop rail instead of CSS-only hiding tricks so `主页` and `设置` remain accessible at every breakpoint."
patterns-established:
  - "Pattern 1: homepage routes export a renderable shell component plus a server-side data loader for contract testing."
  - "Pattern 2: session cards own CTA behavior and render non-open states as non-navigable status surfaces."
requirements-completed: [CLAS-01, PLAT-01]
duration: 6min
completed: 2026-04-15
---

# Phase 01 Plan 03: Classroom Shell Summary

**Responsive `我的课堂` homepage with Stitch-style left navigation, schedule card grid, countdown states, and lesson-entry CTA wiring**

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-15T14:04:30Z
- **Completed:** 2026-04-15T14:10:46Z
- **Tasks:** 1
- **Files modified:** 10

## Accomplishments
- Replaced the placeholder homepage with a real `我的课堂` schedule surface that preserves the Stitch contract: left nav, `我的课堂`, card grid, and `进入课堂` wiring.
- Added server-safe homepage view-model mapping on top of the Phase 01-02 schedule builder so cards render real entry states, labels, and next-session emphasis.
- Introduced reusable shadcn-style `button`, `card`, `badge`, `cn`, plus a ticking countdown component and a render-level homepage contract test.

## Task Commits

Each task was committed atomically:

1. **Task 1: Build the schedule homepage and entry-state UI** - `12f4c3a` (test), `843d672` (feat)

## Files Created/Modified
- `src/app/(marketing)/page.tsx` - Renders the responsive homepage shell and loads today’s schedule view-model.
- `src/features/schedule/get-today-schedule-view-model.ts` - Maps seeded day sessions into homepage-ready labels, countdowns, and next-session metadata.
- `src/features/schedule/session-card.tsx` - Renders course card states, countdown emphasis, and the `/lesson/${sessionId}` entry CTA.
- `src/features/schedule/entry-countdown.tsx` - Updates upcoming/open countdown text once per second without layout shift.
- `src/components/ui/button.tsx`, `card.tsx`, `badge.tsx` - Provide the shadcn-style UI primitives required by the plan.
- `src/lib/utils.ts` - Adds the shared `cn` helper.
- `test/unit/homepage-shell.test.tsx` - Verifies the homepage shell contract, CTA visibility, and locked-state copy.
- `src/app/page.tsx` - Removed the temporary root stub after moving the real homepage into the marketing route group.

## Decisions Made
- The homepage now exports `HomepageShell` alongside the default page so render-level tests can inject a stable view-model without mocking Next server code.
- `SessionCard` owns state-to-CTA behavior, which protects the Stitch homepage contract from drifting when later lesson-route work lands.
- The homepage keeps both a mobile top bar and a desktop rail so `主页` and `设置` stay present without creating a real settings page in Phase 1.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- The automated source-check command from the plan needed PowerShell-safe quoting before it could run locally; the underlying checks and Vitest assertions passed unchanged once rewritten as a here-string.
- JSDOM renders both mobile and desktop navigation regions, so the homepage contract test was adjusted to assert presence rather than uniqueness for repeated responsive labels.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `01-04` can now build the lesson route against an existing homepage entry surface instead of re-owning schedule UI concerns.
- The homepage contract is covered by unit tests, including the protected Stitch requirements around left nav, `我的课堂`, card grid, and `进入课堂` route handoff.

## Self-Check: PASSED

- Verified summary and key implementation files exist on disk.
- Verified task commits `12f4c3a` and `843d672` exist in git history.

---
*Phase: 01-classroom-shell*
*Completed: 2026-04-15*
