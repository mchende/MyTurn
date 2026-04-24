---
phase: 07-speech-recognition-wiring
status: human_needed
verified_on: 2026-04-24
requirements:
  - ASR-01
  - ASR-02
  - ASR-03
  - ASR-04
  - PLAT-05
source_plans:
  - 07-01
  - 07-02
  - 07-03
---

# Phase 07 Verification

## Goal

把孩子语音转成 transcript，并接进既有课堂判断链路，让 repeat 和 picture 两类作答都能真实运行，同时把等待、失败和成功率观测维持在课堂感允许的范围内。

## Must-Have Check

- **ASR-01:** `src/features/classroom-shell/use-classroom-audio-runtime.ts` 现在会在 `student_wait` 音频回合中启动 recognition，并在结束录音后统一通过 `submitStudentAttempt({ source: 'future_asr' })` 把 transcript 或 `null` 结果重新送回既有 reducer。
- **ASR-02:** repeat 成功仍然落回既有 lexical judgment；`test/unit/classroom-orchestrator.test.ts` 已覆盖 `future_asr` source 下的 repeat pass / retry / fallback。
- **ASR-03:** picture-talk 也走同一条 `future_asr` 提交流程，但接受宽松度仍来自 `semanticAccepts`；`test/unit/classroom-orchestrator.test.ts` 和 `test/unit/classroom-transcript-adapter.test.ts` 明确防止 adapter 强纠错。
- **ASR-04:** transcript wait、timeout、empty、error reason 已进入共享 runtime telemetry；失败时继续回到老师主导的 encourage / fallback 路径，不会把课堂卡在 waiting。
- **PLAT-05:** `test/e2e/helpers/fake-browser-audio.ts` 和 `test/e2e/audio-classroom-runtime.spec.ts` 已能用 fake recognition 表达 success / empty / timeout 类结果，并为 focused browser smoke 提供稳定 harness。

## Automated Checks

```bash
npm run test:unit -- test/unit/classroom-transcript-adapter.test.ts test/unit/classroom-speech-recognition.test.ts test/unit/classroom-audio-runtime.test.ts test/unit/classroom-shell.test.tsx test/unit/classroom-orchestrator.test.ts
npx playwright test test/e2e/audio-classroom-runtime.spec.ts --list
```

Result:

- unit: passed on 2026-04-24 (`49/49`)
- playwright listing: passed on 2026-04-24 (`3` smoke tests discovered)

## Blocked Check

```bash
npm run test:e2e -- test/e2e/audio-classroom-runtime.spec.ts
```

Blocked on 2026-04-24 in the current desktop environment:

- `next dev` fails to bind a local port with `listen EACCES: permission denied 127.0.0.1:3201`
- the same error reproduces when launching `npx next dev --hostname 127.0.0.1 --port 3201` directly

This is an environment/runtime restriction, not a known application assertion failure.

## Evidence

- `src/features/classroom-shell/classroom-transcript-adapter.ts` and `classroom-speech-recognition.ts` define the bounded cleanup and browser recognition contracts for repeat/picture wiring.
- `src/features/classroom-shell/use-classroom-audio-runtime.ts` now coordinates recording start/stop, transcript wait telemetry, and `future_asr` submission for both repeat and picture student turns.
- `test/unit/classroom-shell.test.tsx` now covers repeat success/wait/failure and picture audio success while preserving one CTA and Bobby boundaries.
- `test/e2e/helpers/fake-browser-audio.ts` adds a queued fake recognition provider, and `test/e2e/audio-classroom-runtime.spec.ts` defines the focused preflight/repeat/picture/empty-retry browser smoke.

## Human Verification Needed

1. Run `npm run test:e2e -- test/e2e/audio-classroom-runtime.spec.ts` in an environment where Next.js can listen on a local port.
2. In a real target browser, manually walk one repeat and one picture answer with actual microphone input to confirm browser-native recognition availability and classroom pacing.

## Verdict

human_needed

Phase 07 implementation is ready for final smoke/manual verification, but this session cannot issue a full `passed` verdict because the local environment blocks the Playwright web server from starting.
