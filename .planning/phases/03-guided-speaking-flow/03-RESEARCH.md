# Phase 03: Guided Speaking Flow - Research

**Researched:** 2026-04-20
**Domain:** Stage-driven guided speaking orchestration on top of the existing classroom reducer
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Phase 3 采用“先整轮 `repeat-after-teacher`，再整轮 `picture-talk`”的分段推进，不做每个 item 内反复切换模式的编排。
- **D-02:** 当前 `lesson.stages` 仍然是这轮 guided speaking flow 的主要骨架，Phase 3 优先复用既有 `repeat-after-teacher` 和 `picture-talk` stage，而不是重定义课程层级。
- **D-03:** 难度爬坡按 stage 提高要求，而不是在单个 stage 内再拆细层级。
- **D-04:** 在 `repeat-after-teacher` 阶段，孩子可以直接跟读。
- **D-05:** 进入 `picture-talk` 阶段后，老师直接提问，孩子看图回答。
- **D-06:** `repeat-after-teacher` 阶段里每个 item 固定走 `Teacher model -> Bobby model -> My turn`。
- **D-07:** Bobby 在复述轮中的存在感仍需保留，用来延续“先听别人，再轮到自己”的小班课堂感，而不是在 Phase 3 把 Bobby 降成可有可无。
- **D-08:** Phase 3 先用课堂内“已开口”确认来推进课堂，不在这一期引入自动语音触发。
- **D-09:** 这一版的重点是把 guided speaking flow 跑顺，而不是提前把“是否说对”或“是否被系统听见”变成当前 phase 的门槛。
- **D-10:** `picture-talk` 阶段里，老师采用直接提问方式，例如 `What is it?` 或 `What do you see?`，不先铺很长的观察引导。
- **D-11:** `picture-talk` 阶段中，同一个 item 最多给孩子两次回答机会。
- **D-12:** 第一次没接上时，老师先给一个很轻的口头推动，再问第二次，但不进入提示答案或半提示阶段。
- **D-13:** 如果两次都没接上，再由老师收束并切到下一题，保持课堂节奏不中断。
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
| CONT-03 | 课堂流程以图片作为主要理解线索，而不是依赖中文解释 | 建议继续保持 `lesson-board` 无目标词泄露，并把老师/讲台可见文案与实际示范语音拆分，避免为复述轮破坏图片驱动主线 |
| CONT-04 | 同一节课内容可以支撑多轮重复练习，并逐步提高输出要求 | 建议从 `lesson.stages` 派生 speaking queue，先完整跑 `repeat-after-teacher`，再完整跑 `picture-talk`，而不是继续依赖单一 `lesson.items` 顺序 |
| TEAC-02 | 用户能从老师那里获得温和的等待、鼓励和明确的点名作答提示 | 建议把老师话术改为 `stageId + phase + attemptIndex` 驱动，并把第二次 picture-talk 尝试与老师收束语义显式建模 |
| SPKG-01 | 用户可以在前期练习轮次中跟随老师复述目标语言 | 建议在 reducer 中增加手动 participation confirmation 事件，并将 Bobby 仅限于复述轮的示范位置 |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- 所有文件变更都应通过 GSD 工作流入口执行；本次研究属于明确的 phase 研究任务，输出必须写回 `.planning/phases/03-guided-speaking-flow/03-RESEARCH.md`。
- 当前产品仍是网页端课堂 MVP，不应为本 phase 引入超出课堂感验证的基础设施复杂度。
- 产品约束仍然是固定 15 分钟、1 位老师、1 个真实孩子、1 个 AI 同学、平板横屏优先、围绕图片驱动口语练习展开。
- 架构方向以课堂状态机、可配置 lesson 内容、老师与 AI 同学编排为中心；在模式稳定前，以 roadmap 与 phase 文档为主要架构依据。
- 不推荐与 phase 文档冲突的替代方案；尤其不要绕过现有 reducer/hook 架构平行重做第二套课堂流。

## Summary

