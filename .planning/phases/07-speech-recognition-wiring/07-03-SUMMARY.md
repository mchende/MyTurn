---
phase: 07-speech-recognition-wiring
plan: 03
subsystem: classroom-shell
tags: [picture-recognition, fake-browser-audio, smoke-tests, semantic-judgment]
requires:
  - phase: 07-speech-recognition-wiring
    provides: repeat future_asr bridge, transcript adapter guardrails, runtime transcript telemetry
provides:
  - picture-talk transcript -> future_asr -> semantic judgment bridge
  - fake browser recognition harness for browser smoke
  - focused unit/e2e regression coverage for repeat + picture transcript flows
affects: [picture-talk, playwright-smoke, phase-verification, browser-audio-harness]
tech-stack:
  added: []
  patterns: [shared recognition path for repeat and picture, queued fake recognition results, browser smoke without real cloud ASR]
key-files:
  created:
    - .planning/phases/07-speech-recognition-wiring/07-03-SUMMARY.md
  modified:
    - src/features/classroom-shell/use-classroom-audio-runtime.ts
    - test/unit/classroom-orchestrator.test.ts
    - test/unit/classroom-shell.test.tsx
    - test/unit/classroom-transcript-adapter.test.ts
    - test/e2e/helpers/fake-browser-audio.ts
    - test/e2e/audio-classroom-runtime.spec.ts
key-decisions:
  - "Picture-talk reuses the same future_asr submission bridge as repeat; semantic leniency stays in classroom-judgment, not in transcript cleanup."
  - "Playwright smoke uses a queued fake recognition provider so browser regression proof stays deterministic and independent of cloud ASR availability."
  - "Execution evidence records the local Next dev listen restriction explicitly instead of pretending the e2e smoke ran."
patterns-established:
  - "All student_wait audio turns can use one recognition bridge, while teacher_echo keeps the compatibility confirmation path."
  - "Browser smoke can enqueue transcript success or failure reasons through one fake recognition queue shared by the page under test."
requirements-completed: [ASR-01, ASR-03, ASR-04, PLAT-05]
duration: 36m
completed: 2026-04-24
---

# Phase 07 Plan 03: Speech Recognition Wiring Summary

**Picture-talk now follows the same real transcript path as repeat, and the browser test harness can drive repeat/picture recognition outcomes without depending on real cloud ASR**

## Performance

- **Duration:** 36m
- **Completed:** 2026-04-24
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Generalized `use-classroom-audio-runtime.ts` so `student_wait` in both repeat and picture modes uses the same `future_asr` bridge, while fallback `teacher_echo` still stays on the compatibility confirmation path.
- Added unit coverage proving picture `future_asr` still uses existing semantic judgment and retry/fallback behavior, and transcript cleanup still refuses to rewrite wrong picture answers into accepted ones.
- Extended `fake-browser-audio.ts` with a queued fake recognition provider and updated `audio-classroom-runtime.spec.ts` to model preflight, repeat success, picture success, and repeat empty-result retry.

## Task Commits

1. **Task 1: 把 picture-talk transcript 接进既有 semantic judgment 与老师主导兜底** - `693b6e7` (`feat`)
2. **Task 2: 用 fake browser recognition 补 focused smoke，证明 Phase 7 网页闭环** - `6d635d7` (`test`)

## Verification

```bash
npm run test:unit -- test/unit/classroom-shell.test.tsx test/unit/classroom-orchestrator.test.ts test/unit/classroom-transcript-adapter.test.ts
npx playwright test test/e2e/audio-classroom-runtime.spec.ts --list
```

Result: unit passed on 2026-04-24 (`45/45`); Playwright listed 3 focused smoke cases successfully.

## Decisions Made

- Reused the repeat recognition bridge for picture instead of introducing a picture-only audio pathway.
- Kept semantic flexibility in `classroom-judgment.ts` and only added one more adapter guardrail assertion to prevent hidden transcript correction.
- Treated the local `next dev` listen failure as an environment blocker for smoke execution, not as a reason to weaken or delete the new Playwright coverage.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Focused Playwright smoke could not be executed end-to-end in this desktop environment because `next dev` fails to listen on local ports with `EACCES`; added the full smoke file, confirmed Playwright can parse/list it, and carried the environment blocker into phase verification.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 07 implementation is code-complete for repeat and picture transcript wiring.
- Final phase verdict now depends on rerunning `test/e2e/audio-classroom-runtime.spec.ts` in an environment where Next.js can bind a local port, plus the usual real-browser/manual checks for ASR behavior.

## Self-Check: PASSED

- FOUND: `stageId === 'picture-talk'`
- FOUND: `source: 'future_asr'`
- FOUND: `__pushFakeRecognitionResult`
- FOUND: `repeat recognition empty results return to teacher-led retry`
