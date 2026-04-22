---
phase: 05-complete-mvp-lesson
plan: 01
subsystem: ui
tags: [react, vitest, classroom-orchestrator, lesson-state-machine]
requires:
  - phase: 03-guided-speaking-flow
    provides: repeat-after-teacher 到 picture-talk 的 guided speaking queue 与单 scheduler 模式
  - phase: 04-hints-and-judgment
    provides: pictureTalk.semanticAccepts + judgeStudentAttempt 的 judged path
provides:
  - 四段式完整 lesson phase graph：warmup -> guided main -> wrap_up -> completion_reward -> lesson_complete
  - 共享 LESSON_COMPLETE_HOLD_MS 与中心化 CLASSROOM_TIMING_PROFILES
  - hook 侧稳定的 lesson_complete / completionHoldMs 合同
affects: [05-02, 05-03, classroom-shell, homepage-closeout]
tech-stack:
  added: []
  patterns: [单 reducer + 单 scheduler lesson orchestration, metadata-driven picture judgment]
key-files:
  created: [.planning/phases/05-complete-mvp-lesson/05-01-SUMMARY.md]
  modified:
    - src/features/classroom-shell/classroom-orchestrator.ts
    - src/features/classroom-shell/use-classroom-orchestrator.ts
    - src/features/classroom-shell/teacher-script.ts
    - src/features/classroom-shell/podium-view-model.ts
    - test/unit/classroom-orchestrator.test.ts
    - test/unit/classroom-judgment.test.ts
    - test/unit/lesson-schema.test.ts
key-decisions:
  - "Keep warmup and wrap-up outside GUIDED_STAGE_IDS so judged speaking still only covers repeat-after-teacher and picture-talk."
  - "Derive demo and test pacing from one CLASSROOM_TIMING_PROFILES source and export LESSON_COMPLETE_HOLD_MS = 3000 as the shared closeout contract."
  - "Expose lesson_complete state and hold timing from useClassroomOrchestrator so 05-02 can consume completion without adding a second shell state."
patterns-established:
  - "Lesson wrapper phases stay teacher-owned while guided speaking continues through the existing judgment adapter."
  - "Completion flow stops the hook scheduler at lesson_complete and leaves redirect timing to downstream consumers via shared contract."
requirements-completed: [SPKG-02, PLAT-02]
duration: 6m
completed: 2026-04-22
---

# Phase 05 Plan 01: Complete MVP Lesson Summary

**Teacher-led warmup and closing now wrap the existing judged speaking flow, with one shared completion hold contract for lesson-close consumers**

## Performance

- **Duration:** 6m
- **Started:** 2026-04-22T14:55:21+08:00
- **Completed:** 2026-04-22T15:01:42+08:00
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Added a full lesson-level reducer path that starts in `warmup`, preserves the repeat/picture judged path, and closes through `wrap_up -> completion_reward -> lesson_complete`.
- Centralized lesson pacing into `CLASSROOM_TIMING_PROFILES` while fixing `LESSON_COMPLETE_HOLD_MS = 3000` as the shared closeout contract.
- Exposed completion-facing hook surface with stable badge/prompt states, `isLessonComplete`, `completionHoldMs`, and a module-level hold re-export for 05-02.

## Task Commits

Each task was committed atomically:

1. **Task 1: 建立四段式完整 lesson 的 reducer、judgment 与共享 hold 合同** - `1117b67`, `e7b9ce5`
2. **Task 2: 暴露可消费的 completion state 与 pacing contract，供 05-02 接 UI 收口** - `99c59f3`, `f5f45ad`

_Note: TDD tasks used separate RED and GREEN commits._

## Files Created/Modified

- `src/features/classroom-shell/classroom-orchestrator.ts` - 扩展 lesson phase graph、共享 completion hold 常量与中心 timing profiles。
- `src/features/classroom-shell/use-classroom-orchestrator.ts` - 停止在 `lesson_complete` 后继续调度，并对外暴露 completion contract。
- `src/features/classroom-shell/teacher-script.ts` - 补齐 warmup / completion_reward / lesson_complete 的教师文案兼容。
- `src/features/classroom-shell/podium-view-model.ts` - 补齐 closing/reward/complete 的讲台 badge 与状态文案。
- `test/unit/classroom-orchestrator.test.ts` - 覆盖 warmup、completion chain、hook completion contract 与单 scheduler 终止行为。
- `test/unit/classroom-judgment.test.ts` - 明确 picture-talk 继续消费 `pictureTalk.semanticAccepts`。
- `test/unit/lesson-schema.test.ts` - 锁定 lesson metadata 中的 `pictureTalk.semanticAccepts` 合同。

## Decisions Made

- Warmup 与 wrap-up 不进入 judged speaking queue，避免破坏 Phase 3/4 的稳定 repeat/picture 合同。
- Reward 只由 `completion_reward` phase 控制，不再作为任意时刻可点亮的课堂中途状态。
- Hook 层直接 re-export `LESSON_COMPLETE_HOLD_MS`，让后续 closeout UI 只消费同一份 3000ms 合同。

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- 05-02 可以直接消费 `lesson_complete`、`completionHoldMs` 和 closing badge/prompt，无需再猜结课状态归属。
- 首页 recently-completed overlay 和 auto-return UI 收口仍待 05-02 / 05-03 接入，本计划没有触碰课堂壳的 child-facing closeout surface。

## Self-Check: PASSED

- FOUND: `.planning/phases/05-complete-mvp-lesson/05-01-SUMMARY.md`
- FOUND: `1117b67`
- FOUND: `e7b9ce5`
- FOUND: `99c59f3`
- FOUND: `f5f45ad`

---
*Phase: 05-complete-mvp-lesson*
*Completed: 2026-04-22*
