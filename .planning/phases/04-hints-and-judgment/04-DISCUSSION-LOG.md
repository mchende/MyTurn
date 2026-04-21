# Phase 4: Hints and Judgment - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-21
**Phase:** 04-Hints and Judgment
**Areas discussed:** repeat-after-teacher hinting, picture-talk prompt strength, stage-specific pass criteria, picture-talk fallback

---

## Repeat-after-teacher Hinting

| Option | Description | Selected |
|--------|-------------|----------|
| 一起说一遍 | 老师直接进入 very light co-speak，然后带着孩子说 | ✓ |
| 先鼓励一句，再请他自己再试 | 先鼓励，不给答案，保留一次独立再试 | |
| 先给局部口型/声音支架 | 给首音或节奏支架，再让孩子说 | |

**User's choice:** 一起说一遍
**Notes:** 用户确认复述轮第一次没接上时，老师应先用 co-speak 接住孩子，而不是先要求独立再试。

---

## Repeat-after-teacher Fallback

| Option | Description | Selected |
|--------|-------------|----------|
| 老师完整示范一次，然后切下一题 | co-speak 后仍不行，则老师完整示范并直接推进 | |
| 老师完整示范一次，再邀请孩子最后跟一次 | 兜底时仍保留一次最低门槛跟读机会 | ✓ |
| 不再多做，co-speak 后直接切下一题 | 把 co-speak 视为最终兜底 | |

**User's choice:** 老师完整示范一次，再邀请孩子最后跟一次
**Notes:** 用户希望复述轮的层级清楚分成“轻提示”和“兜底”，最终兜底仍保留一次跟读机会。

---

## Picture-talk Prompt Strength

| Option | Description | Selected |
|--------|-------------|----------|
| 观察型提示 | 只把注意力拉回图片本身，不给答案结构 | ✓ |
| 范围型提示 | 缩小语义范围，但不直接给词 | |
| 句型型提示 | 给可套用的句型架子 | |

**User's choice:** 观察型提示
**Notes:** 用户明确要求本题只选观察型提示，并指出不希望过早进入半提示或句型支架。

---

## Picture-talk Second Chance

| Option | Description | Selected |
|--------|-------------|----------|
| 老师再问一遍，孩子自己答 | 提示后仍保持独立输出 | |
| 老师把问题缩窄一点再问 | 第二次机会保留，但问题更聚焦 | ✓ |
| 老师不再问，直接进入兜底 | 不保留第二次独立作答 | |

**User's choice:** 老师把问题缩窄一点再问
**Notes:** 用户希望第二次机会仍然存在，但老师的问题要更聚焦，不只是重复原问题。

---

## Repeat-after-teacher Pass Criteria

| Option | Description | Selected |
|--------|-------------|----------|
| 只要孩子明显开口跟了，就算通过 | 重点是参与，不要求接近目标词 | |
| 要大致接近目标词/短句才算通过 | 允许不标准，但应听起来像同一词句 | ✓ |
| 必须基本说对才算通过 | 更严格、更像评分器 | |

**User's choice:** 要大致接近目标词/短句才算通过
**Notes:** 用户不接受“只要开口就过”，但也不希望走到严格发音评分。

---

## Picture-talk Pass Criteria

| Option | Description | Selected |
|--------|-------------|----------|
| 只要孩子说出相关词就算通过 | 相关即可，容错最大 | |
| 要语义对，但不要求和标准答案同词 | 重点是意思对 | ✓ |
| 仍要比较贴近预设答案 | 较宽松但仍围绕标准答案 | |

**User's choice:** 要语义对，但不要求和标准答案同词
**Notes:** 用户明确希望看图轮按语义正确判断，服务于信心和课堂推进。

---

## Picture-talk Fallback

| Option | Description | Selected |
|--------|-------------|----------|
| 老师直接说出答案，再请孩子跟一句 | 稳住课堂后保留最低门槛收尾机会 | ✓ |
| 老师直接说出答案并切题 | 更利落，但不再追求当前题开口 | |
| 老师只描述，不直接给答案 | 保持沉浸，但兜底较弱 | |

**User's choice:** 老师直接说出答案，再请孩子跟一句
**Notes:** 用户希望看图轮最终兜底也保留一句跟说/跟答机会，而不是直接切题。

---

## the agent's Discretion

- 提示与兜底之间的具体时序、停顿长度和动画节奏
- 观察型提示与缩窄问题的具体英文话术池
- judgment result 如何接入现有 reducer / hook / CTA contract

## Deferred Ideas

No new out-of-scope ideas were introduced during this discussion.
