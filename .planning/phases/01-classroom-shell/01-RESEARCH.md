# Phase 1: Classroom Shell - Research

**Researched:** 2026-04-15
**Domain:** Web classroom shell, lesson configuration schema, tablet-first responsive UI
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
### 产品目标与交付边界
- **D-01:** Phase 1 的首要目标仍然是还原真实线上英语小班课的临场感与课堂节奏，而不是做一个通用型口语练习工具。
- **D-02:** Phase 1 交付的是“课堂壳子 + 课程骨架 + 进入方式 + 基础课堂空间”，重点是让产品一打开就像在准备上课，而不是打开一个练习器。
- **D-03:** 整体体验应该更像“进入一节有时间纪律的课”，而不是“随时点开就练”。

### 课次与进入方式
- **D-04:** 启动 App 后首页应展示完整的今日时刻表，而不是只突出当前一节课。
- **D-05:** 课次不是写死在代码里的单一固定时段，而应来自后台可配置的时间模板。
- **D-06:** 每节课仍维持 15 分钟课时长度，并以可配置时间段切片组织当天课表。
- **D-07:** 用户不能在整个时间窗内任意中途进入课堂，只允许在开场前几分钟进入。
- **D-08:** 一旦超过允许入场窗口，当前课次应明确显示“已开课，停止入场”。
- **D-09:** 尚未开始的下一节课应显示具体开始时间和倒计时，而不是只给模糊提示。
- **D-10:** 用户错过当前课次后，首页应明确引导其关注并进入下一节课。

### 课程配置结构
- **D-11:** 一节课的数据结构不应只是 5 个目标项的简单平铺，而应包含多个固定课堂阶段或轮次。
- **D-12:** 这些轮次更像固定课堂阶段，例如热身、复述、看图作答、收尾，而不是完全自由脚本。
- **D-13:** 同一节课中的 5 个目标项会在不同轮次里重复出现，并逐步提高孩子的输出要求。
- **D-14:** 目标项本身在 Phase 1 应保持极简，只配置核心内容，不额外配置老师示范话术或可接受答案。
- **D-15:** 课堂流程和推进逻辑写在系统里，不交给内容配置层决定。
- **D-16:** 底层课程内容按“周”复用：同一周内复用同一批底层内容，通过不同轮次提高要求；到下一周再切换新的内容。

### 课堂主界面布局
- **D-17:** 主界面采用“左侧课件主屏 + 右侧讲台/教师双区 + 顶部学生席”的课堂式空间结构。
- **D-18:** 左侧课件区是最大视觉区域，承担课堂中的主要图片输入。
- **D-19:** 老师在右侧拥有固定、持续可见的位置，作为带班与课堂推进的主导角色。
- **D-20:** 右侧讲台区用于显示当前上台的学生，谁被点名，谁从顶部学生席进入讲台区。
- **D-21:** 顶部学生席默认展示真实孩子与 AI 同学，其余位置保留为空位或氛围占位，用来营造“班级里还有座位”的感觉，而不是做成功能按钮。
- **D-22:** 讲台区在默认状态下就应存在，用于显示当前轮到或即将轮到的学生位，而不是等点名后才临时出现。
- **D-23:** 视觉主次上应由课件区绝对主导，右侧角色区承担课堂关系表达，而不是与课件争夺主屏。

### 已承接的先前决定
- **D-24:** 第一版课堂形式固定为 2 人小班，即 1 位老师、1 个真实孩子和 1 个 AI 同学。
- **D-25:** 核心互动机制仍采用老师点名，由老师一次点名 1 个孩子上台作答。
- **D-26:** 课堂必须保留真实孩子“先看别人回答、再准备、再轮到自己”的喘息节奏。
- **D-27:** 课堂中的主要理解输入仍是图片，孩子主流程尽量保持英文沉浸。

### Claude's Discretion
- 课表页的具体视觉风格、卡片样式和倒计时表现形式
- 顶部空座位的数量、造型与弱化程度
- 讲台区与教师区的具体比例
- 课程配置 schema 的具体字段命名和层级结构
- 时刻表中“下一节课”提示的文案写法与状态色设计

