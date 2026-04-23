# Phase 06: Audio Classroom Runtime - Research

**Researched:** 2026-04-23
**Domain:** Next.js App Router 下的网页音频课堂运行时、浏览器麦克风权限、老师/Bobby 播放与单 CTA 录音入口
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

### 音频预检与入课入口
- **D-01:** 首次音频预检放在进课前，采用轻量预检流程，检查扬声器与麦克风是否可用。
- **D-02:** 音频预检允许用户跳过后继续进课，但必须明确提示“跳过后可能影响课堂发声/收音体验”。
- **D-03:** 预检的目标是减少正式开课后才发现“没声音/没录上”的情况，不把首页主路径变成重阻断设置流程。

### 老师与 Bobby 发声方式
- **D-04:** 老师与 Bobby 默认自动播报，不要求孩子额外点击播放。
- **D-05:** 课堂中保留常驻字幕，并提供轻量播放状态提示，帮助孩子理解“现在是谁在说话”，但不允许出现遮挡主课件的大音频遮罩层。
- **D-06:** Bobby 的发声边界继续锁定在 `repeat-after-teacher` 的 `ai_model`，Phase 6 不改变这条角色约束。

### 课堂音频调度
- **D-07:** Phase 6 采用单通道顺序音频调度：先播放老师或 Bobby，再进入孩子录音，再进入等待转写/结果反馈，不允许声音重叠。
- **D-08:** 老师/Bobby 播放未完成前，不能提前打开孩子录音；等待转写时也不再并发触发新的老师/Bobby 播放。
- **D-09:** 音频调度应作为统一的课堂运行时能力实现，而不是分散在多个组件内各自处理。

### MVP 技术取向
- **D-10:** Phase 6 技术路线以“先跑通完整课堂 MVP”为第一优先级，稳定性高于语音自然度极致打磨。
- **D-11:** 老师与 Bobby 先共用一层稳定的 TTS 能力，通过 voice/persona 区分角色，而不是一开始做两套完全不同的语音方案。
- **D-12:** 如果某些更自然但更复杂的音频方案会显著拖慢 Phase 6，应优先选择更稳、更容易验证课堂闭环的方案。

### 孩子录音入口
- **D-13:** 讲台区继续保持单 CTA 交互，不拆成多个工具化按钮。
- **D-14:** 录音入口按课堂状态切换文案，例如“开始说 / 录音中 / 再试一次”，保持儿童可理解与课堂一致性。
- **D-15:** Phase 6 不采用长按说话，也不引入“开始录音/结束录音”双按钮工具式交互。

### 失败兜底与课堂感
- **D-16:** 音频失败采用轻提示 + 单 CTA 重试 + 必要时继续课堂的兜底方式，不使用强阻断错误层作为默认路径。
- **D-17:** 麦克风拒权、未录到声音、播放失败等都应给出明确但柔和的课堂化反馈，不能静默失败。
- **D-18:** 课堂感优先级高于技术细节暴露，错误反馈需要像老师继续带班，而不是像系统故障面板。

### Deferred Ideas (OUT OF SCOPE)
- 孩子语音 transcript 与 repeat/picture judgment 的正式接线和成功率优化
- 15 分钟整课节奏校准、人工 UAT 与 full-loop verifier
- 更高级的 TTS 拟人化、情绪化声音设计或角色专属复杂音频链路
- 多个真实孩子同时在线课堂的音频混音与多人轮转
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AUDIO-01 | 老师在示范、点名、鼓励、过渡、wrap-up 与 reward 环节具备稳定可播放的英文语音输出 | 复用 `teacher-script.ts` 的 `spokenModel` / `visibleCaption` 双轨合同，建立共享 TTS + 播放 runtime，不把发声散落到 UI 组件 |
| AUDIO-02 | Bobby 只在 `repeat-after-teacher` 的 `ai_model` 环节发声，并保持可信但不过度完美的同龄感 | 继续以 `bobby-script.ts` 为唯一 spoken source，在 runtime 层硬编码阶段边界 |
| AUDIO-03 | 课堂在播放老师/Bobby 语音时提供清晰但轻量的播放状态反馈，不遮挡主课件区域 | 播放态以教师区、讲台区和字幕条的轻提示表达，不新增大遮罩层 |
| VOICE-01 | 用户可以在浏览器中授权麦克风，并在课堂里进入可用的语音输入状态 | `getUserMedia()` 是麦克风 source of truth；预检和课堂入口必须处理 secure context、权限拒绝和无设备异常 |
| VOICE-02 | 当老师点名孩子作答时，课堂会提供清晰、单一且适合儿童理解的说话入口与录音中反馈 | 录音入口继续落在讲台单 CTA，上下文由统一 runtime 决定是否可点、录音中或重试 |
| VOICE-03 | 当没有录到声音、权限被拒绝或录音失败时，系统会给出不打断课堂节奏的兜底反馈 | 失败兜底要走轻提示 + 单 CTA 重试，不用系统错误面板 |
| CLAS-05 | 播放老师/Bobby 语音、开始录音、等待转写和给出反馈之间由统一的课堂音频调度控制，避免声音重叠或录音被打断 | 建立单通道音频 runtime owner，禁止播放和录音在多个组件中各自抢状态 |
| CLAS-07 | 用户在第一次正式进课前可以完成轻量的扬声器 / 麦克风可用性检查，而不会打断进入课堂的主路径 | 预检应该是进课前的轻量 gate，可跳过但会提示风险 |
| PLAT-03 | 平板横屏上完成整节真实语音课堂时，页面布局、老师区、讲台区、图片区和顶部学生区都保持可见与可用 | 音频态 UI 不能牺牲已修复的课堂布局；播放和录音提示要内嵌到既有区域 |
| PLAT-04 | 在桌面和中等宽度视口下，课堂页面应优先保证完整可见与可滚动，而不是因固定高度裁切核心区域 | 音频模式新增 UI 仍要遵守“完整可见或可滚动”合同 |
</phase_requirements>

