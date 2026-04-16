import { MicOff } from 'lucide-react';

import { cn } from '@/lib/utils';

type StudentSeatStripProps = {
  sessionId: string;
};

const participants = [
  {
    id: 'cherry',
    name: 'cherry11801265',
    tone: 'window',
  },
  {
    id: 'cici',
    name: 'Cici amanda11801282',
    tone: 'wall',
  },
  {
    id: 'carl',
    name: 'Carl11801154',
    tone: 'counter',
  },
  {
    id: 'george',
    name: 'George11801132',
    tone: 'cabinet',
  },
  {
    id: 'eason',
    name: 'eason11801247',
    tone: 'fridge',
  },
  {
    id: 'yilia',
    name: 'yilia11801081',
    tone: 'host',
  },
] as const;

export function StudentSeatStrip({ sessionId }: StudentSeatStripProps) {
  return (
    <section
      className="overflow-x-auto border-b border-white/7 bg-[#222222] px-4 py-5 md:px-6"
      data-testid="classroom-seat-strip"
    >
      <div className="flex min-w-max gap-3 xl:min-w-0">
        {participants.map((participant, index) => (
          <article
            className={cn(
              'relative h-[140px] w-[220px] shrink-0 overflow-hidden bg-[#434343] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] md:h-[160px] md:w-[260px] xl:flex-1',
              participant.tone === 'host' && 'ring-1 ring-white/10',
            )}
            key={participant.id}
          >
            <div className={cn('absolute inset-0', participantSurfaceClassName(participant.tone))} />

            {participant.id === 'carl' ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#e9edf7] text-[3rem] font-bold text-[#2d7df3]">
                  9
                </div>
              </div>
            ) : null}

            {participant.id !== 'carl' ? (
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(0,0,0,0.26)_100%)]" />
            ) : null}

            <div className="absolute bottom-2 left-2 flex items-center gap-2 text-white">
              <MicOff className="size-4 text-[#ff563d]" />
              <span className="font-body text-[0.82rem] md:text-[0.95rem]">{participant.name}</span>
            </div>

            {index === 0 ? (
              <div className="absolute right-3 top-3 rounded-full bg-black/20 px-3 py-1 text-[0.72rem] text-white/72">
                {sessionId}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function participantSurfaceClassName(tone: (typeof participants)[number]['tone']) {
  switch (tone) {
    case 'window':
      return 'bg-[radial-gradient(circle_at_63%_32%,rgba(235,243,214,0.85),transparent_10%),linear-gradient(180deg,#4e504f_0%,#222526_58%,#0d0f10_100%)] before:absolute before:inset-x-[44%] before:top-0 before:h-full before:w-[2px] before:bg-white/14 after:absolute after:left-[58%] after:top-[16%] after:h-[48%] after:w-[21%] after:rounded-[1rem] after:bg-[radial-gradient(circle_at_50%_38%,rgba(171,231,120,0.9),rgba(17,104,34,0.9)_66%,transparent_67%)]';
    case 'wall':
      return 'bg-[linear-gradient(90deg,#817d74_0%,#d1d0c9_48%,#ebe8e0_100%)]';
    case 'counter':
      return 'bg-[#444444]';
    case 'cabinet':
      return 'bg-[linear-gradient(180deg,#c6d7ef_0%,#dde9f6_24%,#d8c6b1_24%,#d8c6b1_100%)] after:absolute after:left-[34%] after:top-[42%] after:h-[36%] after:w-[30%] after:bg-[radial-gradient(circle_at_40%_30%,#e6b7bf,#ad4b63)]';
    case 'fridge':
      return 'bg-[linear-gradient(90deg,#090909_0%,#232323_18%,#e2d5d1_19%,#eee6e4_65%,#e4efef_100%)] before:absolute before:right-[12%] before:top-[14%] before:h-[58%] before:w-[28%] before:rounded-[1.4rem] before:bg-[#f6f4f2] before:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]';
    case 'host':
      return 'bg-[radial-gradient(circle_at_70%_10%,rgba(255,255,255,0.2),transparent_20%),linear-gradient(135deg,#453938_0%,#2a3343_46%,#202020_100%)]';
  }
}
