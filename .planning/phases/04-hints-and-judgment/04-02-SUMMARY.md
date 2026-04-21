---
phase: 04-hints-and-judgment
plan: 02
subsystem: classroom-orchestration
tags: [vitest, zod, fastest-levenshtein, reducer, lesson-content]
requires:
  - phase: 04-01
    provides: "repeat/picture hint ladder, hintLevel, turnResolution, single-CTA classroom flow"
provides:
  - "repeat lexical closeness judgment adapter with pass/retry/fallback outcomes"
  - "picture-talk semantic accept metadata in lesson schema and week-01 seed"
  - "student_attempt_submitted wiring through reducer and hook compatibility alias"
affects: [04-03, teacher-script, podium-view-model, future-asr]
tech-stack:
  added: [fastest-levenshtein]
  patterns: [pure-judgment-adapter, content-authored-accept-sets, judged-attempt-reducer]
key-files:
  created: [src/features/classroom-shell/classroom-judgment.ts]
  modified:
    [
      src/features/lesson-config/lesson-schema.ts,
      content/lessons/week-01/lesson-01.ts,
      src/features/classroom-shell/classroom-orchestrator.ts,
      src/features/classroom-shell/use-classroom-orchestrator.ts,
      test/unit/classroom-judgment.test.ts,
      test/unit/lesson-schema.test.ts,
      test/unit/classroom-orchestrator.test.ts,
      package.json,
      package-lock.json,
    ]
key-decisions:
  - "Keep judged attempts behind a pure classroom-judgment adapter and let the reducer consume only pass/retry/fallback."
  - "Author repeatAccepts and pictureTalk.semanticAccepts in lesson content instead of hardcoding vocabulary in reducer branches."
  - "Preserve confirmStudentParticipation as a hook-level compatibility alias that dispatches submitStudentAttempt with a stage-safe canonical transcript."
patterns-established:
  - "Pattern 1: repeat-after-teacher uses normalized transcript plus length-based Levenshtein thresholds."
  - "Pattern 2: picture-talk accepts only content-authored semanticAccepts and escalates miss outcomes to retry or fallback."
requirements-completed: [SPKG-03, SPKG-04, SPKG-05]
duration: 9min
completed: 2026-04-21
---

# Phase 4 Plan 2: Judgment Contract Summary

**Repeat lexical matching with `fastest-levenshtein`, picture semantic accept sets, and judged-attempt reducer wiring for the Phase 4 classroom flow**

## Performance

- **Duration:** 9 min
- **Started:** 2026-04-21T15:14:44+08:00
- **Completed:** 2026-04-21T15:23:16+08:00
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- Added a pure `classroom-judgment` adapter that normalizes transcripts, applies repeat lexical thresholds, and returns only `pass / retry / fallback`.
- Extended lesson schema and week-01 content with `repeatAccepts` plus `pictureTalk.observeHint / narrowedQuestion / semanticAccepts / fallbackModel`.
- Rewired the reducer and hook so classroom progression consumes `student_attempt_submitted` outcomes instead of treating CTA clicks as automatic success.

## Task Commits

Each task was committed atomically:

1. **Task 1: 建立 judgment/schema/content foundation，并让护栏测试可直接运行**
   - `f76e372` (`test`) RED: failing judgment and schema guards
   - `d5c38fe` (`feat`) GREEN: judgment contract foundations
2. **Task 2: 把 orchestrator/hook 从确认按钮接到 judged attempt**
   - `328cdd2` (`test`) RED: failing judged attempt orchestrator coverage
   - `9f61327` (`feat`) GREEN: judged attempt reducer and hook wiring

_Note: TDD tasks used separate RED and GREEN commits._

## Files Created/Modified

- `src/features/classroom-shell/classroom-judgment.ts` - Repeat/picture judgment adapter, transcript normalization, canonical manual transcript builder.
- `src/features/lesson-config/lesson-schema.ts` - Optional Phase 4 metadata contract for repeat and picture judgments.
- `content/lessons/week-01/lesson-01.ts` - Week 01 lesson seed with five fully-authored hint and judgment metadata blocks.
- `src/features/classroom-shell/classroom-orchestrator.ts` - `student_attempt_submitted` reducer path and fallback-ready transitions.
- `src/features/classroom-shell/use-classroom-orchestrator.ts` - `submitStudentAttempt` API and compatibility alias routing.
- `test/unit/classroom-judgment.test.ts` - Pure judgment contract samples and canonical manual transcript guard.
- `test/unit/lesson-schema.test.ts` - Schema/content guards for optional metadata and seeded lesson coverage.
- `test/unit/classroom-orchestrator.test.ts` - Reducer and hook coverage for judged pass/retry/fallback outcomes.
- `package.json` / `package-lock.json` - Added `fastest-levenshtein`.

## Decisions Made

- Used a pure judgment adapter boundary so future mock transcript or ASR input can reuse the same reducer contract.
- Kept picture-talk acceptance deterministic via lesson content metadata rather than reducer-side vocabulary switches.
- Reused existing `teacher_encourage` and `turnResolution` branches for fallback-ready transitions instead of introducing a new Phase 4 reducer phase in this plan.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed picture manual transcript compatibility for the legacy CTA alias**
- **Found during:** Task 2 (把 orchestrator/hook 从确认按钮接到 judged attempt)
- **Issue:** `buildCanonicalManualTranscript()` originally returned `fallbackModel` for `picture-talk`, which would have made `confirmStudentParticipation()` fail judgment and break the existing single-CTA path.
- **Fix:** Switched picture canonical transcripts to the first `semanticAccepts` entry so compatibility submits still pass through the same judgment contract without answer leakage or reducer bypass.
- **Files modified:** `src/features/classroom-shell/classroom-judgment.ts`, `test/unit/classroom-judgment.test.ts`
- **Verification:** `npm run test:unit -- test/unit/classroom-judgment.test.ts test/unit/lesson-schema.test.ts test/unit/classroom-orchestrator.test.ts`
- **Committed in:** `9f61327`

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Auto-fix was required to keep the existing CTA compatible with judged picture-talk attempts. No scope creep.

## Issues Encountered

- A transient `.git/index.lock` blocked one staging attempt during Task 1. The lock cleared, staging was retried sequentially, and no repository repair was needed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `04-03` can now build teacher fallback close-out on top of stable `pass / retry / fallback` outcomes instead of guessing from button clicks.
- Teacher script and shell regression work can rely on content-authored hint/judgment metadata already seeded in week-01.

## Self-Check

PASSED

- Found `.planning/phases/04-hints-and-judgment/04-02-SUMMARY.md`
- Found commits `f76e372`, `d5c38fe`, `328cdd2`, `9f61327`

---
*Phase: 04-hints-and-judgment*
*Completed: 2026-04-21*