当前实现已经具备 Phase 3 最重要的底座：`useClassroomOrchestrator` 通过单个 `useReducer` 和单个定时器 effect 管理课堂节奏，[classroom-orchestrator.ts](D:/自媒体/MyTurn/src/features/classroom-shell/classroom-orchestrator.ts) 已有 `student_spoke` 手动事件，[lesson-schema.ts](D:/自媒体/MyTurn/src/features/lesson-config/lesson-schema.ts) 也已经把 `repeat-after-teacher` 与 `picture-talk` 放进 `lesson.stages`。因此本 phase 不需要引入新的状态机库，也不需要并行造新的课堂控制层，正确方向是把现有 reducer 从“按 `lesson.items` 线性推进”扩展为“按 speaking stages 推进”。

真正需要规划清楚的不是库，而是合同。当前 reducer 完全忽略 `lesson.stages.itemIds`，这会直接阻断 CONT-04；当前 `TeacherScriptLine` 只有一个 `spokenLine` 字段，而这个字段被直接显示在教师卡片里，这与 Phase 3 的“老师示范目标语言”以及 D-15 的“儿童主界面不显示目标词句”存在直接冲突；当前 UI 也没有把 `markStudentSpoke` 接到任何按钮或 child-facing 交互上，因此手动 participation confirmation 还停留在 API 层。Phase 3 的规划必须把这三个口子一次性对齐，否则后续计划会在实现阶段反复返工。

**Primary recommendation:** 继续使用现有 reducer/hook 架构，但把状态扩展为 `stage-aware queue + attempt counters + explicit participation confirmation`，并把老师/Bobby 话术合同拆成“可见提示”和“实际示范语句”两条通道。

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | Repo: `16.2.3`; latest verified: `16.2.4` on 2026-04-15 | App Router classroom shell and client/server boundaries | 项目已是 Next App Router；Phase 3 只是扩展交互客户端区域，不需要框架迁移 |
| React | Repo: `19.2.5`; latest verified: `19.2.5` on 2026-04-08 | Reducer-driven classroom orchestration | `useReducer` + client components 正适合把课堂推进逻辑集中在一个纯 reducer 内 |
| Zod | Repo: `4.3.6`; latest verified: `4.3.6` on 2026-01-22 | Lesson schema validation | 项目已用 Zod 定义 lesson/stage/item contract，继续扩展 contract 最稳妥 |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Framer Motion | Repo/latest: `12.38.0` on 2026-03-17 | 讲台和课堂壳体的状态切换动效 | 仅用于已有 podium/overlay 动效的状态呈现，不承担业务逻辑 |
| Vitest | Repo/latest: `4.1.4` on 2026-04-09 | Reducer/hook/component unit tests | 用于 stage queue、attempt 计数、定时推进与可见文案验证 |
| `@testing-library/react` | Repo/latest: `16.3.2` on 2026-01-19 | 组件渲染与 DOM assertions | 用于 shell、button、teacher card、lesson board 的 child-facing 合同验证 |
| `@testing-library/user-event` | Recommended: `14.6.1` on 2025-01-21; not currently installed | 手动 participation confirmation 交互测试 | Phase 3 新增确认按钮后，优先用真实 click 语义而不是直接 `dispatch` |
| Playwright | Repo/latest: `1.59.1` on 2026-04-01 | 课堂流 E2E smoke | 用于覆盖从入班到 guided speaking flow 的最小真实路径 |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Extend current reducer/hook | XState or another state machine library | 本 phase 的复杂度还不需要引入新框架；切换只会增加状态翻译和测试迁移成本 |
| Manual participation confirmation | Automatic speech trigger | 明确被 D-08 / D-09 排除，而且会把 Phase 3 绑定到不稳定的音频链路 |
| `lesson.stages` speaking queue | 在 `lesson.items` 上堆更多布尔判断 | 会继续忽略 `itemIds`，很快在 CONT-04 和未来不同 stage item 排布上失效 |

**Installation:**

```bash
npm install -D @testing-library/user-event
```

**Version verification:** 2026-04-20 已通过 `npm view <package> version time --json` 验证推荐包的当前 registry 版本；本 phase 不建议为了追最新版本而升级现有 runtime 依赖。

## Architecture Patterns

### Recommended Project Structure

