# Phase 2: Cast and Orchestration - Research

**Researched:** 2026-04-16
**Domain:** React/Next classroom orchestration for deterministic turn-taking
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
### 角色拓扑与席位表达
- **D-01:** 课堂采用固定三层结构：老师固定区、顶部学生席、下方讲台区长期同时存在，不做简化成单一主舞台的布局。
- **D-02:** 顶部学生席长期保留“我 + Bobby + 空位”的班级结构，用来持续表达“我在班里等着被点到”的感觉。
- **D-03:** 当“我”或 Bobby 被点名上讲台时，顶部原席位不消失，而是原位保留、半透明，并显示“讲台中”标记。

### 轮转结构与推进方式
- **D-04:** 每个目标项都固定走一套确定性的课堂轮转：老师引导 -> Bobby 先示范 -> 真实孩子上台 -> 老师反馈 -> 收束到下一题。
- **D-05:** Bobby 在每个目标项里都固定先示范一次，不采用随机出现、部分出现或后半程逐步减少的策略。
- **D-06:** Bobby 的功能是为真实孩子提供观察和心理缓冲，因此他的出场位置固定在“轮到我之前”，而不是在我沉默时插话救场。

### 老师带班风格
- **D-07:** Cora 采用强引导型老师风格，必须承担开场引导、点名、过渡、鼓励与收束责任，而不是退化成轻提示或节奏播报角色。
- **D-08:** 老师和学生主流程都讲英文，不采用中英混合来解释课堂内容。
- **D-09:** 老师在 Phase 2 的话术重点是带班与控场，不进入复杂纠错、分级反馈或多轮提示分支。

### 语言呈现与图片原则
- **D-10:** 课堂中的图片本身不能出现单词或句子，以保证孩子通过“事物 -> 语言”建立直接联系。
- **D-11:** 儿童主视图中不显示目标单词或句子，不能把目标语言以屏幕文字形式直接给到孩子。
- **D-12:** 目标词句只允许出现在默认关闭的调试开关中，供开发或教师视角查看，不进入正常课堂画面。

### AI 同学行为原则
- **D-13:** Bobby 采用轻微不完美型同学设定，而不是稳定到像完美播报器。
- **D-14:** 这种“不完美”主要体现为轻微停顿/犹豫与更像小朋友的语气，不把“经常说不完整”作为常态。
- **D-15:** Bobby 的示范要可信、顺滑、不过度抢戏，始终服从老师带班和孩子上台的主节奏。

### 老师反馈、沉默处理与奖励边界
- **D-16:** 老师在 Phase 2 中始终负责控场，即使孩子没有跟读正确或较长时间不说话，也要继续鼓励并推进下一环，而不是把课堂卡死在当前题目上。
- **D-17:** 当轮到孩子回答但出现短暂沉默时，处理顺序固定为：短等待 -> 老师用表扬预设型话术鼓励一句 -> 老师带读一遍 -> 如果还是不开口则进入下一环。
- **D-18:** 在上述沉默处理过程中，Bobby 不插话、不接管救场，控场权完全留在老师手里。
- **D-19:** 老师的救场话术风格应为先正向接住孩子，再自然带读，例如类似 “Good job, let's say it together.” 的表扬预设型语气。
- **D-20:** 老师的口头鼓励是常态反馈，不依赖显式正确性判断；只要课堂需要推进，老师都可以先接住并收束。
- **D-21:** 强视觉奖励只在孩子有明显参与时触发，不是每轮机械播放一次。
- **D-22:** 一轮结束后，采用“短反馈 -> 如有明显参与则给小奖励确认 -> 切到下一题”的收束方式，不让 Bobby 再补一句拖慢收束节奏。

### Claude's Discretion
- 老师英文话术池的具体措辞、句长和轮换策略
- Bobby 轻微停顿/犹豫在动效、语气或时间轴上的具体实现
- 短等待、带读、反馈、切题之间的精确时长与动画节奏
- 小奖励确认与强视觉奖励之间的具体分层表现

