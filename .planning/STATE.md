---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: voice-enabled-usable-mvp
status: executing
stopped_at: Completed 07-03-PLAN.md
last_updated: "2026-04-24T11:40:00.000+08:00"
last_activity: 2026-04-24 -- Planned Phase 07 speech recognition wiring
progress:
  total_phases: 3
  completed_phases: 1
  total_plans: 9
  completed_plans: 3
  percent: 33
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-23)

**Core value:** 孩子在整节课里都应真实地感受到自己“正在上一节英语小班课”，并且持续愿意开口说。
**Current focus:** Phase 07 planned — ready for execution

## Current Position

Phase: 07 (speech-recognition-wiring) — PLANNED
Plan: 3 of 3
Status: Phase 06 verified, Phase 07 planned and ready for execution
Last activity: 2026-04-24 -- Planned Phase 07 speech recognition wiring

Progress: [###-------] 33%

## Performance Metrics

**Carryover milestone:** v1.0 classroom prototype verified on 2026-04-22

**Next execution target:**

- Start Phase 07 transcript adapter and timeout/success instrumentation
- Reuse Phase 06 audio runtime instead of reopening playback/recording shell wiring
- Keep Bobby / reward / lesson-complete carryover contracts unchanged while ASR connects in

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
- Phase 06 已建立可注入的 classroom audio runtime，后续 UI 不再直接管理浏览器播放和录音生命周期
- 老师和 Bobby 的 script contract 已暴露 `audioSpeaker` 与 `audioCueKey`，供运行时直接消费
- 课堂入口现在先走轻量 preflight gate，支持 pass / skip 两条路径且不新增主课件遮罩
- Focused browser smoke 已能在 fake browser audio 下证明 preflight、课堂落地与单 CTA 录音入口存在

### Pending Todos

- 启动 07-01：建立 transcript adapter、timeout / success instrumentation 与 Wave 0 识别合同测试
- 启动 07-02：接通 repeat-after-teacher 语音判断链路
- 为 Phase 08 预留整课节奏校准与人工 UAT 门

### Blockers/Concerns

- 真实浏览器下的 transcript 延迟、识别失败率和低质量输入处理还没有产品化证据
- 如果 Phase 07 的 transcript 接线不能稳定复用既有 judgment contract，课堂节奏会重新碎裂
- 真实平板横屏的人手 walkthrough 仍建议补一次，尤其关注 skip preflight 后的课堂感

## Session Continuity

Last session: 2026-04-24
Stopped at: Completed 07-03-PLAN.md
Resume file: .planning/phases/07-speech-recognition-wiring/07-01-PLAN.md
