---
phase: 05
slug: complete-mvp-lesson
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-22
---

# Phase 05 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest + Testing Library + Playwright |
| **Config file** | `vitest.config.ts` / `playwright.config.ts` |
| **Quick run command** | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-judgment.test.ts test/unit/lesson-schema.test.ts test/unit/get-today-schedule-view-model.test.ts test/unit/homepage-shell.test.tsx` |
| **Full suite command** | `npm run test:unit && npm run test:e2e` |
| **Estimated runtime** | ~90-140 seconds |

---

## Sampling Rate

- **After every task commit:** Run the task's focused verify command first; default unit fallback is `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-judgment.test.ts test/unit/lesson-schema.test.ts test/unit/get-today-schedule-view-model.test.ts test/unit/homepage-shell.test.tsx`
- **After every plan wave:** Run that wave's merge gate, with browser-heavy `complete-mvp-lesson.spec.ts` reserved for the final wave
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 140 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 05-01 | 1 | SPKG-02 | unit | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-judgment.test.ts test/unit/lesson-schema.test.ts` | ✅ partial | ⬜ pending |
| 05-01-02 | 05-01 | 1 | PLAT-02 | unit | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts` | ✅ partial | ⬜ pending |
| 05-02-01 | 05-02 | 2 | PLAT-02 | unit | `npm run test:unit -- test/unit/get-today-schedule-view-model.test.ts` | ❌ planned in task | ⬜ pending |
| 05-02-02 | 05-02 | 2 | PLAT-02 | unit + homepage integration | `npm run test:unit -- test/unit/homepage-shell.test.tsx` | ❌ planned in task | ⬜ pending |
| 05-03-01 | 05-03 | 3 | PLAT-02 | unit | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/teacher-script.test.ts test/unit/classroom-shell.test.tsx` | ✅ / ❌ planned in task | ⬜ pending |
| 05-03-02 | 05-03 | 3 | SPKG-02, PLAT-02 | focused smoke + e2e | `npm run test:e2e -- test/e2e/guided-speaking-flow.spec.ts && npm run test:e2e -- test/e2e/classroom-entry.spec.ts test/e2e/complete-mvp-lesson.spec.ts` | ✅ / ❌ planned in task | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `test/unit/classroom-orchestrator.test.ts` — 已有 guided flow / hint / fallback 基础，可扩展 warmup / closing / completion path
- [x] `test/unit/classroom-shell.test.tsx` — 已有单 CTA 和 child-safe shell 覆盖，可扩展 lesson completion / homepage handoff contract
- [x] 现有 Vitest / Playwright 基础设施足以承载新增测试文件；`complete-mvp-lesson.spec.ts` 与 homepage overlay 单测会在 05-02 / 05-03 任务里创建，不需要单独 Wave 0 预埋

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 完整 lesson 的体感是否像“真正下课”，而不是流程跑完 | PLAT-02 | 自动化能验证状态与跳转，但不能完整评估课堂感和收束温度 | 在平板横屏进入课堂，完整走到 reward 和回首页，观察老师 goodbye、完成态停留和回首页余温是否自然 |
| 首页响应式重排后，中部与右侧内容在较窄视口下是否仍清楚可读 | PLAT-02 | 自动化可以检查元素存在，但不能完全判断视觉层级和拥挤感 | 分别在窄横屏平板和较小桌面窗口打开首页，确认 hero、timeline 与已完成状态都能被直接看到 |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 140s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
