# Phase 4: Hints and Judgment - Context

**Gathered:** 2026-04-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 4 交付的是 guided speaking flow 上的“轻提示、再尝试、老师兜底、分阶段判断”能力：当孩子在复述轮或看图轮接不上时，老师要先用温和、课堂化的方式接住，再决定是否重试或兜底；同时系统需要区分 `repeat-after-teacher` 和 `picture-talk` 两种阶段，采用不同的通过标准，而不是继续沿用“只要点击确认就推进”的单一逻辑。

本阶段不扩展到自动语音采集、实时转写、生产级发音评分、完整 15 分钟课程整合或更大内容体系；也不把课堂变成严格的答题器。重点仍然是维持课堂感、信心感和节奏感。

</domain>

<decisions>
## Implementation Decisions

### 复述轮提示与兜底
- **D-01:** 在 `repeat-after-teacher` 中，孩子第一次没接上时，老师的第一层轻提示采用“和孩子一起说一遍”的 very light co-speak，而不是先要求孩子独立再试。
- **D-02:** 如果经过 co-speak 后孩子仍然没有顺利接上，老师应进入完整兜底：先完整示范一次目标词/短句，再邀请孩子最后跟一次，然后结束当前题并继续课堂。
- **D-03:** 复述轮的提示层级应明确区分为“轻提示”和“兜底”，而不是把 co-speak 和最终 fallback 混成一层。

### 看图轮提示节奏
- **D-04:** 在 `picture-talk` 中，孩子第一次没接上时，老师只给观察型提示，把注意力拉回图片本身，不直接给答案结构、首音或句型模板。
- **D-05:** 观察型提示之后，第二次机会仍然保留给孩子独立作答，但老师会把问题缩窄一点再问，而不是简单原题重播。
- **D-06:** `picture-talk` 的轻提示仍然必须保持“课堂推进语”性质，不提前越界到半答案、句型灌输或明显纠错。

### 分阶段判断标准
- **D-07:** `repeat-after-teacher` 的通过标准应是“大致接近目标词/短句”，允许不标准、不完美，但不能退化成“只要开口就算通过”。
- **D-08:** `picture-talk` 的通过标准应是“语义对即可”，不要求和标准答案同词，也不要求贴近预设表述。
- **D-09:** 整个判断体系应服务课堂推进与信心建立，而不是把 Phase 4 实现成严格评分器或儿童可感知的打分系统。

### 看图轮兜底
- **D-10:** 如果 `picture-talk` 在提示和第二次机会之后仍然没接上，老师应直接说出答案以稳住课堂，再邀请孩子跟一句，用最低门槛完成当前题的收束。
- **D-11:** `picture-talk` 的兜底不应只是老师说完就切题；最后那次跟一句仍然是保留孩子开口感的重要部分。

### the agent's Discretion
- 复述轮“co-speak”与“完整示范 + 最后跟一次”之间的精确时长、停顿和动画节奏
- 看图轮观察型提示和缩窄问题的具体英文话术池、轮换方式与 item-category 映射
- 判断结果在 orchestrator 内的具体状态命名、事件拆分和测试组织方式
- 如果未来接入语音输入，本阶段的 judgment contract 如何先以 mock/adapter 形式落地而不破坏当前课堂流

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project scope and phase contract
- `.planning/PROJECT.md` — 产品目标、课堂感边界、英文优先与“信心高于严格打分”的总体原则
- `.planning/REQUIREMENTS.md` — Phase 4 对应需求：TEAC-03、TEAC-04、SPKG-03、SPKG-04、SPKG-05
- `.planning/ROADMAP.md` — Phase 4「Hints and Judgment」的目标、成功标准与 04-01/04-02/04-03 计划占位
- `.planning/STATE.md` — 当前项目位置，Phase 3 verified 后准备进入 Phase 4
- `AGENTS.md` — 项目级约束，要求课堂感优先、图片驱动理解、宽松判断服务于信心和节奏

### Prior phase decisions that remain binding
- `.planning/phases/01-classroom-shell/01-CONTEXT.md` — Phase 1 锁定的课堂壳体、stage 骨架与产品边界
- `.planning/phases/02-cast-and-orchestration/02-CONTEXT.md` — Phase 2 锁定的老师控场、Bobby 不救场、沉默处理归老师所有
- `.planning/phases/03-guided-speaking-flow/03-CONTEXT.md` — Phase 3 锁定的 `repeat-after-teacher -> picture-talk` 结构、单一 participation CTA、child-safe UI 与现有 retry 边界
- `.planning/phases/03-guided-speaking-flow/03-VERIFICATION.md` — Phase 3 已验证的 guided flow 合同，Phase 4 不能破坏已有 repeat/picture progression

