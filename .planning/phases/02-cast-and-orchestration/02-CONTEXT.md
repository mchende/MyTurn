# Phase 2: Cast and Orchestration - Context

**Gathered:** 2026-04-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 2 交付的是课堂里的“谁在带班、谁在等待、谁在上台”这套编排骨架。它需要把老师、真实孩子、AI 同学三方角色固定下来，并建立一次点一个人作答的轮转机制，让孩子在网页里感受到真实小班课的等待感、被点名感和跟着班级节奏前进的临场感。

本阶段不扩展到真实语音采集、转写、提示兜底、宽松语义判断或完整 15 分钟课程整合；这些分别属于后续的 Guided Speaking Flow、Hints and Judgment 与 Complete MVP Lesson。

</domain>

<decisions>
## Implementation Decisions

### 角色拓扑与席位表达
- **D-01:** 每节课保持固定角色组合：1 位老师 Cora、1 个真实孩子“我”、1 个 AI 同学 Bobby，不再引入额外可互动学生位。
- **D-02:** 课堂内必须持续同时可见“老师位、顶部学生席、讲台位”三层角色空间，而不是只在某个角色被激活时临时渲染。
- **D-03:** 顶部学生席承担“等待上台”的班级感表达；当前被点名的角色应从席位语义上切到讲台语义，并明确显示“讲台中”。

### 轮转结构与推进方式
- **D-04:** Phase 2 先采用确定性的课堂状态机，而不是依赖实时语音结果驱动流程推进。
- **D-05:** 单个目标项的标准轮转顺序固定为：老师点名引入 -> Bobby 示范/抢答 -> 真实孩子上台作答 -> 老师即时鼓励 -> 奖励反馈 -> 下一项。
- **D-06:** AI 同学的出场价值是给真实孩子留出准备和观察空间，因此应在正式点到孩子前先承担一段短示范，而不是与孩子并行抢占主讲台。
- **D-07:** 当前 Phase 2 的轮转先绑定到 lesson item 维度，每切换一个 item 都完成一整套带班循环，后续 phase 再叠加更复杂的课堂阶段差异。

### 老师带班风格
- **D-08:** 老师是明确的课堂主导者，负责开场引导、点名轮转、过渡提示和正向收束，不能退化成只显示一句提示词的旁白角色。
- **D-09:** 老师面向孩子的课堂话术保持英文优先，界面上的提示状态可以保留中文，用来服务产品可读性与测试可观测性。
- **D-10:** 老师在 Phase 2 只提供轻量、节奏型的话术与正向鼓励，不进入纠错、提示升级或兜底示范分支。

### AI 同学行为原则
- **D-11:** Bobby 应像可信的同龄同学，而不是完美播报器；表现为简短、顺滑、不过度抢戏的示范性回答。
- **D-12:** Bobby 的回答在产品实现上先采用脚本化、安全可预测的行为，不在 Phase 2 引入开放生成或复杂语音人格建模。
- **D-13:** Bobby 的存在主要服务于课堂氛围和真实孩子的心理缓冲，因此他的出场应稳定、可预期，并始终服从老师的点名节奏。

### 反馈与奖励边界
- **D-14:** 孩子完成当前轮次后应立即收到老师正向反馈，并触发一次轻量但明确的奖励状态，用来强化“我刚刚完成了一次上台回答”。
- **D-15:** 这次奖励反馈只表达课堂节奏里的鼓励，不代表严格正确性判定；真正的判断规则留到后续 phase。

### the agent's Discretion
- 单个轮次里每个状态的精确时长、动画曲线和节奏微调
- 老师英文话术的具体措辞变化与文案池组织方式
- Bobby 的轻微犹豫感在视觉或文案层面的具体表达
- 奖励反馈在不同 item 间是否每次都完整播放或进行轻量折叠

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project scope and phase contract
- `.planning/PROJECT.md` — 产品目标、课堂感边界、当前进入 Phase 2 的背景
- `.planning/REQUIREMENTS.md` — Phase 2 对应需求：CLAS-02、CLAS-03、CLAS-04、TEAC-01、AICL-01、AICL-02
- `.planning/ROADMAP.md` — Phase 2「Cast and Orchestration」的目标、成功标准与 02-01/02-02/02-03 计划占位
- `.planning/STATE.md` — 当前项目状态，明确 Phase 02 尚未按 GSD 正式规划
- `.planning/phases/01-classroom-shell/01-CONTEXT.md` — Phase 1 已锁定的课堂壳体、席位关系、老师点名机制与产品边界

