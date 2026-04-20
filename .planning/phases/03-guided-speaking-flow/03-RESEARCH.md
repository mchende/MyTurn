# Phase 03: guided-speaking-flow - Research

**Researched:** 2026-04-20
**Domain:** Stage-driven guided speaking flow on top of the existing classroom orchestrator
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
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

### Claude's Discretion
- `repeat-after-teacher` 与 `picture-talk` 两个 stage 的精确 item 数量分配与切题节奏
- “已开口确认”在 UI 上的具体呈现方式，是轻量按钮、讲台确认态还是其他不破坏课堂感的交互
- `picture-talk` 阶段中两次尝试之间的等待时长、动画节奏与讲台状态变化
- 老师在直接提问型 picture-talk 里的英文话术池、句长和轮换策略

### Deferred Ideas (OUT OF SCOPE)
- 自动语音触发推进与麦克风触发可靠性 —— 延后到后续语音技术规划或更靠后的 phase
- 在 `picture-talk` 第二次机会里使用半提示、首音提示或更强支架 —— 属于 Phase 4 的 hints 范围
- 每个 item 内同时混合“先复述再看图”的复杂爬坡编排 —— 当前 phase 不采用，保留后续评估空间
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONT-03 | 课堂流程以图片作为主要理解线索，而不是依赖中文解释 | 建议保留 `LessonBoard`/`podium` 默认无 target text，只让 `picture-talk` 用英文直接提问，避免文字答案泄露 |
| CONT-04 | 同一节课内容可以支撑多轮重复练习，并逐步提高输出要求 | 建议在现有 reducer 上新增 stage cursor，让同一批 `itemIds` 先跑 `repeat-after-teacher` 再跑 `picture-talk` |
| TEAC-02 | 用户能从老师那里获得温和的等待、鼓励和明确的点名作答提示 | 建议按 stage 细分老师脚本与等待/鼓励分支，并在 `picture-talk` 中明确支持第一次等待后的轻推动再二问 |
| SPKG-01 | 用户可以在前期练习轮次中跟随老师复述目标语言 | 建议保留 Phase 2 的 `teacher -> Bobby -> me` 微循环，并让 `repeat-after-teacher` 的音频脚本显式说出目标语言 |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- 在使用任何文件修改工具前，应通过 GSD 命令启动工作流；本次研究属于 phase workflow 上下文，输出需落到 phase 目录。
- 不要在 GSD 工作流之外直接修改仓库，除非用户明确要求绕过。
- 项目仍以路线图和 phase 文档作为主要架构依据，不应推荐与其冲突的实现。
- 核心产品约束仍是网页端课堂 MVP、固定 15 分钟课堂、1 位老师 + 1 个真实孩子 + 1 个 AI 同学、平板横屏优先、图片驱动口语练习。

## Summary

Phase 03 不需要推翻 Phase 2 的 reducer-driven orchestrator。最稳妥的做法是在现有 `ClassroomOrchestratorPhase` 微流程之上增加一层 stage cursor，让 `lesson.stages` 决定当前处于 `repeat-after-teacher` 还是 `picture-talk`，再由既有 phase 决定这一轮里的老师/Bobby/孩子谁在说、是否等待、是否鼓励、是否收束。这样可以保住 Phase 2 已验证的固定三席位、老师控场、Bobby 不救场、奖励显式门控等合同。

Phase 03 的关键新增不是“识别孩子说了什么”，而是“课堂里何时认定孩子已经开口并继续往下走”。因此最清晰的建模不是 ASR、VAD 或 transcript，而是显式的手动确认信号。建议保留现有 `participationState` 作为 UI 摘要层，并新增一个更窄的 `participationSignal`/`studentTurn` 子状态专门表达“当前是否等待人工确认、是否已确认、确认来源是 manual、这是第几次尝试”。这能清楚隔离 Phase 3 与后续语音技术 phase。

