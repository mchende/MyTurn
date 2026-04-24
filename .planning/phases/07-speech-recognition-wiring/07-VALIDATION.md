---
phase: 07
slug: speech-recognition-wiring
status: human_needed
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-24
---

# Phase 07 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest + Testing Library + Playwright |
| **Config file** | `vitest.config.ts` / `playwright.config.ts` |
| **Quick run command** | `npm run test:unit -- test/unit/classroom-transcript-adapter.test.ts test/unit/classroom-speech-recognition.test.ts test/unit/classroom-audio-runtime.test.ts test/unit/classroom-shell.test.tsx test/unit/classroom-orchestrator.test.ts` |
| **Full suite command** | `npm run test:unit -- test/unit/classroom-transcript-adapter.test.ts test/unit/classroom-speech-recognition.test.ts test/unit/classroom-audio-runtime.test.ts test/unit/classroom-shell.test.tsx test/unit/classroom-orchestrator.test.ts && npm run test:e2e -- test/e2e/audio-classroom-runtime.spec.ts` |
| **Estimated runtime** | ~45-75 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:unit -- test/unit/classroom-transcript-adapter.test.ts test/unit/classroom-speech-recognition.test.ts test/unit/classroom-audio-runtime.test.ts`
- **After every plan wave:** Run the wave-focused unit set plus the corresponding audio runtime Playwright smoke
- **Before `$gsd-verify-work`:** Phase 7 focused unit + `test/e2e/audio-classroom-runtime.spec.ts` must be green
- **Max feedback latency:** 75 seconds

---

## Plan And Task Verification Map

| Task ID | Plan | Wave | Requirements | Test Type | Automated Command | File Exists | Status |
|---------|------|------|--------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 07-01 | 1 | ASR-01, ASR-04 | unit | `npm run test:unit -- test/unit/classroom-transcript-adapter.test.ts test/unit/classroom-speech-recognition.test.ts` | ✅ | ✅ green |
| 07-01-02 | 07-01 | 1 | ASR-01, ASR-04, PLAT-05 | unit + integration | `npm run test:unit -- test/unit/classroom-audio-runtime.test.ts test/unit/classroom-shell.test.tsx` | ✅ | ✅ green |
| 07-02-01 | 07-02 | 2 | ASR-01, ASR-02 | unit + integration | `npm run test:unit -- test/unit/classroom-shell.test.tsx test/unit/classroom-orchestrator.test.ts test/unit/classroom-audio-runtime.test.ts` | ✅ | ✅ green |
| 07-02-02 | 07-02 | 2 | ASR-02, ASR-04, PLAT-05 | unit | `npm run test:unit -- test/unit/classroom-shell.test.tsx test/unit/classroom-speech-recognition.test.ts test/unit/classroom-orchestrator.test.ts` | ✅ | ✅ green |
| 07-03-01 | 07-03 | 3 | ASR-01, ASR-03, ASR-04 | unit + integration | `npm run test:unit -- test/unit/classroom-shell.test.tsx test/unit/classroom-orchestrator.test.ts test/unit/classroom-transcript-adapter.test.ts` | ✅ | ✅ green |
| 07-03-02 | 07-03 | 3 | ASR-01, ASR-02, ASR-03, ASR-04, PLAT-05 | focused e2e | `npm run test:e2e -- test/e2e/audio-classroom-runtime.spec.ts` | ✅ | ⚠️ blocked locally (`next dev` listen EACCES) |

*Status: ✅ green · ❌ red · ⚠️ blocked/flaky*

---

## Pre-Execution Test Bootstrap

- [x] `test/unit/classroom-transcript-adapter.test.ts` — adapter 只做轻去噪、不做强改写
- [x] `test/unit/classroom-speech-recognition.test.ts` — recognition service start/stop/result/error/timeout contract
- [x] `test/unit/classroom-audio-runtime.test.ts` — Phase 6 runtime 基线，待扩 waiting transcript telemetry
- [x] `test/unit/classroom-shell.test.tsx` — Phase 6 shell / CTA / retry 基线，待扩 recognition waiting / dev HUD / repeat/picture transcript path
- [x] `test/e2e/audio-classroom-runtime.spec.ts` — fake browser audio smoke，待扩 fake recognition transcript 闭环

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 在真实目标浏览器里，browser-native recognition 是否稳定可用 | ASR-01, PLAT-05 | 自动化会 fake provider，无法证明真实浏览器支持面 | 在目标浏览器手动进课，走一次 repeat 和 picture 真实录音 -> transcript -> judgment 路径 |
| transcript wait 文案是否仍像课堂，而不是技术加载页 | ASR-04, PLAT-05 | 自动化能测存在性，无法完整判断课堂感 | 在平板横屏手动录音并结束，观察 3-4 秒等待时老师区/讲台区提示是否自然 |
| dev HUD 是否严格只在开发/测试环境出现 | PLAT-05 | 需要真实环境切换确认 | 在 `NODE_ENV=production` 和开发环境分别打开课堂，确认 HUD 只出现在非生产环境 |

---

## Validation Sign-Off

- [x] All tasks have runnable `<automated>` verify commands
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 gaps are explicit and bounded
- [x] No watch-mode flags
- [x] Feedback latency < 75s
- [x] Validation map matches real plan waves and per-task verify commands
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** human verification required in a runnable browser environment
