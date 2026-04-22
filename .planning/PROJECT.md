# MyTurn

## What This Is

MyTurn 是一个面向儿童英语口语练习的网页端课堂 MVP，目标是还原真实线上英语小班课的情绪节奏与临场感。它不应该像刷题工具，而应该像一节短小但完整的在线课堂：老师带班、真实孩子与 AI 同学轮流作答、围绕图片进行口语练习。`v1.0` 已经完成了“课堂原型”的验证；当前新增的 `v1.1` 里程碑则聚焦把这套课堂原型推进成“可真实开口使用”的网页课堂 MVP。

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
- [x] 孩子可以在同一节课内从跟读复述逐步过渡到看图作答。Validated in Phase 3-5
- [x] 系统已具备轻提示、兜底策略和宽松判断合同，可维持课堂节奏而不是做严格打分。Validated in Phase 4
- [x] 首页、课堂页与结课回流已经形成完整网页课堂原型闭环。Validated in Phase 5

### Active

- [ ] 让孩子可以在浏览器里使用真实语音输入完成整节课堂，而不是依赖手动确认
- [ ] 在 `repeat-after-teacher` 与 `picture-talk` 环节接入可用的语音转写，并复用现有判断合同
- [ ] 控制听录音、转写、判断和重试的等待体验，保持“像上课”而不是“像工具在加载”
- [ ] 让平板横屏上的整节课达到“真实可开口使用”的 MVP 门槛

### Out of Scope

- 原生手机或平板 App 封装发布 —— 网页优先的 MVP 更利于快速验证，减少发布阻力
- 多个真实孩子同时在线上课 —— 当前 MVP 将班级固定为 1 个真实孩子加 1 个 AI 同学
- 大规模课程体系管理与内容生产系统 —— 现阶段仍以验证课堂主流程和真实开口闭环为主
- 面向家长的运营、订阅与商业化工具 —— 这些不是当前验证课堂感所必需的
- 生产级发音评分引擎 —— 当前只需要服务课堂推进与信心建立的作答判断能力

## Context

这个产品的灵感来自真实存在的线上少儿英语课堂：老师使用以图片为主的课件，全程尽量不用中文，并频繁点名让孩子开口。核心洞察不只是“练口语”本身，而是“在班里上课”的情绪结构：先听别人回答、边看边准备、然后轮到自己。`v1.0` 被有意定义为一个“课堂引擎”而不是“内容库”，目标是在一节 15 分钟的课里，围绕 5 个可配置目标项、一个老师角色和一个真实感足够的 AI 同学，验证课堂体验是否成立。这一部分已经完成。

用户随后明确指出：如果没有真实语音能力，产品还不能叫“可正常使用的 MVP”。因此当前新增的 `v1.1` 里程碑，不是推翻原有 1-5 阶段，而是在既有课堂引擎上补上浏览器麦克风、语音转写、等待/失败兜底与整节课可用性门槛，把“课堂原型”推进为“可真实使用的课堂 MVP”。

## Current State

`v1.0` 已于 2026-04-22 完成验证，确认课堂原型成立。当前项目已开启 `v1.1 Voice-Enabled Usable MVP`，接下来会围绕真实语音输入闭环展开新的 phase 规划与执行。现有课堂状态机、首页 recently-completed 合同、结课回首页逻辑和分阶段判断能力都应被复用，而不是重做一套新的课堂骨架。

## Constraints

- **Platform**: 网页应用优先 —— 避免应用商店分发成本，更快完成验证
- **Lesson format**: 固定 15 分钟、2 人小班结构 —— 让 MVP 范围足够聚焦且可验证
- **Class composition**: 1 位老师、1 个真实孩子、1 个 AI 同学 —— 保留小班氛围，同时避免真实多人实时课堂复杂度
- **Input model**: 以图片和英文语音为主，并补齐真实麦克风输入闭环
- **Language**: 面向孩子的主流程应尽量保持英文 —— 避免退化成解释型双语辅导
- **Content model**: 每节课 5 个可配置目标词或短句 —— 内容规模足以验证节奏，无需先建设完整课程体系
- **Experience**: 产品体验必须像课堂，而不是工具页 —— 界面、节奏、动效和语音等待反馈都应服务“临场感”

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 网页优先的 MVP 形态 | 相比原生 App 分发，更快进入验证阶段 | Accepted |
| 固定 2 人小班形式 | 以最小复杂度保留小班课堂中的缓冲感和节奏感 | Accepted |
| 采用老师点名推进课堂 | 明确点名是课堂临场感的核心机制之一 | Accepted |
| AI 同学应保留轻微不完美感 | 真实感比“演示得很完美”更重要 | Accepted |
| 一节课内要从复述逐步过渡到看图作答 | 产品必须在课堂推进中逐步提高主动输出要求 | Accepted |
| 默认先轻提示，再退回示范跟读 | 这样能保持孩子持续开口，而不是把课堂变成一对一纠错 | Accepted |
| 基础能力优先选成熟社区库 | 避免在 MVP 早期把精力耗在造基础轮子上 | Accepted |
| 将 `v1.0` 重新定位为“课堂原型 milestone” | 当前闭环已能验证课堂感，但尚不足以支撑真实使用 | Accepted |
| `v1.1` 聚焦语音可用化，而不是开新内容或后台范围 | 真实可用性的主要缺口在语音输入闭环 | Accepted |
| 继续复用既有 lesson state machine、judgment contract 与 closeout flow | 避免因语音接入重做课堂编排骨架 | Accepted |
| Bobby 仍只出现在 `repeat-after-teacher` 的 `ai_model` | 保持课堂角色分工稳定，避免 picture-talk 被 AI 抢答 | Accepted |
| 不把当前阶段做成生产级发音评分器 | 先满足“听懂并推动课堂”比“细粒度打分”更重要 | Accepted |

## Evolution

这份文档会在 phase 切换和 milestone 边界持续演进。

**After each phase transition**:
1. 如果有需求被证伪 -> 移入 Out of Scope 并写明原因
2. 如果有需求已被验证 -> 移入 Validated 并标注对应 phase
3. 如果出现新需求 -> 加入 Active
4. 如果出现需要记录的决策 -> 更新 Key Decisions
5. 如果 “What This Is” 已发生漂移 -> 及时更新

**After each milestone**:
1. 完整复查所有章节
2. 检查 Core Value 是否仍是当前最重要的优先级
3. 审核 Out of Scope 中的排除理由是否仍然成立
4. 用最新状态更新 Context

---
*Last updated: 2026-04-22 after opening v1.1 Voice-Enabled Usable MVP*
