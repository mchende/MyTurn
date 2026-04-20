---
phase: 03-guided-speaking-flow
plan: 03
subsystem: ui
tags: [react, vitest, playwright, classroom-orchestrator, guided-speaking]
requires:
  - phase: 03-guided-speaking-flow
    provides: "Stage-aware guided queue, teacher visible/spoken split, and podium confirmation CTA from Plans 01-02"
provides:
  - "Picture-talk now gives one teacher-led retry, then closes the turn and advances without Bobby rescue"
  - "Board copy exposes stage-local badge/prompt updates for repeat-after-teacher and picture-talk"
  - "Focused unit and Playwright regressions prove the repeat-to-picture progression on the same lesson set"
affects: [04-hints-and-judgment, 05-complete-mvp-lesson, classroom-shell]
tech-stack:
  added: []
  patterns:
    - "attemptIndex + participationState drive picture-talk retry versus close-out inside one reducer"
    - "lesson board stage copy is asserted through stable selectors in unit and e2e tests"
key-files:
  created:
    - test/e2e/guided-speaking-flow.spec.ts
  modified:
    - src/features/classroom-shell/classroom-orchestrator.ts
    - src/features/classroom-shell/use-classroom-orchestrator.ts
    - src/features/classroom-shell/teacher-script.ts
    - src/features/classroom-shell/lesson-board.tsx
    - test/unit/classroom-orchestrator.test.ts
    - test/unit/classroom-shell.test.tsx
    - test/unit/lesson-board.test.tsx
key-decisions:
  - "Keep picture-talk retry handling inside the existing teacher_encourage phase, using attemptIndex to branch between second chance and fast close-out."
  - "Expose board badge and prompt as dedicated DOM nodes so stage upgrades can be asserted without relying on brittle full-text matches."
patterns-established:
  - "Picture-talk remains teacher-owned: first silence returns to student_wait for one more try, second silence moves directly toward the next item."
  - "Stage copy uses stage-local progress labels such as 'Repeat after Cora · 1/5' and 'Picture talk · 1/5' to make the escalation visible."
requirements-completed: [CONT-03, CONT-04, TEAC-02]
duration: 12min
completed: 2026-04-20
---

# Phase 03 Plan 03: Progression Polish Summary

**Picture-talk now has one light retry then a teacher-led close-out, with visible board mode upgrades and a focused browser regression for repeat-to-answer progression**

## Performance

- **Duration:** 12 min
- **Started:** 2026-04-20T11:10:00+08:00
- **Completed:** 2026-04-20T11:21:45.7063060+08:00
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Added explicit picture-talk retry pacing so the first silence becomes a second chance and the second silence closes the turn without routing through Bobby or `teacher_echo`.
- Updated derived stage copy to show stage-local progress and child-safe retry text like `Try once more.` while preserving the no-target-text guard.
- Added focused reducer, shell, board, and Playwright coverage for the `repeat-after-teacher -> picture-talk` upgrade on the same lesson content.

## Task Commits

Each task was committed atomically:

1. **Task 1: 实现 picture-talk 二次机会与老师收束路径** - `f407757` (feat)
2. **Task 2: 打磨 board 文案升级并补齐 focused validation** - `4c6dd0d` (test)

## Files Created/Modified

- `src/features/classroom-shell/classroom-orchestrator.ts` - branches picture-talk silence into retry or close-out without introducing a second orchestrator.
- `src/features/classroom-shell/use-classroom-orchestrator.ts` - derives stage-local badge/prompt copy from stage, attempt, and participation state.
- `src/features/classroom-shell/teacher-script.ts` - supplies the light second prompt and close-out teacher copy for picture-talk.
- `src/features/classroom-shell/lesson-board.tsx` - exposes stable board badge/prompt selectors for focused verification.
- `test/unit/classroom-orchestrator.test.ts` - proves picture-talk first-time retry, second-time close-out, and confirmed completion on either attempt.
- `test/unit/classroom-shell.test.tsx` - covers `I answered`, retry copy, and Bobby absence during picture-talk.
- `test/unit/lesson-board.test.tsx` - verifies stage badge/prompt differentiation and continued target-text guarding.
- `test/e2e/guided-speaking-flow.spec.ts` - walks the browser from repeat-after-teacher into picture-talk and checks the CTA/copy upgrade.

## Decisions Made

- Reused `teacher_encourage` as the single teacher-owned retry junction in picture-talk, which kept the reducer deterministic and avoided adding a new orchestration phase for close-out.
- Promoted board copy assertions to stable selectors so the phase transition can be tested directly in both unit and browser layers.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- The new Playwright regression initially timed out waiting for `I said it` because the repeat-stage loop includes `teacher_feedback + move_next + teacher_prompt + ai_model`, which exceeds the default 5 second assertion window. The spec was updated to use an 8 second visibility timeout that matches the intentional classroom pacing.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 4 can now build hinting and judgment on top of a stable picture-talk contract: one retry, then teacher-owned close-out.
- Browser and unit coverage now make it much easier to detect regressions if future hint logic accidentally leaks answers or reintroduces Bobby into picture-talk recovery.

## Self-Check: PASSED

- FOUND: `.planning/phases/03-guided-speaking-flow/03-03-SUMMARY.md`
- FOUND: `f407757`
- FOUND: `4c6dd0d`

---
*Phase: 03-guided-speaking-flow*
*Completed: 2026-04-20*
