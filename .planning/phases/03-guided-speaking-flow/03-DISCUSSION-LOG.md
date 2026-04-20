# Phase 3: Guided Speaking Flow - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-20
**Phase:** 03-guided-speaking-flow
**Areas discussed:** 阶段推进结构, 输出要求爬坡, 孩子开口推进信号, picture-talk 提问方式, 复述轮角色顺序, picture-talk 回答次数, 第二次机会前的老师推动

---

## 阶段推进结构

| Option | Description | Selected |
|--------|-------------|----------|
| 先整轮复述，再整轮看图 | 5 个 item 先都走 `repeat-after-teacher`，后面再统一进入 `picture-talk` | ✓ |
| 每个 item 内先复述，再看图开口 | apple 先跟读再看图说，然后才进入 banana | |
| 混合式 | 前半节整轮复述，后半节改成每个 item 内“先复述再看图” | |

**User's choice:** 先整轮复述，再整轮看图  
**Notes:** 用户希望 Phase 3 优先复用现有 `lesson.stages`，不在单个 item 内频繁切模式。

---

## 输出要求爬坡

| Option | Description | Selected |
|--------|-------------|----------|
| 按 stage 提高要求 | `repeat-after-teacher` 允许直接跟读，进入 `picture-talk` 后老师提问、孩子看图回答 | ✓ |
| 在复述阶段内部也做小爬坡 | 复述轮内部逐步减少支架 | |
| 三段式爬坡 | 完整跟读 -> 半提示复述 -> 看图自己说 | |

**User's choice:** 按 stage 提高要求  
**Notes:** 用户明确补充：`repeat-after-teacher` 阶段允许孩子直接跟读，进入 `picture-talk` 后由老师提问、孩子看图回答。

---

## 孩子开口推进信号

| Option | Description | Selected |
|--------|-------------|----------|
| 课堂内“我已开口”确认推进 | 先不做自动语音触发，只要有明确开口确认信号就推进 | ✓ |
| 轻量麦克风占位 + 手动确认 | 有 mic/live 状态，但推进仍靠确认 | |
| 自动语音触发推进 | 系统监听到孩子说话就自动往下走 | |

**User's choice:** 课堂内“我已开口”确认推进  
**Notes:** 用户希望 Phase 3 先把课堂流程跑通，不提前引入自动语音触发。

---

## picture-talk 提问方式

| Option | Description | Selected |
|--------|-------------|----------|
| 直接问目标物 | `What is it?` / `What do you see?`，孩子看图直接回答 | ✓ |
| 先观察引导，再提问 | 先 `Look carefully.` 再正式问 | |
| 两种都要 | 复述轮短、看图轮先引导再正式提问 | |

**User's choice:** 直接问目标物  
**Notes:** 用户希望 `picture-talk` 阶段更直接，不先铺很长的观察引导。

---

## repeat-after-teacher 角色顺序

| Option | Description | Selected |
|--------|-------------|----------|
| 老师先示范，Bobby 再示范，最后孩子跟读 | `Teacher model -> Bobby model -> My turn` | ✓ |
| 老师先示范，然后直接孩子跟读 | `Teacher model -> My turn` | |
| 老师先示范，孩子先试，不足时 Bobby 再补 | 更灵活但不稳定 | |

**User's choice:** 老师先示范，Bobby 再示范，最后孩子跟读  
**Notes:** 用户希望 Bobby 在复述轮里持续参与，继续维持“先听别人，再轮到自己”的课堂感。

---

## picture-talk 回答次数

| Option | Description | Selected |
|--------|-------------|----------|
| 一题一次机会 | 没接上就老师收束进入下一题 | |
| 一题最多两次机会 | 第一次没接上后再给一次机会 | ✓ |
| 按 item 灵活处理 | 有的题一次，有的题两次 | |

**User's choice:** 一题最多两次机会  
**Notes:** 用户希望 `picture-talk` 同一个 item 最多给两次回答机会。

---

## 第二次机会前的老师推动

| Option | Description | Selected |
|--------|-------------|----------|
| 直接再问一次 | 短等待后直接重问 | |
| 先给轻微口头推动，再问第二次 | 例如 `You can say it.` 之后再问 | ✓ |
| 先给半提示，再问第二次 | 首音提示、口型提示等更强支架 | |

**User's choice:** 先给轻微口头推动，再问第二次  
**Notes:** 用户希望老师给温和鼓励，但不进入提示答案或更强支架，这部分应留给 Phase 4。

---

## the agent's Discretion

- “已开口确认”在 UI 上的具体承载形式
- 各轮次之间的精确等待时长和动画节奏
- 复述轮与看图轮英文话术池的具体措辞与轮换

## Deferred Ideas

- 自动语音触发推进与更真实的 mic 触发逻辑
- `picture-talk` 第二次机会使用半提示或首音提示
- 每个 item 内混合“先复述再看图”的更复杂爬坡结构
