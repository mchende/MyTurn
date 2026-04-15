import { UserRound, Sparkles, Armchair } from 'lucide-react';

import { cn } from '@/lib/utils';

export type StudentSeat = {
  id: string;
  name: string;
  roleLabel: string;
  tone: 'student' | 'ai' | 'placeholder';
};

type StudentSeatStripProps = {
  seats: StudentSeat[];
  activeSeatId?: string | null;
};

const seatToneClasses: Record<StudentSeat['tone'], string> = {
  student: 'border-classroom-accent/30 bg-white text-classroom-ink',
  ai: 'border-emerald-200/80 bg-emerald-50/80 text-classroom-ink',
  placeholder: 'border-white/10 bg-white/6 text-white/72',
};

const iconMap = {
  student: UserRound,
  ai: Sparkles,
  placeholder: Armchair,
} satisfies Record<StudentSeat['tone'], typeof UserRound>;

export function StudentSeatStrip({ seats, activeSeatId = null }: StudentSeatStripProps) {
  return (
    <section
      className="overflow-x-auto rounded-[calc(var(--radius-panel)-0.15rem)] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] p-3 shadow-[0_20px_38px_rgba(17,24,39,0.08)] md:grid md:grid-cols-4 md:gap-3 md:overflow-visible md:p-4"
      data-testid="classroom-seat-strip"
    >
      <div className="flex min-w-max gap-3 md:contents">
        {seats.map((seat) => {
          const isActive = seat.id === activeSeatId;
          const Icon = iconMap[seat.tone];

          return (
            <article
              className={cn(
                'min-w-[150px] rounded-[1.35rem] border px-4 py-3 transition-colors',
                seatToneClasses[seat.tone],
                isActive &&
                  'border-classroom-accent bg-[linear-gradient(135deg,rgba(40,199,111,0.18),rgba(255,255,255,0.98))] shadow-[0_16px_32px_rgba(40,199,111,0.14)]',
              )}
              key={seat.id}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold tracking-[-0.03em]">{seat.name}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] opacity-70">
                    {seat.roleLabel}
                  </p>
                </div>
                <div
                  className={cn(
                    'flex size-10 items-center justify-center rounded-full',
                    seat.tone === 'placeholder'
                      ? 'bg-white/10'
                      : 'bg-classroom-accent/12 text-classroom-accent-strong',
                  )}
                >
                  <Icon className="size-4" />
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 opacity-72">
                {isActive ? '已被老师点名，正在讲台。' : '在学生席等待轮到自己。'}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
