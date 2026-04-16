import type { Lesson } from '@/features/lesson-config/lesson-schema';

type LessonBoardProps = {
  lesson: Lesson;
  sessionStatus: string;
  showReward?: boolean;
};

export function LessonBoard({ lesson, sessionStatus }: LessonBoardProps) {
  return (
    <section
      aria-label={`${lesson.title} 课堂舞台`}
      className="relative h-full min-h-0 overflow-hidden rounded-[48px] border-4 border-slate-800 bg-slate-900 shadow-2xl"
      data-testid="classroom-stage"
    >
      <img
        alt="动物课堂主画面"
        className="h-full w-full object-cover"
        src="/stage/zoo-immersive-stage.svg"
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute bottom-8 left-8 flex items-center gap-2.5">
        <span className="h-2 w-10 rounded-full bg-[#10B981]" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
      </div>

      <p className="sr-only">{sessionStatus}</p>
    </section>
  );
}
