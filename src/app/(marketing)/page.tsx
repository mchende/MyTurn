import { HomepageShell } from '@/features/homepage/homepage-shell';
import { getTodayScheduleViewModel } from '@/features/schedule/get-today-schedule-view-model';

export { HomepageShell } from '@/features/homepage/homepage-shell';
export { type TodayScheduleViewModel } from '@/features/schedule/get-today-schedule-view-model';

export default async function HomePage() {
  const viewModel = getTodayScheduleViewModel();

  return <HomepageShell viewModel={viewModel} />;
}
