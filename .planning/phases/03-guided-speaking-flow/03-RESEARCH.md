# Phase 3: Guided Speaking Flow - Research

**Researched:** 2026-04-20
**Domain:** Stage-driven guided speaking flow on top of an existing classroom orchestrator
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
#### 阶段推进结构
- **D-01:** Phase 3 采用“先整轮 `repeat-after-teacher`，再整轮 `picture-talk`”的分段推进，不做每个 item 内反复切换模式的编排。
- **D-02:** 当前 `lesson.stages` 仍然是这轮 guided speaking flow 的主要骨架，Phase 3 优先复用既有 `repeat-after-teacher` 和 `picture-talk` stage，而不是重定义课程层级。

#### 输出要求如何逐步变难
- **D-03:** 难度爬坡按 stage 提高要求，而不是在单个 stage 内再拆细层级。
- **D-04:** 在 `repeat-after-teacher` 阶段，孩子可以直接跟读。
- **D-05:** 进入 `picture-talk` 阶段后，老师直接提问，孩子看图回答。

#### 复述轮的角色顺序
- **D-06:** `repeat-after-teacher` 阶段里每个 item 固定走 `Teacher model -> Bobby model -> My turn`。
- **D-07:** Bobby 在复述轮中的存在感仍需保留，用来延续“先听别人，再轮到自己”的小班课堂感，而不是在 Phase 3 把 Bobby 降成可有可无。

#### 孩子开口回合的推进信号
- **D-08:** Phase 3 先用课堂内“已开口”确认来推进课堂，不在这一期引入自动语音触发。
- **D-09:** 这一版的重点是把 guided speaking flow 跑顺，而不是提前把“是否说对”或“是否被系统听见”变成当前 phase 的门槛。

#### `picture-talk` 轮的提问与尝试次数
- **D-10:** `picture-talk` 阶段里，老师采用直接提问方式，例如 `What is it?` 或 `What do you see?`，不先铺很长的观察引导。
- **D-11:** `picture-talk` 阶段中，同一个 item 最多给孩子两次回答机会。
- **D-12:** 第一次没接上时，老师先给一个很轻的口头推动，再问第二次，但不进入提示答案或半提示阶段。
- **D-13:** 如果两次都没接上，再由老师收束并切到下一题，保持课堂节奏不中断。

#### 与前置 phase 保持一致的约束
- **D-14:** 面向孩子的主流程继续保持英文优先，不退回中英混合解释型课堂。
- **D-15:** 图片和儿童主视图默认仍不显示目标词句，继续维持“事物 -> 语言”的直接联系。
- **D-16:** Bobby 仍然只承担示范和缓冲作用，不在孩子沉默时救场；孩子沉默后的控场权仍在老师手里。

### the agent's Discretion
- `repeat-after-teacher` 与 `picture-talk` 两个 stage 的精确 item 数量分配与切题节奏
- “已开口确认”在 UI 上的具体呈现方式
- 两次尝试之间的等待时长、动画节奏与讲台状态变化
- 老师在直接提问型 `picture-talk` 里的英文话术池与轮换策略

### Deferred Ideas (OUT OF SCOPE)
- 自动语音触发推进与麦克风触发可靠性
- `picture-talk` 第二次机会里的半提示/首音提示
- 更复杂的“item 内先复述再看图”混合爬坡
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONT-03 | 课堂流程以图片作为主要理解线索，而不是依赖中文解释 | stage prompt、teacher script 与 lesson board 需要继续 child-safe / image-first，不泄露 target text |
| CONT-04 | 同一节课内容可以支撑多轮重复练习，并逐步提高输出要求 | 复用现有 `lesson.stages`，在同一批 item 上先复述、后看图回答 |
| TEAC-02 | 用户能从老师那里获得温和的等待、鼓励和明确的点名作答提示 | 需要把老师在 repeat-after-teacher / picture-talk 两条流里的控场话术进一步分化 |
| SPKG-01 | 用户可以在前期练习轮次中跟随老师复述目标语言 | 需要明确“孩子已开口确认”的推进信号与复述轮 turn order |
</phase_requirements>

## Summary

Phase 3 最适合在现有 Phase 2 orchestrator 之上增加“stage-aware speaking state”，而不是推翻现有 reducer 另建一套课堂流。当前代码已经稳定表达了单 item 的老师控场、Bobby 示范、孩子上台、老师收束与奖励 gate；Phase 3 的新增复杂度来自“同一批 item 跨 stage 重复出现，并且每个 stage 的发言规则不同”。因此推荐做法是：保留当前 orchestrator 作为单轮 turn engine，再加上一个更外层的 stage/index 驱动层，负责决定当前属于 `repeat-after-teacher` 还是 `picture-talk`，以及该 stage 下老师、Bobby、孩子各自该做什么。

最关键的建模点不是语音识别，而是“参与确认”。因为用户已经锁定本 phase 不引入自动语音触发，所以系统需要一个明确但轻量的 participation signal，既能推进课堂，又不把正确性判断提前带进来。最佳路径是把“已开口”视为一个显式事件，和现有 reducer 里的 `student_spoke` 一样成为可测试、可驱动的状态跃迁，而不是把它隐藏成 UI 层的临时标记。

