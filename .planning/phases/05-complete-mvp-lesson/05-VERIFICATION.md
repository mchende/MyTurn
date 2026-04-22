---
phase: 05-complete-mvp-lesson
status: passed
verified_on: 2026-04-22
requirements:
  - SPKG-02
  - PLAT-02
source_plans:
  - 05-01
  - 05-02
  - 05-03
---

# Phase 05 Verification

## Goal

交付一节可以从首页进入、完整上完、结课停留、自动回首页并保留余温状态的网页课堂 MVP。

## Must-Have Check

- **SPKG-02:** `src/features/classroom-shell/classroom-orchestrator.ts` 继续让后半程停留在 `picture-talk` judged path；`teacher-script.ts` 只把成功反馈缩短为 `Nice answer.`，没有跳过 `pictureTalk.semanticAccepts` 或 `judgeStudentAttempt()`；`test/unit/classroom-orchestrator.test.ts` 与 `test/e2e/guided-speaking-flow.spec.ts` 共同验证了 picture-talk success 仍会经过主段判断后进入下一题。
- **PLAT-02:** `src/features/classroom-shell/classroom-shell.tsx` 现在在 `lesson_complete` 后只启动一条 `LESSON_COMPLETE_HOLD_MS` 定时链并 `router.replace('/?completedSession=...')` 回首页；`src/app/(marketing)/page.tsx`、`src/features/schedule/get-today-schedule-view-model.ts` 和 `src/features/homepage/homepage-shell.tsx` 则接住 `completedSession` overlay，把首页呈现成“刚完成一节课”的暖态，而不污染真实时间状态。
- **课堂感完整性:** `teacher-script.ts`、`use-classroom-orchestrator.ts` 和 `podium-view-model.ts` 现在共享 `Class hello -> Class closing -> Class complete` 的 closeout vocabulary；reward 只在结尾出现一次，Bobby 仍只在 `repeat-after-teacher` 的 `ai_model` 出现，孩子侧继续保持英文优先、图片驱动、单 CTA。

## Automated Checks

```bash
npm run test:unit -- test/unit/get-today-schedule-view-model.test.ts
npm run test:unit -- test/unit/homepage-shell.test.tsx
npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/teacher-script.test.ts test/unit/classroom-shell.test.tsx
npm run test:e2e -- test/e2e/guided-speaking-flow.spec.ts
npm run test:e2e -- test/e2e/classroom-entry.spec.ts test/e2e/complete-mvp-lesson.spec.ts
```

Result: all passed on 2026-04-22.

## Evidence

- `src/features/schedule/get-today-schedule-view-model.ts` adds `isRecentlyCompleted` as an overlay-only field, leaving `accessState` untouched.
- `src/features/homepage/homepage-shell.tsx` now prioritizes recent-complete sessions for hero focus, shows `刚完成这节课` / `刚完成`, and reflows for mid-width layouts.
- `src/features/classroom-shell/classroom-shell.tsx` owns the only lesson-complete redirect timer and reuses `LESSON_COMPLETE_HOLD_MS`.
- `src/features/classroom-shell/teacher-script.ts` locks warmup / wrap-up / lesson_complete copy and shrinks picture-talk success feedback to `Nice answer.`.
- `test/e2e/complete-mvp-lesson.spec.ts` proves the full loop: homepage -> lesson -> 5 repeat confirms -> 5 picture confirms -> reward -> class complete -> homepage warmth.

## Residual Risk

- Playwright completed successfully, but the runner printed a non-fatal `EADDRINUSE 127.0.0.1:3201` warning during server teardown/start overlap. Current verdict stays `passed` because both focused E2E commands exited green; if this port reuse becomes frequent, the Playwright web-server lifecycle may need a separate infra cleanup pass.
- 自动化已覆盖状态闭环，但“平板横屏上结课余温是否足够自然”仍建议做一次人工 walkthrough。

## Verdict

passed

Phase 05 达成目标，MyTurn v1.0 milestone 已完成。
