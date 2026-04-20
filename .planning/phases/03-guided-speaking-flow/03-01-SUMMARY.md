---
phase: 03-guided-speaking-flow
plan: 01
subsystem: ui
tags: [react, reducer, vitest, guided-speaking, classroom-shell]
requires:
  - phase: 02-cast-and-orchestration
    provides: reducer-driven classroom orchestration, fixed teacher/AI/student turn model
provides:
  - stage-aware guided speaking queue derived from lesson stages
  - explicit student participation confirmation for repeat-after-teacher and picture-talk
  - hook contract exposing guided stage metadata through a single timer scheduler
affects: [03-02, 03-03, teacher-script, classroom-shell, guided-speaking-flow]
tech-stack:
  added: []
  patterns: [stage-aware reducer queue, explicit participation confirmation, single scheduler hook]
key-files:
  created: []
  modified:
    - src/features/classroom-shell/classroom-orchestrator.ts
    - src/features/classroom-shell/use-classroom-orchestrator.ts
    - test/unit/classroom-orchestrator.test.ts
    - test/unit/classroom-shell.test.tsx
key-decisions:
  - "Derive guided speaking progress from lesson.stages so repeat-after-teacher fully completes before picture-talk begins."
  - "Use student_participation_confirmed as the only speaking success signal instead of exposing auto-speech semantics in the hook API."
  - "Keep useClassroomOrchestrator on one centralized CLASSROOM_TIMINGS scheduler while exposing stage metadata directly to shell consumers."
patterns-established:
  - "Guided stages advance by stage cursor plus stage-local item index rather than a flat lesson item counter."
  - "Shell consumers should read currentStageId/currentStageItemIndex/attemptIndex directly from the orchestrator hook."
requirements-completed: [CONT-04, SPKG-01]
duration: 5min
completed: 2026-04-20
---

# Phase 03 Plan 01: Guided Speaking Flow Summary

**Stage-aware speaking queue with explicit participation confirmation across repeat-after-teacher and picture-talk**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-20T10:53:39+08:00
- **Completed:** 2026-04-20T10:58:35.4634466+08:00
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Upgraded the classroom reducer from a flat `lesson.items` loop to guided stage runs derived from `lesson.stages`.
- Locked the `repeat-after-teacher -> picture-talk` progression and explicit `student_participation_confirmed` success path with reducer tests.
- Exposed stage-aware metadata and `confirmStudentParticipation()` from the hook without introducing extra timer chains.

## Task Commits

Each task was committed atomically:

1. **Task 1: 建立 guided stage queue 与基础 reducer contract** - `cbeccd4` (test), `707923e` (feat)
2. **Task 2: 暴露 stage-aware hook API 与手动 participation handler** - `7fad5d7` (test), `5a8b64c` (feat)

## Files Created/Modified

- `src/features/classroom-shell/classroom-orchestrator.ts` - Adds guided stage queue helpers, stage-aware state, and explicit participation confirmation events.
- `src/features/classroom-shell/use-classroom-orchestrator.ts` - Exposes `confirmStudentParticipation()` plus stage metadata while keeping one centralized timer effect.
- `test/unit/classroom-orchestrator.test.ts` - Covers guided stage filtering, full repeat-to-picture progression, and hook-level confirmation/timer contracts.
- `test/unit/classroom-shell.test.tsx` - Adds a shell-side hook consumer probe that verifies stage metadata and confirmation flow are consumable by UI code.

## Decisions Made

- Moved guided speaking traversal onto `lesson.stages` so the same item set can be replayed under stricter output requirements without changing lesson schema.
- Kept manual participation confirmation as the only success signal for this plan, preserving the phase boundary against automatic speech detection.
- Differentiated `teacher_prompt` and `student_wait` copy by stage inside the hook so shell consumers can react to `picture-talk` without another scheduler path.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Corrected stale planning progress metadata after state tools ran**
- **Found during:** Plan wrap-up
- **Issue:** `state update-progress` and `roadmap update-plan-progress` advanced the plan pointer and wrote metrics, but left stale human-readable progress text in `STATE.md` and the Phase 3 summary row in `ROADMAP.md`.
- **Fix:** Manually aligned `STATE.md`, `ROADMAP.md`, and the requirements footer with the completed `03-01` execution state.
- **Files modified:** `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`
- **Verification:** Confirmed Phase 3 now shows `1/3` in roadmap progress and `STATE.md` shows `Plan: 2 of 3` with `80%` progress.
- **Committed in:** docs metadata commit

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Documentation-only correction. No product-scope change and no implementation drift.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `03-02` can now build stage-aware teacher/Bobby scripts and the classroom confirmation UI on top of a stable reducer/hook contract.
- `03-03` can add picture-talk retry handling using the existing `attemptIndex` and stage cursor fields instead of reworking state shape.

## Self-Check: PASSED

- Found summary file: `.planning/phases/03-guided-speaking-flow/03-01-SUMMARY.md`
- Found task commit: `cbeccd4`
- Found task commit: `707923e`
- Found task commit: `7fad5d7`
- Found task commit: `5a8b64c`

---
*Phase: 03-guided-speaking-flow*
*Completed: 2026-04-20*
