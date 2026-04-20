# Phase 3: Guided Speaking Flow - Context

**Gathered:** 2026-04-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 3 交付的是课堂里的 guided speaking flow：在现有老师带班编排和固定三角色课堂壳体上，把孩子的开口流程正式推进到“老师示范后复述”以及“老师提问后看图回答”两种模式。目标是让孩子不只是坐在班里等轮到自己，而是真的在课堂节奏里完成开口，并且从较低门槛的跟读复述，逐步过渡到基于图片的主动回答。

本阶段不扩展到自动语音触发、语音识别正确性判断、语义匹配、复杂提示升级、或完整 15 分钟课程整合；这些分别属于后续技术规划、Hints and Judgment 与 Complete MVP Lesson。

</domain>

<decisions>
## Implementation Decisions

### 阶段推进结构
- **D-01:** Phase 3 采用“先整轮 `repeat-after-teacher`，再整轮 `picture-talk`”的分段推进，不做每个 item 内反复切换模式的编排。
- **D-02:** 当前 `lesson.stages` 仍然是这轮 guided speaking flow 的主要骨架，Phase 3 优先复用既有 `repeat-after-teacher` 和 `picture-talk` stage，而不是重定义课程层级。

### 输出要求如何逐步变难
- **D-03:** 难度爬坡按 stage 提高要求，而不是在单个 stage 内再拆细层级。
- **D-04:** 在 `repeat-after-teacher` 阶段，孩子可以直接跟读。
- **D-05:** 进入 `picture-talk` 阶段后，老师直接提问，孩子看图回答。

### 复述轮的角色顺序
- **D-06:** `repeat-after-teacher` 阶段里每个 item 固定走 `Teacher model -> Bobby model -> My turn`。
- **D-07:** Bobby 在复述轮中的存在感仍需保留，用来延续“先听别人，再轮到自己”的小班课堂感，而不是在 Phase 3 把 Bobby 降成可有可无。

### 孩子开口回合的推进信号
- **D-08:** Phase 3 先用课堂内“已开口”确认来推进课堂，不在这一期引入自动语音触发。
- **D-09:** 这一版的重点是把 guided speaking flow 跑顺，而不是提前把“是否说对”或“是否被系统听见”变成当前 phase 的门槛。

### `picture-talk` 轮的提问与尝试次数
- **D-10:** `picture-talk` 阶段里，老师采用直接提问方式，例如 `What is it?` 或 `What do you see?`，不先铺很长的观察引导。
- **D-11:** `picture-talk` 阶段中，同一个 item 最多给孩子两次回答机会。
- **D-12:** 第一次没接上时，老师先给一个很轻的口头推动，再问第二次，但不进入提示答案或半提示阶段。
- **D-13:** 如果两次都没接上，再由老师收束并切到下一题，保持课堂节奏不中断。

### 与前置 phase 保持一致的约束
- **D-14:** 面向孩子的主流程继续保持英文优先，不退回中英混合解释型课堂。
- **D-15:** 图片和儿童主视图默认仍不显示目标词句，继续维持“事物 -> 语言”的直接联系。
- **D-16:** Bobby 仍然只承担示范和缓冲作用，不在孩子沉默时救场；孩子沉默后的控场权仍在老师手里。

### the agent's Discretion
- `repeat-after-teacher` 与 `picture-talk` 两个 stage 的精确 item 数量分配与切题节奏
- “已开口确认”在 UI 上的具体呈现方式，是轻量按钮、讲台确认态还是其他不破坏课堂感的交互
- `picture-talk` 阶段中两次尝试之间的等待时长、动画节奏与讲台状态变化
- 老师在直接提问型 picture-talk 里的英文话术池、句长和轮换策略

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project scope and phase contract
- `.planning/PROJECT.md` — 产品目标、课堂感边界、英文优先与“复述 -> 看图回答”的主动输出方向
- `.planning/REQUIREMENTS.md` — Phase 3 对应需求：CONT-03、CONT-04、TEAC-02、SPKG-01
- `.planning/ROADMAP.md` — Phase 3「Guided Speaking Flow」的目标、成功标准与 03-01/03-02/03-03 计划占位
- `.planning/STATE.md` — 当前项目状态、Phase 2 完成后的续接位置
- `AGENTS.md` — 项目级约束，强调课堂感优先、图片驱动理解、英文主流程与 MVP 聚焦