```text
src/
├── features/
│   └── classroom-shell/
│       ├── classroom-orchestrator.ts      # stage-aware reducer, queue resolver, attempt counters
│       ├── use-classroom-orchestrator.ts  # single timer effect + manual confirmation handlers
│       ├── teacher-script.ts              # stage/attempt-aware teacher visible copy + spoken model
│       ├── bobby-script.ts                # repeat-after-teacher-only Bobby modeling contract
│       ├── podium-view-model.ts           # podium caption/status/button labels by stage
│       ├── classroom-shell.tsx            # confirmation CTA placement inside existing shell
│       └── lesson-board.tsx               # child-safe board remains image-first
└── content/
    └── lessons/
        └── week-01/lesson-01.ts           # same items reused across repeat-after-teacher and picture-talk
```

### Pattern 1: Derive a Speaking Queue From `lesson.stages`

**What:** 从 `lesson.stages` 中筛出 `repeat-after-teacher` 和 `picture-talk`，再根据各自的 `itemIds` 解析出当前 stage 的 item 序列。不要再让 guided speaking flow 直接递增 `lesson.items`。

**When to use:** 任何需要表达“同一组内容在不同 stage 中被重复使用，但要求不同”的场景。

**Example:**

```ts
// Source: local contract in src/features/lesson-config/lesson-schema.ts
const GUIDED_STAGE_IDS = ['repeat-after-teacher', 'picture-talk'] as const;

type GuidedStageId = (typeof GUIDED_STAGE_IDS)[number];

type GuidedStageRun = {
  itemIds: string[];
  stageId: GuidedStageId;
};

function buildGuidedStageRuns(lesson: Lesson): GuidedStageRun[] {
  return lesson.stages
    .filter(
      (stage): stage is LessonStage & { id: GuidedStageId } =>
        GUIDED_STAGE_IDS.includes(stage.id as GuidedStageId),
    )
    .map((stage) => ({
      stageId: stage.id,
      itemIds: stage.itemIds,
    }));
}
```

### Pattern 2: Keep One Reducer, but Make Events Stage-Aware

**What:** 保留现有 `useReducer` 模式，在 state 中新增 `currentStageIndex`、`currentStageId`、`currentStageItemIndex`、`attemptIndex`，并让 `student_spoke` 演进为显式的 participation confirmation 事件。

**When to use:** 需要继续沿用单一 reducer/timer effect，而不是在组件层堆多个 `setTimeout` 和条件分支时。

**Example:**

```ts
// Source: local pattern in src/features/classroom-shell/classroom-orchestrator.ts
type GuidedEvent =
  | { type: 'phase_timer_completed' }
  | { type: 'student_participation_confirmed' }
  | { type: 'student_attempt_window_elapsed' }
  | { type: 'teacher_retry_complete' }
  | { type: 'reward_visibility_changed'; visible: boolean };

type GuidedState = {
  attemptIndex: 0 | 1;
  currentStageId: 'repeat-after-teacher' | 'picture-talk';
  currentStageIndex: number;
  currentStageItemIndex: number;
  phase: ClassroomOrchestratorPhase;
  // preserve existing fields:
  activeSeat: ClassroomActiveSeat;
  activeSpeaker: ClassroomSpeaker;
  currentItem: LessonItem;
  participationState: ParticipationState;
  rewardVisible: boolean;
};
```

### Pattern 3: Split Visible Teacher Copy From Spoken Modeling

**What:** `teacher-script.ts` 需要从单一 `spokenLine` 演进为至少两个通道：`visibleCaption` 和 `spokenModel`。复述轮中，`spokenModel` 可以包含目标语言，而 `visibleCaption` 继续保持不泄露答案的 child-safe 提示。

**When to use:** `repeat-after-teacher` 需要老师示范目标词句，但 D-15 仍要求儿童主画面默认不显示目标词句。

**Example:**

