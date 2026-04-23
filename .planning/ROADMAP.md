# Roadmap: MyTurn

## Overview

MyTurn `v1.0` 已经从“可配置的课堂外壳”逐步走到“一节可完整体验的 15 分钟英语口语课”，并完成了课堂原型验证。当前新增的 `v1.1` 将在这个基础上继续推进到“可真实开口使用的完整音频网页课堂 MVP”，优先补齐老师/Bobby 语音输出、浏览器麦克风、语音转写、课堂级音频调度、等待/失败兜底和整节课可用性验证。

## Milestones

- `v1.0`: Classroom Prototype — Complete and verified on 2026-04-22
- `v1.1`: Voice-Enabled Usable MVP — Active milestone

## v1.0 Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Classroom Shell** - 搭建浏览器课堂容器、内容配置结构和基础课堂界面
- [x] **Phase 2: Cast and Orchestration** - 加入老师带班循环和可信的 AI 同学行为
- [x] **Phase 3: Guided Speaking Flow** - 建立复述练习、图片驱动流程和实时参与节奏
- [x] **Phase 4: Hints and Judgment** - 增加轻提示、兜底策略和分阶段作答判断
- [x] **Phase 5: Complete MVP Lesson** - 交付一节完整可用的 15 分钟网页课堂 MVP

## v1.0 Phase Details

### Phase 1: Classroom Shell
**Goal**: 建立网页课堂外壳、课程配置模型以及以平板横屏优先的课堂界面，供后续课堂行为接入。
**Depends on**: Nothing (first phase)
**Requirements**: [CLAS-01, CONT-01, CONT-02, PLAT-01]
**Success Criteria** (what must be TRUE):
  1. 用户可以在浏览器中打开产品，并从课堂感明确的界面启动一节课程。
  2. 课程数据可以配置为 5 个目标项，每个目标项都带有配套图片。
  3. 界面在平板横屏上具备明确课堂感，同时在手机和桌面端也可正常使用。
**Plans**: 4 plans

Plans:
- [x] 01-01-PLAN.md — 初始化 Next.js 16 / Tailwind v4 / shadcn new-york 工程骨架，并前置所有 Wave 0 测试占位
- [x] 01-02-PLAN.md — 建立 lesson 与 schedule schema、入场状态 selector、每周课程种子内容与图片资源
- [x] 01-03-PLAN.md — 实现今日课表入口、共享 UI primitives 与多视口兼容的课表首页
- [x] 01-04-PLAN.md — 实现课堂三段式场景、课程路由，并激活课堂单测与首页进课 E2E 验证

### Phase 2: Cast and Orchestration
**Goal**: 建立老师、AI 同学以及“一次点一个人作答”的课堂编排机制，形成小班课临场感。
**Depends on**: Phase 1
**Requirements**: [CLAS-02, CLAS-03, CLAS-04, TEAC-01, AICL-01, AICL-02]
**Success Criteria** (what must be TRUE):
  1. 每节课都以固定角色组合运行：老师、真实孩子、AI 同学。
  2. 老师可以用示范、过渡和明确点名推动课堂流程。
  3. AI 同学以可信的“同龄同学”方式参与，并在部分轮次中给孩子留出准备空间。
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — 建立 reducer 驱动的课堂编排核心、集中时序常量与 Wave 0 orchestrator 单测
- [x] 02-02-PLAN.md — 实现老师英文话术模块并移除儿童主视图中的目标词句泄露
- [x] 02-03-PLAN.md — 接入 Bobby persona、席位/讲台联动与 Phase 2 的 unit/e2e 回归验证

### Phase 3: Guided Speaking Flow
**Goal**: 让孩子在一节英文优先、图片驱动的课堂中主动参与，并从复述开始进入口语练习。
**Depends on**: Phase 2
**Requirements**: [CONT-03, CONT-04, TEAC-02, SPKG-01]
**Success Criteria** (what must be TRUE):
  1. 早期练习轮次允许孩子跟随老师示范进行复述。
  2. 课堂流程保持英文优先，并以配置好的图片作为主要理解支撑。
  3. 同一内容的重复练习会逐步提高孩子的输出要求，而不是简单重播。
**Plans**: 3 plans

