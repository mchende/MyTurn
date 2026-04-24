---
phase: 07-speech-recognition-wiring
plan: 02
subsystem: classroom-shell
tags: [repeat-recognition, future-asr, teacher-led-fallback, single-cta]
requires:
  - phase: 07-speech-recognition-wiring
    provides: transcript adapter, browser recognition contract, transcript wait telemetry
provides:
  - repeat-after-teacher transcript -> future_asr -> lexical judgment bridge
  - teacher-led retry/fallback for repeat recognition failures
  - repeat success/failure classroom flow coverage in shell and reducer tests
affects: [repeat-after-teacher, classroom-shell, orchestrator, phase-07-regression]
tech-stack:
  added: []
  patterns: [record-start starts recognition, stop-and-wait submits future_asr, failure reuses existing teacher path]
key-files:
  created:
    - .planning/phases/07-speech-recognition-wiring/07-02-SUMMARY.md
  modified:
    - src/features/classroom-shell/use-classroom-audio-runtime.ts
    - src/features/classroom-shell/classroom-shell.tsx
    - test/unit/classroom-orchestrator.test.ts
    - test/unit/classroom-shell.test.tsx
key-decisions:
  - "Repeat recognition only submits through submitStudentAttempt({ source: 'future_asr' }); it never reuses the old direct confirmation shortcut."
  - "Recognition failure still submits a null transcript into the existing judgment path so retry/fallback remains teacher-led and stage-aware."
  - "Teacher echo and picture-talk stay on the compatibility path for now; only repeat-after-teacher is promoted to real transcript wiring in 07-02."
patterns-established:
  - "Repeat mode starts browser recognition when recording starts, then stops recognition on the second tap and awaits one final result."
  - "Classroom-facing surfaces keep soft copy while technical failure reasons remain confined to the dev HUD."
requirements-completed: [ASR-01, ASR-02, ASR-04, PLAT-05]
duration: 31m
completed: 2026-04-24
---

# Phase 07 Plan 02: Speech Recognition Wiring Summary

**Repeat-after-teacher now runs through a real transcript path, so the child’s second tap ends recording, resolves recognition, and re-enters the existing lexical judgment and teacher-led fallback flow**

## Performance

- **Duration:** 31m
- **Completed:** 2026-04-24
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Wired `use-classroom-audio-runtime.ts` so repeat recording now starts recognition with the first tap and submits `future_asr` attempts after the second tap ends recording.
- Kept repeat failures inside the existing classroom reducer path by sending `null` transcript attempts back through `submitStudentAttempt`, which preserves teacher encourage/fallback flow instead of introducing a tool error state.
- Added reducer coverage for repeat `future_asr` success and failure, plus shell coverage for repeat success/wait/failure flow under a controlled fake recognition service.

## Task Commits

1. **Task 1: 把 repeat-after-teacher 的 stop -> recognize -> submit judgment 链接通** - `7117d82` (`feat`)
2. **Task 2: 保持 repeat 阶段的课堂感和 Bobby 边界，不把识别态做成工具 UI** - `8d4eaf4` (`test`)

## Verification

```bash
npm run test:unit -- test/unit/classroom-shell.test.tsx test/unit/classroom-orchestrator.test.ts test/unit/classroom-audio-runtime.test.ts
```

Result: passed on 2026-04-24 (`44/44`).

## Decisions Made

- Recognition success resolves the cleaned transcript into runtime telemetry before dispatching `future_asr`, so shell debug data and reducer state stay aligned.
- Recognition failure dispatches `transcript: null` instead of inventing a parallel error event in the reducer.
- The child-facing button after retry remains one CTA; in audio mode it returns to `Tap to talk`, while non-audio compatibility paths still use `I said it`.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- The repeat failure shell assertion initially assumed the retry CTA would keep the old `I said it` label, but the real audio-mode contract returns to `Tap to talk`; updated the test to match the single-CTA audio flow.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `07-03` can now reuse the same `future_asr` bridge for `picture-talk` without reopening repeat logic.
- The fake recognition controller added in shell tests gives `07-03` a stable harness for picture success/failure and browser smoke coverage.

## Self-Check: PASSED

- FOUND: `source: 'future_asr'`
- FOUND: `buildRecognitionAttemptPayload`
- FOUND: `teacher_encourage`
- FOUND: `Tap to talk`