### Workflow and guardrails
- `AGENTS.md` — 项目级工作约束，强调课堂感优先、GSD 优先和 MVP 范围边界

### Approved UI references for current shell
- `UI/课堂页.png` — 当前课堂内部沉浸式页面的已确认视觉参照
- `UI/ai_studio_code_课堂页.html` — 当前课堂内部页面的结构与样式参考代码
- `UI/主页.png` — 首页与课堂入口关系的已确认视觉参照，确保 Phase 2 编排不破坏入课体验
- `UI/ai_studio_code_主页.html` — 首页布局与课堂入口状态的参考代码

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/features/classroom-shell/classroom-shell.tsx`：已经承载课堂页主骨架，适合作为 Phase 2 编排状态的顶层容器。
- `src/features/classroom-shell/use-classroom-flow.ts`：已有轻量状态机雏形，可继续拆分为角色轮转、老师话术和 AI 行为的独立模块。
- `src/features/classroom-shell/student-seat-strip.tsx`：已能表达席位与“讲台中”状态，适合继续承接点名和等待语义。
- `src/features/classroom-shell/lesson-board.tsx`：已支持按当前 item 渲染舞台、提示与进度点，可直接接入课堂编排输出。
- `src/features/lesson-config/lesson-schema.ts` 与 `content/lessons/week-01/lesson-01.ts`：已有 item/stage 数据骨架，足以驱动脚本化课堂轮转。

### Established Patterns
- 当前课堂页采用客户端组件 + 本地 hook 状态管理的方式组织交互，而不是引入全局状态容器。
- lesson 内容保持 schema 驱动，课堂流程逻辑放在系统实现层，而不是交给内容配置层随意拼接。
- 测试层已经用 Vitest fake timers 和 Playwright 端到端链路验证课堂节奏，可继续作为 Phase 2 编排的回归护栏。

### Integration Points
- 新的编排能力应优先接入 `ClassroomShell` 与 `useClassroomFlow`，避免另起一套平行课堂状态系统。
- 老师话术、AI 同学出场顺序与奖励反馈都需要回写到 `LessonBoard`、`StudentSeatStrip` 和讲台区三个可见层次。
- Phase 2 的实现需要保持 `/lesson/[sessionId]` 路由稳定，不破坏 Phase 1 已完成的首页进课与奖励态演示链路。

</code_context>

<specifics>
## Specific Ideas

- 课堂内应该持续让孩子感到“我在班里等着被点到”，而不是一个人孤立地刷单题。
- AI 同学的价值不是炫技，而是替孩子承接一小段示范和心理缓冲，让老师点名这件事更像真实班课。
- 当前已确认的沉浸式课堂 UI 可以承载老师带班循环，因此 Phase 2 应优先补课堂节奏，不再回到壳体层面反复改布局。
- 这次 context 采用 discuss workflow 的自动档整理，默认把 Phase 02 的关键灰区全部收束，并沿用用户前面已经确认过的课堂感偏好。

</specifics>

<deferred>
## Deferred Ideas

- 真实语音采集、转写和延迟处理策略 —— 留给后续 Guided Speaking Flow / 技术规划
- 孩子答不上来时的轻提示、二次尝试与老师兜底 —— 属于 Phase 4
- 基于语义的宽松判断与正确性策略 —— 属于 Phase 4/5
- 完整 15 分钟课程编排与跨轮次难度递进 —— 属于 Phase 5

</deferred>

---

*Phase: 02-cast-and-orchestration*
*Context gathered: 2026-04-16*
