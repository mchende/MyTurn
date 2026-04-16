# Phase 2: Cast and Orchestration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-16T21:50:58.3193282+08:00
**Phase:** 02-cast-and-orchestration
**Mode:** auto discuss
**Areas discussed:** 角色拓扑与席位表达, 轮转结构与推进方式, 老师带班风格, AI 同学行为原则, 反馈与奖励边界

---

## 角色拓扑与席位表达

| Option | Description | Selected |
|--------|-------------|----------|
| 固定三角色课堂 | 老师、真实孩子、AI 同学持续同时可见，顶部席位与讲台位长期存在 | ✓ |
| 极简双角色课堂 | 页面只突出老师和真实孩子，AI 只在需要时闪现 | |
| 多空位氛围课堂 | 在固定三角色外保留更多弱存在感学生位，强调“班级里还有人” | |

**Auto choice:** 固定三角色课堂
**Notes:** 这是与 Phase 1 已锁定的“顶部学生席 + 讲台区 + 老师区”空间关系最一致的方案，也最直接支撑 CLAS-02 与 CLAS-03。

---

## 轮转结构与推进方式

| Option | Description | Selected |
|--------|-------------|----------|
| 确定性状态机 | 老师点名、Bobby 示范、孩子作答、老师反馈、奖励、下一项按脚本推进 | ✓ |
| 手动触发编排 | 由按钮或调试控制逐步切换课堂状态 | |
| 实时语音驱动 | 依赖实时音频结果决定谁上台、何时过渡 | |

**Auto choice:** 确定性状态机
**Notes:** 推荐原因是当前项目尚未进入语音采集与判断阶段，而 Phase 2 的核心是先建立可信课堂节奏，不是先解实时语音链路。

---

## 老师带班风格

| Option | Description | Selected |
|--------|-------------|----------|
| 英文优先的短话术带班 | 老师用简短英文完成引导、点名、鼓励，UI 状态可保留中文 | ✓ |
| 全中文可读性优先 | 老师和界面都以中文为主，先确保流程说明清楚 | |
| 复杂教学脚本 | 老师在 Phase 2 就接入多层提示、纠错和兜底分支 | |

**Auto choice:** 英文优先的短话术带班
**Notes:** 这延续了 PROJECT.md 和 Phase 1 context 中“英文优先、图片驱动理解”的产品假设，同时避免提前侵入 Phase 4 的提示与判断范围。

---

## AI 同学行为原则

| Option | Description | Selected |
|--------|-------------|----------|
| 稳定示范型同学 | Bobby 在孩子前短暂示范，可信但不抢戏，表现为脚本化安全行为 | ✓ |
| 高频抢答型同学 | Bobby 经常先说，强化热闹感和课堂节奏 | |
| 完全背景型同学 | Bobby 只作为气氛存在，基本不真正参与回答 | |

**Auto choice:** 稳定示范型同学
**Notes:** 这是最符合 CLAS-04、AICL-01、AICL-02 的平衡点，既给孩子准备空间，又不把 Bobby 做成比老师更强的舞台中心。

---

## 反馈与奖励边界

| Option | Description | Selected |
|--------|-------------|----------|
| 正向鼓励优先 | 每轮孩子作答后给出明确奖励反馈，但不绑定严格正确性判断 | ✓ |
| 强反馈判定 | 奖励出现必须依赖某种正确/错误判断结果 | |
| 纯视觉过场 | 奖励只作为动画，不与课堂角色关系绑定 | |

**Auto choice:** 正向鼓励优先
**Notes:** 这与当前产品“信心建立和课堂推进优先”的方向一致，也能避免在 Phase 2 提前锁死判断机制。

---

## the agent's Discretion

- 每个课堂状态的精确停留时长
- 老师与 Bobby 的文案池组织方式
- 轻微犹豫感和奖励动效的具体视觉实现

## Deferred Ideas

- 真实语音采集与转写链路
- 老师提示升级、兜底示范和判断策略
- 完整 15 分钟课程整合