### Existing code contracts
- `src/features/classroom-shell/classroom-orchestrator.ts` — 当前 reducer 的阶段流转、attemptIndex、teacher_encourage / teacher_echo 路径与 picture-talk retry 边界
- `src/features/classroom-shell/use-classroom-orchestrator.ts` — 当前单一 timer scheduler、stagePrompt 推导与 classroom shell 公开 contract
- `src/features/classroom-shell/teacher-script.ts` — 现有 `visibleCaption` / `spokenModel` 双通道脚本合同，是 Phase 4 提示层级的主要落点
- `src/features/classroom-shell/podium-view-model.ts` — 当前 podium copy、button label 与 reward/status 呈现逻辑
- `src/features/lesson-config/lesson-schema.ts` — 现有 `warmup / repeat-after-teacher / picture-talk / wrap-up` stage contract，Phase 4 需继续基于该 schema 演进
- `test/unit/classroom-orchestrator.test.ts` — 当前 guided flow、retry 与 progression 回归护栏
- `test/unit/classroom-shell.test.tsx` — 当前 shell 交互、Bobby 限制和 child-safe copy 回归护栏

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/features/classroom-shell/classroom-orchestrator.ts`: 已有统一 reducer、`attemptIndex` 和 `ParticipationState`，适合继续承接提示层级与 judgment outcome。
- `src/features/classroom-shell/teacher-script.ts`: 已经按 stage 区分 `teacher_prompt`、`teacher_encourage`、`teacher_echo` 文案，是 Phase 4 提示/兜底话术的首选落点。
- `src/features/classroom-shell/use-classroom-orchestrator.ts`: 已有单一 `CLASSROOM_TIMINGS` 调度入口，可继续保持课堂状态机集中化。
- `src/features/classroom-shell/podium-view-model.ts`: 已承接 podium status/caption/button copy，适合表达“再试”“老师带读”“兜底收束”等课堂状态。
- `test/unit/classroom-orchestrator.test.ts` 与 `test/unit/classroom-shell.test.tsx`: 已覆盖 Phase 3 的 retry 和 shell 交互，可扩展成 Phase 4 judgment/hint 回归。

### Established Patterns
- 当前课堂推进依赖单一 reducer + hook scheduler，不应把 Phase 4 的提示与判断拆成组件内散落的超时链。
- 现有课堂壳继续坚持 child-safe UI：主视图不直接显示 target text，提示层也不应把答案明文泄露给孩子。
- Bobby 只在 `repeat-after-teacher` 的 `ai_model` 参与；沉默处理、提示和兜底仍然必须由老师拥有。
- 课堂目前通过单一 podium CTA 推进回合；Phase 4 若引入 judgment，也应优先兼容这一交互骨架而非新增复杂表单式 UI。

### Integration Points
- Phase 4 需要在 `classroom-orchestrator.ts` 中显式加入复述轮提示层级、看图轮缩窄提问以及最终兜底分支。
- Judgment contract 很可能需要同时影响 reducer 事件、teacher script 分支、podium/status copy，以及 focused unit/e2e 测试。
- 若实现分阶段通过标准，planner 需要明确“谁提供判断结果”与“如何在当前显式 confirmation 机制里注入判断 outcome”。

</code_context>

<specifics>
## Specific Ideas

- 复述轮里的“轻提示”应该像老师自然地拉着孩子一起开口，而不是像纠音器提示孩子再来一次。
- 看图轮的提示重点是“把注意力拉回图上，再把问题缩窄一点”，而不是偷偷把答案塞给孩子。
- 即使进入兜底，也最好保留最后一句跟读/跟答机会，让孩子保有“这题我仍然开口参与了”的感觉。
- Phase 4 的 judgment 必须让孩子感觉自己仍在上课，而不是被系统评分。

</specifics>

<deferred>
## Deferred Ideas

- 自动语音采集、ASR 转写、语义模型判定与低延迟技术方案 —— 留给后续技术规划或更后面的 phase
- 完整 15 分钟课堂的跨阶段整合、最终收口与端到端 lesson pacing —— 属于 Phase 5
- 大规模内容标签体系或更丰富的语义分类数据结构 —— 超出当前 MVP phase 范围

</deferred>

---

*Phase: 04-hints-and-judgment*
*Context gathered: 2026-04-21*