最大的合同变化在脚本层：Phase 2 的测试假设“老师 spokenLine 永远不含 target text”，但 Phase 3 的 `repeat-after-teacher` 明确要求老师和 Bobby 的音频示范要说出目标语言。这里必须收紧“no target-text leakage”的定义为“儿童可见文本界面不泄露答案”，而不是“任何 spoken audio 都不允许包含目标语言”。同时，`picture-talk` 仍要严格保持问题式话术，老师/Bobby/讲台/board 都不能提前报答案。

**Primary recommendation:** 保留现有 phase enum 和 hook 外形，新增 `stageId + stageItemIndex + attemptIndex + manual participation signal` 四个核心维度，用 stage-aware transition table 驱动 `repeat-after-teacher -> picture-talk`。

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.4 | 课堂路由、App Router 页面与客户端课堂组件容器 | 已是仓库运行时；无需为 Phase 03 引入新框架 |
| React | 19.2.5 | `useReducer` + `useEffect` 驱动课堂本地状态机 | 现有 orchestrator 已采用 reducer，本 phase 延续同一模式最稳 |
| TypeScript | 6.0.2 | 明确 stage/phase/event 联合类型，避免课堂状态分支漂移 | 当前仓库已全面使用 TS，适合约束 reducer 事件图 |
| Zod | 4.3.6 | 继续校验 `lesson.stages` 与 lesson seed 合同 | 现有 lesson schema 已使用 Zod，Phase 03 只需在消费侧变强 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Framer Motion | 12.38.0 | 延续课堂席位/讲台动效，不改变整体视觉系统 | 仅在讲台确认态或 stage 切换需要强化反馈时使用 |
| Vitest | 4.1.4 | reducer、script、view-model 单元回归 | 每次改 state graph、script matrix、timings 时必跑 |
| @testing-library/react | 16.3.2 | `ClassroomShell`、`LessonBoard` 的用户视角断言 | 验证无文字泄露、席位变化、确认控件显隐 |
| @playwright/test | 1.59.1 | lesson 入口和 guided flow smoke | 至少保住首页进课 + Guided Speaking 关键可见路径 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| 继续使用本地 reducer/hook | XState | 状态建模更显式，但会在本 phase 平添依赖和迁移成本，且当前状态图规模仍可控 |
| 手动“已开口确认”事件 | Web Speech API / VAD 自动触发 | 与 D-08/D-09 冲突，浏览器稳定性和延迟处理也不在本 phase 范围内 |
| `lesson.stages` 驱动 stage progression | 在 orchestrator 里硬编码两个 speaking mode | 会绕开现有 lesson contract，后续内容配置与 roadmap 都会被削弱 |

**Installation:**
```bash
npm install
```

**Version verification:** 已通过 `npm view` 核对当前推荐版本与发布日期。
- `next@16.2.4` — published 2026-04-15
- `react@19.2.5` — published 2026-04-08
- `zod@4.3.6` — published 2026-01-22
- `framer-motion@12.38.0` — published 2026-03-17
- `vitest@4.1.4` — published 2026-04-09
- `@testing-library/react@16.3.2` — published 2026-01-19
- `@playwright/test@1.59.1` — published 2026-04-01

## Architecture Patterns

### Recommended Project Structure
```text
src/
├── features/
│   ├── classroom-shell/
│   │   ├── classroom-orchestrator.ts        # stage-aware reducer and transition table
│   │   ├── use-classroom-orchestrator.ts    # timers + public dispatch API
│   │   ├── teacher-script.ts                # stage/phase/attempt-aware teacher lines
│   │   ├── bobby-script.ts                  # repeat-stage-only Bobby demo lines
│   │   ├── podium-view-model.ts             # stage copy, confirmation state, status labels
│   │   ├── classroom-shell.tsx              # shell UI + explicit participation confirm affordance
│   │   └── lesson-board.tsx                 # image-first prompt surface, still no target text
│   └── lesson-config/
│       ├── lesson-schema.ts                 # fixed stage contract
│       └── load-lesson.ts                   # schema-safe lesson loading
├── content/
│   └── lessons/...                          # stage itemIds remain lesson-owned
└── test/
    ├── unit/                               # reducer/script/shell guardrails
    └── e2e/                                # classroom smoke
```