```ts
// Source: conflict discovered from teacher-script.ts + classroom-shell.tsx
type TeacherScriptLine = {
  debugTargetText: string;
  hintLabel: string;
  spokenModel: string;
  visibleCaption: string;
};

function getTeacherScriptLine(input: {
  attemptIndex: 0 | 1;
  currentItemIndex: number;
  phase: ClassroomOrchestratorPhase;
  stageId: 'repeat-after-teacher' | 'picture-talk';
  targetText: string;
}): TeacherScriptLine {
  if (input.stageId === 'repeat-after-teacher' && input.phase === 'teacher_prompt') {
    return {
      debugTargetText: input.targetText.toUpperCase(),
      hintLabel: 'Listen and say',
      spokenModel: input.targetText,
      visibleCaption: 'Listen first. Then it is your turn.',
    };
  }

  return {
    debugTargetText: input.targetText.toUpperCase(),
    hintLabel: 'Answer the question',
    spokenModel: 'What is it?',
    visibleCaption: 'Look at the picture and answer.',
  };
}
```

### Pattern 4: Scope Bobby to Repeat-After-Teacher Only

**What:** Bobby 继续存在，但只在 `repeat-after-teacher` 的示范位上出现。`picture-talk` 的失败重试与收束全部由老师承担。

**When to use:** 需要保留小班课堂里的缓冲感，但不能破坏 D-16 的 teacher-owned control。

**Example:**

```ts
// Source: local contract in src/features/classroom-shell/bobby-script.ts
function shouldShowBobbyModel(stageId: 'repeat-after-teacher' | 'picture-talk', phase: ClassroomOrchestratorPhase) {
  return stageId === 'repeat-after-teacher' && phase === 'ai_model';
}
```

### Anti-Patterns to Avoid

- **A second orchestrator hook:** 会把 phase 逻辑拆散到两个状态源里，破坏 Phase 2 已验证的 deterministic reducer contract。
- **Driving guided stages from `lesson.items` only:** 一旦 stage item 数量或顺序与主 item 列表不完全一致，课堂会直接跑错。
- **Leaking the target text through teacher card copy:** 会违反 D-15，并削弱“图像 -> 语言”的产品假设。
- **Giving Bobby a picture-talk rescue line:** 会破坏老师点名与沉默接住的课堂感。
- **Putting retry logic in the component tree:** 定时器和 attempt 计数应留在 reducer，不要散落在按钮点击或 `useEffect` 条件分支里。

## Planning Decomposition

| Plan Slice | Primary Files | Requirements | Exit Criteria |
|------------|---------------|--------------|---------------|
| `03-01` Reducer and stage queue foundation | `classroom-orchestrator.ts`, `use-classroom-orchestrator.ts`, `lesson-schema.ts` consumers, `classroom-orchestrator.test.ts` | SPKG-01, CONT-04 | 课堂能按 `repeat-after-teacher` 全轮后再进 `picture-talk` 全轮推进；手动 confirmation 事件能替代自动语音触发 |
| `03-02` Stage-aware scripts and shell interaction | `teacher-script.ts`, `bobby-script.ts`, `podium-view-model.ts`, `classroom-shell.tsx`, `classroom-shell.test.tsx`, `teacher-script.test.ts`, `bobby-script.test.ts` | TEAC-02, CONT-03, SPKG-01 | 老师/Bobby/讲台文案按 stage 与 attempt 正确变化；UI 提供轻量 participation confirmation；默认无目标词泄露 |
| `03-03` Progression polish and validation | `lesson-board.tsx`, `classroom-entry.spec.ts` or new guided-flow E2E, reducer/component tests | CONT-04, CONT-03, TEAC-02 | 同一批图片内容支持“复述 -> 看图回答”的要求提升；第二次尝试与老师收束路径稳定；测试矩阵覆盖关键课堂合同 |

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Stage sequencing | 继续用 `currentItemIndex + 1` 硬推 `lesson.items` | `lesson.stages[].itemIds` 派生的 stage queue | Phase 3 的核心就是“同一内容多轮重复且要求升级”，不是单轮 item playback |
| Participation trigger | 麦克风监听、语音起始检测、VAD | 一个显式 reducer event + 轻量 child-facing confirmation UI | D-08 / D-09 已锁定手动确认，这能让 phase 聚焦在课堂流而不是音频可靠性 |
| Interaction tests | 组件测试里直接调用 `dispatch` 伪造点击 | `@testing-library/user-event` | Phase 3 新增真实交互控件后，需要测试用户行为而不是内部实现 |
| Timer verification | 真实等待或 `sleep` | Vitest fake timers + Playwright retry/poll | 现有 orchestrator 就是定时推进，测试必须快速且稳定 |
| Schema validation | 手写 lesson/stage shape 校验 | Zod schema extension | 项目已使用 Zod；继续沿用最省返工且类型安全 |

