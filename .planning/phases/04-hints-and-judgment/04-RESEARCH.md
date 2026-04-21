# Phase 04: Hints and Judgment - Research

**Researched:** 2026-04-21
**Domain:** 基于现有课堂 reducer 的轻提示、兜底收束与分阶段 judgment contract
**Confidence:** MEDIUM

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
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

### Claude's Discretion
- 复述轮“co-speak”与“完整示范 + 最后跟一次”之间的精确时长、停顿和动画节奏
- 看图轮观察型提示和缩窄问题的具体英文话术池、轮换方式与 item-category 映射
- 判断结果在 orchestrator 内的具体状态命名、事件拆分和测试组织方式
- 如果未来接入语音输入，本阶段的 judgment contract 如何先以 mock/adapter 形式落地而不破坏当前课堂流

### Deferred Ideas (OUT OF SCOPE)
- 自动语音采集、ASR 转写、语义模型判定与低延迟技术方案 —— 留给后续技术规划或更后面的 phase
- 完整 15 分钟课堂的跨阶段整合、最终收口与端到端 lesson pacing —— 属于 Phase 5
- 大规模内容标签体系或更丰富的语义分类数据结构 —— 超出当前 MVP phase 范围
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TEAC-03 | 当孩子作答困难时，老师会先给出轻量提示，再让孩子重新尝试 | 建议在 reducer 中显式建模 `hint -> retry`，而不是继续让 `student_participation_confirmed` 直接代表通过 |
| TEAC-04 | 当孩子连续几次仍无法作答时，老师可以退回到“示范 + 跟读”的兜底方式以恢复课堂节奏 | 建议为复述轮和看图轮分别加入 `fallback model + final follow` 的状态路径，并保持单 CTA 骨架 |
| SPKG-03 | 系统在复述环节使用更贴近目标词句本身的近似匹配规则 | 建议新增纯函数 judgment adapter，基于规范化文本 + 近似距离阈值处理 repeat transcript/mock transcript |
| SPKG-04 | 系统在看图作答环节使用更宽松的基于语义的匹配规则 | 建议把 `semanticAccepts` 放进 lesson content contract，用内容作者提供的 accept set 做 MVP 级语义判断 |
| SPKG-05 | 系统的判断与纠错方式应服务于信心建立和课堂推进，而不是严格打分 | 建议把 judgment outcome 限定为 `pass / retry / fallback`，不输出分数、不暴露错误标签、不增加 child-facing 评分 UI |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- 所有仓库修改都应通过 GSD 工作流入口进行；本次研究输出必须直接写入 `.planning/phases/04-hints-and-judgment/04-RESEARCH.md`。
- 当前项目仍是网页端课堂 MVP，不应为了 Phase 4 引入超出课堂感验证所需的重型语音或服务基础设施。
- 产品约束仍然是固定 15 分钟、1 位老师、1 个真实孩子、1 个 AI 同学、平板横屏优先、图片驱动的英文主流程。
- 架构应继续围绕课堂状态机、可配置 lesson 内容、老师与 AI 同学编排展开，不应平行重做第二套课堂控制层。
- 研究建议不能与 roadmap / context 中已经锁定的 phase 决策冲突。

## Summary

Phase 4 的最佳落点不是新增一套“评分系统”，而是在现有 [classroom-orchestrator.ts](D:/自媒体/MyTurn/src/features/classroom-shell/classroom-orchestrator.ts)、[use-classroom-orchestrator.ts](D:/自媒体/MyTurn/src/features/classroom-shell/use-classroom-orchestrator.ts)、[teacher-script.ts](D:/自媒体/MyTurn/src/features/classroom-shell/teacher-script.ts) 和 [podium-view-model.ts](D:/自媒体/MyTurn/src/features/classroom-shell/podium-view-model.ts) 上，把课堂从“沉默就鼓励、点击就过题”的单一路径升级成“hint / retry / fallback / pass”四种收束语义。现有骨架已经足够稳：单 reducer、单 scheduler、单 podium CTA、Phase 3 focused unit + e2e 基线全绿，说明本 phase 不需要引入新状态机库或新 UI 壳体。

