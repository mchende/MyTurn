---
phase: 01
slug: classroom-shell
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-15
---

# Phase 01 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.x + React Testing Library 16.3.x + Playwright 1.59.x |
| **Config file** | `vitest.config.ts`, `playwright.config.ts`, `test/setup.ts` |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run && npx playwright test` |
| **Estimated runtime** | ~30-90 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run`
- **After every plan wave:** Run `npx vitest run && npx playwright test`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 90 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-W0-01 | 01 | 1 | CLAS-01 | e2e smoke | `npx playwright test test/e2e/classroom-entry.spec.ts` | ❌ W0 | ⬜ pending |
| 01-W0-02 | 02 | 1 | CONT-01 | unit | `npx vitest run test/unit/lesson-schema.test.ts` | ❌ W0 | ⬜ pending |
| 01-W0-03 | 02 | 1 | CONT-02 | unit | `npx vitest run test/unit/lesson-schema.test.ts` | ❌ W0 | ⬜ pending |
| 01-W0-04 | 03 | 2 | PLAT-01 | component | `npx vitest run test/unit/classroom-shell.test.tsx` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — establish unit/component test runner
- [ ] `test/setup.ts` — register `@testing-library/jest-dom`
- [ ] `playwright.config.ts` — establish E2E smoke harness
- [ ] `test/unit/lesson-schema.test.ts` — covers CONT-01 / CONT-02
- [ ] `test/unit/classroom-shell.test.tsx` — covers PLAT-01
- [ ] `test/e2e/classroom-entry.spec.ts` — covers CLAS-01

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 课堂首页是否首先传达“今天有课、现在能不能进去”的感受 | CLAS-01 | 这是体验层与叙事层判断，自动化只能覆盖结构和状态，不能完全覆盖课堂感 | 在平板横屏视口打开首页，确认首屏先看到今日课表、当前状态与下一节引导，而不是工具型 dashboard 信息 |
| 课堂三段式空间是否像“班级”而不是普通内容页 | PLAT-01 | 视觉主次、空间感和角色关系需要人工评估 | 在平板横屏视口进入课堂页，确认顶部学生席、左侧课件主屏、右侧讲台/教师区同时存在，且课件主屏视觉权重最高 |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 90s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