### Deferred Ideas (OUT OF SCOPE)
- 原生平板或手机 app 封装与应用商店发布
- 多个真人孩子同时上课的真实多人课堂
- 大规模课程体系管理与内容生产工具
- 面向家长的管理、订阅或运营系统
- 超出课堂推进所必需范围的完整生产级发音评分能力
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CLAS-01 | 用户可以在浏览器中进入课程并启动一节固定 15 分钟的课堂 | App Router 路由结构、课表首页状态建模、根布局与课堂路由模式 |
| CONT-01 | 运营或配置者可以为每节课配置 5 个目标词或短句 | Zod schema、TypeScript 类型推导、seed content 组织方式 |
| CONT-02 | 运营或配置者可以为每个目标项绑定 1 张图片，供示范与提问环节使用 | `next/image` 约束、本地静态资源组织、图片元数据建模 |
| PLAT-01 | 用户看到的界面应首先面向平板横屏设计，同时兼容手机和桌面端使用 | Tailwind v4 断点与 design tokens、Server/Client 边界下的响应式布局模式 |
</phase_requirements>

## Summary

Phase 1 适合直接采用当前标准的 `Next.js App Router + React 19 + TypeScript + Tailwind CSS v4` 组合，不要先搭一个纯客户端 SPA 再回头补课程入口、根布局和资产优化。这个 phase 的本质是“可进入的课堂容器”，不是数据 CRUD，也不是复杂实时交互，因此最稳的做法是让首页课表和课堂页都以 Server Component 为默认层，用少量 Client Component 承担倒计时、选中课次、入口状态提示这类浏览器交互。

实现上最容易低估的不是 UI 绘制，而是边界清晰的建模：课表模板、单日课次实例、课程内容 schema、课堂静态舞台布局、以及“允许入场/已开课/下一节课”这些状态枚举。如果这些在 Phase 1 就混在组件里，后续 Phase 2/3 接老师编排、AI 同学、口语轮次时会被迫重写。应当把“课程内容”和“课堂进行时状态”严格分层，前者走 schema + seed 数据，后者走独立的 view-model/selector 层。

**Primary recommendation:** 用 `Next.js 16 App Router` 建一个 server-first 的课堂壳子，课程内容用 `Zod + TypeScript` 做 schema，视觉系统用 `Tailwind v4 @theme` 固定课堂 token，测试从 `Vitest + React Testing Library` 起步并为课堂入口加一条 `Playwright` 冒烟链路。

## Project Constraints (from CLAUDE.md)

- 开始工作前先阅读 `.planning/PROJECT.md`、`.planning/REQUIREMENTS.md`、`.planning/ROADMAP.md`、`.planning/STATE.md`。
- 将 `Phase 1 CONTEXT.md` 视为本次初始化的原始讨论材料。
- 优先通过 GSD 的 phase 命令推进工作，保持规划和实现同步。
- 默认让 GSD 生成文档正文使用中文，同时保留英文标题和结构。
- MVP 必须持续聚焦“课堂感”验证，不扩展到内容规模或平台扩张。
- 整体体验必须像一节短课，不像练习册或答题工具。
- 老师点名轮转与孩子作答前的缓冲空间属于核心能力。
- 英文优先、图片驱动理解是产品假设的一部分。
- 宽松作答处理服务于信心和节奏，不做严格发音评分器。

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | `16.2.3` | App Router, routing, layouts, image/font optimization | 当前主流 React 全栈壳层；官方默认 `app/` 路由、根布局、Server/Client 分层都直接匹配本 phase |
| `react` | `19.2.5` | UI runtime | 与 Next 16 对齐；后续课堂编排、局部交互和渐进 hydration 都依赖它 |
| `react-dom` | `19.2.5` | DOM renderer | React 运行时配套依赖 |
| `typescript` | `6.0.2` | Typed schema and component contracts | Phase 1 要先把课表、课程配置、课堂布局 props 固化成可演进接口 |
| `tailwindcss` | `4.2.2` | Responsive layout and design tokens | v4 的 `@theme` 适合把课堂色板、间距、断点、字体 token 固定下来，避免手写散乱 CSS |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `zod` | `4.3.6` | Runtime validation for lesson and schedule schema | 读取 seed lesson、校验配置、从 schema 自动推导 TS 类型时使用 |
| `vitest` | `4.1.4` | Unit/component tests | 对 schema、状态选择器、入口状态逻辑、纯展示组件做快速测试 |
| `@testing-library/react` | `16.3.2` | React component behavior tests | 需要从用户视角验证课表卡片、入口 CTA、课堂舞台静态渲染时使用 |
| `@testing-library/jest-dom` | `6.9.1` | DOM assertions | 让 Vitest 下的 DOM 断言更直接 |
| `playwright` | `1.59.1` | E2E smoke tests | 为“打开首页 -> 看到今日课表 -> 进入课堂页”保留最小端到端验证链路 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `Next.js App Router` | `Vite + React Router` | 可以更轻，但会失去根布局、`next/image`、`next/font`、Server Component 默认层，后续要补更多壳层能力 |
| `Tailwind CSS v4` | CSS Modules only | 对少量页面可行，但本项目需要稳定 token、断点和可复用课堂空间语义，v4 更适合快速固化设计系统 |
| `Zod` | 纯 TypeScript type/interface | 只能静态约束，不能在 seed 配置加载时做运行时校验，后期容易积累脏数据 |

