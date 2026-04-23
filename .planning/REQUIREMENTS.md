# Requirements: MyTurn

**Defined:** 2026-04-15
**Core Value:** 孩子在整节课里都应真实地感受到自己“正在上一节英语小班课”，并且持续愿意开口说。

## v1.0 Requirements

### Classroom Experience

- [x] **CLAS-01**: 用户可以在浏览器中进入课程并启动一节固定 15 分钟的课堂
- [x] **CLAS-02**: 用户体验到固定 2 人小班结构，包含 1 位老师、1 个真实孩子和 1 个 AI 同学
- [x] **CLAS-03**: 用户能感受到由老师主导的一次点名一个孩子作答的课堂节奏
- [x] **CLAS-04**: 用户可以通过先看或穿插观看 AI 同学作答来获得自然的准备和喘息空间

### Lesson Content

- [x] **CONT-01**: 运营或配置者可以为每节课配置 5 个目标词或短句
- [x] **CONT-02**: 运营或配置者可以为每个目标项绑定 1 张图片，供示范与提问环节使用
- [x] **CONT-03**: 课堂流程以图片作为主要理解线索，而不是依赖中文解释
- [x] **CONT-04**: 同一节课内容可以支撑多轮重复练习，并逐步提高输出要求

### Teacher Facilitation

- [x] **TEAC-01**: 用户能听到具有老师风格的课堂引导，包括示范目标语言和清晰的过渡话术
- [x] **TEAC-02**: 用户能从老师那里获得温和的等待、鼓励和明确的点名作答提示
- [x] **TEAC-03**: 当孩子作答困难时，老师会先给出轻量提示，再让孩子重新尝试
- [x] **TEAC-04**: 当孩子连续几次仍无法作答时，老师可以退回到“示范 + 跟读”的兜底方式以恢复课堂节奏

### AI Classmate

- [x] **AICL-01**: 用户听到的 AI 同学应像一个可信的同龄同学，而不是一个完美播报器
- [x] **AICL-02**: AI 同学的回答可以带有轻微犹豫或不完美，但整体仍应跟得上课堂

### Speaking and Evaluation

- [x] **SPKG-01**: 用户可以在前期练习轮次中跟随老师复述目标语言
- [x] **SPKG-02**: 用户可以在后期练习轮次中根据图片回答老师提问，并允许表达与标准答案意义相近
- [x] **SPKG-03**: 系统在复述环节使用更贴近目标词句本身的近似匹配规则
- [x] **SPKG-04**: 系统在看图作答环节使用更宽松的基于语义的匹配规则
- [x] **SPKG-05**: 系统的判断与纠错方式应服务于信心建立和课堂推进，而不是严格打分

### Platform and Presentation

- [x] **PLAT-01**: 用户看到的界面应首先面向平板横屏设计，同时兼容手机和桌面端使用
- [x] **PLAT-02**: 用户无需安装原生 App，就能在网页中完成整节 MVP 课程

## v1.1 Increment Requirements

### Audio Output

- [ ] **AUDIO-01**: 老师在示范、点名、鼓励、过渡、wrap-up 与 reward 环节具备稳定可播放的英文语音输出
- [ ] **AUDIO-02**: Bobby 只在 `repeat-after-teacher` 的 `ai_model` 环节发声，并保持可信但不过度完美的同龄感
- [ ] **AUDIO-03**: 课堂在播放老师/Bobby 语音时提供清晰但轻量的播放状态反馈，不遮挡主课件区域

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

- [ ] **CLAS-05**: 播放老师/Bobby 语音、开始录音、等待转写和给出反馈之间由统一的课堂音频调度控制，避免声音重叠或录音被打断
- [ ] **CLAS-06**: 听录音、等待转写、出结果和重试过程仍应保持“像一节课”的节奏，而不是出现工具式大遮罩或复杂操作
- [ ] **CLAS-07**: 用户在第一次正式进课前可以完成轻量的扬声器 / 麦克风可用性检查，而不会打断进入课堂的主路径
- [ ] **CLAS-08**: Bobby 仍只在 `repeat-after-teacher` 的 `ai_model` 出现，reward 仍只在结尾出现一次
- [ ] **CLAS-09**: 结课后约 3 秒自动回首页，并继续显示刚完成课次的余温状态
- [ ] **CLAS-10**: 课堂 pacing 可以稳定落在一节 15 分钟小课的目标区间内，而不是显著偏短或拖长