### Deferred Ideas (OUT OF SCOPE)
- 真实语音采集、转写和延迟处理策略 —— 留给后续 Guided Speaking Flow / 技术规划
- 更复杂的提示升级、重复尝试次数控制和老师兜底策略 —— 属于 Phase 4
- 基于语义的宽松判断与正确性策略 —— 属于 Phase 4/5
- 完整 15 分钟课程编排与跨轮次难度递进 —— 属于 Phase 5
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CLAS-02 | 用户体验到固定 2 人小班结构，包含 1 位老师、1 个真实孩子和 1 个 AI 同学 | 固定角色拓扑、席位保留规则、讲台与顶部 seat strip 的衍生视图模型 |
| CLAS-03 | 用户能感受到由老师主导的一次点名一个孩子作答的课堂节奏 | reducer 驱动的确定性 turn chart、老师主导的过渡事件、单一当前发言人模型 |
| CLAS-04 | 用户可以通过先看或穿插观看 AI 同学作答来获得自然的准备和喘息空间 | Bobby 固定前置示范、不可救场、基于 phase 的 sequential animation |
| TEAC-01 | 用户能听到具有老师风格的课堂引导，包括示范目标语言和清晰的过渡话术 | 话术模板池、按 phase 产出 teacher line、沉默兜底分支但不进入纠错系统 |
| AICL-01 | 用户听到的 AI 同学应像一个可信的同龄同学，而不是一个完美播报器 | Bobby persona contract、轻微停顿/犹豫参数、避免播报器式固定句法 |
| AICL-02 | AI 同学的回答可以带有轻微犹豫或不完美，但整体仍应跟得上课堂 | Bobby response envelope、时间预算、动画与文案不完美度上限 |
</phase_requirements>

## Summary

Phase 2 最适合在现有 `ClassroomShell` 基础上扩展，而不是引入新的全局状态容器或重建页面骨架。当前代码里的 `useClassroomFlow` 已经证明“自动时间推进 + 派生 UI 文案”这条路是可行的，但它还只是一个自动轮播器；为了真正支撑老师控场、Bobby 示范、孩子沉默处理和奖励门控，计划阶段应把它升级为一个纯 reducer 驱动的课堂编排 state chart，再用一个很薄的 scheduler effect 执行定时推进。

对这个 phase 而言，标准做法不是上复杂工作流引擎，而是把“复杂状态更新”收敛到 reducer，把“共享编排逻辑”收敛到 custom hook，把“顺序切换动画”交给现有 Motion 能力。React 官方明确建议在组件状态更新路径变复杂时用 reducer 提升可读性、可调试性和可测试性；这和当前需求高度匹配，因为 Phase 2 本质上是在建一组确定性的课堂规则，而不是在做开放式交互。

**Primary recommendation:** 使用 `useReducer` + 自定义 `useClassroomOrchestrator` hook 建立纯状态机式课堂编排；保留 Next App Router 的 server/client 边界，继续用 Framer Motion 做顺序过渡动画，不新增状态管理库。

## Project Constraints (from CLAUDE.md)

