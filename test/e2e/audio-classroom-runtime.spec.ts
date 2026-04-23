import { expect, test } from '@playwright/test';

import { installFakeBrowserAudio } from './helpers/fake-browser-audio';

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

test('classroom runs through teacher playback and one recording CTA with skip fallback available', async ({
  page,
}) => {
  await page.goto('/lesson/weekday-1700', { waitUntil: 'domcontentloaded' });

  await page.getByTestId('preflight-skip-button').click();

  await expect(page.getByTestId('classroom-audio-warning')).toContainText(
    'Audio check skipped',
  );
  await expect(page.getByText('Cora 老师')).toBeVisible();
  await expect(page.getByTestId('teacher-audio-status')).toBeVisible();

  await expect
    .poll(async () => page.getByTestId('seat-ai').getAttribute('data-on-stage'))
    .toBe('true');

  await expect
    .poll(async () => page.getByRole('button', { name: 'Tap to talk' }).isVisible())
    .toBe(true);

  await page.getByRole('button', { name: 'Tap to talk' }).click();
  await expect(page.getByTestId('podium-primary-action')).toBeVisible();
  await expect(page.getByTestId('podium-status')).toContainText('Tap to talk');
  await expect(page.getByTestId('classroom-stage')).toBeVisible();
  await expect(page.getByTestId('classroom-side-panels')).toBeVisible();
  await expect(page.getByTestId('audio-preflight-card')).toBeHidden();
});
