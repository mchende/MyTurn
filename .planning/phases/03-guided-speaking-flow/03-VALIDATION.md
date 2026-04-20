---
phase: 03
slug: guided-speaking-flow
status: draft
nyquist_compliant: false
wave_0_complete: true
created: 2026-04-20
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest + Testing Library + Playwright |
| **Config file** | `vitest.config.ts` / `playwright.config.ts` |
| **Quick run command** | `npm run test:unit` |
| **Full suite command** | `npm run test:unit && npm run test:e2e` |
| **Estimated runtime** | ~15-25 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:unit`
- **After every plan wave:** Run `npm run test:unit && npm run test:e2e`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 25 seconds

---

## Plan And Task Verification Map

| Task ID | Plan | Wave | Requirements | Test Type | Automated Command | File Exists | Status |
|---------|------|------|--------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 03-01 | 1 | CONT-04, SPKG-01 | unit | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts` | ✅ partial | ⬜ pending |
| 03-01-02 | 03-01 | 1 | CONT-04, SPKG-01 | unit | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx` | ✅ partial | ⬜ pending |
| 03-02-01 | 03-02 | 2 | CONT-03, TEAC-02, SPKG-01 | unit | `npm run test:unit -- test/unit/teacher-script.test.ts test/unit/bobby-script.test.ts` | ✅ partial | ⬜ pending |
| 03-02-02 | 03-02 | 2 | CONT-03, TEAC-02, SPKG-01 | unit | `npm run test:unit -- test/unit/classroom-shell.test.tsx test/unit/teacher-script.test.ts test/unit/bobby-script.test.ts` | ✅ partial | ⬜ pending |
| 03-03-01 | 03-03 | 3 | CONT-04, TEAC-02 | unit | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx` | ✅ partial | ⬜ pending |
| 03-03-02 | 03-03 | 3 | CONT-03, CONT-04, TEAC-02 | unit + e2e smoke | `npm run test:unit -- test/unit/lesson-board.test.tsx test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx && npm run test:e2e -- test/e2e/guided-speaking-flow.spec.ts` | ✅ partial / ⬜ planned | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `test/unit/classroom-orchestrator.test.ts` — 已有 reducer / timing 基础测试，可扩展 stage-aware speaking flow
- [x] `test/unit/teacher-script.test.ts` — 已有 teacher script 合同测试，可扩展 repeat-after-teacher / picture-talk 区分
- [x] `test/unit/bobby-script.test.ts` — 已有 Bobby persona 合同测试，可扩展 stage-aware 出场限制
- [x] `test/unit/lesson-board.test.tsx` — 已有 child-facing no-leak guard，可扩展 stage prompt 断言
- [x] `test/unit/classroom-shell.test.tsx` — 已有 shell visible-behavior 覆盖，可扩展 guided speaking flow
- [x] `test/e2e/classroom-entry.spec.ts` — 已有 homepage -> lesson smoke，可继续保留为入场回归
- [ ] `test/e2e/guided-speaking-flow.spec.ts` — Phase 03 新增 focused guided flow 回归，用于覆盖 repeat-after-teacher -> picture-talk 升级路径

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `repeat-after-teacher` 到 `picture-talk` 的体感升级是否明显但不突兀 | CONT-04 | 自动化能验证状态切换，但不能完全判断“课堂感”的平滑度 | 在平板横屏打开课堂，观察同一批图片从跟读到看图回答的升级是否自然 |
| “已开口确认”交互是否足够隐性，不像练习 App 按钮 | SPKG-01, TEAC-02 | 自动化可验证推进信号存在，但不能完全判断课堂感是否被 UI affordance 打破 | 进入课堂并手动完成一轮 guided speaking，确认交互不抢戏、不像工具页 |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all required surfaces for this phase
- [x] No watch-mode flags
- [ ] Feedback latency remains within quick-iteration budget for targeted commands
- [ ] Validation map matches real plan waves and per-task verify commands
- [ ] `nyquist_compliant: true` set in frontmatter after execution confirms all planned test files exist

**Approval:** pending
