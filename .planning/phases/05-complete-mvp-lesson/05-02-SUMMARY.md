---
phase: 05-complete-mvp-lesson
plan: 02
subsystem: homepage
tags: [nextjs, homepage, schedule-view-model, responsive-ui]
requires:
  - phase: 05-complete-mvp-lesson
    provides: lesson_complete / completionHoldMs shared contract from 05-01
provides:
  - homepage `completedSession` overlay contract without mutating real schedule access state
  - recently-completed hero and timeline warm-state copy
  - responsive homepage reflow for mid-width and narrow viewports
affects: [homepage-closeout, lesson-auto-return, responsive-layout]
tech-stack:
  added: []
  patterns: [query overlay state, mobile-first responsive reflow]
key-files:
  created:
    - .planning/phases/05-complete-mvp-lesson/05-02-SUMMARY.md
    - test/unit/get-today-schedule-view-model.test.ts
  modified:
    - src/app/(marketing)/page.tsx
    - src/features/schedule/get-today-schedule-view-model.ts
    - src/features/homepage/homepage-shell.tsx
    - test/unit/homepage-shell.test.tsx
key-decisions:
  - "Keep recently-completed as a query-driven overlay and do not extend SessionAccessState with a synthetic completed variant."
  - "Let homepage focus recent-complete first, then fall back to nextSession and the first scheduled card."
  - "Replace fixed homepage overflow assumptions with mobile-first stacked layout and xl-only locked desktop shell."
patterns-established:
  - "Home route parses `completedSession` once and passes a lightweight overlay option into the schedule view-model."
  - "Homepage shell consumes `isRecentlyCompleted` for hero/timeline warmth without changing lesson entry routing."
requirements-completed: [PLAT-02]
duration: 8m
completed: 2026-04-22
---

# Phase 05 Plan 02: Complete MVP Lesson Summary

**Homepage now catches the post-class warm return with one overlay contract, and the dashboard no longer hides key content in mid-width layouts**

## Performance

- **Duration:** 8m
- **Started:** 2026-04-22T15:34:00+08:00
- **Completed:** 2026-04-22T15:42:30+08:00
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Added a `completedSession` query -> view-model overlay path so the homepage can mark a just-finished session without corrupting real schedule timing truth.
- Taught the homepage hero and timeline to prioritize `isRecentlyCompleted`, showing `刚完成这节课`, `今天这节课已经上完啦`, and `刚完成`.
- Reworked the homepage layout into a mobile-first stacked flow with `xl`-only fixed desktop locking, fixing the mid-width “middle/right side disappears” problem.

## Task Commits

Pending in current session. Planned as one minimal atomic commit after summary creation.

## Files Created/Modified

- `src/app/(marketing)/page.tsx` - 读取 `completedSession` search param 并传入首页 view-model overlay 选项。
- `src/features/schedule/get-today-schedule-view-model.ts` - 新增 `isRecentlyCompleted` overlay contract，并让 focus session 先看 recent-complete。
- `src/features/homepage/homepage-shell.tsx` - 实现 recently-completed hero/timeline 文案与响应式重排。
- `test/unit/get-today-schedule-view-model.test.ts` - 锁定 overlay 不污染真实 `accessState` 的合同。
- `test/unit/homepage-shell.test.tsx` - 覆盖 recently-completed homecoming 状态与响应式 class contract。

## Decisions Made

- recently-completed 只作为一次导航后的 UI overlay 存在，不进入真实 access-state 枚举。
- 首页 hero CTA 在 recent-complete 状态下仍直达该 session lesson route，保持 lesson/home 闭环链路一致。
- 中窄视口允许纵向滚动和上下堆叠，不再硬撑 `h-screen + overflow-hidden + fixed columns`。

## Deviations from Plan

None.

## Issues Encountered

- 初版 unit test 对具体时间状态做了过强假设；已改成与 baseline 比较 `accessState` 是否保持不变，更贴合 overlay contract。

## User Setup Required

None.

## Verification

- `npm run test:unit -- test/unit/get-today-schedule-view-model.test.ts`
- `npm run test:unit -- test/unit/homepage-shell.test.tsx`

## Next Phase Readiness

- 05-03 可以直接消费 `/?completedSession=...` 首页余温合同，无需再新造 completion store。
- lesson closeout 只需要在 `lesson_complete` 后用共享 `LESSON_COMPLETE_HOLD_MS` 跳回首页即可完成闭环。

## Self-Check: PASSED

- FOUND: `test/unit/get-today-schedule-view-model.test.ts`
- FOUND: `刚完成这节课`
- FOUND: `刚完成`
- FOUND: `xl:flex-row`
- FOUND: `overflow-y-auto`

---
*Phase: 05-complete-mvp-lesson*
*Completed: 2026-04-22*
