'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

type EntryCountdownProps = {
  startsAt: string;
  initialLabel: string;
  className?: string;
};

export function EntryCountdown({
  startsAt,
  initialLabel,
  className,
}: EntryCountdownProps) {
  const [label, setLabel] = useState(initialLabel);

  useEffect(() => {
    const targetMs = new Date(startsAt).getTime();

    const updateLabel = () => {
      const remainingMs = targetMs - Date.now();

      if (remainingMs <= 0) {
        setLabel('距开场 00:00');
        return;
      }

      const totalSeconds = Math.floor(remainingMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const parts =
        hours > 0
          ? [hours, minutes, seconds].map((value) => String(value).padStart(2, '0'))
          : [minutes, seconds].map((value) => String(value).padStart(2, '0'));

      setLabel(`距开场 ${parts.join(':')}`);
    };

    updateLabel();
    const timer = window.setInterval(updateLabel, 1000);

    return () => window.clearInterval(timer);
  }, [startsAt]);

  return (
    <span className={cn('inline-flex min-w-[8ch] justify-end tabular-nums', className)}>
      {label}
    </span>
  );
}
