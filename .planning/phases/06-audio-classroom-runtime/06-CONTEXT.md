# Phase 6: Audio Classroom Runtime - Context

**Gathered:** 2026-04-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 6 交付的是完整音频课堂运行时的第一版可用闭环：老师与 Bobby 能稳定发声，孩子可以在课堂里进入真实录音状态，首次进课前有轻量音频预检，播放/录音/等待之间由统一调度控制，并且这些能力在现有课堂壳与响应式布局中成立。

这一阶段不负责把孩子语音真正接入最终 judgment 结果链路，也不扩展新的课堂能力类型。ASR 成功率、转写超时与 repeat/picture 两类语音判断接线属于 Phase 7；整节 15 分钟节奏校准、完整闭环验证与 verifier 收尾属于 Phase 8。

</domain>

<decisions>
## Implementation Decisions

### 音频预检与入课入口
- **D-01:** 首次音频预检放在进课前，采用轻量预检流程，检查扬声器与麦克风是否可用。
- **D-02:** 音频预检允许用户跳过后继续进课，但必须明确提示“跳过后可能影响课堂发声/收音体验”。
- **D-03:** 预检的目标是减少正式开课后才发现“没声音/没录上”的情况，不把首页主路径变成重阻断设置流程。

### 老师与 Bobby 发声方式
- **D-04:** 老师与 Bobby 默认自动播报，不要求孩子额外点击播放。
- **D-05:** 课堂中保留常驻字幕，并提供轻量播放状态提示，帮助孩子理解“现在是谁在说话”，但不允许出现遮挡主课件的大音频遮罩层。
- **D-06:** Bobby 的发声边界继续锁定在 `repeat-after-teacher` 的 `ai_model`，Phase 6 不改变这条角色约束。

### 课堂音频调度
- **D-07:** Phase 6 采用单通道顺序音频调度：先播放老师或 Bobby，再进入孩子录音，再进入等待转写/结果反馈，不允许声音重叠。
- **D-08:** 老师/Bobby 播放未完成前，不能提前打开孩子录音；等待转写时也不再并发触发新的老师/Bobby 播放。
- **D-09:** 音频调度应作为统一的课堂运行时能力实现，而不是分散在多个组件内各自处理。

### MVP 技术取向
- **D-10:** Phase 6 技术路线以“先跑通完整课堂 MVP”为第一优先级，稳定性高于语音自然度极致打磨。
- **D-11:** 老师与 Bobby 先共用一层稳定的 TTS 能力，通过 voice/persona 区分角色，而不是一开始做两套完全不同的语音方案。
- **D-12:** 如果某些更自然但更复杂的音频方案会显著拖慢 Phase 6，应优先选择更稳、更容易验证课堂闭环的方案。

### 孩子录音入口
- **D-13:** 讲台区继续保持单 CTA 交互，不拆成多个工具化按钮。
- **D-14:** 录音入口按课堂状态切换文案，例如“开始说 / 录音中 / 再试一次”，保持儿童可理解与课堂一致性。
- **D-15:** Phase 6 不采用长按说话，也不引入“开始录音/结束录音”双按钮工具式交互。

### 失败兜底与课堂感
- **D-16:** 音频失败采用轻提示 + 单 CTA 重试 + 必要时继续课堂的兜底方式，不使用强阻断错误层作为默认路径。
- **D-17:** 麦克风拒权、未录到声音、播放失败等都应给出明确但柔和的课堂化反馈，不能静默失败。
- **D-18:** 课堂感优先级高于技术细节暴露，错误反馈需要像老师继续带班，而不是像系统故障面板。

### Phase 6 成功标准优先级
- **D-19:** 本阶段首要目标是先证明“老师能说、孩子能录、流程不打架”。
- **D-20:** 语音自然度和更高阶体验可以在后续 phase 继续优化，但不能牺牲当前 runtime 的可用性与可验证性。

### the agent's Discretion
- 老师与 Bobby 的具体 voice 选择、语速、停顿参数与缓存策略
- 轻量预检的具体页面位置、触发时机和视觉样式
- 播放态、录音态、等待态的细节图标、动效与微文案
- 单通道音频运行时的内部状态命名、hook 拆分方式与事件模型
- 失败提示的具体 copy、重试次数与超时时长，只要不违背轻提示、单 CTA 和课堂感原则

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project scope and phase contract
- `.planning/PROJECT.md` — `v1.1` 的完整音频课堂 MVP 目标、课堂感护栏与 Phase 6 的产品边界
- `.planning/REQUIREMENTS.md` — `AUDIO-*`、`VOICE-*`、`CLAS-05/07`、`PLAT-03/04` 等本阶段要求
- `.planning/ROADMAP.md` — `Phase 6: Audio Classroom Runtime` 的目标、成功标准与 06-01/06-02/06-03 计划占位
- `.planning/STATE.md` — 当前 milestone 状态、待决技术风险与 session continuity
- `AGENTS.md` — MyTurn 项目守则：课堂感优先、图片驱动、英文优先、单 CTA 护栏

