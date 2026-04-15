# MyTurn

## What This Is

MyTurn is a web-based children's English speaking classroom MVP that recreates the emotional rhythm of a real online small-group lesson. Instead of feeling like a drill app, it should feel like a short live class with a teacher, one real child, and one AI classmate taking turns around image-driven oral practice. The first milestone is a complete 15-minute classroom experience that tests whether stronger classroom presence can increase speaking time without reducing willingness to participate.

## Core Value

A child should feel like they are truly in a small English class and stay willing to speak throughout the lesson.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Deliver one complete 15-minute browser-based English speaking lesson optimized for landscape tablet use
- [ ] Recreate teacher-led small-class pacing with turn taking, waiting, and point-to-answer flow
- [ ] Support configurable lesson content built from target words or short phrases paired with images
- [ ] Let the real child move from guided repetition into picture-based answering within the same lesson
- [ ] Keep the AI classmate believable enough to reduce pressure and strengthen classroom presence

### Out of Scope

- Native mobile or tablet app packaging — web-first MVP reduces launch friction and speeds up validation
- Real multi-child live classrooms — the MVP fixes the class size to one real child plus one AI classmate
- Large-scale curriculum management and authoring systems — the first release only needs enough structure to run one configurable lesson
- Parent operations, subscriptions, and business tooling — not required to validate classroom feel
- Production-grade pronunciation scoring engine — the MVP only needs answer judgment that supports class flow and confidence

## Context

The product idea comes from a real online children's English class format where a teacher uses image-based slides, avoids Chinese, and frequently calls on children to speak. The core insight is that the valuable part is not just oral practice itself, but the emotional structure of being in class: hearing another child answer first, preparing while watching, and then getting called on. Phase 1 is intentionally framed as a classroom engine rather than a content library, with one 15-minute lesson, five configurable target items, a teacher persona, and an AI classmate that feels supportive rather than robotic.

## Constraints

- **Platform**: Web app first — validate quickly without app store distribution overhead
- **Lesson format**: Fixed 15-minute session with 2-student classroom structure — keeps MVP scope tight and testable
- **Class composition**: 1 teacher, 1 real child, 1 AI classmate — preserves small-class feel while avoiding real-time multiplayer complexity
- **Input model**: Image + English audio first — supports immersion and mirrors the source classroom style
- **Language**: Child-facing flow should stay English-first — avoids falling back into explanation-heavy bilingual tutoring
- **Content model**: Five configurable target words or short phrases per lesson — enough content to test pacing without building a full curriculum system
- **Experience**: Must feel like a class, not a tool page — UI and motion choices should reinforce presence and rhythm

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Web-first MVP | Faster validation than native app distribution | — Pending |
| Fixed 2-person classroom format | Preserves live-class pressure relief and pacing with minimal complexity | — Pending |
| Teacher-led turn calling | Pointed nomination is central to classroom presence | — Pending |
| AI classmate should be slightly imperfect | Realism matters more than polished demo playback | — Pending |
| Lesson loop should progress from repetition to picture answering | The product must increase active output over the session | — Pending |
| Light-prompt correction before fallback modeling | Keeps children speaking without turning the class into 1:1 remediation | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `$gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `$gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check -> still the right priority?
3. Audit Out of Scope -> reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-15 after initialization*
