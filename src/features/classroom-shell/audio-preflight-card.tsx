type AudioPreflightCardProps = {
  message?: string | null;
  microphoneReady: boolean;
  onCheckMicrophone: () => Promise<void>;
  onCheckSpeaker: () => Promise<void>;
  onSkip: () => void;
  speakerReady: boolean;
};

export function AudioPreflightCard({
  message = null,
  microphoneReady,
  onCheckMicrophone,
  onCheckSpeaker,
  onSkip,
  speakerReady,
}: AudioPreflightCardProps) {
  return (
    <section
      className="mx-auto flex w-full max-w-3xl flex-col gap-5 rounded-[36px] border border-white/10 bg-slate-900/88 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.32)] backdrop-blur-xl sm:p-8"
      data-testid="audio-preflight-card"
    >
      <div className="space-y-2 text-center">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300/80">
          Before class
        </p>
        <h2 className="text-3xl font-black tracking-[-0.06em] text-white">
          Let&apos;s check your audio.
        </h2>
        <p className="mx-auto max-w-2xl text-sm leading-6 text-white/72">
          Hear Cora once, then make sure your microphone is ready. You can still
          skip this and keep going.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          className="rounded-[28px] border border-emerald-300/30 bg-emerald-400/12 px-5 py-5 text-left transition hover:bg-emerald-400/18"
          data-testid="preflight-speaker-check"
          onClick={() => void onCheckSpeaker()}
          type="button"
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200/80">
            Speaker
          </p>
          <p className="mt-3 text-xl font-black tracking-[-0.04em] text-white">
            Play Cora&apos;s voice
          </p>
          <p className="mt-2 text-sm text-white/70">
            {speakerReady ? 'Ready to hear class audio.' : 'Tap once to hear Cora.'}
          </p>
        </button>

        <button
          className="rounded-[28px] border border-white/12 bg-white/6 px-5 py-5 text-left transition hover:bg-white/10"
          data-testid="preflight-microphone-check"
          onClick={() => void onCheckMicrophone()}
          type="button"
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-200/80">
            Microphone
          </p>
          <p className="mt-3 text-xl font-black tracking-[-0.04em] text-white">
            Check my microphone
          </p>
          <p className="mt-2 text-sm text-white/70">
            {microphoneReady ? 'Microphone looks ready.' : 'We will only ask for voice access.'}
          </p>
        </button>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 text-sm leading-6 text-white/72">
        If you skip this step, class can still start, but sound or recording may
        not work smoothly.
      </div>

      {message ? (
        <div
          className="rounded-[24px] border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-50/90"
          data-testid="audio-preflight-message"
        >
          {message}
        </div>
      ) : null}

      <div className="flex justify-center">
        <button
          className="rounded-full border border-white/14 px-5 py-2.5 text-sm font-black text-white/82 transition hover:bg-white/8"
          data-testid="preflight-skip-button"
          onClick={onSkip}
          type="button"
        >
          Skip for now
        </button>
      </div>
    </section>
  );
}