真正的缺口在合同，不在样式。当前系统没有任何 judgment payload，`student_participation_confirmed` 在 [classroom-orchestrator.ts](D:/自媒体/MyTurn/src/features/classroom-shell/classroom-orchestrator.ts) 里会直接进入 `teacher_feedback`；[lesson-schema.ts](D:/自媒体/MyTurn/src/features/lesson-config/lesson-schema.ts) 与 [content/lessons/week-01/lesson-01.ts](D:/自媒体/MyTurn/content/lessons/week-01/lesson-01.ts) 也没有 `semanticAccepts`、观察型提示或 narrowed question 元数据。因此 planner 若不先切出“phase graph / judgment adapter / content metadata”三层，04-02 很容易退化成把判断和文案硬塞进 reducer 分支或 `teacher-script.ts` 的 if/else。

**Primary recommendation:** 继续沿用当前 reducer/hook 架构，但新增一个纯函数 `judgment adapter` 边界、可选的 lesson hint/judgment metadata，以及显式的 `pass / retry / fallback` 结果流；child-facing 交互继续保持单 podium CTA，不引入分数 UI 或音频基础设施。

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | Repo: `16.2.3`; latest verified: `16.2.4` on 2026-04-19 | 承载 App Router 页面与课堂壳体 | 现有课堂路由和 Playwright 基线都基于 Next；Phase 4 不应夹带框架升级 |
| React | Repo/latest verified: `19.2.5` on 2026-04-17 | `useReducer` + effect 驱动课堂状态图 | 现有课堂编排已稳定落在 reducer + hook 模式，继续集中状态最稳妥 |
| Zod | Repo/latest verified: `4.3.6` on 2026-01-25 | 扩展 lesson hint/judgment content contract | 当前 lesson schema 已是单一内容合同入口，扩展元数据应继续走 Zod |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `fastest-levenshtein` | Latest verified: `1.0.16` on 2023-07-28 | 复述轮 transcript/mock transcript 的短文本近似匹配 | 仅放在纯函数 judgment 模块里，用于 repeat lexical closeness，不进入 UI/reducer |
| Vitest | Repo/latest verified: `4.1.4` on 2026-04-09 | reducer、judge、script、hook 单测 | Phase 4 的主要复杂度在纯逻辑和定时状态流，优先靠 focused unit 锁住 |
| Testing Library | Repo: `@testing-library/react 16.3.2`, `user-event 14.6.1` | shell 交互、单 CTA、child-safe copy 回归 | 用真实 click 语义验证 hint/fallback 后仍维持现有交互骨架 |
| Playwright | Repo/latest verified: `1.59.1` on 2026-04-20 | guided flow focused browser regression | 用于证明 Phase 4 没有打碎 Phase 3 的 repeat -> picture 主路径 |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `fastest-levenshtein` + content-authored accept sets | `fast-fuzzy` | `fast-fuzzy` 更适合候选集合搜索；Phase 4 需要的是短 utterance 与 canonical target 的可解释阈值判断 |
| Content-authored `semanticAccepts` | 嵌入模型/LLM 语义判断 | 超出本 phase 边界，会把课堂节奏绑定到网络与模型延迟 |
| Extend current reducer/hook | 新状态机库（如 XState） | 当前复杂度不足以证明迁移收益，反而会重写已通过的 Phase 2/3 基线 |

**Installation:**

```bash
npm install fastest-levenshtein
```

**Version verification:** 2026-04-21 已通过 `npm view` 验证 Next.js、React、Zod、Vitest、Playwright 和 `fastest-levenshtein` 当前 registry 版本；其中 Next.js 比仓库依赖高一个 patch，但不建议把 Phase 4 变成依赖升级任务。

## Architecture Patterns

### Recommended Project Structure

