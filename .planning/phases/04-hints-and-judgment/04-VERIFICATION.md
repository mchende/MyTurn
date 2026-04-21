---
phase: 04-hints-and-judgment
status: passed
verified_on: 2026-04-21
requirements:
  - TEAC-03
  - TEAC-04
  - SPKG-03
  - SPKG-04
  - SPKG-05
source_plans:
  - 04-01
  - 04-02
  - 04-03
---

# Phase 04 Verification

## Goal

用轻提示、兜底示范和分阶段判断策略维持课堂节奏与开口状态。

## Must-Have Check

- **TEAC-03:** `src/features/classroom-shell/classroom-orchestrator.ts` 与 `src/features/classroom-shell/teacher-script.ts` 现在会在 repeat / picture 的第一次失败后进入轻提示分支；`test/unit/classroom-orchestrator.test.ts`、`test/unit/teacher-script.test.ts`、`test/unit/classroom-shell.test.tsx` 共同覆盖了 observe hint、narrowed re-ask 与单 CTA 护栏。
- **TEAC-04:** reducer 已新增 `teacher_fallback_model`，并在第二次失败后统一走 `teacher_fallback_model -> teacher_echo -> move_next`；`teacher_echo` 只保留一次 `I said it with Cora` 的 final follow 机会，`test/unit/classroom-orchestrator.test.ts` 与 `test/e2e/guided-speaking-flow.spec.ts` 都验证了 repeat / picture fallback close-out。
- **SPKG-03:** `src/features/classroom-shell/classroom-judgment.ts` 对 repeat 阶段使用 transcript normalization + lexical closeness 判断，`content/lessons/week-01/lesson-01.ts` 通过 `repeatAccepts` 提供内容级 accept set，`test/unit/classroom-judgment.test.ts` 已覆盖近似匹配通过与失败升级。
- **SPKG-04:** `src/features/lesson-config/lesson-schema.ts` 与 week-01 content 现在为 picture-talk 提供 `semanticAccepts`、`observeHint`、`narrowedQuestion`、`fallbackModel` 元数据；`test/unit/lesson-schema.test.ts` 和 `test/unit/classroom-judgment.test.ts` 验证了语义接受与 fallback 分流合同。
- **SPKG-05:** `src/features/classroom-shell/teacher-script.ts`、`src/features/classroom-shell/podium-view-model.ts`、`src/features/classroom-shell/classroom-shell.tsx` 保持 child-facing UI 英文优先、单 CTA、无 score / correct / incorrect 标签，fallback answer 仅存在于 `spokenModel`，shell 与 Playwright 回归均断言没有答案泄露。

## Automated Checks

```bash
npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx test/unit/teacher-script.test.ts test/unit/classroom-judgment.test.ts test/unit/lesson-schema.test.ts
npm run test:e2e -- test/e2e/guided-speaking-flow.spec.ts test/e2e/classroom-entry.spec.ts
```

Result: all passed on 2026-04-21.

## Evidence

- `src/features/classroom-shell/classroom-orchestrator.ts` contains the hint ladder, judged attempt routing, explicit `teacher_fallback_model`, and final follow transition.
- `src/features/classroom-shell/classroom-judgment.ts` keeps repeat / picture evaluation behind a pure `pass | retry | fallback` adapter boundary.
- `src/features/classroom-shell/teacher-script.ts` separates `spokenModel` from child-safe `visibleCaption`, so fallback models stay teacher-owned instead of leaking into the student surface.
- `src/features/classroom-shell/podium-view-model.ts` preserves the shell's single-button contract while swapping the final fallback CTA to `I said it with Cora`.
- `test/e2e/guided-speaking-flow.spec.ts` now preserves the Phase 3 baseline flow and adds an explicit fallback branch.
- `test/e2e/classroom-entry.spec.ts` still passes, confirming the homepage-to-lesson entry smoke was not regressed by Phase 4 changes.

## Residual Risk

- 本轮 verifier 以 focused unit 和 targeted Playwright smoke 为主，没有重新做完整人工课堂走查，所以“提示与兜底的课堂感是否足够自然”仍建议在 Phase 5 前做一次真实平板横屏 walkthrough。
- 真实语音采集、转写与在线语义判断仍不在当前 phase 的已验证交付内，当前匹配仍基于内容元数据与模拟 transcript 合同。

## Verdict

passed

Phase 04 达成目标，可以进入 Phase 05。