**Primary recommendation:** 扩展现有 `useClassroomOrchestrator`，把 lesson stage 和 participation signal 接入同一个 reducer/view-model；`repeat-after-teacher` 与 `picture-talk` 共享壳体，但使用不同的 teacher/Bobby line 选择器和不同的 item completion rules。

## Project Constraints (from AGENTS.md)

- 优先通过 GSD phase workflow 推进，规划与实现必须同步。
- MVP 必须持续聚焦“课堂感”验证，而不是扩展成功能练习器。
- 英文优先、图片驱动理解是产品假设的一部分。
- 宽松作答处理应服务于信心和节奏，不做严格发音评分。
- 技术选型优先使用成熟社区包，不手搓基础能力库。

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | repo existing | 继续用 `useReducer` / custom hook 承接 stage-aware flow | 现有 orchestrator 已建立 reducer 模式，继续扩展成本最低 |
| Next.js App Router | repo existing | lesson route 继续 server entry，课堂仍是 client boundary | 与现有 `/lesson/[sessionId]` 数据边界一致 |
| Framer Motion | repo existing | 维持讲台切换、奖励浮层和 speaker swap | Phase 2 已稳定使用，无需改栈 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | repo existing | reducer/stage transitions/participation events 测试 | Phase 3 的核心风险都可先在 unit 层锁住 |
| Testing Library | repo existing | 从用户可见结果验证 stage 文案、席位与讲台状态 | 验证 teacher/Bobby/student 的不同 stage 呈现 |
| Playwright | repo existing | 浏览器 smoke，确保从首页进课到 guided speaking flow 可见 | 每波合并前跑 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| 扩展现有 orchestrator | 新建第二套 `useSpeakingFlow` | 会把课堂规则拆散成两套状态源，执行期易打架 |
| 显式 participation event | 自动 microphone/speech trigger | 提前引入不稳定依赖，偏离本 phase 范围 |
| 复用 `lesson.stages` | 重新定义 stage schema | 当前 schema 已能表达复述/看图，重定义收益不高 |

## Architecture Patterns

### Pattern 1: Outer Stage Loop + Inner Turn Engine
**What:** lesson stage 决定“这一轮是什么类型的开口任务”，现有 orchestrator 决定“这一题的老师/Bobby/孩子顺序如何推进”。  
**When to use:** 当同一批 item 需要跨多个 stage 重复出现，但每个 stage 内仍然是确定性的 turn chart。  
**Why:** 这让 planner 可以把 Phase 3 分成“接入 stage awareness”与“细化 speaking rules”两层，而不是在一个超大 reducer 里同时处理一切。

### Pattern 2: Participation Signal as Explicit Reducer Event
**What:** “孩子已开口”必须是 reducer 里的显式事件，例如 `student_confirmed_speaking` / `student_attempt_confirmed`，而不是组件局部 state。  
**When to use:** 所有复述轮与看图轮的完成判断。  
**Why:** 用户已经明确本 phase 不做自动语音触发，所以推进信号必须是清晰、可测试、可替换的占位契约。

### Pattern 3: Stage-Specific Script Selectors
**What:** 老师与 Bobby 的 script 选择器需要感知当前 stage。  
**When to use:** `repeat-after-teacher` 里老师做 model / Bobby 做 model / 孩子跟读；`picture-talk` 里老师直接问、Bobby 不再做标准 rescue。  
**Why:** Phase 2 的 phase-based script 已有基础，但还不区分 lesson stage；Phase 3 应优先扩展 selector，而不是把分支堆回组件。

### Pattern 4: Image-First Board, Stage-Aware Prompt
**What:** `LessonBoard` 继续保持不显示目标词，但 stage prompt 应随着复述轮/看图轮变化。  
**When to use:** 同一 item 在不同 stage 中重复出现时。  
**Why:** 这正是 CONT-03 和 CONT-04 的交叉点：同一图片重复出现，但孩子承担的输出要求更高。

## Recommended Project Structure

```text
src/features/classroom-shell/
├── classroom-orchestrator.ts          # 扩展 reducer: stage-aware speaking events
├── use-classroom-orchestrator.ts      # 扩展 stage loop / participation signal / derived view-model
├── teacher-script.ts                  # 增加 repeat-after-teacher / picture-talk script selectors
├── bobby-script.ts                    # 增加 repeat-after-teacher only model line contract
├── podium-view-model.ts               # 区分复述轮 / 看图轮的讲台状态与 caption
├── classroom-shell.tsx                # 接入 stage-aware UI and participation affordance
└── lesson-board.tsx                   # 更新 stage prompt，但继续不泄露 target text

test/unit/
├── classroom-orchestrator.test.ts     # 新增 stage + participation signal 覆盖
├── teacher-script.test.ts             # 新增 stage-specific teacher line coverage
├── bobby-script.test.ts               # 新增 repeat-after-teacher 限定覆盖
└── classroom-shell.test.tsx           # 新增可见行为回归
```

## Anti-Patterns to Avoid

