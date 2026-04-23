---
phase: 06-audio-classroom-runtime
plan: 01
subsystem: ui
tags: [audio-runtime, speech-synthesis, mediarecorder, vitest]
requires:
  - phase: 05-complete-mvp-lesson
    provides: 既有 lesson state machine、teacher/bobby script contract 与完成态课堂壳
provides:
  - 共享 classroom audio runtime contract，覆盖播放、录音、失败态与重试
  - 录音 MIME 选择与录音 artifact 输出边界
  - 老师/Bobby 可直接供 runtime 消费的 audio speaker / cue key 合同
affects: [06-02, 06-03, classroom-shell, preflight, voice-input]
tech-stack:
  added: []
  patterns: [injected audio runtime dependencies, script-to-audio cue identity]
key-files:
  created:
    - src/features/classroom-shell/classroom-audio-runtime.ts
    - src/features/classroom-shell/classroom-audio-service.ts
    - .planning/phases/06-audio-classroom-runtime/06-01-SUMMARY.md
  modified:
    - src/features/classroom-shell/teacher-script.ts
    - src/features/classroom-shell/bobby-script.ts
    - test/unit/classroom-audio-runtime.test.ts
    - test/unit/teacher-script.test.ts
    - test/unit/bobby-script.test.ts
key-decisions:
  - "Phase 6 的音频底座采用可注入依赖的 runtime factory，而不是让课堂壳组件直接控制播放和录音生命周期。"
  - "录音 MIME 通过 MediaRecorder.isTypeSupported() 选取浏览器支持值，优先保证网页端可录。"
  - "老师和 Bobby 的脚本合同新增 audioSpeaker / audioCueKey，runtime 直接消费脚本而不再从 UI 文案反推角色。"
patterns-established:
  - "Shared classroom audio runtime owns playback, recording, retry, and artifact emission before UI wiring begins."
  - "Script modules remain the single source of truth for child-facing captions and spoken audio identity."
requirements-completed: [AUDIO-01, AUDIO-02, VOICE-01, VOICE-03, CLAS-05, CLAS-07]
duration: 4m
completed: 2026-04-23
---

# Phase 06 Plan 01: Audio Classroom Runtime Summary

**Classroom audio runtime now owns teacher/Bobby playback, browser recording artifacts, and retryable failure states without touching the lesson state machine**

## Performance

- **Duration:** 4m
- **Started:** 2026-04-23T13:45:22+08:00
- **Completed:** 2026-04-23T13:48:21+08:00
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Added a shared `classroom-audio-runtime` contract that covers scripted playback, microphone checks, recording, empty-recording handling, and retryable failure states.
- Added `classroom-audio-service` helpers for scripted playback and browser-supported recording MIME selection.
- Extended teacher/Bobby script contracts with stable audio identities so later shell wiring can consume spoken cues directly.

## Task Commits

Each task was committed atomically:

1. **Task 1: 建立共享播放/录音 runtime 与浏览器音频失败态合同** - `47a0ebd`, `8be0486`
2. **Task 2: 锁定老师/Bobby 的 script-to-audio 边界，不让角色越权** - `f71f82d`, `3154d0c`

_Note: TDD tasks used separate RED and GREEN commits._

## Files Created/Modified

- `src/features/classroom-shell/classroom-audio-runtime.ts` - 提供单通道音频 runtime、录音 artifact、失败态和 retry contract。
- `src/features/classroom-shell/classroom-audio-service.ts` - 提供 shared audio service interface、speech synthesis adapter 和录音 MIME 选择。
- `src/features/classroom-shell/teacher-script.ts` - 为老师 spoken contract 增加 `audioSpeaker` 与 `audioCueKey`。
- `src/features/classroom-shell/bobby-script.ts` - 为 Bobby spoken contract 增加 `audioSpeaker` 与 `audioCueKey`，继续锁住阶段边界。
- `test/unit/classroom-audio-runtime.test.ts` - 覆盖播放阻塞、权限拒绝、MIME fallback、录音成功与空录音失败。
- `test/unit/teacher-script.test.ts` - 覆盖老师 closeout/reward 阶段的 audio-ready contract。
- `test/unit/bobby-script.test.ts` - 覆盖 Bobby 仅在 repeat demo turns 暴露 audio-ready contract。

## Decisions Made

- 音频 runtime 先做成纯 contract-first factory，并通过依赖注入隔离浏览器 API，避免把 `classroom-shell.tsx` 变成设备生命周期 owner。
- 录音 artifact 在 Phase 6 先只输出 `blob + mimeType + durationMs`，把 transcript 接线留给 Phase 7。
- 脚本模块继续保留“spoken”和“visible”双轨，新增音频标识字段而不是新建第三套 audio 文案层。

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `gsd-tools state begin-phase` 把 `STATE.md` 错写回了旧 milestone 口径；已在本次 plan metadata 收口时手动校正到 `v1.1` 当前状态。

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- 06-02 现在可以直接把 preflight、自动播报和单 CTA 录音入口接进课堂壳，而不用让 UI 组件自己摸浏览器音频 API。
- 真正的 teacher/Bobby 发声 provider 和 preflight UI 还未接到课堂表面，仍由 06-02 完成。

## Self-Check: PASSED

- FOUND: `.planning/phases/06-audio-classroom-runtime/06-01-SUMMARY.md`
- FOUND: `47a0ebd`
- FOUND: `8be0486`
- FOUND: `f71f82d`
- FOUND: `3154d0c`

---
*Phase: 06-audio-classroom-runtime*
*Completed: 2026-04-23*
