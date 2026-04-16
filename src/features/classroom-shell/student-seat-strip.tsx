type StudentSeatStripProps = {
  sessionId: string;
};

export function StudentSeatStrip({ sessionId }: StudentSeatStripProps) {
  return (
    <section className="w-full max-w-[520px]" data-testid="classroom-seat-strip">
      <div className="flex items-center gap-6 rounded-[32px] border border-white/8 bg-white/[0.04] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <SeatAvatar
          imageAlt="讲台中的 Cora 老师"
          imageSrc="/avatars/teacher-cora.svg"
          isSpeaking
          sessionId={sessionId}
        />
        <SeatAvatar imageAlt="同学 Bobby" imageSrc="/avatars/student-bobby.svg" />
        <div className="h-[108px] w-[108px] rounded-[28px] border-4 border-dashed border-[#22314a] bg-[#202b40]/55" />
      </div>
    </section>
  );
}

function SeatAvatar({
  imageSrc,
  imageAlt,
  isSpeaking = false,
  sessionId,
}: {
  imageSrc: string;
  imageAlt: string;
  isSpeaking?: boolean;
  sessionId?: string;
}) {
  return (
    <div className="relative h-[108px] w-[108px] rounded-[30px] border border-white/10 bg-[#243149] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className={`${isSpeaking ? 'ring-4 ring-[#19be84]' : ''} overflow-hidden rounded-[24px]`}>
        <img alt={imageAlt} className="block h-[92px] w-[92px]" src={imageSrc} />
      </div>

      {isSpeaking ? (
        <span className="absolute left-1/2 top-10 -translate-x-1/2 rounded-[14px] bg-black/55 px-4 py-2 text-[0.9rem] font-bold text-white backdrop-blur-sm">
          讲台中
        </span>
      ) : null}

      {sessionId ? <span className="sr-only">{sessionId}</span> : null}
    </div>
  );
}
