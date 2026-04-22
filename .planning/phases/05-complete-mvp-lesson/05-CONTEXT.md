# Phase 5: Complete MVP Lesson - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 5 交付的是一节可以从进入课堂、完成开场、跑完整个口语练习主流程、结课收束、再返回首页的完整网页 MVP lesson。它的任务不是再引入新的口语能力，而是把 Phase 1-4 已经验证过的课堂外壳、老师编排、guided speaking、hint/judgment 和奖励闭环，整合成一节从头到尾都像“真的上完一节短课”的体验。

本阶段同时需要兑现两个剩余 v1 requirement：`SPKG-02` 和 `PLAT-02`。前者要求孩子在后期轮次中根据图片回答老师提问并允许语义相近的表达；后者要求整节课能够在网页里完成，不需要跳出当前体验。本阶段不扩展到真实语音采集/ASR、大规模内容系统、家长端或新的课堂能力类型。

</domain>

<decisions>
## Implementation Decisions

### 整节课节奏编排
- **D-01:** Phase 5 的完整课堂采用四段式结构：`开场热身 -> 复述主段 -> 看图主段 -> 结课收束`，而不是把所有练习揉成一段混合流程。
- **D-02:** 复述主段和看图主段在整节课中的权重保持前后均衡；复述不是匆匆带过，看图也不是只做收尾。
- **D-03:** `开场热身` 采用老师带班开场，先有 greeting、点名感和入课状态，再进入第一题，不直接冷启动到题目本身。
- **D-04:** `结课收束` 由老师口头完成 goodbye / praise / class closing，并把界面带入明确的完成态，让孩子知道这节课真的结束了。

### 后半程看图作答强度
- **D-05:** `picture-talk` 的主要任务形式是“老师基于图片发问，孩子回答”，不走开放式自由描述路线。
- **D-06:** Phase 5 的后半程看图作答仍以低门槛简单问题为主；每张图只问一个简单问题，不在本阶段继续抬高到更开放或更长句的回答要求。
- **D-07:** 如果孩子在后半程连续多题只能靠 fallback 过，课堂也继续自然推进，不降级回前半程复述结构，不临时改成补救型练习器。
- **D-08:** 看图题作答成功后，老师只给很短的课堂式肯定，再立刻切入下一题，保持小班课的推进感而不是每题做显式奖励。

### 结课与完成态
- **D-09:** 强视觉 reward 只在整节课结束时出现一次，不在中途穿插小庆祝。
- **D-10:** reward 之后先停留在课堂页的完成态，让孩子仍然像“刚下课还在教室里”，而不是立刻跳走。
- **D-11:** 完成态大约停留 3 秒后自动跳回首页，形成网页端的完整闭环。

### 首页收口与网页闭环
- **D-12:** 首页需要做响应式重排；在较窄视口下改用更稳的重排布局，保证中部和右侧内容仍可见，而不是继续硬撑当前三栏结构。
- **D-13:** 自动返回首页后，刚上完的这节课需要显示明确的已完成状态，并保留“刚完成一节课”的余温，而不是立刻恢复成无事发生的普通首页。

### the agent's Discretion
- 四段式课堂中每一段的精确时长、切换节拍、teacher timer 和动画停顿
- 开场热身与结课收束的具体英文话术池，以及是否按 session item 数量动态缩放停留时长
- 完成态 3 秒内 reward、老师收束文案、完成卡片和自动跳转之间的具体先后顺序
- 首页响应式重排的具体断点、栏位压缩策略、堆叠顺序和视觉保真度
- 首页“已完成”课卡的具体 copy、图标和状态呈现，只要保持刚完成课程的余温而不引入新的结果页能力

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project scope and phase contract
- `.planning/PROJECT.md` — 产品目标、课堂感边界，以及“像一节课而不是练习器”的总原则
- `.planning/REQUIREMENTS.md` — Phase 5 需要收口的剩余需求：`SPKG-02` 与 `PLAT-02`
- `.planning/ROADMAP.md` — Phase 5「Complete MVP Lesson」的目标、成功标准与 05-01/05-02 计划占位
- `.planning/STATE.md` — 当前项目位置，Phase 4 verified 后进入 Phase 5
- `AGENTS.md` — 项目级守则，要求课堂感优先、图片驱动、英文优先、宽松判断服务于信心与节奏

### Prior phase decisions that remain binding
- `.planning/phases/01-classroom-shell/01-CONTEXT.md` — 首页/课堂空间、课次结构、固定 stage 骨架与网页优先的底层边界
- `.planning/phases/02-cast-and-orchestration/02-CONTEXT.md` — 老师主导带班、Bobby 的边界、沉默处理归老师所有
- `.planning/phases/03-guided-speaking-flow/03-CONTEXT.md` — `repeat-after-teacher -> picture-talk` 的分段推进、单 CTA 和 child-safe surface 约束
- `.planning/phases/03-guided-speaking-flow/03-VERIFICATION.md` — 已通过的 guided speaking baseline，不可在完整 lesson 中打断
- `.planning/phases/04-hints-and-judgment/04-CONTEXT.md` — hint / retry / fallback / final follow 的 Phase 4 约束
- `.planning/phases/04-hints-and-judgment/04-VERIFICATION.md` — 已通过的 fallback close-out、单 CTA、无答案泄露合同

