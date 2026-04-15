---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: ready_to_plan
stopped_at: Completed 01-classroom-shell-04-PLAN.md
last_updated: "2026-04-15T15:12:10.556Z"
last_activity: 2026-04-15
progress:
  total_phases: 5
  completed_phases: 1
  total_plans: 3
  completed_plans: 0
  percent: 20
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-15)

**Core value:** 孩子在整节课里都应真实地感受到自己“正在上一节英语小班课”，并且持续愿意开口说。
**Current focus:** Phase 02 — cast-and-orchestration

## Current Position

Phase: 02 (cast-and-orchestration) — READY TO PLAN
Plan: Not started
Status: Ready to plan
Last activity: 2026-04-15

Progress: [██░░░░░░░░] 20%

## Performance Metrics

**Velocity:**

- Total plans completed: 4
- Average duration: 5min
- Total execution time: 0.3 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-classroom-shell | 4 | 20min | 5min |

**Recent Trend:**

- Last 5 plans: 01-01, 01-02, 01-03, 01-04
- Trend: Stable

| Phase 01-classroom-shell P01 | 2m | 2 tasks | 15 files |
| Phase 01-classroom-shell P02 | 6min | 2 tasks | 13 files |
| Phase 01-classroom-shell P03 | 6min | 1 tasks | 10 files |
| Phase 01-classroom-shell P04 | 6min | 1 tasks | 10 files |

## Accumulated Context

### Decisions

决策完整记录在 PROJECT.md 的 Key Decisions 表格中。
当前影响后续工作的近期决策：

- Phase 1: 采用网页优先的 MVP 形态，优先验证课堂感而不是平台封装
- Phase 1: 固定角色为 1 位老师、1 个真实孩子、1 个 AI 同学
- Phase 1: 课程推进需从复述逐步过渡到看图作答
- [Phase 01-classroom-shell]: Use Plus Jakarta Sans and Manrope token fallbacks to match the approved UI contract while keeping classroom-focused body and display font variables.
- [Phase 01-classroom-shell]: Scope Vitest to test/unit so placeholder Playwright specs do not break the unit runner.
- [Phase 01-classroom-shell]: Keep Wave 0 tests intentionally skipped with explicit handoff comments instead of fake passing assertions.
- [Phase 01-classroom-shell]: Keep lesson stages fixed in schema and let pages consume exported contracts instead of redefining stage IDs.
- [Phase 01-classroom-shell]: Model entry timing as a pure selector plus a day-session builder so homepage and lesson routes share one access-state rule.
- [Phase 01-classroom-shell]: Seed week-01 lesson content locally with parsed TS modules and stable SVG assets to support image-first classroom screens.
- [Phase 01-classroom-shell]: Move the homepage shell into src/app/(marketing)/page.tsx so the real root route follows the Stitch schedule contract.
- [Phase 01-classroom-shell]: Homepage data is mapped into a server-safe schedule view-model before rendering cards and CTA state.
- [Phase 01-classroom-shell]: Keep mobile top bar and desktop left rail in parallel so 主页 and 设置 remain reachable across breakpoints.
- [Phase 01-classroom-shell]: Resolve `/lesson/[sessionId]` from the seeded weekday schedule and keep unknown sessions on `notFound()` rather than rendering a broken classroom shell.
- [Phase 01-classroom-shell]: Run Playwright against an isolated dedicated dev-server port because Next.js blocks concurrent repo-local `next dev` instances during smoke validation.

### Pending Todos

暂无。

### Blockers/Concerns

- 语音采集、转写和响应延迟方案仍需在技术规划阶段明确
- 网页语音栈和课堂编排模式的研究文档尚未补齐

## Session Continuity

Last session: 2026-04-15T15:13:39.873Z
Stopped at: Completed 01-classroom-shell-04-PLAN.md
Resume file: None