```text
src/
├── features/
│   ├── classroom-shell/
│   │   ├── classroom-orchestrator.ts      # hint/fallback state graph
│   │   ├── use-classroom-orchestrator.ts  # single scheduler + submit attempt API
│   │   ├── teacher-script.ts              # stage-aware prompt / hint / fallback lines
│   │   ├── podium-view-model.ts           # podium status + CTA labels
│   │   └── classroom-judgment.ts          # new pure judgment adapter
│   └── lesson-config/
│       └── lesson-schema.ts               # optional hint/judgment metadata
content/
└── lessons/week-01/lesson-01.ts           # seeded accepts/hints/fallback copy
test/
├── unit/
│   ├── classroom-orchestrator.test.ts
│   ├── classroom-judgment.test.ts         # new
│   ├── teacher-script.test.ts
│   └── classroom-shell.test.tsx
└── e2e/
    └── guided-speaking-flow.spec.ts
```

### Pattern 1: Add a Pure Judgment Boundary Before Changing UI

**What:** 新增 `classroom-judgment.ts`，把“repeat 近似匹配”和“picture 语义 accept”做成纯函数；reducer 只消费结果，不自己做字符串判断。

**When to use:** 任何需要在不引入 ASR/评分 UI 的前提下，为 future voice input 预留接入口时。

**Example:**

```ts
// Source: recommended extension of current reducer contract
export type JudgmentMode = 'repeat-after-teacher' | 'picture-talk';

export type StudentAttempt = {
  mode: JudgmentMode;
  transcript: string | null;
  source: 'manual' | 'mock_transcript' | 'future_asr';
};

export type JudgmentOutcome = 'pass' | 'retry' | 'fallback';

export type TurnJudgment = {
  outcome: JudgmentOutcome;
  confidence: 'high' | 'medium' | 'low';
  matchedPhrase?: string;
};
```

### Pattern 2: Keep Reducer Logic Separate From Child-Facing Participation Copy

**What:** 不要再把 `participationState` 既当逻辑分支又当 UI 文案来源。保留 `participationState` 给 child-facing shell，另加 `judgmentOutcome` 或 `turnResolution` 给 reducer 做分支。

**When to use:** 需要同时表达“孩子开口了，但没过，需要再试”和“孩子沉默，需要老师兜底”时。

**Example:**

```ts
// Source: current state shape in classroom-orchestrator.ts is missing this separation
type ClassroomTurnResolution = 'pending' | 'pass' | 'retry' | 'fallback';

type ClassroomOrchestratorState = {
  attemptIndex: number;
  participationState: 'idle' | 'waiting' | 'spoke' | 'silent' | 'encouraged' | 'echoed';
  turnResolution: ClassroomTurnResolution;
  // preserve current fields:
  currentItem: LessonItem;
  currentStageId: GuidedStageId;
  phase: ClassroomOrchestratorPhase;
};
```

### Pattern 3: Make Hint and Fallback Copy Content-Authored, Not Reducer-Hardcoded

**What:** 把 `observeHint`、`narrowedQuestion`、`semanticAccepts`、`fallbackModel` 做成 lesson item 的可选元数据；`teacher-script.ts` 只负责按 stage/phase 选用这些字段。

**When to use:** 当 planner 希望 Phase 4 可扩到不止一节 noun lesson，而不把具体英文话术散落在 reducer 里时。

**Example:**

```ts
// Source: recommended extension of lesson-schema.ts
const lessonItemJudgmentSchema = z.object({
  repeatAccepts: z.array(z.string().min(1)).min(1).optional(),
  pictureTalk: z
    .object({
      observeHint: z.string().min(1),
      narrowedQuestion: z.string().min(1),
      semanticAccepts: z.array(z.string().min(1)).min(1),
      fallbackModel: z.string().min(1),
    })
    .optional(),
});
```

### Pattern 4: Preserve the Single Scheduler and Single CTA

**What:** Phase 4 可以扩 phase graph，但不能把重试和兜底拆成组件内散落的多个超时链，也不要新增第二个 child-facing 控件。

**When to use:** 所有 hint/fallback 的时序推进都应继续由 [use-classroom-orchestrator.ts](D:/自媒体/MyTurn/src/features/classroom-shell/use-classroom-orchestrator.ts) 中央调度。

**Example:**

```ts
// Source: current scheduling pattern in use-classroom-orchestrator.ts
const timer = window.setTimeout(() => {
  dispatch(getScheduledEvent(state.phase));
}, CLASSROOM_TIMINGS[state.phase]);
```