## Summary

当前代码已经具备 Phase 6 的两个关键基础。第一，`teacher-script.ts` 和 `bobby-script.ts` 已经把“给孩子看的文字”和“角色真正要说的话”拆成稳定合同，天然适合接一层共享音频 runtime。第二，`useClassroomOrchestrator.ts` 已经是课堂唯一的阶段调度 owner，适合继续承接“何时可以播、何时可以录、何时必须等待”的统一音频编排，而不是在 `classroom-shell.tsx`、`podium-view-model.ts` 和讲台按钮里各自维持状态。

浏览器官方约束决定了 Phase 6 不能把音频能力当成“普通 UI 切换”来做。MDN 明确指出 `navigator.mediaDevices.getUserMedia()` 只在 secure context 中可用，而且权限可能被拒绝、忽略或因设备不存在而失败；`HTMLMediaElement.play()` 也可能因为 autoplay / script-initiated playback policy 被拒绝。基于这些约束，最稳的产品实现不是“页面一进来就假定老师必然能播、麦克风必然能开”，而是用一次轻量的进课前预检同时完成三件事：给出明确的孩子侧准备感、用用户手势解锁一次播放链路、以及尽早发现麦克风是否能拿到可用流。

**Primary recommendation:** Phase 6 采用“共享音频能力层 + 单通道课堂 runtime + 进课前轻量预检 gate”三段式结构。老师/Bobby 的 spoken contract 统一交给一层音频 service 产出可播放资源或播放任务；`useClassroomAudioRuntime` 成为课堂里唯一的音频 owner，负责严格的 `playback -> recording -> waiting` 顺序；课程路由或课堂 client wrapper 在 shell 进入前先完成可跳过的音频预检，顺手处理 autoplay unlock 和麦克风许可。这样既保住课堂感，也把 Phase 7 的 transcript 接线接口留清楚。

## Standard Stack

### Core
| Library / API | Purpose | Why Standard |
|---------------|---------|--------------|
| Next.js App Router | 课堂路由、进课前 preflight gate、结课后首页回跳 | 项目已经在 App Router 上；课堂入口和 URL contract 不需要换栈 |
| `HTMLMediaElement.play()` | 老师/Bobby 音频播放 | 浏览器标准播放入口；可直接处理 `Promise` fulfill / reject 和 autoplay 拒绝 |
| `navigator.mediaDevices.getUserMedia()` | 麦克风权限申请和实时 `MediaStream` 获取 | Web 端麦克风输入的标准入口；Phase 6 必须围绕它处理许可和失败态 |
| `MediaRecorder` | 把孩子录音流收成可传递给 Phase 7 的 `Blob` | 标准录音 API；支持 runtime 状态、`dataavailable` / `stop` 事件与 MIME 探测 |
| `navigator.permissions.query({ name: 'microphone' })` | 权限状态预读 | 可以作为轻量预检提示的辅助信号，但不是最终 source of truth |

