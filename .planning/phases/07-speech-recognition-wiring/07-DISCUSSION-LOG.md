# Phase 7: Speech Recognition Wiring - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-24
**Phase:** 07-speech-recognition-wiring
**Areas discussed:** 录音结束与送识别时机, transcript adapter 清洗力度, 等待转写节奏与超时, 成功率与等待体验观测

---

## 录音结束与送识别时机

| Option | Description | Selected |
|--------|-------------|----------|
| A | 混合式：点一下开始，静音自动收尾，也允许再点一下提前结束 | |
| B | 纯点按式：点一下开始，再点一下结束 | ✓ |
| C | 纯自动式：开始后靠静音自动结束，不要求第二次点按 | |

**User's choice:** `1B`
**Notes:** 用户明确选择纯点按式收尾，希望开始录音和结束录音都有清晰、确定的单 CTA 动作。

---

## transcript adapter 清洗力度

| Option | Description | Selected |
|--------|-------------|----------|
| A | 很保守：只做大小写、标点、空格清洗 | |
| B | 儿童友好：去掉口头填充词、常见起句抖动、明显无意义噪音 | ✓ |
| C | 很激进：在进入 judgment 前做更强改写或重写 | |

**User's choice:** `2B`
**Notes:** 用户接受推荐值，希望 adapter 帮孩子过滤明显噪音，但不做过强改写，以免破坏既有 judgment contract。

---

## 等待转写节奏与超时

| Option | Description | Selected |
|--------|-------------|----------|
| A | 很快：约 2 秒，超时就立即重试或兜底 | |
| B | 中间值：约 3-4 秒，给轻量课堂化 waiting 文案，再进入 retry/fallback | ✓ |
| C | 更耐心：约 5-6 秒，尽量多等一次识别结果 | |

**User's choice:** `3B`
**Notes:** 用户接受推荐值，明确要保持课堂感，不要把等待做成工具式长 loading。

---

## 成功率与等待体验观测

| Option | Description | Selected |
|--------|-------------|----------|
| A | 仅内部测试与日志可见 | |
| B | 开发态轻 HUD：只在 dev/testing 环境显示 | ✓ |
| C | 页面显式显示成功率/识别状态给用户看 | |

**User's choice:** `4B`
**Notes:** 用户接受推荐值，希望有可见证据支撑 `PLAT-05`，但不把技术观测暴露给孩子端正式界面。

---

## the agent's Discretion

- 纯点按式收尾里的按钮文案切换、最长录音上限与浏览器兼容兜底
- transcript adapter 的规则粒度与测试拆分
- waiting transcript 的具体课堂化微文案
- dev HUD 的字段、样式与展示位置

## Deferred Ideas

- 高阶 transcript 重写或 LLM 纠错
- 面向孩子的显式识别成功率/评分面板
- Phase 8 的整课 pacing 校准和 manual UAT
