---
phase: 05
slug: complete-mvp-lesson
status: draft
nyquist_compliant: true
wave_0_complete: false
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
| **Quick run command** | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx test/unit/classroom-judgment.test.ts test/unit/lesson-schema.test.ts` |
| **Full suite command** | `npm run test:unit && npm run test:e2e` |
| **Estimated runtime** | ~90-140 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx test/unit/classroom-judgment.test.ts test/unit/lesson-schema.test.ts`
- **After every plan wave:** Run `npm run test:e2e -- test/e2e/guided-speaking-flow.spec.ts test/e2e/classroom-entry.spec.ts` plus the new `test/e2e/complete-mvp-lesson.spec.ts`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 140 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 05-01 | 1 | PLAT-02 | unit | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx` | ✅ partial | ⬜ pending |
| 05-01-02 | 05-01 | 1 | SPKG-02 | unit | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-judgment.test.ts test/unit/lesson-schema.test.ts` | ✅ partial | ⬜ pending |
| 05-02-01 | 05-02 | 2 | PLAT-02 | unit + homepage integration | `npm run test:unit -- test/unit/classroom-shell.test.tsx test/unit/classroom-orchestrator.test.ts test/unit/homepage-shell.test.tsx` | ❌ / ✅ partial | ⬜ pending |
| 05-02-02 | 05-02 | 2 | SPKG-02, PLAT-02 | e2e smoke | `npm run test:e2e -- test/e2e/classroom-entry.spec.ts test/e2e/guided-speaking-flow.spec.ts test/e2e/complete-mvp-lesson.spec.ts` | ❌ planned in task | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `test/e2e/complete-mvp-lesson.spec.ts` — 覆盖 full lesson loop、reward 停留、3 秒 auto-return 和 homepage completed state
- [ ] `test/unit/homepage-shell.test.tsx` — 覆盖 completion override 不污染真实 schedule state，且首页中窄视口仍能看到主内容
- [x] `test/unit/classroom-orchestrator.test.ts` — 已有 guided flow / hint / fallback 基础，可扩展 warmup / closing / completion path
- [x] `test/unit/classroom-shell.test.tsx` — 已有单 CTA 和 child-safe shell 覆盖，可扩展 lesson completion / homepage handoff contract

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