### Supporting
| Library / API | Purpose | When to Use |
|---------------|---------|-------------|
| React hooks / current orchestrator | 挂接阶段变化、管理 runtime lifecycle | 继续复用当前 reducer + hook 中心调度，不引入第二套状态系统 |
| Vitest + Testing Library | runtime 合同、shell UI、讲台 CTA 回归 | 覆盖 Phase 6 大部分 contract，尤其是播放失败和录音失败兜底 |
| Playwright | preflight + 课堂音频 UI smoke | 只做 focused 流程，不依赖真实 TTS 或真实麦克风硬件 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| 共享音频 runtime owner | 在 `classroom-shell.tsx`、`podium-view-model.ts` 和按钮里各自维护播放/录音状态 | 会直接破坏 D-07 到 D-09 的单通道课堂调度 |
| `MediaRecorder` | 手写 Web Audio PCM 收集与编码 | Phase 6 范围过重，没有必要自己造录音底座 |
| 进课前轻量 preflight | 课中第一次点名时才申请权限 | 更短路径，但最容易把正式课堂打断在“权限弹窗 / 没声音”上 |
| 真硬件驱动的 e2e | Playwright 中 mock / grant permission / fake adapter | 真硬件更像人工验收，不适合作为日常 focused 回归 |

## Architecture Patterns

### Pattern 1: 单通道课堂音频 runtime，挂在现有 orchestrator 外围
**What:** 以新 hook 或 service 的形式建立统一音频状态机，明确 `idle -> preflight_ready -> playing_teacher|playing_bobby -> recording_student -> recording_complete|recording_failed -> awaiting_phase7` 这类运行时状态；它只消费已有课堂 phase 和角色脚本，不重写 lesson reducer。

**When to use:** 需要保证“先播、再录、再等”的顺序，且 Bobby 只能在 `repeat-after-teacher` 的 `ai_model` 发声时。

**Why:** 这是对 D-07/D-08/D-09 的直接实现。现有 `useClassroomOrchestrator()` 已经是阶段 owner，最稳的做法是在它旁边增加音频 runtime，而不是把音频 phase 塞回 lesson reducer。

**Planning guidance:** runtime 必须暴露纯 contract 给 shell 消费，例如：
- `audioStatus`
- `currentSpeaker`
- `canStartRecording`
- `recordingStatus`
- `lastAudioError`
- `startPreflight() / skipPreflight() / startStudentRecording() / stopStudentRecording() / retryAudioStep()`

### Pattern 2: 进课前预检同时承担“音频解锁 + 麦克风验证”
**What:** 预检 gate 应该在课堂主壳渲染前出现一次，包含一个很轻的扬声器测试动作和一个麦克风检查动作；用户可跳过，但 skip 需要留下明确风险提示。

**Why:** MDN 对 `play()` 和 `getUserMedia()` 的官方说明意味着，自动播放与麦克风访问都可能在第一次脚本触发时失败。把这一步放在课堂开始前，能用一个用户手势同时解决播放解锁和权限申请。

**Inference from sources:** `HTMLMediaElement.play()` 的 Promise 可能被 `NotAllowedError` 拒绝，因此“老师自动播报”在工程上应理解为“预检完成后自动播报”，而不是页面一 mount 就盲播。

**Planning guidance:** 预检 gate 不应该是独立设置页，更像课堂进门前的准备卡：
- `Can you hear Cora?`
- `Can MyTurn use your microphone?`
- `Continue anyway`

### Pattern 3: 录音 contract 用 `MediaRecorder` + MIME 探测，Phase 6 只收集可交接 artifacts
**What:** 先用 `getUserMedia({ audio: true, video: false })` 拿到流，再根据 `MediaRecorder.isTypeSupported()` 选择浏览器支持的 MIME；开始录音后监听 `dataavailable` 和 `stop`，把最终 `Blob`、时长和错误态交给 Phase 7。

**When to use:** 需要在 Phase 6 证明“孩子能录”，但还不需要做 transcript。

**Why:** MDN 明确给了 `MediaRecorder.state`、`start()`、`dataavailable`、`stop()` 和 `isTypeSupported()` 这些标准能力，足够支撑一个稳定的 MVP 录音 contract。

**Planning guidance:** Phase 6 不需要把录音 blob 真正送到判断链路，但应该稳定导出：
- `blob`
- `mimeType`
- `durationMs`
- `wasSilent` 或等价“录到空输入”的检测结果
- `failureReason`

### Pattern 4: 播放态与字幕继续复用 teacher/bobby 脚本，不单独维护第二份文案
**What:** 老师和 Bobby 的发声内容必须直接消费 `teacher-script.ts` 的 `spokenModel` 和 `bobby-script.ts` 的 `spokenLine`；显示给孩子看的字幕继续消费 `visibleCaption` / 既有 hint 文案。

