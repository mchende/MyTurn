# Phase 05: Complete MVP Lesson - Research

**Researched:** 2026-04-22
**Domain:** Next.js App Router 下的课堂编排收口、网页端闭环返回与首页完成态表达
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

### 整节课节奏编排
- **D-01:** Phase 5 的完整课堂采用四段式结构：`开场热身 -> 复述主段 -> 看图主段 -> 结课收束`，而不是把所有练习揉成一段混合流程。
- **D-02:** 复述主段和看图主段在整节课中的权重保持前后均衡；复述不是匆匆带过，看图也不是只做收尾。
- **D-03:** `开场热身` 采用老师带班开场，先有 greeting、点名感和入课状态，再进入第一题，不直接冷启动到题目本身。
- **D-04:** `结课收束` 由老师口头完成 goodbye / praise / class closing，并把界面带入明确的完成态，让孩子知道这节课真的结束了。

### 后半程看图作答强度
- **D-05:** `picture-talk` 的主要任务形式是“老师基于图片发问，孩子回答”，不走开放式自由描述路线。
- **D-06:** Phase 5 的后半程看图作答仍以低门槛简单问题为主；每张图只问一个简单问题，不在本阶段继续抬高到更开放或更长句的回答要求。
- **D-07:** 如果孩子在后半程连续多题只能靠 fallback 过，课堂也继续自然推进，不降级回前半程复述结构，不临时改成补救型练习器。
- **D-08:** 看图题作答成功后，老师只给很短的课堂式肯定，再立刻切入下一题，保持小班课的推进感而不是每题做显式奖励。

### 结课与完成态
- **D-09:** 强视觉 reward 只在整节课结束时出现一次，不在中途穿插小庆祝。
- **D-10:** reward 之后先停留在课堂页的完成态，让孩子仍然像“刚下课还在教室里”，而不是立刻跳走。
- **D-11:** 完成态大约停留 3 秒后自动跳回首页，形成网页端的完整闭环。

### 首页收口与网页闭环
- **D-12:** 首页需要做响应式重排；在较窄视口下改用更稳的重排布局，保证中部和右侧内容仍可见，而不是继续硬撑当前三栏结构。
- **D-13:** 自动返回首页后，刚上完的这节课需要显示明确的已完成状态，并保留“刚完成一节课”的余温，而不是立刻恢复成无事发生的普通首页。

### Claude's Discretion
- 四段式课堂中每一段的精确时长、切换节拍、teacher timer 和动画停顿
- 开场热身与结课收束的具体英文话术池，以及是否按 session item 数量动态缩放停留时长
- 完成态 3 秒内 reward、老师收束文案、完成卡片和自动跳转之间的具体先后顺序
- 首页响应式重排的具体断点、栏位压缩策略、堆叠顺序和视觉保真度
- 首页“已完成”课卡的具体 copy、图标和状态呈现，只要保持刚完成课程的余温而不引入新的结果页能力

### Deferred Ideas (OUT OF SCOPE)
- 更开放或更高难度的 picture-talk 输出要求，例如同图多问、长句回答或开放描述
- 真实语音采集、ASR 转写、实时语义判断与低延迟在线课堂技术方案
- 独立的课后总结页、学习报告页或家长侧结果页
- 多课次连续学习、课程进度体系和更复杂的已完成历史视图
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SPKG-02 | 用户可以在后期练习轮次中根据图片回答老师提问，并允许表达与标准答案意义相近 | 保持 `picture-talk` 的老师提问形态，继续复用 `pictureTalk.semanticAccepts` + `judgeStudentAttempt()`，不要升级成开放描述或新评分引擎 |
| PLAT-02 | 用户无需安装原生 App，就能在网页中完成整节 MVP 课程 | 在现有 `/lesson/[sessionId] -> /` 路由链上完成开场、主流程、结课、reward、3 秒自动回首页与首页完成余温，不新增结果页或原生依赖 |
</phase_requirements>

## Summary

当前代码已经具备 Phase 5 的关键底座：课堂主流程由单一 reducer + hook 驱动，`repeat-after-teacher -> picture-talk`、hint / fallback / final follow、homepage 进课路由、Vitest/Playwright 基线都已验证通过。Phase 5 不需要换栈，也不应该重写状态机；要做的是把 Phase 4 的已验证 guided flow 外面包上 teacher-owned 的开场和结课收口，并把课堂完成后的首页余温接回现有 schedule/homepage 链路。

