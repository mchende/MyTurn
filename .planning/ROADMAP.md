# Roadmap: MyTurn

## Overview

MyTurn v1.0 moves from a configurable classroom shell to a fully playable 15-minute speaking lesson that feels like a real online small-group class. The roadmap starts by establishing the lesson container and content model, then adds teacher-led orchestration and AI classmate presence, then layers in speaking turns, lenient evaluation, and final end-to-end MVP polish.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Classroom Shell** - Build the browser lesson container, content schema, and base classroom UI
- [ ] **Phase 2: Cast and Orchestration** - Add the teacher-led class loop and believable AI classmate behavior
- [ ] **Phase 3: Guided Speaking Flow** - Introduce repetition rounds, image-led flow, and live participation rhythm
- [ ] **Phase 4: Hints and Judgment** - Add lightweight correction, fallback behavior, and phase-appropriate answer evaluation
- [ ] **Phase 5: Complete MVP Lesson** - Deliver the full 15-minute classroom journey as a usable web MVP

## Phase Details

### Phase 1: Classroom Shell
**Goal**: Create the web lesson frame, lesson configuration model, and tablet-first classroom interface that later behaviors can plug into.
**Depends on**: Nothing (first phase)
**Requirements**: [CLAS-01, CONT-01, CONT-02, PLAT-01]
**Success Criteria** (what must be TRUE):
  1. User can open the app in a browser and launch a lesson session from a classroom-style screen.
  2. Lesson data can be configured as five target items, each with paired image content.
  3. The UI reads clearly as a classroom experience on landscape tablet and still functions on phone and desktop.
**Plans**: 3 plans

Plans:
- [ ] 01-01: Define project foundation, app shell, and responsive classroom layout
- [ ] 01-02: Implement lesson configuration schema and seed lesson content
- [ ] 01-03: Build session entry and classroom scene rendering

### Phase 2: Cast and Orchestration
**Goal**: Establish the teacher, the AI classmate, and the one-at-a-time classroom orchestration that creates small-class presence.
**Depends on**: Phase 1
**Requirements**: [CLAS-02, CLAS-03, CLAS-04, TEAC-01, AICL-01, AICL-02]
**Success Criteria** (what must be TRUE):
  1. Each lesson runs with a fixed cast of teacher, real child, and AI classmate.
  2. The teacher can drive class flow with demonstrations, transitions, and clear point-to-answer prompts.
  3. The AI classmate participates as a believable peer and gives the child breathing room before some turns.
**Plans**: 3 plans

Plans:
- [ ] 02-01: Model classroom roles, turns, and state transitions
- [ ] 02-02: Implement teacher script engine and classroom transition behavior
- [ ] 02-03: Implement AI classmate response behavior and sequencing

### Phase 3: Guided Speaking Flow
**Goal**: Let the child actively participate in an English-first lesson that starts with repetition and preserves image-led classroom rhythm.
**Depends on**: Phase 2
**Requirements**: [CONT-03, CONT-04, TEAC-02, SPKG-01]
**Success Criteria** (what must be TRUE):
  1. Early rounds let the child repeat target language after teacher modeling.
  2. Lesson flow stays English-first and uses the configured images as the main comprehension support.
  3. Repeated passes over the same content raise the child's required level of output instead of simply replaying.
**Plans**: 3 plans

Plans:
- [ ] 03-01: Implement repetition-round speaking flow and student turn capture
- [ ] 03-02: Integrate image-led prompts into the lesson loop
- [ ] 03-03: Add progression logic that raises output demands across rounds

### Phase 4: Hints and Judgment
**Goal**: Support classroom momentum with lightweight prompting, fallback modeling, and phase-appropriate answer evaluation.
**Depends on**: Phase 3
**Requirements**: [TEAC-03, TEAC-04, SPKG-03, SPKG-04, SPKG-05]
**Success Criteria** (what must be TRUE):
  1. When a child struggles, the teacher gives a gentle hint and allows another try before falling back.
  2. Repetition rounds accept close matches to the modeled phrase.
  3. Picture-answer rounds accept meaning-equivalent responses and keep confidence higher than strict scoring would.
**Plans**: 3 plans

Plans:
- [ ] 04-01: Implement attempt tracking and gentle hint behavior
- [ ] 04-02: Implement repeat-mode and picture-mode evaluation rules
- [ ] 04-03: Add fallback teacher behaviors that restore flow without breaking classroom feel

### Phase 5: Complete MVP Lesson
**Goal**: Deliver one polished 15-minute lesson that runs end to end in the browser and demonstrates the classroom hypothesis clearly.
**Depends on**: Phase 4
**Requirements**: [SPKG-02, PLAT-02]
**Success Criteria** (what must be TRUE):
  1. A child can complete one full browser lesson from start to finish without leaving the web experience.
  2. Later rounds ask the child to answer from pictures rather than only repeat the modeled phrase.
  3. The end-to-end lesson feels like a short class rather than a sequence of disconnected drills.
**Plans**: 2 plans

Plans:
- [ ] 05-01: Integrate all classroom states into a continuous 15-minute lesson run
- [ ] 05-02: Polish pacing, transitions, and final MVP validation flow

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Classroom Shell | 0/3 | Not started | - |
| 2. Cast and Orchestration | 0/3 | Not started | - |
| 3. Guided Speaking Flow | 0/3 | Not started | - |
| 4. Hints and Judgment | 0/3 | Not started | - |
| 5. Complete MVP Lesson | 0/2 | Not started | - |
