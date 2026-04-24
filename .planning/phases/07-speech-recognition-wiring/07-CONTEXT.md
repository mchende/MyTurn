# Phase 7: Speech Recognition Wiring - Context

**Gathered:** 2026-04-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 7 交付的是把孩子的真实语音输入正式接成 `transcript -> submitStudentAttempt -> 既有 judgment` 的课堂链路，并补齐识别等待、超时、失败和基础成功率观测，让 `repeat-after-teacher` 与 `picture-talk` 两类作答都能继续在现有课堂编排里真实运行。

这一阶段不重做 Phase 6 已经建立的音频 runtime、预检入口或自动播报壳层；也不新增新的课堂能力、课后结果页或生产级语音评分器。Phase 7 的重点是“让既有课堂真正能听懂孩子”，而不是重新定义课堂结构。

</domain>

<decisions>
## Implementation Decisions

### 录音结束与送识别时机
- **D-01:** Phase 7 采用纯点按式录音收尾：孩子点击单 CTA 开始说话，再点击同一 CTA 结束录音并送识别。
- **D-02:** 不依赖静音自动收尾作为主路径，优先保持交互确定性，让孩子和课堂都清楚“现在开始说 / 现在说完了”。
- **D-03:** 录音结束后应直接进入 transcript 等待与判断链路，不再回退到手动确认“我说完了”的旧兼容模式。

### Transcript adapter 清洗力度
- **D-04:** Phase 7 的 transcript adapter 采用“儿童友好但不过度改写”的清洗策略。
- **D-05:** 在已有大小写、标点和空格归一化基础上，可以去掉常见口头填充词、起句抖动和明显无意义噪音。
- **D-06:** 不在进入 judgment 前做强改写、重写或语义重构，避免破坏 `repeat-after-teacher` / `picture-talk` 既有判断合同。

### 等待转写节奏与超时
- **D-07:** 识别等待采用中间值课堂节奏：默认等待窗口约 3 到 4 秒。
- **D-08:** 等待期间只显示轻量课堂化 waiting 文案，不引入工具式大遮罩、复杂 loading 面板或打断主课件的层。
- **D-09:** 超时后要进入明确的 retry 或 fallback 路径，避免课堂卡死，也避免无限等待识别结果。

### 成功率与等待体验观测
- **D-10:** Phase 7 需要建立基础成功率与等待体验观测，以满足 `PLAT-05`，但默认不暴露给孩子。
- **D-11:** 观测面采用开发态轻 HUD，只在 dev / testing 环境显示，不进入正式课堂用户界面。
- **D-12:** HUD 应优先承载识别是否成功、等待时长和失败类型等最小指标，而不是扩展成复杂调试面板。

### 前序约束继续生效
- **D-13:** 继续复用 Phase 6 的统一 `classroom audio runtime`，UI 不再直接管理播放/录音生命周期。
- **D-14:** Bobby 仍只在 `repeat-after-teacher` 的 `ai_model` 出现，Phase 7 不改变这条角色边界。
- **D-15:** `repeat-after-teacher` 和 `picture-talk` 继续走现有 judgment contract，不另起一套课堂逻辑。
- **D-16:** 孩子侧继续保持单 CTA、图片驱动、英文优先和轻量课堂化反馈，不新增工具式多按钮或大遮罩。

### the agent's Discretion
- 纯点按式收尾里的按钮文案切换、最长录音上限与浏览器兼容兜底
- transcript adapter 的具体清洗规则表、停用词名单与测试组织方式
- 等待 transcript 时的具体文案、动效和是否复用现有 podium / teacher status surface
- dev HUD 的摆放位置、字段命名与仅开发态暴露的实现方式

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project scope and phase contract
- `.planning/PROJECT.md` — `v1.1` 完整音频课堂 MVP 的目标、课堂感护栏与“复用既有 lesson/judgment skeleton”的原则
- `.planning/REQUIREMENTS.md` — `ASR-01` 到 `ASR-04` 与 `PLAT-05` 的 Phase 7 要求
- `.planning/ROADMAP.md` — `Phase 7: Speech Recognition Wiring` 的目标、成功标准与 07-01/02/03 计划占位
- `.planning/STATE.md` — 当前项目位置、Phase 6 已验证状态与 Phase 7 承接点
- `AGENTS.md` — MyTurn 项目守则：课堂感优先、英文优先、图片驱动、单 CTA 护栏

### Prior phase decisions that remain binding
- `.planning/phases/03-guided-speaking-flow/03-CONTEXT.md` — `repeat-after-teacher -> picture-talk` 分段推进、单 CTA 与 child-safe surface
- `.planning/phases/04-hints-and-judgment/04-CONTEXT.md` — `repeat` / `picture` 分阶段判断、retry / fallback / teacher-led closeout contract
- `.planning/phases/05-complete-mvp-lesson/05-CONTEXT.md` — 完整 lesson graph、reward only once、3 秒完成态与首页回流合同
- `.planning/phases/06-audio-classroom-runtime/06-CONTEXT.md` — 统一 audio runtime、进课 preflight、自动播报与课堂化轻提示约束
- `.planning/phases/06-audio-classroom-runtime/06-VERIFICATION.md` — Phase 6 已验证的 preflight、playback、单 CTA recording runtime 基线

