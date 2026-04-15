import Link from 'next/link';
import { ArrowRight, LockKeyhole, Sparkles } from 'lucide-react';

import { EntryCountdown } from './entry-countdown';
import type { TodayScheduleSessionViewModel } from './get-today-schedule-view-model';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

type SessionCardProps = {
  session: TodayScheduleSessionViewModel;
  isFeatured?: boolean;
};

const stateMeta = {
  upcoming: {
    label: '即将开始',
    badgeVariant: 'outline' as const,
  },
  open_for_entry: {
    label: '可入场',
    badgeVariant: 'default' as const,
  },
  in_progress_locked: {
    label: '已开课，停止入场',
    badgeVariant: 'secondary' as const,
  },
  completed: {
    label: '已结束',
    badgeVariant: 'secondary' as const,
  },
};

export function SessionCard({ session, isFeatured = false }: SessionCardProps) {
  const meta = stateMeta[session.accessState];
  const isUpcoming = session.accessState === 'upcoming';
  const isOpen = session.accessState === 'open_for_entry';
  const isLocked = session.accessState === 'in_progress_locked';

  return (
    <Card
      aria-label={`${session.title} ${session.startTimeLabel}`}
      className={cn(
        'flex min-h-[260px] flex-col p-6',
        isFeatured &&
          'border-classroom-accent/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,253,244,0.92))]',
      )}
    >
      <CardContent>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <Badge variant={meta.badgeVariant}>{meta.label}</Badge>
              <CardTitle>{session.title}</CardTitle>
            </div>
            <div
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-semibold',
                isOpen
                  ? 'border-classroom-accent/20 bg-emerald-50 text-classroom-accent-strong'
                  : 'border-black/8 bg-white/80 text-classroom-ink/60',
              )}
            >
              课堂
            </div>
          </div>

          <CardDescription className="text-sm font-medium text-classroom-ink/72">
            {session.timeRangeLabel} · {session.durationMinutes} 分钟
          </CardDescription>
        </CardHeader>

        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(248,250,252,0.96),rgba(236,253,245,0.72))] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-classroom-ink/38">
            {isUpcoming ? 'NEXT SESSION' : isOpen ? 'ENTRY WINDOW' : 'CLASS STATUS'}
          </p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-4xl font-bold tracking-[-0.04em] text-classroom-ink">
                {session.startTimeLabel}
              </p>
              <p className="mt-2 text-sm text-classroom-ink/62">
                {isLocked ? '老师已开始点名，本节课暂停入场。' : '请按课程节奏进入课堂，保持上课状态。'}
              </p>
            </div>

            {(isUpcoming || isOpen) && (
              <div className="text-right text-sm font-semibold text-classroom-accent-strong">
                {isOpen ? (
                  <EntryCountdown
                    startsAt={session.startsAt}
                    initialLabel={session.countdownLabel}
                    className="justify-end"
                  />
                ) : (
                  session.countdownLabel
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-2 text-sm text-classroom-ink/65">
          <p className="font-medium text-classroom-ink/76">{session.campLabel}</p>
          <p>{session.learnerLabel}</p>
          <p>{session.attendanceLabel}</p>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex items-center gap-2 text-sm font-medium text-classroom-ink/56">
          {isOpen ? (
            <>
              <Sparkles className="size-4 text-classroom-accent" />
              <span>老师即将点名，准备进入。</span>
            </>
          ) : isLocked ? (
            <>
              <LockKeyhole className="size-4" />
              <span>已开课，停止入场</span>
            </>
          ) : (
            <span>{meta.label}</span>
          )}
        </div>

        {isOpen ? (
          <Link
            className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}
            href={`/lesson/${session.sessionId}`}
          >
            进入课堂
            <ArrowRight className="size-4" />
          </Link>
        ) : isLocked ? (
          <Button aria-disabled className="pointer-events-none" variant="secondary">
            已开课，停止入场
          </Button>
        ) : (
          <div className="text-right text-sm font-semibold text-classroom-ink/48">
            {session.accessState === 'completed' ? '已结束' : '即将开始'}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
