---
phase: 04
slug: hints-and-judgment
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-21
validated_on: 2026-04-21
---

# Phase 04 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest + Testing Library + Playwright |
| **Config file** | `vitest.config.ts` / `playwright.config.ts` |
| **Quick run command** | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx test/unit/teacher-script.test.ts` |
| **Full suite command** | `npm run test:unit && npm run test:e2e` |
| **Estimated runtime** | ~20-35 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx test/unit/teacher-script.test.ts`
- **After every plan wave:** Run `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx test/unit/teacher-script.test.ts test/unit/classroom-judgment.test.ts test/unit/lesson-schema.test.ts`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 35 seconds

---

## Plan And Task Verification Map

| Task ID | Plan | Wave | Requirements | Test Type | Automated Command | File Exists | Status |
|---------|------|------|--------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 04-01 | 1 | TEAC-03 | unit | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/teacher-script.test.ts` | ✅ yes | ✅ green |
| 04-01-02 | 04-01 | 1 | TEAC-03, SPKG-05 | unit + integration | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx test/unit/teacher-script.test.ts` | ✅ yes | ✅ green |
| 04-02-01 | 04-02 | 2 | SPKG-03, SPKG-04, SPKG-05 | unit | `npm run test:unit -- test/unit/classroom-judgment.test.ts test/unit/lesson-schema.test.ts` | ✅ yes | ✅ green |
| 04-02-02 | 04-02 | 2 | SPKG-03, SPKG-04, SPKG-05 | unit + reducer | `npm run test:unit -- test/unit/classroom-judgment.test.ts test/unit/lesson-schema.test.ts test/unit/classroom-orchestrator.test.ts` | ✅ yes | ✅ green |
| 04-03-01 | 04-03 | 3 | TEAC-04, SPKG-05 | unit + integration | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/teacher-script.test.ts test/unit/classroom-shell.test.tsx` | ✅ yes | ✅ green |
| 04-03-02 | 04-03 | 3 | TEAC-03, TEAC-04, SPKG-03, SPKG-04, SPKG-05 | unit + e2e smoke | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-judgment.test.ts test/unit/classroom-shell.test.tsx test/unit/teacher-script.test.ts test/unit/lesson-schema.test.ts && npm run test:e2e -- test/e2e/guided-speaking-flow.spec.ts` | ✅ yes | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Pre-Execution Test Bootstrap

- [x] `04-02-01` 内创建并跑通 `test/unit/classroom-judgment.test.ts`，不再依赖独立 Wave 0 计划或占位验证文本。
- [x] `04-02-01` 同步扩展 `test/unit/lesson-schema.test.ts`，把 `repeatAccepts` / `pictureTalk` 元数据护栏纳入同一条可执行命令。
- [x] `test/unit/classroom-orchestrator.test.ts` — 已有 guided flow / retry 基础测试，可在 `04-02-02` 扩展 judged attempt wiring。
- [x] `test/unit/teacher-script.test.ts` — 已有 stage-aware script 合同测试，可扩展 observe hint / narrowed question / fallback model。
- [x] `test/unit/classroom-shell.test.tsx` — 已有单 CTA 和 child-safe shell 回归，可扩展 hint/fallback 后的互动合同。
- [x] `test/e2e/guided-speaking-flow.spec.ts` — 已有 repeat -> picture baseline smoke，可保留并新增一条 fallback-focused browser regression。

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 复述轮的 co-speak 与最终兜底是否仍像老师带班，而不像纠音工具 | TEAC-03, TEAC-04 | 自动化可验证状态和 copy，但不能完全判断“课堂感”是否被提示逻辑破坏 | 在平板横屏打开课堂，触发一次 repeat fallback，观察老师接住和收束是否自然 |
| 看图轮的观察型提示与缩窄提问是否仍保持图片驱动，而没有答案泄露感 | SPKG-04, SPKG-05 | 自动化可断言文本边界，但不能完全判断支架是否过重 | 手动触发一次 picture-talk retry，确认老师仍在引导看图而不是提前给答案 |

---

## Validation Sign-Off

- [x] All tasks have runnable `<automated>` verify commands
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] No placeholder verify references remain in plan verification
- [x] No watch-mode flags
- [x] Feedback latency < 35s
- [x] Validation map matches real plan waves and per-task verify commands
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** Phase 04 validation signed off on 2026-04-21 after focused unit coverage plus `guided-speaking-flow` / `classroom-entry` Playwright smoke both passed.
