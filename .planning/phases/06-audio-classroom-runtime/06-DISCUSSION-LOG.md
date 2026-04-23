# Phase 6: Audio Classroom Runtime - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-23
**Phase:** 06-audio-classroom-runtime
**Areas discussed:** 音频预检入口, 老师与 Bobby 发声方式, 课堂音频调度, MVP 技术取向, 孩子录音入口, 失败兜底, TTS 能力层, Phase 6 成功标准

---

## 音频预检入口

| Option | Description | Selected |
|--------|-------------|----------|
| 1A | 进课前轻量预检，可跳过后继续进课 | ✓ |
| 1B | 进课后在课堂内再做预检 | |
| 1C | 不做单独预检，直接进入课堂按需报错 | |

**User's choice:** `1A`
**Notes:** 预检放在正式进课前，但不能变成重阻断路径，应允许跳过后继续进课。

---

## 老师与 Bobby 发声方式

| Option | Description | Selected |
|--------|-------------|----------|
| 2A | 自动播报 + 常驻字幕 + 轻量播放态 | ✓ |
| 2B | 默认静音，孩子点一下才播放 | |
| 2C | 自动播报，但不显示明确播放状态 | |

**User's choice:** `2A`
**Notes:** 课堂感优先，不能把老师/Bobby 做成播放器式点击行为。

---

## 课堂音频调度

| Option | Description | Selected |
|--------|-------------|----------|
| 3A | 单通道顺序调度：先播老师/Bobby，再开孩子录音，再等转写 | ✓ |
| 3B | 允许部分重叠，例如老师尾音时就提前开录 | |
| 3C | 不做统一调度，各组件各自控制 | |

**User's choice:** `3A`
**Notes:** 核心是避免角色语音和录音流程互相打架。

---

## MVP 技术取向

| Option | Description | Selected |
|--------|-------------|----------|
| 4A | 先优先跑通 MVP：稳定优先，音质/自然度先不追极致 | ✓ |
| 4B | 先优先语音自然度，哪怕接入更复杂 | |
| 4C | 先做浏览器原生最小实现，后面再整体替换 | |

**User's choice:** `4A`
**Notes:** Phase 6 首先要证明课堂能稳定跑通。

---

## 孩子录音入口

| Option | Description | Selected |
|--------|-------------|----------|
| 5A | 保持单 CTA，按状态切换为“开始说 / 录音中 / 再试一次” | ✓ |
| 5B | 拆成两个按钮，比如“开始录音 / 结束录音” | |
| 5C | 长按说话 | |

**User's choice:** `5A`
**Notes:** 继续保持 MyTurn 的单 CTA 护栏，不做工具式多按钮。

---

## 失败兜底

| Option | Description | Selected |
|--------|-------------|----------|
| 6A | 轻提示失败原因 + 单 CTA 重试 + 必要时继续课堂 | ✓ |
| 6B | 失败就弹明显错误层，阻断课堂直到修好 | |
| 6C | 静默失败，自动跳过或继续 | |

**User's choice:** `6A`
**Notes:** 反馈要明确，但不能把课堂打断成系统故障页。

---

## TTS 能力层

| Option | Description | Selected |
|--------|-------------|----------|
| 7A | 先统一接一种稳定 TTS 方案，老师和 Bobby 共用能力层、不同 voice/persona | ✓ |
| 7B | 老师和 Bobby 分开两套语音方案 | |
| 7C | 先用预生成音频，不做实时 TTS | |

**User's choice:** `7A`
**Notes:** 先追求一层稳定能力，降低 Phase 6 的实现和维护复杂度。

---

## Phase 6 成功标准

| Option | Description | Selected |
|--------|-------------|----------|
| 8A | 先确保“老师能说、孩子能录、流程不打架” | ✓ |
| 8B | 先确保“声音自然、体验更像真实老师” | |
| 8C | 两者都要，但允许 Phase 6 范围扩大 | |

**User's choice:** `8A`
**Notes:** runtime 基础稳定是 Phase 6 的第一优先级。

---

## the agent's Discretion

- 具体 TTS 供应商、voice 参数与缓存细节
- 音频预检的轻量页面结构与视觉表达
- 录音中、播放中、等待中的 microcopy 和动效
- 失败重试的次数、超时时长与内部事件命名

## Deferred Ideas

- ASR 与 judgment 的正式接线和成功率优化 — Phase 7
- 15 分钟整课 pacing 校准与 verifier 收尾 — Phase 8
- 更复杂的角色音色设计和高级拟人化音频能力

