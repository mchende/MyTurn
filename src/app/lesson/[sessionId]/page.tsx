import { notFound } from 'next/navigation';

import { ClassroomShell } from '@/features/classroom-shell/classroom-shell';
import { loadLesson } from '@/features/lesson-config/load-lesson';
import { buildDaySessions } from '@/features/schedule/build-day-sessions';
import { defaultWeekdayScheduleTemplate } from '../../../../content/schedules/default-weekday';

type LessonPageProps = {
  params: Promise<{
    sessionId: string;
  }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { sessionId } = await params;
  const today = getReferenceNow();
  const session = buildDaySessions({
    template: defaultWeekdayScheduleTemplate,
    date: today,
    now: today,
  }).find((item) => item.sessionId === sessionId);

  if (!session) {
    notFound();
  }

  const lesson = loadLesson(session.lessonId);

  return <ClassroomShell lesson={lesson} sessionId={session.sessionId} />;
}

function getReferenceNow() {
  const fixedNow = process.env.MYTURN_FIXED_NOW;

  if (fixedNow) {
    return new Date(fixedNow);
  }

  return new Date();
}