**Installation:**
```bash
npm install next react react-dom typescript tailwindcss @tailwindcss/postcss postcss zod
npm install -D vitest @testing-library/react @testing-library/jest-dom playwright
```

**Version verification:** 已于 2026-04-15 用以下命令校验当前推荐版本。
```bash
npm view next version
npm view react version
npm view react-dom version
npm view typescript version
npm view tailwindcss version
npm view zod version
npm view vitest version
npm view playwright version
```

**Verified publish dates:**
- `next@16.2.3` — 2026-04-08
- `react@19.2.5` / `react-dom@19.2.5` — 2026-04-08
- `typescript@6.0.2` — 2026-03-23
- `tailwindcss@4.2.2` — 2026-03-18
- `zod@4.3.6` — 2026-01-22
- `vitest@4.1.4` — 2026-04-09
- `playwright@1.59.1` — 2026-04-01

## Architecture Patterns

### Recommended Project Structure
```text
src/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx                 # 今日课表首页
│   ├── lesson/
│   │   └── [sessionId]/
│   │       └── page.tsx             # 课堂壳子页面
│   ├── globals.css                  # Tailwind v4 import + @theme tokens
│   └── layout.tsx                   # Root layout
├── features/
│   ├── schedule/                    # 课表卡片、入场窗口、倒计时 view-model
│   ├── classroom-shell/             # 舞台布局与课堂静态空间组件
│   └── lesson-config/               # schema、seed loader、类型
├── lib/
│   ├── time/                        # 课次时间计算、状态判定
│   └── constants/                   # 固定枚举、UI 常量
├── content/
│   ├── lessons/                     # 种子课程 JSON/TS
│   └── schedules/                   # 时间模板
└── test/
    ├── unit/
    └── e2e/
```

### Pattern 1: Server-First Route Shell
**What:** 首页课表页和课堂页默认都用 Server Component 输出结构化壳层，只把倒计时、选中状态、轻交互做成小粒度 Client Component。
**When to use:** 所有不需要浏览器 API 的页面骨架、静态图片、课堂舞台分区、课次列表。
**Why:** Next.js 16 默认布局和页面是 Server Components；只在需要状态、事件、浏览器 API 时再下沉到 Client Components，更符合当前官方推荐，也能控制 bundle。
**Example:**
```tsx
// Source: https://nextjs.org/docs/app/getting-started/server-and-client-components
// app/lesson/[sessionId]/page.tsx
import { ClassroomShell } from '@/features/classroom-shell/classroom-shell'
import { EntryCountdown } from '@/features/schedule/entry-countdown'
import { getSessionViewModel } from '@/features/schedule/get-session-view-model'

export default async function LessonPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = await params
  const viewModel = await getSessionViewModel(sessionId)

  return (
    <ClassroomShell viewModel={viewModel}>
      <EntryCountdown targetTime={viewModel.startsAt} />
    </ClassroomShell>
  )
}
```

### Pattern 2: Thin Client Boundaries
**What:** 把 `'use client'` 控制在最小交互单元，而不是把整页标成客户端组件。
**When to use:** 倒计时、激活课次、响应式导航高亮、课堂里依赖 `window` 或 `localStorage` 的轻状态。
**Example:**
```tsx
// Source: https://nextjs.org/docs/app/getting-started/server-and-client-components
'use client'

import { useEffect, useState } from 'react'

export function EntryCountdown({ targetTime }: { targetTime: string }) {
  const [secondsLeft, setSecondsLeft] = useState(0)

  useEffect(() => {
    const tick = () =>
      setSecondsLeft(Math.max(0, Math.floor((new Date(targetTime).getTime() - Date.now()) / 1000)))

    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [targetTime])

  return <span>{secondsLeft}s</span>
}
```