对 planner 最重要的技术判断有三点。第一，`buildGuidedStageRuns()` 和 `judgeStudentAttempt()` 应继续只服务被判断的 guided speaking 主段，`warmup` / `wrap-up` 不要硬塞进现有 judged queue，否则会直接冲击 Phase 3/4 的已通过测试合同。第二，首页“刚完成一节课”的状态应作为 URL 级或页面级短时覆盖态处理，而不是扩展 `SessionAccessState` 这类真实时间状态。第三，当前首页 `h-screen + overflow-hidden + 固定双列主区` 是 Phase 5 的网页闭环短板，响应式收口要依赖 Tailwind 的 mobile-first 和 breakpoint range，而不是加 JS resize 逻辑。

项目层面没有发现 repo-local `.claude/skills/` 或 `.agents/skills/` 目录；约束主要来自 `AGENTS.md`。当前 focused 回归也已重跑并通过：41 个 unit tests 通过，`classroom-entry` / `guided-speaking-flow` 共 4 个 E2E smoke 通过。

**Primary recommendation:** 保留现有 reducer/hook/judgment/test 架构不动，把 Phase 5 实现拆成“teacher-owned warmup/closing 包裹现有 guided queue”加“lesson 完成后用 `router.replace` 回首页并用短时 completion override 显示余温”两条主线。

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.3 in repo; latest verified 16.2.4 (published 2026-04-15) | App Router 页面、首页与 lesson 路由 | 现有项目已完整落在 App Router；Phase 5 的 auto-return 直接依赖 `next/navigation` 客户端导航 |
| React | 19.2.5 | Client component、reducer、effect-based lesson scheduler | 现有课堂 orchestrator 已稳定建立在 React hooks 上，不需要另引状态框架 |
| Tailwind CSS | 4.2.2 in repo; latest verified 4.2.4 (published 2026-04-21) | 首页和课堂页响应式布局、视觉收口 | Tailwind v4 的 mobile-first + `max-*` range 适合处理 Phase 5 的中窄视口重排 |
| Framer Motion | 12.38.0 | reward overlay、主页和课堂轻动效 | 代码已在首页与课堂中使用，足够承载单次结课奖励和过渡 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zod | 4.3.6 | lesson item / picture-talk metadata schema | 若 Phase 5 需要补 warmup / closing 元数据或 completion state contract，继续沿 schema 扩展 |
| fastest-levenshtein | 1.0.16 | repeat-after-teacher 的近似匹配 | 只保留在 repeat 判断，不扩展成 picture-talk 语义引擎 |
| Vitest | 4.1.4 in repo; latest verified 4.1.5 (published 2026-04-21) | reducer、hook、view-model 单测 | 每次改 orchestrator、homepage completion override、timer contract 都先跑 |
| Playwright | 1.59.1 | homepage -> lesson -> lesson complete 的浏览器 smoke | Phase 5 需要新增完整闭环 spec，并保留现有 focused smoke |
| shadcn/ui primitives | repo scaffolded | card/button/badge 等基础 UI 原语 | 首页完成态、状态 badge、CTA 继续复用，不另起 UI 基础库 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| 现有 reducer + hook orchestrator | XState / Zustand / 第二套状态控制器 | Phase 5 目标是收口而不是重构，引入新状态层会直接放大回归面 |
| URL / 页面级短时 completion override | 扩展 `SessionAccessState` 或 `sessionStorage` 持久态 | `SessionAccessState` 表示真实时钟状态；把“刚完成”塞进去会污染 schedule truth，`sessionStorage` 也更难做 deterministic 测试 |
| Tailwind breakpoint utilities | JS resize listeners / ResizeObserver layout controller | 对当前首页只是布局重排问题，没必要引入额外客户端状态和 hydration 风险 |

**Installation:**
```bash
npm install
```

本 phase 不需要新增依赖，也不建议顺手做核心版本升级。保持现有 lockfile 即可。

**Version verification:** 2026-04-22 通过 `npm view` 核验。

| Package | Latest verified | Publish date | Repo pin | Guidance |
|---------|-----------------|--------------|----------|----------|
| next | 16.2.4 | 2026-04-15 | 16.2.3 | Phase 5 不升级 |
| react | 19.2.5 | 2026-04-08 | 19.2.5 | 与 repo 一致 |
| tailwindcss | 4.2.4 | 2026-04-21 | 4.2.2 | Phase 5 不升级 |
| framer-motion | 12.38.0 | 2026-03-17 | 12.38.0 | 与 repo 一致 |
| zod | 4.3.6 | 2026-01-22 | 4.3.6 | 与 repo 一致 |
| vitest | 4.1.5 | 2026-04-21 | 4.1.4 | Phase 5 不升级 |
| @playwright/test | 1.59.1 | 2026-04-01 | 1.59.1 | 与 repo 一致 |