- **把 participation confirmation 做成纯 UI 层 flag:** 这样后续接入真实语音时很难替换，也不利于 unit test。
- **在 `picture-talk` 里继续沿用复述轮的话术:** 会让用户感觉只是换了文案，没有真正进入“看图回答”。
- **让 Bobby 在 `picture-talk` 里继续标准先示范:** 用户已锁定 `picture-talk` 是老师提问、孩子回答；Bobby 不应把这轮重新拉回复述。
- **为第二次尝试加入答案提示或首音提示:** 这属于 Phase 4 的 hints 范围，本 phase 只允许轻推动再问一次。
- **为了“真实感”提前接麦克风自动触发:** 会把 Phase 3 的执行风险从课堂编排转成音频可靠性。

## Common Pitfalls

### Pitfall 1: Stage 和 turn phase 混成一个平面状态
**What goes wrong:** reducer 同时用一个 `phase` 字段表达 lesson stage 和 speaker turn，最后分支爆炸。  
**How to avoid:** 保留“lesson stage”和“turn phase”两个维度，view-model 再把它们组合成 UI 输出。

### Pitfall 2: 同一 item 的重复出现没有明显升级感
**What goes wrong:** `repeat-after-teacher` 和 `picture-talk` 对同一张图只换了文案，没有真正改变孩子的任务。  
**How to avoid:** 让 `picture-talk` 的 completion rule 与 teacher question 明确不同于复述轮。

### Pitfall 3: 第二次机会变成 Phase 4 提示系统
**What goes wrong:** 一看到“最多两次机会”，实现就开始加首音提示、答案词片、更多支架。  
**How to avoid:** 第二次机会只允许轻推动加重问，不给内容提示。

### Pitfall 4: 现有 no-leak 规则被 stage prompt 破坏
**What goes wrong:** 为了帮助孩子回答，在 `picture-talk` 的 stage prompt 或讲台 caption 里又把目标词写出来。  
**How to avoid:** 明确区分 child-facing prompt、teacher-facing debug text 与 internal target text。

## Open Questions

1. “已开口确认”在 UI 上最终是按钮、讲台状态条，还是更隐性的确认 affordance？  
Recommendation: planning 时把它作为单独任务明确，不与语音输入混写。

2. `picture-talk` 的第二次机会是否还沿用同一句提问，还是允许轻微重述？  
Recommendation: 规划时允许 teacher script 提供一组 re-ask 变体，但不改变“直接问”的教学意图。

3. 是否需要在 `wrap-up` 前显式记录某个 item 已完成复述轮和看图轮？  
Recommendation: 是，至少在内部 state 里记录 stage/item completion，供 Phase 5 整合课时复用。

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest + Testing Library + Playwright |
| Config file | `vitest.config.ts`, `playwright.config.ts` |
| Quick run command | `npm run test:unit` |
| Full suite command | `npm run test:unit && npm run test:e2e` |
| Estimated runtime | ~15-25 seconds |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONT-03 | 同一图片重复出现但 child-facing 仍无 target text 泄露 | unit | `npm run test:unit -- test/unit/classroom-shell.test.tsx test/unit/lesson-board.test.tsx` | ✅ partial |
| CONT-04 | 同一批 item 先复述再看图回答，stage 明确升级 | unit | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts` | ✅ partial |
| TEAC-02 | 老师在复述轮和看图轮提供不同的等待/鼓励/点名话术 | unit | `npm run test:unit -- test/unit/teacher-script.test.ts test/unit/classroom-shell.test.tsx` | ✅ partial |
| SPKG-01 | 前期轮次允许孩子跟随老师示范复述，并用显式 participation signal 推进 | unit | `npm run test:unit -- test/unit/classroom-orchestrator.test.ts test/unit/classroom-shell.test.tsx` | ✅ partial |

### Sampling Rate
- **Per task commit:** `npm run test:unit`
- **Per wave merge:** `npm run test:unit && npm run test:e2e`
- **Phase gate:** Full suite green before phase verification

### Recommended Task-Level Coverage
- Wave 1 should establish stage-aware reducer contracts and participation events first.
- Wave 2 should lock script behavior and board/podium prompts for repeat-after-teacher vs picture-talk.
- Wave 3 should wire the shell and browser smoke so the homepage-to-lesson path still passes while new guided speaking behavior becomes visible.

## Sources

### Primary (HIGH confidence)
- Local codebase contracts in `src/features/classroom-shell/*`
- Local lesson schema and seed content in `src/features/lesson-config/lesson-schema.ts` and `content/lessons/week-01/lesson-01.ts`
- Phase 03 context and prior phase context/verification docs

### Secondary (MEDIUM confidence)
- None required; this phase primarily extends an already-established local architecture

## Metadata

**Confidence breakdown:**
- Architecture: HIGH — directly grounded in the current codebase and the newly locked user decisions
- Validation: HIGH — existing test harness already covers the relevant surfaces and only needs focused extension
- UI direction: HIGH — Phase 3 explicitly evolves the current approved classroom shell rather than introducing a new visual system

**Research date:** 2026-04-20
**Valid until:** 2026-05-20
