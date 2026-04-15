import type { Lesson } from '@/features/lesson-config/lesson-schema';

import { LessonBoard } from './lesson-board';
import { StagePanel } from './stage-panel';
import { StudentSeatStrip, type StudentSeat } from './student-seat-strip';
import { TeacherPanel } from './teacher-panel';

type ClassroomShellProps = {
  lesson: Lesson;
  sessionId: string;
  activeSeatId?: string | null;
};

// D-24/D-25/D-26: fixed one teacher + one real child + one AI classmate,
// with one student on stage at a time while others keep visible breathing space in seats.
const classroomSeats: StudentSeat[] = [
  { id: 'you', name: 'You', roleLabel: 'Real child', tone: 'student' },
  { id: 'milo', name: 'Milo', roleLabel: 'AI classmate', tone: 'ai' },
  { id: 'seat-3', name: 'Seat 3', roleLabel: 'Atmosphere', tone: 'placeholder' },
  { id: 'seat-4', name: 'Seat 4', roleLabel: 'Atmosphere', tone: 'placeholder' },
];

export function ClassroomShell({
  lesson,
  sessionId,
  activeSeatId = null,
}: ClassroomShellProps) {
  const activeSeat = classroomSeats.find((seat) => seat.id === activeSeatId) ?? null;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eefbf3_100%)] px-4 py-4 md:px-6 md:py-6 xl:px-10">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 md:gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-classroom-accent-strong">
              Classroom
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.05em] text-classroom-ink md:text-[2.55rem]">
              {lesson.title}
            </h1>
          </div>
          <div className="rounded-full border border-black/6 bg-white/88 px-4 py-2 text-sm font-semibold text-classroom-ink/64">
            Session {sessionId}
          </div>
        </div>

        <StudentSeatStrip activeSeatId={activeSeatId} seats={classroomSeats} />

        <section
          className="flex flex-col gap-4 md:grid md:grid-cols-[minmax(0,1.7fr)_minmax(18rem,0.95fr)] md:gap-6 xl:gap-8"
          data-testid="classroom-shell"
        >
          <LessonBoard lesson={lesson} />

          <div
            className="flex flex-col gap-4 sm:grid sm:grid-cols-2 md:flex md:min-h-[620px] md:grid-cols-none md:justify-between"
            data-testid="classroom-role-column"
          >
            <StagePanel
              activeStudentName={activeSeat?.name ?? null}
              activeStudentRole={activeSeat?.roleLabel ?? null}
            />
            <TeacherPanel lessonTitle={lesson.title} />
          </div>
        </section>
      </div>
    </main>
  );
}
