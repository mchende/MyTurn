# MyTurn Agent Guide

## Project Snapshot

MyTurn 是一个面向儿童英语口语练习的网页端课堂 MVP，重点是还原真实线上英语小班课的临场感。当前里程碑聚焦于一节完整的 15 分钟课程，包含 1 位老师、1 个真实孩子和 1 个 AI 同学，并优先适配平板横屏。

## Source of Truth

- 阅读 `.planning/PROJECT.md` 了解当前产品意图、范围边界和关键决策。
- 阅读 `.planning/REQUIREMENTS.md` 了解已承诺的 v1 需求集合及其 phase 映射。
- 阅读 `.planning/ROADMAP.md` 了解当前 phase 顺序和计划占位。
- 开始工作前优先阅读 `.planning/STATE.md`，恢复当前进度与阻塞信息。
- 将 `Phase 1 CONTEXT.md` 视为本次初始化所依据的原始讨论材料。

## Workflow

- 优先通过 GSD 的 phase 命令开展工作，确保规划文档和实现保持同步。
- 下一步推荐命令是 `$gsd-discuss-phase 1` 或 `$gsd-plan-phase 1`。
- 始终让 MVP 聚焦“课堂感”验证，而不是内容规模或平台扩张。
- GSD 生成的文档正文默认使用中文，但保留现有英文标题和结构，除非某个 workflow 明确要求其他格式。
- 技术选型优先使用成熟社区包，不手搓基础能力库；当前项目明确将 `shadcn/ui` 纳入 UI 基础栈。

## Product Guardrails

- 整体体验必须像一节短课，而不是练习册或答题工具。
- 老师点名轮转和孩子作答前的缓冲空间属于核心能力，不是锦上添花。
- 英文优先、图片驱动理解是产品假设的一部分。
- 宽松的作答处理应服务于信心和节奏，而不是做成严格的发音评分器。
