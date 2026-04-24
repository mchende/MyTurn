# Phase 07: Speech Recognition Wiring - Research

**Researched:** 2026-04-24
**Domain:** 浏览器端儿童课堂语音转写、录音后 transcript 接线、等待/失败课堂化反馈与开发态成功率观测
**Confidence:** MEDIUM-HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

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

### Deferred Ideas (OUT OF SCOPE)
- 更高阶的语义重写、LLM 纠错或 transcript 自动补全
- 面向孩子或家长的显式识别评分/成功率展示
- 整课 15 分钟 pacing 校准、manual UAT 与 full-loop verifier
- 生产级发音评分、逐词纠音或更细粒度口语分析
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ASR-01 | 系统可以把孩子语音转成 transcript，并接入现有的 `submitStudentAttempt` / judgment adapter 链路 | 保留 Phase 6 的 MediaRecorder/CTA runtime，新增 recognition service + transcript adapter，最终统一通过 `submitStudentAttempt({ transcript, source: 'future_asr' })` 入 reducer |
| ASR-02 | `repeat-after-teacher` 环节继续使用更贴近目标词句本身的判断规则 | transcript adapter 只做轻清洗，不改写语义；repeat 继续走现有 lexical close-match judgment |
| ASR-03 | `picture-talk` 环节继续使用更宽松的语义判断规则，而不是退化成关键词死匹配 | picture 阶段只把 transcript 接进既有 `semanticAccepts` judgment，不引入新关键词分支 |
| ASR-04 | 语音识别失败、低置信度或超时的情形会进入清晰的重试或兜底路径，而不是让课堂卡住 | 把 `awaiting_transcript` 扩成显式 recognition wait contract，带 timeout / empty / unavailable / low-confidence failure reasons |
| PLAT-05 | 在常见浏览器环境中，老师/Bobby 播放、孩子录音和转写链路具备可接受的成功率与等待体验 | 识别服务必须可注入、可 mock、可观测；真实浏览器优先走受控 fake recognition 验证，不把真实硬件当自动化 gate |
</phase_requirements>

## Summary

当前代码最值钱的基础不是“已经录到音”，而是已经把课堂在产品层面拆成了稳定的几个合同：Phase 6 的 `classroom-audio-runtime.ts` 已经能稳定表达 `recording_student -> awaiting_transcript`；`use-classroom-audio-runtime.ts` 已经是孩子侧单 CTA 的唯一 owner；`useClassroomOrchestrator.ts` 和 `classroom-orchestrator.ts` 已经暴露了可直接消费 transcript 的 `submitStudentAttempt({ transcript, source })` 路径，而且 `source: 'future_asr'` 已经预留。换句话说，Phase 7 不需要重新设计课堂，它只需要把“谁来产出 transcript”接上去。

**Primary recommendation:** Phase 7 采用“保留现有录音 runtime + 注入式 recognition service + 儿童友好的 transcript adapter + 显式 recognition telemetry”四段式结构。录音仍由 Phase 6 的单 CTA 驱动，stop 后进入 recognition wait；recognition service 负责产出原始 transcript、低置信度/超时/不可用等原因；transcript adapter 在进入 judgment 前只做轻度去噪和抖动收敛；最终仍由 orchestrator 的既有 `submitStudentAttempt` 和 `judgeStudentAttempt` 决定课堂推进。这条路线变更最小，也最符合“不要重做 lesson state machine / runtime 壳层”的约束。

**Implementation bias:** 在没有后端 ASR 服务和额外依赖的前提下，最稳的工程路线是把 recognition 做成可注入 browser adapter。真正执行时，可以以浏览器原生 `SpeechRecognition` / `webkitSpeechRecognition` 作为 MVP provider，但整个应用绝不能把具体 provider 写死在 UI 或 reducer 里。这样即便后续 Phase 8 想切换 provider，课堂 contract 也不需要推倒重来。

## Standard Stack

### Core
| Library / API | Purpose | Why Standard |
|---------------|---------|--------------|
| Existing `MediaRecorder` runtime | 继续承接单 CTA 开始/结束录音、失败兜底和 artifact 生命周期 | Phase 6 已验证，没必要为 transcript 接线重做录音层 |
| Browser speech recognition adapter (`SpeechRecognition` / `webkitSpeechRecognition`) | MVP transcript 来源 | 不新增后端和第三方 SDK 时，浏览器原生 adapter 是最低摩擦的 transcript provider |
| `submitStudentAttempt({ transcript, source })` | transcript 进入既有课堂判断链路的唯一入口 | 当前 reducer 已经围绕该 contract 构建，不应旁路 |
| `classroom-judgment.ts` | repeat / picture 的 stage-aware judgment | 已经稳定，Phase 7 只需要保证 transcript 不被 adapter 过度污染 |