## Architecture Patterns

### Recommended Project Structure
```text
src/
├── app/
│   ├── (marketing)/              # 首页路由与 searchParams completion override
│   └── lesson/[sessionId]/       # 课堂路由，接入完整 lesson 与 auto-return
├── features/classroom-shell/     # reducer、hook、teacher/bobby script、podium、board
├── features/homepage/            # 首页排版与完成余温表现
├── features/schedule/            # session accessState 与 session card/view-model
└── lib/time/                     # deterministic now / access state helpers
content/
└── lessons/                      # lesson items 与 picture-talk metadata
test/
├── unit/                         # reducer、hook、view-model contract
└── e2e/                          # homepage/lesson browser smoke
```

### Pattern 1: 用 teacher-owned 外层段落包住现有 guided queue
**What:** 保留 `GUIDED_STAGE_IDS = ['repeat-after-teacher', 'picture-talk']` 和现有 judged path，不把 `warmup` / `wrap-up` 塞进 `buildGuidedStageRuns()`；改为在 orchestrator 中增加更外层的 lesson segment 或 scripted transition，让开场与结课只走 teacher-owned timer/script。

**When to use:** 需要做 `开场热身 -> guided main -> 结课收束`，但又不能破坏 Phase 3/4 已验证的 repeat/picture/fallback 合同时。

**Example:**
```typescript
// Source: src/features/classroom-shell/use-classroom-orchestrator.ts
useEffect(() => {
  if (state.phase === 'wrap_up') {
    return;
  }

  const timer = window.setTimeout(() => {
    dispatch(getScheduledEvent(state.phase));
  }, CLASSROOM_TIMINGS[state.phase]);

  return () => window.clearTimeout(timer);
}, [state.phase]);
```

**Planning guidance:** 新增 lesson-level segment 时，继续让“一个 phase 只挂一个 timer”成立；不要在 shell 组件里再挂第二条 timeout 链。

### Pattern 2: 用 URL 级 completion override 表达首页“刚完成”
**What:** 课堂完成后从 client component 通过 `useRouter().replace()` 跳回首页，并带上已完成 session 的轻量标识；首页据此覆盖对应 session card/hero 的视觉状态，但不改真实 `SessionAccessState`。

**When to use:** 需要满足 `PLAT-02` 的网页闭环，又不想引入结果页、数据库或全局 store。

**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/use-router
'use client';

import { useRouter } from 'next/navigation';

const router = useRouter();
router.replace('/?completedSession=weekday-1700', { scroll: false });
```

**Planning guidance:** 推荐把 completion override 解析放在首页 route/page 层，再传给 `getTodayScheduleViewModel()` 或 homepage shell，而不是直接在多个组件里各自读 query string。

### Pattern 3: 用快慢两套 timing profile，而不是把测试跑成 15 分钟
**What:** 当前 `CLASSROOM_TIMINGS` 与 E2E 已经围绕秒级时序建立。Phase 5 若要做更像“15 分钟课”的节奏，应该保留单一 timing source，并允许 manual/demo 与 automated test 使用不同的 profile 或 scale。

**When to use:** 需要同时满足人工体验更像完整短课，以及 CI/本地回归仍然可运行。

**Example:**
```typescript
// Source pattern: src/features/classroom-shell/classroom-orchestrator.ts
export const CLASSROOM_TIMINGS = {
  teacher_prompt: 1800,
  ai_model: 1800,
  student_wait: 2200,
  teacher_encourage: 1600,
  teacher_fallback_model: 1800,
  teacher_echo: 1400,
  teacher_feedback: 1600,
  move_next: 600,
};
```

**Planning guidance:** 把 Phase 5 的节拍调优也收敛到 central timings / profile 层，不要把 magic numbers 散在 `teacher-script.tsx`、`homepage-shell.tsx`、`classroom-shell.tsx`。

### Pattern 4: 首页响应式收口用 mobile-first + breakpoint range
**What:** 当前首页依赖 `h-screen`, `overflow-hidden` 和固定左右结构。Phase 5 应改为在中窄视口下允许纵向流式布局，必要时保留桌面 rail，仅在更宽断点启用双列/三列结构。

**When to use:** 修复 D-12 中“中部和右侧像消失一样”的问题。

**Example:**
```html
<!-- Source: https://tailwindcss.com/docs/breakpoints -->
<div class="md:max-xl:flex">
  ...
