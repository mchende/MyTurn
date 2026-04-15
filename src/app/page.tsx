export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-4xl rounded-[var(--radius-panel)] border border-black/5 bg-white/80 p-10 shadow-[0_24px_60px_rgba(17,24,39,0.08)] backdrop-blur">
        <p className="font-display text-4xl font-bold tracking-tight text-classroom-ink">
          MyTurn classroom shell
        </p>
        <p className="mt-4 max-w-2xl text-base leading-7 text-classroom-ink/72">
          Phase 1 scaffolding is in place. The classroom schedule and entry flow will be
          added in the following plans.
        </p>
      </section>
    </main>
  );
}