### Supporting
| Library / API | Purpose | When to Use |
|---------------|---------|-------------|
| `classroom-audio-runtime.ts` | recognition wait/timeout/failure reason 的状态 owner | 把 `awaiting_transcript` 从被动状态扩成可观测状态机 |
| `use-classroom-audio-runtime.ts` | 录音 stop 后调用 recognition，再把 transcript 送入 orchestrator | 继续做 shell 和底层 runtime 的桥接层 |
| Vitest + Testing Library | adapter、runtime、repeat/picture wiring 合同 | Phase 7 的主 gate 仍然应以 focused unit 为主 |
| Playwright fake browser helpers | fake recognition / fake mic / fake playback 闭环 smoke | 用受控浏览器环境证明 transcript path，不依赖真硬件 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| 注入式 browser recognition adapter | 直接在 `classroom-shell.tsx` 里 new `webkitSpeechRecognition` | 改动看似更少，但会把 provider 细节、超时处理和 UI 耦合到一起 |
| 沿用既有录音 runtime | 为 transcript 单独起一套“只识别不录音”的新 hook | 会把 Phase 6 的录音 CTA、失败 copy 和课堂节奏重新分叉 |
| transcript adapter 轻清洗 | 进入 judgment 前做强纠错或语义改写 | 看似提高通过率，实则会破坏 repeat/picture 的课堂真实性 |
| dev-only HUD | 面向孩子展示识别成功率 / confidence | 不利于课堂感，也会让 MVP 退化成语音测试工具 |

## Architecture Patterns

### Pattern 1: 识别服务必须作为可注入 adapter，不能直接绑死在 shell
**What:** 新增 `classroom-speech-recognition.ts` 或等价模块，暴露统一 contract，例如 `start()`, `stop()`, `cancel()`, `onResult`, `onError`, `onTimeout`，并允许注入 fake service 供 unit/e2e 使用。

**When to use:** 需要在不改 reducer 的前提下，把 transcript 产出接到课堂里，同时保留浏览器 support variability 的兜底空间。

**Why:** 当前项目已经在 `classroom-audio-runtime.ts` / `classroom-audio-service.ts` 上验证过“adapter 注入优于 UI 直连 browser API”。Recognition 延续这套模式，后面不管继续用 browser-native 还是切 provider，都不会污染 shell 组件。

**Planning guidance:** 执行时至少要抽出这些类型：
- `ClassroomSpeechRecognitionResult`
- `ClassroomSpeechRecognitionFailureReason`
- `ClassroomSpeechRecognitionService`
- `createBrowserSpeechRecognitionService(...)`

### Pattern 2: 保留 MediaRecorder 生命周期，把 recognition 叠加在 stop 后或 stop 时刻
**What:** 继续让孩子通过同一个 CTA `Tap to talk / Listening... tap again / Try again` 控制录音开始和结束；一旦 stop，就由 runtime 进入 recognition wait，而不是把 stop 重新变成“手动确认我说完了”。

**Why:** 这是对 D-01/D-02/D-03 最直接的实现。Phase 6 的 CTA 文案、empty recording、retry UI 都已经有稳定测试，Phase 7 不应该为了 recognition 把这些 contract 打散。

**Inference:** Recognition provider 无论是浏览器原生还是 fake service，都应以 runtime 当前 stop 时刻作为提交边界，而不是绕开 runtime 自己决定一段话什么时候结束。

**Planning guidance:** `use-classroom-audio-runtime.ts` 应继续拥有 stop 行为，但 stop 后需要多一步：
1. 结束录音
2. 进入 `awaiting_transcript`
3. 等待 recognition 结果或 timeout
4. 调用 `submitStudentAttempt`

### Pattern 3: transcript adapter 只能做轻度去噪，不能替孩子“答对”
**What:** 新增 `classroom-transcript-adapter.ts`，在进入 `classroom-judgment.ts` 前只做明确、有界的清洗：
- lower-case / punctuation / whitespace
- 去掉前后独立 filler：`um`, `uh`, `hmm`, `ah`, `er`
- 去掉单词级起句重复：`i i`, `it it`, `a a`, `the the`
- 保留核心词序和词面，不做语义改写

**Why:** 当前 `classroom-judgment.ts` 已经按 `repeat` / `picture` 分开判断，adapter 若过强，会把错误答案润色成正确答案，从而污染真实课堂信号。

