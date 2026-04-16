---
phase: 02-cast-and-orchestration
status: passed
verified_on: 2026-04-17
requirements:
  - CLAS-02
  - CLAS-03
  - CLAS-04
  - TEAC-01
  - AICL-01
  - AICL-02
source_plans:
  - 02-01
  - 02-02
  - 02-03
---

# Phase 02 Verification

## Goal

建立老师、AI 同学以及“一次点一个人作答”的课堂编排机制，形成小班课临场感。

## Must-Have Check

- **CLAS-02:** `src/features/classroom-shell/podium-view-model.ts` 与 `src/features/classroom-shell/student-seat-strip.tsx` 现在固定保留老师区、我、Bobby 与空位三席结构；`test/unit/classroom-shell.test.tsx` 验证课堂初始态和轮转后仍保留三席。
- **CLAS-03:** `src/features/classroom-shell/classroom-orchestrator.ts` 把课堂轮次明确收敛为 `teacher_prompt -> ai_model -> student_wait -> teacher_feedback/move_next` 或老师接住的沉默链路；`test/unit/classroom-orchestrator.test.ts` 覆盖固定点名推进和沉默处理。
- **CLAS-04:** `src/features/classroom-shell/use-classroom-orchestrator.ts` 与 `src/features/classroom-shell/bobby-script.ts` 保证 Bobby 只在 `ai_model` 阶段先示范，随后才轮到真实孩子；`test/unit/classroom-shell.test.tsx` 与 `test/unit/bobby-script.test.ts` 均有回归断言。
- **TEAC-01:** `src/features/classroom-shell/teacher-script.ts` 提供老师英文短句脚本，`classroom-shell.tsx` 已消费 `teacherMessage` / `teacherHint`，浏览器 smoke 也验证了新老师控场文案可见。
- **AICL-01:** `bobby-script.ts` 中的 Bobby 话术采用轻微 hesitation token 与 pause envelope，表现为可信同龄同学而不是完美播报器。
- **AICL-02:** `BOBBY_RESPONSE_ENVELOPE` 为 Bobby 保留轻微犹豫和停顿，但脚本仍输出完整目标内容，`test/unit/bobby-script.test.ts` 已验证“不完美但完整”的约束。

## Automated Checks

```bash
npm run test:unit -- test/unit/classroom-shell.test.tsx test/unit/classroom-orchestrator.test.ts test/unit/teacher-script.test.ts test/unit/bobby-script.test.ts
npm run test:e2e -- test/e2e/classroom-entry.spec.ts
npm run test:unit
npm run test:e2e
```

Result: all passed on 2026-04-17.

## Evidence

- `src/features/classroom-shell/classroom-orchestrator.ts` contains the reducer-driven classroom state machine and explicit silence path owned by the teacher.
- `src/features/classroom-shell/teacher-script.ts` keeps child-facing copy English-first and isolates target text behind debug metadata.
- `src/features/classroom-shell/bobby-script.ts` and `src/features/classroom-shell/podium-view-model.ts` provide Bobby persona behavior plus podium/seat derived state.
- `src/features/classroom-shell/classroom-shell.tsx` now consumes `useClassroomOrchestrator` instead of the older linear flow hook.
- `test/unit/classroom-shell.test.tsx` verifies fixed seats, Bobby-first ordering, teacher-script wiring, and reward gating.
- `test/e2e/classroom-entry.spec.ts` verifies homepage-to-classroom flow, fixed seat strip presence, default no-answer leakage, and Bobby entering the stage before the student turn.

## Residual Risk

- 当前验证仍以前端状态机和 smoke 为主，真实语音输入、老师真人音色、以及更长时段课堂节奏还没有进入本 phase 的自动化范围。
- Playwright 在第一次启动 Chrome 时出现过一次浏览器进程瞬时关闭，但重跑后稳定通过；后续 CI 化时建议继续观察这一环境级波动。

## Verdict

Phase 02 达成目标，可以进入 Phase 03。
