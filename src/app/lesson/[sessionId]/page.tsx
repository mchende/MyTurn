import { notFound } from 'next/navigation';

import { ClassroomShell } from '@/features/classroom-shell/classroom-shell';
import { loadLesson } from '@/features/lesson-config/load-lesson';
import { getTodayScheduleViewModel } from '@/features/schedule/get-today-schedule-view-model';
import { buildDaySessions } from '@/features/schedule/build-day-sessions';
import { getReferenceNow } from '@/lib/time/reference-now';
import { defaultWeekdayScheduleTemplate } from '../../../../content/schedules/default-weekday';

type LessonPageProps = {
  params: Promise<{
    sessionId: string;
  }>;
  searchParams?: Promise<{
    reward?: string;
  }>;
};

export default async function LessonPage({ params, searchParams }: LessonPageProps) {
  const { sessionId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
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
      showReward={resolvedSearchParams.reward === '1'}
      sessionTitle={sessionView.title}
      sessionStatus={getSessionStatus(sessionView)}
    />
  );
}

function getSessionStatus(session: { accessState: string; countdownLabel: string; startTimeLabel: string }) {
  if (session.accessState === 'open_for_entry') {
    return `检票入场中: ${session.countdownLabel.replace('距开场 ', '')}`;
  }

  if (session.accessState === 'in_progress_locked') {
    return '课堂进行中';
  }

  if (session.accessState === 'completed') {
    return '已结束';
  }

  return `等待开课: ${session.startTimeLabel}`;
}