**Planning guidance:** adapter 应至少暴露：
- `adaptRecognizedTranscript(raw: string | null | undefined)`
- `buildRecognitionAttemptPayload(...)`
并配套 unit tests 证明“能去噪，但不会把 `banana` 改成 `apple`”。

### Pattern 4: `awaiting_transcript` 需要变成显式 telemetry 状态，而不是短暂黑箱
**What:** 扩展 Phase 6 runtime snapshot，让它在 waiting transcript 时至少暴露：
- `transcriptStatus`
- `transcriptLatencyMs`
- `transcriptFailureReason`
- `lastTranscript`
- `recognitionAttemptCount` 或等价统计字段

**Why:** `PLAT-05` 要的是“可接受的成功率与等待体验”。如果 runtime 只知道自己在 `awaiting_transcript`，却不知道等了多久、为什么失败，就无法解释 Phase 7 是否真的 usable。

**Planning guidance:** telemetry 先以 dev/testing 可见为主，shell 可以在非 production 环境里渲染轻 HUD，但孩子端正式界面只保留课堂化 waiting 文案。

### Pattern 5: 识别等待和失败反馈必须复用现有 podium / teacher status，不新开识别面板
**What:** 识别中阶段用现有 podium status、teacher audio state 或小型 dev HUD 表达，比如：
- `Cora is listening to your answer`
- `One more second...`
- `Let's try that once more`

**Why:** 当前 `classroom-shell.tsx` 已经有老师区和讲台区的轻状态文案，Phase 7 的工作是让它们表达新的 recognition 状态，而不是在课件上方再加一个识别面板。

**Planning guidance:** 如果 shell 需要新增 UI，优先放在：
- `teacher-audio-status`
- `podium-status`
- dev-only recognition HUD
不要占用 `LessonBoard` 主区。

### Pattern 6: e2e 应该 fake 掉 recognition provider，而不是等待真浏览器云识别
**What:** 扩展 `test/e2e/helpers/fake-browser-audio.ts` 或新增 fake recognition helper，让浏览器测试能受控地产出 transcript、timeout、empty result 和 unavailable path。

**Why:** 真浏览器 recognition 支持和网络依赖都波动很大，不适合作为 focused smoke gate。当前 Phase 6 已经用 fake audio 证明了这种策略有效。

**Planning guidance:** 至少覆盖三条浏览器路径：
- preflight pass -> repeat transcript success
- repeat timeout / empty transcript -> retry/fallback
- picture transcript success / failure

## Validation Architecture

Phase 7 最稳的验证切面不是“大而全的整课真语音回归”，而是把验证拆成三层：

1. **Wave 0 unit** — transcript adapter、recognition service contract、runtime timeout/instrumentation
2. **Focused integration/unit** — stop recording -> awaiting transcript -> `submitStudentAttempt({ source: 'future_asr' })` 的 repeat/picture 分阶段路径
3. **Fake browser smoke** — 用受控浏览器 recognition helper 覆盖 preflight -> repeat recognition -> picture recognition 的最小网页闭环

推荐的最小测试集合：
- `test/unit/classroom-transcript-adapter.test.ts`
- `test/unit/classroom-speech-recognition.test.ts`
- `test/unit/classroom-audio-runtime.test.ts`
- `test/unit/classroom-shell.test.tsx`
- `test/unit/classroom-orchestrator.test.ts`
- `test/e2e/audio-classroom-runtime.spec.ts`

Wave 0 的核心目标不是让所有 transcript 都识别成功，而是先证明：
- recognition service 的 start/stop/error contract 稳定
- timeout/empty/unavailable 都会进入明确失败原因
- repeat / picture 都还能走现有 judgment contract

## Anti-Patterns to Avoid

- **把 recognition provider 直接 new 在 `classroom-shell.tsx` 里：** 这会让 UI 组件同时拥有 browser API 生命周期、课堂 copy 和 lesson state 责任。
- **把 transcript adapter 写成“自动纠错器”：** 一旦 adapter 会把 `banana` 改成 `apple`，repeat/picture 的 judgment 结果就不可信了。
- **stop 后立刻乐观调用 `onRecordingAccepted()`：** 这会绕过真实 transcript wait，再次退回 Phase 6 的假通过路径。
- **把 dev HUD 做成常驻孩子界面：** 会损伤课堂感，也违背 D-10 到 D-12。
- **让 picture 阶段为了提高成功率而单独走关键词 shortcut：** 会破坏当前 `semanticAccepts` 语义判断合同。

## Common Pitfalls