**When to use:** 需要在音频输出和屏幕文案之间保持一致，但又不想把孩子侧界面暴露成“逐字稿播放器”。

**Why:** 当前脚本模块已经把“说出来的话”和“屏幕上提示的话”分开了，这正是 Phase 6 最值钱的复用点。

**Planning guidance:** 不要再写第三套 `audioCopy.ts`。如果某个阶段没有 spoken line，就说明这个阶段不应该播音，而不是去补 UI 专用旁白。

### Pattern 5: Focused e2e 以“权限和 UI 闭环”优先，不以真实硬件为准
**What:** Phase 6 的浏览器验证应该优先确认：
- preflight gate 会出现
- 麦克风许可路径和 skip 路径都能走通
- 老师/Bobby 播放态会驱动正确 UI
- 孩子被点名后出现单 CTA 录音入口
- 失败和重试是课堂化反馈

**Inference from sources:** Playwright 官方支持 browser context permission grant，但文档也提醒不同浏览器和版本支持会变动。因此 Phase 6 的稳定自动化最好围绕 Chromium + mock adapter，而不是把真实麦克风采集当成 CI 真相。

**Planning guidance:** focused e2e 可以用受控 test adapter 或 mock stream 来证明 runtime contract，不要把真实录音质量当成 Phase 6 gate。

### Anti-Patterns to Avoid
- **假设 `play()` 一定成功：** 官方文档明确要求处理 promise reject；如果 UI 先假定老师已经说了，孩子就会在“没声音”里迷路。
- **把预检放进首页或深埋到设置页：** 用户需要的是“进教室前准备一下”，不是产品设置流程。
- **把讲台录音入口拆成两个按钮：** 会把课堂感直接做成工具页。
- **直接在 `classroom-shell.tsx` 里调用 `getUserMedia()` / `MediaRecorder()`：** 会让 shell 同时承担布局、课堂状态和浏览器设备生命周期，回归面太大。
- **让 Bobby 的播放逻辑只靠 UI 判断：** Bobby 边界必须在 runtime 或 script adapter 层就锁死。

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 麦克风录音底层 | 自己拼 PCM 采样、编码和 Blob 输出 | `getUserMedia()` + `MediaRecorder` | 浏览器已有标准能力，Phase 6 重点不在基础编解码 |
| 权限状态管理 | 自定义“推测权限状态”全局 store | `Permissions API` 作辅助，`getUserMedia()` 作最终真相 | 只有真正请求流时，才能知道当前 origin 和设备是否可用 |
| 老师/Bobby 文案 | 新建独立 audio 文案层 | 继续复用现有脚本合同 | 防止字幕、提示和发声内容漂移 |
| 录音入口 | 双按钮、长按说话、自定义工具条 | 单 CTA + runtime 驱动状态文案 | 保住儿童侧课堂感 |

## Common Pitfalls

### Pitfall 1: 把“自动播报”理解成页面一加载就静默起播
**What goes wrong:** 浏览器拦住脚本播放，课堂 UI 以为老师已经说完，孩子却什么也没听见。
**How to avoid:** 先通过 preflight 的用户手势解锁一次播放链路，再进入课堂自动播报。

### Pitfall 2: 把权限查询当成麦克风可用性的唯一依据
**What goes wrong:** `Permissions.query()` 告诉你是 `granted` 或 `prompt`，但真正拿流时仍可能失败，导致 UI 提前乐观。
**How to avoid:** 把 `Permissions API` 只当作预读提示，最终以 `getUserMedia()` 结果为准。

### Pitfall 3: 录音结束后不清理轨道和 runtime owner
**What goes wrong:** 麦克风灯常亮、后续播放被占用，或下一轮录音状态残留。
**How to avoid:** 每轮录音结束后 stop tracks，runtime 把 recorder 和 stream 生命周期集中管理。

### Pitfall 4: 让预检或失败兜底长成全屏系统面板
**What goes wrong:** 产品从“小课”变成“设备检测工具”，课堂情绪被打断。
**How to avoid:** 所有音频失败反馈都只做轻卡片或内嵌状态，不挡主课件。

### Pitfall 5: 为了好测而把真实 runtime 逻辑硬写进 shell 组件
**What goes wrong:** 一旦 Phase 7 接 ASR，`classroom-shell.tsx` 会成为超大组件。
**How to avoid:** 让可测试性来自纯 runtime contract 和 adapter 注入，而不是 UI 组件直接摸浏览器 API。

