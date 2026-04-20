---
phase: 03-guided-speaking-flow
plan: 02
subsystem: ui
tags: [react, vitest, testing-library, guided-speaking, classroom-shell]
requires:
  - phase: 02-cast-and-orchestration
    provides: reducer-driven classroom shell, teacher-led seat orchestration, Bobby persona wiring
  - phase: 03-guided-speaking-flow
    provides: stage-aware queue, participation confirmation event, guided-stage metadata
provides:
  - child-safe teacher `visibleCaption` separate from target-bearing `spokenModel`
  - Bobby demo gating limited to `repeat-after-teacher` plus `ai_model`
  - single podium confirmation CTA with stage-aware labels and user-event coverage
affects: [03-03, teacher-script, bobby-script, classroom-shell, podium-view-model]
tech-stack:
  added: [@testing-library/user-event]
  patterns: [visibleCaption-plus-spokenModel script contract, stage-aware podium confirmation CTA, fake-timer user-event click helper]
key-files:
  created: []
  modified:
    - package.json
    - package-lock.json
    - src/features/classroom-shell/teacher-script.ts
    - src/features/classroom-shell/bobby-script.ts
    - src/features/classroom-shell/podium-view-model.ts
    - src/features/classroom-shell/use-classroom-orchestrator.ts
    - src/features/classroom-shell/classroom-shell.tsx
    - test/unit/teacher-script.test.ts
    - test/unit/bobby-script.test.ts
    - test/unit/classroom-shell.test.tsx
key-decisions:
  - "Teacher-facing UI now renders child-safe visibleCaption while spokenModel preserves target-language modeling for audio consumers."
  - "Participation confirmation stays as one podium CTA and switches copy by stage: repeat-after-teacher uses 'I said it', picture-talk uses 'I answered'."
  - "Bobby remains visible only in repeat-after-teacher ai_model turns so picture-talk retries stay teacher-owned."
patterns-established:
  - "Teacher scripts should carry both visibleCaption and spokenModel whenever target-language modeling differs from child-facing UI."
  - "Interactive classroom tests use userEvent.setup with fake-timer coordination instead of dispatching reducer events directly."
requirements-completed: [CONT-03, TEAC-02, SPKG-01]
duration: 8min
completed: 2026-04-20
---

# Phase 03 Plan 02: Guided Speaking Script and Confirmation Summary

**Stage-aware teacher/Bobby scripts with a single podium confirmation control that keeps repeat modeling audible without leaking target text into the child-facing shell**

## Performance

- **Duration:** 8 min
- **Started:** 2026-04-20T11:03:20+08:00
- **Completed:** 2026-04-20T11:10:53+08:00
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- Split teacher scripting into `visibleCaption` and `spokenModel`, so repeat-after-teacher can model the target language while the rendered UI stays child-safe.
- Tightened Bobby gating to `repeat-after-teacher` plus `ai_model`, keeping picture-talk retries and recovery fully teacher-owned.
- Added one podium confirmation button with stage-specific English labels, routed through `confirmStudentParticipation()`, and covered the flow with `user-event` tests.

## Task Commits

Each task was committed atomically:

1. **Task 1: 拆分老师 spoken model 与 child-safe 可见文案，并收紧 Bobby 准入** - `2d779ae` (test), `e1372d3` (feat)
2. **Task 2: 在保留现有课堂壳的前提下接入 confirmation control 与 stage-aware copy** - `e60340b` (test), `28cfe12` (feat)

## Files Created/Modified

- `package.json` - Adds `@testing-library/user-event` for classroom interaction tests.
- `package-lock.json` - Locks the new testing dependency.
- `src/features/classroom-shell/teacher-script.ts` - Defines stage-aware `visibleCaption` and `spokenModel` output.
- `src/features/classroom-shell/bobby-script.ts` - Requires both `stageId` and `ai_model` before Bobby can speak.
- `src/features/classroom-shell/podium-view-model.ts` - Produces English podium copy plus confirmation CTA visibility/labels.
- `src/features/classroom-shell/use-classroom-orchestrator.ts` - Threads stage metadata into teacher/Bobby scripts and exposes child-safe teacher copy to the shell.
- `src/features/classroom-shell/classroom-shell.tsx` - Renders the podium confirmation button and keeps TeacherColumn on child-safe captions.
- `test/unit/teacher-script.test.ts` - Covers visible/spoken split and picture-talk question safety.
- `test/unit/bobby-script.test.ts` - Covers repeat-only Bobby visibility.
- `test/unit/classroom-shell.test.tsx` - Covers visibleCaption rendering, button labels, user-event progression, and no-target-text leakage.

## Decisions Made

- Rendered `teacherScriptLine.visibleCaption` in the teacher card and left `spokenModel` as a parallel contract for future audio/TTS consumers.
- Kept the participation control inside the existing podium block rather than introducing a second panel or extra teacher UI chrome.
- Converted stage badge, prompt, and podium status copy to short English so the shell stays image-led and child-safe.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `user-event` clicks under Vitest fake timers did not reliably flush React updates when awaited directly. The tests were stabilized by keeping `userEvent.setup({ advanceTimers, delay: null })` and wrapping click initiation in `act(...)`, which preserved real interaction semantics without dispatching reducer events directly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `03-03` can now build on stable visible/spoken contracts without reintroducing target-text leakage into child-facing UI.
- The shell already exposes a single participation CTA and stage-aware podium copy, so the next plan can focus on picture-talk retry polish and board-level validation.

## Self-Check: PASSED

- Summary file exists at `.planning/phases/03-guided-speaking-flow/03-02-SUMMARY.md`.
- Task commits `2d779ae`, `e1372d3`, `e60340b`, and `28cfe12` are present in git history.
- Verification passed with `npm run test:unit -- test/unit/classroom-shell.test.tsx test/unit/teacher-script.test.ts test/unit/bobby-script.test.ts`.

---
*Phase: 03-guided-speaking-flow*
*Completed: 2026-04-20*
