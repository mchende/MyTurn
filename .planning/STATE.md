---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: voice-enabled-usable-mvp
status: planning
stopped_at: Opened v1.1 Voice-Enabled Usable MVP after v1.0 verification
last_updated: "2026-04-22T16:40:00.000Z"
last_activity: 2026-04-22
progress:
  total_phases: 3
  completed_phases: 0
  total_plans: 9
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-22)

**Core value:** 孩子在整节课里都应真实地感受到自己“正在上一节英语小班课”，并且持续愿意开口说。
**Current focus:** Start v1.1 voice-enabled usable MVP planning

## Current Position

Phase: 06 (voice-capture-classroom-loop) — NOT STARTED
Plan: 0 of 3
Status: Milestone opened, ready for discuss/planning
Last activity: 2026-04-22

Progress: [----------] 0%

## Performance Metrics

**Carryover milestone:** v1.0 classroom prototype verified on 2026-04-22

**Next execution target:**

- Start Phase 06 discussion/planning
- Confirm browser speech capture and transcription strategy
- Preserve existing classroom contracts while adding real voice input

## Accumulated Context

### Decisions

决策完整记录在 PROJECT.md 的 Key Decisions 表格中。
当前影响后续工作的近期决策：

- `v1.0` 的 1-5 阶段保留为“课堂原型已验证”，不回滚既有完成状态
- `v1.1` 只补语音可用化，不重做 lesson state machine、homepage overlay 或 closeout flow
- Bobby 仍只在 `repeat-after-teacher` 的 `ai_model` 出现
- reward 仍只在结尾出现一次
- 课堂完成态仍停留约 3 秒后自动回首页
- 首页与课堂页继续优先保证完整可见或可滚动，不再依赖固定三栏加裁切布局

### Pending Todos

- 确定浏览器语音采集与转写技术路线
- 规划语音失败、无权限、静音和延迟过高时的课堂兜底策略
- 定义最小 focused unit / e2e 验证集合，覆盖真实语音闭环

### Blockers/Concerns

- 浏览器端麦克风权限、录音 API 与平板横屏设备兼容性仍需确认
- 语音转写与课堂反馈的延迟上限需要在 Phase 6/7 中尽快量化
- 若浏览器原生语音能力不稳定，需尽早决定服务端或第三方转写方案

## Session Continuity

Last session: 2026-04-22
Stopped at: Opened v1.1 Voice-Enabled Usable MVP
Resume file: .planning/ROADMAP.md
