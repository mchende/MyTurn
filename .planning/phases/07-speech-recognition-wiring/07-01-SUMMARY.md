---
phase: 07-speech-recognition-wiring
plan: 01
subsystem: classroom-shell
tags: [speech-recognition, transcript-adapter, audio-runtime, telemetry]
requires:
  - phase: 06-audio-classroom-runtime
    provides: shared classroom audio runtime, preflight shell wiring, single CTA recording entry
provides:
  - browser speech recognition service contract with explicit unavailable/timeout/error outcomes
  - bounded transcript adapter for child-friendly cleanup without answer rewriting
  - transcript waiting telemetry and dev-only HUD on the classroom shell
affects: [repeat-wiring, picture-wiring, classroom-audio-runtime, focused-unit-tests]
tech-stack:
  added: []
  patterns: [bounded transcript cleanup, explicit transcript wait telemetry, dev-only runtime HUD]
key-files:
  created:
    - src/features/classroom-shell/classroom-transcript-adapter.ts
    - src/features/classroom-shell/classroom-speech-recognition.ts
    - test/unit/classroom-transcript-adapter.test.ts
    - test/unit/classroom-speech-recognition.test.ts
    - .planning/phases/07-speech-recognition-wiring/07-01-SUMMARY.md
  modified:
    - src/features/classroom-shell/classroom-audio-runtime.ts
    - src/features/classroom-shell/use-classroom-audio-runtime.ts
    - src/features/classroom-shell/classroom-shell.tsx
    - test/unit/classroom-audio-runtime.test.ts
    - test/unit/classroom-shell.test.tsx
key-decisions:
  - "Transcript adapter only removes bounded filler and repeated starts, then reuses the existing transcript normalization contract."
  - "Browser speech recognition must surface unavailable, empty, timeout, and error as explicit outcomes instead of silently no-oping."
  - "Transcript waiting stays in the shared audio runtime, while visibility of telemetry stays dev/test only and never becomes child-facing classroom copy."
patterns-established:
  - "Stopping student recording now enters an explicit transcript waiting state with timeout, latency, failure reason, and last transcript fields."
  - "The classroom shell can expose runtime telemetry to developers without adding a new blocking panel or technical copy for children."
requirements-completed: [ASR-01, ASR-04, PLAT-05]
duration: 42m
completed: 2026-04-24
---

# Phase 07 Plan 01: Speech Recognition Wiring Summary

**Phase 7 now has a real transcript/recognition foundation: bounded transcript cleanup, explicit browser recognition outcomes, and observable transcript waiting inside the shared classroom audio runtime**

## Performance

- **Duration:** 42m
- **Completed:** 2026-04-24
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- Added `classroom-transcript-adapter.ts` so child ASR text can be lightly cleaned without rewriting wrong answers into right ones.
- Added `classroom-speech-recognition.ts` with a browser-native recognition contract that makes `unavailable`, `empty`, `timeout`, and `error` explicit and testable.
- Extended `classroom-audio-runtime.ts` so `stopStudentRecording()` now enters a real transcript wait state with latency and failure telemetry instead of treating the wait as a black box.
- Added a dev-only transcript HUD in `classroom-shell.tsx` while keeping the child-facing copy classroom-shaped, such as `One more second...`.

## Task Commits

1. **Task 1: 建立 transcript adapter 与 browser recognition service 的合同测试** - `9195f08` (`feat`)
2. **Task 2: 扩展音频 runtime 的 recognition wait telemetry，并加 dev-only 观测面** - `c3cb11b` (`feat`)

## Verification

```bash
npm run test:unit -- test/unit/classroom-transcript-adapter.test.ts test/unit/classroom-speech-recognition.test.ts test/unit/classroom-audio-runtime.test.ts test/unit/classroom-shell.test.tsx
```

Result: passed on 2026-04-24 (`31/31`).

## Decisions Made

- Reused `normalizeStudentTranscript()` as the final normalization pass so ASR cleanup does not fork away from the judgment contract.
- Kept transcript waiting in the audio runtime instead of sprinkling waiting logic into shell UI state.
- Rendered telemetry only when `NODE_ENV !== 'production'`, so developers can inspect transcript latency/failure without exposing technical copy to children.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- The first `07-01` executor stalled in the sandbox because `vitest` startup hit `Error: spawn EPERM`; resumed the plan inline and verified the same targeted suite in an unrestricted test environment.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `07-02` can now wire repeat recognition into `submitStudentAttempt({ source: 'future_asr' })` without inventing new transcript contracts.
- `07-03` can build on the same waiting telemetry and debug hooks for picture-talk and focused browser smoke.

## Self-Check: PASSED

- FOUND: `adaptRecognizedTranscript`
- FOUND: `createBrowserSpeechRecognitionService`
- FOUND: `transcriptStatus`
- FOUND: `classroom-audio-debug`
