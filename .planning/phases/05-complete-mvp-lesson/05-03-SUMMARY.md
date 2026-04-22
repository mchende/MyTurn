---
phase: 05-complete-mvp-lesson
plan: 03
subsystem: classroom-closeout
tags: [react, nextjs, playwright, closeout-loop]
requires:
  - phase: 05-complete-mvp-lesson
    provides: lesson_complete / completionHoldMs / homepage completion overlay contracts
provides:
  - classroom closeout surface with fixed warmup / closing / completion copy
  - single-owner auto-return from lesson_complete to homepage
  - full-loop browser verification from homepage back to homepage
affects: [classroom-shell, teacher-script, podium-view-model, homepage-closeout, e2e]
tech-stack:
  added: []
  patterns: [single redirect owner, short picture-talk praise, homepage-to-lesson-to-home loop]
key-files:
  created:
    - .planning/phases/05-complete-mvp-lesson/05-03-SUMMARY.md
    - test/e2e/complete-mvp-lesson.spec.ts
  modified:
    - src/features/classroom-shell/classroom-shell.tsx
    - src/features/classroom-shell/use-classroom-orchestrator.ts
    - src/features/classroom-shell/teacher-script.ts
    - src/features/classroom-shell/podium-view-model.ts
    - test/unit/classroom-orchestrator.test.ts
    - test/unit/teacher-script.test.ts
    - test/unit/classroom-shell.test.tsx
    - test/e2e/guided-speaking-flow.spec.ts
    - test/e2e/classroom-entry.spec.ts
key-decisions:
  - "Keep `ClassroomShell` as the only redirect owner and reuse `LESSON_COMPLETE_HOLD_MS` for the 3-second hold."
  - "Lock picture-talk success feedback to one short `Nice answer.` line before immediately moving to the next item."
  - "Return to `/?completedSession=...` instead of creating any result or summary route."
patterns-established:
  - "Teacher, podium, and shell now share one fixed closeout vocabulary: Class hello -> Class closing -> Class complete."
  - "The full browser loop is verified through one Playwright spec that actually completes all repeat and picture-talk turns."
requirements-completed: [SPKG-02, PLAT-02]
duration: 19m
completed: 2026-04-22
---

# Phase 05 Plan 03: Complete MVP Lesson Summary

**The classroom now lands the last 3 seconds of “class is really over”, then returns home with a warm just-finished state instead of dropping the child into a dead end**

## Performance

- **Duration:** 19m
- **Started:** 2026-04-22T15:43:00+08:00
- **Completed:** 2026-04-22T16:02:00+08:00
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- Wired `ClassroomShell` to own the only completion redirect timer and send the user back to `/?completedSession=weekday-1700` after the shared 3000ms hold.
- Fixed the teacher, podium, and stage prompt closeout copy so warmup / closing / completion all read as one coherent lesson-ending surface.
- Shortened picture-talk success feedback to `Nice answer.` and kept the judged picture-talk path intact.
- Added a real browser loop regression that clicks through all 5 repeat turns and all 5 picture-talk turns, then verifies reward, closeout, auto-return, and homepage warmth.

## Task Commits

Pending in current session. Planned as one minimal atomic commit for 05-03 implementation.

## Verification

- `npm run test:unit -- test/unit/classroom-orchestrator.test.ts`
- `npm run test:unit -- test/unit/teacher-script.test.ts`
- `npm run test:unit -- test/unit/classroom-shell.test.tsx`
- `npm run test:e2e -- test/e2e/guided-speaking-flow.spec.ts`
- `npm run test:e2e -- test/e2e/classroom-entry.spec.ts test/e2e/complete-mvp-lesson.spec.ts`

## Issues Encountered

- 旧的 classroom-shell unit tests 仍按 `teacher_prompt` 作为初始相位编写；已统一恢复到 Phase 5 的 `warmup` 起始合同。
- Playwright 运行后偶发打印 `3201` 端口占用日志，但两轮 focused E2E 均以 exit code 0 通过，不影响本次 verifier verdict。

## Self-Check: PASSED

- FOUND: `router.replace('/?completedSession=`
- FOUND: `Nice answer.`
- FOUND: `You finished class. See you next time.`
- FOUND: `test/e2e/complete-mvp-lesson.spec.ts`