### Platform and Usability

- [ ] **PLAT-03**: 产品在平板横屏上完成整节真实语音课堂时，页面布局、老师区、讲台区、图片区和顶部学生区都保持可见与可用
- [ ] **PLAT-04**: 在桌面和中等宽度视口下，课堂页面应优先保证完整可见与可滚动，而不是因固定高度裁切核心区域
- [ ] **PLAT-05**: 在常见浏览器环境中，老师/Bobby 播放、孩子录音和转写链路具备可接受的成功率与等待体验
- [ ] **PLAT-06**: 通过 focused unit / e2e 证明“从首页进课 -> 老师/Bobby 发声 -> 真实语音作答 -> 结课回首页”的网页闭环成立

## Future Milestones

### Content System

- **CONT-05**: 运营或配置者可以管理更大的可复用课程库和多课次进阶体系
- **CONT-06**: 运营或配置者可以创建比“目标项 + 图片”更丰富的课程结构

### Classroom Expansion

- **CLAS-11**: 多个真实孩子可以加入同一节实时课堂
- **CLAS-12**: 课堂记录与重复上课安排可以跨越多次上课会话

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

### v1.0

| Requirement | Phase | Status |
|-------------|-------|--------|
| CLAS-01 | Phase 1 | Complete |
| CONT-01 | Phase 1 | Complete |
| CONT-02 | Phase 1 | Complete |
| PLAT-01 | Phase 1 | Complete |
| CLAS-02 | Phase 2 | Complete |
| CLAS-03 | Phase 2 | Complete |
| CLAS-04 | Phase 2 | Complete |
| TEAC-01 | Phase 2 | Complete |
| AICL-01 | Phase 2 | Complete |
| AICL-02 | Phase 2 | Complete |
| CONT-03 | Phase 3 | Complete |
| CONT-04 | Phase 3 | Complete |
| TEAC-02 | Phase 3 | Complete |
| SPKG-01 | Phase 3 | Complete |
| TEAC-03 | Phase 4 | Complete |
| TEAC-04 | Phase 4 | Complete |
| SPKG-03 | Phase 4 | Complete |
| SPKG-04 | Phase 4 | Complete |
| SPKG-05 | Phase 4 | Complete |
| SPKG-02 | Phase 5 | Complete |
| PLAT-02 | Phase 5 | Complete |

### v1.1

| Requirement | Planned Phase | Status |
|-------------|---------------|--------|
| AUDIO-01 | Phase 6 | Planned |
| AUDIO-02 | Phase 6 | Planned |
| AUDIO-03 | Phase 6 | Planned |
| VOICE-01 | Phase 6 | Planned |
| VOICE-02 | Phase 6 | Planned |
| VOICE-03 | Phase 6 | Planned |
| ASR-01 | Phase 7 | Planned |
| ASR-02 | Phase 7 | Planned |
| ASR-03 | Phase 7 | Planned |
| ASR-04 | Phase 7 | Planned |
| CLAS-05 | Phase 6, 8 | Planned |
| CLAS-06 | Phase 8 | Planned |
| CLAS-07 | Phase 6 | Planned |
| CLAS-08 | Phase 8 | Planned |
| CLAS-09 | Phase 8 | Planned |
| CLAS-10 | Phase 8 | Planned |
| PLAT-03 | Phase 6, 8 | Planned |
| PLAT-04 | Phase 6, 8 | Planned |
| PLAT-05 | Phase 7, 8 | Planned |
| PLAT-06 | Phase 8 | Planned |

**Coverage:**
- v1.0 requirements: 共 21 条
- v1.0 mapped to phases: 已映射 21 条
- v1.1 increment requirements: 共 20 条
- v1.1 mapped to phases: 已映射 20 条
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-15*
*Last updated: 2026-04-23 after expanding v1.1 to full audio classroom MVP*
