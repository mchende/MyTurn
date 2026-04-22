# Requirements: MyTurn

**Defined:** 2026-04-22
**Core Value:** 孩子在整节课里都应真实地感受到自己“正在上一节英语小班课”，并且持续愿意开口说。

## Previous Milestone Snapshot

- `v1.0` 已完成“课堂原型”验证：课堂壳体、老师带班、AI 同学参与、分阶段判断、首页回流和完整 lesson closeout 已全部打通。
- `v1.1` 的要求不再重复造课堂骨架，而是把真实语音输入接到既有课堂合同上，让产品达到“可正常使用”的 MVP 门槛。

## v1.1 Requirements

### Voice Capture

- [ ] **VOICE-01**: 用户可以在浏览器中授权麦克风，并在课堂里进入可用的语音输入状态
- [ ] **VOICE-02**: 当老师点名孩子作答时，课堂会提供清晰、单一且适合儿童理解的说话入口与录音中反馈
- [ ] **VOICE-03**: 当没有录到声音、权限被拒绝或录音失败时，系统会给出不打断课堂节奏的兜底反馈

### Speech Recognition and Judgment

- [ ] **ASR-01**: 系统可以把孩子语音转成 transcript，并接入现有的 `submitStudentAttempt` / judgment adapter 链路
- [ ] **ASR-02**: `repeat-after-teacher` 环节继续使用更贴近目标词句本身的判断规则
- [ ] **ASR-03**: `picture-talk` 环节继续使用更宽松的语义判断规则，而不是退化成关键词死匹配
- [ ] **ASR-04**: 语音识别失败、低置信度或超时的情形会进入清晰的重试或兜底路径，而不是让课堂卡住

### Classroom Experience

- [ ] **CLAS-05**: 听录音、等待转写、出结果和重试过程仍应保持“像一节课”的节奏，而不是出现工具式大遮罩或复杂操作
- [ ] **CLAS-06**: Bobby 仍只在 `repeat-after-teacher` 的 `ai_model` 出现，reward 仍只在结尾出现一次
- [ ] **CLAS-07**: 结课后约 3 秒自动回首页，并继续显示刚完成课次的余温状态

### Platform and Usability

- [ ] **PLAT-03**: 产品在平板横屏上完成整节真实语音课堂时，页面布局、老师区、讲台区、图片区和顶部学生区都保持可见与可用
- [ ] **PLAT-04**: 在桌面和中等宽度视口下，课堂页面应优先保证完整可见与可滚动，而不是因固定高度裁切核心区域
- [ ] **PLAT-05**: 通过 focused unit / e2e 证明“从首页进课 -> 真实语音作答 -> 结课回首页”的网页闭环成立

## Future Milestones

### Content System

- **CONT-05**: 运营或配置者可以管理更大的可复用课程库和多课次进阶体系
- **CONT-06**: 运营或配置者可以创建比“目标项 + 图片”更丰富的课程结构

### Classroom Expansion

- **CLAS-08**: 多个真实孩子可以加入同一节实时课堂
- **CLAS-09**: 课堂记录与重复上课安排可以跨越多次上课会话

### Business and Ops

- **BIZ-01**: 提供面向家长的订阅、管理和反馈查看流程
- **BIZ-02**: 支持原生手机或平板 App 形态发布

## Out of Scope

| Feature | Reason |
|---------|--------|
| 应用商店发布 | 对当前 MVP 而言，网页优先验证更快、风险更低 |
| 多个真实孩子的实时多人课堂 | 会在语音可用化尚未稳定前显著增加基础设施和交互复杂度 |
| 完整课程管理后台 | 当前目标不是扩内容，而是把单节课做成真实可开口使用 |
| 家长后台与运营工具 | 不属于当前要验证的孩子课堂主流程 |
| 生产级发音评分 | 严格评分不是当前 MVP 的核心价值 |

## Traceability

| Requirement | Planned Phase | Status |
|-------------|---------------|--------|
| VOICE-01 | Phase 6 | Planned |
| VOICE-02 | Phase 6 | Planned |
| VOICE-03 | Phase 6 | Planned |
| ASR-01 | Phase 7 | Planned |
| ASR-02 | Phase 7 | Planned |
| ASR-03 | Phase 7 | Planned |
| ASR-04 | Phase 7 | Planned |
| CLAS-05 | Phase 8 | Planned |
| CLAS-06 | Phase 8 | Planned |
| CLAS-07 | Phase 8 | Planned |
| PLAT-03 | Phase 6, 8 | Planned |
| PLAT-04 | Phase 6, 8 | Planned |
| PLAT-05 | Phase 8 | Planned |

**Coverage:**
- v1.1 requirements: 共 13 条
- Mapped to phases: 已映射 13 条
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-22*
*Last updated: 2026-04-22 after opening v1.1 Voice-Enabled Usable MVP*