### Prior phase decisions that remain binding
- `.planning/phases/02-cast-and-orchestration/02-CONTEXT.md` — 老师主导、Bobby 边界与小班编排原则
- `.planning/phases/03-guided-speaking-flow/03-CONTEXT.md` — `repeat-after-teacher -> picture-talk` 分段推进、单 CTA 和 child-safe surface
- `.planning/phases/04-hints-and-judgment/04-CONTEXT.md` — hint / retry / fallback contract，继续约束语音接入后的课堂节奏
- `.planning/phases/05-complete-mvp-lesson/05-CONTEXT.md` — 完整 lesson graph、首页回流、结课 3 秒停留与 recently-completed 合同

### Existing runtime and UI contracts
- `src/features/classroom-shell/use-classroom-orchestrator.ts` — 当前课堂 hook、timer 调度、`submitStudentAttempt` 和 `completionHoldMs` 暴露面
- `src/features/classroom-shell/classroom-orchestrator.ts` — lesson state machine、phase graph 与统一事件入口
- `src/features/classroom-shell/teacher-script.ts` — 老师 spoken/visible script 合同，可直接作为 TTS 输入来源
- `src/features/classroom-shell/bobby-script.ts` — Bobby persona、允许 phase、停顿 envelope 与 spoken line 合同
- `src/features/classroom-shell/classroom-shell.tsx` — 课堂主壳、讲台/老师区布局、回首页逻辑与当前音频 UI 落点
- `src/features/classroom-shell/podium-view-model.ts` — 讲台状态、按钮文案与学生上台 contract
- `src/features/classroom-shell/stage-panel.tsx` — 现有麦克风 icon / stage 提示的可复用视觉入口
- `test/unit/classroom-orchestrator.test.ts` — 现有 state machine、hook timer 和 completion contract 的基线测试
- `test/unit/teacher-script.test.ts` — 老师脚本 contract 的现有断言
- `test/unit/bobby-script.test.ts` — Bobby 角色边界与 spoken line contract 的现有断言

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/features/classroom-shell/use-classroom-orchestrator.ts`: 已有统一 timer 链和 `submitStudentAttempt` 入口，适合作为音频运行时向课堂状态机派发事件的主要挂接点。
- `src/features/classroom-shell/teacher-script.ts`: 已经把老师话术拆成 `spokenModel` 与 `visibleCaption`，非常适合作为 TTS 与字幕的同源 contract。
- `src/features/classroom-shell/bobby-script.ts`: 已有 Bobby 的 persona、允许 phase、停顿 envelope 和 `spokenLine`，适合作为 Bobby 音频播放的直接来源。
- `src/features/classroom-shell/classroom-shell.tsx`: 已有老师区、讲台区、播放态视觉组件和回首页逻辑，可以承接音频预检入口、播放态与录音态展示。
- `src/features/classroom-shell/podium-view-model.ts`: 已经控制讲台按钮和状态文案，适合继续承接单 CTA 的录音中/再试一次 contract。
- `test/unit/classroom-orchestrator.test.ts`: 已覆盖大量 phase/timer 迁移路径，可作为 Phase 6 runtime 调度测试的基础。

### Established Patterns
- 课堂推进仍然以 reducer + hook scheduler 为中心，不能在 Phase 6 旁路出另一套独立音频状态机。
- 孩子侧继续坚持单 CTA、child-safe copy 和课堂感优先，音频 UI 也必须延续这一模式。
- Bobby 只在 `repeat-after-teacher` 的 `ai_model` 出现，这条角色边界在 runtime 设计里必须被硬编码保护。
- 首页回流、奖励和 `lesson_complete` 合同已经稳定，Phase 6 只扩音频 runtime，不碰这些已验证闭环。

### Integration Points
- 音频运行时需要接入 `teacherScriptLine` / `bobbyScriptLine` 的 spoken 字段，并向 `useClassroomOrchestrator` 的阶段迁移提供“播放完成/录音完成/失败重试”事件。
- 讲台区单 CTA 需要从“手动确认参与”过渡到“真实录音入口”，但仍要兼容现有 `submitStudentAttempt` 合同。
- 预检入口会同时影响首页进课前路径、lesson route 首次进入和课堂内音频权限状态呈现。
- Phase 6 的测试需要覆盖 runtime 层与 UI 层：既要断言调度顺序，也要断言讲台/老师区在音频模式下的可见与可用。

</code_context>

<specifics>
## Specific Ideas

- “完整音频课堂版”首先要让孩子感到真的在上一节会发声的小课，而不是看到字幕在自己脑补声音。
- 进课前的音频检查应该像老师开课前简单确认“能听见吗”，而不是变成复杂设置页。
- 老师与 Bobby 默认自动播报，这样孩子才会有被带班的感觉；点击播放更像播放器，不像课堂。
- 这一阶段先把 runtime 跑顺，比追求特别拟真的音色更重要。
- 讲台区继续坚持单 CTA，这条产品约束不因为接语音就退化成工具式多按钮界面。

</specifics>

<deferred>
## Deferred Ideas

- 孩子语音 transcript 与 repeat/picture judgment 的正式接线和成功率优化 —— Phase 7
- 15 分钟整课节奏校准、人工 UAT 与 full-loop verifier —— Phase 8
- 更高级的 TTS 拟人化、情绪化声音设计或角色专属复杂音频链路
- 多个真实孩子同时在线课堂的音频混音与多人轮转

</deferred>

---

*Phase: 06-audio-classroom-runtime*
*Context gathered: 2026-04-23*