### Existing code contracts
- `src/features/classroom-shell/classroom-audio-runtime.ts` — 当前录音状态、`awaiting_transcript`、重试步骤与错误映射
- `src/features/classroom-shell/use-classroom-audio-runtime.ts` — 自动播报、录音 CTA、preflight 与 `onRecordingAccepted` 挂接点
- `src/features/classroom-shell/use-classroom-orchestrator.ts` — `submitStudentAttempt({ transcript, source })` 和当前兼容性手动 transcript 路径
- `src/features/classroom-shell/classroom-orchestrator.ts` — reducer-driven lesson flow、`StudentAttemptSource`、retry / fallback / teacher echo path
- `src/features/classroom-shell/classroom-judgment.ts` — repeat / picture 的 transcript normalization 与 judgment contract
- `src/features/classroom-shell/classroom-shell.tsx` — teacher/podium shell、轻量状态文案与 side panel 落点
- `test/unit/classroom-audio-runtime.test.ts` — 录音、失败、等待 transcript 状态的 runtime 基线测试
- `test/unit/classroom-judgment.test.ts` — transcript 归一化与 repeat / picture judgment 基线
- `test/unit/classroom-orchestrator.test.ts` — `submitStudentAttempt`、retry / fallback 与课堂节奏回归护栏
- `test/e2e/audio-classroom-runtime.spec.ts` — Phase 6 fake browser audio smoke，可作为 Phase 7 transcript 闭环 smoke 的延伸入口

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/features/classroom-shell/classroom-audio-runtime.ts`: 已经提供 `recording_student -> awaiting_transcript` 状态桥，适合作为 Phase 7 transcript 送检与超时控制的第一落点。
- `src/features/classroom-shell/use-classroom-audio-runtime.ts`: 已集中处理单 CTA 录音交互、播放状态和 preflight，可继续把“录音结束后送识别”留在统一音频 hook 层，而不是散到组件中。
- `src/features/classroom-shell/use-classroom-orchestrator.ts`: 已公开 `submitStudentAttempt({ transcript, source })`，并保留兼容性的 canonical manual transcript，适合逐步切到真实 ASR transcript。
- `src/features/classroom-shell/classroom-orchestrator.ts`: 已有 `source: 'future_asr'` 预留位，且 retry / fallback 路径已稳定，Phase 7 可以直接把 transcript 接入现有 reducer。
- `src/features/classroom-shell/classroom-judgment.ts`: 已把 repeat 与 picture 的判断规则拆开，Phase 7 只需保证 transcript adapter 不破坏这份 contract。
- `src/features/classroom-shell/classroom-shell.tsx`: 已有 teacher/podium 轻量状态显示区，可承接 waiting transcript 文案与 dev HUD，不需要新开页面层。

### Established Patterns
- 课堂流继续依赖单一 reducer + hook scheduler，不应为 ASR 再造一套平行流程。
- 孩子侧继续坚持单 CTA、child-safe copy 和课堂化轻提示；识别等待也必须服从这一模式。
- Phase 6 已验证的 preflight、自动播报、无大遮罩和响应式边界继续生效，Phase 7 不能为了识别态破坏这些布局合同。
- Judgment 仍以 transcript 驱动而不是 waveform/分数驱动，ASR 只是 transcript 来源替换，不是课堂逻辑替换。

### Integration Points
- 录音结束后需要从 `classroom-audio-runtime.ts` / `use-classroom-audio-runtime.ts` 直接进入 transcript adapter，再调用 `submitStudentAttempt({ source: 'future_asr' })`。
- transcript adapter 需要位于 judgment 之前，既能复用 `normalizeStudentTranscript` 思路，也能在不过度改写的前提下处理儿童常见 filler/noise。
- waiting / timeout 既会影响 audio runtime 状态，也会影响 podium / teacher side panel 的课堂反馈文案。
- dev HUD 需要和 existing shell 同屏共存，但只能在开发/测试环境出现，避免污染正式课堂 UI。

</code_context>

<specifics>
## Specific Ideas

- Phase 7 不是再做一个“录音工具”，而是让孩子说完以后，课堂真的能自然地“听懂并继续上课”。
- 纯点按式收尾的关键是把“开始说 / 我说完了”做得足够清楚，避免孩子不知道录音何时真正结束。
- transcript 清洗要帮孩子过滤口头抖动，但不能把错误答案修正成正确答案，否则会破坏课堂真实性。
- 等待 transcript 时更像老师在“等你这句被听清”，而不是像系统在转圈加载。
- 成功率观测需要给开发者足够证据，但不应该变成孩子课堂里的显式技术面板。

</specifics>

<deferred>
## Deferred Ideas

- 更高阶的语义重写、LLM 纠错或 transcript 自动补全 —— 超出当前 MVP Phase 7 范围
- 面向孩子或家长的显式识别评分/成功率展示 —— 留给更后续的产品阶段评估
- 识别链路之外的整课 15 分钟 pacing 校准、manual UAT 与 full-loop verifier —— 属于 Phase 8
- 生产级发音评分、逐词纠音或更细粒度口语分析 —— 不属于当前 milestone 的核心目标

</deferred>

---

*Phase: 07-speech-recognition-wiring*
*Context gathered: 2026-04-24*
