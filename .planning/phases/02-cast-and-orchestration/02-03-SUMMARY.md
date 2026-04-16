---
phase: 02-cast-and-orchestration
plan: 03
subsystem: classroom-shell
tags:
  - bobby-script
  - podium-view-model
  - classroom-shell
  - e2e
requires:
  - .planning/phases/02-cast-and-orchestration/02-01-SUMMARY.md
  - .planning/phases/02-cast-and-orchestration/02-02-SUMMARY.md
provides:
  - src/features/classroom-shell/bobby-script.ts
  - src/features/classroom-shell/podium-view-model.ts
  - src/features/classroom-shell/use-classroom-orchestrator.ts
  - src/features/classroom-shell/classroom-shell.tsx
  - src/features/classroom-shell/student-seat-strip.tsx
  - test/unit/bobby-script.test.ts
  - test/unit/classroom-shell.test.tsx
  - test/e2e/classroom-entry.spec.ts
affects:
  - src/features/classroom-shell/lesson-board.tsx
  - src/features/classroom-shell/teacher-script.ts
  - src/app/lesson/[sessionId]/page.tsx
tech-stack:
  added: []
  patterns:
    - phase-driven shell wiring
    - derived podium view-model
    - Bobby persona envelope
    - unit plus Playwright regression coverage
key-files:
  created:
    - src/features/classroom-shell/bobby-script.ts
    - src/features/classroom-shell/podium-view-model.ts
    - test/unit/bobby-script.test.ts
  modified:
    - src/features/classroom-shell/use-classroom-orchestrator.ts
    - src/features/classroom-shell/classroom-shell.tsx
    - src/features/classroom-shell/student-seat-strip.tsx
    - test/unit/classroom-shell.test.tsx
    - test/e2e/classroom-entry.spec.ts
key-decisions:
  - 将 Bobby 的示范行为独立为 persona contract，只允许在 `ai_model` 阶段出场，并通过轻微 hesitation envelope 表达“可信同学感”。
  - 使用 `podium-view-model.ts` 统一计算席位、讲台文案和波形节奏，让课堂壳体消费派生数据而不是拼接散落条件。
  - 课堂页正式切换到 `useClassroomOrchestrator`，老师话术、Bobby 前置示范、三席位保留和默认无答案泄露都落在同一套状态机合同上。
requirements-completed:
  - TEAC-01
  - CLAS-02
  - CLAS-04
  - AICL-01
  - AICL-02
duration: 12 min
completed: 2026-04-17
---

# Phase 02 Plan 03: Shell Wiring and Regression Summary

Teacher script, Bobby persona, seat/podium view-models, and browser regression coverage are now wired into the immersive classroom shell.

## Outcome

- 新增 `bobby-script.ts` 与 `test/unit/bobby-script.test.ts`，把 Bobby 的示范话术、不完美节奏 envelope、以及“不能在孩子沉默时救场”的护栏独立成合同。
- 新增 `podium-view-model.ts`，统一生成讲台头像、席位状态、讲台 caption 与状态文案；`student-seat-strip.tsx` 改为消费固定三席位 view-model，持续保留“我 + Bobby + 空位”。
- `classroom-shell.tsx` 已切到 `useClassroomOrchestrator`，并接入 teacher script、Bobby script、seat/podium derived state 与 reward gate；默认课堂画面不再显示 target text。
- 更新 `test/unit/classroom-shell.test.tsx` 与 `test/e2e/classroom-entry.spec.ts`，覆盖 Bobby 先示范、三席位保留、老师文案接线、默认无答案泄露，以及首页进课到课堂页的 Phase 2 smoke。

## Verification

- `npm run test:unit -- test/unit/classroom-shell.test.tsx test/unit/classroom-orchestrator.test.ts test/unit/teacher-script.test.ts test/unit/bobby-script.test.ts`
- `npm run test:e2e -- test/e2e/classroom-entry.spec.ts`
- `npm run test:unit`
- `npm run test:e2e`

## Commits

- `4209f9c` `test(02-03): add failing Bobby persona tests`
- `7cf42c6` `feat(02-03): add Bobby demo script contract`
- `5825ee0` `test(02-03): add failing classroom shell wiring coverage`
- `b769b82` `feat(02-03): wire classroom shell to orchestrator view model`
- `143e3fb` `test(02-03): refresh classroom smoke assertions`

## Deviations from Plan

### Auto-fixed Issues

**1. 收尾阶段同步更新浏览器 smoke 断言**
- **Found during:** Task 3 verification
- **Issue:** 现有 Playwright 仍断言旧的线性课堂文案与 target text 直出，不再匹配 Phase 2 的编排合同。
- **Fix:** 将 smoke 断言更新为新的老师控场文案、默认无 target text 泄露、固定空位席与 Bobby 前置示范可见结果。
- **Files modified:** `test/e2e/classroom-entry.spec.ts`

## Known Stubs

None.

## Self-Check: PASSED

- Found `src/features/classroom-shell/bobby-script.ts`
- Found `src/features/classroom-shell/podium-view-model.ts`
- Found `src/features/classroom-shell/use-classroom-orchestrator.ts`
- Found `src/features/classroom-shell/classroom-shell.tsx`
- Found `test/unit/bobby-script.test.ts`
- Found `test/unit/classroom-shell.test.tsx`
- Found `test/e2e/classroom-entry.spec.ts`
- Found commit `4209f9c`
- Found commit `7cf42c6`
- Found commit `5825ee0`
