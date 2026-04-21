---
phase: 04-hints-and-judgment
plan: 01
subsystem: ui
tags: [react, vitest, reducer, classroom-orchestrator, classroom-copy]
requires:
  - phase: 03-guided-speaking-flow
    provides: "single reducer/scheduler classroom shell, single podium CTA, repeat-before-picture flow"
provides:
  - "repeat-after-teacher first silence now enters explicit light-hint retry state"
  - "picture-talk first silence now branches into observe hint then narrowed re-ask"
  - "teacher card and podium copy stay child-safe while preserving a single CTA"
affects: [04-02-PLAN.md, 04-03-PLAN.md, hints-and-judgment]
tech-stack:
  added: []
  patterns: [explicit hint ladder state, single scheduler retry loop, stage-aware teacher/podium copy]
key-files:
  created: []
  modified:
    - src/features/classroom-shell/classroom-orchestrator.ts
    - src/features/classroom-shell/use-classroom-orchestrator.ts
    - src/features/classroom-shell/teacher-script.ts
    - src/features/classroom-shell/podium-view-model.ts
    - test/unit/classroom-orchestrator.test.ts
    - test/unit/teacher-script.test.ts
    - test/unit/classroom-shell.test.tsx
key-decisions:
  - "Keep `attemptIndex` as learner-turn index only, and split retry semantics into `hintLevel` plus `turnResolution`."
  - "Drive repeat and picture first-failure handling through the existing reducer and single timeout effect instead of adding a parallel hint controller."
  - "Pass retry context into the podium view-model so picture-talk can switch from observe hint to narrowed re-ask without adding a second CTA."
patterns-established:
  - "Pattern 1: first failure enters `teacher_encourage` with `hintLevel: light` and only then returns to a second `student_wait`."
  - "Pattern 2: picture-talk retry copy is split into observe-hint and narrowed re-ask phases across teacher and podium surfaces."
requirements-completed: [TEAC-03, SPKG-05]
duration: 6min
completed: 2026-04-21
---

# Phase 4 Plan 1: Hints and Judgment Summary

**Explicit light-hint retry states for repeat/picture turns with co-speak, observe-to-narrowed copy, and a preserved single podium CTA**

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-21T15:04:30+08:00
- **Completed:** 2026-04-21T15:10:15+08:00
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Added `hintLevel` and `turnResolution` to the classroom reducer so first-failure retry logic is explicit instead of inferred from `attemptIndex`.
- Rewired repeat-after-teacher first silence into co-speak retry and picture-talk first silence into observe hint followed by narrowed re-ask, all on the existing single scheduler.
- Extended reducer, script, and shell regression tests so single CTA, Bobby repeat-only behavior, and no-answer-leak copy stay locked during retries.

## Task Commits

Each task was committed atomically:

1. **Task 1: 固定 repeat/picture 的第一次失败 hint 状态图**
   - `310889f` `test(04-01): add failing hint retry reducer coverage`
   - `310a033` `feat(04-01): model light hint retry states`
2. **Task 2: 接通 repeat co-speak 与 picture observe/narrowed 文案，同时保住单 CTA 护栏**
   - `193e69c` `test(04-01): cover hint copy and shell guardrails`
   - `f8cfd4b` `feat(04-01): add stage-aware light hint copy`

## Files Created/Modified

- `src/features/classroom-shell/classroom-orchestrator.ts` - adds explicit hint ladder state and repeat/picture retry transitions.
- `src/features/classroom-shell/use-classroom-orchestrator.ts` - keeps one timer effect while exposing hint-aware stage prompt and podium inputs.
- `src/features/classroom-shell/teacher-script.ts` - splits repeat co-speak from picture observe/narrowed retry copy.
- `src/features/classroom-shell/podium-view-model.ts` - keeps a single CTA while changing picture retry podium caption/status by attempt.
- `test/unit/classroom-orchestrator.test.ts` - locks reducer and hook behavior for light hint retry paths.
- `test/unit/teacher-script.test.ts` - asserts co-speak, observe hint, and narrowed re-ask child-safe copy.
- `test/unit/classroom-shell.test.tsx` - verifies shell retry flow keeps one CTA, no scoring copy, and no picture-talk Bobby rescue.

## Decisions Made

- `hintLevel` and `turnResolution` became the authoritative retry/fallback state, so future plans do not have to infer hint phases from magic numbers.
- Picture-talk retry copy now narrows only after the observe hint finishes, which keeps the classroom flow image-first instead of replaying the original question.
- Podium retry messaging consumes `attemptIndex` from the orchestrator so the child-facing shell can stay single-button while still reflecting the smaller second question.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `04-02` can now attach the judgment adapter to stable retry state fields instead of guessing retry depth from `attemptIndex`.
- `04-03` can replace the current post-second-failure close-out path with explicit fallback modeling without reopening teacher/podium retry copy.

---
*Phase: 04-hints-and-judgment*
*Completed: 2026-04-21*

## Self-Check: PASSED

- FOUND: `.planning/phases/04-hints-and-judgment/04-01-SUMMARY.md`
- FOUND: `310889f`
- FOUND: `310a033`
- FOUND: `193e69c`
- FOUND: `f8cfd4b`