### Existing code contracts
- `src/app/(marketing)/page.tsx` — 首页入口路由，Phase 5 回首页闭环需要保持这里的正常渲染
- `src/features/homepage/homepage-shell.tsx` — 当前首页三栏视觉结构与响应式问题的主要落点
- `src/features/schedule/get-today-schedule-view-model.ts` — 首页 session 状态和课次展示的数据来源
- `src/features/schedule/session-card.tsx` — 已有课次状态 card contract，可作为“已完成状态”表达的参考或复用对象
- `src/app/lesson/[sessionId]/page.tsx` — 课堂页入口、session 状态解析与 lesson route 绑定
- `src/features/classroom-shell/classroom-shell.tsx` — 当前课堂主壳体，Phase 5 的开场、结课、完成态与自动回首页都需要落在这里或其直接依赖层
- `src/features/classroom-shell/use-classroom-orchestrator.ts` — 当前 orchestrator hook，掌握 stage badge、prompt、reward visibility 与课堂推进节奏
- `src/features/classroom-shell/classroom-orchestrator.ts` — 完整 lesson 需要在这里整合开场、主流程、结课与 end-state 事件
- `test/e2e/classroom-entry.spec.ts` — 首页进课与课堂入口 smoke，需要在 Phase 5 继续保持
- `test/e2e/guided-speaking-flow.spec.ts` — 当前 guided flow 与 fallback branch smoke，完整 lesson 不可破坏

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/features/classroom-shell/classroom-shell.tsx`: 已经稳定承载课堂主空间，适合继续扩展开场、结课完成态和自动回首页，而不是重做页面。
- `src/features/classroom-shell/use-classroom-orchestrator.ts`: 已集中管理课堂 timer、stagePrompt、rewardVisible 和 confirm/submit 入口，是整合完整 lesson 节奏的第一落点。
- `src/features/classroom-shell/classroom-orchestrator.ts`: 已具备 reducer-driven phase graph、stage runs、hint/fallback contract，可继续承接“整节课从 warmup 到 wrap-up”的串联。
- `src/features/homepage/homepage-shell.tsx`: 已有 hero card、session timeline 和焦点课次入口，适合在 Phase 5 修复响应式与课后完成态。
- `src/features/schedule/get-today-schedule-view-model.ts`: 已提供 session accessState 和 nextSession 逻辑，可扩展为“刚完成课次”的状态表达。
- `test/e2e/classroom-entry.spec.ts` 与 `test/e2e/guided-speaking-flow.spec.ts`: 已有网页入口与课堂主流程 smoke，可作为 Phase 5 回归门的核心基础。

### Established Patterns
- 当前课堂流继续依赖单一 reducer + hook scheduler，不应为 Phase 5 另起平行页面状态机。
- 孩子侧继续坚持英文优先、图片驱动、单 CTA、child-safe copy；Phase 5 只能整合这些模式，不能推翻。
- Bobby 仍然只在 `repeat-after-teacher` 的 `ai_model` 出现；即便完整 lesson 整合后，这条边界也继续生效。
- 首页与课堂 route 已通过共享 schedule/session 逻辑连接，Phase 5 的网页闭环应复用现有 route / view-model，而不是做新的结果页路由。

### Integration Points
- 完整 lesson 的四段式节奏需要在 `classroom-orchestrator.ts` / `use-classroom-orchestrator.ts` 中增加明确的开场、结课与完成态收口。
- reward、完成态和 3 秒自动回首页将同时影响课堂 reducer、课堂壳 UI、lesson route 以及首页返回后的状态表达。
- 首页响应式修复需要直接处理 `homepage-shell.tsx` 当前 `h-screen + overflow-hidden + fixed three-column` 的布局假设。
- 如果首页要显示“刚完成”的余温状态，planner 需要明确是通过 schedule accessState 扩展、URL/query、还是客户端短时会话状态来表达。

</code_context>

<specifics>
## Specific Ideas

- 这节完整课应该让人感到“真的上完了一节短课”，而不是“把已做好的练习流程串了一遍”。
- 开场要有老师把孩子带进课堂的感觉，结尾也要有老师把孩子送出课堂的感觉。
- 后半程看图作答依然保持低门槛，不为了 Phase 5 强行拔高难度；重点是把完整课堂跑顺。
- 课后回首页时，不应该像刷新后什么都没发生，而应该保留“刚上完这节课”的余温。
- 首页中部和右侧在较窄视口下不能再像“消失了一样”；Phase 5 要把这个网页体验问题一起收口。

</specifics>

<deferred>
## Deferred Ideas

- 更开放或更高难度的 picture-talk 输出要求，例如同图多问、长句回答或开放描述
- 真实语音采集、ASR 转写、实时语义判断与低延迟在线课堂技术方案
- 独立的课后总结页、学习报告页或家长侧结果页
- 多课次连续学习、课程进度体系和更复杂的已完成历史视图

</deferred>

---

*Phase: 05-complete-mvp-lesson*
*Context gathered: 2026-04-22*