- 开始工作前先读 `.planning/PROJECT.md`、`.planning/REQUIREMENTS.md`、`.planning/ROADMAP.md`、`.planning/STATE.md`。
- 优先通过 GSD 的 phase 命令开展工作，保证规划文档与实现同步。
- GSD 生成文档正文默认使用中文，但保留现有英文标题和结构。
- 技术选型优先使用成熟社区包，不手搓基础能力库。
- `shadcn/ui` 是已锁定的 UI 基础栈一部分。
- MVP 必须持续聚焦“课堂感”验证，不能扩张到内容规模或平台扩张。
- 整体体验必须像一节短课，而不是练习册或答题工具。
- 老师点名轮转和孩子作答前的缓冲空间是核心能力。
- 英文优先、图片驱动理解是产品假设的一部分。
- 宽松作答处理要服务于信心和节奏，不能退化成严格评分器。

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.5 | 用 `useReducer` 建模复杂课堂编排状态 | React 官方明确建议复杂状态更新逻辑使用 reducer，且 reducer 便于隔离测试 |
| Next.js App Router | 16.2.4 current, repo pinned 16.2.3 | 保持 lesson 路由为 server entry，课堂壳体为 client boundary | 官方 server/client boundary 模式适合“服务端取课 + 客户端跑课堂状态” |
| Motion for React (`framer-motion`) | 12.38.0 | 负责讲台角色切换、奖励显隐、顺序过渡 | 已在仓库中使用，`AnimatePresence` 的 `wait` 模式直接适合顺序发言切换 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | 4.1.4 | reducer / hook 定时推进 / UI phase 切换测试 | 所有课堂时间轴与沉默分支都应先有单测 |
| Testing Library | 16.3.2 | 从用户可见结果验证 seat/podium/teacher copy | 验证“谁在台上”“奖励是否显示”“老师话术是否切换” |
| Playwright | 1.59.1 | 浏览器端 smoke，确保 lesson route 未被 Phase 2 破坏 | 每波合并前验证入课链路和基础课堂运行 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| 内建 `useReducer` orchestrator | XState | XState 更显式，但对当前单页、确定性课堂循环来说引入成本高于收益 |
| 单一 scheduler effect | 多个分散 `setTimeout` | 分散 timeout 写起来快，但极易让沉默分支、奖励门控和收束节奏互相打架 |
| 现有 Motion 顺序动画 | 手写 CSS class/DOM 定时切换 | 手写更脆弱，且现有项目已经依赖 Motion，没有必要回退 |

**Installation:**
```bash
# No additional package required for Phase 2.
# Keep existing dependencies:
npm install
```

**Version verification:** Verified on 2026-04-16 via npm registry.
- `npm view react version time --json` → `19.2.5` published `2026-04-08`
- `npm view next version time --json` → `16.2.4` published `2026-04-15`
- `npm view framer-motion version time --json` → `12.38.0` published `2026-03-17`
- `npm view vitest version time --json` → `4.1.4` published `2026-04-09`

## Architecture Patterns

### Recommended Project Structure
```text
src/
├── features/classroom-shell/
│   ├── classroom-shell.tsx           # 顶层容器，继续负责布局拼装
│   ├── classroom-orchestrator.ts     # 纯 reducer + action + state types
│   ├── use-classroom-orchestrator.ts # 定时推进、自定义 hook、派生 view-model
│   ├── teacher-script.ts             # 老师话术模板与 phase->line 生成
│   ├── bobby-script.ts               # Bobby 轻微不完美示范 contract
│   ├── podium-view-model.ts          # seat/podium/reward 的派生展示数据
│   ├── student-seat-strip.tsx        # 纯展示组件
│   └── lesson-board.tsx              # 纯展示组件
└── app/lesson/[sessionId]/page.tsx   # 继续做 server entry
```

### Pattern 1: Reducer-Driven Classroom Turn Chart
**What:** 用纯 reducer 建立课堂状态图，把 `teacher_prompt -> ai_model -> student_turn -> teacher_feedback -> celebration?/move_on` 以及沉默兜底分支都表达成 action 驱动的状态转换。
**When to use:** 任何状态更新路径超过“线性自动轮播”的地方，尤其是沉默处理、奖励门控、老师过渡话术。
**Example:**
```typescript
// Source: https://react.dev/reference/react/useReducer
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'timer_elapsed':
      return nextState(state);
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, initialState);
```