### Pattern 3: Schema-Validated Content Layer
**What:** 课程 seed、课表模板、课次实例都先过 `Zod`，再导出给页面使用。
**When to use:** 任何 lesson config、schedule template、图片绑定关系、课堂阶段定义。
**Example:**
```ts
// Source: https://zod.dev/basics
import { z } from 'zod'

export const lessonItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  imageSrc: z.string(),
})

export const lessonStageSchema = z.object({
  id: z.enum(['warmup', 'repeat', 'qa', 'wrap']),
  itemIds: z.array(z.string()).min(1),
})

export const lessonSchema = z.object({
  id: z.string(),
  weekKey: z.string(),
  items: z.array(lessonItemSchema).length(5),
  stages: z.array(lessonStageSchema).min(1),
})

export type Lesson = z.infer<typeof lessonSchema>
```

### Pattern 4: Route Groups for Product Areas
**What:** 用 `(marketing)`、`(classroom)` 这类 route group 分开首页和课堂区域，但不污染 URL。
**When to use:** 项目早期就要把“今日课表入口”和“课堂内页”拆开组织时。
**Example:**
```text
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/route-groups
app/
├── (marketing)/
│   └── page.tsx
└── lesson/
    └── [sessionId]/
        └── page.tsx
```

### Pattern 5: Root Layout Owns Global Shell Only
**What:** `app/layout.tsx` 只放 `<html>`, `<body>`, 字体、全局 CSS、全站 metadata，不放依赖路由状态的课次逻辑。
**When to use:** 一开始搭项目骨架时就这样做。
**Why:** Next.js layout 会缓存并复用，不会在导航时重新渲染；把依赖 pathname/search params 的状态塞进 layout 会变 stale。

### Anti-Patterns to Avoid
- **整页 `use client`:** 会把本来静态的课堂壳子和图片区域都推入客户端 bundle，后续很难收回。
- **把 lesson schema 写死在 JSX 里:** 后面接课程切换、种子内容、周复用时会直接失控。
- **在 root layout 里读课次 URL 状态:** Next.js layout 不会按页面导航重渲染，容易出现过期状态。
- **为图片直接手写裸 `<img>` 列表:** 会放弃 Next.js 的尺寸约束和性能保护，也更容易产生布局抖动。
- **自己发明 design token 约定但不接 Tailwind `@theme`:** token 不能自动生成 utility，维护成本高。

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 图片渲染与尺寸稳定 | 自定义图片懒加载和占位逻辑 | `next/image` | 官方组件已处理尺寸约束、优化和远程来源白名单；手写容易产生 CLS 和安全洞 |
| 字体加载 | 手动 `<link>` 外链 Google Fonts | `next/font` | 自动优化和 self-hosting，减少额外请求与布局抖动 |
| 课程配置校验 | 手写 `if/else` 校验器 | `zod` | schema、运行时校验、类型推导一次完成 |
| 组件行为测试 | 自己拼 DOM 查询工具 | `@testing-library/react` | 已形成事实标准，测试语义更接近用户行为 |
| 跨浏览器冒烟 | 自写 Puppeteer/脚本 | `playwright` | 官方文档和社区都已成熟，隔离和浏览器矩阵现成 |
| 设计 token 到 utility 的映射 | 自写 JS token -> class 生成器 | Tailwind v4 `@theme` | 官方已支持 token 与 utility/variant 直连 |

**Key insight:** 本 phase 最贵的错误不是“库选错”，而是提前手写一层替代官方能力的薄框架。后面所有 phase 都会踩到这些基础能力，越早手搓，越早欠债。

## Common Pitfalls

### Pitfall 1: 把入场状态写成纯前端临时判断
**What goes wrong:** 首页、课表卡片、课堂页三处各写一套“能否进入”的判断，文案和状态会漂移。
**Why it happens:** 入口看起来只是 UI 条件渲染，实际它是产品规则。
**How to avoid:** 在 `features/schedule` 下集中定义 `SessionAccessState` 和 selector，例如 `upcoming` / `open_for_entry` / `in_progress_locked` / `completed`。
**Warning signs:** 首页按钮文案和课堂页提示文案互相矛盾。