</div>
```

**Planning guidance:** 推荐目标是：
- `xl` 以上保留桌面课堂感布局
- `md:max-xl` 改为 hero 在上、timeline 在下的单主列
- 小于 `md` 时允许页面纵向滚动，去掉硬性 `overflow-hidden`

### Anti-Patterns to Avoid
- **把 `warmup` / `wrap-up` 纳入 `GUIDED_STAGE_IDS`:** 现有 unit tests 明确断言只有 `repeat-after-teacher` 与 `picture-talk` 两个 guided runs，硬改会立刻破坏 Phase 3/4 基线。
- **把“刚完成一节课”做成新的真实 schedule state:** `SessionAccessState` 只表示时间窗口；recent-complete 是一次导航后的 UI overlay，不是时钟真相。
- **在 `ClassroomShell`、homepage、route 各自挂 redirect timer:** 会导致 reward、closing copy、自动返回顺序失控，也会让测试变脆。
- **为了 SPKG-02 临时提升 picture-talk 难度:** 本 phase 只需要老师问、孩子答、语义相近可过，不需要开放描述和更长句输出。

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| picture-talk 判断 | 新的语义评分器、LLM/NLP 评分、ASR 链路 | `pictureTalk.semanticAccepts` + `judgeStudentAttempt()` | v1 requirement 只需“意义相近可过”；当前 adapter 已能覆盖并且已测试 |
| lesson 编排 | 第二套状态机/全局 store/页面级同步器 | 现有 `classroomOrchestratorReducer` + `useClassroomOrchestrator` | 现有 reducer 已承载 phase progression、hint、fallback、reward visibility |
| 首页响应式 | JS resize controller | Tailwind mobile-first + breakpoint range utilities | 这是纯布局问题，CSS 足够，JS 只会增加复杂度 |
| 完成闭环 | 新结果页、后端持久化“完成记录” | URL 级 completion override + 现有首页 session cards | Phase 5 只要保留“刚完成一节课”的余温，不需要做完整历史系统 |

**Key insight:** Phase 5 的高风险不在于“功能不够”，而在于“收口时把已验证基线打散”。最稳的做法是继续围绕现有 reducer、schedule view-model、home/lesson route 两条链整合，不横向扩基础设施。

## Common Pitfalls

### Pitfall 1: 为了四段式课堂而重构 guided queue
**What goes wrong:** 为了加开场和结课，把 `buildGuidedStageRuns()`、`GuidedStageId`、`judgeStudentAttempt()` 一起泛化，结果 Phase 3/4 的 repeat/picture/fallback 合同一起松动。
**Why it happens:** 看到 lesson schema 里已有 `warmup` / `wrap-up`，误以为应该直接并入同一条 judged queue。
**How to avoid:** 保持 guided queue 只处理需要作答判断的主段；开场和结课只走 teacher-owned script/timer。
**Warning signs:** `GUIDED_STAGE_IDS` 改成 4 个值、现有 Playwright `guided-speaking-flow.spec.ts` 断言大面积改写、`classroom-judgment.ts` 开始处理 `warmup`。

### Pitfall 2: 首页完成态与真实时钟状态混淆
**What goes wrong:** 自动回首页后 session 既像“已完成”又像“仍可入场”，或刷新后状态不一致。
**Why it happens:** 直接扩展 `SessionAccessState` 或直接改 `getTodayScheduleViewModel()` 的真实时间分支。
**How to avoid:** 把“recently completed”设计成一次导航带回来的 overlay state，由首页 route 在渲染层叠加。
**Warning signs:** `accessState` 枚举新增 `just_completed` 这类值，或者 time helpers 开始读取 query string / local storage。

### Pitfall 3: reward、closing、redirect 顺序散落在多个组件
**What goes wrong:** 有时先跳走看不到 reward，有时 reward 悬浮太久，有时首页还没显示余温。
**Why it happens:** 在 shell、route、homepage 各自写 `setTimeout()`。
**How to avoid:** 只保留一个 completion flow owner，推荐在 orchestrator/hook 侧产出明确完成信号，再由单个 client effect 负责 redirect。
**Warning signs:** 多个文件同时出现 3000ms timer，或测试里必须大量 `waitForTimeout()` 才能稳定。

### Pitfall 4: 中窄视口继续硬撑 desktop homepage
**What goes wrong:** hero 卡、timeline、右侧信息在平板窄横屏或小桌面上被裁切或看不见。
**Why it happens:** 首页顶层仍使用 `h-screen` + `overflow-hidden` + 固定栏宽。
**How to avoid:** 小于桌面断点时允许垂直滚动，改为单主列或上下堆叠。
**Warning signs:** Playwright viewport 不溢出但内容肉眼不可见；必须横向滚动或缩放才能看到 timeline。

### Pitfall 5: 让 SPKG-02 变成“开放描述”任务
**What goes wrong:** planner 把后半程 picture-talk 设计成多问、长句或自由描述，导致 content metadata 和测试都跟不上。
**Why it happens:** 把“完整课收口”误解成“继续加能力”。
**How to avoid:** 继续坚持每图一个简单问题、语义相近即可通过。
**Warning signs:** `pictureTalk.semanticAccepts` 不再够表达验收条件，开始讨论自由语义或多轮追问。

## Code Examples

Verified patterns from official sources and current codebase:

### Single Timer Scheduler for Lesson Phases
```typescript
// Source: src/features/classroom-shell/use-classroom-orchestrator.ts
useEffect(() => {
  if (state.phase === 'wrap_up') {
    return;
  }

  const timer = window.setTimeout(() => {
    dispatch(getScheduledEvent(state.phase));
  }, CLASSROOM_TIMINGS[state.phase]);

  return () => window.clearTimeout(timer);
}, [state.phase]);
```

### Pure Judgment Adapter Boundary
```typescript
// Source: src/features/classroom-shell/classroom-judgment.ts
export function judgeStudentAttempt(input: {
  lessonItem: LessonItem;
  stageId: JudgmentStageId;
  transcript: string | null | undefined;
  attemptIndex: number;
}): StudentAttemptJudgment {
  if (input.stageId === 'picture-talk') {
    return judgePictureTalkAttempt(...);
  }

  return judgeRepeatAttempt(...);
}
```

### App Router Client Navigation for Auto-Return
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/use-router
'use client';

import { useRouter } from 'next/navigation';

export function ReturnHomeButton() {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.replace('/?completedSession=weekday-1700', { scroll: false })}>
      Back home
    </button>
  );
}
```

