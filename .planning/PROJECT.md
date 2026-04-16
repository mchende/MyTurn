# MyTurn

## What This Is

MyTurn 是一个面向儿童英语口语练习的网页端课堂 MVP，目标是还原真实线上英语小班课的情绪节奏与临场感。它不应该像刷题工具，而应该像一节短小但完整的在线课堂：老师带班、真实孩子与 AI 同学轮流作答、围绕图片进行口语练习。当前首个里程碑是交付一节完整的 15 分钟课堂体验，用来验证更强的“课堂感”是否能在提升开口时间的同时，继续保持孩子愿意参与、愿意开口。

## Core Value

孩子在整节课里都应真实地感受到自己“正在上一节英语小班课”，并且持续愿意开口说。

## Requirements

### Validated

- [x] 用户可以在浏览器中打开产品，并从 `我的课堂` 首页进入真实课堂路由。Validated in Phase 1: Classroom Shell
- [x] 课程数据可以配置为 5 个目标项，每个目标项都带有配套图片。Validated in Phase 1: Classroom Shell
- [x] 界面以平板横屏为优先目标，同时兼容手机和桌面端的课堂语义。Validated in Phase 1: Classroom Shell
- [x] 老师、真实孩子与 AI 同学以固定三角色课堂结构持续出现。Validated in Phase 2: Cast and Orchestration
- [x] 老师会用英文短句、明确点名与沉默接住机制推动课堂轮次。Validated in Phase 2: Cast and Orchestration
- [x] AI 同学会先示范、保留轻微犹豫感，并在孩子沉默时不越权接管课堂。Validated in Phase 2: Cast and Orchestration

### Active

- [ ] 交付一节完整的 15 分钟网页英语口语课，并优先适配平板横屏使用
- [ ] 支持以“目标词 / 短句 + 图片”方式配置课堂内容
- [ ] 让真实孩子在同一节课内从跟读复述逐步过渡到看图作答

### Out of Scope

- 原生手机或平板 App 封装发布 —— 网页优先的 MVP 更利于快速验证，减少发布阻力
- 多个真实孩子同时在线上课 —— 当前 MVP 将班级固定为 1 个真实孩子加 1 个 AI 同学
- 大规模课程体系管理与内容生产系统 —— 第一版只需要足够支撑一节可配置课堂即可
- 面向家长的运营、订阅与商业化工具 —— 这些不是当前验证课堂感所必需的
- 生产级发音评分引擎 —— 当前只需要服务课堂推进与信心建立的作答判断能力

## Context

这个产品的灵感来自真实存在的线上少儿英语课堂：老师使用以图片为主的课件，全程尽量不用中文，并频繁点名让孩子开口。核心洞察不只是“练口语”本身，而是“在班里上课”的情绪结构：先听别人回答、边看边准备、然后轮到自己。Phase 1 被有意定义为一个“课堂引擎”而不是“内容库”，目标是在一节 15 分钟的课里，围绕 5 个可配置目标项、一个老师角色和一个真实感足够的 AI 同学，验证课堂体验是否成立。

## Current State

Phase 2 已完成：产品现在在既有课堂壳体上具备 reducer 驱动的老师带班编排、Bobby 前置示范、固定三席位与默认无答案泄露的课堂主视图。下一步进入 Phase 3，把这套课堂节奏继续推进到“老师示范 -> 孩子复述 -> 图片驱动开口”的 guided speaking flow。

## Constraints

- **Platform**: 网页应用优先 —— 避免应用商店分发成本，更快完成验证
- **Lesson format**: 固定 15 分钟、2 人小班结构 —— 让 MVP 范围足够聚焦且可验证
- **Class composition**: 1 位老师、1 个真实孩子、1 个 AI 同学 —— 保留小班氛围，同时避免真实多人实时课堂复杂度
- **Input model**: 以图片和英文语音为主 —— 保持沉浸感，并贴近灵感来源课堂形式
- **Language**: 面向孩子的主流程应尽量保持英文 —— 避免退化成解释型双语辅导
- **Content model**: 每节课 5 个可配置目标词或短句 —— 内容规模足以验证节奏，无需先建设完整课程体系
- **Experience**: 产品体验必须像课堂，而不是工具页 —— 界面、节奏和动效都应服务“临场感”

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 网页优先的 MVP 形态 | 相比原生 App 分发，更快进入验证阶段 | — Pending |
| 固定 2 人小班形式 | 以最小复杂度保留小班课堂中的缓冲感和节奏感 | — Pending |
| 采用老师点名推进课堂 | 明确点名是课堂临场感的核心机制之一 | — Pending |
| AI 同学应保留轻微不完美感 | 真实感比“演示得很完美”更重要 | — Pending |
| 一节课内要从复述逐步过渡到看图作答 | 产品必须在课堂推进中逐步提高主动输出要求 | — Pending |
| 默认先轻提示，再退回示范跟读 | 这样能保持孩子持续开口，而不是把课堂变成一对一纠错 | — Pending |
| 基础能力优先选成熟社区库 | 避免在 MVP 早期把精力耗在造基础轮子上 | — Pending |

## Evolution

这份文档会在 phase 切换和 milestone 边界持续演进。

**After each phase transition** (via `$gsd-transition`):
1. 如果有需求被证伪 -> 移入 Out of Scope 并写明原因
2. 如果有需求已被验证 -> 移入 Validated 并标注对应 phase
3. 如果出现新需求 -> 加入 Active
4. 如果出现需要记录的决策 -> 更新 Key Decisions
5. 如果 “What This Is” 已发生漂移 -> 及时更新

**After each milestone** (via `$gsd-complete-milestone`):
1. 完整复查所有章节
2. 检查 Core Value 是否仍是当前最重要的优先级
3. 审核 Out of Scope 中的排除理由是否仍然成立
4. 用最新状态更新 Context

---
*Last updated: 2026-04-17 after Phase 2 completion*
