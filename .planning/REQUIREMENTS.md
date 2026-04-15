# Requirements: MyTurn

**Defined:** 2026-04-15
**Core Value:** A child should feel like they are truly in a small English class and stay willing to speak throughout the lesson.

## v1 Requirements

### Classroom Experience

- [ ] **CLAS-01**: User can enter a lesson from the browser and start a fixed 15-minute classroom session
- [ ] **CLAS-02**: User experiences a fixed 2-student classroom with one teacher, one real child, and one AI classmate
- [ ] **CLAS-03**: User sees teacher-led one-at-a-time calling so only one child is on the spot at any moment
- [ ] **CLAS-04**: User gets natural breathing room by watching the AI classmate answer before or between their own turns

### Lesson Content

- [ ] **CONT-01**: Operator can configure each lesson with five target words or short phrases
- [ ] **CONT-02**: Operator can attach one image to each target item for use in teaching and questioning
- [ ] **CONT-03**: Lesson flow uses images as the primary comprehension cue instead of Chinese explanation
- [ ] **CONT-04**: The same lesson content can support repeated practice rounds with increasing output demands

### Teacher Facilitation

- [ ] **TEAC-01**: User hears a teacher persona that demonstrates target language with clear classroom-style transitions
- [ ] **TEAC-02**: User receives gentle wait time, encouragement, and clear point-to-answer prompts from the teacher
- [ ] **TEAC-03**: When the child struggles, the teacher first offers a light hint before asking for another attempt
- [ ] **TEAC-04**: After repeated failed attempts, the teacher can fall back to model-and-repeat to restore momentum

### AI Classmate

- [ ] **AICL-01**: User hears an AI classmate respond like a believable peer rather than a perfect answer player
- [ ] **AICL-02**: AI classmate responses can include slight hesitation or mild imperfection while still following the lesson

### Speaking and Evaluation

- [ ] **SPKG-01**: User can complete early practice rounds by repeating target language after the teacher
- [ ] **SPKG-02**: User can complete later rounds by answering teacher prompts from the picture with meaning-equivalent speech
- [ ] **SPKG-03**: System evaluates repetition rounds with close-match rules focused on the target phrase itself
- [ ] **SPKG-04**: System evaluates picture-answer rounds with more lenient meaning-based matching
- [ ] **SPKG-05**: System uses judgment and correction behavior that supports confidence and classroom flow instead of strict scoring

### Platform and Presentation

- [ ] **PLAT-01**: User sees a classroom-style interface designed first for landscape tablet and still usable on phone and desktop
- [ ] **PLAT-02**: User can complete the full MVP lesson in a web experience without native app installation

## v2 Requirements

### Content System

- **CONT-05**: Operator can manage a larger reusable lesson library and multi-lesson progression
- **CONT-06**: Operator can author lessons with richer structures than target item plus image pairs

### Classroom Expansion

- **CLAS-05**: Multiple real children can join the same live classroom
- **CLAS-06**: Session history and repeat scheduling can span multiple class meetings

### Business and Ops

- **BIZ-01**: Parent-facing subscription, management, and reporting flows are available
- **BIZ-02**: Native mobile or tablet app distribution is supported

## Out of Scope

| Feature | Reason |
|---------|--------|
| App store release | Web-first validation is faster and lower risk for the MVP |
| Real-time multiplayer with multiple real children | Would add major infra and interaction complexity before classroom feel is validated |
| Full curriculum management backend | Not required to prove one lesson can feel like a class |
| Parent dashboard and operations tooling | Outside the child classroom loop being validated now |
| Production pronunciation scoring | Strict scoring is not the MVP's value proposition |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CLAS-01 | Phase 1 | Pending |
| CONT-01 | Phase 1 | Pending |
| CONT-02 | Phase 1 | Pending |
| PLAT-01 | Phase 1 | Pending |
| CLAS-02 | Phase 2 | Pending |
| CLAS-03 | Phase 2 | Pending |
| CLAS-04 | Phase 2 | Pending |
| TEAC-01 | Phase 2 | Pending |
| AICL-01 | Phase 2 | Pending |
| AICL-02 | Phase 2 | Pending |
| CONT-03 | Phase 3 | Pending |
| CONT-04 | Phase 3 | Pending |
| TEAC-02 | Phase 3 | Pending |
| SPKG-01 | Phase 3 | Pending |
| TEAC-03 | Phase 4 | Pending |
| TEAC-04 | Phase 4 | Pending |
| SPKG-03 | Phase 4 | Pending |
| SPKG-04 | Phase 4 | Pending |
| SPKG-05 | Phase 4 | Pending |
| SPKG-02 | Phase 5 | Pending |
| PLAT-02 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-15*
*Last updated: 2026-04-15 after initial definition*