### Tailwind Range Utilities for Mid-Width Reflow
```html
<!-- Source: https://tailwindcss.com/docs/breakpoints -->
<div class="flex flex-col xl:flex-row">
  <section class="min-w-0 xl:flex-[2]">...</section>
  <aside class="min-w-0 xl:w-[360px]">...</aside>
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next/router` / full reload style navigation | App Router `useRouter` from `next/navigation` | Introduced in Next.js v13; current docs updated 2026-03-25 | Phase 5 应使用 client-side `replace()` 完成 lesson -> home 自动回跳 |
| 只靠单一 breakpoint 的 desktop-first 布局 | Tailwind mobile-first + `max-*` breakpoint range | Tailwind v4 current docs | 首页中窄视口可以无 JS 地重排，而不是继续固定三栏 |
| 手工起服务再跑浏览器测试 | Playwright `webServer` config | Playwright current docs | 保持 Phase 5 新增 E2E spec 仍能复用现有本地自动化入口 |

**Deprecated/outdated:**
- `next/router` in App Router code: 当前项目已使用 App Router，Phase 5 不应回退到 Pages Router navigation APIs。
- “新增结果页再返回首页”这类中间路由方案：对当前 MVP 是过度设计，会打破“还在教室里 -> 回到首页”的课堂闭环感。

## Open Questions

1. **首页完成余温要持续多久？**
   - What we know: D-13 要求“刚完成一节课”的余温，但没有要求跨刷新、跨日持久化。
   - What's unclear: 用户是否希望刷新首页后仍保留该态。
   - Recommendation: 本 phase 只做一次导航后的短时 overlay；刷新或脱离当前 URL 后即可消失，不做持久化。

2. **15 分钟的“完整课”是语义时长还是字面 wall-clock？**
   - What we know: roadmap 强调完整 15 分钟课，但现有自动化建立在秒级 timing 上。
   - What's unclear: 是否要把默认 demo 也拉长到接近真实 15 分钟。
   - Recommendation: 计划里把“课堂感 pacing”与“自动化 timing”拆开；人工走查可更松，测试继续快 profile。

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js app, Vitest, Playwright | ✓ | v22.14.0 | — |
| npm | package scripts, `npm view` version checks | ✓ | 11.12.1 | — |
| Playwright CLI | browser smoke / full lesson E2E | ✓ | 1.59.1 | `npx playwright test` |
| Google Chrome channel | current Playwright config (`channel: 'chrome'`) | ✓ | 147.0.7727.102 | 若未来缺失，可改为 Playwright bundled Chromium |