### Anti-Patterns to Avoid

- **Overloading `student_participation_confirmed` as “always pass”:** 这会直接绕过 SPKG-03 / SPKG-04。
- **把 hint/fallback 全塞进 `teacher-script.ts`:** 文案会变多，但状态图依然分不清 retry 和 fallback。
- **把 picture-talk 的 semantic 判断做成 reducer 内 hardcoded switch:** 会让 content 和 orchestration 强耦合。
- **为 Phase 4 新增第二个 child-facing CTA 或 debug 输入框进入主流程:** 会破坏 Phase 3 已验证的单按钮骨架。
- **让 Bobby 出现在 picture-talk 的 hint/fallback 路径:** 违反 teacher-owned control。

## Planning Decomposition

| Plan Slice | Primary Files | Requirements | Exit Criteria |
|------------|---------------|--------------|---------------|
| `04-01` Hint ladder and phase graph | `classroom-orchestrator.ts`, `use-classroom-orchestrator.ts`, `teacher-script.ts`, `podium-view-model.ts`, `classroom-orchestrator.test.ts` | TEAC-03 | repeat 轮出现 `co-speak -> retry`，picture 轮出现 `observe hint -> narrowed re-ask`，且现有单 CTA 仍成立 |
| `04-02` Judgment contract and lesson metadata | `lesson-schema.ts`, `content/lessons/week-01/lesson-01.ts`, `classroom-judgment.ts`, `classroom-judgment.test.ts`, `lesson-schema.test.ts` | SPKG-03, SPKG-04, SPKG-05 | reducer 不再直接把确认当通过；repeat/picture 各自有纯函数判断和可测的 content-authored accepts |
| `04-03` Teacher fallback close-out and regression gate | `classroom-orchestrator.ts`, `teacher-script.ts`, `classroom-shell.test.tsx`, `guided-speaking-flow.spec.ts` | TEAC-04, SPKG-05 | 两个 stage 都能在最终 fallback 后保住孩子最后一次开口机会，同时不破坏 Phase 3 repeat -> picture 主路径 |

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 复述近似判断 | 手写散落在 reducer 里的字符串距离逻辑 | `classroom-judgment.ts` + `fastest-levenshtein` | 让阈值可测、可替换，也避免 UI/状态图知道匹配细节 |
| 看图语义判断 | LLM / embedding 在线判定 | lesson item `semanticAccepts` | Phase 4 的目标是课堂节奏，不是做模型推理链路 |
| fallback 时序 | 组件内多个 `setTimeout`/`useEffect` 链 | 继续使用单 reducer + `CLASSROOM_TIMINGS` | 现有 orchestrator 已验证稳定，不应复制第二套时序 |
| 教师提示池 | 在 reducer 里按 item id 写死英文 | lesson metadata + `teacher-script.ts` 选择器 | 让内容扩展停留在 content 层，而不是业务逻辑层 |
| 评分反馈 | 分数、对错 badge、红绿纠错 UI | `pass / retry / fallback` 三态结果 | SPKG-05 明确要求服务信心和推进，而不是儿童可感知评分 |

**Key insight:** Phase 4 最值钱的不是“更聪明的匹配算法”，而是把内容元数据、纯函数 judgment 和课堂状态图分层，避免未来接语音时必须返工整个 orchestrator。

## Common Pitfalls

### Pitfall 1: `student_participation_confirmed` 继续直接进入 `teacher_feedback`

**What goes wrong:** 孩子一点击 CTA 就通过，复述轮与看图轮永远不会进入基于 judgment 的 retry/fallback。

**Why it happens:** 当前 [classroom-orchestrator.ts](D:/自媒体/MyTurn/src/features/classroom-shell/classroom-orchestrator.ts) 在 `student_participation_confirmed` 分支里直接把 phase 切到 `teacher_feedback`。

**How to avoid:** 把 CTA 变成“提交一次 student attempt”，由 judgment adapter 返回 `pass / retry / fallback` 后再由 reducer 分支。

**Warning signs:** reducer 测试里仍然只断言“点了按钮 -> teacher_feedback”。

