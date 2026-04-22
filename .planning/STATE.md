---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: planning
stopped_at: Phase 5 context gathered
last_updated: "2026-04-22T01:19:43.358Z"
last_activity: 2026-04-21
progress:
  total_phases: 5
  completed_phases: 4
  total_plans: 13
  completed_plans: 13
  percent: 87
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-15)

**Core value:** 孩子在整节课里都应真实地感受到自己“正在上一节英语小班课”，并且持续愿意开口说。
**Current focus:** Phase 05 — complete-mvp-lesson

## Current Position

Phase: 05 (complete-mvp-lesson) — READY
Plan: 0 of 2
Status: Ready for phase discussion or planning
Last activity: 2026-04-21

Progress: [████████░░] 87%

## Performance Metrics

**Velocity:**

- Total plans completed: 10
- Average duration: 6.6min
- Total execution time: 1.0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-classroom-shell | 4 | 20min | 5min |
| 02-cast-and-orchestration | 3 | 26min | 8.7min |
| 03-guided-speaking-flow | 3 | 25min | 8.3min |

**Recent Trend:**

- Last 5 plans: 02-02, 02-03, 03-01, 03-02, 03-03
- Trend: Stable

| Phase 01-classroom-shell P03 | 6min | 1 tasks | 10 files |
| Phase 01-classroom-shell P04 | 6min | 1 tasks | 10 files |
| Phase 02-cast-and-orchestration P01 | 10min | 2 tasks | 4 files |
| Phase 02-cast-and-orchestration P02 | 4min | 2 tasks | 5 files |
| Phase 02-cast-and-orchestration P03 | 12min | 3 tasks | 9 files |
| Phase 03-guided-speaking-flow P01 | 5min | 2 tasks | 4 files |
| Phase 03 P02 | 8min | 2 tasks | 10 files |
| Phase 03-guided-speaking-flow P03 | 12min | 2 tasks | 8 files |
| Phase 04 P01 | 6min | 2 tasks | 7 files |
| Phase 04-hints-and-judgment P02 | 9min | 2 tasks | 10 files |
| Phase 04-hints-and-judgment P03 | 12min | 2 tasks | 8 files |

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
- [Phase 03]: Render teacher visible copy from visibleCaption while preserving spokenModel for stage audio contracts.
- [Phase 03]: Keep participation confirmation as a single podium CTA with stage-specific labels instead of adding extra shell chrome.
- [Phase 03]: Restrict Bobby to repeat-after-teacher ai_model turns so picture-talk retries remain teacher-owned.
- [Phase 03-guided-speaking-flow]: Keep picture-talk retry handling inside teacher_encourage, branching by attemptIndex between second chance and close-out.
- [Phase 03-guided-speaking-flow]: Expose board badge and prompt as stable DOM nodes so stage upgrades can be asserted in unit and browser tests.
- [Phase 04]: Keep attemptIndex as learner-turn index only, and split retry semantics into hintLevel plus turnResolution.
- [Phase 04]: Drive repeat and picture first-failure handling through the existing reducer and single timeout effect instead of adding a parallel hint controller.
- [Phase 04]: Pass retry context into the podium view-model so picture-talk can switch from observe hint to narrowed re-ask without adding a second CTA.
- [Phase 04-hints-and-judgment]: Keep judged attempts behind a pure classroom-judgment adapter and let the reducer consume only pass/retry/fallback.
- [Phase 04-hints-and-judgment]: Author repeatAccepts and pictureTalk.semanticAccepts in lesson content instead of hardcoding vocabulary in reducer branches.
- [Phase 04-hints-and-judgment]: Preserve confirmStudentParticipation as a hook-level compatibility alias that dispatches submitStudentAttempt with a stage-safe canonical transcript.
- [Phase 04-hints-and-judgment]: Reuse teacher_echo as the final follow phase and keep the only child-facing button label as I said it with Cora.

### Pending Todos

暂无。

### Blockers/Concerns

- 语音采集、转写和响应延迟方案仍需在技术规划阶段明确
- 网页语音采集、转写和实时响应延迟方案仍需在 Phase 3/4 技术规划中继续明确

## Session Continuity

Last session: 2026-04-22T01:19:43.343Z
Stopped at: Phase 5 context gathered
Resume file: .planning/phases/05-complete-mvp-lesson/05-CONTEXT.md