**Missing dependencies with no fallback:**
- None.

**Missing dependencies with fallback:**
- None.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.4 (repo pin) + Playwright 1.59.1 |
| Config file | `vitest.config.ts`, `playwright.config.ts` |
| Quick run command | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx test/unit/classroom-judgment.test.ts test/unit/lesson-schema.test.ts` |
| Full suite command | `npm run test:unit && npm run test:e2e` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SPKG-02 | picture-talk 仍是老师问、孩子答；语义相近表达通过；fallback 不退回练习器 | unit + focused e2e | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-judgment.test.ts` | ✅ |
| PLAT-02 | 从首页入课、完成整节课、出现 reward、3 秒后回首页且显示完成余温 | e2e + homepage view-model unit | `npm run test:e2e -- test/e2e/complete-mvp-lesson.spec.ts` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx test/unit/classroom-judgment.test.ts`
- **Per wave merge:** `npm run test:e2e -- test/e2e/guided-speaking-flow.spec.ts test/e2e/classroom-entry.spec.ts` 加上新的 `complete-mvp-lesson.spec.ts`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `test/e2e/complete-mvp-lesson.spec.ts` — 覆盖 full lesson completion loop、reward 停留、auto-return、homepage recently-completed state
- [ ] `test/unit/get-today-schedule-view-model.test.ts` 或 `test/unit/homepage-shell.test.tsx` — 覆盖 completion override 不污染真实 `accessState`
- [ ] `test/unit/classroom-orchestrator.test.ts` 新增 completion/closing cases — 覆盖 warmup/closing 不破坏 existing guided queue

## Sources

### Primary (HIGH confidence)
- Workspace inspection:
  - `.planning/phases/05-complete-mvp-lesson/05-CONTEXT.md`
  - `.planning/REQUIREMENTS.md`
  - `.planning/STATE.md`
  - `.planning/PROJECT.md`
  - `.planning/ROADMAP.md`
  - `AGENTS.md`
  - `package.json`
  - `src/features/classroom-shell/classroom-orchestrator.ts`
  - `src/features/classroom-shell/use-classroom-orchestrator.ts`
  - `src/features/classroom-shell/classroom-shell.tsx`
  - `src/features/classroom-shell/teacher-script.ts`
  - `src/features/classroom-shell/podium-view-model.ts`
  - `src/features/classroom-shell/classroom-judgment.ts`
  - `src/features/homepage/homepage-shell.tsx`
  - `src/features/schedule/get-today-schedule-view-model.ts`
  - `src/features/schedule/session-card.tsx`
  - `src/features/schedule/build-day-sessions.ts`
  - `src/features/lesson-config/lesson-schema.ts`
  - `content/lessons/week-01/lesson-01.ts`
  - `src/app/lesson/[sessionId]/page.tsx`
  - `test/unit/classroom-orchestrator.test.ts`
  - `test/e2e/classroom-entry.spec.ts`
  - `test/e2e/guided-speaking-flow.spec.ts`
  - `.planning/phases/03-guided-speaking-flow/03-VERIFICATION.md`
  - `.planning/phases/04-hints-and-judgment/04-VERIFICATION.md`
- Official docs:
  - Next.js `useRouter`: https://nextjs.org/docs/app/api-reference/functions/use-router
  - Playwright `webServer`: https://playwright.dev/docs/test-webserver
  - Tailwind responsive design / breakpoints: https://tailwindcss.com/docs/breakpoints
- npm registry via CLI on 2026-04-22:
  - `npm view next version time`
  - `npm view react version time`
  - `npm view tailwindcss version time`
  - `npm view framer-motion version time`
  - `npm view zod version time`
  - `npm view vitest version time`
  - `npm view @playwright/test version time`

### Secondary (MEDIUM confidence)
- None.

### Tertiary (LOW confidence)
- None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - 以 repo 实际依赖、npm registry 版本核验和官方文档交叉确认
- Architecture: HIGH - 关键判断直接来自现有 reducer/hook/homepage/schedule contracts 和已通过测试
- Pitfalls: MEDIUM - 大多基于现有代码结构与 UI/UX 收口风险推断，但已经被当前回归和官方模式支持

**Research date:** 2026-04-22
**Valid until:** 2026-05-22
