import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    channel: 'chrome',
  },
  webServer: {
    command: 'npx next dev --hostname localhost --port 3000',
    env: {
      ...process.env,
      MYTURN_FIXED_NOW: '2026-04-15T16:57:15+08:00',
    },
    timeout: 120_000,
    port: 3000,
    reuseExistingServer: true,
  },
});
