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
  debugTargetText?: string;
  showDebugTarget?: boolean;
};

export function LessonBoard({
  currentItem,
  currentItemIndex,
  debugTargetText,
  progressCount,
  stageBadge,
  stagePrompt,
  sessionStatus,
  showDebugTarget = false,
}: LessonBoardProps) {
  const shouldShowDebugTarget = showDebugTarget && Boolean(debugTargetText);

  return (
    <section
      aria-label="Classroom stage"
      className="relative h-full min-h-0 overflow-hidden rounded-[48px] border-4 border-slate-800 bg-slate-900 shadow-2xl"
      data-testid="classroom-stage"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_28%),radial-gradient(circle_at_80%_16%,rgba(56,189,248,0.16),transparent_26%),linear-gradient(180deg,#132033_0%,#0B1220_100%)]" />
      <img
        alt={currentItem.imageAlt}
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-15 blur-3xl"
        src={currentItem.imageSrc}
      />
      <div className="absolute inset-0 bg-black/5" />

      <div
        className="absolute left-4 top-4 z-20 inline-flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-2 text-[10px] font-black tracking-[0.12em] text-white/85 backdrop-blur-md sm:left-6 sm:top-6 sm:px-4 sm:text-xs sm:tracking-[0.18em]"
        data-testid="lesson-stage-badge"
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#10B981]" />
        <span className="truncate">{stageBadge}</span>
      </div>

      <div className="relative z-10 flex h-full items-center justify-center px-6 pb-24 pt-20 sm:px-10 sm:pb-24 sm:pt-24 xl:px-12">
        <img
          alt={currentItem.imageAlt}
          className="max-h-full max-w-full object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.32)]"
          src={currentItem.imageSrc}
        />
      </div>

      <div className="absolute bottom-5 left-4 right-24 z-20 rounded-[24px] border border-white/10 bg-slate-950/28 px-4 py-3 sm:bottom-6 sm:left-6 sm:right-28 sm:px-5 sm:py-4">
        {shouldShowDebugTarget ? (
          <p className="text-[clamp(2rem,4vw,3.3rem)] font-black uppercase tracking-[-0.06em] text-white">
            {debugTargetText}
          </p>
        ) : null}
        <p
          aria-live="polite"
          className={shouldShowDebugTarget ? 'mt-2 text-sm leading-6 text-white/70' : 'text-sm leading-6 text-white/70'}
          data-testid="lesson-stage-prompt"
        >
          {stagePrompt}
        </p>
      </div>

      <div className="absolute bottom-5 right-4 z-20 flex items-center gap-2.5 sm:bottom-6 sm:right-6">
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
