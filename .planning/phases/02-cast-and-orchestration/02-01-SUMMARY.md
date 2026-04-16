---
phase: 02-cast-and-orchestration
plan: 01
subsystem: classroom-shell
tags:
  - reducer
  - scheduler
  - unit-tests
requires:
  - .planning/phases/02-cast-and-orchestration/02-01-PLAN.md
provides:
  - src/features/classroom-shell/classroom-orchestrator.ts
  - src/features/classroom-shell/use-classroom-orchestrator.ts
  - test/unit/classroom-orchestrator.test.ts
affects:
  - src/features/classroom-shell/classroom-orchestrator.ts
  - src/features/classroom-shell/use-classroom-orchestrator.ts
  - test/unit/classroom-orchestrator.test.ts
tech-stack:
  added: []
  patterns:
    - useReducer state machine
    - single-effect timer scheduler
    - reducer-first unit regression coverage
key-files:
  created:
    - src/features/classroom-shell/classroom-orchestrator.ts
    - src/features/classroom-shell/use-classroom-orchestrator.ts
    - test/unit/classroom-orchestrator.test.ts
  modified:
    - .planning/phases/02-cast-and-orchestration/02-01-SUMMARY.md
key-decisions:
  - 将课堂主流程收敛为 reducer 状态图，固定顺序为 teacher_prompt -> ai_model -> student_wait -> teacher_feedback 或沉默兜底链路。
  - 将沉默处理限定为 teacher_encourage -> teacher_echo -> move_next，明确禁止 Bobby rescue 分支。
  - 将强奖励保留为显式 gate，由 hook 暴露覆盖入口，但不再作为默认必经 phase。
requirements-completed:
  - CLAS-02
  - CLAS-03
duration: 10 min
completed: 2026-04-16
---

# Phase 02 Plan 01: Classroom Orchestrator Summary

Reducer-driven classroom turn order and silence recovery, with reward visibility gated explicitly instead of a mandatory celebration phase.

## Outcome

- 新增 `classroom-orchestrator.ts`，导出 `CLASSROOM_TIMINGS`、`createInitialClassroomState`、`classroomOrchestratorReducer`，把固定轮转、沉默兜底和 wrap-up 推进收敛到单一状态机。
- 新增 `use-classroom-orchestrator.ts`，使用 `useReducer` 和单个 timer effect 调度下一事件，不再在组件层拼装多段裸 `setTimeout`。
- 新增 `test/unit/classroom-orchestrator.test.ts`，覆盖固定 turn order、`student_silent_timeout`/`teacher_echo_complete` 分支，以及 reward gate 不默认触发的合同。

## Verification

- `npm run test:unit -- test/unit/classroom-orchestrator.test.ts`
- 结果: 通过，`1` 个文件、`5` 个测试全部绿色。

## Commits

- `be2aef8` `test(02-01): add failing orchestrator coverage`
- `f7be915` `feat(02-01): implement classroom orchestrator reducer`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] 修正测试用 lesson seed 的导入路径**
- **Found during:** Task 1 RED
- **Issue:** `@/content/...` 在当前测试配置下无法解析，导致测试在进入真实 RED 之前就因模块解析失败中断。
- **Fix:** 将测试中的 lesson seed 导入改为仓库内相对路径，保留目标失败点在 orchestrator 尚未实现本身。
- **Files modified:** `test/unit/classroom-orchestrator.test.ts`
- **Verification:** 重新运行 `npm run test:unit -- test/unit/classroom-orchestrator.test.ts` 后，失败点切换为缺失 orchestrator 模块，符合 TDD RED 预期。
- **Commit:** `be2aef8`

## Known Stubs

None.

## Self-Check: PASSED

- Found `src/features/classroom-shell/classroom-orchestrator.ts`
- Found `src/features/classroom-shell/use-classroom-orchestrator.ts`
- Found `test/unit/classroom-orchestrator.test.ts`
- Found commit `be2aef8`
- Found commit `f7be915`
