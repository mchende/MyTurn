---
phase: 03-guided-speaking-flow
status: passed
verified_on: 2026-04-21
requirements:
  - CONT-03
  - CONT-04
  - TEAC-02
  - SPKG-01
source_plans:
  - 03-01
  - 03-02
  - 03-03
---

# Phase 03 Verification

## Goal

让孩子在一节英文优先、图片驱动的课堂中主动参与，并从复述开始进入口语练习。

## Must-Have Check

- **CONT-03:** `src/features/classroom-shell/lesson-board.tsx` 与 `src/features/classroom-shell/use-classroom-orchestrator.ts` 现在持续输出图片主导、英文优先的 `stageBadge` / `stagePrompt`，并通过 `test/unit/lesson-board.test.tsx` 和 `test/unit/classroom-shell.test.tsx` 继续断言 child-facing surface 不泄露目标词。
- **CONT-04:** `src/features/classroom-shell/classroom-orchestrator.ts` 通过 `buildGuidedStageRuns()` 明确先完整跑完 `repeat-after-teacher`，再把同一批 lesson items 升级到 `picture-talk`；`test/unit/classroom-orchestrator.test.ts` 与 `test/e2e/guided-speaking-flow.spec.ts` 都验证了同内容重复练习的升级路径。
- **TEAC-02:** `src/features/classroom-shell/teacher-script.ts` 为老师提供了英文短句的等待、鼓励和收束话术，`picture-talk` 中第一次沉默只给一次 `Try once more.`，第二次则由老师快速收束并进入下一题，且 Bobby 不会越权救场。
- **SPKG-01:** `src/features/classroom-shell/podium-view-model.ts` 与 `src/features/classroom-shell/classroom-shell.tsx` 把孩子的开口推进收敛成单一 podium CTA；复述轮显示 `I said it`，看图轮显示 `I answered`，`test/unit/classroom-shell.test.tsx` 与 Playwright focused flow 均已覆盖。

## Automated Checks

```bash
npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx test/unit/lesson-board.test.tsx test/unit/teacher-script.test.ts test/unit/bobby-script.test.ts
npm run test:e2e -- test/e2e/guided-speaking-flow.spec.ts test/e2e/classroom-entry.spec.ts
```

Result: all passed on 2026-04-21.

## Evidence

- `src/features/classroom-shell/classroom-orchestrator.ts` contains the stage-aware reducer, explicit participation confirmation event, and picture-talk retry/close-out path.
- `src/features/classroom-shell/use-classroom-orchestrator.ts` keeps one centralized timer scheduler while deriving board copy and stage metadata for shell consumers.
- `src/features/classroom-shell/teacher-script.ts` separates `visibleCaption` from `spokenModel`, preserving child-safe UI copy while keeping stage audio contracts available.
- `src/features/classroom-shell/lesson-board.tsx` exposes stable badge/prompt selectors so repeat-to-picture upgrades can be asserted in unit and browser layers.
- `test/e2e/guided-speaking-flow.spec.ts` verifies the repeat-after-teacher to picture-talk transition on the same lesson flow.
- `test/e2e/classroom-entry.spec.ts` confirms the legacy homepage-to-classroom smoke still passes with the Phase 3 stage-aware copy.

## Residual Risk

- 本轮 verifier 以 focused unit 与 targeted Playwright smoke 为主，没有重新做完整人工课堂走查，所以“课堂感”的细微节奏体验仍建议在后续 UI/UX audit 中补看。
- 真实语音采集、语义判断和更宽松的作答匹配仍属于 Phase 4/5 范围，不在本 phase 的已验证交付内。

## Verdict

passed

Phase 03 达成目标，可以进入 Phase 04。