### Pitfall 1: recognition timeout 只改 UI，不改 runtime reason
**What goes wrong:** 用户看到“再试一次”，但开发者不知道到底是 timeout、empty transcript 还是 recognition unavailable。
**How to avoid:** timeout/empty/unavailable 都必须在 runtime snapshot 里有明确 failure reason，并进 dev HUD/测试断言。

### Pitfall 2: repeat 成功后直接沿用旧的手动通过路径
**What goes wrong:** 表面上功能通了，但 `source: 'future_asr'` 没有真正进入 reducer，后续无法区分真实 transcript 与兼容性手动 submit。
**How to avoid:** repeat / picture 的真实语音通过都必须明确用 `source: 'future_asr'` 调用 `submitStudentAttempt(...)`。

### Pitfall 3: picture-talk 的 transcript 清洗比 repeat 更激进
**What goes wrong:** picture 阶段会因为 adapter 过强而看起来成功率更高，但课堂判断已经不再可信。
**How to avoid:** adapter 规则统一、轻度、有边界；真正的宽松来自 `semanticAccepts`，不是 adapter 重写。

### Pitfall 4: dev HUD 和正式课堂文案共用一套字段
**What goes wrong:** 开发状态字段会泄露到孩子端，或者为了 HUD 可见性把正式课堂文案做得太技术化。
**How to avoid:** HUD 走独立 dev gate；孩子侧只消费课堂化文案。

## Open Questions

1. **浏览器原生 recognition provider 的支持范围到底锁到哪些浏览器？**
   - What we know: MVP 最适合先做 browser-native adapter，而不是引入后端服务。
   - What's unclear: 真正执行时应以 Chrome-only、Chromium-first 还是 broader browser support 作为主路径。
   - Recommendation: 07-01 先做 provider abstraction，并把 `unavailable` 当作一等 failure path；执行时再用当前目标浏览器实测敲定。

2. **低置信度信号是否能从 provider 稳定拿到？**
   - What we know: `ASR-04` 需要处理 low-confidence / failed / timeout。
   - What's unclear: 不同 browser adapter 能否稳定给出 confidence。
   - Recommendation: 07-01 把 `low_confidence` 作为 optional failure path；若 provider 无 confidence，先以 empty/timeout/unavailable/explicit error 支撑 Phase 7。

3. **是否保留录音 blob 给后续 Phase 8 诊断？**
   - What we know: Phase 6 runtime 已能产出 `lastRecording`.
   - What's unclear: Phase 7 是否要显式在 telemetry 中暴露 blob metadata。
   - Recommendation: 只保留 duration/mimeType 等轻 metadata；不要把录音回放 UI 带进孩子课堂。

## Sources

### Primary (HIGH confidence)
- Workspace inspection:
  - `.planning/PROJECT.md`
  - `.planning/REQUIREMENTS.md`
  - `.planning/ROADMAP.md`
  - `.planning/STATE.md`
  - `.planning/phases/07-speech-recognition-wiring/07-CONTEXT.md`
  - `.planning/phases/06-audio-classroom-runtime/06-RESEARCH.md`
  - `.planning/phases/06-audio-classroom-runtime/06-VALIDATION.md`
  - `AGENTS.md`
  - `src/features/classroom-shell/classroom-audio-runtime.ts`
  - `src/features/classroom-shell/use-classroom-audio-runtime.ts`
  - `src/features/classroom-shell/classroom-orchestrator.ts`
  - `src/features/classroom-shell/use-classroom-orchestrator.ts`
  - `src/features/classroom-shell/classroom-judgment.ts`
  - `src/features/classroom-shell/classroom-shell.tsx`
  - `src/features/classroom-shell/classroom-audio-service.ts`
  - `src/features/lesson-config/lesson-schema.ts`
  - `test/unit/classroom-audio-runtime.test.ts`
  - `test/unit/classroom-shell.test.tsx`
  - `test/unit/classroom-orchestrator.test.ts`
  - `test/e2e/audio-classroom-runtime.spec.ts`
  - `test/e2e/helpers/fake-browser-audio.ts`

### Secondary (MEDIUM confidence)
- Browser speech recognition API behavior and support variability are based on general platform knowledge and should be re-validated during execution with the actual target browser.

### Tertiary (LOW confidence)
- None.

## Metadata

**Confidence breakdown:**
- Repo architecture and integration points: HIGH
- Transcript adapter and runtime instrumentation strategy: HIGH
- Browser-native recognition provider choice and support stability: MEDIUM

**Research date:** 2026-04-24
**Valid until:** 2026-05-24
