import type { Lesson } from '@/features/lesson-config/lesson-schema';

type LessonBoardProps = {
  lesson: Lesson;
  sessionStatus: string;
};

export function LessonBoard({ lesson, sessionStatus }: LessonBoardProps) {
  const firstItem = lesson.items[0];

  return (
    <section
      className="relative flex-1 overflow-hidden bg-[#222222]"
      data-testid="classroom-stage"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_24%),linear-gradient(180deg,#222222_0%,#1f1f1f_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/8" />

      <div className="relative flex min-h-[calc(100vh-14.65rem)] items-center justify-center px-6 py-16">
        <div className="pointer-events-none absolute inset-x-[12%] top-[18%] h-px bg-white/5" />

        <div className="max-w-[420px] rounded-[2rem] border border-white/7 bg-white/[0.03] px-8 py-7 text-center shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm">
          <p className="font-body text-[0.86rem] uppercase tracking-[0.24em] text-white/46">Class Stage</p>
          <p className="mt-4 font-display text-[2rem] font-bold tracking-[-0.05em] text-white/86">{firstItem.text.toUpperCase()}</p>
          <p className="mt-3 text-[1rem] text-white/56">{lesson.title}</p>
          <div className="mt-7 flex items-center justify-center">
            <div className="rounded-[1.6rem] bg-white/95 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.14)]">
              <img
                alt={firstItem.imageAlt}
                className="h-36 w-36 object-contain"
                height={firstItem.imageHeight}
                src={firstItem.imageSrc}
                width={firstItem.imageWidth}
              />
            </div>
          </div>
          <p className="mt-6 text-[0.98rem] text-white/54">{firstItem.imageAlt}</p>
          <p className="mt-2 text-[0.95rem] text-white/44">{sessionStatus}</p>
        </div>
      </div>
    </section>
  );
}
