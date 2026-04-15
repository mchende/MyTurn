import { Volume2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type TeacherPanelProps = {
  lessonTitle: string;
};

export function TeacherPanel({ lessonTitle }: TeacherPanelProps) {
  return (
    <Card
      className="border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,253,244,0.88))] p-6"
      data-testid="classroom-teacher-panel"
    >
      <CardContent className="gap-5">
        <CardHeader className="gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-classroom-accent-strong">
            Teacher
          </p>
          <CardTitle className="text-[1.8rem] text-classroom-ink">Teacher Mia</CardTitle>
        </CardHeader>

        <div className="flex items-start gap-4 rounded-[1.35rem] bg-white/88 p-4 shadow-[0_18px_28px_rgba(17,24,39,0.06)]">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-classroom-accent/12 text-classroom-accent-strong">
            <Volume2 className="size-5" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-classroom-ink/72">课堂主导位</p>
            <p className="text-sm leading-6 text-classroom-ink/68">
              持续带班、点名、示范发音，让课堂一直保持像一节真实小班课。
            </p>
          </div>
        </div>

        <div className="rounded-[1.35rem] border border-black/6 bg-black/[0.03] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-classroom-ink/46">
            Current lesson
          </p>
          <p className="mt-2 font-display text-xl font-bold tracking-[-0.03em] text-classroom-ink">
            {lessonTitle}
          </p>
          <p className="mt-2 text-sm leading-6 text-classroom-ink/62">
            保持教师区固定可见，让孩子始终感到自己正在跟老师上课。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
