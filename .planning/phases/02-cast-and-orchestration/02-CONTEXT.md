# Phase 2: Cast and Orchestration - Context

**Gathered:** 2026-04-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 2 交付的是课堂中的角色关系和带班编排机制：老师如何主导课堂，AI 同学如何先示范，真实孩子如何被点名上台，以及一轮回答结束后课堂如何被收束并推进到下一项。目标是让孩子在网页里感受到真实小班课里的“坐在座位上等着被叫到”“先看别人回答”“轮到自己上台”“老师继续控场”的临场感。

本阶段不扩展到真实语音采集、转写、正确性判断、复杂提示升级或完整 15 分钟课程整合；这些分别属于后续的 Guided Speaking Flow、Hints and Judgment 与 Complete MVP Lesson。

</domain>

<decisions>
## Implementation Decisions

### 角色拓扑与席位表达
- **D-01:** 课堂采用固定三层结构：老师固定区、顶部学生席、下方讲台区长期同时存在，不做简化成单一主舞台的布局。
- **D-02:** 顶部学生席长期保留“我 + Bobby + 空位”的班级结构，用来持续表达“我在班里等着被点到”的感觉。
- **D-03:** 当“我”或 Bobby 被点名上讲台时，顶部原席位不消失，而是原位保留、半透明，并显示“讲台中”标记。

### 轮转结构与推进方式
- **D-04:** 每个目标项都固定走一套确定性的课堂轮转：老师引导 -> Bobby 先示范 -> 真实孩子上台 -> 老师反馈 -> 收束到下一题。
- **D-05:** Bobby 在每个目标项里都固定先示范一次，不采用随机出现、部分出现或后半程逐步减少的策略。
- **D-06:** Bobby 的功能是为真实孩子提供观察和心理缓冲，因此他的出场位置固定在“轮到我之前”，而不是在我沉默时插话救场。

### 老师带班风格
- **D-07:** Cora 采用强引导型老师风格，必须承担开场引导、点名、过渡、鼓励与收束责任，而不是退化成轻提示或节奏播报角色。
- **D-08:** 老师和学生主流程都讲英文，不采用中英混合来解释课堂内容。
- **D-09:** 老师在 Phase 2 的话术重点是带班与控场，不进入复杂纠错、分级反馈或多轮提示分支。

### 语言呈现与图片原则
- **D-10:** 课堂中的图片本身不能出现单词或句子，以保证孩子通过“事物 -> 语言”建立直接联系。
- **D-11:** 儿童主视图中不显示目标单词或句子，不能把目标语言以屏幕文字形式直接给到孩子。
- **D-12:** 目标词句只允许出现在默认关闭的调试开关中，供开发或教师视角查看，不进入正常课堂画面。

### AI 同学行为原则
- **D-13:** Bobby 采用轻微不完美型同学设定，而不是稳定到像完美播报器。
- **D-14:** 这种“不完美”主要体现为轻微停顿/犹豫与更像小朋友的语气，不把“经常说不完整”作为常态。
- **D-15:** Bobby 的示范要可信、顺滑、不过度抢戏，始终服从老师带班和孩子上台的主节奏。

### 老师反馈、沉默处理与奖励边界
- **D-16:** 老师在 Phase 2 中始终负责控场，即使孩子没有跟读正确或较长时间不说话，也要继续鼓励并推进下一环，而不是把课堂卡死在当前题目上。
- **D-17:** 当轮到孩子回答但出现短暂沉默时，处理顺序固定为：短等待 -> 老师用表扬预设型话术鼓励一句 -> 老师带读一遍 -> 如果还是不开口则进入下一环。
- **D-18:** 在上述沉默处理过程中，Bobby 不插话、不接管救场，控场权完全留在老师手里。
- **D-19:** 老师的救场话术风格应为先正向接住孩子，再自然带读，例如类似 “Good job, let's say it together.” 的表扬预设型语气。
- **D-20:** 老师的口头鼓励是常态反馈，不依赖显式正确性判断；只要课堂需要推进，老师都可以先接住并收束。
- **D-21:** 强视觉奖励只在孩子有明显参与时触发，不是每轮机械播放一次。
- **D-22:** 一轮结束后，采用“短反馈 -> 如有明显参与则给小奖励确认 -> 切到下一题”的收束方式，不让 Bobby 再补一句拖慢收束节奏。

