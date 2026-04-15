import { Mic, Sparkles } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type StagePanelProps = {
  activeStudentName?: string | null;
  activeStudentRole?: string | null;
};

export function StagePanel({
  activeStudentName = null,
  activeStudentRole = null,
}: StagePanelProps) {
  const hasActiveStudent = Boolean(activeStudentName);

  return (
    <Card
      className={cn(
        'h-full min-h-[220px] border-0 bg-[linear-gradient(180deg,rgba(17,24,39,0.95),rgba(31,41,55,0.94))] p-6 text-white shadow-[0_26px_44px_rgba(17,24,39,0.24)]',
        hasActiveStudent && 'ring-1 ring-classroom-accent/45',
      )}
      data-testid="classroom-stage-panel"
    >
      <CardContent className="h-full gap-5">
        <CardHeader className="gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
            Stage
          </p>
          <CardTitle className="text-white">讲台区</CardTitle>
        </CardHeader>

        {hasActiveStudent ? (
          <div className="mt-auto rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(40,199,111,0.2),rgba(255,255,255,0.12))] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-3xl font-bold tracking-[-0.04em]">
                  {activeStudentName}
                </p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-white/68">
                  {activeStudentRole}
                </p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-full bg-white/12">
                <Mic className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/78">
              老师一次只点名 1 位学生上台，其他人继续留在学生席里准备。
            </p>
          </div>
        ) : (
          <div className="mt-auto rounded-[1.5rem] border border-dashed border-white/16 bg-white/6 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-3xl font-bold tracking-[-0.04em]">待上台</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-white/62">
                  One student at a time
                </p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-full bg-white/10">
                <Sparkles className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/74">
              讲台始终可见，老师点名后学生会从顶部席位进入这里。
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
