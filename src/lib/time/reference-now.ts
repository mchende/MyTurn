const DEFAULT_DEMO_NOW = '2026-04-15T16:57:15+08:00';

export function getReferenceNow() {
  return new Date(process.env.MYTURN_FIXED_NOW ?? DEFAULT_DEMO_NOW);
}
