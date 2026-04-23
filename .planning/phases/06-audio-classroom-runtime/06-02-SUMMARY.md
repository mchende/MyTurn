---
phase: 06-audio-classroom-runtime
plan: 02
subsystem: classroom-shell
tags: [audio-preflight, shell-wiring, single-cta, responsive]
requires:
  - phase: 06-audio-classroom-runtime
    provides: shared classroom audio runtime, script audio cue contract, retryable recording failures
provides:
  - 进课前轻量音频预检卡与 skip 风险提示
  - 课堂壳内嵌的老师/Bobby 播报状态与单 CTA 录音入口
  - 轻量失败 / retry / warning surface，避免遮挡主课件
affects: [lesson-entry, classroom-shell, classroom-audio-runtime, unit-tests]
tech-stack:
  added: []
  patterns: [hydration-safe audio gate, inline audio status chips, single CTA recording surface]
key-files:
  created:
    - src/features/classroom-shell/audio-preflight-card.tsx
    - src/features/classroom-shell/use-classroom-audio-runtime.ts
    - .planning/phases/06-audio-classroom-runtime/06-02-SUMMARY.md
  modified:
    - src/features/classroom-shell/classroom-shell.tsx
    - src/features/classroom-shell/classroom-audio-runtime.ts
    - test/unit/classroom-shell.test.tsx
key-decisions:
  - "Preflight stays inside the lesson route as a lightweight classroom-prep card instead of a separate settings page."
  - "Teacher/Bobby playback state and retry hints stay embedded in the teacher/podium columns; no new board-blocking overlay is introduced."
  - "Audio capability detection is delayed until hydration so the client-only preflight surface does not cause SSR mismatch."
patterns-established:
  - "The shell consumes one runtime view-model for preflight, playback, recording, retry, and warning states."
  - "The child-facing podium keeps one CTA even in audio mode: Tap to talk -> Listening... tap again -> Try again."
requirements-completed: [AUDIO-01, AUDIO-02, AUDIO-03, VOICE-01, VOICE-02, VOICE-03, CLAS-05, CLAS-07, PLAT-03, PLAT-04]
duration: 32m
completed: 2026-04-23
---

# Phase 06 Plan 02: Audio Classroom Runtime Summary

**The lesson now stops for a brief audio check before class, then re-enters the familiar classroom shell with auto-voice cues, one child CTA, and soft failure handling instead of device-tool UI**

## Performance

- **Duration:** 32m
- **Completed:** 2026-04-23
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Added `AudioPreflightCard` so the lesson route can do a speaker/microphone check before class while still allowing a skip path with a clear risk warning.
- Wired `useClassroomAudioRuntime` into `ClassroomShell`, so the shell now consumes preflight, playback, recording, retry, and warning state from the shared runtime instead of managing browser audio APIs directly.
- Kept the child-facing surface classroom-like: teacher audio status lives in the teacher column, the podium keeps a single CTA, and the board remains fully visible.
- Fixed the runtime stop path so sync `MediaRecorder.stop()` callbacks no longer race the current recorder cleanup.

## Verification

```bash
npm run test:unit -- test/unit/classroom-shell.test.tsx test/unit/classroom-audio-runtime.test.ts test/unit/classroom-orchestrator.test.ts
```

Result: passed on 2026-04-23 (`39/39`).

## Issues Encountered

- The first shell audio tests were unstable under `fake timers + userEvent`; switched the new audio-only interactions to direct click helpers while leaving existing classroom helpers untouched.
- Browser-only audio capability detection initially caused a hydration mismatch; fixed by enabling the runtime after hydration and keeping preflight activation client-safe.

## Self-Check: PASSED

- FOUND: `audio-preflight-card`
- FOUND: `teacher-audio-status`
- FOUND: `podium-primary-action`
- FOUND: `Tap to talk`
