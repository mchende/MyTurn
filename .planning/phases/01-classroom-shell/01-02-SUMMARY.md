---
phase: 01-classroom-shell
plan: 02
subsystem: content
tags: [zod, vitest, lesson-config, schedule, svg]
requires:
  - phase: 01-01
    provides: Next.js/Tailwind/Vitest scaffold and Wave 0 test harness
provides:
  - validated lesson and schedule contracts
  - reusable week-01 lesson seed with five image-backed targets
  - session access-state selector and day-session builder
affects: [homepage-shell, classroom-route, lesson-content]
tech-stack:
  added: []
  patterns: [schema-validated lesson content, pure time-state selectors, parsed local seed modules]
key-files:
  created:
    - src/features/lesson-config/lesson-schema.ts
    - src/features/schedule/schedule-schema.ts
    - src/features/schedule/build-day-sessions.ts
    - src/lib/time/session-access-state.ts
    - content/lessons/week-01/lesson-01.ts
    - content/schedules/default-weekday.ts
    - public/lessons/week-01/apple.svg
    - public/lessons/week-01/banana.svg
    - public/lessons/week-01/cat.svg
    - public/lessons/week-01/dog.svg
    - public/lessons/week-01/sun.svg
  modified:
    - src/features/lesson-config/load-lesson.ts
    - test/unit/lesson-schema.test.ts
key-decisions:
  - "Keep lesson stages fixed in schema and let pages consume exported contracts instead of redefining stage IDs."
  - "Model entry timing as a pure selector plus a day-session builder so homepage and lesson routes share one access-state rule."
  - "Seed week-01 lesson content locally with parsed TS modules and stable SVG assets to support image-first classroom screens."
patterns-established:
  - "Pattern 1: content modules export parsed seed objects via Zod schema.parse at module boundaries."
  - "Pattern 2: schedule templates stay declarative while buildDaySessions derives runtime dates and accessState."
requirements-completed: [CONT-01, CONT-02]
duration: 6min
completed: 2026-04-15
---

# Phase 01 Plan 02: Classroom Shell Summary

**Zod-validated lesson and schedule contracts with reusable week-01 noun content, local SVG flashcards, and shared session access-state logic**

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-15T13:56:00Z
- **Completed:** 2026-04-15T14:01:26Z
- **Tasks:** 2
- **Files modified:** 13

## Accomplishments
- Added lesson, stage, schedule, and session-state contracts that keep 5-item lesson content and access-state rules out of page components.
- Seeded one reusable `week-01` lesson package plus a weekday schedule template with 15-minute sessions and 5-minute entry windows.
- Replaced the Wave 0 placeholder with passing unit coverage for schema validation, seed data integrity, and access-state outcomes.

## Task Commits

Each task was committed atomically:

1. **Task 1: Define lesson, schedule, and access-state contracts** - `0c57b6e` (feat)
2. **Task 2: Seed one reusable weekly lesson package with assets** - `e8c333c` (feat)

## Files Created/Modified
- `src/features/lesson-config/lesson-schema.ts` - Declares the exported lesson item, stage, and lesson schemas plus inferred types.
- `src/features/lesson-config/load-lesson.ts` - Loads parsed local lesson seeds by `lessonId`.
- `src/features/schedule/schedule-schema.ts` - Defines time slot and schedule template schemas.
- `src/features/schedule/build-day-sessions.ts` - Builds dated session view models with `entryOpensAt` and `accessState`.
- `src/lib/time/session-access-state.ts` - Computes `upcoming`, `open_for_entry`, `in_progress_locked`, and `completed`.
- `content/lessons/week-01/lesson-01.ts` - Seeds the week-01 noun lesson with five fixed targets and four fixed stages.
- `content/schedules/default-weekday.ts` - Seeds the weekday schedule with three reusable session templates.
- `public/lessons/week-01/*.svg` - Provides local, stable flashcard assets for each seeded noun.
- `test/unit/lesson-schema.test.ts` - Verifies schema constraints, seed parsing, and access-state behavior.

## Decisions Made
- Fixed stage IDs remain in the schema contract: `warmup`, `repeat-after-teacher`, `picture-talk`, `wrap-up`.
- `loadLesson` validates local seed content at the module boundary instead of trusting plain objects downstream.
- Schedule slots remain template-only (`HH:mm` plus durations), while runtime day instances are derived by a pure builder.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Initial Task 2 session-builder assertion used UTC timestamps and produced a false failure in the local timezone. The test fixture was corrected to use local date construction, and the implementation itself did not require changes.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Homepage and lesson-route work can now consume `loadLesson`, `defaultWeekdayScheduleTemplate`, and `buildDaySessions` instead of embedding ad hoc lesson objects or time rules.
- Stable local SVG assets are ready for `next/image` usage in the classroom main screen and schedule cards.

## Self-Check: PASSED

- Verified required files exist for contracts, seeds, assets, and tests.
- Verified task commits `0c57b6e` and `e8c333c` exist in git history.

---
*Phase: 01-classroom-shell*
*Completed: 2026-04-15*
