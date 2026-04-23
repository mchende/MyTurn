---
phase: 06
slug: audio-classroom-runtime
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-23
---

# Phase 06 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest + Testing Library + Playwright |
| **Config file** | `vitest.config.ts` / `playwright.config.ts` |
| **Quick run command** | `npm run test:unit -- test/unit/classroom-audio-runtime.test.ts test/unit/classroom-shell.test.tsx test/unit/teacher-script.test.ts test/unit/bobby-script.test.ts` |
| **Full suite command** | `npm run test:unit && npm run test:e2e` |
| **Estimated runtime** | ~30-60 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:unit -- test/unit/classroom-audio-runtime.test.ts test/unit/classroom-shell.test.tsx`
- **After every plan wave:** Run the wave-specific focused unit set plus the corresponding Playwright smoke
- **Before `$gsd-verify-work`:** Phase 6 focused unit + focused e2e must be green
- **Max feedback latency:** 60 seconds

---

## Plan And Task Verification Map

| Task ID | Plan | Wave | Requirements | Test Type | Automated Command | File Exists | Status |
|---------|------|------|--------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 06-01 | 1 | AUDIO-01, AUDIO-02, CLAS-05 | unit | `npm run test:unit -- test/unit/classroom-audio-runtime.test.ts test/unit/teacher-script.test.ts test/unit/bobby-script.test.ts` | ⬜ planned | ⬜ pending |
| 06-01-02 | 06-01 | 1 | VOICE-01, VOICE-03, CLAS-07 | unit | `npm run test:unit -- test/unit/classroom-audio-runtime.test.ts` | ⬜ planned | ⬜ pending |
| 06-02-01 | 06-02 | 2 | AUDIO-03, VOICE-01, CLAS-07 | unit + integration | `npm run test:unit -- test/unit/classroom-shell.test.tsx test/unit/classroom-audio-runtime.test.ts` | ✅ existing shell + ⬜ runtime | ⬜ pending |
| 06-02-02 | 06-02 | 2 | VOICE-02, VOICE-03, CLAS-05 | unit + integration | `npm run test:unit -- test/unit/classroom-shell.test.tsx test/unit/classroom-orchestrator.test.ts test/unit/classroom-audio-runtime.test.ts` | ✅ partial | ⬜ pending |
| 06-03-01 | 06-03 | 3 | PLAT-03, PLAT-04, AUDIO-03 | unit + integration | `npm run test:unit -- test/unit/classroom-shell.test.tsx test/unit/classroom-audio-runtime.test.ts` | ✅ partial | ⬜ pending |
| 06-03-02 | 06-03 | 3 | AUDIO-01, AUDIO-02, VOICE-01, VOICE-02, VOICE-03, CLAS-05, CLAS-07, PLAT-03, PLAT-04 | focused e2e | `npm run test:e2e -- test/e2e/classroom-entry.spec.ts test/e2e/audio-classroom-runtime.spec.ts` | `classroom-entry` ✅ / `audio-classroom-runtime` ⬜ planned | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Pre-Execution Test Bootstrap

- [ ] `test/unit/classroom-audio-runtime.test.ts` — 覆盖播放顺序、play reject、permission 预读、`MediaRecorder` contract、空录音/失败兜底
- [ ] `test/unit/bobby-script.test.ts` — 覆盖 Bobby 只在 `repeat-after-teacher` 的 `ai_model` 出声
- [ ] `test/unit/classroom-shell.test.tsx` — 扩展 preflight gate、轻量播放态、单 CTA 录音态和 failure retry UI
- [ ] `test/e2e/audio-classroom-runtime.spec.ts` — focused browser smoke，覆盖 preflight -> playback -> record CTA 基本闭环

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 老师/Bobby 自动播报后的“课堂感”是否仍成立，而不像播放器 | AUDIO-01, AUDIO-02, AUDIO-03 | 自动化能验证状态和 copy，无法完整判断语音临场感 | 在平板横屏手动进入课堂，观察预检后老师开口、Bobby 示范和字幕反馈是否自然 |
| 录音失败时的 copy 和讲台反馈是否柔和、不打断孩子 | VOICE-03, CLAS-05 | 失败 UX 的情绪体验仍需要人工把关 | 手动拒绝一次麦克风权限，再走 skip / retry 路径，确认没有强阻断系统面板 |
| 音频模式下中等宽度视口是否仍保持老师区、讲台区、图片区和顶部学生区完整可见或可滚动 | PLAT-03, PLAT-04 | 自动化可断言类名和存在性，但不能完整评估实际拥挤感 | 在平板横屏和中等桌面宽度各走一遍 preflight 和学生作答态 |

---

## Validation Sign-Off

- [x] All tasks have runnable `<automated>` verify commands
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 gaps are explicit and bounded
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] Validation map matches real plan waves and per-task verify commands
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** Phase 06 validation drafted on 2026-04-23 after completing research-first planning.
