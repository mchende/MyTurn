---
phase: 02
slug: cast-and-orchestration
status: draft
nyquist_compliant: false
wave_0_complete: true
created: 2026-04-16
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.4 + Testing Library 16.3.2 + Playwright 1.59.1 |
| **Config file** | `vitest.config.ts` / `playwright.config.ts` |
| **Quick run command** | `npm run test:unit` |
| **Full suite command** | `npm run test:unit && npm run test:e2e` |
| **Estimated runtime** | ~15-25 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:unit`
- **After every plan wave:** Run `npm run test:unit && npm run test:e2e`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Plan And Task Verification Map

| Task ID | Plan | Wave | Requirements | Test Type | Automated Command | File Exists | Status |
|---------|------|------|--------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 02-01 | 1 | CLAS-02, CLAS-03 | unit | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts` | ❌ planned | ⬜ pending |
| 02-01-02 | 02-01 | 1 | CLAS-02, CLAS-03 | unit | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts` | ❌ planned | ⬜ pending |
| 02-02-01 | 02-02 | 2 | TEAC-01, CLAS-03 | unit | `npm run test:unit -- test/unit/teacher-script.test.ts` | ❌ planned | ⬜ pending |
| 02-02-02 | 02-02 | 2 | TEAC-01, CLAS-03 | unit | `npm run test:unit -- test/unit/lesson-board.test.tsx test/unit/teacher-script.test.ts` | ❌ planned | ⬜ pending |
| 02-03-01 | 02-03 | 3 | AICL-01, AICL-02, CLAS-04 | unit | `npm run test:unit -- test/unit/bobby-script.test.ts` | ❌ planned | ⬜ pending |
| 02-03-02 | 02-03 | 3 | TEAC-01, CLAS-02, CLAS-04, AICL-01, AICL-02 | unit | `npm run test:unit -- test/unit/classroom-shell.test.tsx test/unit/classroom-orchestrator.test.ts test/unit/teacher-script.test.ts test/unit/bobby-script.test.ts` | ✅ partial / ❌ planned | ⬜ pending |
| 02-03-03 | 02-03 | 3 | TEAC-01, CLAS-02, CLAS-04 | e2e smoke | `npm run test:unit -- test/unit/classroom-shell.test.tsx test/unit/bobby-script.test.ts && npm run test:e2e -- test/e2e/classroom-entry.spec.ts` | ✅ / ❌ planned | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `test/unit/classroom-orchestrator.test.ts` — reducer / timing / silence branch coverage for CLAS-02, CLAS-03, CLAS-04
- [ ] `test/unit/teacher-script.test.ts` — teacher script and child-facing text leakage checks for TEAC-01
- [ ] `test/unit/lesson-board.test.tsx` — LessonBoard 默认不泄露 target text，debug guard 才允许显示
- [ ] `test/unit/bobby-script.test.ts` — Bobby persona envelope and non-rescue behavior for AICL-01, AICL-02

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 儿童主视图不显示目标词句且未引入新的可见 debug affordance | CLAS-03, TEAC-01 | 自动化可验证 no-leak，但仍需人工确认未偏离 Gemini 批准布局 | 打开正常课堂页确认孩子主视图无目标词句，且没有新增按钮、悬浮入口或替代布局来暴露 debug 文本 |
| Bobby 的“轻微不完美”是否像可信同龄同学而非播报器 | AICL-01, AICL-02 | 语气和体感需要人工抽样判断，自动化只能验证 envelope 规则与非救场边界 | 进入课堂多轮观察 Bobby 的停顿、语气和节奏，确认不过度抢戏，也未新增新的动画主题或视觉提示来表现 hesitancy |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency remains within quick-iteration budget for targeted plan commands
- [ ] Validation map matches real plan waves and per-task verify commands
- [ ] `nyquist_compliant: true` set in frontmatter after execution confirms all planned test files exist

**Approval:** pending