**Key insight:** Phase 3 的难点不是接一个更大的库，而是把“stage、item、attempt、manual confirmation、teacher/Bobby role”这几个合同统一到一套 reducer 语义里。

## Common Pitfalls

### Pitfall 1: Ignoring `stage.itemIds`

**What goes wrong:** 课程表面上有 `lesson.stages`，但 reducer 仍然直接读取 `lesson.items[nextItemIndex]`。这样一来，Stage 之间无法表达不同的 item 顺序、子集复用或不同轮次节奏。

**Why it happens:** Phase 2 的课堂还只是单轮 item loop，尚未真正消费 stage contract。

**How to avoid:** 在 `createInitialClassroomState` 时就构建 guided stage queue，后续移动 item 只在当前 stage 内推进；stage 用尽后再切下一个 stage。

**Warning signs:** `moveToNextItem` 仍然只依赖 `lesson.items`；测试里无法表达“同一 item 在两个不同 stage 出现”。

### Pitfall 2: Treating All Student Success As One Event

**What goes wrong:** 如果 `student_spoke` 在复述轮和看图轮都直接走成功分支，`picture-talk` 的第二次机会就无法建模，老师的轻推与收束也会丢失。

**Why it happens:** 当前 reducer 只有一个 `student_wait` 成功出口，且没有 attempt 计数。

**How to avoid:** 保留“已开口确认”这个事实，但让 reducer 同时读取 `stageId` 与 `attemptIndex`，区分复述完成、picture-talk 第一次完成、picture-talk 第二次完成。

**Warning signs:** `student_wait` 完成后总是立即进入 `teacher_feedback`；测试里写不出“第一次没接上，第二次再问”。

### Pitfall 3: Leaking the Answer While Adding Teacher Modeling

**What goes wrong:** 为了实现 repeat-after-teacher，直接把目标词塞进当前教师卡片的可见 message，会让孩子看到答案文字，违背 D-15。

**Why it happens:** [teacher-script.ts](D:/自媒体/MyTurn/src/features/classroom-shell/teacher-script.ts) 目前把 `spokenLine` 当成唯一输出，而 [classroom-shell.tsx](D:/自媒体/MyTurn/src/features/classroom-shell/classroom-shell.tsx) 直接渲染它。

**How to avoid:** 把脚本合同拆成 `visibleCaption` 和 `spokenModel`；UI 继续渲染 child-safe caption，后续音频层消费 `spokenModel`。

**Warning signs:** 新测试开始在教师卡片上查找 `apple` / `banana` 这类目标词；`TeacherScriptLine` 仍然只有一个文本字段。

### Pitfall 4: Letting Bobby Drift Into Picture-Talk Rescue

**What goes wrong:** Bobby 一旦在 picture-talk 的重试或沉默处理里出声，老师点名与沉默接住的课堂权威会被削弱，体验更像工具流程而不是课堂。

**Why it happens:** 当前 Bobby gating 只按 `phase === 'ai_model'` 控制，未来如果 phase 名没有扩展 stage 语义，就很容易误复用。

**How to avoid:** Bobby script 的准入条件必须同时依赖 `stageId === 'repeat-after-teacher'` 和 `phase === 'ai_model'`。

**Warning signs:** Bobby 在 picture-talk stage 出现任何 hint label 或 podium status；组件测试里出现 “Bobby goes first” 于 picture-talk 分支。

### Pitfall 5: Flaky Tests Around Fake Timers and User Clicks

**What goes wrong:** 加入 confirmation button 后，如果测试继续只用 fake timers 而不配置 `user-event`，交互测试很容易卡住或断言顺序不稳定。