### the agent's Discretion
- 老师英文话术池的具体措辞、句长和轮换策略
- Bobby 轻微停顿/犹豫在动效、语气或时间轴上的具体实现
- 短等待、带读、反馈、切题之间的精确时长与动画节奏
- 小奖励确认与强视觉奖励之间的具体分层表现

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project scope and phase contract
- `.planning/PROJECT.md` — 产品目标、课堂感边界、英文优先与图片驱动的核心假设
- `.planning/REQUIREMENTS.md` — Phase 2 对应需求：CLAS-02、CLAS-03、CLAS-04、TEAC-01、AICL-01、AICL-02
- `.planning/ROADMAP.md` — Phase 2「Cast and Orchestration」的目标、成功标准与 02-01/02-02/02-03 计划占位
- `.planning/STATE.md` — 当前项目状态与本次 discuss 完成后的续接位置
- `.planning/phases/01-classroom-shell/01-CONTEXT.md` — Phase 1 已锁定的课堂壳体、老师点名逻辑、席位/讲台关系与产品边界

### Workflow and guardrails
- `AGENTS.md` — 项目级约束，强调课堂感优先、GSD 优先、英文优先和 MVP 聚焦

### Approved UI references for current shell
- `UI/课堂页.png` — 当前课堂内部沉浸式页面的已确认视觉参照
- `UI/ai_studio_code_课堂页.html` — 当前课堂内部页面的结构与样式参考代码
- `UI/主页.png` — 首页与课堂入口关系的已确认视觉参照，确保 Phase 2 编排不破坏入课体验
- `UI/ai_studio_code_主页.html` — 首页布局与课堂入口状态的参考代码

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/features/classroom-shell/classroom-shell.tsx`：已经承载课堂主骨架，适合作为老师带班状态与课堂角色输出的顶层容器。
- `src/features/classroom-shell/use-classroom-flow.ts`：已有轻量轮转 hook，可作为 Phase 2 编排状态机、老师话术和奖励门控的起点。
- `src/features/classroom-shell/student-seat-strip.tsx`：已经能表达席位高亮与“讲台中”标记，适合继续承接固定三层角色关系。
- `src/features/classroom-shell/lesson-board.tsx`：已按当前 item 渲染舞台图片、进度与提示容器，可继续接课堂切题节奏。
- `src/features/lesson-config/lesson-schema.ts` 与 `content/lessons/week-01/lesson-01.ts`：已有 item/stage 数据骨架，足够驱动每个目标项的固定轮转。
- `test/unit/classroom-shell.test.tsx`：已有 fake timers 轮转测试，可扩展为 Phase 2 编排规则的回归护栏。

### Established Patterns
- 当前课堂页采用客户端组件 + 本地 hook 状态管理的模式，不依赖全局状态容器。
- lesson 内容继续保持 schema 驱动，课堂流程逻辑放在系统实现层，而不是交给内容层自行拼脚本。
- 现有课堂页已经具备奖励态与角色区分，Phase 2 更适合在现有结构上增强控场规则，而不是重建页面骨架。

### Integration Points
- Phase 2 规划应优先围绕 `ClassroomShell` 与 `useClassroomFlow` 拆出更清晰的角色编排模块，而不是再造一套平行状态系统。
- 老师话术、沉默处理、奖励门控与切题节奏都需要同时驱动 `LessonBoard`、`StudentSeatStrip` 与讲台区。
- 需要保留 `/lesson/[sessionId]` 的稳定路由和现有首页入课链路，避免 Phase 2 编排破坏 Phase 1 已完成的体验和测试。

</code_context>

<specifics>
## Specific Ideas

- 孩子应该一直感到“自己在班里等着被点到”，而不是孤立地完成一个个单题练习。
- 这一版本里最好的英语启蒙方式是直接建立“事物和语言的联系”，所以图片与儿童主画面里都不要出现目标词句。
- Bobby 不是来救场的；一旦轮到孩子回答后沉默，真正接住现场并继续推进课堂的人必须是老师。
- 老师的救场方式要像真实启蒙课堂：先正向接住孩子，再一起说一遍，然后不拖沓地继续往下走。
- 一轮结束后更像“完成了一次上台”而不是“通关了一道题”，因此奖励要和明显参与挂钩，而不是每轮强制触发。

</specifics>

<deferred>
## Deferred Ideas

- 真实语音采集、转写和延迟处理策略 —— 留给后续 Guided Speaking Flow / 技术规划
- 更复杂的提示升级、重复尝试次数控制和老师兜底策略 —— 属于 Phase 4
- 基于语义的宽松判断与正确性策略 —— 属于 Phase 4/5
- 完整 15 分钟课程编排与跨轮次难度递进 —— 属于 Phase 5

</deferred>

---

*Phase: 02-cast-and-orchestration*
*Context gathered: 2026-04-16*
