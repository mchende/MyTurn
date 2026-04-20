---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Completed 03-guided-speaking-flow-01-PLAN.md
last_updated: "2026-04-20T02:59:41.582Z"
last_activity: 2026-04-20 -- Completed 03-01 guided-speaking-flow
progress:
  total_phases: 5
  completed_phases: 2
  total_plans: 10
  completed_plans: 8
  percent: 80
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-15)

**Core value:** 孩子在整节课里都应真实地感受到自己“正在上一节英语小班课”，并且持续愿意开口说。
**Current focus:** Phase 03 — guided-speaking-flow

## Current Position

Phase: 03 (guided-speaking-flow) — EXECUTING
Plan: 2 of 3
Status: Ready to execute
Last activity: 2026-04-20 -- Completed 03-01 guided-speaking-flow

Progress: [████████░░] 80%

## Performance Metrics

**Velocity:**

- Total plans completed: 8
- Average duration: 6.4min
- Total execution time: 0.9 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-classroom-shell | 4 | 20min | 5min |
| 02-cast-and-orchestration | 3 | 26min | 8.7min |

**Recent Trend:**

- Last 5 plans: 01-04, 02-01, 02-02, 02-03, 03-01
- Trend: Stable

| Phase 01-classroom-shell P03 | 6min | 1 tasks | 10 files |
| Phase 01-classroom-shell P04 | 6min | 1 tasks | 10 files |
| Phase 02-cast-and-orchestration P01 | 10min | 2 tasks | 4 files |
| Phase 02-cast-and-orchestration P02 | 4min | 2 tasks | 5 files |
| Phase 02-cast-and-orchestration P03 | 12min | 3 tasks | 9 files |
| Phase 03-guided-speaking-flow P01 | 5min | 2 tasks | 4 files |

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
- [Phase 02-cast-and-orchestration]: Use a reducer-driven classroom orchestrator so teacher-led turn order and silence handling live in one deterministic state graph.
- [Phase 02-cast-and-orchestration]: Keep target words out of the child-facing classroom surface by default and expose them only behind debug metadata.
- [Phase 02-cast-and-orchestration]: Let Bobby demo only in the `ai_model` phase with mild hesitation, while silence recovery remains teacher-owned.
- [Phase 03-guided-speaking-flow]: Derive guided speaking progress from lesson.stages so repeat-after-teacher fully completes before picture-talk begins.
- [Phase 03-guided-speaking-flow]: Use student_participation_confirmed as the only speaking success signal instead of exposing auto-speech semantics in the hook API.
- [Phase 03-guided-speaking-flow]: Keep useClassroomOrchestrator on one centralized CLASSROOM_TIMINGS scheduler while exposing stage metadata directly to shell consumers.

### Pending Todos

暂无。

### Blockers/Concerns

- 语音采集、转写和响应延迟方案仍需在技术规划阶段明确
- 网页语音采集、转写和实时响应延迟方案仍需在 Phase 3/4 技术规划中继续明确

## Session Continuity

Last session: 2026-04-20T02:59:41.578Z
Stopped at: Completed 03-guided-speaking-flow-01-PLAN.md
Resume file: None