Plans:
- [x] 03-01-PLAN.md — 建立 stage-aware guided queue、手动 participation confirmation 与 Phase 03 reducer/hook 基础合同
- [x] 03-02-PLAN.md — 解决老师 visible/spoken script 冲突，并在保留现有课堂壳的前提下接入 confirmation UI
- [x] 03-03-PLAN.md — 实现 picture-talk 二次机会、board copy 升级与 focused guided-flow 验证
Verification:
- [x] 03-VERIFICATION.md — focused unit + `guided-speaking-flow` / `classroom-entry` smoke 均已通过（2026-04-21）

### Phase 4: Hints and Judgment
**Goal**: 用轻提示、兜底示范和分阶段判断策略维持课堂节奏与开口状态。
**Depends on**: Phase 3
**Requirements**: [TEAC-03, TEAC-04, SPKG-03, SPKG-04, SPKG-05]
**Success Criteria** (what must be TRUE):
  1. 当孩子作答困难时，老师会先给出温和提示，再允许重新尝试，之后才进入兜底。
  2. 复述环节会接受与目标词句较为接近的表达。
  3. 看图作答环节会接受语义等价的回答，让孩子信心高于严格打分模式。
**Plans**: 3 plans

Plans:
- [x] 04-01-PLAN.md — 实现 repeat/picture 轻提示梯度、显式 hint 状态图与单 CTA 护栏
- [x] 04-02-PLAN.md — 实现 judgment adapter、lesson metadata 与 Wave 0 judgment/schema 合同
- [x] 04-03-PLAN.md — 实现 teacher fallback close-out，并补齐 focused unit/e2e 回归门
Verification:
- [x] 04-VERIFICATION.md — focused unit + `guided-speaking-flow` / `classroom-entry` smoke 均已通过（2026-04-21）

### Phase 5: Complete MVP Lesson
**Goal**: 交付一节经过打磨的 15 分钟课堂，在浏览器中端到端运行，并清晰验证“课堂感”假设。
**Depends on**: Phase 4
**Requirements**: [SPKG-02, PLAT-02]
**Success Criteria** (what must be TRUE):
  1. 孩子可以在网页中从头到尾完成一整节课程，无需跳出当前体验。
  2. 后期轮次会要求孩子基于图片作答，而不只是重复老师示范。
  3. 整体体验应更像一节短课，而不是几段分离的练习拼接。
**Plans**: 3 plans

Plans:
- [x] 05-01-PLAN.md — 建立四段式完整 lesson、judged path、中心 pacing 与稳定完成态合同
- [x] 05-02-PLAN.md — 建立首页 recently-completed overlay 合同并完成响应式重排
- [x] 05-03-PLAN.md — 接通 classroom closeout、lesson 自动回首页与 full-loop 网页验证
Verification:
- [x] 05-VERIFICATION.md — focused unit + homepage overlay + full-loop browser closure 均已通过（2026-04-22）

## v1.1 Phases

