import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/e2e',
  use: {
    baseURL: 'http://127.0.0.1:3201',
    channel: 'chrome',
  },
  webServer: {
    command: 'npx next dev --hostname 127.0.0.1 --port 3201',
    env: {
      ...process.env,
      MYTURN_FIXED_NOW: '2026-04-15T13:57:00+08:00',
    },
    timeout: 120_000,
    port: 3201,
    reuseExistingServer: false,
  },
});