### Prior phase decisions that remain binding
- `.planning/phases/01-classroom-shell/01-CONTEXT.md` — Phase 1 锁定的课堂空间、课程 stage 骨架与课次结构
- `.planning/phases/02-cast-and-orchestration/02-CONTEXT.md` — Phase 2 锁定的老师带班顺序、Bobby 前置示范、沉默处理与默认无 target text 泄露
- `.planning/phases/02-cast-and-orchestration/02-VERIFICATION.md` — Phase 2 已验证的课堂编排合同，避免 Phase 3 规划时破坏已通过能力

### Existing shell and content contracts
- `src/features/lesson-config/lesson-schema.ts` — 现有 `warmup / repeat-after-teacher / picture-talk / wrap-up` stage contract
- `content/lessons/week-01/lesson-01.ts` — 当前 lesson seed 如何在同一批 item 上复用不同 stages
- `src/features/classroom-shell/classroom-orchestrator.ts` — Phase 2 已落地的老师/Bobby/孩子轮转状态机基础
- `src/features/classroom-shell/use-classroom-orchestrator.ts` — 现有课堂编排 hook，Phase 3 应在其上扩展 guided speaking flow 而不是并行重造

### Approved shell references
- `UI/课堂页.png` — 课堂内部页面的已确认视觉参照，Phase 3 交互需在现有壳体内演进
- `UI/ai_studio_code_课堂页.html` — 当前课堂页的结构与样式参考代码

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/features/classroom-shell/classroom-orchestrator.ts`: 已有确定性的老师/Bobby/学生轮转 reducer，可作为 Phase 3 guided speaking flow 的底层推进器。
- `src/features/classroom-shell/use-classroom-orchestrator.ts`: 已把老师话术、Bobby script、讲台 view-model 串起来，适合继续扩展 stage-aware speaking state。
- `src/features/classroom-shell/teacher-script.ts`: 已有 phase -> 英文控场话术映射，Phase 3 可以在此基础上细分复述轮和看图轮的老师提问。
- `src/features/classroom-shell/bobby-script.ts`: 已有 Bobby 的示范 persona 和 hesitation envelope，可直接承接复述轮的 Bobby model。
- `src/features/classroom-shell/lesson-board.tsx`: 已具备图片主屏、stage badge、stage prompt 和 debug-only target text guard。
- `src/features/classroom-shell/classroom-shell.tsx`: 已稳定承载固定三层课堂壳体，Phase 3 应在现有 shell 内注入 speaking flow，不重做布局。

### Established Patterns
- 当前课堂页采用客户端组件 + 本地 hook 状态管理模式，不依赖全局 store。
- 课堂编排逻辑优先放在 reducer / hook 层，而不是散落在页面组件里拼接多个裸定时器。
- lesson 内容继续保持 schema 驱动，系统层负责课堂推进与难度升级，不把教学逻辑下放到内容配置里自由脚本化。
- 儿童主画面默认不显示 target text，这条 child-safe guard 在 Phase 3 仍然必须保留。

### Integration Points
- Phase 3 规划需要明确如何把 `lesson.stages` 接进现有 `useClassroomOrchestrator`，让 stage 与当前 item 两个维度共同决定课堂状态。
- “已开口确认”的推进信号需要连接到当前 orchestrator，而不是另起一条平行课堂流。
- `repeat-after-teacher` 与 `picture-talk` 的老师/Bobby/孩子话术和讲台状态，都会同时影响 `teacher-script.ts`、`bobby-script.ts`、`podium-view-model.ts` 和 `classroom-shell.tsx`。

</code_context>

<specifics>
## Specific Ideas

- 这一阶段最重要的升级不是“更像一个语音产品”，而是“孩子真的开始在一节课里开口了”。
- `repeat-after-teacher` 应该让孩子用最低门槛进入状态：先听老师，再听 Bobby，再自己跟读。
- `picture-talk` 则是明确的下一层要求：老师直接发问，孩子看图自己答，而不是继续机械复述。
- 第二次回答机会应该保留轻微的老师推动，但不要提前进入提示答案或首音提示，以免和 Phase 4 混在一起。

</specifics>

<deferred>
## Deferred Ideas

- 自动语音触发推进与麦克风触发可靠性 —— 延后到后续语音技术规划或更靠后的 phase
- 在 `picture-talk` 第二次机会里使用半提示、首音提示或更强支架 —— 属于 Phase 4 的 hints 范围
- 每个 item 内同时混合“先复述再看图”的复杂爬坡编排 —— 当前 phase 不采用，保留后续评估空间

</deferred>

---

*Phase: 03-guided-speaking-flow*
*Context gathered: 2026-04-20*