### Pitfall 2: `attemptIndex` 语义继续混乱

**What goes wrong:** 现在的 `attemptIndex` 同时被拿来表示“第几次 student wait”和“picture-talk 第二次机会”，一旦加 co-speak/fallback 会很快 off-by-one。

**Why it happens:** 现有状态图只有 `student_wait -> teacher_encourage -> teacher_echo` 的窄路径。

**How to avoid:** 在规划里明确 `attemptIndex` 只记录 learner attempt 次数，另用 `turnResolution` 或 `hintLevel` 表达当前所处的 hint/fallback 层级。

**Warning signs:** `teacher-script.ts` 需要靠 `attemptIndex === 2` 之类的魔法数区分 fallback。

### Pitfall 3: lesson schema 不扩，导致 semantic 规则只能写死在脚本层

**What goes wrong:** 看图轮的观察提示、缩窄问题、语义 accept 和 fallback answer 都会挤到 `teacher-script.ts` 里，内容一多就不可维护。

**Why it happens:** 当前 [lesson-schema.ts](D:/自媒体/MyTurn/src/features/lesson-config/lesson-schema.ts) 只有 `text`、图片和 stage itemIds。

**How to avoid:** 在 schema 中增加可选 judgment/hint metadata，并同步更新 [lesson-schema.test.ts](D:/自媒体/MyTurn/test/unit/lesson-schema.test.ts)。

**Warning signs:** `teacher-script.ts` 开始出现按 `item.id` 分支的长串 if/else。

### Pitfall 4: 为了实现 fallback 把答案泄露到 child-facing surface

**What goes wrong:** 复述轮和看图轮的 fallback 文案若直接渲染在 board 或 teacher visible copy 上，会破坏图片驱动和 child-safe UI。

**Why it happens:** 目前 teacher card 只渲染 `visibleCaption`，若设计不清楚，很容易把 `fallbackModel` 直接塞进去。

**How to avoid:** 继续坚持 `visibleCaption` 和 `spokenModel` 分离；fallback answer 也只进 spoken channel，不进 child-facing board text。

**Warning signs:** [classroom-shell.test.tsx](D:/自媒体/MyTurn/test/unit/classroom-shell.test.tsx) 或 [guided-speaking-flow.spec.ts](D:/自媒体/MyTurn/test/e2e/guided-speaking-flow.spec.ts) 开始能看到 `apple`、`banana` 之类 target text。

### Pitfall 5: Picture-talk fallback 复用 `teacher_echo` 导致语义不清

**What goes wrong:** `teacher_echo` 目前在 repeat 轮里意味着“跟老师一起说”；若 picture fallback 也直接塞进去，planner 很难区分“老师给答案”与“孩子最后跟一句”。

**Why it happens:** 现有 phase enum 不够细，picture close-out 现在只会 `teacher_encourage -> move_next`。

**How to avoid:** 至少新增一个显式 fallback model phase，保留 `teacher_echo` 作为 final follow/invite，或者重命名为更通用的 final-follow phase。

**Warning signs:** `teacher_echo` 在两个 stage 中承载完全不同业务语义，测试名越来越难写清楚。

### Pitfall 6: Phase 4 回归把 Phase 3 的 E2E 节奏打断

**What goes wrong:** 多出 hint/fallback 定时后，existing Playwright spec 可能超时或顺序错误，即使 UI 看起来还能点。

**Why it happens:** 当前 [guided-speaking-flow.spec.ts](D:/自媒体/MyTurn/test/e2e/guided-speaking-flow.spec.ts) 对按钮可见时机有明确 8 秒窗口假设。

**How to avoid:** 维持单 scheduler，增加 focused e2e 仅覆盖一条新 fallback 路径，同时保留原 repeat -> picture baseline spec。

**Warning signs:** 旧 spec 在等待 `I said it` 或 `I answered` 时偶发超时。

## Code Examples

Verified patterns adapted to this phase:

### Submit a judged student attempt through the hook boundary