**Why it happens:** `user-event` 默认会在交互间插入更接近真实用户的事件序列与微小时延。

**How to avoid:** 使用 `userEvent.setup({ advanceTimers: ... })`，并在 reducer 层继续保留显式 timer transitions。

**Warning signs:** 新按钮测试需要 `await` 很多隐式 promise 才能通过；有人建议把 `delay: null` 当默认解法。

## Code Examples

Verified patterns adapted to this phase:

### Build a stage-aware initial state

```ts
// Source: local orchestrator pattern + React useReducer initializer docs
function createInitialGuidedState(lesson: Lesson): GuidedState {
  const stageRuns = buildGuidedStageRuns(lesson);
  const firstStage = stageRuns[0];
  const firstItem = findLessonItem(lesson, firstStage.itemIds[0]);

  return {
    activeSeat: null,
    activeSpeaker: 'teacher',
    attemptIndex: 0,
    currentItem: firstItem,
    currentStageId: firstStage.stageId,
    currentStageIndex: 0,
    currentStageItemIndex: 0,
    participationState: 'idle',
    phase: 'teacher_prompt',
    rewardVisible: false,
  };
}
```

### Distinguish repeat-after-teacher from picture-talk in the reducer

```ts
// Source: local reducer contract in classroom-orchestrator.ts
if (event.type === 'student_participation_confirmed') {
  if (state.currentStageId === 'repeat-after-teacher') {
    return {
      ...state,
      participationState: 'spoke',
      phase: 'teacher_feedback',
    };
  }

  return {
    ...state,
    participationState: 'spoke',
    phase: 'teacher_feedback',
  };
}

if (event.type === 'student_attempt_window_elapsed') {
  if (state.currentStageId === 'picture-talk' && state.attemptIndex === 0) {
    return {
      ...state,
      attemptIndex: 1,
      phase: 'teacher_encourage',
    };
  }

  return {
    ...state,
    participationState: 'silent',
    phase: 'move_next',
  };
}
```

### Test the confirmation button with fake timers

```ts
// Source: Testing Library user-event docs + Vitest timer docs
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

vi.useFakeTimers();
const user = userEvent.setup({
  advanceTimers: vi.advanceTimersByTimeAsync,
});

render(<ClassroomShell lesson={lesson} sessionId="weekday-1700" sessionStatus="LIVE" sessionTitle="Daily" />);

await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.teacher_prompt);
await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.ai_model);

await user.click(screen.getByRole('button', { name: /i said it|i answered/i }));

expect(screen.getByText(/Good job|Nice work|Teacher smile/i)).toBeInTheDocument();
```

### Keep E2E assertions retry-friendly