### Pattern 1: Add a stage cursor above the existing micro-phase graph
**What:** 保留 `teacher_prompt / ai_model / student_wait / ...` 这组已验证的微相位，新增 `activeStageId`, `activeStageIndex`, `stageItemIndex`, `attemptIndex`。当前 item 必须从 `lesson.stages[activeStageIndex].itemIds[stageItemIndex]` 解析，而不是继续默认 `lesson.items[currentItemIndex]`。
**When to use:** 当同一批 item 需要先跑复述轮，再跑看图回答轮，而且每轮内部仍沿用老师控场节奏时。
**Example:**
```typescript
// Source: local contracts `lesson-schema.ts` + `classroom-orchestrator.ts`
type GuidedStageId = 'repeat-after-teacher' | 'picture-talk';

type GuidedState = ClassroomOrchestratorState & {
  activeStageId: GuidedStageId;
  activeStageIndex: number;
  stageItemIndex: number;
  attemptIndex: 1 | 2;
};

function resolveCurrentItem(lesson: Lesson, stage: LessonStage, stageItemIndex: number) {
  const itemId = stage.itemIds[stageItemIndex];
  const item = lesson.items.find((candidate) => candidate.id === itemId);

  if (!item) {
    throw new Error(`Missing lesson item for stage item id: ${itemId}`);
  }

  return item;
}
```

### Pattern 2: Keep manual participation confirmation explicit and separate from correctness
**What:** 新增一个只表达“是否已被老师/课堂确认开口”的状态对象，而不是把 ASR、正确性、语义匹配混进 reducer。建议 public API 新增 `confirmStudentParticipation()`，并保留 `markStudentSpoke()` 作为兼容别名。
**When to use:** Phase 03 仅需要课堂推进信号、不需要判断孩子是否说对时。
**Example:**
```typescript
// Source: local contracts `classroom-orchestrator.ts` + Phase 03 decisions D-08/D-09
type ParticipationSignal = {
  awaitingManualConfirmation: boolean;
  confirmedAttempt: 1 | 2 | null;
  source: 'manual' | null;
};

type ClassroomOrchestratorEvent =
  | { type: 'student_participation_confirmed'; source: 'manual' }
  | { type: 'student_attempt_timed_out' }
  | { type: 'phase_timer_completed' };

function markStudentSpoke() {
  dispatch({ type: 'student_participation_confirmed', source: 'manual' });
}
```

### Pattern 3: Make scripts stage-aware, not globally target-free
**What:** `teacher-script.ts` 和 `bobby-script.ts` 需要同时接受 `stageId` 与 `phase`。`repeat-after-teacher` 的 spoken audio 可以包含目标词句；`picture-talk` 的 spoken audio 仍必须保持提问式，不泄露答案。`hintLabel`, `stagePrompt`, `podiumStatus` 继续默认无答案文本。
**When to use:** 当同一个 `teacher_prompt` 在不同 stage 中语义不同，且 no-leakage 规则只适用于可见文本或 `picture-talk` 提问时。
**Example:**
```typescript
// Source: local contracts `teacher-script.ts` + Phase 03 decisions D-04/D-05/D-15
function getTeacherScriptLine({
  stageId,
  phase,
  attemptIndex,
  targetText,
}: {
  stageId: 'repeat-after-teacher' | 'picture-talk';
  phase: ClassroomOrchestratorPhase;
  attemptIndex: number;
  targetText: string;
}) {
  if (stageId === 'repeat-after-teacher' && phase === 'teacher_prompt') {
    return {
      hintLabel: 'Listen and repeat',
      spokenLine: `Listen: ${targetText}.`,
    };
  }

  if (stageId === 'picture-talk' && phase === 'teacher_prompt') {
    return {
      hintLabel: 'Look and answer',
      spokenLine: 'What is it?',
    };
  }

  if (stageId === 'picture-talk' && phase === 'teacher_encourage' && attemptIndex === 1) {
    return {
      hintLabel: 'One more try',
      spokenLine: 'Try again. What is it?',
    };
  }

  return { hintLabel: 'Stay with me', spokenLine: 'Keep going.' };
}
```

