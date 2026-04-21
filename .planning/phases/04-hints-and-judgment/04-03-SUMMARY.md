---
phase: 04-hints-and-judgment
plan: 03
subsystem: classroom-orchestration
tags: [vitest, playwright, reducer, react, classroom-ui]
requires:
  - phase: 04-01
    provides: "hint ladder, hintLevel routing, single-CTA classroom shell"
  - phase: 04-02
    provides: "judged student attempts, repeatAccepts, pictureTalk fallback metadata"
provides:
  - "teacher_fallback_model to final-follow close-out flow for repeat and picture stages"
  - "child-safe fallback spokenModel and podium copy with one final CTA"
  - "baseline plus fallback-focused shell and Playwright regression coverage"
affects: [05-complete-mvp-lesson, classroom-shell, teacher-script, podium-view-model]
tech-stack:
  added: []
  patterns: [fallback-model-phase, final-follow-single-cta, browser-regression-gate]
key-files:
  created: []
  modified:
    [
      src/features/classroom-shell/classroom-orchestrator.ts,
      src/features/classroom-shell/use-classroom-orchestrator.ts,
      src/features/classroom-shell/teacher-script.ts,
      src/features/classroom-shell/podium-view-model.ts,
      test/unit/classroom-orchestrator.test.ts,
      test/unit/teacher-script.test.ts,
      test/unit/classroom-shell.test.tsx,
      test/e2e/guided-speaking-flow.spec.ts,
    ]
key-decisions:
  - "Promote fallback into an explicit teacher_fallback_model phase before the final follow CTA."
  - "Reuse teacher_echo as the final follow phase and keep the only child-facing button label as I said it with Cora."
  - "Keep fallback answers in spokenModel only while stage prompts, visibleCaption, podium status, and browser assertions stay answer-free."
patterns-established:
  - "Pattern 1: second failure or fallback judgment routes to teacher_fallback_model, then teacher_echo, then move_next."
  - "Pattern 2: shell and Playwright regressions must keep the baseline repeat-to-picture flow alongside fallback coverage."
requirements-completed: [TEAC-04, SPKG-05]
duration: 12min
completed: 2026-04-21
---

# Phase 4 Plan 3: Fallback Close-Out Summary

**Teacher-owned fallback model plus one final follow CTA for repeat and picture turns, covered by shell and browser regression gates**

## Performance

- **Duration:** 12 min
- **Started:** 2026-04-21T15:26:00+08:00
- **Completed:** 2026-04-21T15:37:57+08:00
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Added an explicit `teacher_fallback_model` phase so second failures no longer skip straight to turn close-out.
- Reused the single podium CTA as a final follow step with `I said it with Cora`, while keeping fallback answers out of child-facing copy.
- Added focused shell and Playwright coverage for both the preserved baseline path and the new fallback branch.

## Task Commits

Each task was committed atomically:

1. **Task 1: 实现 repeat/picture 的 fallback model + final follow close-out**
   - `0de0e17` (`test`) RED: failing fallback close-out coverage
   - `df678a3` (`feat`) GREEN: fallback close-out phase graph
2. **Task 2: 补齐 fallback-focused shell/e2e 回归门，并保留 Phase 3 baseline**
   - `cc4dae7` (`test`) regression gate: shell + Playwright fallback coverage

## Files Created/Modified

- `src/features/classroom-shell/classroom-orchestrator.ts` - Added `teacher_fallback_model`, final follow submit handling, and second-failure routing.
- `src/features/classroom-shell/use-classroom-orchestrator.ts` - Passed lesson item metadata into teacher scripts and exposed final follow stage prompts.
- `src/features/classroom-shell/teacher-script.ts` - Split fallback `spokenModel` from child-safe `visibleCaption` for repeat and picture stages.
- `src/features/classroom-shell/podium-view-model.ts` - Kept one CTA while switching the final follow label to `I said it with Cora`.
- `test/unit/classroom-orchestrator.test.ts` - Covered fallback model entry, final follow CTA, and move-next transitions.
- `test/unit/teacher-script.test.ts` - Guarded against answer leakage in fallback and final follow copy.
- `test/unit/classroom-shell.test.tsx` - Added repeat and picture fallback integration coverage with one-button assertions.
- `test/e2e/guided-speaking-flow.spec.ts` - Preserved baseline smoke and added a fallback-focused browser branch.

## Decisions Made

- Used a dedicated fallback-model phase instead of overloading `teacher_encourage`, so reducer semantics stay explicit for TEAC-04.
- Kept the final follow on the existing podium button instead of adding a second control, preserving the shell’s single-CTA contract.
- Let fallback models surface only in `spokenModel` and debug channels, not in stage prompt, podium status, or visible teacher copy.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Two pre-existing shell expectations still assumed the old “Thanks for trying” picture close-out; they were updated to the new fallback-model sequence during Task 2 so regression tests matched the implemented Phase 4 contract.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 4 now satisfies the fallback close-out requirement for both repeat and picture speaking turns.
- Phase 5 can build the full 15-minute lesson on top of a stable baseline flow plus explicit fallback coverage.

## Self-Check

PASSED

- Found `.planning/phases/04-hints-and-judgment/04-03-SUMMARY.md`
- Found commits `0de0e17`, `df678a3`, `cc4dae7`

---
*Phase: 04-hints-and-judgment*
*Completed: 2026-04-21*
