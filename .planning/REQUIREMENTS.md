# Requirements: MyTurn

**Defined:** 2026-04-15
**Core Value:** 孩子在整节课里都应真实地感受到自己“正在上一节英语小班课”，并且持续愿意开口说。

## v1 Requirements

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

## v2 Requirements

### Content System

- **CONT-05**: 运营或配置者可以管理更大的可复用课程库和多课次进阶体系
- **CONT-06**: 运营或配置者可以创建比“目标项 + 图片”更丰富的课程结构

### Classroom Expansion

- **CLAS-05**: 多个真实孩子可以加入同一节实时课堂
- **CLAS-06**: 课堂记录与重复上课安排可以跨越多次上课会话

### Business and Ops

- **BIZ-01**: 提供面向家长的订阅、管理和反馈查看流程
- **BIZ-02**: 支持原生手机或平板 App 形态发布

## Out of Scope

| Feature | Reason |
|---------|--------|
| 应用商店发布 | 对当前 MVP 而言，网页优先验证更快、风险更低 |
| 多个真实孩子的实时多人课堂 | 会在课堂感尚未验证前显著增加基础设施和交互复杂度 |
| 完整课程管理后台 | 当前目标不是验证内容体系，而是验证一节课能否成立 |
| 家长后台与运营工具 | 不属于当前要验证的孩子课堂主流程 |
| 生产级发音评分 | 严格评分不是当前 MVP 的核心价值 |

## Traceability

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

**Coverage:**
- v1 requirements: 共 21 条
- Mapped to phases: 已映射 21 条
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-15*
*Last updated: 2026-04-22 after Phase 05 Plan 01*