### Pattern 2: Custom Hook Owns Stateful Logic, Components Stay Presentational
**What:** 把 scheduler、derived props、teacher line、Bobby line、reward gate 统一收进 `useClassroomOrchestrator`，让 `ClassroomShell` 只消费一个 view-model。
**When to use:** 当多个组件都依赖同一编排状态，但不应该各自持有流程逻辑时。
**Example:**
```typescript
// Source: https://react.dev/learn/reusing-logic-with-custom-hooks
function useClassroomOrchestrator(lesson: Lesson) {
  const [state, dispatch] = useReducer(classroomReducer, createInitialState(lesson));
  return buildViewModel(state, dispatch);
}
```

### Pattern 3: Server Entry, Client Classroom Boundary
**What:** lesson 路由继续在 server component 中取 session/lesson 数据，只把已解析内容传入带 `"use client"` 的课堂壳体。
**When to use:** 所有课堂编排都运行在浏览器端，但 lesson/session 解析仍留在 App Router 服务端入口。
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/getting-started/server-and-client-components
// page.tsx (server)
export default async function LessonPage() {
  const lesson = loadLesson(...);
  return <ClassroomShell lesson={lesson} />;
}
```

### Pattern 4: Sequential Speaker Swaps via Motion `wait`
**What:** 角色出场切换使用 `AnimatePresence` 的 `mode="wait"`，确保前一个发言者先退场，再让下一个入场。
**When to use:** Bobby 上台、我上台、奖励浮层切换等只允许一个主角占据讲台视觉焦点的地方。
**Example:**
```tsx
// Source: https://motion.dev/docs/react-animate-presence
<AnimatePresence mode="wait">
  <motion.div key={speakerId} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
</AnimatePresence>
```

### Anti-Patterns to Avoid
- **在组件里串联多个裸 `setTimeout`:** 会让沉默分支、奖励门控和 item 切题散落在不同组件内，后续一改就碎。
- **把课堂脚本写回 lesson content schema:** 本项目已锁定“流程逻辑在系统层，不交给内容层脚本化”。
- **让 Bobby 在孩子沉默时救场:** 这直接违反已锁定的老师控场决策。
- **儿童主视图继续显示目标词句:** 现有 `LessonBoard` 正文区目前仍渲染 `currentItem.text`，Phase 2 计划里应把它列为必须处理的展示偏差。
- **奖励阶段固定每轮触发:** 已锁定为“明显参与才强反馈”，不能继续沿用当前 `celebration` 每轮必进的模型。

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 复杂课堂状态更新 | 分散在多个组件中的本地 `useState` + timeout 链 | 单一 reducer + action graph | 更容易调试、测试和追踪错误状态 |
| 角色切换动效 | 原始 DOM class 切换和手写退场时序 | Motion `AnimatePresence` | 顺序进入/退出已被官方支持，边界更清晰 |
| 定时测试 | 真实等待时间流逝 | Vitest fake timers | 官方支持 `vi.useFakeTimers` / `vi.advanceTimersByTime`，测试稳定快速 |
| 多组件共享编排逻辑 | 复制 teacher/seat/podium 派生逻辑 | 自定义 hook + 派生 view-model | React 官方推荐用 custom hooks 复用 stateful logic |

**Key insight:** 这个 phase 不需要新库，但必须停止“UI 直接带流程”的写法。真正的复杂度来自课堂规则，而不是视觉组件数量。

## Common Pitfalls

### Pitfall 1: 把“时间推进”误当成“课堂编排”
**What goes wrong:** 只按秒表切 phase，看起来像自动轮播，不像老师在带班。
**Why it happens:** 当前 `useClassroomFlow` 已经是线性定时器，容易在此基础上只加更多 duration。
**How to avoid:** 用 action 命名真实课堂事件，例如 `teacher_finished_prompt`、`student_silent_timeout`、`reward_acknowledged`。
**Warning signs:** 测试只能断言“过了 1800ms 进入下一相”，却不能断言“沉默后老师先鼓励再带读”。

### Pitfall 2: Bobby 抢走老师控场权
**What goes wrong:** 为了让课堂更热闹，把 Bobby 写成自动补话、自动救场。
**Why it happens:** AI 同学行为和老师过渡行为没有被分离建模。
**How to avoid:** 在 reducer 层禁止 `student_turn` 之后的 Bobby 分支，只允许老师处理沉默。
**Warning signs:** 沉默分支里出现 AI 文案、AI 上台、或 AI 触发奖励。

### Pitfall 3: 展示层泄露目标词句给孩子
**What goes wrong:** `LessonBoard` 或讲台 caption 继续把目标词直接显示在孩子主视图。
**Why it happens:** Phase 1 为演示壳体方便保留了 `currentItem.text` 展示。
**How to avoid:** 规划时区分 child-facing copy、debug copy、teacher/system copy 三类文本。
**Warning signs:** 正常课堂截图里能直接读到目标单词或句子。

### Pitfall 4: 把奖励做成机械固定阶段
**What goes wrong:** 每轮都亮一次强奖励，课堂节奏显得廉价且不可信。
**Why it happens:** 当前 flow 模型把 `celebration` 写成固定 phase。
**How to avoid:** 把奖励改成 gate，而不是必经 phase；显著参与才触发强反馈，否则只走轻确认收束。
**Warning signs:** 测试或 reducer 中所有成功路径都无条件进入同一个 `celebration` 状态。

### Pitfall 5: Client boundary 越界扩张
**What goes wrong:** 把更多 lesson/session 解析逻辑塞进 client 组件，导致 bundle 变大且职责混乱。
**Why it happens:** 编排逻辑新增时，容易顺手把页面入口也改成纯 client。
**How to avoid:** 继续保持 `page.tsx` 解析数据，client 只消费已解析 lesson/session。
**Warning signs:** lesson route 新增 `"use client"` 或开始在前端重建 schedule 查询逻辑。

## Code Examples

Verified patterns from official sources:

### Complex State Logic with `useReducer`
```typescript
// Source: https://react.dev/reference/react/useReducer
import { useReducer } from 'react';