### Pattern 4: Stage-specific transition table, additive not replacement
**What:** `advanceTimedPhase()` 不应再是单一线性链，而应按 `activeStageId` 选择下一步。`repeat-after-teacher` 保留 `teacher_prompt -> ai_model -> student_wait`；`picture-talk` 跳过 `ai_model`，直接 `teacher_prompt -> student_wait`，并在第一次 timeout 后回到第二次 `student_wait`。
**When to use:** 当两个 speaking stage 共用同一个 reducer，但内部顺序不完全相同时。

### Anti-Patterns to Avoid
- **把 `lesson.stages` 当装饰字段：** 如果仍按 `lesson.items[currentItemIndex]` 线性推进，就无法真正实现 `repeat-after-teacher -> picture-talk` 的 stage-driven 难度升级。
- **把 `student_spoke` 升级成“识别到说话”:** 这会把本 phase 拖进麦克风权限、噪声、延迟与误判问题。
- **继续假设所有 spoken copy 都不能含目标词：** 这会直接阻断 SPKG-01 的复述轮。
- **让 Bobby 进入 `picture-talk` 救场：** 这违反 D-16，也会冲淡老师控场。
- **把第二次机会做成提示答案：** 这会提前吃掉 Phase 4 的提示空间。

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Guided stage progression | 一套绕过 `lesson.stages` 的自定义脚本 DSL | 继续使用 `lesson.stages` + reducer selector | 现有 lesson contract 已足够表达 speaking stages；新 DSL 只会增加内容复杂度 |
| Child participation signal | 自动语音触发/VAD/ASR 预判层 | 手动确认事件 `student_participation_confirmed` | 本 phase 只需要“推进课堂”，不需要“听懂课堂” |
| Transition timing | 组件内散落的多条 `setTimeout` 链 | 继续集中在 `CLASSROOM_TIMINGS` + reducer events | 已有测试就是围绕集中式 timers 写的，易回归 |
| No-leakage guard | 自定义多处隐藏答案开关 | 延续 `LessonBoard` 的 debug-only target text guard | 现有 guard 已验证有效，Phase 03 只需扩到脚本规则和 shell 断言 |

**Key insight:** 这一 phase 的复杂度来自“课堂推进规则”，不是“底层基础设施缺失”。最便宜也最稳的方案是强化现有 reducer 合同，而不是引入新状态机库、语音栈或内容 DSL。

## Common Pitfalls

### Pitfall 1: Stage 和 item 游标脱节
**What goes wrong:** 代码看似新增了 `stageId`，但 `currentItem` 仍按 `lesson.items[currentItemIndex]` 取值，导致 stage 切换后 item 顺序、进度 badge、wrap 判定全部错位。
**Why it happens:** 当前 `createInitialClassroomState()` 和 `moveToNextItem()` 都只认识线性 `lesson.items`。
**How to avoid:** 明确拆成 `activeStageIndex + stageItemIndex` 两个游标，并通过 `stage.itemIds` 解析当前 item。
**Warning signs:** `picture-talk` 进入后仍显示“第 1/5 轮”但实际已经错到别的 item；最后一题后没有进入下一 stage。

### Pitfall 2: 为兼容 Phase 2 而不敢修改脚本泄露规则
**What goes wrong:** 因为已有测试断言 `spokenLine` 不包含 target text，于是实现者把 `repeat-after-teacher` 也写成 “Listen first” 这类无目标词话术，孩子根本无从复述。
**Why it happens:** 把“no target-text leakage”误解成“所有输出通道都不能出现目标词”。
**How to avoid:** 明确区分 audio modeling 与 visual leakage；只让 `LessonBoard`/`hintLabel`/`podiumStatus` 默认无答案文本。
**Warning signs:** `SPKG-01` 能力在 UI 上看起来存在，但老师实际没有示范目标语言。

### Pitfall 3: 把“已开口确认”混成“说对了”
**What goes wrong:** `student_participation_confirmed` 事件一上来就带 transcript、score 或 semantic match，Reducer 分支迅速膨胀。
**Why it happens:** 过早把 Phase 4/5 的判断逻辑拉进来。
**How to avoid:** Phase 03 只记录 `source: 'manual'` 和确认发生在哪次尝试，正确性留给后续 phase。
**Warning signs:** event type 开始出现 `confidence`, `transcript`, `score`, `matchedText` 等字段。

