# Roadmap: MyTurn

## Overview

MyTurn `v1.1` 会从“已验证的课堂原型”推进到“可真实开口使用的网页课堂 MVP”。路线图不会重做已有课堂状态机，而是优先补齐浏览器麦克风、语音转写、等待/失败兜底和整节课可用性验证，让孩子能在真实网页环境里从首页进入、完成一节课、开口说并顺利结课回首页。

## Milestone Position

- `v1.0`: Classroom Prototype — Completed and verified on 2026-04-22
- `v1.1`: Voice-Enabled Usable MVP — Active milestone

## Phases

**Phase Numbering:**
- Integer phases (6, 7, 8): Planned milestone work
- Decimal phases (6.1, 6.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 6: Voice Capture Classroom Loop** - 建立浏览器麦克风权限、录音中状态和课堂内可用的语音入口
- [ ] **Phase 7: Speech Recognition Wiring** - 接通语音转写到既有判断链路，并处理超时、失败和重试
- [ ] **Phase 8: Usable Voice Lesson Verification** - 打磨课堂等待体验、闭环验证和真实可用性门槛

## Phase Details

### Phase 6: Voice Capture Classroom Loop
**Goal**: 让孩子在被点名时可以在课堂里自然开口，浏览器麦克风、录音反馈和基础失败兜底保持课堂节奏。
**Depends on**: v1.0 classroom prototype
**Requirements**: [VOICE-01, VOICE-02, VOICE-03, PLAT-03, PLAT-04]
**Success Criteria** (what must be TRUE):
  1. 用户可以在网页里授权麦克风，并在被点名时进入清晰、单一的说话入口。
  2. 课堂界面会明确展示录音中、未录到声音、权限失败等基础状态，而不破坏课堂感。
  3. 平板横屏和中等宽度视口下，顶部学生区、图片区、老师区和讲台区在语音模式下仍完整可见。
**Plans**: 3 plans

Plans:
- [ ] 06-01-PLAN.md — 选定浏览器语音采集策略，建立麦克风权限、录音状态和 hook/contract 测试基线
- [ ] 06-02-PLAN.md — 把单 CTA 讲台入口接成真实语音输入交互，并补齐失败/静音兜底 UI
- [ ] 06-03-PLAN.md — 在课堂页完成语音模式响应式回归，并补 focused unit/e2e 覆盖

### Phase 7: Speech Recognition Wiring
**Goal**: 把孩子语音转成 transcript 并接入既有课堂判断链路，让 repeat 和 picture 两类作答都能真实运行。
**Depends on**: Phase 6
**Requirements**: [ASR-01, ASR-02, ASR-03, ASR-04]
**Success Criteria** (what must be TRUE):
  1. 语音输入会产生可被现有 orchestrator 消费的 transcript，而不是另起一套课堂逻辑。
  2. `repeat-after-teacher` 和 `picture-talk` 分别继续使用既有判断合同，不因语音接入被削弱。
  3. 语音识别超时、失败或低质量输入时，课堂会进入明确的重试或兜底路径，而不会卡死。
**Plans**: 3 plans

Plans:
- [ ] 07-01-PLAN.md — 建立 transcript adapter 与 Wave 0 识别/判断合同测试
- [ ] 07-02-PLAN.md — 接通 repeat-after-teacher 语音判断链路，并保持 Bobby 角色边界不变
- [ ] 07-03-PLAN.md — 接通 picture-talk 语音判断链路，并补齐失败/超时回归验证

### Phase 8: Usable Voice Lesson Verification
**Goal**: 让整节课堂在真实语音模式下完成闭环，并用 focused 验证证明这已经是“可正常使用”的 MVP。
**Depends on**: Phase 7
**Requirements**: [CLAS-05, CLAS-06, CLAS-07, PLAT-05]
**Success Criteria** (what must be TRUE):
  1. 首页进课、课堂语音作答、结课奖励、3 秒停留和回首页余温态能在真实网页流中闭环。
  2. 课堂等待、转写和重试时的反馈依然像一节课，而不是被工具态交互打断。
  3. Focused unit / e2e 与人工走查足以证明语音版课堂可正常使用。
**Plans**: 3 plans

Plans:
- [ ] 08-01-PLAN.md — 打磨 listening/transcribing/recognition result 的课堂化反馈与 closeout surface
- [ ] 08-02-PLAN.md — 打通首页到结课回流的完整语音网页闭环，并补 recently-completed 余温态消费
- [ ] 08-03-PLAN.md — 执行 focused unit/e2e + manual UAT，完成 v1.1 verifier 收尾

## Progress

**Execution Order:**
Phases execute in numeric order: 6 -> 7 -> 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 6. Voice Capture Classroom Loop | 0/3 | Not started | — |
| 7. Speech Recognition Wiring | 0/3 | Not started | — |
| 8. Usable Voice Lesson Verification | 0/3 | Not started | — |

## Carryover Contracts

以下合同来自 `v1.0`，在 `v1.1` 中默认继续复用，除非后续 phase 明确修改：

- 完整 lesson phase graph：`warmup -> guided main -> wrap_up -> completion_reward -> lesson_complete`
- `LESSON_COMPLETE_HOLD_MS = 3000`
- `useClassroomOrchestrator` 已暴露 `isLessonComplete` 和 `completionHoldMs`
- Bobby 仍只在 `repeat-after-teacher` 的 `ai_model` 出现
- reward 只在结尾出现一次
- 首页 `completedSession` overlay / recently-completed contract 已存在
- 首页与课堂页都应优先保证完整可见或可滚动，而不是依赖固定高度裁切

---
*Last updated: 2026-04-22 after opening v1.1 Voice-Enabled Usable MVP*