```ts
// Source: recommended extension of use-classroom-orchestrator.ts
type SubmitStudentAttemptInput = {
  transcript?: string | null;
  source?: 'manual' | 'mock_transcript' | 'future_asr';
};

function submitStudentAttempt(input: SubmitStudentAttemptInput = {}) {
  dispatch({
    type: 'student_attempt_submitted',
    transcript: input.transcript ?? null,
    source: input.source ?? 'manual',
  });
}
```

### Drive reducer transitions from judgment outcome instead of button click alone

```ts
// Source: recommended extension of classroom-orchestrator.ts
if (event.type === 'student_attempt_submitted') {
  const judgment = judgeStudentAttempt({
    lessonItem: state.currentItem,
    stageId: state.currentStageId,
    transcript: event.transcript,
    attemptIndex: state.attemptIndex,
  });

  if (judgment.outcome === 'pass') {
    return { ...state, turnResolution: 'pass', phase: 'teacher_feedback' };
  }

  if (judgment.outcome === 'retry') {
    return { ...state, turnResolution: 'retry', phase: 'teacher_encourage' };
  }

  return { ...state, turnResolution: 'fallback', phase: 'teacher_fallback_model' };
}
```

### Keep picture-talk semantic acceptance deterministic in content, not in the reducer

```ts
// Source: recommended lesson metadata pattern
{
  id: 'apple',
  text: 'apple',
  imageAlt: 'A red apple with a green leaf.',
  pictureTalk: {
    observeHint: 'Look at the fruit. What color do you see?',
    narrowedQuestion: 'Is it an apple or a banana?',
    semanticAccepts: ['apple', 'an apple', 'red apple'],
    fallbackModel: 'It is an apple.',
  },
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `student_participation_confirmed` equals success | attempt submission feeds a judgment adapter | Phase 04 | 允许同一个 CTA 继续存在，但不再把点击硬编码成通过 |
| `teacher_encourage` 仅代表一次口头推动 | 显式区分 light hint、fallback model、final follow | Phase 04 | 才能满足 D-01 至 D-11 的分层要求 |
| lesson item 只有 target text + image | lesson item 增加可选 hint/judgment metadata | Phase 04 | prompt 池和 semantic accept 可从 content 层扩展 |
| picture-talk 只支持 silence-based second chance | picture-talk 支持 observe hint、narrowed question、semantic pass、fallback answer | Phase 04 | 从“只要点确认就过/超时就过题”升级成更像课堂的 teacher-led judgment |

**Deprecated/outdated:**

- 在 reducer 中把 `student_participation_confirmed` 直接映射到 `teacher_feedback`
- 仅靠 `attemptIndex` 在 `teacher-script.ts` 里推断 hint 与 fallback 层级
- 让 picture-talk 的 close-out 继续停留在 “Thanks for trying. Let us keep going.” 然后直接切题

## Open Questions

1. **是否现在就把 hint/judgment metadata 设为必填？**
   - What we know: 现有 lesson seed 和 schema 测试都假设 item 结构极简。
   - What's unclear: planner 是希望一次性升级全部 lesson content，还是先用可选字段兼容旧数据。
   - Recommendation: Phase 4 先做可选字段 + seeded lesson 补齐，避免 schema 破坏波及其他 phase。

2. **final follow 的 CTA 是否继续复用当前按钮？**
   - What we know: Phase 3 已锁定单 podium CTA，Phase 4 不能引入第二个儿童主流程按钮。
   - What's unclear: fallback 后最后一次跟说是否需要不同 label。
   - Recommendation: 继续复用一个按钮，但允许 label 在 repeat fallback / picture fallback 时切换成更课堂化的英文短句。

3. **repeat lexical threshold 取多宽？**
   - What we know: D-07 要“近似”，但项目当前没有真实 transcript 样本或 ASR 误差分布。
   - What's unclear: 具体距离阈值多少最合适。
   - Recommendation: 04-02 先在 unit tests 里用固定样本集锁阈值，且把阈值集中在 `classroom-judgment.ts` 常量中，不分散到 reducer。

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next/Vitest/Playwright 运行 | ✓ | `v22.14.0` | — |
| npm | scripts 与依赖安装 | ✓ | `11.12.1` | — |
| Vitest CLI | reducer/judge/component focused tests | ✓ | `4.1.4` | — |
| Playwright CLI | browser regression | ✓ | `1.59.1` | — |
| Playwright Chrome channel | 现有 `playwright.config.ts` | ✓ | verified by passing focused e2e on 2026-04-21 | 如 channel 漂移，再回退到 Playwright 默认 browser，但需改 config |

**Missing dependencies with no fallback:**

- None.

**Missing dependencies with fallback:**

- None for the current baseline. `fastest-levenshtein` is a proposed new dependency for 04-02, not a currently missing blocker.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest `4.1.4` + Testing Library + Playwright `1.59.1` |
| Config file | [vitest.config.ts](D:/自媒体/MyTurn/vitest.config.ts), [playwright.config.ts](D:/自媒体/MyTurn/playwright.config.ts) |
| Quick run command | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx test/unit/teacher-script.test.ts test/unit/lesson-board.test.tsx` |
| Full suite command | `npm run test:unit && npm run test:e2e` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TEAC-03 | repeat/picture 第一次困难后进入轻提示并给第二次机会 | reducer unit + shell integration | `npx vitest run test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx` | ✅ needs extension |
| TEAC-04 | 连续困难后进入 `fallback model + final follow` 收束 | reducer unit + teacher-script unit + shell integration | `npx vitest run test/unit/classroom-orchestrator.test.ts test/unit/teacher-script.test.ts test/unit/classroom-shell.test.tsx` | ✅ needs extension |
| SPKG-03 | repeat 使用近似 lexical match，而不是“开口即过” | pure unit | `npx vitest run test/unit/classroom-judgment.test.ts` | ❌ Wave 0 |
| SPKG-04 | picture-talk 使用 content-authored semantic accept sets | pure unit + reducer unit | `npx vitest run test/unit/classroom-judgment.test.ts test/unit/classroom-orchestrator.test.ts` | ❌ / ✅ |
| SPKG-05 | child-facing flow 仍保持英文优先、单 CTA、无分数 UI、无 target 泄露 | shell integration + e2e smoke | `npx vitest run test/unit/classroom-shell.test.tsx test/unit/lesson-board.test.tsx && npx playwright test test/e2e/guided-speaking-flow.spec.ts` | ✅ needs extension |