### Pitfall 4: `picture-talk` 第二次机会变成答案提示
**What goes wrong:** 第二次机会直接说出答案、首音或半句，课堂确实推进了，但已经偷跑到 hints phase。
**Why it happens:** 想快速提升通过率，却没有守住 phase boundary。
**How to avoid:** 第一次 timeout 后只能轻推并再问一次，例如 “Try again. What is it?”，不能泄露目标内容。
**Warning signs:** `teacher_encourage` 或 `teacher_feedback` 出现 target text，或 Bobby 在 `picture-talk` 出声。

### Pitfall 5: 为 picture-talk 新增独立平行 flow
**What goes wrong:** `repeat-after-teacher` 继续用 orchestrator，`picture-talk` 单独写一套 hook/定时器，最终 `ClassroomShell` 里出现两套状态源。
**Why it happens:** 觉得 picture-talk 跳过 Bobby、支持二次尝试，看起来跟原 flow 差别太大。
**How to avoid:** 仍用同一个 reducer，只让 transition table 按 stage 分支。
**Warning signs:** shell 组件开始用多个 `useState`/`useEffect` 协调 speaking flow。

## Code Examples

Verified patterns from repo contracts and official sources:

### Stage-aware item resolution without changing lesson schema
```typescript
// Source: local `src/features/lesson-config/lesson-schema.ts`
function getSupportedSpeakingStages(lesson: Lesson) {
  return lesson.stages.filter(
    (stage): stage is LessonStage & { id: 'repeat-after-teacher' | 'picture-talk' } =>
      stage.id === 'repeat-after-teacher' || stage.id === 'picture-talk',
  );
}

function getStageItem(lesson: Lesson, stageIndex: number, stageItemIndex: number) {
  const stage = getSupportedSpeakingStages(lesson)[stageIndex];
  const itemId = stage.itemIds[stageItemIndex];
  const item = lesson.items.find((candidate) => candidate.id === itemId);

  if (!item) {
    throw new Error(`Unknown lesson item id: ${itemId}`);
  }

  return { stage, item };
}
```

### Reducer branch that preserves Phase 2 micro-phases
```typescript
// Source: local `src/features/classroom-shell/classroom-orchestrator.ts`
function advanceTimedPhase(state: GuidedState): GuidedState {
  if (state.activeStageId === 'repeat-after-teacher') {
    // teacher model -> Bobby model -> my turn
  }

  if (state.activeStageId === 'picture-talk') {
    // teacher question -> my turn -> teacher encourage -> my turn (2nd chance)
  }

  return state;
}
```

