---
phase: 01-classroom-shell
plan: 04
subsystem: ui
tags: [nextjs, react, tailwind, shadcn, playwright, vitest, classroom-shell]
requires:
  - phase: 01-02
    provides: lesson loader, seeded lesson content, and day-session schedule contracts
  - phase: 01-03
    provides: Stitch-style homepage shell and `/lesson/{sessionId}` entry CTA wiring
provides:
  - lesson route that resolves seeded sessions into a real classroom page
  - Stitch-style classroom surface with seat strip, lesson board, stage panel, and teacher panel
  - activated unit and Playwright validation for homepage-to-classroom entry
affects: [lesson-route, classroom-shell, responsive-layout, e2e-smoke]
tech-stack:
  added: []
  patterns: [tablet-first classroom shell, seeded lesson route composition, isolated Playwright webServer port]
key-files:
  created:
    - src/app/lesson/[sessionId]/page.tsx
    - src/features/classroom-shell/classroom-shell.tsx
    - src/features/classroom-shell/student-seat-strip.tsx
    - src/features/classroom-shell/stage-panel.tsx
    - src/features/classroom-shell/teacher-panel.tsx
    - src/features/classroom-shell/lesson-board.tsx
  modified:
    - playwright.config.ts
    - test/unit/classroom-shell.test.tsx
    - test/e2e/classroom-entry.spec.ts
key-decisions:
  - "Keep the classroom shell tablet-first with a persistent seat strip, dark lesson board, and pinned teacher panel so the page reads as a class rather than a content viewer."
  - "Resolve `/lesson/[sessionId]` from the seeded weekday schedule and fail unknown sessions with `notFound()` instead of rendering a broken shell."
  - "Run Playwright against an isolated dedicated dev-server port because Next.js 16 blocks concurrent `next dev` instances in the same repo and local port reuse caused flaky smoke runs."
patterns-established:
  - "Pattern 1: lesson routes derive classroom state from seeded schedule contracts rather than hard-coded page props."
  - "Pattern 2: responsive classroom tests assert structure markers and shell semantics while E2E smoke verifies the homepage-to-lesson handoff."
requirements-completed: [CLAS-01, PLAT-01]
duration: 6min
completed: 2026-04-15
---

# Phase 01 Plan 04: Classroom Shell Summary

**Homepage-to-classroom routing with a Stitch-style tablet-first classroom shell and activated unit/E2E entry validation**

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-15T23:06:54+08:00
- **Completed:** 2026-04-15T23:12:10+08:00
- **Tasks:** 1
- **Files modified:** 10

## Accomplishments
- Confirmed the lesson route, classroom shell, and responsive classroom components satisfy the Phase 1 plan contract around `You`, `Milo`, `待上台`, `Teacher Mia`, and seeded lesson imagery.
- Activated the previously prepared unit and Playwright coverage so the browser flow now verifies `我的课堂` → `进入课堂` → `/lesson/[sessionId]`.
- Removed the local E2E execution blocker by isolating Playwright onto its own Next dev port instead of colliding with an already-running repo dev server.

## Task Commits

Task commits were not created in this turn because the classroom route, shell components, and test files were already present as active local workspace changes when execution resumed.

- **Task 1: Render the classroom surface and activate automated verification** - no new task commit recorded in this turn

## Files Created/Modified
- `src/app/lesson/[sessionId]/page.tsx` - Resolves a real `sessionId` from the weekday schedule, loads its lesson, and guards unknown sessions with `notFound()`.
- `src/features/classroom-shell/classroom-shell.tsx` - Composes the seat strip, lesson board, stage card, and teacher card into the tablet-first classroom surface.
- `src/features/classroom-shell/student-seat-strip.tsx` - Renders the exact `You`, `Milo`, `Seat 3`, and `Seat 4` lineup with active-seat emphasis.
- `src/features/classroom-shell/stage-panel.tsx` - Keeps the stage visible in both active and waiting states, including the required `待上台` copy.
- `src/features/classroom-shell/teacher-panel.tsx` - Pins the `Teacher Mia` identity block into the lower role column.
- `src/features/classroom-shell/lesson-board.tsx` - Presents the first seeded lesson image inside the dark classroom board container.
- `test/unit/classroom-shell.test.tsx` - Verifies shell composition, stable lesson image alt text, and responsive class markers.
- `test/e2e/classroom-entry.spec.ts` - Verifies the homepage heading, `进入课堂` link, lesson-route navigation, and teacher visibility.
- `playwright.config.ts` - Runs Playwright against an isolated local dev server with fixed classroom time data.

## Decisions Made
- The classroom page keeps all four classroom regions visible on first paint so the user immediately reads it as an active class session.
- The stage remains visible even before any named student is active; the waiting state is part of the classroom contract, not an empty placeholder.
- Playwright now launches against a dedicated local port to avoid false failures from leftover repo dev servers during execution.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Isolated Playwright from the repo's stale dev server**
- **Found during:** Task 1 (Render the classroom surface and activate automated verification)
- **Issue:** Playwright smoke runs could not start reliably because Next.js detected an already-running `next dev` instance for this repo, and local URL probing on reused ports produced misleading failures.
- **Fix:** Updated `playwright.config.ts` to use a dedicated test port with `port`-based webServer readiness checks, then terminated the stale repo dev process before rerunning the smoke test.
- **Files modified:** `playwright.config.ts`
- **Verification:** `npx playwright test test/e2e/classroom-entry.spec.ts`
- **Committed in:** not committed in this turn

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The deviation was strictly execution infrastructure. No product scope changed, and it made the planned smoke validation reliable.

## Issues Encountered

- A stale `next dev` process for this repo was still registered by Next.js even after the classroom implementation was present. Killing that leftover process was necessary before Playwright could launch its own isolated server.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 1 now has a real homepage-to-classroom browser path plus automated coverage around the entry handoff and classroom shell composition.
- Phase 2 can build on a stable lesson route and classroom layout instead of revisiting Phase 1 surface structure.
- Residual risk: this turn did not include a full manual visual walkthrough on real phone/tablet/desktop devices, so future polishing should still spot-check live responsive rendering.

## Self-Check: PASSED

- Verified `npx vitest run test/unit/classroom-shell.test.tsx` passes.
- Verified `npx playwright test test/e2e/classroom-entry.spec.ts` passes.
- Verified required classroom route and shell files exist on disk.

---
*Phase: 01-classroom-shell*
*Completed: 2026-04-15*
