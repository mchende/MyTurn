# MyTurn Agent Guide

## Project Snapshot

MyTurn 是一个面向儿童英语口语练习的网页端课堂 MVP，重点是还原真实线上英语小班课的临场感。当前里程碑聚焦于一节完整的 15 分钟课程，包含 1 位老师、1 个真实孩子和 1 个 AI 同学，并优先适配平板横屏。

## Source of Truth

- 阅读 `.planning/PROJECT.md` 了解当前产品意图、范围边界和关键决策。
- 阅读 `.planning/REQUIREMENTS.md` 了解已承诺的 v1 需求集合及其 phase 映射。
- 阅读 `.planning/ROADMAP.md` 了解当前 phase 顺序和计划占位。
- 开始工作前优先阅读 `.planning/STATE.md`，恢复当前进度与阻塞信息。
- 将 `Phase 1 CONTEXT.md` 视为本次初始化所依据的原始讨论材料。

## Workflow

- 优先通过 GSD 的 phase 命令开展工作，确保规划文档和实现保持同步。
- 下一步推荐命令是 `$gsd-discuss-phase 1` 或 `$gsd-plan-phase 1`。
- 始终让 MVP 聚焦“课堂感”验证，而不是内容规模或平台扩张。
- GSD 生成的文档正文默认使用中文，但保留现有英文标题和结构，除非某个 workflow 明确要求其他格式。
- 技术选型优先使用成熟社区包，不手搓基础能力库；当前项目明确将 `shadcn/ui` 纳入 UI 基础栈。

## Product Guardrails

- 整体体验必须像一节短课，而不是练习册或答题工具。
- 老师点名轮转和孩子作答前的缓冲空间属于核心能力，不是锦上添花。
- 英文优先、图片驱动理解是产品假设的一部分。
- 宽松的作答处理应服务于信心和节奏，而不是做成严格的发音评分器。

## Behavioral guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