### Manual confirmation remains an action, not a sensor
```typescript
// Source: React `useReducer` docs + local `use-classroom-orchestrator.ts`
const [state, dispatch] = useReducer(classroomOrchestratorReducer, lesson, createInitialClassroomState);

function confirmStudentParticipation() {
  dispatch({ type: 'student_participation_confirmed', source: 'manual' });
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| 单一 item 线性循环 | stage-aware item loop with per-stage transition rules | Phase 03 planning, 2026-04 | 同一内容可以先复述再看图回答 |
| `student_spoke` 作为通用二值事件 | manual participation confirmation + attempt-aware state | Phase 03 planning, 2026-04 | 明确与自动语音触发/正确性判断解耦 |
| 所有 teacher spoken copy 都避开 target text | 仅视觉文案和 `picture-talk` 问句禁止泄露；`repeat-after-teacher` 音频允许示范目标语言 | Phase 03 planning, 2026-04 | 才能真正满足 SPKG-01 |

**Deprecated/outdated:**
- 仅靠 `currentItemIndex` 推进课堂：对 Phase 3 的 stage progression 已不够用。
- “Bobby 只要能说就都说”：在 `picture-talk` 救场不再允许。
- “老师鼓励 = echo target text”：在 `picture-talk` 第二次机会里不成立。

## Open Questions

1. **“已开口确认”按钮应该放在哪里最不破坏课堂感？**
   - What we know: 必须是显式人工确认，且不应让孩子以为在按答题按钮。
   - What's unclear: 最终是教师/家长辅助按钮、讲台确认态，还是只在 debug/ops 模式下可见。
   - Recommendation: 规划时按“轻量讲台确认控件”处理，UI 文案避免使用“提交/正确”。

2. **Warmup / wrap-up 是否需要在 Phase 03 同步纳入 reducer？**
   - What we know: lesson schema 里已有 `warmup` 与 `wrap-up`，但 Phase 03 需求和 context 只锁定两个 speaking stages。
   - What's unclear: 是否要在本 phase 中渲染 warmup/wrap-up 的真实课堂行为。
   - Recommendation: 本 phase 只消费 `repeat-after-teacher` 与 `picture-talk` 两个 supported speaking stages，warmup/wrap-up 延后。

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next/Vitest/Playwright runtime | ✓ | v22.14.0 | — |
| npm | package scripts / `npm view` / local runner | ✓ | 11.12.1 | — |
| Playwright CLI | E2E smoke validation | ✓ | 1.59.1 | — |
| Google Chrome | Current Playwright config uses `channel: 'chrome'` | ✓ | installed at `C:\Program Files\Google\Chrome\Application\chrome.exe` | If unavailable later, switch config to bundled Chromium |

**Missing dependencies with no fallback:**
- None.

**Missing dependencies with fallback:**
- None in the current environment.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.4 + React Testing Library 16.3.2 + Playwright 1.59.1 |
| Config file | `vitest.config.ts`, `playwright.config.ts` |
| Quick run command | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx test/unit/teacher-script.test.ts test/unit/bobby-script.test.ts test/unit/lesson-board.test.tsx` |
| Full suite command | `npm run test:unit && npm run test:e2e` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONT-03 | `picture-talk` 和 board/podium 继续以图片和英文问题驱动，不显示目标词句 | unit + e2e | `npm run test:unit -- test/unit/lesson-board.test.tsx test/unit/teacher-script.test.ts test/unit/classroom-shell.test.tsx` | ✅ |
| CONT-04 | 同一批 item 先跑 `repeat-after-teacher` 再跑 `picture-talk`，stage 切换后输出要求升高 | unit | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx` | ✅ |
| TEAC-02 | 老师在两种 stage 中都能给出明确点名、温和等待和第一次失败后的轻推动 | unit | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/teacher-script.test.ts test/unit/classroom-shell.test.tsx` | ✅ |
| SPKG-01 | `repeat-after-teacher` 固定走 `Teacher model -> Bobby model -> My turn`，手动确认开口后推进 | unit | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/bobby-script.test.ts test/unit/teacher-script.test.ts` | ✅ |

### Focused Tests for Phase 03
- Extend `test/unit/classroom-orchestrator.test.ts` to cover stage traversal, `picture-talk` second-attempt loop, and final transition from last repeat item into first picture-talk item.
- Extend `test/unit/teacher-script.test.ts` to assert `repeat-after-teacher` spoken audio may include target text, while `picture-talk` spoken and visual copy stay target-free.
- Extend `test/unit/bobby-script.test.ts` to assert Bobby only models in `repeat-after-teacher` and remains absent from `picture-talk`.
- Extend `test/unit/classroom-shell.test.tsx` to assert stage badge/prompt/confirm affordance switch correctly and no target text appears on the child-facing board.
- Extend `test/e2e/classroom-entry.spec.ts` or add one guided-flow smoke to assert the lesson visibly moves from repeat flow into picture-talk flow.

### Sampling Rate
- **Per task commit:** `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx test/unit/teacher-script.test.ts test/unit/bobby-script.test.ts test/unit/lesson-board.test.tsx`
- **Per wave merge:** `npm run test:unit && npm run test:e2e -- test/e2e/classroom-entry.spec.ts`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- None — existing test infrastructure, config files, fake-timer setup, and Playwright web-server wiring are already in place from Phases 1-2.

## Plan Decomposition

### Recommended execution waves
| Plan | Focus | Requirements | Output |
|------|-------|--------------|--------|
| 03-01 | 在现有 orchestrator 上接入 stage cursor、stage item resolution、manual participation signal | CONT-04, SPKG-01 | state/event contract 成型，仍保持 Phase 2 外部 API 基本稳定 |
| 03-02 | 重写 teacher/Bobby/podium/board 的 stage-aware copy 和 child-safe no-leakage rules | CONT-03, TEAC-02, SPKG-01 | repeat-after-teacher 与 picture-talk 的课堂语义清晰可见 |
| 03-03 | 实现 `picture-talk` 的二次尝试推进、repeat -> picture stage progression、focused validation | CONT-03, CONT-04, TEAC-02 | 整个 guided speaking flow 连续可跑，验证护栏齐全 |

### Wave details

#### Wave 1: State graph first
- 增加 `activeStageId`, `activeStageIndex`, `stageItemIndex`, `attemptIndex`, `participationSignal`。
- 将 `currentItem` 解析切换为 `lesson.stages[*].itemIds[*]` 驱动。
- 保留 `markStudentSpoke()` 兼容入口，内部映射到 manual confirmation event。
- 先做 reducer/hook 单测，确保 Phase 2 的核心链路不回退。

#### Wave 2: Script and UI semantics
- `teacher-script.ts` 支持 stage-aware 话术矩阵，明确 `repeat-after-teacher` 可说 target、`picture-talk` 不可泄露答案。
- `bobby-script.ts` 仅在 `repeat-after-teacher` 的 `ai_model` 有内容。
- `podium-view-model.ts` 和 `LessonBoard` 暴露 stage-aware prompt/status，但仍不显示目标词句。
- `ClassroomShell` 接入轻量“已开口确认”交互，不改变三层课堂壳体。

#### Wave 3: Progression and validation
- 实现 `picture-talk` 第一次等待失败 -> 老师轻推动 -> 第二次等待 -> 收束切题。
- 实现 repeat 阶段结束后进入 picture stage，最后一项后再进入 wrap。
- 跑 focused unit 回归和 classroom-entry smoke，补齐 guided flow 断言。

## Sources

### Primary (HIGH confidence)
- Local project contracts:
  - `.planning/phases/03-guided-speaking-flow/03-CONTEXT.md`
  - `.planning/phases/02-cast-and-orchestration/02-VERIFICATION.md`
  - `.planning/REQUIREMENTS.md`
  - `.planning/ROADMAP.md`
  - `src/features/classroom-shell/classroom-orchestrator.ts`
  - `src/features/classroom-shell/use-classroom-orchestrator.ts`
  - `src/features/classroom-shell/teacher-script.ts`
  - `src/features/classroom-shell/bobby-script.ts`
  - `src/features/classroom-shell/podium-view-model.ts`
  - `src/features/classroom-shell/lesson-board.tsx`
  - `test/unit/classroom-orchestrator.test.ts`
  - `test/unit/classroom-shell.test.tsx`
  - `test/unit/teacher-script.test.ts`
  - `test/unit/bobby-script.test.ts`
- React official docs: https://react.dev/reference/react/useReducer
- Playwright official docs: https://playwright.dev/docs/test-webserver
- Vitest official docs: https://vitest.dev/guide/mocking/timers
- React Testing Library official docs: https://testing-library.com/docs/react-testing-library/intro/
- npm registry verification via local commands:
  - `npm view next version`
  - `npm view react version`
  - `npm view zod version`
  - `npm view framer-motion version`
  - `npm view vitest version`
  - `npm view @testing-library/react version`
  - `npm view @playwright/test version`

### Secondary (MEDIUM confidence)
- None needed; repo contracts and official docs were sufficient.

### Tertiary (LOW confidence)
- None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - current repo stack is explicit in `package.json`, and versions were verified against npm.
- Architecture: HIGH - the recommendation is anchored in existing reducer/hook contracts and Phase 02 verification.
- Pitfalls: HIGH - each pitfall is directly derived from current code assumptions plus locked Phase 03 decisions.

**Research date:** 2026-04-20
**Valid until:** 2026-05-20
