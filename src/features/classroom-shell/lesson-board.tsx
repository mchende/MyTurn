import type { Lesson } from '@/features/lesson-config/lesson-schema';

type LessonBoardProps = {
  lesson: Lesson;
  sessionStatus: string;
  showReward?: boolean;
};

export function LessonBoard({ lesson, sessionStatus, showReward = false }: LessonBoardProps) {
  return (
    <section
      aria-label={`${lesson.title} 课堂舞台`}
      className="relative min-h-[780px] overflow-hidden rounded-[46px] border-[7px] border-[#22314a] bg-[radial-gradient(circle_at_50%_20%,rgba(33,55,86,0.62),transparent_42%),linear-gradient(180deg,#10192c_0%,#111a2f_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      data-testid="classroom-stage"
    >
      <div className="absolute inset-[14px] rounded-[34px] border border-white/10" />
      <div className="absolute left-6 top-6 h-6 w-6 overflow-hidden rounded-tl-[12px]">
        <div className="h-8 w-8 -translate-x-4 -translate-y-4 rotate-45 bg-[#8cf05d]" />
      </div>

      {showReward ? (
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <div className="text-center">
            <div className="mx-auto flex h-[170px] w-[170px] items-center justify-center rounded-full border-[7px] border-[#fff078] bg-[#ffc400] shadow-[0_0_0_12px_rgba(255,214,10,0.08),0_0_64px_rgba(255,214,10,0.5)] animate-pulse" />
            <p className="mt-10 text-[clamp(4rem,7vw,6.4rem)] font-extrabold italic tracking-[-0.08em] text-[#ffc400] drop-shadow-[0_8px_18px_rgba(255,196,0,0.22)]">
              GREAT JOB!
            </p>
          </div>
        </div>
      ) : null}

      <div className="absolute bottom-10 left-14 flex items-center gap-5">
        <span className="h-5 w-20 rounded-full bg-[#19be84]" />
        <span className="h-5 w-5 rounded-full bg-white/22" />
        <span className="h-5 w-5 rounded-full bg-white/22" />
        <span className="h-5 w-5 rounded-full bg-white/22" />
      </div>

      <p className="sr-only">{sessionStatus}</p>
    </section>
  );
}
