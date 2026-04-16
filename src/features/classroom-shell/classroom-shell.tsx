import {
  ChevronDown,
  Grid2x2,
  MicOff,
  Minimize2,
  Signal,
  UserCircle2,
  UsersRound,
  Volume2,
  VolumeX,
} from 'lucide-react';

import type { Lesson } from '@/features/lesson-config/lesson-schema';

import { LessonBoard } from './lesson-board';
import { StudentSeatStrip } from './student-seat-strip';

type ClassroomShellProps = {
  lesson: Lesson;
  sessionId: string;
  sessionTitle: string;
  sessionStatus: string;
};

export function ClassroomShell({
  lesson,
  sessionId,
  sessionTitle,
  sessionStatus,
}: ClassroomShellProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#252525] text-white">
      <header className="flex h-[4.65rem] items-center justify-between border-b border-white/8 bg-[#262626] px-4 md:px-6">
        <div className="flex items-center gap-3 text-white/75">
          <Signal className="size-5" />
        </div>

        <div className="flex items-center gap-8">
          <h1 className="max-w-[55vw] truncate text-center font-body text-[1.05rem] font-medium text-white/88 md:text-[1.1rem]">
            {sessionTitle}
          </h1>
          <p className="hidden font-body text-[1rem] text-white/72 md:block">{sessionStatus}</p>
        </div>

        <div className="flex items-center gap-3 text-white/72">
          <VolumeX className="size-5" />
          <ChevronDown className="size-4" />
          <UserCircle2 className="size-5" />
          <ChevronDown className="size-4" />
          <Grid2x2 className="size-5" />
          <Minimize2 className="size-5" />
        </div>
      </header>

      <div className="relative flex min-h-[calc(100vh-4.65rem)] flex-col bg-[#222222]">
        <StudentSeatStrip sessionId={sessionId} />
        <LessonBoard lesson={lesson} sessionStatus={sessionStatus} />

        <div className="pointer-events-none absolute bottom-7 left-5 hidden md:flex">
          <div className="flex size-9 items-center justify-center rounded-full bg-[#1b1b1b] text-sm font-bold text-white/85 shadow-[0_10px_24px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
            N
          </div>
        </div>

        <div className="absolute bottom-8 right-6 flex flex-col gap-4">
          <button
            className="flex size-16 items-center justify-center rounded-full bg-white/8 text-white/78 shadow-[0_18px_30px_rgba(0,0,0,0.22)] backdrop-blur-sm ring-1 ring-white/8 transition-colors hover:bg-white/12"
            type="button"
          >
            <UsersRound className="size-7" />
          </button>
          <button
            className="flex size-16 items-center justify-center rounded-full bg-white/8 text-white/78 shadow-[0_18px_30px_rgba(0,0,0,0.22)] backdrop-blur-sm ring-1 ring-white/8 transition-colors hover:bg-white/12"
            type="button"
          >
            <MicOff className="size-7" />
          </button>
          <button
            className="flex size-16 items-center justify-center rounded-full bg-white/8 text-white/78 shadow-[0_18px_30px_rgba(0,0,0,0.22)] backdrop-blur-sm ring-1 ring-white/8 transition-colors hover:bg-white/12"
            type="button"
          >
            <Volume2 className="size-7" />
          </button>
        </div>
      </div>
    </main>
  );
}
