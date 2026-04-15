# Roadmap: MyTurn

## Overview

MyTurn v1.0 会从“可配置的课堂外壳”逐步走向“一节可完整体验的 15 分钟英语口语课”，并确保整体感受更像真实线上小班课。路线图会先建立课堂容器与内容模型，再加入老师驱动的课堂编排与 AI 同学存在感，随后补上口语回合、宽松判断与提示策略，最后完成端到端 MVP 打磨。

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Classroom Shell** - 搭建浏览器课堂容器、内容配置结构和基础课堂界面
- [ ] **Phase 2: Cast and Orchestration** - 加入老师带班循环和可信的 AI 同学行为
- [ ] **Phase 3: Guided Speaking Flow** - 建立复述练习、图片驱动流程和实时参与节奏
- [ ] **Phase 4: Hints and Judgment** - 增加轻提示、兜底策略和分阶段作答判断
- [ ] **Phase 5: Complete MVP Lesson** - 交付一节完整可用的 15 分钟网页课堂 MVP

## Phase Details

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
- [ ] 01-01-PLAN.md — 初始化 Next.js 16 / Tailwind v4 / shadcn new-york 工程骨架，并前置所有 Wave 0 测试占位
- [ ] 01-02-PLAN.md — 建立 lesson 与 schedule schema、入场状态 selector、每周课程种子内容与图片资源
- [ ] 01-03-PLAN.md — 实现今日课表入口、共享 UI primitives 与多视口兼容的课表首页
- [ ] 01-04-PLAN.md — 实现课堂三段式场景、课程路由，并激活课堂单测与首页进课 E2E 验证

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
- [ ] 02-01: 建模课堂角色、轮次和状态切换
- [ ] 02-02: 实现老师话术引擎与课堂过渡行为
- [ ] 02-03: 实现 AI 同学的回答行为与出场顺序

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
- [ ] 03-01: 实现复述轮次的口语流程与学生作答捕捉
- [ ] 03-02: 将图片驱动提示整合进课堂循环
- [ ] 03-03: 增加随轮次逐步提高输出要求的推进逻辑

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
- [ ] 04-01: 实现尝试次数跟踪与轻提示行为
- [ ] 04-02: 实现复述模式和看图模式下的不同判断规则
- [ ] 04-03: 增加不破坏课堂感的老师兜底行为

### Phase 5: Complete MVP Lesson
**Goal**: 交付一节经过打磨的 15 分钟课堂，在浏览器中端到端运行，并清晰验证“课堂感”假设。
**Depends on**: Phase 4
**Requirements**: [SPKG-02, PLAT-02]
**Success Criteria** (what must be TRUE):
  1. 孩子可以在网页中从头到尾完成一整节课程，无需跳出当前体验。
  2. 后期轮次会要求孩子基于图片作答，而不只是重复老师示范。
  3. 整体体验应更像一节短课，而不是几段分离的练习拼接。
**Plans**: 2 plans

Plans:
- [ ] 05-01: 将所有课堂状态整合成连续的 15 分钟课程流程
- [ ] 05-02: 打磨节奏、过渡和最终 MVP 验证流程

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Classroom Shell | 0/4 | Not started | - |
| 2. Cast and Orchestration | 0/3 | Not started | - |
| 3. Guided Speaking Flow | 0/3 | Not started | - |
| 4. Hints and Judgment | 0/3 | Not started | - |
| 5. Complete MVP Lesson | 0/2 | Not started | - |
