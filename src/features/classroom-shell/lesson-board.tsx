type LessonBoardProps = {
  currentItem: {
    imageAlt: string;
    imageSrc: string;
    text: string;
  };
  currentItemIndex: number;
  progressCount: number;
  stageBadge: string;
  stagePrompt: string;
  sessionStatus: string;
};

export function LessonBoard({
  currentItem,
  currentItemIndex,
  progressCount,
  stageBadge,
  stagePrompt,
  sessionStatus,
}: LessonBoardProps) {
  return (
    <section
      aria-label={`${currentItem.text} 课堂舞台`}
      className="relative h-full min-h-0 overflow-hidden rounded-[48px] border-4 border-slate-800 bg-slate-900 shadow-2xl"
      data-testid="classroom-stage"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_28%),radial-gradient(circle_at_80%_16%,rgba(56,189,248,0.16),transparent_26%),linear-gradient(180deg,#132033_0%,#0B1220_100%)]" />
      <img
        alt={currentItem.imageAlt}
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-15 blur-3xl"
        src={currentItem.imageSrc}
      />
      <div className="absolute inset-0 bg-black/10" />

      <div className="absolute left-8 top-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-black tracking-[0.18em] text-white/85 backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-[#10B981]" />
        {stageBadge}
      </div>

      <div className="relative z-10 flex h-full items-center justify-center p-12">
        <div className="flex h-full w-full items-center justify-center rounded-[40px] border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm">
          <img
            alt={currentItem.imageAlt}
            className="max-h-[76%] max-w-[76%] object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.38)]"
            src={currentItem.imageSrc}
          />
        </div>
      </div>

      <div className="absolute bottom-8 left-8 max-w-[520px] rounded-[28px] border border-white/10 bg-slate-950/45 px-6 py-5 backdrop-blur-md">
        <p className="text-[clamp(2rem,4vw,3.3rem)] font-black uppercase tracking-[-0.06em] text-white">
          {currentItem.text}
        </p>
        <p className="mt-2 text-sm leading-6 text-white/70">{stagePrompt}</p>
      </div>

      <div className="absolute bottom-8 right-8 flex items-center gap-2.5">
        {Array.from({ length: progressCount }, (_, index) => {
          const isActive = index === currentItemIndex;

          return (
            <span
              className={isActive ? 'h-2 w-10 rounded-full bg-[#10B981]' : 'h-2 w-2 rounded-full bg-white/20'}
              key={index}
            />
          );
        })}
      </div>

      <p className="sr-only">{sessionStatus}</p>
    </section>
  );
}