### Sampling Rate

- **Per task commit:** `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx test/unit/teacher-script.test.ts`
- **Per wave merge:** `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx test/unit/teacher-script.test.ts test/unit/classroom-judgment.test.ts test/unit/lesson-schema.test.ts`
- **Phase gate:** `npm run test:unit && npm run test:e2e`

### Wave 0 Gaps

- [ ] Add [test/unit/classroom-judgment.test.ts](D:/自媒体/MyTurn/test/unit/classroom-judgment.test.ts) for repeat lexical threshold, picture semantic accepts, and `pass / retry / fallback` outcomes.
- [ ] Extend [test/unit/classroom-orchestrator.test.ts](D:/自媒体/MyTurn/test/unit/classroom-orchestrator.test.ts) to cover repeat co-speak retry, repeat fallback model, picture narrowed re-ask, and picture fallback final follow.
- [ ] Extend [test/unit/teacher-script.test.ts](D:/自媒体/MyTurn/test/unit/teacher-script.test.ts) to verify observe hint, narrowed question, fallback model, and no-answer-leak rules.
- [ ] Extend [test/unit/classroom-shell.test.tsx](D:/自媒体/MyTurn/test/unit/classroom-shell.test.tsx) to prove single CTA survives hint/fallback and no scoring copy appears.
- [ ] Extend [test/unit/lesson-schema.test.ts](D:/自媒体/MyTurn/test/unit/lesson-schema.test.ts) for optional hint/judgment metadata parsing.
- [ ] Add one focused e2e path that intentionally exercises a fallback branch without deleting the existing repeat -> picture baseline spec.

**Baseline verification run on 2026-04-21:**

- `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx test/unit/teacher-script.test.ts test/unit/bobby-script.test.ts test/unit/lesson-board.test.tsx` ✅
- `npm run test:e2e -- test/e2e/guided-speaking-flow.spec.ts` ✅

