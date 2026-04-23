---
phase: 06-audio-classroom-runtime
status: passed
verified_on: 2026-04-23
requirements:
  - AUDIO-01
  - AUDIO-02
  - AUDIO-03
  - VOICE-01
  - VOICE-02
  - VOICE-03
  - CLAS-05
  - CLAS-07
  - PLAT-03
  - PLAT-04
source_plans:
  - 06-01
  - 06-02
  - 06-03
---

# Phase 06 Verification

## Goal

让课堂先真正“发声并能听见”：老师/Bobby 能自动播报，孩子在正式课堂前可做轻量音频预检，被点名时看到单 CTA 录音入口，并且这些音频态不会重新打坏课堂布局。

## Must-Have Check

- **AUDIO-01 / AUDIO-03:** `src/features/classroom-shell/classroom-shell.tsx` 现在通过 `useClassroomAudioRuntime()` 消费老师/Bobby 播报状态，把音频状态嵌进老师区和讲台区，并继续让 `LessonBoard` 保持完整可见；没有新增遮挡课件的大遮罩层。
- **AUDIO-02:** Bobby 的 spoken cue 仍来自 `bobby-script.ts`，而 `test/unit/bobby-script.test.ts` 和 `test/unit/classroom-audio-runtime.test.ts` 保持 Bobby 只在 `repeat-after-teacher` 的 `ai_model` 里出声。
- **VOICE-01 / CLAS-07:** `src/features/classroom-shell/audio-preflight-card.tsx` 和 `src/features/classroom-shell/use-classroom-audio-runtime.ts` 让 lesson route 在正式进课前完成轻量 speaker / microphone 检查，并保留 skip path 的课堂化 warning。
- **VOICE-02 / VOICE-03 / CLAS-05:** 讲台区继续只保留一个孩子侧 CTA，由 runtime 统一驱动 `Tap to talk -> Listening... tap again -> Try again` 合同；`classroom-audio-runtime.ts` 的 stop/retry 路径修复后，录音失败仍会落回轻提示和 retry，而不是系统报错面板。
- **PLAT-03 / PLAT-04:** `classroom-shell.tsx` 与 `test/unit/classroom-shell.test.tsx` 继续保持顶部席位、课件区、老师区和讲台区在音频模式下完整可见或可滚动；focused browser smoke 证明 preflight 和单 CTA 存在时课堂壳没有被重新裁坏。

## Automated Checks

```bash
npm run test:unit -- test/unit/classroom-shell.test.tsx test/unit/classroom-audio-runtime.test.ts test/unit/classroom-orchestrator.test.ts
npm run test:e2e -- test/e2e/classroom-entry.spec.ts test/e2e/audio-classroom-runtime.spec.ts
```

Result: all passed on 2026-04-23 (`39/39` unit, `4/4` e2e).

## Evidence

- `src/features/classroom-shell/audio-preflight-card.tsx` adds a lightweight classroom-prep card with speaker check, microphone check, skip, and soft warning copy.
- `src/features/classroom-shell/use-classroom-audio-runtime.ts` now owns hydration-safe audio gating, preflight dismissal, playback/recording state, and runtime retry surfaces for the shell.
- `src/features/classroom-shell/classroom-shell.tsx` keeps audio state inside the existing teacher/podium columns and preserves the already-verified classroom layout.
- `test/unit/classroom-shell.test.tsx` now covers preflight pass/skip, playback cue wiring, single CTA recording entry, and soft retry copy.
- `test/e2e/helpers/fake-browser-audio.ts`, `test/e2e/classroom-entry.spec.ts`, and `test/e2e/audio-classroom-runtime.spec.ts` provide stable browser proof without relying on real microphone hardware or system TTS.

## Residual Risk

- Browser smoke intentionally keeps the single-CTA proof at the “visible and clickable” layer; the fine-grained `Listening... tap again` transition remains unit-covered and may still deserve a real-device walkthrough on tablet landscape.
- Phase 06 still stops before transcript / judgment wiring. Real voice recognition success rate, timeout tuning, and transcript quality remain Phase 07 scope.

## Verdict

passed

Phase 06 达成目标，可以进入 Phase 07。
