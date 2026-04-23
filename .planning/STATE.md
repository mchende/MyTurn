---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: voice-enabled-usable-mvp
status: planning
stopped_at: Phase 6 planning completed
last_updated: "2026-04-23T11:10:00.000Z"
last_activity: 2026-04-23
progress:
  total_phases: 3
  completed_phases: 0
  total_plans: 9
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-23)

**Core value:** 孩子在整节课里都应真实地感受到自己“正在上一节英语小班课”，并且持续愿意开口说。
**Current focus:** Phase 6 research and plans completed, ready for execute-phase

## Current Position

Phase: 06 (audio-classroom-runtime) — PLANNED
Plan: 3 of 3
Status: Research complete, validation drafted, ready for execute-phase
Last activity: 2026-04-23

Progress: [----------] 0%

## Performance Metrics

**Carryover milestone:** v1.0 classroom prototype verified on 2026-04-22

**Next execution target:**

- Execute Phase 06 plans in order
- Execute 06-01 shared audio runtime contracts
- Execute 06-02 preflight + shell audio wiring
- Preserve existing classroom contracts while adding full audio runtime

## Accumulated Context

### Decisions

决策完整记录在 PROJECT.md 的 Key Decisions 表格中。
当前影响后续工作的近期决策：

- `v1.0` 的 1-5 阶段保留为“课堂原型已验证”，不回滚既有完成状态
- `v1.1` 补完整音频课堂可用化，不重做 lesson state machine、homepage overlay 或 closeout flow
- Bobby 仍只在 `repeat-after-teacher` 的 `ai_model` 出现
- reward 仍只在结尾出现一次
- 课堂完成态仍停留约 3 秒后自动回首页
- 首页与课堂页继续优先保证完整可见或可滚动，不再依赖固定三栏加裁切布局
- 老师/Bobby 发声、孩子录音与等待转写必须由统一音频运行时调度

### Pending Todos

- 执行 06-01：共享音频 runtime、script audio contract 与浏览器录音基线
- 执行 06-02：进课前轻量预检、老师/Bobby 发声和讲台单 CTA 录音入口
- 执行 06-03：音频模式响应式回归与 focused browser smoke
- 为 Phase 7 预留 transcript / judgment 接线接口

### Blockers/Concerns

- 浏览器端音频播放策略、麦克风权限、录音 API 与平板横屏设备兼容性已完成 research，但执行时仍需验证真实浏览器表现
- 语音转写与课堂反馈的延迟上限需要在 Phase 6/7 中尽快量化
- 若浏览器原生语音或 TTS 能力不稳定，需尽早决定服务端或第三方方案
- 若音频运行时调度做不好，15 分钟小课会退化成分散的工具流程

## Session Continuity

Last session: 2026-04-23
Stopped at: Phase 6 planning completed
Resume file: .planning/phases/06-audio-classroom-runtime/06-01-PLAN.md
