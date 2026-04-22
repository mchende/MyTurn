import { HomepageShell } from '@/features/homepage/homepage-shell';
import { getTodayScheduleViewModel } from '@/features/schedule/get-today-schedule-view-model';

export { HomepageShell } from '@/features/homepage/homepage-shell';
export { type TodayScheduleViewModel } from '@/features/schedule/get-today-schedule-view-model';

type HomePageSearchParams = Promise<{
  completedSession?: string;
}>;

export default async function HomePage({
  searchParams,
}: {
  searchParams?: HomePageSearchParams;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const viewModel = getTodayScheduleViewModel(undefined, {
    completedSessionId: resolvedSearchParams?.completedSession ?? null,
  });

  return <HomepageShell viewModel={viewModel} />;
}