**Phase Numbering:**
- Integer phases (6, 7, 8): Planned milestone work
- Decimal phases (6.1, 6.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 6: Audio Classroom Runtime** - 建立老师/Bobby 发声、音频预检、麦克风权限与课堂音频运行时
- [ ] **Phase 7: Speech Recognition Wiring** - 接通孩子语音转写到既有判断链路，并处理超时、失败和成功率
- [ ] **Phase 8: Usable 15-Minute Voice Lesson** - 打磨整课节奏、闭环验证和真实可用性门槛

## v1.1 Phase Details

### Phase 6: Audio Classroom Runtime
**Goal**: 让课堂先真正“发声并能听见”，把老师/Bobby 播放、首次音频预检、浏览器麦克风权限、录音反馈和基础失败兜底组织成统一的课堂音频运行时。
**Depends on**: v1.0 classroom prototype
**Requirements**: [AUDIO-01, AUDIO-02, AUDIO-03, VOICE-01, VOICE-02, VOICE-03, CLAS-05, CLAS-07, PLAT-03, PLAT-04]
**Success Criteria** (what must be TRUE):
  1. 老师与 Bobby 在各自允许的环节都能稳定播放语音，并保持既有角色边界。
  2. 用户可以在正式进课前完成轻量的音频预检，并在被点名时进入清晰、单一的说话入口。
  3. 播放、录音和等待之间由统一音频调度控制，平板横屏和中等宽度视口下课堂区域仍完整可见。
**Plans**: 3 plans

Plans:
- [ ] 06-01-PLAN.md — 选定老师/Bobby TTS 与浏览器音频运行时策略，建立播放/录音状态和 contract 测试基线
- [ ] 06-02-PLAN.md — 接入老师/Bobby 发声、首次音频预检与单 CTA 语音入口，并补齐失败/静音兜底 UI
- [ ] 06-03-PLAN.md — 在课堂页完成音频模式响应式回归与 runtime 调度验证，并补 focused unit/e2e 覆盖

### Phase 7: Speech Recognition Wiring
**Goal**: 把孩子语音转成 transcript 并接入既有课堂判断链路，让 repeat 和 picture 两类作答都能真实运行，同时把等待时长和成功率控制在可接受范围。
**Depends on**: Phase 6
**Requirements**: [ASR-01, ASR-02, ASR-03, ASR-04, PLAT-05]
**Success Criteria** (what must be TRUE):
  1. 语音输入会产生可被现有 orchestrator 消费的 transcript，而不是另起一套课堂逻辑。
  2. `repeat-after-teacher` 和 `picture-talk` 分别继续使用既有判断合同，不因语音接入被削弱。
  3. 语音识别超时、失败或低质量输入时，课堂会进入明确的重试或兜底路径，而不会卡死，并能观测到基本成功率和等待体验。
**Plans**: 3 plans

Plans:
- [ ] 07-01-PLAN.md — 建立 transcript adapter、超时/成功率观测点与 Wave 0 识别合同测试
- [ ] 07-02-PLAN.md — 接通 repeat-after-teacher 语音判断链路，并保持 Bobby 角色边界不变
- [ ] 07-03-PLAN.md — 接通 picture-talk 语音判断链路，并补齐失败/超时/成功率回归验证

### Phase 8: Usable 15-Minute Voice Lesson
**Goal**: 让整节课堂在真实音频模式下完成闭环，并用 focused 验证证明这已经是一节可正常使用的 15 分钟小课。
**Depends on**: Phase 7
**Requirements**: [CLAS-06, CLAS-08, CLAS-09, CLAS-10, PLAT-03, PLAT-04, PLAT-05, PLAT-06]
**Success Criteria** (what must be TRUE):
  1. 首页进课、老师/Bobby 发声、课堂语音作答、结课奖励、3 秒停留和回首页余温态能在真实网页流中闭环。
  2. 整节课的播放、等待、转写和重试反馈依然像一节课，并且 pacing 能稳定落在目标 15 分钟区间。
  3. Focused unit / e2e 与人工走查足以证明音频版课堂可正常使用。
**Plans**: 3 plans

Plans:
- [ ] 08-01-PLAN.md — 打磨 listening/transcribing/recognition result 与播放反馈的课堂化反馈和 closeout surface
- [ ] 08-02-PLAN.md — 打通首页到结课回流的完整音频网页闭环，并补 recently-completed 余温态消费
- [ ] 08-03-PLAN.md — 执行 focused unit/e2e + manual UAT，校准 15 分钟节奏并完成 v1.1 verifier 收尾

## Progress

**Execution Order:**
Historical execution: 1 -> 2 -> 3 -> 4 -> 5  
Current milestone execution: 6 -> 7 -> 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Classroom Shell | 4/4 | Complete | 2026-04-15 |
| 2. Cast and Orchestration | 3/3 | Complete | 2026-04-17 |
| 3. Guided Speaking Flow | 3/3 | Complete (verified) | 2026-04-21 |
| 4. Hints and Judgment | 3/3 | Complete (verified) | 2026-04-21 |
| 5. Complete MVP Lesson | 3/3 | Complete (verified) | 2026-04-22 |
| 6. Audio Classroom Runtime | 0/3 | Not started | — |
| 7. Speech Recognition Wiring | 0/3 | Not started | — |
| 8. Usable 15-Minute Voice Lesson | 0/3 | Not started | — |

## Carryover Contracts

以下合同来自 `v1.0`，在 `v1.1` 中默认继续复用，除非后续 phase 明确修改：

- 完整 lesson phase graph：`warmup -> guided main -> wrap_up -> completion_reward -> lesson_complete`
- `LESSON_COMPLETE_HOLD_MS = 3000`
- `useClassroomOrchestrator` 已暴露 `isLessonComplete` 和 `completionHoldMs`
- Bobby 仍只在 `repeat-after-teacher` 的 `ai_model` 出现
- reward 只在结尾出现一次
- 首页 `completedSession` overlay / recently-completed contract 已存在
- 首页与课堂页都应优先保证完整可见或可滚动，而不是依赖固定高度裁切
- 老师与 Bobby 的发声、孩子录音和转写等待必须由统一音频运行时协调

---
*Last updated: 2026-04-23 after expanding v1.1 to full audio classroom MVP*
