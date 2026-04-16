import { Plus } from 'lucide-react';

type StudentSeatStripProps = {
  sessionId: string;
};

export function StudentSeatStrip({ sessionId }: StudentSeatStripProps) {
  return (
    <section className="w-full max-w-[420px]" data-testid="classroom-seat-strip">
      <div className="flex items-center gap-4 rounded-[24px] border border-white/5 bg-white/5 p-2 backdrop-blur-md">
        <SeatAvatar
          imageAlt="我的席位"
          imageSrc="/avatars/reward-student.svg"
          isOnStage
          label="我"
          sessionId={sessionId}
        />
        <SeatAvatar imageAlt="AI 同学 Bobby" imageSrc="/avatars/student-bobby.svg" label="AI" />
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-dashed border-slate-800 text-slate-700">
          <Plus className="h-5 w-5 opacity-40" />
        </div>
      </div>
    </section>
  );
}

function SeatAvatar({
  imageSrc,
  imageAlt,
  label,
  isOnStage = false,
  sessionId,
}: {
  imageSrc: string;
  imageAlt: string;
  label: string;
  isOnStage?: boolean;
  sessionId?: string;
}) {
  return (
    <div className="relative">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl p-0.5 ${
          isOnStage ? 'border-2 border-[#10B981] bg-[#10B981] opacity-50' : 'border border-slate-700 bg-slate-800'
        }`}
      >
        <img
          alt={imageAlt}
          className={`h-full w-full rounded-[14px] ${isOnStage ? 'bg-white grayscale' : 'bg-slate-800'}`}
          src={imageSrc}
        />
      </div>

      {isOnStage ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded bg-black/60 px-1.5 py-0.5 text-[8px] font-black uppercase text-white">
            讲台中
          </span>
        </div>
      ) : null}

      <span className="sr-only">{label}</span>
      {sessionId ? <span className="sr-only">{sessionId}</span> : null}
    </div>
  );
}