### Pitfall 2: 在 layout 中依赖 pathname/search params
**What goes wrong:** 当前课次高亮、tab 状态、筛选结果不更新。
**Why it happens:** Next.js layout 不会因导航重渲染，官方明确说明 query/pathname 可能 stale。
**How to avoid:** 把依赖导航的逻辑放在 page 或小型 Client Component，用 `usePathname` / `useSearchParams`。
**Warning signs:** 跳转后顶部导航或课次激活状态停留在旧页面。

### Pitfall 3: `'use client'` 边界过大
**What goes wrong:** bundle 变大，图片和静态布局也跟着进客户端，后续性能和可维护性一起下降。
**Why it happens:** 为了快，把整个首页或课堂页直接标成 Client Component。
**How to avoid:** 只把倒计时、按钮状态、导航高亮、浏览器 API 依赖组件标成 client。
**Warning signs:** 页面文件一开始就出现 `'use client'`，里面同时塞了大量静态展示。

### Pitfall 4: 课程 schema 只表达“5 个 item”，不表达 stage
**What goes wrong:** Phase 2/3 接老师轮次时只能重构 schema。
**Why it happens:** 容易把 Phase 1 理解成“先把 5 个词存起来”。
**How to avoid:** Phase 1 就包含 `items` + `stages` 两层；话术和评分可以留空，但阶段必须存在。
**Warning signs:** 数据文件只剩 `[{ text, image }]`，没有课堂阶段信息。

### Pitfall 5: 图片元数据缺失导致布局抖动
**What goes wrong:** 课堂主屏在图片加载时跳动，削弱“上课感”。
**Why it happens:** 远程图片没有尺寸，或父容器没有固定宽高策略。
**How to avoid:** 优先本地静态图片导入；若远程图，显式提供 `width` / `height` 或稳定的 `fill` 容器。
**Warning signs:** 左侧课件区首屏渲染后发生高度变化。

### Pitfall 6: 让首页像工具 dashboard 而不是“今天有课”
**What goes wrong:** 视觉上丢失课堂感，虽然功能上能进课。
**Why it happens:** 套用通用卡片列表或学习工具模板。
**How to avoid:** 首页状态只服务“今日课表、当前是否可入场、下一节何时开始”三件事。
**Warning signs:** 首页出现大量和上课无关的信息模块或管理式导航。

## Code Examples

Verified patterns from official sources:

### Root layout with global shell only
```tsx
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/layout
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MyTurn',
  description: 'Tablet-first classroom shell',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### Tailwind v4 theme tokens for classroom UI
```css
/* Source: https://tailwindcss.com/docs/theme */
@import "tailwindcss";

@theme {
  --breakpoint-tablet: 64rem;
  --font-display: "Satoshi", sans-serif;
  --color-classroom-ink: oklch(0.24 0.03 248);
  --color-classroom-wall: oklch(0.96 0.02 95);
  --color-stage: oklch(0.86 0.06 85);
  --radius-stage: 1.5rem;
}
```

### Safe config parsing
```ts
// Source: https://zod.dev/basics
import { lessonSchema } from './lesson-schema'
import rawLesson from '@/content/lessons/week-01/lesson-01.json'

const result = lessonSchema.safeParse(rawLesson)

if (!result.success) {
  throw new Error(`Invalid lesson config: ${result.error.message}`)
}

export const lesson = result.data
```

### Playwright smoke for classroom entry
```ts
// Source: https://playwright.dev/docs/writing-tests
import { test, expect } from '@playwright/test'

test('can open schedule and enter a lesson', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Today')).toBeVisible()
  await page.getByRole('button', { name: /enter class/i }).click()
  await expect(page).toHaveURL(/lesson/)
})
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router + page-level client rendering | App Router with Server Components by default | Next.js 13+ and current 16.x docs | 更适合先搭壳层、路由和全局布局，再逐步加交互 |
| Tailwind JS config-centric theming | Tailwind v4 `@theme` CSS token model | Tailwind 4.x | 设计 token 与 utility/variant 直接连通，适合快速稳定课堂视觉系统 |
| 纯静态 TypeScript interfaces | Zod schema + inferred TS types | 近两年已成前端配置建模常见标准 | 配置文件可在运行时校验，减少 seed 数据腐坏 |
| Jest-only React testing default | Vitest + RTL 成为高频前端单测组合 | 近年 Vite/Vitest 普及 | 启动更快，适合 phase 级快速回归 |

**Deprecated/outdated:**
- 先做纯客户端单页壳子，后续再补 App Router：对本项目是反模式，会阻碍课堂路由和根布局设计。
- 把 Tailwind token 继续集中在 `tailwind.config.js` 里做全部扩展：v4 推荐用 CSS `@theme`，更直接。