## Sources

### Primary (HIGH confidence)

- Local repo: [04-CONTEXT.md](D:/自媒体/MyTurn/.planning/phases/04-hints-and-judgment/04-CONTEXT.md) - locked decisions, discretion scope, canonical refs
- Local repo: [REQUIREMENTS.md](D:/自媒体/MyTurn/.planning/REQUIREMENTS.md) - Phase 4 requirement IDs and exact wording
- Local repo: [ROADMAP.md](D:/自媒体/MyTurn/.planning/ROADMAP.md) - 04-01 / 04-02 / 04-03 plan slots and success criteria
- Local repo: [STATE.md](D:/自媒体/MyTurn/.planning/STATE.md) - current project position and recent phase decisions
- Local repo: [classroom-orchestrator.ts](D:/自媒体/MyTurn/src/features/classroom-shell/classroom-orchestrator.ts) - current phase graph, `attemptIndex`, `student_participation_confirmed`, picture retry behavior
- Local repo: [use-classroom-orchestrator.ts](D:/自媒体/MyTurn/src/features/classroom-shell/use-classroom-orchestrator.ts) - single scheduler, stage prompt derivation, hook API
- Local repo: [teacher-script.ts](D:/自媒体/MyTurn/src/features/classroom-shell/teacher-script.ts) - current visible/spoken split and stage-aware prompt routing
- Local repo: [podium-view-model.ts](D:/自媒体/MyTurn/src/features/classroom-shell/podium-view-model.ts) - single CTA and child-facing podium copy contract
- Local repo: [classroom-shell.tsx](D:/自媒体/MyTurn/src/features/classroom-shell/classroom-shell.tsx) - current shell composition and teacher/podium rendering
- Local repo: [lesson-schema.ts](D:/自媒体/MyTurn/src/features/lesson-config/lesson-schema.ts) - current lesson data contract
- Local repo: [content/lessons/week-01/lesson-01.ts](D:/自媒体/MyTurn/content/lessons/week-01/lesson-01.ts) - current seeded lesson has no hint/judgment metadata
- Local repo: [classroom-orchestrator.test.ts](D:/自媒体/MyTurn/test/unit/classroom-orchestrator.test.ts), [classroom-shell.test.tsx](D:/自媒体/MyTurn/test/unit/classroom-shell.test.tsx), [teacher-script.test.ts](D:/自媒体/MyTurn/test/unit/teacher-script.test.ts), [guided-speaking-flow.spec.ts](D:/自媒体/MyTurn/test/e2e/guided-speaking-flow.spec.ts) - current regression surface
- Local repo: [package.json](D:/自媒体/MyTurn/package.json), [vitest.config.ts](D:/自媒体/MyTurn/vitest.config.ts), [playwright.config.ts](D:/自媒体/MyTurn/playwright.config.ts) - verified stack and test config
- npm registry via `npm view` on 2026-04-21 - verified versions/dates for Next.js, React, Zod, Vitest, Playwright, and `fastest-levenshtein`
- React docs: https://react.dev/reference/react/useReducer - reducer initializer and event-driven update guidance
- Vitest docs: https://vitest.dev/guide/mocking/timers - fake timer strategy for timeout-driven tests
- Playwright docs: https://playwright.dev/docs/test-webserver - current `webServer` and base URL pattern
- Zod docs: https://zod.dev/ - schema extension model
- `fastest-levenshtein` repo: https://github.com/ka-weihe/fastest-levenshtein#readme - package purpose and API reference point

### Secondary (MEDIUM confidence)

- None.

### Tertiary (LOW confidence)

- None.

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - 主要基于当前仓库依赖、实际环境探测和 `npm view` 版本核验
- Architecture: HIGH - 直接建立在现有 reducer/hook/script/test 合同与已通过基线上
- Pitfalls: HIGH - 基于当前代码缺口、Phase 3 回归护栏和已锁定用户决策
- Judgment fidelity: MEDIUM - 当前仍无真实 ASR/transcript 输入，Phase 4 只能先把 adapter 和内容合同落地

**Research date:** 2026-04-21
**Valid until:** 2026-05-21
