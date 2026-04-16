import { Plus } from 'lucide-react';

import type { StudentSeatViewModel } from './podium-view-model';

type StudentSeatStripProps = {
  seats: readonly StudentSeatViewModel[];
  sessionId: string;
};

export function StudentSeatStrip({ seats, sessionId }: StudentSeatStripProps) {
  return (
    <section className="w-full max-w-[420px]" data-testid="classroom-seat-strip">
      <div className="flex items-center gap-4 rounded-[24px] border border-white/5 bg-white/5 p-2 backdrop-blur-md">
        {seats.map((seat) =>
          seat.isEmpty ? (
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-dashed border-slate-800 text-slate-700"
              data-testid={seat.testId}
              key={seat.id}
            >
              <Plus className="h-5 w-5 opacity-40" />
              <span className="sr-only">{seat.label}</span>
            </div>
          ) : (
            <SeatAvatar
              imageAlt={seat.imageAlt ?? seat.label}
              imageSrc={seat.imageSrc ?? ''}
              isOnStage={seat.isOnStage}
              key={seat.id}
              label={seat.label}
              sessionId={seat.id === 'me' ? sessionId : undefined}
              testId={seat.testId}
            />
          ),
        )}
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
  testId,
}: {
  imageSrc: string;
  imageAlt: string;
  label: string;
  isOnStage?: boolean;
  sessionId?: string;
  testId?: string;
}) {
  return (
    <div className="relative" data-on-stage={isOnStage} data-testid={testId}>
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
