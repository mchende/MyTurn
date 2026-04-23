---
phase: 06-audio-classroom-runtime
plan: 03
subsystem: validation
tags: [responsive, playwright, focused-smoke, browser-audio]
requires:
  - phase: 06-audio-classroom-runtime
    provides: preflight shell wiring, inline playback state, single CTA recording surface
provides:
  - 音频模式 focused unit regression for shell layout and runtime boundaries
  - fake-browser-audio Playwright smoke covering lesson entry and audio classroom flow
  - stable browser evidence for preflight pass/skip and single CTA recording visibility
affects: [playwright, classroom-entry, audio-classroom-runtime, validation]
tech-stack:
  added: []
  patterns: [browser-init audio mocks, focused smoke over full-loop reruns]
key-files:
  created:
    - test/e2e/audio-classroom-runtime.spec.ts
    - test/e2e/helpers/fake-browser-audio.ts
    - .planning/phases/06-audio-classroom-runtime/06-03-SUMMARY.md
  modified:
    - test/e2e/classroom-entry.spec.ts
    - src/features/classroom-shell/use-classroom-audio-runtime.ts
    - test/unit/classroom-shell.test.tsx
key-decisions:
  - "Focused browser verification uses injected fake speech synthesis, getUserMedia, and MediaRecorder instead of relying on real hardware."
  - "The entry smoke is updated to understand preflight instead of pretending lesson pages render the classroom shell immediately."
  - "Browser smoke verifies CTA presence and classroom-shell continuity, while the fine-grained recording-state copy transition stays covered by focused unit tests."
patterns-established:
  - "Audio browser regressions can be verified through init-script adapters without expanding to full end-to-end lesson runs."
  - "Responsive regressions stay in the shell unit suite; browser smoke only proves the key web flow is intact."
requirements-completed: [AUDIO-01, AUDIO-02, AUDIO-03, VOICE-01, VOICE-02, VOICE-03, CLAS-05, CLAS-07, PLAT-03, PLAT-04]
duration: 24m
completed: 2026-04-23
---

# Phase 06 Plan 03: Audio Classroom Runtime Summary

**Phase 6 now has stable focused browser proof: users can enter lesson preflight, skip or pass it, land in the classroom shell, see audio-aware playback surfaces, and reach the single recording CTA without depending on real hardware**

## Performance

- **Duration:** 24m
- **Completed:** 2026-04-23
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Added a reusable Playwright helper that injects fake speech synthesis, microphone permission, `getUserMedia`, and `MediaRecorder` so audio classroom smoke stays stable on CI/dev machines.
- Updated `classroom-entry.spec.ts` to include the preflight gate, skip path, and post-entry classroom assertions.
- Added `audio-classroom-runtime.spec.ts` to cover preflight pass, skip fallback, classroom landing, and single CTA recording visibility.
- Closed the hydration mismatch exposed by browser tests by making audio runtime activation hydration-safe.

## Verification

```bash
npm run test:e2e -- test/e2e/classroom-entry.spec.ts test/e2e/audio-classroom-runtime.spec.ts
```

Result: passed on 2026-04-23 (`4/4`).

## Issues Encountered

- The first browser smoke tried to assert the transient `Listening... tap again` label directly and proved flaky under live timers; kept that state transition in focused unit coverage and used browser smoke for the more durable shell continuity checks instead.

## Self-Check: PASSED

- FOUND: `test/e2e/audio-classroom-runtime.spec.ts`
- FOUND: `test/e2e/helpers/fake-browser-audio.ts`
- FOUND: `Audio check skipped`
- FOUND: `podium-primary-action`