## Open Questions

1. **允许入场窗口的精确阈值是多少？**
   - What we know: 只能在开场前几分钟进入，超过则锁定。
   - What's unclear: 是 3 分钟、5 分钟，还是按课次模板单独配置。
   - Recommendation: 在 plan 阶段把它做成 `entryOpensMinutesBeforeStart` 配置字段，不在组件中写死。

2. **课表模板是否只需要本地 seed，还是需要预留外部配置入口？**
   - What we know: D-05 要求来自后台可配置时间模板，但本 milestone 还没有后台。
   - What's unclear: Phase 1 是否只需本地 seed + schema。
   - Recommendation: 先实现“本地 seed 模拟后台配置”，把 loader 抽象成单独模块，避免未来替换读取源时改页面代码。

3. **图片资源在 MVP 初期是否全部本地静态托管？**
   - What we know: 每个目标项必须绑定图片。
   - What's unclear: 是否会立即接远程 CDN 或运营上传链路。
   - Recommendation: Phase 1 先全部本地静态图片导入，避免远程尺寸和白名单配置分散注意力。

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js / tooling | ✓ | `v22.14.0` | — |
| npm | package install / scripts | ✓ | `11.12.1` | — |
| pnpm | optional package manager | ✓ | `10.33.0` | npm |
| yarn | package manager alternative | ✗ | — | npm / pnpm |

**Missing dependencies with no fallback:**
- None

**Missing dependencies with fallback:**
- `yarn` not installed; use `npm` or `pnpm`

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest `4.1.4` + React Testing Library `16.3.2` + Playwright `1.59.1` |
| Config file | none - see Wave 0 |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run && npx playwright test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CLAS-01 | 首页展示今日课表并可进入允许入场的课次 | e2e smoke | `npx playwright test test/e2e/classroom-entry.spec.ts` | ❌ Wave 0 |
| CONT-01 | lesson schema 接受 5 个目标项配置 | unit | `npx vitest run test/unit/lesson-schema.test.ts` | ❌ Wave 0 |
| CONT-02 | 每个目标项必须有图片字段 | unit | `npx vitest run test/unit/lesson-schema.test.ts` | ❌ Wave 0 |
| PLAT-01 | 平板横屏下课堂舞台结构存在且关键区域可见 | component | `npx vitest run test/unit/classroom-shell.test.tsx` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run && npx playwright test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `vitest.config.ts` - establish unit/component test runner
- [ ] `test/setup.ts` - register `@testing-library/jest-dom`
- [ ] `playwright.config.ts` - establish E2E smoke harness
- [ ] `test/unit/lesson-schema.test.ts` - covers CONT-01 / CONT-02
- [ ] `test/unit/classroom-shell.test.tsx` - covers PLAT-01
- [ ] `test/e2e/classroom-entry.spec.ts` - covers CLAS-01

## Sources

### Primary (HIGH confidence)
- Next.js App Router docs: project structure, layouts, route groups, server/client components, images, fonts, testing
  - https://nextjs.org/docs/app/api-reference/file-conventions/layout
  - https://nextjs.org/docs/app/api-reference/file-conventions/route-groups
  - https://nextjs.org/docs/app/getting-started/server-and-client-components
  - https://nextjs.org/docs/app/getting-started/images
  - https://nextjs.org/docs/app/getting-started/fonts
  - https://nextjs.org/docs/app/guides/testing/vitest
  - https://nextjs.org/docs/app/guides/testing/playwright
- Tailwind CSS v4 docs
  - https://tailwindcss.com/docs/installation/framework-guides/nextjs
  - https://tailwindcss.com/docs/theme
  - https://tailwindcss.com/docs/functions-and-directives
- Zod docs
  - https://zod.dev/basics
- Playwright docs
  - https://playwright.dev/docs/writing-tests
- npm registry verification via `npm view`
  - `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `zod`, `vitest`, `playwright`, `@testing-library/react`, `@testing-library/jest-dom`

### Secondary (MEDIUM confidence)
- None needed

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all recommended libraries validated against official docs and npm registry on 2026-04-15
- Architecture: HIGH - directly aligned with current Next.js App Router guidance and Tailwind v4 token model
- Pitfalls: HIGH - derived from official framework constraints plus phase-specific product boundary analysis

**Research date:** 2026-04-15
**Valid until:** 2026-05-15
