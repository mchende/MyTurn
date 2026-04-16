---
phase: 02-cast-and-orchestration
plan: 02
subsystem: classroom-shell
tags:
  - teacher-script
  - lesson-board
  - debug-guard
  - unit-tests
requires:
  - .planning/phases/02-cast-and-orchestration/02-01-SUMMARY.md
provides:
  - src/features/classroom-shell/teacher-script.ts
  - src/features/classroom-shell/lesson-board.tsx
  - test/unit/teacher-script.test.ts
  - test/unit/lesson-board.test.tsx
affects:
  - src/features/classroom-shell/classroom-shell.tsx
  - src/features/classroom-shell/teacher-script.ts
  - src/features/classroom-shell/lesson-board.tsx
tech-stack:
  added: []
  patterns:
    - english-first teacher script variants
    - child-safe copy with debug-only target text
    - focused leakage regression coverage
key-files:
  created:
    - src/features/classroom-shell/teacher-script.ts
    - test/unit/teacher-script.test.ts
    - test/unit/lesson-board.test.tsx
  modified:
    - src/features/classroom-shell/lesson-board.tsx
    - .planning/phases/02-cast-and-orchestration/02-02-SUMMARY.md
key-decisions:
  - 将老师话术收敛为纯数据模块，按 orchestrator phase 输出 `spokenLine`、`hintLabel` 与 `debugTargetText`，避免在 UI 组件里散落文案逻辑。
  - 默认课堂主屏与可访问名称都不再暴露 `currentItem.text`，目标词句只允许通过 `showDebugTarget` + `debugTargetText` 的显式调试开关出现。
  - 老师主流程文案保持英文短句和课堂控场语气，不新增未经参考支持的新面板或新控件。
requirements-completed:
  - TEAC-01
  - CLAS-03
duration: 4 min
completed: 2026-04-17
---

# Phase 02 Plan 02: Teacher Script and Lesson Board Safety Summary

English-first teacher script variants with a child-safe LessonBoard that hides target text unless an explicit debug guard is enabled.

## Outcome

- 新增 `teacher-script.ts`，导出 `getTeacherScriptLine` 与 `getTeacherHint`，为 `teacher_prompt`、`teacher_encourage`、`teacher_echo`、`teacher_feedback`、`move_next` 等 phase 提供英文带班话术与 child-safe hint。
- 新增 `test/unit/teacher-script.test.ts`，锁定老师主流程英语文案，以及 target text 只能出现在 `debugTargetText` 而不能出现在 child-facing copy。
- 新增 `test/unit/lesson-board.test.tsx`，并修改 `lesson-board.tsx`，移除默认视图与 accessible name 中的 `currentItem.text` 泄露，改为仅在 `showDebugTarget` 与 `debugTargetText` 同时显式传入时才展示目标词句。

## Verification

- `npm run test:unit -- test/unit/lesson-board.test.tsx test/unit/teacher-script.test.ts`
- 结果: 通过，`2` 个文件、`4` 个测试全部绿色。

## Commits

- `3b18800` `test(02-02): add failing teacher script contract tests`
- `0175879` `feat(02-02): add teacher script contract module`
- `ed26898` `test(02-02): add failing lesson board leakage tests`
- `57eec14` `feat(02-02): guard lesson board target text behind debug props`

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None.

## Self-Check: PASSED

- Found `src/features/classroom-shell/teacher-script.ts`
- Found `src/features/classroom-shell/lesson-board.tsx`
- Found `test/unit/teacher-script.test.ts`
- Found `test/unit/lesson-board.test.tsx`
- Found commit `3b18800`
- Found commit `0175879`
- Found commit `ed26898`
- Found commit `57eec14`