function classroomReducer(state, action) {
  switch (action.type) {
    case 'teacher_finished_prompt':
      return { ...state, phase: 'ai_model' };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(classroomReducer, initialState);
```

### Sequential Exit/Enter Animation
```tsx
// Source: https://motion.dev/docs/react-animate-presence
<AnimatePresence mode="wait">
  <motion.section
    key={activeSpeaker}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
  />
</AnimatePresence>
```

### Time-Driven Unit Test
```typescript
// Source: https://vitest.dev/guide/mocking/timers
import { vi } from 'vitest';

vi.useFakeTimers();
dispatch({ type: 'start_student_wait' });
vi.advanceTimersByTime(1200);
expect(state.phase).toBe('teacher_lead_in');
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| 组件内多个 `useState` + 事件处理器分散更新 | reducer 集中管理复杂状态更新 | React 官方长期推荐，React 19.2 文档仍明确适用 | 更适合课堂编排这类多分支状态 |
| 客户端页面统管数据与交互 | Next App Router 下 server entry + client boundary | Next.js App Router 主流模式 | lesson 数据解析与课堂运行边界更清楚 |
| 手写 class 级进场退场 | Motion `AnimatePresence` 顺序动画 | Motion 当前官方文档已稳定支持 | 讲台角色切换更稳，少手写时序 bug |

**Deprecated/outdated:**
- “把 `celebration` 当作每题固定 phase” 不是当前目标下的合理做法；应改为 reward gate。
- “孩子主屏直接显示目标词” 与当前产品假设冲突；保留仅限 debug/teacher 视角。

## Open Questions

1. **短等待、鼓励、带读、切题的精确时间预算是多少？**
   - What we know: Context 已锁定顺序，但没锁定时长。
   - What's unclear: 平板端体感上哪组毫秒数最像真实启蒙课，而不是 UI 自动播放。
   - Recommendation: 计划里单列一个 timing calibration 任务，先把所有 duration 收敛到常量表。

2. **“明显参与”在 Phase 2 的系统信号怎么定义？**
   - What we know: 不能依赖语义判断，也不能每轮强奖励。
   - What's unclear: Phase 2 在没有真实语音判断前，用什么代理信号触发强视觉奖励。
   - Recommendation: 先用显式 debug flag / mocked participation signal / 后续 speaking hook 接口占位，不在本 phase 发明语义判断。

3. **老师英文话术池需要多少变体才不会像模板机？**
   - What we know: Phase 2 重点是带班与过渡，不是复杂反馈。
   - What's unclear: 一轮一条固定文案是否会过于机械。
   - Recommendation: 规划 1 个轻量 script table，按 phase 提供 2-3 个可轮换变体，但保持句长短、语气稳定。

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.4 + Testing Library 16.3.2 |
| Config file | `vitest.config.ts` |
| Quick run command | `npm run test:unit` |
| Full suite command | `npm run test:unit && npm run test:e2e` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CLAS-02 | 固定三角色结构持续可见，seat 与 podium 不互相替代 | unit | `npm run test:unit -- test/unit/classroom-shell.test.tsx` | ✅ |
| CLAS-03 | 老师驱动一次点一个人作答，当前发言人唯一 | unit | `npm run test:unit -- test/unit/classroom-shell.test.tsx` | ✅ |
| CLAS-04 | Bobby 固定前置示范，给孩子准备空间 | unit | `npm run test:unit -- test/unit/classroom-shell.test.tsx` | ✅ |
| TEAC-01 | 老师话术与过渡按 phase 输出 | unit | `npm run test:unit -- test/unit/classroom-shell.test.tsx` | ✅ |
| AICL-01 | Bobby 呈现为可信同龄同学，不是播报器 | unit | `npm run test:unit -- test/unit/classroom-shell.test.tsx` | ❌ Wave 0 |
| AICL-02 | Bobby 有轻微停顿/不完美但不拖节奏 | unit | `npm run test:unit -- test/unit/classroom-shell.test.tsx` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run test:unit`
- **Per wave merge:** `npm run test:unit && npm run test:e2e`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `test/unit/classroom-orchestrator.test.ts` — 直接覆盖 reducer 的 phase 转移、沉默分支、奖励 gate
- [ ] `test/unit/teacher-script.test.ts` — 覆盖话术池不泄露 child-facing target text 的规则
- [ ] `test/unit/bobby-script.test.ts` — 覆盖轻微不完美 envelope，不允许进入救场路径

## Sources

### Primary (HIGH confidence)
- React docs: `useReducer` — https://react.dev/reference/react/useReducer
- React docs: Extracting State Logic into a Reducer — https://react.dev/learn/extracting-state-logic-into-a-reducer
- React docs: Reusing Logic with Custom Hooks — https://react.dev/learn/reusing-logic-with-custom-hooks
- Next.js docs: Server and Client Components — https://nextjs.org/docs/app/getting-started/server-and-client-components
- Motion docs: AnimatePresence — https://motion.dev/docs/react-animate-presence
- Vitest docs: Timers — https://vitest.dev/guide/mocking/timers
- Testing Library docs: Appearance and Disappearance — https://testing-library.com/docs/guide-disappearance/
- npm registry via CLI: `npm view react|next|framer-motion|vitest version time --json`

### Secondary (MEDIUM confidence)
- None

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - 基于现有仓库依赖与官方文档双重验证，无需新库
- Architecture: HIGH - 与当前代码结构直接对齐，且官方文档支持 reducer/custom hook/server-client boundary 模式
- Pitfalls: HIGH - 一半来自已锁定决策与现有代码偏差，一半来自官方推荐模式的反面案例

**Research date:** 2026-04-16
**Valid until:** 2026-05-16
