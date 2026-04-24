import { expect, test } from '@playwright/test';

import {
  installFakeBrowserAudio,
  queueFakeRecognitionResult,
} from './helpers/fake-browser-audio';

test.setTimeout(60_000);

test.beforeEach(async ({ context, page }) => {
  await installFakeBrowserAudio(page, context);
});

test('preflight checks pass before the classroom shell appears', async ({ page }) => {
  await page.goto('/lesson/weekday-1700', { waitUntil: 'domcontentloaded' });

  await expect(page.getByTestId('audio-preflight-card')).toBeVisible();
  await expect(page.getByText("Let's check your audio.")).toBeVisible();

  await page.getByTestId('preflight-speaker-check').click();
  await page.getByTestId('preflight-microphone-check').click();

  await expect(page.getByTestId('audio-preflight-card')).toBeHidden();
  await expect(page.getByText('Cora 老师')).toBeVisible();
  await expect(page.getByTestId('teacher-audio-status')).toBeVisible();
  await expect(page.getByTestId('classroom-stage')).toBeVisible();
});

test('classroom can pass preflight, finish repeat recognition, and enter picture-talk with fake browser audio', async ({
  page,
}) => {
  await page.goto('/lesson/weekday-1700', { waitUntil: 'domcontentloaded' });

  await page.getByTestId('preflight-speaker-check').click();
  await page.getByTestId('preflight-microphone-check').click();

  await expect(page.getByText('Cora 老师')).toBeVisible();
  await expect(page.getByTestId('teacher-audio-status')).toBeVisible();

  for (const transcript of ['apple', 'banana', 'cat', 'dog', 'sun']) {
    await expect
      .poll(async () => page.getByRole('button', { name: 'Tap to talk' }).isVisible(), {
        timeout: 10_000,
      })
      .toBe(true);

    await queueFakeRecognitionResult(page, { transcript });
    await page.getByRole('button', { name: 'Tap to talk' }).click();
    await page.getByRole('button', { name: 'Listening... tap again' }).click();
  }

  await expect(page.getByText('Picture talk · 1/5')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tap to talk' })).toBeVisible();

  await queueFakeRecognitionResult(page, { transcript: 'red apple' });
  await page.getByRole('button', { name: 'Tap to talk' }).click();
  await page.getByRole('button', { name: 'Listening... tap again' }).click();

  await expect(page.getByText('Nice answer.')).toBeVisible();
  await expect(page.getByTestId('classroom-stage')).toBeVisible();
  await expect(page.getByTestId('classroom-side-panels')).toBeVisible();
  await expect(page.getByTestId('audio-preflight-card')).toBeHidden();
});

test('repeat recognition empty results return to teacher-led retry without exposing tool copy', async ({
  page,
}) => {
  await page.goto('/lesson/weekday-1700', { waitUntil: 'domcontentloaded' });

  await page.getByTestId('preflight-skip-button').click();

  await expect
    .poll(async () => page.getByRole('button', { name: 'Tap to talk' }).isVisible(), {
      timeout: 10_000,
    })
    .toBe(true);

  await queueFakeRecognitionResult(page, { transcript: null, reason: 'empty' });
  await page.getByRole('button', { name: 'Tap to talk' }).click();
  await page.getByRole('button', { name: 'Listening... tap again' }).click();

  await expect(page.getByText('Say it with me. Nice and slow.')).toBeVisible();
  await expect(page.getByTestId('podium-status')).not.toContainText(/empty|timeout|provider/i);
  await expect(page.getByRole('button', { name: 'Tap to talk' })).toBeVisible();
});
