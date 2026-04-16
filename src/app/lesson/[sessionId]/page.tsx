import { notFound } from 'next/navigation';

import { ClassroomShell } from '@/features/classroom-shell/classroom-shell';
import { loadLesson } from '@/features/lesson-config/load-lesson';
import { getTodayScheduleViewModel } from '@/features/schedule/get-today-schedule-view-model';
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
  const sessions = buildDaySessions({
    template: defaultWeekdayScheduleTemplate,
    date: today,
    now: today,
  });
  const session = sessions.find((item) => item.sessionId === sessionId);
  const sessionView = getTodayScheduleViewModel(today).sessions.find((item) => item.sessionId === sessionId);

  if (!session || !sessionView) {
    notFound();
  }

  const lesson = loadLesson(session.lessonId);

  return (
    <ClassroomShell
      lesson={lesson}
      sessionId={session.sessionId}
      sessionTitle={sessionView.title}
      sessionStatus={getSessionStatus(sessionView)}
    />
  );
}

function getReferenceNow() {
  const fixedNow = process.env.MYTURN_FIXED_NOW;

  if (fixedNow) {
    return new Date(fixedNow);
  }

  return new Date();
}

function getSessionStatus(session: { accessState: string; countdownLabel: string; startTimeLabel: string }) {
  if (session.accessState === 'open_for_entry') {
    return `将要开课: ${session.countdownLabel.replace('距开场 ', '')}`;
  }

  if (session.accessState === 'in_progress_locked') {
    return '课堂进行中';
  }

  if (session.accessState === 'completed') {
    return '已结束';
  }

  return `将要开课: ${session.startTimeLabel}`;
}