## Code Examples

Verified patterns from official sources and current codebase:

### Browser Mic Access Is Promise-Based and Permission-Gated
```ts
// Source: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: false,
});
```

### Playback Must Handle Promise Rejection
```ts
// Source: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play
const audio = new Audio(src);
await audio.play();
```

### MediaRecorder Produces `dataavailable` and Final `stop`
```ts
// Source: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start
const recorder = new MediaRecorder(stream, options);
recorder.start();
recorder.addEventListener('dataavailable', (event) => {
  chunks.push(event.data);
});
recorder.addEventListener('stop', () => {
  const blob = new Blob(chunks, { type: recorder.mimeType });
});
```

### Query Permission as Hint, Not Final Truth
```ts
// Source: https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API
const permission = await navigator.permissions.query({ name: 'microphone' });
```

### App Router Search Params Stay Better at Page Boundary
```ts
// Source: https://nextjs.org/docs/app/api-reference/functions/use-search-params
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ reward?: string }>;
}) {
  const params = await searchParams;
  return <ClientShell reward={params.reward === '1'} />;
}
```

## Open Questions

1. **共享 TTS 的具体 provider 在 Phase 6 里是否一步到位？**
   - What we know: 产品已锁定“老师/Bobby 共用一层稳定 TTS 能力”。
   - What's unclear: 是直接选最终 provider，还是先做 provider-agnostic adapter 再补环境接线。
   - Recommendation: 06-01 先落 provider-agnostic adapter contract，同时在实现里选一个稳定 provider；不要把 provider 名硬编码进 UI。

2. **预检是否需要跨课次缓存“已经通过”？**
   - What we know: D-01/D-02 只要求首次进课前轻量预检，可跳过。
   - What's unclear: 同一浏览器同一天是否要每次都重新过。
   - Recommendation: Phase 6 只做当前 session 的轻缓存即可，不做跨天/跨设备持久化策略。

3. **录音“没录到声音”的判定在 Phase 6 做到多强？**
   - What we know: VOICE-03 要求处理“没有录到声音”的兜底。
   - What's unclear: 是只看 Blob 是否为空，还是做简单音量阈值。
   - Recommendation: 06-01/06-02 先做到“空录音 + 明显极短录音”检测，Phase 7 再决定是否加能量阈值。

## Sources

### Primary (HIGH confidence)
- Workspace inspection:
  - `.planning/PROJECT.md`
  - `.planning/REQUIREMENTS.md`
  - `.planning/ROADMAP.md`
  - `.planning/STATE.md`
  - `.planning/phases/06-audio-classroom-runtime/06-CONTEXT.md`
  - `AGENTS.md`
  - `src/features/classroom-shell/use-classroom-orchestrator.ts`
  - `src/features/classroom-shell/classroom-shell.tsx`
  - `src/features/classroom-shell/podium-view-model.ts`
  - `src/features/classroom-shell/teacher-script.ts`
  - `src/features/classroom-shell/bobby-script.ts`
  - `src/app/lesson/[sessionId]/page.tsx`
  - `test/unit/classroom-orchestrator.test.ts`
  - `test/unit/classroom-shell.test.tsx`
  - `test/unit/teacher-script.test.ts`
  - `test/e2e/classroom-entry.spec.ts`
- Official docs:
  - MDN `MediaDevices.getUserMedia()`: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  - MDN `HTMLMediaElement.play()`: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play
  - MDN `MediaRecorder`: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
  - MDN `MediaRecorder.start()`: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start
  - MDN `Permissions API`: https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API
  - Next.js `useRouter`: https://nextjs.org/docs/app/api-reference/functions/use-router
  - Next.js `useSearchParams`: https://nextjs.org/docs/app/api-reference/functions/use-search-params
  - Playwright `BrowserContext.grantPermissions`: https://playwright.dev/docs/api/class-browsercontext

### Secondary (MEDIUM confidence)
- None.

### Tertiary (LOW confidence)
- None.

## Metadata

**Confidence breakdown:**
- Browser constraints: HIGH - 直接来自 MDN 和 Next.js / Playwright 官方文档
- Architecture recommendation: HIGH - 来自现有代码合同与官方 API 约束的交叉推导
- Test strategy: MEDIUM - 基于现有测试结构与 Playwright 权限能力的实现推断，执行时仍需根据真实浏览器表现微调

**Research date:** 2026-04-23
**Valid until:** 2026-05-23