```ts
// Source: existing Playwright style + expect.poll docs
await expect
  .poll(async () => page.getByTestId('seat-me').getAttribute('data-on-stage'))
  .toBe('true');

await page.getByRole('button', { name: /i said it/i }).click();
await expect(page.getByText(/Good job|Nice work/i)).toBeVisible();
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Flat item-only loop | Stage-aware speaking queue derived from `lesson.stages` | Phase 03 | 同一内容可在不同轮次重复出现并承担不同输出要求 |
| Timer-only student completion path | Explicit manual participation confirmation event | Phase 03 | 移除对自动语音触发的依赖，课堂推进更可控 |
| Single teacher text field doubles as visible UI and modeled speech | Separate visible caption from spoken model | Phase 03 | 能实现复述轮示范，同时继续遵守不泄露目标词的 child-safe guard |
| Bobby gated only by `phase === 'ai_model'` | Bobby gated by `stageId + phase` | Phase 03 | 保留小班缓冲感，但不侵入 picture-talk 的 teacher-owned retry path |

**Deprecated/outdated:**

- `moveToNextItem()` 直接读取 `lesson.items[nextItemIndex]` 的 guided speaking 逻辑
- `TeacherScriptLine.spokenLine` 作为 teacher 文本唯一输出通道
- 依赖纯定时器自动从 student turn 前进，而没有 child-facing confirmation control

## Open Questions

1. **确认按钮的具体呈现方式要多显眼？**
   What we know: Context 把交互形态留给 Claude's Discretion，但强调不能破坏课堂感。
   What's unclear: 是讲台内按钮、讲台状态 chip 还是更像“老师确认”态的 CTA 更自然。
   Recommendation: 先做讲台内单按钮，只有在 `activeSeat === 'me'` 时出现，并随 stage 切换 label。

2. **Phase 3 是否要把 `warmup` / `wrap-up` 一并纳入 reducer stage cursor？**
   What we know: D-02 要继续以 `lesson.stages` 为骨架，但本 phase 明确聚焦 guided speaking。
   What's unclear: 本轮是否需要把 warmup/wrap-up 也重写成 stage-aware reducer 分支。
   Recommendation: 规划时只消费 `repeat-after-teacher` 与 `picture-talk` 两个 guided stages；warmup/wrap-up 在 Phase 5 再统一并入整节课。

3. **复述轮的 target language 现在由什么渠道“被听见”？**
   What we know: 当前 UI 只有可见 teacher message，没有真实 TTS/音频输出层。
   What's unclear: 本 phase 是否只建立合同，还是要在现有 UI 上暂时模拟 teacher modeling。
   Recommendation: 计划中先把 script contract 拆成 visible/spoken 两条线；若本阶段不接真实音频，也不要为图方便重新把答案文字暴露到 child-facing UI。

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js, Vitest, Playwright | ✓ | `v22.14.0` | — |
| npm | package scripts and dependency install | ✓ | `11.12.1` | — |
| `node_modules` install | Running tests locally | ✓ | present | `npm install` if worktree is reset elsewhere |
| Playwright CLI | E2E validation | ✓ | `1.59.1` via `npx playwright --version` | If browser channel breaks, temporarily switch config to default bundled browser before rerunning |
| Chrome channel for Playwright | Existing `playwright.config.ts` | ✓ | verified indirectly by passing `npm run test:e2e` on 2026-04-20 | Config change required; no zero-edit fallback |

**Missing dependencies with no fallback:**

- None.

**Missing dependencies with fallback:**

- `@testing-library/user-event` is not currently installed; fallback is `fireEvent`, but the recommended path is to add `user-event` for Phase 3 interaction tests.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest `4.1.4` + Testing Library (`@testing-library/react` `16.3.2`) + Playwright `1.59.1` |
| Config file | [vitest.config.ts](D:/自媒体/MyTurn/vitest.config.ts), [playwright.config.ts](D:/自媒体/MyTurn/playwright.config.ts) |
| Quick run command | `npm run test:unit` |
| Full suite command | `npm run test:unit` then `npm run test:e2e` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONT-03 | 图片仍是主理解线索；guided stages 不泄露目标词句；teacher visible copy 保持英文且 child-safe | unit + component + e2e smoke | `npx vitest run test/unit/lesson-board.test.tsx test/unit/classroom-shell.test.tsx test/unit/teacher-script.test.ts` | ✅ needs extension |
| CONT-04 | 同一批内容先复述再看图回答，并在 stage 间提高输出要求 | reducer unit + shell integration | `npx vitest run test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx` | ✅ needs extension |
| TEAC-02 | 老师明确点名、温和等待、picture-talk 第二次轻推后收束 | reducer unit + script unit + component | `npx vitest run test/unit/classroom-orchestrator.test.ts test/unit/teacher-script.test.ts test/unit/classroom-shell.test.tsx` | ✅ needs extension |
| SPKG-01 | 复述轮支持 `Teacher model -> Bobby model -> My turn`，并通过手动确认完成 | reducer unit + component + e2e smoke | `npx vitest run test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx` | ✅ needs extension |

### Sampling Rate

- **Per task commit:** `npm run test:unit`
- **Per wave merge:** `npm run test:unit` then `npm run test:e2e`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] Install `@testing-library/user-event` so guided-speaking confirmation clicks are tested as real interactions.
- [ ] Extend [test/unit/classroom-orchestrator.test.ts](D:/自媒体/MyTurn/test/unit/classroom-orchestrator.test.ts) for stage queue traversal, stage switch boundaries, and `picture-talk` second-attempt handling.
- [ ] Extend [test/unit/classroom-shell.test.tsx](D:/自媒体/MyTurn/test/unit/classroom-shell.test.tsx) for confirmation button visibility, label switching, and no-text-leak assertions during repeat-after-teacher.
- [ ] Extend [test/unit/teacher-script.test.ts](D:/自媒体/MyTurn/test/unit/teacher-script.test.ts) to verify `visibleCaption` stays child-safe while spoken modeling can carry target language.
- [ ] Extend [test/unit/bobby-script.test.ts](D:/自媒体/MyTurn/test/unit/bobby-script.test.ts) to assert Bobby is available only in `repeat-after-teacher`.
- [ ] Add a dedicated guided flow E2E, preferably `test/e2e/guided-speaking-flow.spec.ts`, or expand [test/e2e/classroom-entry.spec.ts](D:/自媒体/MyTurn/test/e2e/classroom-entry.spec.ts) to cover the repeat-after-teacher -> picture-talk transition.

## Sources

### Primary (HIGH confidence)

- Local repo: [src/features/lesson-config/lesson-schema.ts](D:/自媒体/MyTurn/src/features/lesson-config/lesson-schema.ts) - verified existing stage contract (`warmup`, `repeat-after-teacher`, `picture-talk`, `wrap-up`)
- Local repo: [content/lessons/week-01/lesson-01.ts](D:/自媒体/MyTurn/content/lessons/week-01/lesson-01.ts) - verified same item set is reused across multiple stages
- Local repo: [src/features/classroom-shell/classroom-orchestrator.ts](D:/自媒体/MyTurn/src/features/classroom-shell/classroom-orchestrator.ts) - verified current reducer is item-only and timer-driven, with `student_spoke` as the only manual event
- Local repo: [src/features/classroom-shell/use-classroom-orchestrator.ts](D:/自媒体/MyTurn/src/features/classroom-shell/use-classroom-orchestrator.ts) - verified single timer effect and current public orchestrator API
- Local repo: [src/features/classroom-shell/teacher-script.ts](D:/自媒体/MyTurn/src/features/classroom-shell/teacher-script.ts) - verified current single text-channel teacher copy contract
- Local repo: [src/features/classroom-shell/bobby-script.ts](D:/自媒体/MyTurn/src/features/classroom-shell/bobby-script.ts) - verified Bobby is currently allowed only in `ai_model`
- React docs: https://react.dev/reference/react/useReducer - verified reducer purity, initializer pattern, and event-driven state updates
- Next.js docs: https://nextjs.org/docs/app/api-reference/directives/use-client - verified client component boundary guidance for interactive classroom UI
- Vitest docs: https://vitest.dev/guide/mocking/timers - verified fake timer strategy for timeout-driven reducer tests
- Testing Library docs: https://testing-library.com/docs/user-event/intro/ - verified `userEvent.setup()` and the recommendation to use `user-event` for interaction tests
- Testing Library docs: https://testing-library.com/docs/user-event/options/ - verified `advanceTimers` guidance for fake timer environments
- Playwright docs: https://playwright.dev/docs/test-webserver - verified current `webServer` + `baseURL` config pattern
- Playwright docs: https://playwright.dev/docs/test-assertions - verified `expect.poll` retry pattern for state-based E2E assertions
- Zod docs: https://zod.dev/ - verified Zod 4 positioning and schema-based validation model
- npm registry via `npm view <package> version time --json` on 2026-04-20 - verified current versions and publish dates for Next.js, React, Zod, Vitest, Playwright, and `@testing-library/user-event`

### Secondary (MEDIUM confidence)

- None.

### Tertiary (LOW confidence)

- None.

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - 主要基于当前仓库 `package.json`、本地已跑通测试命令和官方文档验证
- Architecture: HIGH - 主要基于当前 reducer/hook/contracts 与 Phase 03 context 的直接约束推导
- Pitfalls: HIGH - 来自现有代码合同冲突、已锁定 phase 决策，以及测试基础设施的真实运行结果

**Research date:** 2026-04-20
**Valid until:** 2026-05-20
