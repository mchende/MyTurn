import type { Lesson } from '@/features/lesson-config/lesson-schema';

type LessonBoardProps = {
  lesson: Lesson;
};

export function LessonBoard({ lesson }: LessonBoardProps) {
  const firstItem = lesson.items[0];

  return (
    <section
      className="overflow-hidden rounded-[calc(var(--radius-panel)+0.35rem)] bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(17,24,39,0.94))] p-4 text-white shadow-[0_34px_64px_rgba(15,23,42,0.32)] md:p-6"
      data-testid="classroom-lesson-board"
    >
      <div className="flex h-full min-h-[360px] flex-col gap-5 md:min-h-[620px]">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/58">
              Lesson board
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] md:text-[2.5rem]">
              {lesson.title}
            </h1>
          </div>
          <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold text-white/74">
            图片主导理解
          </div>
        </header>

        <div className="relative flex-1 overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_top,rgba(40,199,111,0.18),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-4 md:p-6">
          <div className="absolute inset-x-6 top-5 h-12 rounded-full bg-white/6 blur-3xl" />
          <div className="relative flex h-full flex-col items-center justify-center gap-5 rounded-[1.5rem] border border-white/8 bg-black/14 p-4 text-center md:p-8">
            <img
              alt={firstItem.imageAlt}
              className="h-auto max-h-[360px] w-full max-w-[520px] object-contain"
              height={firstItem.imageHeight}
              src={firstItem.imageSrc}
              width={firstItem.imageWidth}
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/56">
                Current target
              </p>
              <p className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] md:text-4xl">
                {firstItem.text}
              </p>
              <p className="mt-3 text-sm leading-6 text-white/70">{firstItem.imageAlt}</p>
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-10 rounded-full bg-classroom-accent" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/28" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/28" />
          </div>
          <p className="text-sm font-semibold text-white/64">Slide 1 / {lesson.items.length}</p>
        </footer>
      </div>
    </section>
  );
}
